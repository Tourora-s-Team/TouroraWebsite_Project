import React from 'react';
import styles from './CarRentalResultEmpty.module.css';

const CarRentalResultEmpty = () => {
    return (
        <div className={styles.emptyState}>
            <div className={styles.icon}>🚗</div>
            <h2>No Cars Found</h2>
            <p>We couldn't find any cars matching your search criteria.</p>
            <div className={styles.suggestions}>
                <h3>Try:</h3>
                <ul>
                    <li>Adjusting your dates</li>
                    <li>Removing some filters</li>
                    <li>Expanding your search area</li>
                    <li>Checking different car types</li>
                </ul>
            </div>
        </div>
    );
};

export default CarRentalResultEmpty;
