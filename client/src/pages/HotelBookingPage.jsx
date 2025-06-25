import React from 'react';
import HotelBookingForm from '../components/HotelBookingForm';
import HotelSuggestions from '../components/HotelSuggestions';
import styles from './HotelBookingPage.module.css';

const HotelBookingPage = () => {
    return (
        <div className={styles.container}>
            <HotelBookingForm />
            <HotelSuggestions />
        </div>
    );
};

export default HotelBookingPage;
