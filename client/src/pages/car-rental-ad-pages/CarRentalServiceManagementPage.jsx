import React from 'react';
import AdminLayout from '../../components/car-rental-admin/AdminLayout';
import CarRentalServiceManagement from '../../components/car-rental-admin/CarRentalServiceManagement';

const CarRentalServiceManagementPage = () => {
  return (
    <AdminLayout>
      <CarRentalServiceManagement />
    </AdminLayout>
  );
};

export default CarRentalServiceManagementPage;
