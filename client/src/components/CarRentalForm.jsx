import React, { useState } from "react";
import styles from "./CarRentalForm.module.css";

const CarRentalForm = () => {
  const [form, setForm] = useState({
    location: "",
    startDate: "2025-06-04",
    startTime: "09:00",
    endDate: "2025-06-06",
    endTime: "09:00",
    mode: "tu-lai",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleModeChange = (mode) => {
    setForm((prev) => ({ ...prev, mode }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3001/api/rentals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert(data.message);
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
    <div className={styles.heroSection}>
      <div className={styles.modeSelector}>
        <button
          className={form.mode === "tu-lai" ? styles.active : ""}
          onClick={() => handleModeChange("tu-lai")}
        >
          🚗 Tự lái
        </button>
        <button
          className={form.mode === "co-tai-xe" ? styles.active : ""}
          onClick={() => handleModeChange("co-tai-xe")}
        >
          👨‍✈️ Có tài xế
        </button>
      </div>

      <form className={styles.bookingForm} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Địa điểm thuê xe của bạn</label>
          <input
            className={styles.inputBox}
            type="text"
            name="location"
            placeholder="Điền thành phố, sân bay"
            value={form.location}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Ngày bắt đầu</label>
          <input
            className={styles.inputBox}
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Giờ bắt đầu</label>
          <input
            className={styles.inputBox}
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Ngày kết thúc</label>
          <input
            className={styles.inputBox}
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Giờ kết thúc</label>
          <input
            className={styles.inputBox}
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className={styles.searchBtn}>
          🔍
        </button>
      </form>
    </div>
  );
};

export default CarRentalForm;
