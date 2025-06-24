import React from 'react';
import styles from './BookingCarDetails.module.css';

const BookingCarDetails = ({ car, supplier, rental, readonly = false }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  const getRentalDuration = () => {
    if (!rental.startDate || !rental.endDate) return '';
    const start = new Date(rental.startDate);
    const end = new Date(rental.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return `${days} ngày`;
  };

  return (
    <div className={styles.carDetailsContainer}>
      <div className={styles.carHeader}>
        <h2>Chi tiết xe thuê</h2>
        {!readonly && (
          <span className={styles.editHint}>Kiểm tra thông tin xe và thời gian thuê</span>
        )}
      </div>

      <div className={styles.carMainInfo}>
        <div className={styles.carImageSection}>
          <img 
            src={car?.image_url || car?.image || 'https://via.placeholder.com/400x250'} 
            alt={car?.car_name || car?.name}
            className={styles.carImage}
          />
          <div className={styles.carGallery}>
            <span className={styles.galleryHint}>+3 ảnh khác</span>
          </div>
        </div>

        <div className={styles.carInfoSection}>
          <div className={styles.carBasicInfo}>
            <h3 className={styles.carName}>{car?.car_name || car?.name}</h3>
            <p className={styles.carType}>{car?.car_type || car?.type}</p>
            
            <div className={styles.carSpecs}>
              <div className={styles.spec}>
                <span className={styles.specIcon}>🚗</span>
                <span>{car?.transmission || 'Automatic'}</span>
              </div>
              <div className={styles.spec}>
                <span className={styles.specIcon}>⛽</span>
                <span>{car?.fuel_type || 'Gasoline'}</span>
              </div>
              <div className={styles.spec}>
                <span className={styles.specIcon}>👥</span>
                <span>{car?.seats || 5} chỗ</span>
              </div>
              <div className={styles.spec}>
                <span className={styles.specIcon}>🎒</span>
                <span>{car?.luggage || 2} túi lớn</span>
              </div>
            </div>

            {car?.features && (
              <div className={styles.carFeatures}>
                <h4>Tính năng xe</h4>
                <div className={styles.features}>
                  {car.features.map((feature, index) => (
                    <span key={index} className={styles.feature}>
                      ✓ {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={styles.supplierInfo}>
            <h4>Nhà cung cấp</h4>
            <div className={styles.supplierCard}>
              <img 
                src={supplier?.logo || 'https://via.placeholder.com/80x40'} 
                alt={supplier?.name}
                className={styles.supplierLogo}
              />
              <div className={styles.supplierDetails}>
                <h5>{supplier?.name}</h5>
                <div className={styles.rating}>
                  <span className={styles.stars}>★★★★★</span>
                  <span>{supplier?.rating}</span>
                  <span className={styles.reviewCount}>({supplier?.reviewCount} đánh giá)</span>
                </div>
                <p className={styles.supplierLocation}>📍 {supplier?.location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.rentalInfo}>
        <h4>Thông tin thuê xe</h4>
        <div className={styles.rentalDetails}>
          <div className={styles.rentalItem}>
            <div className={styles.rentalLabel}>Ngày nhận xe</div>
            <div className={styles.rentalValue}>
              <strong>{formatDate(rental.startDate)}</strong>
              <span className={styles.time}>Lúc {formatTime(rental.startTime)}</span>
            </div>
          </div>
          
          <div className={styles.rentalDivider}>→</div>
          
          <div className={styles.rentalItem}>
            <div className={styles.rentalLabel}>Ngày trả xe</div>
            <div className={styles.rentalValue}>
              <strong>{formatDate(rental.endDate)}</strong>
              <span className={styles.time}>Lúc {formatTime(rental.endTime)}</span>
            </div>
          </div>
          
          <div className={styles.rentalItem}>
            <div className={styles.rentalLabel}>Thời gian thuê</div>
            <div className={styles.rentalValue}>
              <strong>{getRentalDuration()}</strong>
            </div>
          </div>
          
          <div className={styles.rentalItem}>
            <div className={styles.rentalLabel}>Loại thuê</div>
            <div className={styles.rentalValue}>
              <strong>{rental.mode === 'driver' ? 'Có tài xế' : 'Tự lái'}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.importantInfo}>
        <h4>Thông tin quan trọng</h4>
        <div className={styles.infoList}>
          <div className={styles.infoItem}>
            <strong>Chính sách hủy:</strong> {supplier?.cancellationPolicy || 'Miễn phí hủy trước 24h'}
          </div>
          <div className={styles.infoItem}>
            <strong>Bảo hiểm:</strong> {supplier?.insurance || 'Bảo hiểm cơ bản'}
          </div>
          <div className={styles.infoItem}>
            <strong>Nhiên liệu:</strong> {supplier?.fuelPolicy || 'Đầy-Đầy (Full-Full)'}
          </div>
          <div className={styles.infoItem}>
            <strong>Giới hạn km:</strong> {supplier?.mileageLimit || 'Không giới hạn'}
          </div>
          <div className={styles.infoItem}>
            <strong>Độ tuổi tối thiểu:</strong> {supplier?.policies?.minAge || 21} tuổi
          </div>
          <div className={styles.infoItem}>
            <strong>Bằng lái:</strong> {supplier?.policies?.drivingLicenseRequired || 'Bằng lái quốc tế hoặc trong nước'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCarDetails;
