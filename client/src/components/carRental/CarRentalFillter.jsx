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

  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  function showMode(mode) {
    if (mode === "self") return "Tự lái";
    if (mode === "driver") return "Có tài xế";
    return mode;
  }

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterForm}>
        <div className={styles.searchSummary}>
          <div className={styles.breadcrumbs}>
            <span>Thuê xe</span>
            <span className={styles.breadcrumbSeparator}>›</span>
            <span>{showMode(carRental.mode)}</span>
            <span className={styles.breadcrumbSeparator}>›</span>
            <span>{carRental.location || 'Tất cả địa điểm'}</span>
          </div>
          
          <h2 className={styles.resultTitle}>
            {carRental.mode === "self" ? 
              "Thuê xe tự lái" : 
              "Thuê xe có tài xế"} tại {carRental.location || 'các địa điểm phổ biến'}
          </h2>
          
          <div className={styles.searchDetails}>
            <div className={styles.detailItem}>
              <span className={styles.detailIcon}>📍</span>
              <span className={styles.detailText}>{carRental.location || 'Chưa chọn địa điểm'}</span>
            </div>
            
            <div className={styles.detailSeparator}></div>
            
            <div className={styles.detailItem}>
              <span className={styles.detailIcon}>🗓️</span>
              <span className={styles.detailText}>
                {formatDate(carRental.startDate)} {carRental.startTime || '00:00'} - 
                {formatDate(carRental.endDate)} {carRental.endTime || '00:00'}
              </span>
            </div>
          </div>
        </div>
        
        <button className={styles.searchBtn} onClick={toggleSearchForm}>
          {showSearchForm ? 'Ẩn tìm kiếm' : 'Thay đổi tìm kiếm'}
        </button>
      </div>
      
      {showSearchForm && (
        <div className={styles.expandedSearchForm}>
          <CarRentalSearchForm />
        </div>
      )}
    </div>
  );
};

export default CarRentalFillter;