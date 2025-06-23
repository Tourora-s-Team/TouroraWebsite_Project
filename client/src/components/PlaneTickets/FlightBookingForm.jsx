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
    title: "Mr",
    type: "adult",
    gender: "male",
    dob: "",
    lastName: "",
    firstName: "",
    nationality: "",
    passportNumber: "",
    passportCountry: "",
    passportExpiry: "",
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

  const handleConfirmBooking = async () => {
    const bookingCode = `BK${Date.now()}`;
    const fullName = `${passengerInfo.lastName} ${passengerInfo.firstName}`;

    try {
      const bookingRes = await fetch(
        `${process.env.REACT_APP_API_URL}/api/booking-flight`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingCode,
            flightId: flight?._id,
            passengers: [
              {
                fullName,
                dateOfBirth: passengerInfo.dob,
                phone: form.phone,
                email: form.email,
                seatType: "economy",
              },
            ],
            totalPrice: flight?.price?.economy || 0,
            status: "pending",
          }),
        }
      );

      if (!bookingRes.ok) throw new Error("Tạo booking thất bại");
      const bookingData = await bookingRes.json();
      const bookingId = bookingData._id;

      const passengerRes = await fetch(
        `${process.env.REACT_APP_API_URL}/api/passenger`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId,
            fullName,
            gender: passengerInfo.gender,
            dateOfBirth: passengerInfo.dob,
            nationality: passengerInfo.nationality,
            passportNumber: passengerInfo.passportNumber,
            passportExpiry: passengerInfo.passportExpiry,
            type: passengerInfo.type,
            seat: null,
            specialRequest: "",
            addons: [],
          }),
        }
      );

      if (!passengerRes.ok) throw new Error("Tạo passenger thất bại");

      const paymentPayload = {
        bookingId,
        serviceId: flight?._id,
        paymentMethod: paymentInfo.method,
        contactInfo: form,
        paymentInfo: {},
      };

      if (paymentInfo.method === "credit") {
        paymentPayload.paymentInfo = {
          creditCardNumber: paymentInfo.creditCardNumber,
          cardHolder: paymentInfo.cardHolder,
          expiryDate: paymentInfo.expiryDate,
          cvv: paymentInfo.cvv,
        };
      } else {
        paymentPayload.paymentInfo = {
          phone:
            paymentInfo.method === "momo"
              ? paymentInfo.momoPhone
              : paymentInfo.zaloPhone,
        };
      }

      const paymentRes = await fetch(
        `${process.env.REACT_APP_API_URL}/api/payment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentPayload),
        }
      );

      if (!paymentRes.ok) throw new Error("Tạo payment thất bại");

      alert("Đặt vé & thanh toán thành công!");
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.section}>
          <h3>Thông tin liên hệ</h3>
          <div className={styles.row}>
            <input
              type="text"
              placeholder="Họ"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Tên đệm và tên"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
          </div>
          <div className={styles.row}>
            <input
              type="text"
              placeholder="SĐT"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </div>

        <div className={styles.section}>
          <h3>Thông tin hành khách</h3>
          <div className={styles.row}>
            <select
              value={passengerInfo.title}
              onChange={(e) =>
                setPassengerInfo({ ...passengerInfo, title: e.target.value })
              }
            >
              <option value="Mr">Ông</option>
              <option value="Mrs">Bà</option>
              <option value="Ms">Cô</option>
            </select>
            <select
              value={passengerInfo.gender}
              onChange={(e) =>
                setPassengerInfo({ ...passengerInfo, gender: e.target.value })
              }
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div className={styles.row}>
            <input
              type="text"
              placeholder="Họ"
              value={passengerInfo.lastName}
              onChange={(e) =>
                setPassengerInfo({ ...passengerInfo, lastName: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Tên"
              value={passengerInfo.firstName}
              onChange={(e) =>
                setPassengerInfo({
                  ...passengerInfo,
                  firstName: e.target.value,
                })
              }
            />
          </div>

          <div className={styles.row}>
            <input
              type="date"
              value={passengerInfo.dob}
              onChange={(e) =>
                setPassengerInfo({ ...passengerInfo, dob: e.target.value })
              }
            />
            <select
              value={passengerInfo.nationality}
              onChange={(e) =>
                setPassengerInfo({
                  ...passengerInfo,
                  nationality: e.target.value,
                })
              }
            >
              <option value="">-- Quốc tịch --</option>
              <option value="Vietnam">Việt Nam</option>
              <option value="Thailand">Thái Lan</option>
              <option value="USA">Hoa Kỳ</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Số hộ chiếu"
            value={passengerInfo.passportNumber}
            onChange={(e) =>
              setPassengerInfo({
                ...passengerInfo,
                passportNumber: e.target.value,
              })
            }
          />

          <select
            value={passengerInfo.passportCountry}
            onChange={(e) =>
              setPassengerInfo({
                ...passengerInfo,
                passportCountry: e.target.value,
              })
            }
          >
            <option value="">-- Quốc gia cấp hộ chiếu --</option>
            <option value="Vietnam">Việt Nam</option>
            <option value="Thailand">Thái Lan</option>
            <option value="USA">Hoa Kỳ</option>
          </select>

          <input
            type="date"
            value={passengerInfo.passportExpiry}
            onChange={(e) =>
              setPassengerInfo({
                ...passengerInfo,
                passportExpiry: e.target.value,
              })
            }
          />
        </div>

        <PaymentForm
          contactInfo={form}
          flight={flight}
          paymentInfo={paymentInfo}
          setPaymentInfo={setPaymentInfo}
        />
      </div>

      <div className={styles.rightColumn}>
        <div className={styles.flightSummaryBox}>
          <h4>Tóm tắt chuyến bay</h4>
          <div>
            <strong>Hành trình:</strong> {flight?.departure?.city} (
            {flight?.departure?.date
              ? new Date(flight.departure.date).toLocaleDateString()
              : "Không xác định"}
            ) → {flight?.arrival?.city} (
            {flight?.arrival?.date
              ? new Date(flight.arrival.date).toLocaleDateString()
              : "Không xác định"}
            )
          </div>

          <div>
            <strong>Thời gian bay:</strong> {flight?.duration || "90"} phút
          </div>

          <div>
            <strong>Hãng:</strong> {flight?.airline || "VietJet Air"}
          </div>

          <div>
            <strong>Ngày khởi hành:</strong>{" "}
            {flight?.departure?.date
              ? new Date(flight.departure.date).toLocaleDateString()
              : "Không xác định"}
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.totalBox}>
            <h4>Tóm tắt đặt vé</h4>
            <div>
              <strong>Hành khách:</strong> {passengerInfo.lastName}{" "}
              {passengerInfo.firstName}
            </div>
            <div>
              <strong>Giới tính:</strong> {passengerInfo.gender}
            </div>
            <div>
              <strong>SĐT:</strong> {form.countryCode} {form.phone}
            </div>
            <div>
              <strong>Email:</strong> {form.email}
            </div>
            <div>
              <strong>Hộ chiếu:</strong> {passengerInfo.passportNumber} -{" "}
              {passengerInfo.passportCountry}
            </div>
            <div>
              <strong>Giá:</strong> {flight?.price?.economy.toLocaleString()}{" "}
              VND
            </div>
            <div>
              <strong>Phương thức thanh toán:</strong> {paymentInfo.method}
            </div>
            <button
              className={styles.confirmButton}
              onClick={handleConfirmBooking}
            >
              Xác nhận đặt vé
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightBookingForm;
