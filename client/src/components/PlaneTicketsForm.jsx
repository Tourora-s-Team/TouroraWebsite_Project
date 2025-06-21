import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PlaneTicketsForm.module.css";

const PlaneTicketsForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    tripType: "oneWay",
    fromLocation: "",
    toLocation: "",
    departDate: "",
    returnDate: "",
    passengers: {
      adults: 1,
      children: 0,
      infants: 0,
    },
    flightClass: "economy",
    directFlight: false,
  });

  const handleSwap = () => {
    setForm((prev) => ({
      ...prev,
      fromLocation: prev.toLocation,
      toLocation: prev.fromLocation,
    }));
  };

  const handleSearch = () => {
    navigate("/flight-results", {
      state: {
        search: {
          from: form.fromLocation,
          to: form.toLocation,
          departDate: form.departDate,
          returnDate: form.tripType === "roundTrip" ? form.returnDate : null,
          passengers: form.passengers,
          class: form.flightClass,
          directFlight: form.directFlight,
        },
      },
    });
  };

  return (
    <div className={styles.container}>
      {/* Banner */}
      <div className={styles.banner}>
        <h1>
          Tìm và đặt vé máy bay khuyến mãi & vé giá rẻ chỉ với 3 bước đơn giản!
        </h1>
      </div>

      {/* Form Card */}
      <div className={styles.formCard}>
        {/* Trip Type */}
        <div className={styles.tripTypeRow}>
          {["oneWay", "roundTrip", "multiCity"].map((type) => (
            <button
              key={type}
              className={`${styles.tripTypeBtn} ${
                form.tripType === type ? styles.active : ""
              }`}
              onClick={() => setForm((prev) => ({ ...prev, tripType: type }))}
            >
              {
                {
                  oneWay: "Một chiều",
                  roundTrip: "Khứ hồi",
                  multiCity: "Nhiều thành phố",
                }[type]
              }
            </button>
          ))}
        </div>

        {/* Route Row */}
        <div className={styles.routeRow}>
          <div className={styles.inputGroup}>
            <label>Điểm đi</label>
            <input
              type="text"
              placeholder="Nhập thành phố hoặc sân bay"
              value={form.fromLocation}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, fromLocation: e.target.value }))
              }
            />
          </div>
          <button className={styles.swapBtn} onClick={handleSwap}>
            ⇄
          </button>
          <div className={styles.inputGroup}>
            <label>Điểm đến</label>
            <input
              type="text"
              placeholder="Nhập thành phố hoặc sân bay"
              value={form.toLocation}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, toLocation: e.target.value }))
              }
            />
          </div>
        </div>

        {/* Date Row */}
        <div className={styles.dateRow}>
          <div className={styles.inputGroup}>
            <label>Ngày khởi hành</label>
            <input
              type="date"
              value={form.departDate}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, departDate: e.target.value }))
              }
            />
          </div>
          {form.tripType === "roundTrip" && (
            <div className={styles.inputGroup}>
              <label>Ngày về</label>
              <input
                type="date"
                value={form.returnDate}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, returnDate: e.target.value }))
                }
              />
            </div>
          )}
        </div>

        {/* Options */}
        <div className={styles.optionsRow}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={form.directFlight}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  directFlight: e.target.checked,
                }))
              }
            />
            Bay thẳng
          </label>
          <div className={styles.passengerInfo}>
            {form.passengers.adults +
              form.passengers.children +
              form.passengers.infants}{" "}
            Người •{" "}
            {form.flightClass === "economy" ? "Phổ thông" : "Thương gia"}
          </div>
        </div>

        {/* Search Button */}
        <button className={styles.searchBtn} onClick={handleSearch}>
          Tìm chuyến bay
        </button>
      </div>

      {/* Feature Section */}
      <div className={styles.features}>
        <div className={styles.ratingsSection}>
          <h3>Hơn 50 triệu lượt tải, hơn 1 triệu lượt đánh giá</h3>
          <div className={styles.ratings}>
            <div className={styles.ratingItem}>
              <img src="/images/app-store.png" alt="App Store" />
              <span>4.9 ★</span>
            </div>
            <div className={styles.ratingItem}>
              <img src="/images/google-play.png" alt="Google Play" />
              <span>4.8 ★</span>
            </div>
          </div>
        </div>

        <div className={styles.featuresList}>
          <div className={styles.featureItem}>
            <img src="/images/icons/change.png" alt="Đổi vé" />
            <div>
              <h4>Dễ dàng thay đổi chuyến bay</h4>
              <p>Thoải mái hủy hoặc thay đổi đặt chỗ chuyến bay</p>
            </div>
          </div>
          <div className={styles.featureItem}>
            <img src="/images/icons/payment.png" alt="Thanh toán" />
            <div>
              <h4>Thanh toán tiện lợi</h4>
              <p>Giao dịch dễ dàng với đa dạng hình thức thanh toán</p>
            </div>
          </div>
          <div className={styles.featureItem}>
            <img src="/images/icons/support.png" alt="Hỗ trợ" />
            <div>
              <h4>Hỗ trợ 24/7</h4>
              <p>Hãy liên hệ Tourora bất cứ lúc nào, bất cứ ở đâu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaneTicketsForm;
