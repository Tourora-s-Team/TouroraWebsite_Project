import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCarRentalData } from '../redux/CarRentalSlice';

import styles from './CarRentalSearchForm.module.css';

const CarRentalForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const today = new Date();

  const formattedDate = [
    String(today.getDate()).padStart(2, '0'),      // Ngày (thêm '0' nếu < 10)
    String(today.getMonth() + 1).padStart(2, '0'), // Tháng (0-11 → +1)
    today.getFullYear()                            // Năm
  ].join('/');

  const [form, setForm] = useState({
    location: "",
    startDate: formattedDate,
    startTime: "09:00",
    endDate: formattedDate,
    endTime: "09:00",
    mode: "self-driving"
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
    dispatch(setCarRentalData(form))
    fetch("http://localhost:3001/api/car-rentals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          navigate("/car-rental-details"); 
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
          className={form.mode === "self-driving " ? styles.active : ""}
          onClick={() => handleModeChange("self-driving ")}
        >
          🚗 Tự lái
        </button>
        <button
          className={form.mode === "driver" ? styles.active : ""}
          onClick={() => handleModeChange("driver")}
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
          <input className={styles.inputBox} type="date" name="startDate" value={form.startDate} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Giờ bắt đầu</label>
          <input className={styles.inputBox} type="time" name="startTime" value={form.startTime} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Ngày kết thúc</label>
          <input className={styles.inputBox} type="date" name="endDate" value={form.endDate} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Giờ kết thúc</label>
          <input className={styles.inputBox} type="time" name="endTime" value={form.endTime} onChange={handleChange} />
        </div>

        <button type="submit" className={styles.searchBtn}>🔍</button>
      </form>
    </div>
  );
};

export default CarRentalForm;
