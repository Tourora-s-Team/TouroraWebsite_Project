import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CarCard.module.css';
import SupplierSelectionModal from './SupplierSelectionModal';

const CarCard = ({ car }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  
  // Kiểm tra prop car để tránh lỗi
  if (!car) {
    return (
      <div className={styles.carCard}>
        <p>Không có thông tin xe</p>
      </div>
    );
  }
  
  // Các trường dữ liệu khác nhau có thể xuất hiện trong car
  const imageUrl = car.image_url || car.image || car.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image';
  const carName = car.car_name || car.name || car.model || 'Tên xe không xác định';
  const carType = car.car_type || car.carType || car.type || 'Loại xe không xác định';
  const price = car.price_per_day || car.price || car.rental_price || car.dailyRate || '---';
  const features = Array.isArray(car.features) ? car.features : 
                   Array.isArray(car.amenities) ? car.amenities : 
                   car.feature_list ? car.feature_list.split(',').map(f => f.trim()) : 
                   ['Tiện ích xe'];
    // Log để debug
  console.log('[CarCard] Hiển thị xe:', carName, car);
  
  const handleBookingClick = () => {
    setIsModalOpen(true);
  };
  const handleSupplierSelect = (supplier, selectedCar) => {
    console.log('Đã chọn nhà cung cấp:', supplier);
    console.log('Xe được chọn:', selectedCar);
    
    // Điều hướng đến trang booking detail với dữ liệu xe và nhà cung cấp
    navigate('/car-rental-service/booking', { 
      state: { 
        supplier, 
        car: selectedCar 
      } 
    });
  };
  
  return (
    <div className={styles.carCard}>
      <div className={styles.leftContainer}>
        <img 
          src={imageUrl} 
          alt={carName} 
          className={styles.carImage} 
          onError={(e) => {e.target.onerror = null; e.target.src='https://via.placeholder.com/300x200?text=Error+Loading'}}
        />
        <div className={styles.carDetails}>
          <h4 className={styles.carName}>{carName}</h4>
          <p className={styles.carType}>{carType}</p>
          <div className={styles.carFeatures}>
            {features && Array.isArray(features) ? (
              features.map((feature, index) => (
                <span key={index} className={styles.feature}>{feature}</span>
              ))
            ) : (
              <span className={styles.feature}>Tiện ích xe</span>
            )}
          </div>
          
          {car.transmission && (
            <p className={styles.carInfo}>
              <span className={styles.infoLabel}>Hộp số:</span> {car.transmission}
            </p>
          )}
          
          {car.fuel_type && (
            <p className={styles.carInfo}>
              <span className={styles.infoLabel}>Nhiên liệu:</span> {car.fuel_type}
            </p>
          )}
        </div>
      </div>
      
      <div className={styles.rightContainer}>
        <div className={styles.priceSection}>
          <div>
            <span className={styles.price}>
              {typeof price === 'number' ? price.toLocaleString() : price}đ
            </span>
            <span className={styles.pricePeriod}>/ngày</span>
          </div>
          
          {car.rental_mode && (
            <div className={styles.rentalMode}>
              {car.rental_mode === 'driver' ? 'Có tài xế' : 'Tự lái'}
            </div>
          )}        </div>
        <button className={styles.bookBtn} onClick={handleBookingClick}>
          Đặt xe
        </button>
      </div>
      
      <SupplierSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        car={car}
        onSupplierSelect={handleSupplierSelect}
      />
    </div>
  );
};

export default CarCard;