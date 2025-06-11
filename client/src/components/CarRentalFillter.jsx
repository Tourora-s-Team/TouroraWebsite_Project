import { useState } from 'react';
import { useSelector } from 'react-redux';

import CarRentalSearchForm from './CarRentalSearchForm';
import styles from './CarRentalFillter.module.css';


const CarRentalFillter = () => {
  const carRental = useSelector((state) => state.carRental);
  const [showSearchForm, setShowSearchForm] = useState(false);

  const toggleSearchForm = () => {
    setShowSearchForm(!showSearchForm);
  };

  function showMode(mode) {
    if (mode.trim() === "self-driving") return "Tự lái"
    if (mode.trim() === "driver") return "Có tài xế"
  }

  
  function showModeHeading(mode) {
    let modeHeading
    if (mode.trim() === "self-driving") {
      modeHeading = <h2>Car Rental Without Driver</h2>
    }
    if (mode.trim() === "driver") {
      modeHeading = <h2>Car Rental With Driver</h2>
    }
    return modeHeading
  }

  return (
    <div>
      <div className={styles.filterForm}>
        <div>
          <h4 className={styles.pathTitle}>Thuê xe / {showMode(carRental.mode)}</h4>
          {showModeHeading(carRental.mode)}
          {/* Location */}
          <label className={styles.label}>{carRental.location} | {carRental.startTime}, {carRental.startDate} - {carRental.endTime}, {carRental.endDate}</label>
        </div>
        <button className={styles.searchBtn} onClick={toggleSearchForm}>Thay đổi tìm kiếm</button>


      </div>
      {showSearchForm && <CarRentalSearchForm />}
    </div>
  );
};

export default CarRentalFillter;