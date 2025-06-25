import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styles from "./Information.css";

const tourOptions = [
  "Tour Hạ Long Bay - Sapa 4N3Đ",
  "Khám phá Phú Quốc - Thiên đường biển",
  "Hội An - Huế - Động Phong Nha",
  "Maldives - Thiên đường biển xanh",
  "Nhật Bản - Mùa hoa anh đào",
  "Đà Lạt - Thành phố ngàn hoa",
];

const InformationTour = ({ onBack }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedTour = location.state?.tour;

  const [formData, setFormData] = useState({
    tourName: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    departureDate: "",
    adults: 1,
    children: 0,
    infants: 0,
    roomType: "standard",
    specialRequests: "",
    emergencyContact: "",
    emergencyPhone: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill tour name if a tour was selected or from URL
  useEffect(() => {
    if (selectedTour) {
      setFormData((prev) => ({
        ...prev,
        tourName: selectedTour.title,
      }));
    } else if (id) {
      const idx = parseInt(id, 10) - 1;
      if (tourOptions[idx]) {
        setFormData((prev) => ({
          ...prev,
          tourName: tourOptions[idx],
        }));
      }
    }
  }, [selectedTour, id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.tourName.trim()) newErrors.tourName = "Vui lòng chọn tour";
    if (!formData.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ tên";
    if (!formData.email.trim()) newErrors.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email không hợp lệ";
    if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, "")))
      newErrors.phone = "Số điện thoại không hợp lệ";
    if (!formData.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ";
    if (!formData.departureDate)
      newErrors.departureDate = "Vui lòng chọn ngày khởi hành";
    if (!formData.emergencyContact.trim())
      newErrors.emergencyContact = "Vui lòng nhập người liên hệ khẩn cấp";
    if (!formData.emergencyPhone.trim())
      newErrors.emergencyPhone = "Vui lòng nhập số điện thoại khẩn cấp";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    // Thêm MaTour từ selectedTour vào dữ liệu gửi lên server
    const dataToSend = {
      ...formData,
      MaTour: selectedTour?.MaTour || selectedTour?.id || "", // tuỳ tên trường của tour, thường là MaTour hoặc id
    };

    fetch("/api/tours/create-tour", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    })
      .then((res) => res.text())
      .then((msg) => {
        alert(msg);
        setIsSubmitting(false);
        if (onBack) onBack();
        else navigate("/book-tour");
      })
      .catch(() => {
        alert("Đặt tour thất bại!");
        setIsSubmitting(false);
      });
  };

  const totalPeople =
    Number(formData.adults) +
    Number(formData.children) +
    Number(formData.infants);

  console.log("selectedTour", selectedTour);

  return (
    <div className="booking-form-container">
      <div className="booking-header">
        {/* Nút back luôn hiển thị */}
        <button
          onClick={() => {
            if (onBack) onBack();
            else navigate(-1);
          }}
          className="back-button"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "#e0e7ef",
            border: "none",
            borderRadius: 6,
            padding: "6px 16px",
            marginBottom: 16,
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="m19 12-7 7-7-7" />
          </svg>
          Quay lại
        </button>
        <h1>Thông Tin Đặt Tour</h1>
        <p>Vui lòng điền đầy đủ thông tin để hoàn tất việc đặt tour</p>
        {selectedTour && (
          <div
            className="selected-tour-info"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              background: "rgba(255,255,255,0.12)",
              borderRadius: 16,
              padding: "18px 24px",
              margin: "0 auto 16px auto",
              maxWidth: 800,
              boxShadow: "0 2px 12px #e0e7ef",
            }}
          >
            <img
              src={selectedTour.image}
              alt={selectedTour.title}
              style={{
                width: 200,
                height: 130,
                objectFit: "cover",
                borderRadius: 10,
                marginRight: 18,
              }}
            />
            <div>
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  margin: 0,
                  color: "#fff",
                }}
              >
                {selectedTour.title}
              </h3>
              <p style={{ color: "#e0e7ef", margin: "6px 0 8px 0" }}>
                {selectedTour.location}
                {selectedTour.date && <> • {selectedTour.date}</>}
              </p>
              <span style={{ color: "#ffc107", fontWeight: 700, fontSize: 20 }}>
                {selectedTour.price}đ
              </span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        {/* Tour Selection */}
        <div className="form-section">
          <h2>Thông Tin Đặt Tour</h2>

          <div className="form-group">
            <label htmlFor="departureDate">Ngày khởi hành *</label>
            <input
              type="date"
              id="departureDate"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleInputChange}
              className={errors.departureDate ? "error" : ""}
            />
            {errors.departureDate && (
              <span className="error-message">{errors.departureDate}</span>
            )}
          </div>
        </div>

        {/* Personal Information */}
        <div className="form-section">
          <h2>Thông Tin Cá Nhân</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName">Họ và tên *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Nguyễn Văn A"
                className={errors.fullName ? "error" : ""}
              />
              {errors.fullName && (
                <span className="error-message">{errors.fullName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@email.com"
                className={errors.email ? "error" : ""}
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Số điện thoại *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="0123456789"
                className={errors.phone ? "error" : ""}
              />
              {errors.phone && (
                <span className="error-message">{errors.phone}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="address">Địa chỉ *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Số nhà, đường, quận/huyện, tỉnh/thành phố"
                className={errors.address ? "error" : ""}
              />
              {errors.address && (
                <span className="error-message">{errors.address}</span>
              )}
            </div>
          </div>
        </div>

        {/* Group Information */}
        <div className="form-section">
          <h2>Thông Tin Nhóm</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="adults">Người lớn (12+ tuổi)</label>
              <select
                id="adults"
                name="adults"
                value={formData.adults}
                onChange={handleInputChange}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num} người
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="children">Trẻ em (2-11 tuổi)</label>
              <select
                id="children"
                name="children"
                value={formData.children}
                onChange={handleInputChange}
              >
                {[0, 1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} trẻ
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="infants">Em bé (dưới 2 tuổi)</label>
              <select
                id="infants"
                name="infants"
                value={formData.infants}
                onChange={handleInputChange}
              >
                {[0, 1, 2, 3].map((num) => (
                  <option key={num} value={num}>
                    {num} em bé
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="total-people">
            <strong>Tổng số người: {totalPeople}</strong>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="form-section">
          <h2>Liên Hệ Khẩn Cấp</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="emergencyContact">Họ tên người liên hệ *</label>
              <input
                type="text"
                id="emergencyContact"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleInputChange}
                placeholder="Người thân hoặc bạn bè"
                className={errors.emergencyContact ? "error" : ""}
              />
              {errors.emergencyContact && (
                <span className="error-message">{errors.emergencyContact}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="emergencyPhone">Số điện thoại khẩn cấp *</label>
              <input
                type="tel"
                id="emergencyPhone"
                name="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={handleInputChange}
                placeholder="0123456789"
                className={errors.emergencyPhone ? "error" : ""}
              />
              {errors.emergencyPhone && (
                <span className="error-message">{errors.emergencyPhone}</span>
              )}
            </div>
          </div>
        </div>

        {/* Special Requests */}
        <div className="form-section">
          <h2>Yêu Cầu Đặc Biệt</h2>
          <div className="form-group">
            <label htmlFor="specialRequests">
              Ghi chú thêm (không bắt buộc)
            </label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleInputChange}
              placeholder="Ví dụ: Ăn chay, dị ứng thực phẩm, yêu cầu phòng liền kề..."
              rows={4}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Đang xử lý..." : "Đặt Tour Ngay"}
          </button>
          <p className="form-note">
            Bằng việc đặt tour, bạn đồng ý với{" "}
            <a href="#">điều khoản sử dụng</a> và{" "}
            <a href="#">chính sách bảo mật</a> của chúng tôi.
          </p>
        </div>
      </form>
    </div>
  );
};

export default InformationTour;
