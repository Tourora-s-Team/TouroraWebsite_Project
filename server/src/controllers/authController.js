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
    await account.save();

    // Tạo bản ghi User liên kết theo username
    const user = new User({
      username,
      fullname,
      dateOfBirth,
      phoneNumber: phone,
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

    // Tạo token
    const token = jwt.sign(
      {
        userId: account._id,
        username: account.username,
        role: account.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Tìm user thông tin cá nhân
    const user = await User.findOne({ username });

    if (!user) {
      return res.json({ success: false, message: "Không tìm thấy thông tin người dùng" });
    }

    // Trả về dữ liệu đầy đủ
    return res.json({
      success: true,
      token,
      account: {
        username: account.username,
        role: account.role,
      },
      user: {
        fullname: user.fullname,
        email: user.email,
        numberPhone: user.phoneNumber,
        dateOfBirth: user.dateOfBirth,
      }
    });

  } catch (err) {
    console.error("Lỗi login:", err);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};


module.exports = { registerUser, loginUser };
