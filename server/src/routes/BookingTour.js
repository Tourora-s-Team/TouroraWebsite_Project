const express = require("express");
// Thư viện Express để tạo router

const sql = require("mssql");
// Thư viện mssql để kết nối SQL Server

const router = express.Router();
// Khởi tạo router của Express

const dbConfig = require("../../Database/Conn"); // Đường dẫn tới Conn.js
// Import cấu hình kết nối database

// Lấy danh sách tour từ database
router.get("/all-tours", async (req, res) => {
  try {
    // Kết nối DB
    await sql.connect(dbConfig);
    // Truy vấn lấy danh sách tour, loại bỏ khoảng trắng ở MaTour
    const result = await sql.query(`
      SELECT 
        RTRIM(MaTour) AS MaTour,
        TenTour AS title,
        DiaDiem AS location,
        Ngay AS date,
        DanhGia AS rating,
        GiaTour AS price,
        SoNguoi AS groupSize,
        AnhTour AS image
      FROM Tour
    `);
    // Trả về danh sách tour dạng JSON
    res.json(result.recordset);
  } catch (err) {
    // Nếu lỗi, log lỗi và trả về mã lỗi 500
    console.error("Lỗi lấy danh sách tour:", err);
    res.status(500).send("Lỗi lấy danh sách tour!");
  }
});

// Lưu thông tin đặt tour vào database
router.post("/create-tour", async (req, res) => {
  // Lấy dữ liệu từ body của request
  const {
    tourId,
    MaTour, // Có thể nhận cả tourId hoặc MaTour
    email,
    phone,
    address,
    departureDate,
    adults,
    children,
    infants,
    specialRequests,
    emergencyContact,
    emergencyPhone,
    fullName,
  } = req.body;

  const userId = "U001"; // Mã người dùng cố định

  const realTourId = tourId || MaTour; // Ưu tiên tourId, fallback sang MaTour

  // Ép kiểu số cho các trường số
  const phoneNumber = phone ? Number(phone) : null;
  const emergencyPhoneNumber = emergencyPhone ? Number(emergencyPhone) : null;

  // Kiểm tra dữ liệu đầu vào
  if (!realTourId) {
    console.error("Thiếu tourId:", req.body);
    return res.status(400).send("Thiếu mã tour (tourId)!");
  }
  if (!email || !phoneNumber || !address || !departureDate || !fullName) {
    console.error("Thiếu thông tin bắt buộc:", req.body);
    return res.status(400).send("Thiếu thông tin bắt buộc!");
  }

  try {
    await sql.connect(dbConfig);
    // Thực hiện insert dữ liệu đặt tour vào bảng ChiTietDatTour
    await sql.query`
      INSERT INTO ChiTietDatTour (
        MaTour, Id_User, email, dien_thoai, dia_chi, ngay_khoi_hanh,
        nguoi_lon, tre_em, tre_so_sinh, yeu_cau_dac_biet,
        lien_he_khan_cap, dien_thoai_khan_cap, HoTen
      ) VALUES (
        ${realTourId}, ${userId}, ${email}, ${phoneNumber}, ${address}, ${departureDate},
        ${adults}, ${children}, ${infants}, ${specialRequests},
        ${emergencyContact}, ${emergencyPhoneNumber}, ${fullName}
      )
    `;
    // Trả về thông báo thành công
    res.send("Đặt tour thành công!");
  } catch (err) {
    // Nếu lỗi, log lỗi chi tiết và trả về mã lỗi 500
    res.status(500).send("Lỗi đặt tour không thành công!");
    console.error("Lỗi đặt tour:", err);
  }
});

module.exports = router;
// Export router để sử dụng ở file index.js
