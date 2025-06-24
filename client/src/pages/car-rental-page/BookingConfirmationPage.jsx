import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './BookingConfirmationPage.module.css';

const BookingConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId, bookingData } = location.state || {};

  if (!bookingId || !bookingData) {
    return (
      <div className={styles.errorContainer}>
        <h2>Không tìm thấy thông tin đặt xe</h2>
        <button onClick={() => navigate('/car-rental-service')}>
          Quay về trang chủ
        </button>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.confirmationContainer}>
      <div className={styles.header}>
        <div className={styles.successIcon}>✓</div>
        <h1>Đặt xe thành công!</h1>
        <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi</p>
      </div>

      <div className={styles.bookingInfo}>
        <div className={styles.bookingHeader}>
          <h3>Thông tin đặt xe</h3>
          <div className={styles.bookingId}>Mã đặt xe: <strong>{bookingId}</strong></div>
        </div>

        <div className={styles.bookingDetails}>
          <div className={styles.carInfo}>
            <h4>Thông tin xe</h4>
            <div className={styles.carCard}>
              <img 
                src={bookingData.car?.image_url || bookingData.car?.image || 'https://via.placeholder.com/150x100'} 
                alt={bookingData.car?.car_name || bookingData.car?.name}
                className={styles.carImage}
              />
              <div className={styles.carDetails}>
                <h5>{bookingData.car?.car_name || bookingData.car?.name}</h5>
                <p>{bookingData.car?.car_type || bookingData.car?.type} • {bookingData.car?.transmission} • {bookingData.car?.fuel_type}</p>
                <p><strong>Nhà cung cấp:</strong> {bookingData.supplier?.name}</p>
              </div>
            </div>
          </div>

          <div className={styles.rentalInfo}>
            <h4>Thời gian thuê</h4>
            <div className={styles.rentalDetails}>
              <div className={styles.dateTime}>
                <strong>Ngày nhận xe:</strong> {formatDate(bookingData.rental.startDate)} lúc {bookingData.rental.startTime}
              </div>
              <div className={styles.dateTime}>
                <strong>Ngày trả xe:</strong> {formatDate(bookingData.rental.endDate)} lúc {bookingData.rental.endTime}
              </div>
              <div className={styles.duration}>
                <strong>Thời gian thuê:</strong> {bookingData.pricing.days} ngày
              </div>
            </div>
          </div>

          <div className={styles.locationInfo}>
            <h4>Địa điểm</h4>
            <div className={styles.locations}>
              <div className={styles.location}>
                <strong>Điểm nhận xe:</strong> {bookingData.pickupLocation?.name || 'Chưa chọn'}
              </div>
              <div className={styles.location}>
                <strong>Điểm trả xe:</strong> {bookingData.dropoffLocation?.name || 'Chưa chọn'}
              </div>
            </div>
          </div>

          <div className={styles.customerInfo}>
            <h4>Thông tin khách hàng</h4>
            <div className={styles.customerDetails}>
              <p><strong>Họ tên:</strong> {bookingData.customerInfo.fullName}</p>
              <p><strong>Email:</strong> {bookingData.customerInfo.email}</p>
              <p><strong>Điện thoại:</strong> {bookingData.customerInfo.phone}</p>
              {bookingData.customerInfo.address && (
                <p><strong>Địa chỉ:</strong> {bookingData.customerInfo.address}</p>
              )}
            </div>
          </div>

          <div className={styles.pricingInfo}>
            <h4>Chi phí</h4>
            <div className={styles.pricing}>
              <div className={styles.priceRow}>
                <span>Giá cơ bản ({bookingData.pricing.days} ngày):</span>
                <span>{formatPrice(bookingData.pricing.basePrice)}đ</span>
              </div>
              {bookingData.pricing.extraCharges > 0 && (
                <div className={styles.priceRow}>
                  <span>Dịch vụ thêm:</span>
                  <span>{formatPrice(bookingData.pricing.extraCharges)}đ</span>
                </div>
              )}
              <div className={styles.priceRow}>
                <span>Thuế VAT (10%):</span>
                <span>{formatPrice(bookingData.pricing.taxes)}đ</span>
              </div>
              <div className={styles.totalRow}>
                <span><strong>Tổng cộng:</strong></span>
                <span><strong>{formatPrice(bookingData.pricing.total)}đ</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.nextSteps}>
        <h3>Bước tiếp theo</h3>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h4>Xác nhận thanh toán</h4>
              <p>Chúng tôi sẽ gửi thông tin thanh toán qua email trong vòng 15 phút</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h4>Chuẩn bị giấy tờ</h4>
              <p>Mang theo CMND/CCCD và bằng lái xe khi nhận xe</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h4>Liên hệ nhà cung cấp</h4>
              <p>Gọi hotline {bookingData.supplier?.phone || '1900-xxxx'} nếu cần hỗ trợ</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button 
          className={styles.primaryBtn}
          onClick={() => navigate('/car-rental-service')}
        >
          Quay về trang chủ
        </button>
        <button 
          className={styles.secondaryBtn}
          onClick={() => window.print()}
        >
          In phiếu đặt xe
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
