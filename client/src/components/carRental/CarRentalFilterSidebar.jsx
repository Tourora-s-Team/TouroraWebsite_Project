import React, { useState } from 'react';
import styles from './CarRentalFilterSidebar.module.css';

const CarRentalFilterSidebar = ({ onFilterChange }) => {
    const [filters, setFilters] = useState({
        priceRange: [0, 1000],
        carType: [],
        transmission: [],
        fuelType: [],
        seats: [],
    });

    const handleFilterChange = (category, value) => {
        const newFilters = {
            ...filters,
            [category]: category === 'priceRange'
                ? value
                : filters[category].includes(value)
                    ? filters[category].filter(item => item !== value)
                    : [...filters[category], value]
        };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    return (
        <div className={styles.sidebar}>
            <div className={styles.filterSection}>
                <h3>Price Range</h3>
                <div className={styles.priceInputs}>
                    <input
                        type="range"
                        min="0"
                        max="1000"
                        value={filters.priceRange[1]}
                        onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                    />
                    <span>${filters.priceRange[0]} - ${filters.priceRange[1]}</span>
                </div>
            </div>

            <div className={styles.filterSection}>
                <h3>Car Type</h3>
                {['Sedan', 'SUV', 'Luxury', 'Sports Car', 'Van'].map(type => (
                    <label key={type} className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={filters.carType.includes(type)}
                            onChange={() => handleFilterChange('carType', type)}
                        />
                        {type}
                    </label>
                ))}
            </div>

            <div className={styles.filterSection}>
                <h3>Transmission</h3>
                {['Automatic', 'Manual'].map(type => (
                    <label key={type} className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={filters.transmission.includes(type)}
                            onChange={() => handleFilterChange('transmission', type)}
                        />
                        {type}
                    </label>
                ))}
            </div>

            <div className={styles.filterSection}>
                <h3>Fuel Type</h3>
                {['Petrol', 'Diesel', 'Electric', 'Hybrid'].map(type => (
                    <label key={type} className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={filters.fuelType.includes(type)}
                            onChange={() => handleFilterChange('fuelType', type)}
                        />
                        {type}
                    </label>
                ))}
            </div>

            <div className={styles.filterSection}>
                <h3>Seats</h3>
                {['2', '4', '5', '7', '8+'].map(seats => (
                    <label key={seats} className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={filters.seats.includes(seats)}
                            onChange={() => handleFilterChange('seats', seats)}
                        />
                        {seats} seats
                    </label>
                ))}
            </div>
        </div>
    );
};

export default CarRentalFilterSidebar;
