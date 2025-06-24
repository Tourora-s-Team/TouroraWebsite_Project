import React, { useState, useEffect } from 'react';
import DateInput from './DateInput';
import styles from './CustomerInfoForm.module.css';

const CustomerInfoForm = ({ customerInfo, onCustomerInfoChange, onExtrasChange, selectedExtras = [] }) => {  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    numberPhone: '',
    dateOfBirth: '',
    nationality: 'Vietnam',
    driverLicense: '',
    licenseIssueDate: '',
    licenseExpiryDate: '',
    emergencyContact: '',
    emergencyPhone: '',
    specialRequests: ''
  });
  // Update form data when customerInfo changes (from auto-fill)
  useEffect(() => {
    console.log('CustomerInfoForm - customerInfo changed:', customerInfo);
    
    if (customerInfo && Object.keys(customerInfo).length > 0) {      const newFormData = {
        fullname: customerInfo.fullname || '',
        email: customerInfo.email || '',
        numberPhone: customerInfo.numberPhone || '',
        dateOfBirth: customerInfo.dateOfBirth || '',
        nationality: customerInfo.nationality || 'Vietnam',
        driverLicense: customerInfo.driverLicense || '',
        licenseIssueDate: customerInfo.licenseIssueDate || '',
        licenseExpiryDate: customerInfo.licenseExpiryDate || '',
        emergencyContact: customerInfo.emergencyContact || '',
        emergencyPhone: customerInfo.emergencyPhone || '',
        specialRequests: customerInfo.specialRequests || ''
      };
      
      console.log('Setting formData to:', newFormData);
      setFormData(newFormData);
    }
  }, [customerInfo]);

  const [availableExtras] = useState([
    {
      id: 'insurance_plus',
      name: 'Bảo hiểm mở rộng',
      description: 'Bảo hiểm toàn diện cho xe và người',
      price: 200000,
      type: 'insurance',
      popular: true
    },
    {
      id: 'gps',
      name: 'Thiết bị GPS',
      description: 'Định vị và dẫn đường tiếng Việt',
      price: 50000,
      type: 'equipment'
    },
    {
      id: 'child_seat',
      name: 'Ghế trẻ em',
      description: 'Ghế an toàn cho trẻ từ 2-7 tuổi',
      price: 100000,
      type: 'equipment'
    },
    {
      id: 'additional_driver',
      name: 'Tài xế phụ',
      description: 'Thêm một tài xế được phép lái xe',
      price: 150000,
      type: 'service'
    },
    {
      id: 'wifi_hotspot',
      name: 'WiFi di động',
      description: 'Thiết bị phát WiFi 4G trong xe',
      price: 80000,
      type: 'equipment'
    },
    {
      id: 'full_tank',
      name: 'Đổ đầy bình xăng',
      description: 'Nhận xe với bình xăng đầy',
      price: 300000,
      type: 'fuel'
    }
  ]);

  const handleInputChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    onCustomerInfoChange(newFormData);
  };

  const handleExtraToggle = (extra) => {
    const isSelected = selectedExtras.some(item => item.id === extra.id);
    let newExtras;
    
    if (isSelected) {
      newExtras = selectedExtras.filter(item => item.id !== extra.id);
    } else {
      newExtras = [...selectedExtras, extra];
    }
    
    onExtrasChange(newExtras);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const getExtraIcon = (type) => {
    switch (type) {
      case 'insurance': return '🛡️';
      case 'equipment': return '📱';
      case 'service': return '👤';
      case 'fuel': return '⛽';
      default: return '✨';
    }
  };  const hasAutoFilledData = () => {
    return customerInfo && Object.keys(customerInfo).length > 0 && 
           (customerInfo.fullname || customerInfo.email || customerInfo.numberPhone);
  };

  return (
    <div className={styles.customerFormContainer}>
      <div className={styles.formHeader}>
        <h3>Thông tin khách hàng</h3>
        <p>Vui lòng điền đầy đủ thông tin để hoàn tất đặt xe</p>
        {hasAutoFilledData() && (
          <div className={styles.autoFillNotice}>
            <span className={styles.autoFillIcon}>✅</span>
            Thông tin đã được tự động điền từ tài khoản của bạn. Vui lòng kiểm tra và cập nhật nếu cần.
          </div>
        )}
      </div>

      <form className={styles.customerForm}>
        {/* Personal Information */}
        <div className={styles.formSection}>
          <h4 className={styles.sectionTitle}>Thông tin cá nhân</h4>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Họ và tên <span className={styles.required}>*</span>
              </label>              <input
                type="text"
                className={styles.input}
                value={formData.fullname}
                onChange={(e) => handleInputChange('fullname', e.target.value)}
                placeholder="Nhập họ và tên đầy đủ"
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Email <span className={styles.required}>*</span>
              </label>
              <input
                type="email"
                className={styles.input}
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="email@example.com"
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Số điện thoại <span className={styles.required}>*</span>
              </label>              <input
                type="tel"
                className={styles.input}
                value={formData.numberPhone}
                onChange={(e) => handleInputChange('numberPhone', e.target.value)}
                placeholder="0987654321"
                required
              />
            </div>
          </div>          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Ngày sinh</label>
              <DateInput
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                placeholder="dd/mm/yyyy"
                className={styles.input}
                isAutoFilled={hasAutoFilledData() && formData.dateOfBirth}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Quốc tịch</label>
              <select
                className={styles.input}
                value={formData.nationality}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
              >
                <option value="Vietnam">Việt Nam</option>
                <option value="USA">Hoa Kỳ</option>
                <option value="UK">Vương quốc Anh</option>
                <option value="Japan">Nhật Bản</option>
                <option value="Korea">Hàn Quốc</option>
                <option value="Other">Khác</option>
              </select>
            </div>
          </div>
        </div>

        {/* Driver License Information */}
        <div className={styles.formSection}>
          <h4 className={styles.sectionTitle}>Thông tin bằng lái xe</h4>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Số bằng lái <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                value={formData.driverLicense}
                onChange={(e) => handleInputChange('driverLicense', e.target.value)}
                placeholder="Nhập số bằng lái xe"
                required
              />
            </div>
          </div>          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Ngày cấp</label>
              <DateInput
                value={formData.licenseIssueDate}
                onChange={(e) => handleInputChange('licenseIssueDate', e.target.value)}
                placeholder="dd/mm/yyyy"
                className={styles.input}
                isAutoFilled={hasAutoFilledData() && formData.licenseIssueDate}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Ngày hết hạn</label>
              <DateInput
                value={formData.licenseExpiryDate}
                onChange={(e) => handleInputChange('licenseExpiryDate', e.target.value)}
                placeholder="dd/mm/yyyy"
                className={styles.input}
                isAutoFilled={hasAutoFilledData() && formData.licenseExpiryDate}
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className={styles.formSection}>
          <h4 className={styles.sectionTitle}>Liên hệ khẩn cấp</h4>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Tên người liên hệ</label>
              <input
                type="text"
                className={styles.input}
                value={formData.emergencyContact}
                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                placeholder="Tên người thân"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Số điện thoại</label>
              <input
                type="tel"
                className={styles.input}
                value={formData.emergencyPhone}
                onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                placeholder="0987654321"
              />
            </div>
          </div>
        </div>

        {/* Special Requests */}
        <div className={styles.formSection}>
          <h4 className={styles.sectionTitle}>Yêu cầu đặc biệt</h4>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Ghi chú (tùy chọn)</label>
            <textarea
              className={styles.textarea}
              value={formData.specialRequests}
              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
              placeholder="Nhập yêu cầu đặc biệt hoặc ghi chú..."
              rows="3"
            />
          </div>
        </div>
      </form>

      {/* Additional Services */}
      <div className={styles.extrasSection}>
        <div className={styles.extrasHeader}>
          <h3>Dịch vụ bổ sung</h3>
          <p>Thêm các dịch vụ để chuyến đi hoàn hảo hơn</p>
        </div>

        <div className={styles.extrasList}>
          {availableExtras.map(extra => (
            <div 
              key={extra.id}
              className={`${styles.extraItem} ${
                selectedExtras.some(item => item.id === extra.id) ? styles.selected : ''
              }`}
              onClick={() => handleExtraToggle(extra)}
            >
              <div className={styles.extraInfo}>
                <div className={styles.extraMain}>
                  <span className={styles.extraIcon}>{getExtraIcon(extra.type)}</span>
                  <div className={styles.extraDetails}>
                    <h5 className={styles.extraName}>
                      {extra.name}
                      {extra.popular && (
                        <span className={styles.popularBadge}>Phổ biến</span>
                      )}
                    </h5>
                    <p className={styles.extraDescription}>{extra.description}</p>
                  </div>
                </div>
                
                <div className={styles.extraPrice}>
                  +{formatPrice(extra.price)}đ
                  <div className={styles.priceUnit}>/ngày</div>
                </div>
              </div>
              
              <div className={styles.extraCheckbox}>
                <input
                  type="checkbox"
                  checked={selectedExtras.some(item => item.id === extra.id)}
                  onChange={() => handleExtraToggle(extra)}
                />
                <span className={styles.checkmark}></span>
              </div>
            </div>
          ))}
        </div>

        {selectedExtras.length > 0 && (
          <div className={styles.selectedExtras}>
            <h4>Dịch vụ đã chọn:</h4>
            <div className={styles.selectedList}>
              {selectedExtras.map(extra => (
                <span key={extra.id} className={styles.selectedExtra}>
                  {extra.name} (+{formatPrice(extra.price)}đ)
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerInfoForm;
