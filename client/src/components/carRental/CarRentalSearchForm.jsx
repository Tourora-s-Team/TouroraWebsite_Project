import React, { useState, useRef } from "react";
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCarRentalData } from '../../redux/CarRentalSlice';
import styles from './CarRentalSearchForm.module.css';

const CarRentalSearchForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    location: null,
    startDate: today,
    startTime: "09:00",
    endDate: today,
    endTime: "09:00",
    mode: "driver"
  });

  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const searchTimeoutRef = useRef(null);
  const selectRef = useRef(null);

  const fetchLocations = async (searchText) => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const res = await fetch(`${apiUrl}/api/locations?searchQuery=${encodeURIComponent(searchText)}`);
      const data = await res.json();
      const formatted = data.locations.map(loc => ({
        value: loc.value || loc.name,
        label: loc.label || loc.name,
        description: loc.province ? `${loc.province}, Việt Nam` : 'Việt Nam',
      }));
      setOptions(formatted);
    } catch (err) {
      console.error("Lỗi fetch location:", err);
      setOptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (newValue) => {
    setInputValue(newValue);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      if (newValue.trim() !== '') {
        fetchLocations(newValue);
      } else {
        setOptions([]);
      }
    }, 300);
  };

  const handleSelectChange = (selectedOption) => {
    setForm(prev => ({ ...prev, location: selectedOption }));
    setMenuIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.location) {
      alert("Vui lòng chọn địa điểm thuê xe.");
      return;
    }
    const requestData = {
      ...form,
      location: form.location.value,
    };

    dispatch(setCarRentalData(requestData));

    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const res = await fetch(`${apiUrl}/api/car-rental-service/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      const data = await res.json();
      if (data.success) {
        navigate("/car-rental-service/search");
      } else {
        alert("Lỗi: " + data.message);
      }
    } catch (err) {
      console.error("Lỗi kết nối:", err);
      alert("Lỗi kết nối đến server.");
    }
  };

  return (
    <div className={styles.carRentalForm}>
      <div className={styles.modeSelector}>
        <div className={styles.radioGroup}>
          <label className={`${styles.radioLabel} ${form.mode === "driver" ? styles.active : ""}`}>
            <input type="radio" name="mode" value="driver"
              checked={form.mode === "driver"}
              onChange={() => setForm(prev => ({ ...prev, mode: "driver" }))}
              className={styles.radioInput} />
            <span className={styles.radioText}>Có tài xế</span>
          </label>

          <label className={`${styles.radioLabel} ${form.mode === "self" ? styles.active : ""}`}>
            <input type="radio" name="mode" value="self"
              checked={form.mode === "self"}
              onChange={() => setForm(prev => ({ ...prev, mode: "self" }))}
              className={styles.radioInput} />
            <span className={styles.radioText}>Tự lái</span>
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <div className={styles.formGroup}>
          <label>Địa điểm:</label>
          <Select
            ref={selectRef}
            name="location"
            value={form.location}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            options={options}
            onChange={handleSelectChange}
            isLoading={isLoading}
            placeholder="Điền thành phố, sân bay..."
            isClearable
            blurInputOnSelect={false}
            openMenuOnClick={true}
            menuIsOpen={menuIsOpen || inputValue.length > 0}
            onMenuOpen={() => setMenuIsOpen(true)}
            onMenuClose={() => setMenuIsOpen(false)}
            noOptionsMessage={() => isLoading ? "Đang tải..." : "Không tìm thấy địa điểm"}
            styles={{
              control: (provided) => ({ ...provided, border: '1px solid #ddd', boxShadow: 'none', '&:hover': { border: '1px solid #FF5B00' } }),
              menu: (provided) => ({ ...provided, zIndex: 9999 })
            }}
          />
        </div>

        <div className={styles.dateTimeGroup}>
          <div className={styles.formGroup}>
            <label>Ngày đón:</label>
            <input type="date" name="startDate" value={form.startDate}
              onChange={(e) => setForm(prev => ({ ...prev, startDate: e.target.value }))}
              min={today} className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label>Giờ đón:</label>
            <input type="time" name="startTime" value={form.startTime}
              onChange={(e) => setForm(prev => ({ ...prev, startTime: e.target.value }))}
              className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label>Ngày trả:</label>
            <input type="date" name="endDate" value={form.endDate}
              onChange={(e) => setForm(prev => ({ ...prev, endDate: e.target.value }))}
              min={form.startDate} className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label>Giờ trả:</label>
            <input type="time" name="endTime" value={form.endTime}
              onChange={(e) => setForm(prev => ({ ...prev, endTime: e.target.value }))}
              className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <button type="submit" className={`${styles.submitButton} ${styles.input}`} disabled={isLoading}>
              {isLoading ? "Đang tải..." : "Tìm xe"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CarRentalSearchForm;
