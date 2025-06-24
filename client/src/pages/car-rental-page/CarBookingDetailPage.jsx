import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { UserContext } from '../../contexts/UserContext';
import BookingCarDetails from '../../components/car-rental/BookingCarDetails';
import LocationSelection from '../../components/car-rental/LocationSelection';
import BookingSummary from '../../components/car-rental/BookingSummary';
import CustomerInfoForm from '../../components/car-rental/CustomerInfoForm';
import LoginModal from '../../components/car-rental/LoginModal';
import styles from './CarBookingDetailPage.module.css';

const CarBookingDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const carRentalData = useSelector(state => state.carRental);
  const { user } = useContext(UserContext);

  // Lấy dữ liệu từ navigation state hoặc Redux
  const { supplier, car } = location.state || {};

  const [bookingData, setBookingData] = useState({
    car: car,
    supplier: supplier,
    rental: {
      startDate: carRentalData?.startDate || '',
      startTime: carRentalData?.startTime || '',
      endDate: carRentalData?.endDate || '',
      endTime: carRentalData?.endTime || '',
      mode: carRentalData?.mode || 'driver',
      location: carRentalData?.location || ''
    },
    pickupLocation: null,
    dropoffLocation: null,
    customerInfo: {},
    extras: [],
    pricing: {
      basePrice: 0,
      extraCharges: 0,
      taxes: 0,
      total: 0,
      currency: 'VND'
    }
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);  // Auto-fill customer info if user is logged in
  const isCustomerInfoFilled = Object.keys(bookingData.customerInfo || {}).length > 0;
  useEffect(() => {
    if (user && !isCustomerInfoFilled) {
      const autoFilledInfo = {
        fullname: user.fullname || user.name || '',
        email: user.email || '',
        numberPhone: user.numberPhone || '',
        dateOfBirth: user.dateOfBirth || '',
        nationality: user.nationality || 'Vietnam',
        driverLicense: user.driverLicense?.number || '',
        licenseIssueDate: user.driverLicense?.issueDate || '',
        licenseExpiryDate: user.driverLicense?.expiryDate || '',
        emergencyContact: user.emergencyContact?.name || '',
        emergencyPhone: user.emergencyContact?.phone || '',
        specialRequests: ''
      };

      setBookingData(prev => ({
        ...prev,
        customerInfo: autoFilledInfo
      }));
    }
  }, [user, isCustomerInfoFilled]);

  const calculatePricing = useCallback(() => {
    if (!car || !supplier) return;

    const startDate = new Date(bookingData.rental.startDate);
    const endDate = new Date(bookingData.rental.endDate);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) || 1;

    const basePrice = (supplier.price || car.price_per_day || 0) * days;
    const extraCharges = bookingData.extras.reduce((sum, extra) => sum + extra.price, 0);
    const taxes = Math.round(basePrice * 0.1); // 10% VAT
    const total = basePrice + extraCharges + taxes;

    setBookingData(prev => ({
      ...prev,
      pricing: {
        basePrice,
        extraCharges,
        taxes,
        total,
        days,
        currency: 'VND'
      }
    }));
  }, [car, supplier, bookingData.rental, bookingData.extras]);
  
  useEffect(() => {
    if (!car || !supplier) {
      // Redirect về trang search nếu không có dữ liệu
      navigate('/car-rental-service/search');
      return;
    }

    // Tính giá cơ bản
    calculatePricing();
  }, [car, supplier, bookingData.rental,  calculatePricing, navigate]);

  

  const handleLocationChange = (type, location) => {
    setBookingData(prev => ({
      ...prev,
      [type]: location
    }));
  };

  const handleCustomerInfoChange = (customerInfo) => {
    setBookingData(prev => ({
      ...prev,
      customerInfo
    }));
  };

  const handleExtrasChange = (extras) => {
    setBookingData(prev => ({
      ...prev,
      extras
    }));
    calculatePricing();
  };
  const handleContinue = () => {
    // Check if user is logged in when moving to step 2
    if (currentStep === 1 && !user) {
      setShowLoginModal(true);
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleBookingConfirm();
    }
  }; const handleLoginSuccess = (userData) => {
    console.log('Login success, userData:', userData);

    // Auto-fill customer info after successful login
    const autoFilledInfo = {
      fullname: userData.fullname || userData.name || '',
      email: userData.email || '',
      numberPhone: userData.numberPhone || '',
      dateOfBirth: userData.dateOfBirth || '',
      nationality: userData.nationality || 'Vietnam',
      driverLicense: userData.driverLicense?.number || '',
      licenseIssueDate: userData.driverLicense?.issueDate || '',
      licenseExpiryDate: userData.driverLicense?.expiryDate || '',
      emergencyContact: userData.emergencyContact?.name || '',
      emergencyPhone: userData.emergencyContact?.phone || '',
      specialRequests: ''
    };

    console.log('Auto-filled info:', autoFilledInfo);

    setBookingData(prev => ({
      ...prev,
      customerInfo: autoFilledInfo
    }));

    // Proceed to next step
    setCurrentStep(2);
  };

  const handleBookingConfirm = async () => {
    setLoading(true);
    try {
      // Call API để tạo booking
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const response = await fetch(`${apiUrl}/api/car-rental-service/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (result.success) {
        // Redirect đến trang thanh toán hoặc confirmation
        navigate('/booking-confirmation', {
          state: {
            bookingId: result.bookingId,
            bookingData: bookingData
          }
        });
      } else {
        alert('Có lỗi xảy ra khi đặt xe: ' + result.message);
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Có lỗi xảy ra khi đặt xe. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Chi tiết xe và địa điểm';
      case 2: return 'Thông tin khách hàng';
      case 3: return 'Xác nhận đặt xe';
      default: return '';
    }
  };

  if (!car || !supplier) {
    return (
      <div className={styles.errorContainer}>
        <h2>Không tìm thấy thông tin xe</h2>
        <button onClick={() => navigate('/car-rental-service/search')}>
          Quay lại tìm kiếm
        </button>
      </div>
    );
  }

  return (
    <div className={styles.bookingContainer}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          ← Quay lại
        </button>
        <div className={styles.stepIndicator}>
          <div className={styles.stepProgress}>
            <div className={styles.steps}>
              {[1, 2, 3].map(step => (
                <div
                  key={step}
                  className={`${styles.step} ${currentStep >= step ? styles.active : ''}`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className={styles.stepTitle}>{getStepTitle()}</div>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.mainContent}>
          {currentStep === 1 && (
            <>
              <BookingCarDetails
                car={car}
                supplier={supplier}
                rental={bookingData.rental}
              />
              <LocationSelection
                pickupLocation={bookingData.pickupLocation}
                dropoffLocation={bookingData.dropoffLocation}
                onLocationChange={handleLocationChange}
                supplier={supplier}
              />
            </>
          )}

          {currentStep === 2 && (
            <CustomerInfoForm
              customerInfo={bookingData.customerInfo}
              onCustomerInfoChange={handleCustomerInfoChange}
              onExtrasChange={handleExtrasChange}
              selectedExtras={bookingData.extras}
            />
          )}

          {currentStep === 3 && (
            <div className={styles.confirmationStep}>
              <h3>Xác nhận thông tin đặt xe</h3>
              <BookingCarDetails
                car={car}
                supplier={supplier}
                rental={bookingData.rental}
                readonly={true}
              />              <div className={styles.customerSummary}>
                <h4>Thông tin khách hàng</h4>
                <p><strong>Họ tên:</strong> {bookingData.customerInfo.fullname}</p>
                <p><strong>Email:</strong> {bookingData.customerInfo.email}</p>
                <p><strong>Điện thoại:</strong> {bookingData.customerInfo.numberPhone}</p>
              </div>
            </div>
          )}
        </div>

        <div className={styles.sidebar}>
          <BookingSummary
            car={car}
            supplier={supplier}
            rental={bookingData.rental}
            pickupLocation={bookingData.pickupLocation}
            dropoffLocation={bookingData.dropoffLocation}
            pricing={bookingData.pricing}
            extras={bookingData.extras}
            onContinue={handleContinue}
            currentStep={currentStep}
            loading={loading} canContinue={
              currentStep === 1 ? (bookingData.pickupLocation && bookingData.dropoffLocation) :
                currentStep === 2 ? (bookingData.customerInfo.fullname && bookingData.customerInfo.email) :
                  true
            }
          />

          {/* Login prompt for step 1 if not logged in */}
          {currentStep === 1 && !user && (
            <div className={styles.loginPrompt}>
              <div className={styles.loginPromptContent}>
                <h4>💡 Mẹo: Đăng nhập để tiết kiệm thời gian</h4>
                <p>Đăng nhập để thông tin cá nhân được tự động điền vào form booking</p>
                <button
                  className={styles.loginPromptBtn}
                  onClick={() => setShowLoginModal(true)}
                >
                  Đăng nhập ngay
                </button>
              </div>
            </div>
          )}</div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default CarBookingDetailPage;
