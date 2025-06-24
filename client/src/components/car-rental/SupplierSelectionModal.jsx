import React, { useState, useEffect } from 'react';
import styles from './SupplierSelectionModal.module.css';

const SupplierSelectionModal = ({ isOpen, onClose, car, onSupplierSelect }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    if (isOpen && car) {
      fetchSuppliers();
    }
  }, [isOpen, car]);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const response = await fetch(`${apiUrl}/api/car-rental-service/suppliers/${car._id || car.id}`);
      const data = await response.json();
      
      if (data.success) {
        setSuppliers(data.suppliers || []);
      }
    } catch (error) {
      console.error('Lỗi khi fetch suppliers:', error);
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSupplierSelect = (supplier) => {
    setSelectedSupplier(supplier);
  };

  const handleConfirmBooking = () => {
    if (selectedSupplier) {
      onSupplierSelect(selectedSupplier, car);
      onClose();
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Chọn nhà cung cấp cho {car?.car_name || car?.name}</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div className={styles.carSummary}>
          <img 
            src={car?.image_url || car?.image || 'https://via.placeholder.com/120x80'} 
            alt={car?.car_name || car?.name}
            className={styles.carImage}
          />
          <div className={styles.carInfo}>
            <h3>{car?.car_name || car?.name}</h3>
            <p>{car?.car_type || car?.type} • {car?.transmission} • {car?.fuel_type}</p>
          </div>
        </div>

        <div className={styles.suppliersContainer}>
          {loading ? (
            <div className={styles.loading}>Đang tải thông tin nhà cung cấp...</div>
          ) : suppliers.length === 0 ? (
            <div className={styles.noSuppliers}>Không tìm thấy nhà cung cấp</div>
          ) : (
            <div className={styles.suppliersList}>
              {suppliers.map((supplier) => (
                <div 
                  key={supplier.id}
                  className={`${styles.supplierCard} ${selectedSupplier?.id === supplier.id ? styles.selected : ''}`}
                  onClick={() => handleSupplierSelect(supplier)}
                >
                  <div className={styles.supplierHeader}>
                    <div className={styles.supplierInfo}>
                      <img src={supplier.logo} alt={supplier.name} className={styles.supplierLogo} />
                      <div>
                        <h4>{supplier.name}</h4>
                        <div className={styles.rating}>
                          <span className={styles.stars}>★★★★★</span>
                          <span className={styles.ratingValue}>{supplier.rating}</span>
                          <span className={styles.reviewCount}>({supplier.reviewCount} đánh giá)</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.priceInfo}>
                      <div className={styles.price}>{formatPrice(supplier.price)}đ</div>
                      <div className={styles.priceUnit}>/ngày</div>
                    </div>
                  </div>

                  <div className={styles.supplierDetails}>
                    <div className={styles.features}>
                      {supplier.features.map((feature, index) => (
                        <span key={index} className={styles.feature}>{feature}</span>
                      ))}
                    </div>

                    <div className={styles.locationInfo}>
                      <strong>Địa điểm nhận xe:</strong> {supplier.location}
                    </div>

                    <div className={styles.policyInfo}>
                      <div className={styles.policyItem}>
                        <strong>Chính sách hủy:</strong> {supplier.cancellationPolicy}
                      </div>
                      <div className={styles.policyItem}>
                        <strong>Bảo hiểm:</strong> {supplier.insurance}
                      </div>
                      <div className={styles.policyItem}>
                        <strong>Nhiên liệu:</strong> {supplier.fuelPolicy}
                      </div>
                      <div className={styles.policyItem}>
                        <strong>Giới hạn km:</strong> {supplier.mileageLimit}
                      </div>
                    </div>

                    <div className={styles.pickupLocations}>
                      <strong>Điểm nhận xe có sẵn:</strong>
                      <div className={styles.locations}>
                        {supplier.pickupLocations.map((location, index) => (
                          <span key={index} className={styles.location}>{location}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Hủy
          </button>
          <button 
            className={styles.confirmBtn} 
            onClick={handleConfirmBooking}
            disabled={!selectedSupplier}
          >
            Đặt xe với {selectedSupplier?.name || 'nhà cung cấp'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplierSelectionModal;
