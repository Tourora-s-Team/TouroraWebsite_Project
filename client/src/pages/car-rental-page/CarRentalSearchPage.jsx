import React, { useContext, useEffect, useState, useCallback } from 'react';
import { CarContext } from '../../contexts/CarContext';
import { useSelector } from 'react-redux';

import CarList from '../../components/car-rental/CarList';
import CarRentalFillter from '../../components/car-rental/CarRentalFillter';
import CarRentalSortBar from '../../components/car-rental/CarRentalSortBar';
import CarRentalResultEmpty from '../../components/car-rental/CarRentalResultEmpty';

import styles from './CarRentalSearchPage.module.css';

const CarRentalSearchPage = () => {
  const { cars, fetchCars, loading, lastSearchParams } = useContext(CarContext);
  const carRentalData = useSelector(state => state.carRental);

  const [currentFilters, setCurrentFilters] = useState(() => {
    if (lastSearchParams?.filters) {
      return {
        ...lastSearchParams.filters,
        carType: lastSearchParams.filters.carType || 'Tất cả',
        transmission: lastSearchParams.filters.transmission || 'Tất cả',
        seats: lastSearchParams.filters.seats || 'Tất cả'
      };
    }
    return {
      location: carRentalData?.location || 'Hồ Chí Minh',
      carType: 'Tất cả',
      transmission: 'Tất cả',
      seats: 'Tất cả',
      mode: carRentalData?.mode || 'driver'
    };
  });

  const [currentSort, setCurrentSort] = useState(() => {
    return lastSearchParams?.sortBy || 'price_low';
  });

  // Dùng useCallback để đảm bảo hàm fetch này không thay đổi tham chiếu giữa các render
  const fetchCarsSafe = useCallback(() => {
    if (cars.length > 0) {
      console.log('[CarRentalSearchPage] Đã có dữ liệu xe (' + cars.length + ' xe), không cần gọi API lại');
      return;
    }

    const safeFilters = {
      ...currentFilters,
      location: currentFilters.location || 'Hồ Chí Minh'
    };
    console.log('[CarRentalSearchPage] Fetching cars with filters:', safeFilters);
    fetchCars(safeFilters, currentSort);
  }, [cars.length, currentFilters, currentSort, fetchCars]);

  useEffect(() => {
    console.log('[CarRentalSearchPage] Current cars data:', cars);
    console.log('[CarRentalSearchPage] Last search params:', lastSearchParams);
  }, [cars, lastSearchParams]);

  useEffect(() => {
    fetchCarsSafe();
  }, [fetchCarsSafe]);

  const handleFilterChange = (filters) => {
    const updatedFilters = {
      ...filters,
      location: currentFilters.location,
      mode: currentFilters.mode
    };
    console.log('[CarRentalSearchPage] Updated filters:', updatedFilters);
    setCurrentFilters(updatedFilters);
    fetchCars(updatedFilters, currentSort);
  };

  const handleSortChange = (sort) => {
    setCurrentSort(sort);
    fetchCars(currentFilters, sort);
  };

  return (
    <div>
      <CarRentalFillter />
      <div className={styles.container}>
        {loading ? (
          <p className={styles.loadingMessage}>Đang tải dữ liệu xe...</p>
        ) : cars.length === 0 ? (
          <CarRentalResultEmpty />
        ) : (
          <div>
            <CarRentalSortBar
              totalResults={cars.length}
              onFilterChange={handleFilterChange}
              onSortChange={handleSortChange}
            />
            <CarList cars={cars} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CarRentalSearchPage;
