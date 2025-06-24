import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useContext } from 'react';
import { CarContext } from '../../contexts/CarContext';

import { setCarRentalData } from '../../redux/CarRentalSlice';
import styles from './CarRentalSearchForm.module.css';

const CarRentalSearchForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  const { fetchCars } = useContext(CarContext);

  // Giá trị mặc định cho location
  const defaultLocation = useMemo(() => ({
    value: 'Hồ Chí Minh',
    label: 'Hồ Chí Minh',
    description: 'Việt Nam'
  }), []);
  
  const [form, setForm] = useState({
    location: defaultLocation, // Sử dụng giá trị mặc định
    startDate: today,
    startTime: "09:00",
    endDate: today,
    endTime: "09:00",
    mode: "driver"
  });

  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([defaultLocation]); // Thêm giá trị mặc định vào options
  const [isLoading, setIsLoading] = useState(false);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const searchTimeoutRef = useRef(null);
  const selectRef = useRef(null);



  // Hàm fetch các địa điểm phổ biến
  const fetchPopularLocations = useCallback(async () => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const res = await fetch(`${apiUrl}/api/locations/popular`);
      const data = await res.json();
      if (data.locations && data.locations.length > 0) {
        const formatted = data.locations.map(loc => ({
          value: loc.value || loc.name,
          label: loc.label || loc.name,
          description: loc.province ? `${loc.province}, Việt Nam` : 'Việt Nam',
        }));
        setOptions([defaultLocation, ...formatted]);
      }
    } catch (err) {
      console.error("Lỗi fetch địa điểm phổ biến:", err);
    } finally {
      setIsLoading(false);
    }
  }, [defaultLocation]); // ✅ thêm dependency nếu cần

  useEffect(() => {
    fetchPopularLocations();
  }, [fetchPopularLocations]);

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
      // Đảm bảo luôn có mặc định trong kết quả
      setOptions([defaultLocation, ...formatted]);
    } catch (err) {
      console.error("Lỗi fetch location:", err);
      setOptions([defaultLocation]); // Vẫn giữ giá trị mặc định
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
        setOptions([defaultLocation]); // Chỉ hiển thị địa điểm mặc định khi input trống
      }
    }, 300);
  };

  const handleSelectChange = (selectedOption) => {
    setForm(prev => ({ ...prev, location: selectedOption || defaultLocation }));
    setMenuIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Đảm bảo luôn có location, nếu không có thì sử dụng mặc định
    const formLocation = form.location || defaultLocation;

    const requestData = {
      ...form,
      location: formLocation.value,
    };

    console.log("Dữ liệu tìm kiếm:", requestData);

    // Cập nhật thông tin người dùng đã tìm (lưu ở Redux)
    dispatch(setCarRentalData(requestData)); try {
      setIsLoading(true);
      // Gọi context để fetch dữ liệu và lưu vào state + localStorage
      await fetchCars(requestData, 'price_low'); // Có thể thêm sortBy nếu cần

      // Thêm một khoảng thời gian ngắn để đảm bảo dữ liệu đã được cập nhật đầy đủ
      setTimeout(() => {
        setIsLoading(false);
        navigate('/car-rental-service/search');
      }, 500);
    } catch (err) {
      setIsLoading(false);
      console.error("Lỗi khi tìm kiếm xe:", err);
      alert("Đã xảy ra lỗi khi tìm kiếm xe.");
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
