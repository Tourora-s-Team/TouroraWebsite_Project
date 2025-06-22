import React from "react";
import styles from "./PaymentForm.module.css";

const PaymentForm = ({ contactInfo, flight, paymentInfo, setPaymentInfo }) => {
  return (
    <div className={styles.paymentSection}>
      <h4>Thông tin thanh toán</h4>

      <div className={styles.paymentMethods}>
        <button
          type="button"
          className={`${styles.paymentButton} ${
            paymentInfo.method === "credit" ? styles.active : ""
          }`}
          onClick={() => setPaymentInfo({ ...paymentInfo, method: "credit" })}
        >
          Credit Card
        </button>
        <button
          type="button"
          className={`${styles.paymentButton} ${
            paymentInfo.method === "momo" ? styles.active : ""
          }`}
          onClick={() => setPaymentInfo({ ...paymentInfo, method: "momo" })}
        >
          MoMo
        </button>
        <button
          type="button"
          className={`${styles.paymentButton} ${
            paymentInfo.method === "zalopay" ? styles.active : ""
          }`}
          onClick={() => setPaymentInfo({ ...paymentInfo, method: "zalopay" })}
        >
          ZaloPay
        </button>
      </div>

      {/* Credit Card */}
      {paymentInfo.method === "credit" && (
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

      {/* MoMo */}
      {paymentInfo.method === "momo" && (
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

      {/* ZaloPay */}
      {paymentInfo.method === "zalopay" && (
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
    </div>
  );
};

export default PaymentForm;
