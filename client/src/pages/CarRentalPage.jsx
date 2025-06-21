import React from 'react';
import CarRentalForm from '../components/carRental/CarRentalSearchForm'; // Import component form của bạn

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