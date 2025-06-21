import React from "react";
import CarRentalFillter from '../components/carRental/CarRentalFillter'
import CarList from '../components/carRental/CarList'

const CarRentalResultPage = () => {
    return (
        <div>
            <CarRentalFillter />
            <CarList />
        </div>
    );
}

export default CarRentalResultPage; 