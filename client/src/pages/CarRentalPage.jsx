import React from 'react';
import CarRentalSearchForm from '../components/CarRentalSearchForm'; 
import CarRentalDetails from '../components/CarRentalDetails'
import CarRentalFaq from '../components/CarRentalFaq'
import CarRentalPopularLocation from '../components/PopularCarRentalLocations'

const CarRentalPage = () => {
  return (
    <div>
      <CarRentalSearchForm /> {/* Hiển thị form thuê xe */}
      <CarRentalDetails/>
      <CarRentalFaq/>
      <CarRentalPopularLocation/>
    </div>
  );
};

export default CarRentalPage;