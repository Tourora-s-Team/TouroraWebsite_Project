import React from 'react';
import styles from './BookingSummary.module.css';

const BookingSummary = ({ 
  car, 
  supplier, 
  rental, 
  pickupLocation, 
  dropoffLocation, 
  pricing, 
  extras = [], 
  onContinue, 
  currentStep, 
  loading, 
  canContinue 
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getButtonText = () => {
    switch (currentStep) {
      case 1: return 'Tiếp tục';
      case 2: return 'Xác nhận thông tin';
      case 3: return 'Xác nhận đặt xe';
      default: return 'Tiếp tục';
    }
  };

  const getLocationFees = () => {
    let total = 0;
    if (pickupLocation?.pickupFee) total += pickupLocation.pickupFee;
    if (dropoffLocation?.pickupFee && dropoffLocation.id !== pickupLocation?.id) {
      total += dropoffLocation.pickupFee;
    }
    return total;
  };

  return (
    <div className={styles.summaryContainer}>
      <div className={styles.summaryCard}>
        {/* Car Info */}
        <div className={styles.carSummary}>
          <img 
            src={car?.image_url || car?.image || 'https://via.placeholder.com/120x80'} 
            alt={car?.car_name || car?.name}
            className={styles.carImage}
          />
          <div className={styles.carInfo}>
            <h4 className={styles.carName}>{car?.car_name || car?.name}</h4>
            <p className={styles.carType}>{car?.car_type || car?.type}</p>
            <div className={styles.supplierInfo}>
              <img 
                src={supplier?.logo || 'https://via.placeholder.com/40x20'} 
                alt={supplier?.name}
                className={styles.supplierLogo}
              />
              <span className={styles.supplierName}>{supplier?.name}</span>
            </div>
          </div>
        </div>

        {/* Rental Details */}
        <div className={styles.rentalSummary}>
          <h4>Chi tiết thuê xe</h4>
          <div className={styles.rentalDetails}>
            <div className={styles.rentalItem}>
              <span className={styles.label}>Nhận xe:</span>
              <span className={styles.value}>
                {formatDate(rental.startDate)} - {rental.startTime}
              </span>
            </div>
            <div className={styles.rentalItem}>
              <span className={styles.label}>Trả xe:</span>
              <span className={styles.value}>
                {formatDate(rental.endDate)} - {rental.endTime}
              </span>
            </div>
            <div className={styles.rentalItem}>
              <span className={styles.label}>Thời gian:</span>
              <span className={styles.value}>
                {pricing.days || 1} ngày
              </span>
            </div>
            <div className={styles.rentalItem}>
              <span className={styles.label}>Loại thuê:</span>
              <span className={styles.value}>
                {rental.mode === 'driver' ? 'Có tài xế' : 'Tự lái'}
              </span>
            </div>
          </div>
        </div>

        {/* Location Summary */}
        {(pickupLocation || dropoffLocation) && (
          <div className={styles.locationSummary}>
            <h4>Địa điểm</h4>
            <div className={styles.locationDetails}>
              {pickupLocation && (
                <div className={styles.locationItem}>
                  <span className={styles.locationIcon}>🟢</span>
                  <div className={styles.locationInfo}>
                    <span className={styles.locationName}>{pickupLocation.name}</span>
                    {pickupLocation.pickupFee > 0 && (
                      <span className={styles.locationFee}>
                        +{formatPrice(pickupLocation.pickupFee)}đ
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {dropoffLocation && dropoffLocation.id !== pickupLocation?.id && (
                <div className={styles.locationItem}>
                  <span className={styles.locationIcon}>🔴</span>
                  <div className={styles.locationInfo}>
                    <span className={styles.locationName}>{dropoffLocation.name}</span>
                    {dropoffLocation.pickupFee > 0 && (
                      <span className={styles.locationFee}>
                        +{formatPrice(dropoffLocation.pickupFee)}đ
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Extras */}
        {extras.length > 0 && (
          <div className={styles.extrasSummary}>
            <h4>Dịch vụ thêm</h4>
            <div className={styles.extrasDetails}>
              {extras.map((extra, index) => (
                <div key={index} className={styles.extraItem}>
                  <span className={styles.extraName}>{extra.name}</span>
                  <span className={styles.extraPrice}>+{formatPrice(extra.price)}đ</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing Breakdown */}
        <div className={styles.pricingSummary}>
          <h4>Chi tiết giá</h4>
          <div className={styles.pricingDetails}>
            <div className={styles.pricingItem}>
              <span className={styles.label}>
                Giá thuê xe ({pricing.days || 1} ngày)
              </span>
              <span className={styles.value}>{formatPrice(pricing.basePrice)}đ</span>
            </div>
            
            {getLocationFees() > 0 && (
              <div className={styles.pricingItem}>
                <span className={styles.label}>Phí địa điểm</span>
                <span className={styles.value}>+{formatPrice(getLocationFees())}đ</span>
              </div>
            )}
            
            {pricing.extraCharges > 0 && (
              <div className={styles.pricingItem}>
                <span className={styles.label}>Dịch vụ thêm</span>
                <span className={styles.value}>+{formatPrice(pricing.extraCharges)}đ</span>
              </div>
            )}
            
            <div className={styles.pricingItem}>
              <span className={styles.label}>Thuế VAT (10%)</span>
              <span className={styles.value}>+{formatPrice(pricing.taxes)}đ</span>
            </div>
            
            <div className={styles.pricingDivider}></div>
            
            <div className={styles.pricingTotal}>
              <span className={styles.totalLabel}>Tổng cộng</span>
              <span className={styles.totalValue}>
                {formatPrice(pricing.total + getLocationFees())}đ
              </span>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className={styles.importantNotes}>
          <h4>Lưu ý quan trọng</h4>
          <ul className={styles.notesList}>
            <li>Giá đã bao gồm thuế VAT</li>
            <li>Không bao gồm phí cầu đường, phí đỗ xe</li>
            <li>Cần xuất trình bằng lái xe hợp lệ khi nhận xe</li>
            <li>Có thể hủy miễn phí trước 24h</li>
          </ul>
        </div>

        {/* Continue Button */}
        <button 
          className={`${styles.continueBtn} ${!canContinue ? styles.disabled : ''}`}
          onClick={onContinue}
          disabled={!canContinue || loading}
        >
          {loading ? (
            <span className={styles.loading}>
              <span className={styles.spinner}></span>
              Đang xử lý...
            </span>
          ) : (
            getButtonText()
          )}
        </button>

        {!canContinue && currentStep === 1 && (
          <p className={styles.continueHint}>
            Vui lòng chọn địa điểm nhận và trả xe để tiếp tục
          </p>
        )}

        {!canContinue && currentStep === 2 && (
          <p className={styles.continueHint}>
            Vui lòng điền đầy đủ thông tin khách hàng để tiếp tục
          </p>
        )}
      </div>

      {/* Help Section */}
      <div className={styles.helpSection}>
        <h4>Cần hỗ trợ?</h4>
        <div className={styles.helpOptions}>
          <a href="tel:1900123456" className={styles.helpOption}>
            📞 Hotline: 1900 123 456
          </a>
          <a href="mailto:support@example.com" className={styles.helpOption}>
            ✉️ Email hỗ trợ
          </a>
          <button className={styles.helpOption}>
            💬 Chat trực tuyến
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
