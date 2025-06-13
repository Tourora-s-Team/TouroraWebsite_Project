import React from "react";  
import CarRentalFillter from '../components/CarRentalFillter'
import CarList from '../components/CarList'

const CarRentalResultPage = () => {
    return (
        <div>
            <CarRentalFillter/>
            <CarList/>
        </div>
    );
}

export default CarRentalResultPage; 