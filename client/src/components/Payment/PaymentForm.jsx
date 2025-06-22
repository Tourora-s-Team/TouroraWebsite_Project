import React, { useState } from "react";
import styles from "./PaymentForm.module.css";

const PaymentForm = ({ contactInfo, flight }) => {
  const [selectedMethod, setSelectedMethod] = useState("credit");

  const [paymentInfo, setPaymentInfo] = useState({
    creditCardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    momoPhone: "",
    zaloPhone: "",
  });

  const handleSubmit = async () => {
    const data = {
      contactInfo,
      paymentMethod: selectedMethod,
      flightId: flight?._id || "UNKNOWN",
      paymentInfo:
        selectedMethod === "credit"
          ? {
              creditCardNumber: paymentInfo.creditCardNumber,
              cardHolder: paymentInfo.cardHolder,
              expiryDate: paymentInfo.expiryDate,
              cvv: paymentInfo.cvv,
            }
          : selectedMethod === "momo"
          ? { phone: paymentInfo.momoPhone }
          : { phone: paymentInfo.zaloPhone },
    };

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Đã xảy ra lỗi khi gửi thanh toán");
      const result = await res.json();
      alert("Thanh toán thành công!");
      console.log("Kết quả từ server:", result);
    } catch (err) {
      console.error(err);
      alert("Lỗi: " + err.message);
    }
  };

  return (
    <div className={styles.paymentSection}>
      <h4>Thông tin thanh toán</h4>
      <div className={styles.paymentMethods}>
        <button
          className={`${styles.paymentButton} ${
            selectedMethod === "credit" ? styles.active : ""
          }`}
          onClick={() => setSelectedMethod("credit")}
          type="button"
        >
          Credit Card
        </button>
        <button
          className={`${styles.paymentButton} ${
            selectedMethod === "momo" ? styles.active : ""
          }`}
          onClick={() => setSelectedMethod("momo")}
          type="button"
        >
          Momo
        </button>
        <button
          className={`${styles.paymentButton} ${
            selectedMethod === "zalopay" ? styles.active : ""
          }`}
          onClick={() => setSelectedMethod("zalopay")}
          type="button"
        >
          ZaloPay
        </button>
      </div>

      {selectedMethod === "credit" && (
        <div className={styles.paymentForm}>
          <div className={styles.formGroup}>
            <label>Số thẻ*</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={paymentInfo.creditCardNumber}
              onChange={(e) =>
                setPaymentInfo({
                  ...paymentInfo,
                  creditCardNumber: e.target.value,
                })
              }
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Tên chủ thẻ*</label>
            <input
              type="text"
              placeholder="NGUYEN VAN A"
              value={paymentInfo.cardHolder}
              onChange={(e) =>
                setPaymentInfo({
                  ...paymentInfo,
                  cardHolder: e.target.value,
                })
              }
              required
            />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Ngày hết hạn*</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={paymentInfo.expiryDate}
                onChange={(e) =>
                  setPaymentInfo({
                    ...paymentInfo,
                    expiryDate: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>CVV*</label>
              <input
                type="text"
                placeholder="123"
                value={paymentInfo.cvv}
                onChange={(e) =>
                  setPaymentInfo({
                    ...paymentInfo,
                    cvv: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>
        </div>
      )}

      {selectedMethod === "momo" && (
        <div className={styles.paymentForm}>
          <div className={styles.formGroup}>
            <label>Số điện thoại MoMo*</label>
            <input
              type="tel"
              placeholder="0901234567"
              value={paymentInfo.momoPhone}
              onChange={(e) =>
                setPaymentInfo({
                  ...paymentInfo,
                  momoPhone: e.target.value,
                })
              }
              required
            />
          </div>
        </div>
      )}

      {selectedMethod === "zalopay" && (
        <div className={styles.paymentForm}>
          <div className={styles.formGroup}>
            <label>Số điện thoại ZaloPay*</label>
            <input
              type="tel"
              placeholder="0901234567"
              value={paymentInfo.zaloPhone}
              onChange={(e) =>
                setPaymentInfo({
                  ...paymentInfo,
                  zaloPhone: e.target.value,
                })
              }
              required
            />
          </div>
        </div>
      )}

      <button className={styles.submitButton} onClick={handleSubmit}>
        Thanh toán
      </button>
    </div>
  );
};

export default PaymentForm;
