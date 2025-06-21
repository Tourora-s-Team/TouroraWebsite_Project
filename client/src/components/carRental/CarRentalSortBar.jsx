import React, { useState } from 'react';
import styles from './CarRentalSortBar.module.css';

const CarRentalSortBar = ({ onSortChange, onFilterChange }) => {
    const [sortBy, setSortBy] = useState('price_low');
    const [filters, setFilters] = useState({
        carType: 'Tất cả',
        transmission: 'Tất cả',
        seats: 'Tất cả',
    });

    const sortOptions = [
        { value: 'price_low', label: 'Giá: Thấp đến cao' },
        { value: 'price_high', label: 'Giá: Cao đến thấp' },
        { value: 'rating', label: 'Đánh giá cao nhất' },
        { value: 'popularity', label: 'Nổi tiếng nhất' }
    ];

    const carTypes = ['Tất cả', 'Sedan', 'SUV', 'Luxury', 'Sports Car', 'Van'];
    const transmissions = ['Tất cả', 'Số tự động', 'Số sàn'];
    const seatsOptions = ['Tất cả', '2', '4', '5', '7', '8+'];

    // Kiểm tra xem một filter đã được áp dụng chưa
    const isFilterActive = (category) => {
        return filters[category] !== 'Tất cả';
    };

    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortBy(value);
        onSortChange(value);
    };

    const handleFilterChange = (category, value) => {
        const updatedFilters = { ...filters, [category]: value };
        setFilters(updatedFilters);
        onFilterChange(updatedFilters);
    };

    return (
        <div className={styles.sortBar}>
            <div className={styles.sortSectionTitle}>
               <h4>Bộ lọc:</h4>
            </div>

            <div className={`${styles.filterSection} ${isFilterActive('carType') ? styles.active : ''}`}>
                <label>Loại xe:</label>
                <select
                    value={filters.carType}
                    onChange={(e) => handleFilterChange('carType', e.target.value)}
                    className={styles.filterSelect}
                >
                    {carTypes.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </div>

            <div className={`${styles.filterSection} ${isFilterActive('transmission') ? styles.active : ''}`}>
                <label>Hộp số:</label>
                <select
                    value={filters.transmission}
                    onChange={(e) => handleFilterChange('transmission', e.target.value)}
                    className={styles.filterSelect}
                >
                    {transmissions.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </div>

            <div className={`${styles.filterSection} ${isFilterActive('seats') ? styles.active : ''}`}>
                <label>Số chỗ ngồi:</label>
                <select
                    value={filters.seats}
                    onChange={(e) => handleFilterChange('seats', e.target.value)}
                    className={styles.filterSelect}
                >
                    {seatsOptions.map(option => (
                        <option key={option} value={option}>{option} {option !== 'Tất cả' ? 'seats' : ''}</option>
                    ))}
                </select>
            </div>

            <div className={styles.sortSection}>
                <label>Sắp xếp:</label>
                <select value={sortBy} onChange={handleSortChange} className={styles.sortSelect}>
                    {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

        </div>
    );
};

export default CarRentalSortBar;
