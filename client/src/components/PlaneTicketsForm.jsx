import React, { useState } from "react";
import styles from "./PlaneTicketsForm.module.css";

const PlaneTicketsForm = () => {
  const [form, setForm] = useState({
    tripType: "oneWay", // oneWay or roundTrip
    fromLocation: "",
    toLocation: "",
    departDate: "2025-06-06",
    returnDate: "2025-06-13",
    passengers: {
      adults: 1,
      children: 0,
      infants: 0,
    },
    seatClass: "economy", // economy, business, firstClass
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePassengerChange = (type, value) => {
    setForm((prev) => ({
      ...prev,
      passengers: {
        ...prev.passengers,
        [type]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3001/api/flights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Tìm kiếm chuyến bay thành công!");
        } else {
          alert("Có lỗi xảy ra: " + data.message);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("Lỗi kết nối đến server");
      });
  };

  return (
    <div className={styles.flightSection}>
      <div className={styles.tripTypeSelector}>
        <button
          className={form.tripType === "oneWay" ? styles.active : ""}
          onClick={() => setForm((prev) => ({ ...prev, tripType: "oneWay" }))}
        >
          ✈️ Một chiều
        </button>
        <button
          className={form.tripType === "roundTrip" ? styles.active : ""}
          onClick={() =>
            setForm((prev) => ({ ...prev, tripType: "roundTrip" }))
          }
        >
          🔄 Khứ hồi
        </button>
      </div>

      <form className={styles.bookingForm} onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Điểm đi</label>
            <input
              className={styles.inputBox}
              type="text"
              name="fromLocation"
              placeholder="Nhập thành phố hoặc sân bay"
              value={form.fromLocation}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Điểm đến</label>
            <input
              className={styles.inputBox}
              type="text"
              name="toLocation"
              placeholder="Nhập thành phố hoặc sân bay"
              value={form.toLocation}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Ngày đi</label>
            <input
              className={styles.inputBox}
              type="date"
              name="departDate"
              value={form.departDate}
              onChange={handleChange}
            />
          </div>

          {form.tripType === "roundTrip" && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Ngày về</label>
              <input
                className={styles.inputBox}
                type="date"
                name="returnDate"
                value={form.returnDate}
                onChange={handleChange}
              />
            </div>
          )}
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Hạng ghế</label>
            <select
              className={styles.selectBox}
              name="seatClass"
              value={form.seatClass}
              onChange={handleChange}
            >
              <option value="economy">Phổ thông</option>
              <option value="business">Thương gia</option>
              <option value="firstClass">Hạng nhất</option>
            </select>
          </div>

          <div className={styles.passengerSection}>
            <label className={styles.label}>Hành khách</label>
            <div className={styles.passengerControls}>
              <div className={styles.passengerType}>
                <span>Người lớn</span>
                <input
                  type="number"
                  min="1"
                  max="9"
                  value={form.passengers.adults}
                  onChange={(e) =>
                    handlePassengerChange("adults", parseInt(e.target.value))
                  }
                />
              </div>
              <div className={styles.passengerType}>
                <span>Trẻ em</span>
                <input
                  type="number"
                  min="0"
                  max="9"
                  value={form.passengers.children}
                  onChange={(e) =>
                    handlePassengerChange("children", parseInt(e.target.value))
                  }
                />
              </div>
              <div className={styles.passengerType}>
                <span>Em bé</span>
                <input
                  type="number"
                  min="0"
                  max="9"
                  value={form.passengers.infants}
                  onChange={(e) =>
                    handlePassengerChange("infants", parseInt(e.target.value))
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className={styles.searchBtn}>
          Tìm chuyến bay
        </button>
      </form>
    </div>
  );
};

export default PlaneTicketsForm;
