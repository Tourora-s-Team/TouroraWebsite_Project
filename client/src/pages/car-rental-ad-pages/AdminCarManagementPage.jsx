import React from 'react';
import AdminLayout from '../../components/car-rental-admin/AdminLayout';
import CarManagement from '../../components/car-rental-admin/CarManagement';

const AdminCarManagementPage = () => {
  return (
    <AdminLayout>
      <CarManagement />
    </AdminLayout>
  );
};

export default AdminCarManagementPage;
