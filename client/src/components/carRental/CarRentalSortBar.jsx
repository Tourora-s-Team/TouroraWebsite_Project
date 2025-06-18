import React from 'react';
import styles from './CarRentalSortBar.module.css';

const CarRentalSortBar = ({ totalResults, sortBy, onSortChange }) => {
    const sortOptions = [
        { value: 'price_low', label: 'Price: Low to High' },
        { value: 'price_high', label: 'Price: High to Low' },
        { value: 'rating', label: 'Customer Rating' },
        { value: 'popularity', label: 'Popularity' }
    ];

    return (
        <div className={styles.sortBar}>
            <div className={styles.resultCount}>
                {totalResults} cars found
            </div>
            <div className={styles.sortSection}>
                <label>Sort by:</label>
                <select
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value)}
                    className={styles.sortSelect}
                >
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
