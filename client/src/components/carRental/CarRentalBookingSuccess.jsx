import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CarRentalBookingSuccess.module.css';

const CarRentalBookingSuccess = ({ booking }) => {
    return (
        <div className={styles.successContainer}>
            <div className={styles.successIcon}>✓</div>
            <h1>Booking Confirmed!</h1>
            <p>Your car rental has been successfully booked.</p>

            <div className={styles.bookingDetails}>
                <h2>Booking Details</h2>
                <div className={styles.detailsGrid}>
                    <div className={styles.detail}>
                        <span className={styles.label}>Booking Reference</span>
                        <span className={styles.value}>{booking.referenceNumber}</span>
                    </div>
                    <div className={styles.detail}>
                        <span className={styles.label}>Vehicle</span>
                        <span className={styles.value}>{booking.carName}</span>
                    </div>
                    <div className={styles.detail}>
                        <span className={styles.label}>Pick-up Date</span>
                        <span className={styles.value}>{booking.pickupDate}</span>
                    </div>
                    <div className={styles.detail}>
                        <span className={styles.label}>Return Date</span>
                        <span className={styles.value}>{booking.returnDate}</span>
                    </div>
                    <div className={styles.detail}>
                        <span className={styles.label}>Total Price</span>
                        <span className={styles.value}>${booking.totalPrice}</span>
                    </div>
                </div>

                <div className={styles.instructions}>
                    <h3>What's Next?</h3>
                    <ul>
                        <li>Check your email for the booking confirmation</li>
                        <li>Bring your driver's license and credit card for pick-up</li>
                        <li>Arrive at the pick-up location 15 minutes before your scheduled time</li>
                    </ul>
                </div>

                <div className={styles.actions}>
                    <Link to="/account/bookings" className={styles.primaryButton}>
                        View My Bookings
                    </Link>
                    <Link to="/" className={styles.secondaryButton}>
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CarRentalBookingSuccess;
