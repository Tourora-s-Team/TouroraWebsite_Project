import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./PlaneTicketsForm.module.css";

const PlaneTicketsForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    tripType: "oneWay", // oneWay, roundTrip, multiCity
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
      {/* Banner Section */}
      <div className={styles.banner}>
        <h1>
          Tìm và đặt vé máy bay khuyến mãi & vé giá rẻ chỉ với 3 bước đơn giản!
        </h1>
      </div>

      {/* Search Form Section */}
      <div className={styles.searchBox}>
        {/* Trip Type Selector */}
        <div className={styles.tripTypeSelector}>
          <button
            className={`${styles.tripTypeBtn} ${
              form.tripType === "oneWay" ? styles.active : ""
            }`}
            onClick={() => setForm((prev) => ({ ...prev, tripType: "oneWay" }))}
          >
            Một chiều
          </button>
          <button
            className={`${styles.tripTypeBtn} ${
              form.tripType === "roundTrip" ? styles.active : ""
            }`}
            onClick={() =>
              setForm((prev) => ({ ...prev, tripType: "roundTrip" }))
            }
          >
            Khứ hồi
          </button>
          <button
            className={`${styles.tripTypeBtn} ${
              form.tripType === "multiCity" ? styles.active : ""
            }`}
            onClick={() =>
              setForm((prev) => ({ ...prev, tripType: "multiCity" }))
            }
          >
            Nhiều thành phố
          </button>
        </div>

        {/* Flight Options */}
        <div className={styles.flightOptions}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={form.directFlight}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, directFlight: e.target.checked }))
              }
            />
            Bay thẳng
          </label>

          <div className={styles.passengerSelector}>
            <span>
              {form.passengers.adults +
                form.passengers.children +
                form.passengers.infants}{" "}
              Người
            </span>
            <span>
              {form.flightClass === "economy" ? "Phổ thông" : "Thương gia"}
            </span>
          </div>
        </div>

        {/* Main Search Form */}
        <div className={styles.searchForm}>
          <div className={styles.locationInputs}>
            <div className={styles.inputGroup}>
              <label>Từ</label>
              <input
                type="text"
                value={form.fromLocation}
                placeholder="Nhập thành phố hoặc sân bay"
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, fromLocation: e.target.value }))
                }
              />
            </div>

            <button className={styles.swapBtn}>⇄</button>

            <div className={styles.inputGroup}>
              <label>Đến</label>
              <input
                type="text"
                value={form.toLocation}
                placeholder="Nhập thành phố hoặc sân bay"
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, toLocation: e.target.value }))
                }
              />
            </div>
          </div>

          <div className={styles.dateInputs}>
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

          <button className={styles.searchBtn} onClick={handleSearch}>
            Tìm chuyến bay
          </button>
        </div>
      </div>

      {/* Features Section */}
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
            <h4>Dễ dàng thay đổi chuyến bay</h4>
            <p>Thoải mái hủy hoặc thay đổi đặt chỗ chuyến bay</p>
          </div>
          <div className={styles.featureItem}>
            <img src="/images/icons/payment.png" alt="Thanh toán" />
            <h4>Thanh toán tiện lợi</h4>
            <p>Giao dịch dễ dàng với đa dạng hình thức thanh toán</p>
          </div>
          <div className={styles.featureItem}>
            <img src="/images/icons/support.png" alt="Hỗ trợ" />
            <h4>Hỗ trợ 24/7</h4>
            <p>Hãy liên hệ Tourora bất cứ lúc nào, bất cứ ở đâu</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaneTicketsForm;
