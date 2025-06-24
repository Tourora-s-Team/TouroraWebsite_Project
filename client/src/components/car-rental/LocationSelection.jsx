import React, { useState, useEffect } from 'react';
import styles from './LocationSelection.module.css';

const LocationSelection = ({ pickupLocation, dropoffLocation, onLocationChange, supplier }) => {
  const [availableLocations, setAvailableLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sameLocation, setSameLocation] = useState(true);

  useEffect(() => {
    fetchAvailableLocations();
  }, [supplier]);

  const fetchAvailableLocations = async () => {
    setLoading(true);
    try {
      // Mock data - trong thực tế sẽ call API
      const locations = [
        {
          id: 'airport',
          name: 'Sân bay Tân Sơn Nhất',
          address: 'Tân Bình, TP. Hồ Chí Minh',
          type: 'airport',
          available24h: true,
          pickupFee: 0,
          coordinates: { lat: 10.8188, lng: 106.6519 },
          instructions: 'Quầy nhận xe tại tầng 1, khu vực D'
        },
        {
          id: 'district1',
          name: 'Quận 1 - Nguyễn Huệ',
          address: 'Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
          type: 'city_center',
          available24h: false,
          pickupFee: 50000,
          coordinates: { lat: 10.7769, lng: 106.7009 },
          instructions: 'Văn phòng tại tầng trệt tòa nhà ABC',
          workingHours: '07:00 - 22:00'
        },
        {
          id: 'district3',
          name: 'Quận 3 - Võ Văn Tần',
          address: 'Đường Võ Văn Tần, Quận 3, TP. Hồ Chí Minh',
          type: 'branch',
          available24h: false,
          pickupFee: 30000,
          coordinates: { lat: 10.7859, lng: 106.6890 },
          instructions: 'Chi nhánh tại số 123 Võ Văn Tần',
          workingHours: '08:00 - 20:00'
        },
        {
          id: 'district7',
          name: 'Quận 7 - Phú Mỹ Hưng',
          address: 'Khu đô thị Phú Mỹ Hưng, Quận 7, TP. Hồ Chí Minh',
          type: 'branch',
          available24h: false,
          pickupFee: 100000,
          coordinates: { lat: 10.7285, lng: 106.7206 },
          instructions: 'Văn phòng tại Crescent Mall',
          workingHours: '09:00 - 21:00'
        }
      ];
      
      setAvailableLocations(locations);
      
      // Set default locations
      if (!pickupLocation && locations.length > 0) {
        onLocationChange('pickupLocation', locations[0]);
        if (sameLocation) {
          onLocationChange('dropoffLocation', locations[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (type, location) => {
    onLocationChange(type, location);
    
    // Nếu chọn cùng địa điểm, tự động set dropoff
    if (type === 'pickupLocation' && sameLocation) {
      onLocationChange('dropoffLocation', location);
    }
  };

  const handleSameLocationToggle = (checked) => {
    setSameLocation(checked);
    if (checked && pickupLocation) {
      onLocationChange('dropoffLocation', pickupLocation);
    }
  };

  const getLocationIcon = (type) => {
    switch (type) {
      case 'airport': return '✈️';
      case 'city_center': return '🏢';
      case 'branch': return '🏪';
      default: return '📍';
    }
  };

  const formatFee = (fee) => {
    if (fee === 0) return 'Miễn phí';
    return `+${new Intl.NumberFormat('vi-VN').format(fee)}đ`;
  };

  if (loading) {
    return (
      <div className={styles.locationContainer}>
        <div className={styles.loading}>Đang tải địa điểm...</div>
      </div>
    );
  }

  return (
    <div className={styles.locationContainer}>
      <div className={styles.locationHeader}>
        <h3>Chọn địa điểm nhận và trả xe</h3>
        <p>Chọn địa điểm thuận tiện nhất cho bạn</p>
      </div>

      <div className={styles.sameLocationToggle}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={sameLocation}
            onChange={(e) => handleSameLocationToggle(e.target.checked)}
          />
          <span className={styles.checkmark}></span>
          Trả xe tại cùng địa điểm nhận xe
        </label>
      </div>

      <div className={styles.locationSelections}>
        {/* Pickup Location */}
        <div className={styles.locationSection}>
          <h4 className={styles.sectionTitle}>
            🟢 Địa điểm nhận xe
          </h4>
          <div className={styles.locationOptions}>
            {availableLocations.map(location => (
              <div
                key={`pickup-${location.id}`}
                className={`${styles.locationOption} ${
                  pickupLocation?.id === location.id ? styles.selected : ''
                }`}
                onClick={() => handleLocationSelect('pickupLocation', location)}
              >
                <div className={styles.locationInfo}>
                  <div className={styles.locationMain}>
                    <span className={styles.locationIcon}>{getLocationIcon(location.type)}</span>
                    <div className={styles.locationDetails}>
                      <h5 className={styles.locationName}>{location.name}</h5>
                      <p className={styles.locationAddress}>{location.address}</p>
                      {location.instructions && (
                        <p className={styles.instructions}>{location.instructions}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className={styles.locationMeta}>
                    <div className={styles.fee}>{formatFee(location.pickupFee)}</div>
                    <div className={styles.availability}>
                      {location.available24h ? (
                        <span className={styles.available24h}>24/7</span>
                      ) : (
                        <span className={styles.workingHours}>{location.workingHours}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dropoff Location */}
        {!sameLocation && (
          <div className={styles.locationSection}>
            <h4 className={styles.sectionTitle}>
              🔴 Địa điểm trả xe
            </h4>
            <div className={styles.locationOptions}>
              {availableLocations.map(location => (
                <div
                  key={`dropoff-${location.id}`}
                  className={`${styles.locationOption} ${
                    dropoffLocation?.id === location.id ? styles.selected : ''
                  }`}
                  onClick={() => handleLocationSelect('dropoffLocation', location)}
                >
                  <div className={styles.locationInfo}>
                    <div className={styles.locationMain}>
                      <span className={styles.locationIcon}>{getLocationIcon(location.type)}</span>
                      <div className={styles.locationDetails}>
                        <h5 className={styles.locationName}>{location.name}</h5>
                        <p className={styles.locationAddress}>{location.address}</p>
                        {location.instructions && (
                          <p className={styles.instructions}>{location.instructions}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className={styles.locationMeta}>
                      <div className={styles.fee}>{formatFee(location.pickupFee)}</div>
                      <div className={styles.availability}>
                        {location.available24h ? (
                          <span className={styles.available24h}>24/7</span>
                        ) : (
                          <span className={styles.workingHours}>{location.workingHours}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {(pickupLocation || dropoffLocation) && (
        <div className={styles.selectedSummary}>
          <h4>Địa điểm đã chọn</h4>
          <div className={styles.summaryItems}>
            {pickupLocation && (
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>🟢 Nhận xe:</span>
                <span className={styles.summaryValue}>{pickupLocation.name}</span>
                {pickupLocation.pickupFee > 0 && (
                  <span className={styles.summaryFee}>+{formatFee(pickupLocation.pickupFee)}</span>
                )}
              </div>
            )}
            
            {dropoffLocation && (
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>🔴 Trả xe:</span>
                <span className={styles.summaryValue}>{dropoffLocation.name}</span>
                {dropoffLocation.pickupFee > 0 && (
                  <span className={styles.summaryFee}>+{formatFee(dropoffLocation.pickupFee)}</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelection;
