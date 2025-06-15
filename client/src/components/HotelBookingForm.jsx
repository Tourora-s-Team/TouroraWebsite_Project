import React, { useState } from 'react';
import styles from './HotelBookingForm.module.css';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import SearchIcon from '@mui/icons-material/Search';

const HotelBookingForm = () => {
    const [formData, setFormData] = useState({
        destination: '',
        checkIn: '2025-06-16',
        checkOut: '2025-06-17',
        guests: '2 người lớn, 0 Trẻ em, 1 phòng',
        nights: '1 đêm'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <div className={styles.formContainer}>
            <div className={styles.searchContainer}>
                <div className={styles.searchHeader}>
                    <h1>Tìm khách sạn hoàn hảo</h1>
                    <p>Giá tốt nhất cho kỳ nghỉ của bạn</p>
                </div>

                <form className={styles.formCard} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Thành phố, địa điểm hoặc tên khách sạn:</label>
                        <div className={styles.inputWrapper}>
                            <LocationOnIcon className={styles.icon} />
                            <input
                                type="text"
                                value={formData.destination}
                                onChange={(e) => setFormData({...formData, destination: e.target.value})}
                                placeholder="Nhập thành phố, khách sạn..."
                                className={styles.input}
                            />
                        </div>
                    </div>

                    <div className={styles.dateContainer}>
                        <div className={styles.formGroup}>
                            <label>Nhận phòng:</label>
                            <div className={styles.dateWrapper}>
                                <CalendarTodayIcon className={styles.icon} />
                                <input
                                    type="date"
                                    value={formData.checkIn}
                                    onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        <div className={styles.nightsDisplay}>
                            <NightsStayIcon />
                            <span>{formData.nights}</span>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Trả phòng:</label>
                            <div className={styles.dateWrapper}>
                                <CalendarTodayIcon className={styles.icon} />
                                <input
                                    type="date"
                                    value={formData.checkOut}
                                    onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                                    className={styles.input}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Khách & Phòng</label>
                        <div className={styles.inputWrapper}>
                            <PersonIcon className={styles.icon} />
                            <input
                                type="text"
                                value={formData.guests}
                                readOnly
                                className={styles.input}
                            />
                        </div>
                    </div>

                    <button type="submit" className={styles.searchButton}>
                        <SearchIcon />
                        Tìm khách sạn
                    </button>
                </form>
            </div>
        </div>
    );
};

export default HotelBookingForm;
