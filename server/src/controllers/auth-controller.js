const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Account = require("../models/Account");

const registerUser = async (req, res) => {
  try {
    const { username, fullname, dateOfBirth, phone, email, password } = req.body;

    // Kiểm tra username đã tồn tại trong Account chưa
    const existingAccount = await Account.findOne({ username });
    if (existingAccount)
      return res.json({ success: false, message: "Username đã tồn tại" });

    // Mã hoá mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo bản ghi Account
    const account = new Account({
      username,
      password: hashedPassword,
      role: "user", // hoặc req.body.role nếu cần
    });
    await account.save();    // Tạo bản ghi User liên kết theo username
    const user = new User({
      username,
      fullname,
      dateOfBirth,
      numberPhone: phone, // Updated to match model
      email,
      paymentInfo: {
        cardNumber: "0000000000000000",
        paymentType: "visa",
      },
    });
    await user.save();

    return res.json({ success: true, message: "Đăng ký thành công!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Tìm account theo username
    const account = await Account.findOne({ username });
    if (!account)
      return res.json({ success: false, message: "Tài khoản không tồn tại" });

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch)
      return res.json({ success: false, message: "Sai mật khẩu" });

    // Tìm business partner nếu là tài khoản business
    const BusinessPartner = require("../models/BussinessPartner");
    const businessPartner = await BusinessPartner.findOne({ account_id: account._id });

    // Tạo token
    const token = jwt.sign(
      {
        userId: account._id,
        username: account.username,
        role: account.role,
        businessPartnerId: businessPartner?._id || null
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Tìm user thông tin cá nhân
    const user = await User.findOne({ username });

    if (!user) {
      return res.json({ success: false, message: "Không tìm thấy thông tin người dùng" });
    }    // Trả về dữ liệu đầy đủ
    return res.json({
      success: true,
      token,
      account: {
        username: account.username,
        role: account.role,
      },
      businessPartner: businessPartner ? {
        id: businessPartner._id,
        companyName: businessPartner.company_name,
        country: businessPartner.country,
        states: businessPartner.states
      } : null,
      user: {
        fullname: user.fullname,
        email: user.email,
        numberPhone: user.numberPhone, // Updated to match model
        dateOfBirth: user.dateOfBirth,
        nationality: user.nationality,
        address: user.address,
        gender: user.gender,
        driverLicense: user.getDriverLicenseInfo(),
        emergencyContact: user.getEmergencyContactInfo(),
        hasValidDriverLicense: user.hasValidDriverLicense()
      }
    });

  } catch (err) {
    console.error("Lỗi login:", err);    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Update user profile information
const updateUserProfile = async (req, res) => {
  try {
    const { username } = req.user; // from JWT token
    const {
      fullname,
      email,
      numberPhone,
      dateOfBirth,
      nationality,
      address,
      gender,
      driverLicense,
      emergencyContact,
      preferences
    } = req.body;

    // Find and update user
    const updateData = {};
    
    if (fullname !== undefined) updateData.fullname = fullname;
    if (email !== undefined) updateData.email = email;
    if (numberPhone !== undefined) updateData.numberPhone = numberPhone;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
    if (nationality !== undefined) updateData.nationality = nationality;
    if (address !== undefined) updateData.address = address;
    if (gender !== undefined) updateData.gender = gender;
    if (preferences !== undefined) updateData.preferences = preferences;
    
    // Handle driver license update
    if (driverLicense !== undefined) {
      updateData.driverLicense = {
        number: driverLicense.number || '',
        issueDate: driverLicense.issueDate ? new Date(driverLicense.issueDate) : null,
        expiryDate: driverLicense.expiryDate ? new Date(driverLicense.expiryDate) : null,
        issuingCountry: driverLicense.issuingCountry || 'Vietnam',
        class: driverLicense.class || ''
      };
    }
    
    // Handle emergency contact update
    if (emergencyContact !== undefined) {
      updateData.emergencyContact = {
        name: emergencyContact.name || '',
        phone: emergencyContact.phone || '',
        relationship: emergencyContact.relationship || ''
      };
    }

    const updatedUser = await User.findOneAndUpdate(
      { username },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.json({ success: false, message: "Không tìm thấy người dùng" });
    }

    // Return updated user info
    return res.json({
      success: true,
      message: "Cập nhật thông tin thành công",
      user: {
        fullname: updatedUser.fullname,
        email: updatedUser.email,
        numberPhone: updatedUser.numberPhone,
        dateOfBirth: updatedUser.dateOfBirth,
        nationality: updatedUser.nationality,
        address: updatedUser.address,
        gender: updatedUser.gender,
        driverLicense: updatedUser.getDriverLicenseInfo(),
        emergencyContact: updatedUser.getEmergencyContactInfo(),
        hasValidDriverLicense: updatedUser.hasValidDriverLicense(),
        preferences: updatedUser.preferences
      }
    });

  } catch (err) {
    console.error("Lỗi cập nhật user:", err);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Get current user profile
const getUserProfile = async (req, res) => {
  try {
    const { username } = req.user; // from JWT token

    const user = await User.findOne({ username });
    
    if (!user) {
      return res.json({ success: false, message: "Không tìm thấy người dùng" });
    }

    return res.json({
      success: true,
      user: {
        fullname: user.fullname,
        email: user.email,
        numberPhone: user.numberPhone,
        dateOfBirth: user.dateOfBirth,
        nationality: user.nationality,
        address: user.address,
        gender: user.gender,
        driverLicense: user.getDriverLicenseInfo(),
        emergencyContact: user.getEmergencyContactInfo(),
        hasValidDriverLicense: user.hasValidDriverLicense(),
        preferences: user.preferences
      }
    });

  } catch (err) {
    console.error("Lỗi lấy thông tin user:", err);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Thêm function verify token
const verifyToken = async (req, res) => {
  try {
    // Token đã được verify ở middleware, req.user chứa thông tin user
    const account = await Account.findOne({ username: req.user.username });
    if (!account) {
      return res.status(404).json({ success: false, message: "Account not found" });
    }

    const user = await User.findOne({ username: req.user.username });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      user: {
        username: user.username,
        full_name: user.fullname,
        email: user.email,
        role: account.role
      }
    });
  } catch (error) {
    console.error('Verify token error:', error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { registerUser, loginUser, updateUserProfile, getUserProfile, verifyToken };
