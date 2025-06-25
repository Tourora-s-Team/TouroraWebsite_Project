const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TourBookingSchema = new Schema(
  {
    tourId: {
      // Đổi tên từ IdTour để đồng nhất với frontend
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour", // Liên kết tới model Tour
      required: true,
    },
    userId: {
      // Đổi tên từ User, giả định là ID người dùng đã đăng nhập
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Liên kết tới model User
      // required: true, // Thêm 'required: true' nếu booking luôn yêu cầu người dùng đăng nhập
      // Nếu không, bạn có thể đặt là false hoặc bỏ qua nếu cho phép khách đặt tour mà không cần đăng nhập
    },
    // Thay thế HoTen, email, dien_thoai, ngay_khoi_hanh, nguoi_lon, tre_em, tre_so_sinh
    // bằng mảng travelers để lưu thông tin chi tiết từng người
    travelers: [
      {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, match: /.+\@.+\..+/ },
        phone: { type: String }, // Không bắt buộc ở frontend, nên không bắt buộc ở backend
        dateOfBirth: { type: Date, required: true },
        nationality: { type: String },
        dietaryRequirements: { type: String },
      },
    ],
    startDate: {
      // Đổi tên từ ngay_khoi_hanh
      type: Date,
      required: true,
    },
    specialRequests: {
      // Đổi tên từ yeu_cau_dac_biet
      type: String,
      default: "",
    },
    totalPrice: {
      // Thêm trường tổng giá
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      // Phương thức thanh toán (tiền mặt/thẻ)
      type: String,
      enum: ["cash", "card"],
      required: true,
    },
    cardDetails: {
      // Thông tin thẻ tín dụng (chỉ lưu nếu paymentMethod là 'card' và bạn tự xử lý, NÊN DÙNG CỔNG THANH TOÁN)
      cardNumber: { type: String },
      expiryDate: { type: String },
      cvv: { type: String },
      cardholderName: { type: String },
    },
    status: {
      // Trạng thái đặt tour (ví dụ: Confirmed, Pending, Cancelled)
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
      default: "Pending",
    },
  },
  {
    timestamps: true, // Thêm createdAt và updatedAt
    collection: "tourbookings",
  }
);

module.exports = mongoose.model("TourBooking", TourBookingSchema);
