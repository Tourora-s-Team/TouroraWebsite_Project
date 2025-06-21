// import React, { useState } from "react";
// import Select from 'react-select';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { setCarRentalData } from '../redux/CarRentalSlice';

// import styles from './CarRentalSearchForm.module.css';

// const CarRentalForm = () => {
//   // Set templates data
//   const locationOptions = [
//     { value: 'Hà Nội', label: 'Hà Nội' },
//     { value: 'TP Hồ Chí Minh', label: 'TP Hồ Chí Minh' },
//     { value: 'Đà Nẵng', label: 'Đà Nẵng' },
//     { value: 'Huế', label: 'Huế' },
//   ];

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const today = new Date().toISOString().split('T')[0];

//   const [form, setForm] = useState({
//     location: "",
//     startDate: today,
//     startTime: "09:00",
//     endDate: today,
//     endTime: "09:00",
//     mode: "driver"
//   });


//   const handleChange = (e) => {

//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleModeChange = (mode) => {
//     setForm((prev) => ({ ...prev, mode }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!form.location.trim()) {
//       alert("Vui lòng nhập địa điểm thuê xe.");
//       return;
//     }
//     dispatch(setCarRentalData(form))
//     fetch("http://localhost:3001/api/car-rentals", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(form)
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) {
//           navigate("/car-rental-results");
//         } else {
//           alert("Có lỗi xảy ra: " + data.message);
//         }
//       })
//       .catch((err) => {
//         console.error("Error:", err);
//         alert("Lỗi kết nối đến server");
//       });
//   };

//   return (
//     <div>
//       <div className={styles.heroSection}>
//         <div className={styles.modeSelector}>

//           <button
//             className={form.mode === "driver" ? styles.active : ""}
//             onClick={() => handleModeChange("driver")}
//           >
//             Có tài xế
//           </button>
//           <button
//             className={form.mode === "self-driving " ? styles.active : ""}
//             onClick={() => handleModeChange("self-driving ")}
//           >
//             Tự lái
//           </button>
//         </div>

//         <form className={styles.bookingForm} onSubmit={handleSubmit}>
//           <div className={styles.formGroup}>
//             <label className={styles.label}>Địa điểm thuê xe của bạn</label>
//             <Select
//               options={locationOptions}
//               onChange={(selected) =>
//                 setForm((prev) => ({ ...prev, location: selected?.value || '' }))
//               }
//               placeholder="Chọn hoặc nhập địa điểm"
//               isClearable
//             />
//           </div>

//           <div className={styles.formGroup}>
//             <label className={styles.label}>Ngày bắt đầu</label>
//             <input className={styles.inputBox} type="date" name="startDate" defaultValue={form.startDate} onChange={handleChange} />
//           </div>

//           <div className={styles.formGroup}>
//             <label className={styles.label}>Giờ bắt đầu</label>
//             <input className={styles.inputBox} type="time" name="startTime" defaultValue={form.startTime} onChange={handleChange} />
//           </div>

//           <div className={styles.formGroup}>
//             <label className={styles.label}>Ngày kết thúc</label>
//             <input className={styles.inputBox} type="date" name="endDate" defaultValue={today} value={form.endDate} onChange={handleChange} />
//           </div>

//           <div className={styles.formGroup}>
//             <label className={styles.label}>Giờ kết thúc</label>
//             <input className={styles.inputBox} type="time" name="endTime" value={form.endTime} onChange={handleChange} />
//           </div>

//           <button type="submit" className={styles.searchBtn}>🔍</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CarRentalForm;

import React, { useState } from "react";
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import TimePicker from 'react-time-picker';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCarRentalData } from '../redux/CarRentalSlice';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
import styles from './CarRentalSearchForm.module.css';

const CarRentalForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const locationOptions = [
    { value: 'Hà Nội', label: 'Hà Nội' },
    { value: 'TP Hồ Chí Minh', label: 'TP Hồ Chí Minh' },
    { value: 'Đà Nẵng', label: 'Đà Nẵng' },
    { value: 'Huế', label: 'Huế' },
  ];

  const today = new Date();
  const [form, setForm] = useState({
    location: "",
    startDate: today,
    startTime: "09:00",
    endDate: today,
    endTime: "09:00",
    mode: "driver"
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

    if (!form.location.trim()) {
      alert("Vui lòng nhập địa điểm thuê xe.");
      return;
    }

    dispatch(setCarRentalData(form));

    fetch(`${process.env.REACT_APP_API_URL}/api/car-rental-service/car-rentals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          navigate("/car-rental-results");
        } else {
          alert("Có lỗi xảy ra: " + data.message);
        }
      })
      .catch(err => {
        console.error("Error:", err);
        alert("Lỗi kết nối đến server");
      });
  };

  return (
    <div>
      <div className={styles.heroSection}>
        <div className={styles.modeSelector}>
          <button
            className={form.mode === "driver" ? styles.active : ""}
            onClick={() => handleModeChange("driver")}
          >
            Có tài xế
          </button>
          <button
            className={form.mode === "self-driving" ? styles.active : ""}
            onClick={() => handleModeChange("self-driving")}
          >
            Tự lái
          </button>
        </div>

        <form className={styles.bookingForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Địa điểm thuê xe của bạn</label>
            <Select
              options={locationOptions}
              onChange={(selected) =>
                setForm((prev) => ({ ...prev, location: selected?.value || "" }))
              }
              placeholder="Chọn hoặc nhập địa điểm"
              isClearable
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Ngày bắt đầu</label>
            <DatePicker
              className={styles.inputBox}
              selected={form.startDate}
              onChange={(date) => setForm((prev) => ({ ...prev, startDate: date }))}
              dateFormat="yyyy-MM-dd"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Giờ bắt đầu</label>
            <TimePicker
              className={styles.inputBox}
              value={form.startTime}
              onChange={(time) => setForm((prev) => ({ ...prev, startTime: time }))}
              format="HH:mm"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Ngày kết thúc</label>
            <DatePicker
              className={styles.inputBox}
              selected={form.endDate}
              onChange={(date) => setForm((prev) => ({ ...prev, endDate: date }))}
              dateFormat="yyyy-MM-dd"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Giờ kết thúc</label>
            <TimePicker
              className={styles.inputBox}
              value={form.endTime}
              onChange={(time) => setForm((prev) => ({ ...prev, endTime: time }))}
              disableClock
              format="HH:mm"
            />
          </div>

          <button type="submit" className={styles.searchBtn}>🔍</button>
        </form>
      </div>
    </div>
  );
};

export default CarRentalForm;
