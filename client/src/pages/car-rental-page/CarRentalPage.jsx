import React from 'react';
import CarRentalSearchForm from '../../components/car-rental/CarRentalSearchForm';
import CarRentalDetails from '../../components/car-rental/CarRentalDesPage';
import CarRentalFaq from '../../components/car-rental/CarRentalFaq';
import PopularCarRentalLocations from '../../components/car-rental/PopularCarRentalLocations';
import styles from './CarRentalPage.module.css';

const CarRentalPage = () => {
  return (
    <div className={styles.carRentalPage}>
      <div className={styles.heroSection}>
        <div className={styles.searchFormContainer}>
          <h1 className={styles.pageTitle}>Thuê xe với Tourora</h1>
          <p className={styles.pageSubtitle}>Đa dạng lựa chọn xe tự lái hoặc xe có tài xế</p>
          <CarRentalSearchForm />
        </div>
      </div>
      <div className={styles.contentContainer}>
        <CarRentalDetails />
        <CarRentalFaq />
        <PopularCarRentalLocations />
      </div>
    </div>
  );
};

export default CarRentalPage;