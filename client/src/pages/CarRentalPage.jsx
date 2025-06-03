import React from 'react';
import CarRentalForm from '../components/CarRentalForm'; // Import component form của bạn

const CarRentalPage = () => {
  return (
    <div>
      <h1>Dịch vụ Thuê Xe</h1>
      <CarRentalForm /> {/* Hiển thị form thuê xe */}
    </div>
  );
};

export default CarRentalPage;