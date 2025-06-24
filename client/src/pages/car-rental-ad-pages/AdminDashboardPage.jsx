import React from 'react';
import AdminLayout from '../../components/car-rental-admin/AdminLayout';
import AdminDashboard from '../../components/car-rental-admin/AdminDashboard';

const AdminDashboardPage = () => {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
};

export default AdminDashboardPage;
