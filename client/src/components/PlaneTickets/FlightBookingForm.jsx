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

  const handleConfirmBooking = async () => {
    const bookingCode = `BK${Date.now()}`;
    const fullName = `${passengerInfo.lastName} ${passengerInfo.firstName}`;
    const dateOfBirth = `${passengerInfo.dob.year}-${passengerInfo.dob.month}-${passengerInfo.dob.day}`;
    const passportExpiry = `${passengerInfo.passportExpiry.year}-${passengerInfo.passportExpiry.month}-${passengerInfo.passportExpiry.day}`;

    try {
      // 1. Booking
      const bookingRes = await fetch(
        `${process.env.REACT_APP_API_URL}/api/booking-flight`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingCode,
            // userId: "user_id_here",
            flightId: flight?._id,
            passengers: [
              {
                fullName,
                dateOfBirth,
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

      // 2. Passenger
      const passengerRes = await fetch(
        `${process.env.REACT_APP_API_URL}/api/passenger`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId,
            fullName,
            gender: passengerInfo.gender,
            dateOfBirth,
            nationality: passengerInfo.nationality,
            passportNumber: passengerInfo.passportNumber,
            passportExpiry,
            type: passengerInfo.type,
            seat: null,
            specialRequest: "",
            addons: [],
          }),
        }
      );

      if (!passengerRes.ok) throw new Error("Tạo passenger thất bại");

      // 3. Payment
      const paymentPayload = {
        bookingId,
        method: paymentInfo.method,
        amount: flight?.price?.economy || 0,
      };

      if (paymentInfo.method === "credit") {
        paymentPayload.details = {
          creditCardNumber: paymentInfo.creditCardNumber,
          cardHolder: paymentInfo.cardHolder,
          expiryDate: paymentInfo.expiryDate,
          cvv: paymentInfo.cvv,
        };
      } else {
        paymentPayload.details = {
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
        {/* Thông tin liên hệ */}
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

        {/* Thông tin hành khách */}
        <div className={styles.section}>
          <h3>Thông tin hành khách</h3>
          <div className={styles.row}>
            <select
              value={passengerInfo.type}
              onChange={(e) =>
                setPassengerInfo({ ...passengerInfo, type: e.target.value })
              }
            >
              <option value="adult">Người lớn</option>
              <option value="child">Trẻ em</option>
              <option value="infant">Em bé</option>
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
              type="text"
              placeholder="DD"
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
              value={passengerInfo.dob.year}
              onChange={(e) =>
                setPassengerInfo({
                  ...passengerInfo,
                  dob: { ...passengerInfo.dob, year: e.target.value },
                })
              }
            />
          </div>

          <input
            type="text"
            placeholder="Quốc tịch"
            value={passengerInfo.nationality}
            onChange={(e) =>
              setPassengerInfo({
                ...passengerInfo,
                nationality: e.target.value,
              })
            }
          />
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
          <input
            type="text"
            placeholder="Nơi cấp hộ chiếu"
            value={passengerInfo.passportCountry}
            onChange={(e) =>
              setPassengerInfo({
                ...passengerInfo,
                passportCountry: e.target.value,
              })
            }
          />
          <div className={styles.row}>
            <input
              type="text"
              placeholder="DD"
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

        <PaymentForm
          contactInfo={form}
          flight={flight}
          paymentInfo={paymentInfo}
          setPaymentInfo={setPaymentInfo}
        />
      </div>

      {/* Right column */}
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
            <strong>Giá:</strong> {flight?.price?.economy.toLocaleString()} VND
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
  );
};

export default FlightBookingForm;
