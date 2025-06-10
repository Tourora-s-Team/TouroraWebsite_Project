import styles from './CarCard.module.css';

const CarCard = ({ car }) => {
  return (
    <div className={styles.carCard}>
      <div className={styles.leftContainer}>
        <img src={car.image} alt={car.name} className={styles.carImage} />
        <div className={styles.carDetails}>
          <h4 className={styles.carName}>{car.name}</h4>
          <p className={styles.carType}>{car.type}</p>

          <div className={styles.carFeatures}>
            {car.features.map((feature, index) => (
              <span key={index} className={styles.feature}>{feature}</span>
            ))}
          </div>

        </div>

      </div>
      <div className={styles.rightContainer}>
        <div className={styles.priceSection}>
          <div>
            <span className={styles.price}>{car.price}đ</span>
            <span className={styles.pricePeriod}>/ngày</span>
          </div>
        </div>
          <button className={styles.bookBtn}>Đặt xe</button>
      </div >
    </div>
  );
};

export default CarCard;