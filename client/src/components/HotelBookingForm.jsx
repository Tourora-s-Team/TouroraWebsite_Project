import React, { useState } from 'react';
import styles from './HotelBookingForm.module.css';

const HotelBookingForm = () => {
    const [formData, setFormData] = useState({
        destination: '',
        checkIn: '',
        checkOut: '',
        guests: 1,
        rooms: 1
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Here we'll add API call later
    };

    return (
        <div className={styles.formContainer}>
            <div className={styles.searchContainer}>
                <div className={styles.searchHeader}>
                    <h2>Tìm khách sạn hoàn hảo</h2>
                    <p className={styles.searchDescription}>Giá tốt nhất cho kỳ nghỉ của bạn</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Địa điểm</label>
                            <input
                                type="text"
                                name="destination"
                                value={formData.destination}
                                onChange={handleChange}
                                placeholder="Nhập thành phố, khách sạn"
                                className={`${styles.input} ${styles.destinationInput}`}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Nhận phòng</label>
                            <input
                                type="date"
                                name="checkIn"
                                value={formData.checkIn}
                                onChange={handleChange}
                                className={`${styles.input} ${styles.dateInput}`}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Trả phòng</label>
                            <input
                                type="date"
                                name="checkOut"
                                value={formData.checkOut}
                                onChange={handleChange}
                                className={`${styles.input} ${styles.dateInput}`}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Khách & phòng</label>
                            <div className={styles.guestRoomContainer}>
                                <input
                                    type="text"
                                    value={`${formData.guests} khách, ${formData.rooms} phòng`}
                                    className={`${styles.input} ${styles.guestInput}`}
                                    readOnly
                                    onClick={() => {/* TODO: Add guest/room selector popup */ }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.searchButtonContainer}>
                        <button type="submit" className={styles.button}>
                            Tìm khách sạn
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HotelBookingForm;
