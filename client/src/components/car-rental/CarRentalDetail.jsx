import React from 'react';
import styles from './CarRentalDetail.module.css';

const CarRentalDetail = ({ car }) => {
    if (!car) return null;

    return (
        <div className={styles.carDetail}>
            <div className={styles.imageGallery}>
                <img src={car.mainImage} alt={car.name} className={styles.mainImage} />
                <div className={styles.thumbnails}>
                    {car.images?.map((image, index) => (
                        <img key={index} src={image} alt={`${car.name} view ${index + 1}`} />
                    ))}
                </div>
            </div>

            <div className={styles.carInfo}>
                <h1>{car.name}</h1>
                <div className={styles.rating}>
                    {[...Array(5)].map((_, index) => (
                        <span key={index} className={index < car.rating ? styles.starFilled : styles.star}>
                            ★
                        </span>
                    ))}
                    <span className={styles.reviewCount}>({car.reviewCount} reviews)</span>
                </div>

                <div className={styles.specs}>
                    <div className={styles.specItem}>
                        <span className={styles.label}>Type:</span>
                        <span>{car.type}</span>
                    </div>
                    <div className={styles.specItem}>
                        <span className={styles.label}>Transmission:</span>
                        <span>{car.transmission}</span>
                    </div>
                    <div className={styles.specItem}>
                        <span className={styles.label}>Fuel Type:</span>
                        <span>{car.fuelType}</span>
                    </div>
                    <div className={styles.specItem}>
                        <span className={styles.label}>Seats:</span>
                        <span>{car.seats} persons</span>
                    </div>
                </div>

                <div className={styles.features}>
                    <h2>Features</h2>
                    <ul>
                        {car.features?.map((feature, index) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>
                </div>

                <div className={styles.pricing}>
                    <div className={styles.priceInfo}>
                        <span className={styles.price}>${car.pricePerDay}</span>
                        <span className={styles.period}>per day</span>
                    </div>
                    <div className={styles.totalPrice}>
                        Total for {car.durationDays} days: ${car.totalPrice}
                    </div>
                </div>

                <div className={styles.terms}>
                    <h2>Rental Terms</h2>
                    <ul>
                        <li>Minimum age: 21 years</li>
                        <li>Valid driver's license required</li>
                        <li>Security deposit: ${car.securityDeposit}</li>
                        <li>Mileage limit: {car.mileageLimit} km/day</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CarRentalDetail;
