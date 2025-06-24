import React from 'react';
import styles from './PopularCarRentalLocations.module.css';

const locations = [
  { name: 'Jakarta', image: '../assets/images/jakarta.webp' },
  { name: 'Bandung', image: '../assets/images/bandung.webp' },
  { name: 'Bali', image: '../assets/images/bali.webp' },
  { name: 'Kuala Lumpur', image: '../assets/images/kuala-lumpur.webp' },
  { name: 'Bangkok', image: '../assets/images/bangkok.webp' },
  { name: 'Sydney', image: '../assets/images/sydney.webp' },
  { name: 'Manila', image: '../assets/images/manila.webp' },
  { name: 'Melbourne', image: '../assets/images/melbourne.webp' },
  { name: 'Thành phố Hồ Chí Minh', image: '../assets/images/ho-chi-minh.webp' },
];

const PopularCarRentalLocations = () => {
  return (
    <div className={styles.popularLocations}>
      <h2>Các điểm thuê xe phổ biến</h2>
      <div className={styles.locationsGrid}>
        {locations.map((location, index) => (
          <div className={styles.locationCard} key={index}>
            <img src={location.image} alt={location.name} />
            <div className={styles.locationLabel}>Thuê xe ở {location.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularCarRentalLocations;
