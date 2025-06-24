import React from 'react';
import styles from './SupplierCard.module.css';

const SupplierCard = ({ supplier, car, onEdit, isSelected = false }) => {
  if (!supplier) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const getRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <span className={styles.stars}>
        {'★'.repeat(fullStars)}
        {hasHalfStar && '☆'}
        {'☆'.repeat(emptyStars)}
      </span>
    );
  };

  return (
    <div className={`${styles.supplierCard} ${isSelected ? styles.selected : ''}`}>
      <div className={styles.supplierHeader}>
        <div className={styles.supplierInfo}>
          <img 
            src={supplier.logo || 'https://via.placeholder.com/80x40?text=LOGO'} 
            alt={supplier.name}
            className={styles.supplierLogo}
          />
          <div className={styles.supplierDetails}>
            <h3 className={styles.supplierName}>{supplier.name}</h3>
            <div className={styles.rating}>
              {getRatingStars(supplier.rating)}
              <span className={styles.ratingValue}>{supplier.rating}</span>
              <span className={styles.reviewCount}>({supplier.reviewCount} đánh giá)</span>
            </div>
            <div className={styles.location}>
              📍 {supplier.location}
            </div>
          </div>
        </div>
        
        <div className={styles.priceSection}>
          <div className={styles.price}>
            {formatPrice(supplier.price)}đ
            <span className={styles.priceUnit}>/ngày</span>
          </div>
          {onEdit && (
            <button className={styles.editBtn} onClick={onEdit}>
              Thay đổi
            </button>
          )}
        </div>
      </div>

      <div className={styles.supplierFeatures}>
        {supplier.features && supplier.features.map((feature, index) => (
          <span key={index} className={styles.feature}>
            ✓ {feature}
          </span>
        ))}
      </div>

      <div className={styles.supplierPolicies}>
        <div className={styles.policyGrid}>
          <div className={styles.policyItem}>
            <span className={styles.policyLabel}>Chính sách hủy:</span>
            <span className={styles.policyValue}>{supplier.cancellationPolicy}</span>
          </div>
          
          <div className={styles.policyItem}>
            <span className={styles.policyLabel}>Bảo hiểm:</span>
            <span className={styles.policyValue}>{supplier.insurance}</span>
          </div>
          
          <div className={styles.policyItem}>
            <span className={styles.policyLabel}>Nhiên liệu:</span>
            <span className={styles.policyValue}>{supplier.fuelPolicy}</span>
          </div>
          
          <div className={styles.policyItem}>
            <span className={styles.policyLabel}>Giới hạn km:</span>
            <span className={styles.policyValue}>{supplier.mileageLimit}</span>
          </div>
        </div>
      </div>

      {supplier.pickupLocations && supplier.pickupLocations.length > 0 && (
        <div className={styles.pickupInfo}>
          <h4>Điểm nhận xe có sẵn:</h4>
          <div className={styles.pickupLocations}>
            {supplier.pickupLocations.map((location, index) => (
              <span key={index} className={styles.pickupLocation}>
                {location}
              </span>
            ))}
          </div>
        </div>
      )}

      {car && (
        <div className={styles.carInfo}>
          <h4>Thông tin xe:</h4>
          <div className={styles.carDetails}>
            <span>{car.car_name || car.name}</span>
            <span>{car.car_type || car.type}</span>
            <span>{car.transmission}</span>
            <span>{car.fuel_type}</span>
            {car.seats && <span>{car.seats} chỗ</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierCard;
