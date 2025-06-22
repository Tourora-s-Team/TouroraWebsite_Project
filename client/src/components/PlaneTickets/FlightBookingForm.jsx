import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./FlightBookingForm.module.css";
import PaymentForm from "../Payment/PaymentForm";

const FlightBookingForm = () => {
  const location = useLocation();
  const { flight } = location.state || {};

  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    phone: "",
    email: "",
    countryCode: "+84",
  });

  const [passengerInfo, setPassengerInfo] = useState({
    type: "adult",
    gender: "male",
    dob: { day: "", month: "", year: "" },
    lastName: "",
    firstName: "",
    nationality: "",
    passportNumber: "",
    passportCountry: "",
    passportExpiry: { day: "", month: "", year: "" },
  });

  const [paymentInfo, setPaymentInfo] = useState({
    method: "credit",
    creditCardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    momoPhone: "",
    zaloPhone: "",
  });

  // const [summaryVisible, setSummaryVisible] = useState(false);
  // const [submittedData, setSubmittedData] = useState(null);

  const handleConfirmBooking = async () => {
    const fullName = `${form.lastName} ${form.firstName}`;
    const dateOfBirth = `${passengerInfo.dob.year}-${passengerInfo.dob.month}-${passengerInfo.dob.day}`;
    const passportExpiry = `${passengerInfo.passportExpiry.year}-${passengerInfo.passportExpiry.month}-${passengerInfo.passportExpiry.day}`;

    const payload = {
      bookingCode: `BK${Date.now()}`,
      userId: "user_id_here",
      flightId: flight?._id,
      passengers: [
        {
          fullName,
          gender: passengerInfo.gender,
          dateOfBirth,
          nationality: passengerInfo.nationality,
          passportNumber: passengerInfo.passportNumber,
          passportExpiry,
          seat: null,
          specialRequest: "",
          addons: [],
          type: passengerInfo.type,
          phone: form.phone,
          email: form.email,
        },
      ],
      paymentMethod: paymentInfo.method,
      paymentInfo: paymentInfo,
      totalPrice: flight?.price?.economy || 0,
      status: "pending",
    };

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/booking-flight`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Gửi dữ liệu thất bại");
      const data = await res.json();
      alert("Đặt vé thành công!");
    } catch (error) {
      alert("Lỗi gửi dữ liệu: " + error.message);
    }
  };

  return (
    <div className={styles.container}>
      {/* Left Column */}
      <div className={styles.left}>
        <div className={styles.section}>
          <h3>Thông tin liên hệ (nhận vé/phiếu thanh toán)</h3>
          <div className={styles.loginNotice}>Đăng nhập với tên Trí Đào</div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Họ (vd: Nguyen)*</label>
              <input type="text" placeholder="Nguyen" />
              <small>như trên CMND (không dấu)</small>
            </div>
            <div className={styles.formGroup}>
              <label>Tên Đệm & Tên (vd: Thi Ngoc Anh)*</label>
              <input type="text" placeholder="Thi Ngoc Anh" />
              <small>như trên CMND (không dấu)</small>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Điện thoại di động*</label>
              <div className={styles.phoneInput}>
                <select defaultValue="+84">
                  <option value="+84">+84</option>
                  <option value="+1">+1</option>
                </select>
                <input type="tel" placeholder="901234567" />
              </div>
              <small>VD: +84 901234567</small>
            </div>
            <div className={styles.formGroup}>
              <label>Email*</label>
              <input type="email" placeholder="email@example.com" />
              <small>VD: email@example.com</small>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Thông tin hành khách</h3>
          <div className={styles.noticeBox}>
            <p>
              <b>⚠️ Vui lòng chú ý cho những điều sau đây:</b>
            </p>
            <p>
              Vì bạn đi du lịch/quá cảnh quốc tế, bạn phải nhập chính xác tên
              như trong hộ chiếu. <b>Nếu không</b>, hãng hàng không có thể không
              cho phép bạn lên máy bay hoặc tính thêm phí thay đổi tên.
            </p>

            <a href="#">Xem hướng dẫn nhập tên</a>
          </div>
          <div className={styles.passengerForm}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Loại hành khách*</label>
                <select required>
                  <option value="adult">Người lớn (&gt;=12 tuổi)</option>
                  <option value="child">Trẻ em (2-11 tuổi)</option>
                  <option value="infant">Em bé (&lt; 2 tuổi)</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Giới tính*</label>
                <select
                  required
                  value={passengerInfo.gender}
                  onChange={(e) =>
                    setPassengerInfo({
                      ...passengerInfo,
                      gender: e.target.value,
                    })
                  }
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Ngày sinh*</label>
                <div className={styles.dateGroup}>
                  <input
                    type="text"
                    placeholder="DD"
                    maxLength="2"
                    value={passengerInfo.dob.day}
                    onChange={(e) =>
                      setPassengerInfo({
                        ...passengerInfo,
                        dob: { ...passengerInfo.dob, day: e.target.value },
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="MM"
                    maxLength="2"
                    value={passengerInfo.dob.month}
                    onChange={(e) =>
                      setPassengerInfo({
                        ...passengerInfo,
                        dob: { ...passengerInfo.dob, month: e.target.value },
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="YYYY"
                    maxLength="4"
                    value={passengerInfo.dob.year}
                    onChange={(e) =>
                      setPassengerInfo({
                        ...passengerInfo,
                        dob: { ...passengerInfo.dob, year: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Họ*</label>
                <input
                  type="text"
                  placeholder="Nguyen"
                  value={passengerInfo.lastName}
                  onChange={(e) =>
                    setPassengerInfo({
                      ...passengerInfo,
                      lastName: e.target.value,
                    })
                  }
                />
                <small>như trên hộ chiếu (không dấu)</small>
              </div>
              <div className={styles.formGroup}>
                <label>Tên đệm & Tên*</label>
                <input
                  type="text"
                  placeholder="Thi Ngoc Anh"
                  value={passengerInfo.firstName}
                  onChange={(e) =>
                    setPassengerInfo({
                      ...passengerInfo,
                      firstName: e.target.value,
                    })
                  }
                />
                <small>như trên hộ chiếu (không dấu)</small>
              </div>
              <div className={styles.formGroup}>
                <label>Quốc tịch*</label>
                <select
                  required
                  value={passengerInfo.nationality}
                  onChange={(e) =>
                    setPassengerInfo({
                      ...passengerInfo,
                      nationality: e.target.value,
                    })
                  }
                >
                  <option value="">Chọn quốc tịch</option>
                  <option value="VN">Việt Nam</option>
                  <option value="US">Hoa Kỳ</option>
                </select>
              </div>
            </div>
            <h4>Thông tin hộ chiếu</h4>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Số hộ chiếu*</label>
                <input
                  type="text"
                  placeholder="Nhập số hộ chiếu"
                  required
                  value={passengerInfo.passportNumber}
                  onChange={(e) =>
                    setPassengerInfo({
                      ...passengerInfo,
                      passportNumber: e.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label>Quốc gia cấp*</label>
                <select
                  required
                  value={passengerInfo.passportCountry}
                  onChange={(e) =>
                    setPassengerInfo({
                      ...passengerInfo,
                      passportCountry: e.target.value,
                    })
                  }
                >
                  <option value="">Chọn quốc gia</option>
                  <option value="VN">Việt Nam</option>
                  <option value="US">Hoa Kỳ</option>
                  <option value="JP">Nhật Bản</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Ngày hết hạn*</label>
                <div className={styles.dateGroup}>
                  <input
                    type="text"
                    placeholder="DD"
                    maxLength="2"
                    value={passengerInfo.passportExpiry.day}
                    onChange={(e) =>
                      setPassengerInfo({
                        ...passengerInfo,
                        passportExpiry: {
                          ...passengerInfo.passportExpiry,
                          day: e.target.value,
                        },
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="MM"
                    maxLength="2"
                    value={passengerInfo.passportExpiry.month}
                    onChange={(e) =>
                      setPassengerInfo({
                        ...passengerInfo,
                        passportExpiry: {
                          ...passengerInfo.passportExpiry,
                          month: e.target.value,
                        },
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="YYYY"
                    maxLength="4"
                    value={passengerInfo.passportExpiry.year}
                    onChange={(e) =>
                      setPassengerInfo({
                        ...passengerInfo,
                        passportExpiry: {
                          ...passengerInfo.passportExpiry,
                          year: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <PaymentForm contactInfo={form} flight={flight} />
      </div>

      {/* Right Column */}
      <div className={styles.right}>
        <div className={styles.flightSummaryBox}>
          <div className={styles.header}>
            <h4>Tóm tắt chuyến bay</h4>
          </div>
          <div className={styles.flightCard}>
            <div className={styles.summaryRow}>
              {/* Điểm đi */}
              <div className={styles.summaryCol}>
                <div className={styles.cityIcon}>🛫</div>
                <div>
                  <div className={styles.cityName}>
                    {flight?.departure?.city}
                  </div>
                  <div className={styles.airportName}>
                    {flight?.departure?.airport}
                  </div>
                  <div className={styles.timeText}>
                    {flight?.departure?.date &&
                      new Date(flight.departure.date).toLocaleString()}
                  </div>
                </div>
              </div>
              {/* Mũi tên */}
              <div className={styles.arrowIcon}>→</div>
              {/* Điểm đến */}
              <div className={styles.summaryCol}>
                <div className={styles.cityIcon}>🛬</div>
                <div>
                  <div className={styles.cityName}>{flight?.arrival?.city}</div>
                  <div className={styles.airportName}>
                    {flight?.arrival?.airport}
                  </div>
                  <div className={styles.timeText}>
                    {flight?.arrival?.date &&
                      new Date(flight.arrival.date).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.totalBox}>
          <h4>Tóm tắt</h4>
          <div className={styles.totalPrice}>
            <span>Giá bạn trả</span>
            <strong>
              {flight?.price?.economy
                ? flight.price.economy.toLocaleString()
                : "0"}{" "}
              VND
            </strong>
          </div>
          <div className={styles.points}>
            <span>🎁 Earn 2.572 Points</span>
            <span>🌟 Kiếm 7.566 Sao Priority</span>
          </div>
        </div>
        <div className={styles.totalBox}>
          <h4>Thông tin hành khách</h4>
          <div>
            <strong>Họ tên:</strong> {passengerInfo.lastName}{" "}
            {passengerInfo.firstName}
          </div>
          <div>
            <strong>Giới tính:</strong> {passengerInfo.gender}
          </div>
          <div>
            <strong>Ngày sinh:</strong> {passengerInfo.dob.day}/
            {passengerInfo.dob.month}/{passengerInfo.dob.year}
          </div>
          <div>
            <strong>Quốc tịch:</strong> {passengerInfo.nationality}
          </div>
          <h4>Thông tin hộ chiếu</h4>
          <div>
            <strong>Số hộ chiếu:</strong> {passengerInfo.passportNumber}
          </div>
          <div>
            <strong>Quốc gia cấp:</strong> {passengerInfo.passportCountry}
          </div>
          <div>
            <strong>Ngày hết hạn:</strong> {passengerInfo.passportExpiry.day}/
            {passengerInfo.passportExpiry.month}/
            {passengerInfo.passportExpiry.year}
          </div>
          <h4>Thông tin thanh toán</h4>
          <div>
            <strong>Phương thức:</strong> {paymentInfo.method}
          </div>
          {paymentInfo.method === "credit" && (
            <>
              <div>
                <strong>Số thẻ:</strong> {paymentInfo.creditCardNumber}
              </div>
              <div>
                <strong>Chủ thẻ:</strong> {paymentInfo.cardHolder}
              </div>
              <div>
                <strong>Hết hạn:</strong> {paymentInfo.expiryDate}
              </div>
            </>
          )}
          {paymentInfo.method === "momo" && (
            <div>
              <strong>SĐT MoMo:</strong> {paymentInfo.momoPhone}
            </div>
          )}
          {paymentInfo.method === "zalopay" && (
            <div>
              <strong>SĐT ZaloPay:</strong> {paymentInfo.zaloPhone}
            </div>
          )}
          <button
            className={styles.confirmButton}
            onClick={handleConfirmBooking}
          >
            Xác nhận đặt vé
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightBookingForm;
