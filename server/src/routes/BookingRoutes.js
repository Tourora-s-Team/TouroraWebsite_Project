// routes/BookingRoutes.js
const express = require("express");
const router = express.Router();
const TourBooking = require("../models/BookingTour"); // Đã sửa tên file
const Tour = require("../models/Tour"); // Vẫn cần model Tour để lấy thông tin tour

// @route   POST /api/bookings
// @desc    Tạo một bản đặt tour mới với cấu trúc dữ liệu chi tiết
// @access  Public (hoặc Private nếu yêu cầu xác thực người dùng)
router.post("/", async (req, res) => {
  const {
    tourId,
    userId, // Có thể là undefined nếu không yêu cầu user đăng nhập
    travelers,
    startDate,
    specialRequests,
    paymentMethod,
    cardDetails, // Chỉ gửi nếu paymentMethod là 'card'
  } = req.body;

  // 1. Xác thực dữ liệu đầu vào cơ bản
  if (
    !tourId ||
    !travelers ||
    travelers.length === 0 ||
    !startDate ||
    !paymentMethod
  ) {
    return res.status(400).json({
      msg: "Vui lòng cung cấp đầy đủ thông tin bắt buộc: ID Tour, thông tin khách hàng, ngày khởi hành, và phương thức thanh toán.",
    });
  }

  // Xác thực thông tin từng khách trong mảng travelers
  for (const traveler of travelers) {
    if (
      !traveler.firstName ||
      !traveler.lastName ||
      !traveler.email ||
      !traveler.dateOfBirth
    ) {
      return res.status(400).json({
        msg: "Thông tin mỗi khách hàng (Họ, Tên, Email, Ngày sinh) là bắt buộc.",
      });
    }
    // Bạn có thể thêm regex check email ở đây nếu muốn kiểm tra kỹ hơn trước khi tạo booking
    if (!/.+\@.+\..+/.test(traveler.email)) {
      return res
        .status(400)
        .json({ msg: `Địa chỉ email không hợp lệ: ${traveler.email}` });
    }
  }

  try {
    // 2. Tìm tour trong database để lấy thông tin chi tiết và tính tổng giá
    const tour = await Tour.findById(tourId);

    if (!tour) {
      return res
        .status(404)
        .json({ msg: "Không tìm thấy tour với ID đã cung cấp." });
    }

    // 3. Tính tổng giá dựa trên giá tour và số lượng người
    // Lưu ý: tour.price * travelers.length giả định giá là cho mỗi người.
    // Nếu giá tour là cố định cho cả nhóm, bạn cần điều chỉnh logic này.
    const totalPrice = tour.price * travelers.length;

    // 4. Tạo một đối tượng TourBooking mới
    const newTourBooking = new TourBooking({
      tourId,
      userId: userId || null, // Nếu userId không có, gán null hoặc undefined tùy theo schema
      travelers,
      startDate: new Date(startDate), // Đảm bảo startDate là đối tượng Date
      specialRequests,
      totalPrice,
      paymentMethod,
      cardDetails: paymentMethod === "card" ? cardDetails : undefined, // Chỉ lưu nếu paymentMethod là 'card'
      status: "Pending", // Mặc định là 'Pending'
    });

    // 5. Lưu booking vào database
    const savedTourBooking = await newTourBooking.save();

    // 6. Phản hồi về frontend
    res.status(201).json({
      msg: "Đặt tour thành công!",
      booking: savedTourBooking,
    });
  } catch (err) {
    console.error("Lỗi khi tạo booking:", err.message);
    // Xử lý lỗi validation từ Mongoose
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((el) => el.message);
      return res
        .status(400)
        .json({ msg: `Dữ liệu không hợp lệ: ${errors.join(", ")}` });
    }
    res.status(500).send("Lỗi Server: Không thể đặt tour. Vui lòng thử lại.");
  }
});

// @route   GET /api/bookings
// @desc    Lấy tất cả các booking (Chỉ dùng cho Admin/Quản lý)
// @access  Private (Cần middleware xác thực và phân quyền)
router.get("/", async (req, res) => {
  try {
    // Sử dụng populate để lấy thông tin chi tiết của tour và user
    const bookings = await TourBooking.find()
      .populate("tourId", "title location price") // Lấy title, location, price của tour
      .populate("userId", "username email"); // Lấy username, email của user (nếu có)
    res.json(bookings);
  } catch (err) {
    console.error("Lỗi khi lấy bookings:", err.message);
    res.status(500).send("Lỗi Server: Không thể lấy danh sách booking.");
  }
});

// Các API khác cho booking (ví dụ: get booking by ID, update status, delete booking) có thể thêm ở đây
// Ví dụ: Lấy booking theo User ID (cho trang "My Bookings" của người dùng)
router.get("/user/:userId", async (req, res) => {
  try {
    const bookings = await TourBooking.find({
      userId: req.params.userId,
    }).populate("tourId", "title location image price");
    res.json(bookings);
  } catch (err) {
    console.error("Lỗi khi lấy booking theo userId:", err.message);
    res.status(500).send("Lỗi Server.");
  }
});

// Ví dụ: Cập nhật trạng thái booking (Chỉ Admin)
router.patch("/:bookingId/status", async (req, res) => {
  // Cần middleware xác thực admin ở đây
  try {
    const { status } = req.body;
    const updatedBooking = await TourBooking.findByIdAndUpdate(
      req.params.bookingId,
      { status },
      { new: true, runValidators: true }
    );
    if (!updatedBooking) {
      return res.status(404).json({ msg: "Không tìm thấy booking." });
    }
    res.json({
      msg: "Cập nhật trạng thái thành công",
      booking: updatedBooking,
    });
  } catch (err) {
    console.error("Lỗi khi cập nhật trạng thái booking:", err.message);
    res.status(500).send("Lỗi Server.");
  }
});

module.exports = router;
