import React, { useState } from 'react';
import styles from './CarRentalBookingForm.module.css';

const CarRentalBookingForm = ({ car, onSubmit }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        driverLicense: '',
        pickupDate: '',
        returnDate: '',
        additionalDrivers: false,
        insurance: 'basic',
        comments: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className={styles.bookingForm}>
            <h2>Complete Your Booking</h2>
            <div className={styles.carSummary}>
                <img src={car.mainImage} alt={car.name} />
                <div className={styles.carInfo}>
                    <h3>{car.name}</h3>
                    <p>${car.pricePerDay} per day</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className={styles.formSection}>
                    <h3>Personal Information</h3>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="phone">Phone</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="driverLicense">Driver's License Number</label>
                        <input
                            type="text"
                            id="driverLicense"
                            name="driverLicense"
                            value={formData.driverLicense}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className={styles.formSection}>
                    <h3>Rental Details</h3>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="pickupDate">Pickup Date</label>
                            <input
                                type="datetime-local"
                                id="pickupDate"
                                name="pickupDate"
                                value={formData.pickupDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="returnDate">Return Date</label>
                            <input
                                type="datetime-local"
                                id="returnDate"
                                name="returnDate"
                                value={formData.returnDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.formSection}>
                    <h3>Additional Options</h3>
                    <div className={styles.formGroup}>
                        <label className={styles.checkbox}>
                            <input
                                type="checkbox"
                                name="additionalDrivers"
                                checked={formData.additionalDrivers}
                                onChange={handleChange}
                            />
                            Additional Drivers (+$10/day)
                        </label>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="insurance">Insurance Coverage</label>
                        <select
                            id="insurance"
                            name="insurance"
                            value={formData.insurance}
                            onChange={handleChange}
                            required
                        >
                            <option value="basic">Basic Coverage</option>
                            <option value="premium">Premium Coverage (+$15/day)</option>
                            <option value="full">Full Coverage (+$25/day)</option>
                        </select>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="comments">Additional Comments</label>
                    <textarea
                        id="comments"
                        name="comments"
                        value={formData.comments}
                        onChange={handleChange}
                        rows="4"
                    />
                </div>

                <button type="submit" className={styles.submitButton}>
                    Complete Booking
                </button>
            </form>
        </div>
    );
};

export default CarRentalBookingForm;
