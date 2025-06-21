import React from "react";
import CarList from '../components/carRental/CarList'
import CarRentalFillter from '../components/carRental/CarRentalFillter'
import CarRentalSortBar from '../components/carRental/CarRentalSortBar';

import styles from './CarRentalResultPage.module.css';
const CarRentalResultPage = () => {
    return (
        <div>
            <CarRentalFillter />

            <div className={styles.container}>
            <CarRentalSortBar />

            <CarList />

            </div>
        </div>
    );
}

export default CarRentalResultPage; 