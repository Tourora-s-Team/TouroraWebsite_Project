import React, { useState, useEffect } from 'react';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    rentedCars: 0,
    maintenanceCars: 0,
    totalBookings: 0,
    activeBookings: 0,
    totalRentalServices: 0,
    activeRentalServices: 0
  });
  const [recentCars, setRecentCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      
      // Fetch cars and rental services data
      const [carsResponse, servicesResponse] = await Promise.all([
        fetch(`${apiUrl}/api/admin/cars`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${apiUrl}/api/admin/car-rental-services`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (carsResponse.ok) {
        const cars = await carsResponse.json();
        
        let services = [];
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          services = servicesData.data || servicesData;
        }
        
        // Calculate stats
        const stats = {
          totalCars: cars.length,
          availableCars: cars.filter(car => car.car_status === 'available').length,
          rentedCars: cars.filter(car => car.car_status === 'rented').length,
          maintenanceCars: cars.filter(car => car.car_status === 'maintenance').length,
          totalBookings: 0, 
          activeBookings: 0,
          totalRentalServices: services.length,
          activeRentalServices: services.filter(service => service.car_rental_status).length
        };

        setStats(stats);
        setRecentCars(cars.slice(-5).reverse()); // Get 5 most recent cars
      } else {
        setError('Không thể tải dữ liệu dashboard');
      }
    } catch (error) {
      setError('Lỗi kết nối');
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'available': { text: 'Rảnh', class: 'available' },
      'rented': { text: 'Đang cho thuê', class: 'rented' },
      'maintenance': { text: 'Bảo trì', class: 'maintenance' }
    };
    
    const statusInfo = statusMap[status] || { text: status, class: 'default' };
    return <span className={`${styles.statusBadge} ${styles[statusInfo.class]}`}>
      {statusInfo.text}
    </span>;
  };

  if (loading) return <div className={styles.loading}>Đang tải...</div>;

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h2>Dashboard</h2>
        <p>Tổng quan hệ thống quản lý xe cho thuê</p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <i className="fas fa-car"></i>
          </div>
          <div className={styles.statContent}>
            <h3>{stats.totalCars}</h3>
            <p>Tổng số xe</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{backgroundColor: '#28a745'}}>
            <i className="fas fa-check-circle"></i>
          </div>
          <div className={styles.statContent}>
            <h3>{stats.availableCars}</h3>
            <p>Xe rảnh</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{backgroundColor: '#ffc107'}}>
            <i className="fas fa-clock"></i>
          </div>
          <div className={styles.statContent}>
            <h3>{stats.rentedCars}</h3>
            <p>Đang cho thuê</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{backgroundColor: '#dc3545'}}>
            <i className="fas fa-tools"></i>
          </div>
          <div className={styles.statContent}>
            <h3>{stats.maintenanceCars}</h3>
            <p>Đang bảo trì</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{backgroundColor: '#6f42c1'}}>
            <i className="fas fa-handshake"></i>
          </div>
          <div className={styles.statContent}>
            <h3>{stats.activeRentalServices}</h3>
            <p>Dịch vụ đang hoạt động</p>
          </div>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className={styles.contentGrid}>
        {/* Recent Cars */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Xe mới thêm gần đây</h3>
          </div>
          <div className={styles.cardContent}>
            {recentCars.length > 0 ? (
              <div className={styles.recentCarsList}>
                {recentCars.map(car => (
                  <div key={car.car_id} className={styles.recentCarItem}>
                    <div className={styles.carInfo}>
                      <h4>{car.car_name}</h4>
                      <p>{car.car_type} • {car.seats} chỗ • {car.transmission === 'auto' ? 'Tự động' : 'Số sàn'}</p>
                      <span className={styles.price}>
                        {new Intl.NumberFormat('vi-VN').format(car.price_per_day)} VND/ngày
                      </span>
                    </div>
                    <div className={styles.carStatus}>
                      {getStatusBadge(car.car_status)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.noData}>Chưa có xe nào</p>
            )}
          </div>
        </div>

        {/* Car Status Distribution */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Phân bố trạng thái xe</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.statusDistribution}>
              <div className={styles.statusItem}>
                <div className={styles.statusBar}>
                  <div 
                    className={styles.statusFill}
                    style={{
                      width: `${stats.totalCars > 0 ? (stats.availableCars / stats.totalCars) * 100 : 0}%`,
                      backgroundColor: '#28a745'
                    }}
                  ></div>
                </div>
                <div className={styles.statusInfo}>
                  <span>Xe rảnh</span>
                  <span>{stats.availableCars}/{stats.totalCars}</span>
                </div>
              </div>

              <div className={styles.statusItem}>
                <div className={styles.statusBar}>
                  <div 
                    className={styles.statusFill}
                    style={{
                      width: `${stats.totalCars > 0 ? (stats.rentedCars / stats.totalCars) * 100 : 0}%`,
                      backgroundColor: '#ffc107'
                    }}
                  ></div>
                </div>
                <div className={styles.statusInfo}>
                  <span>Đang cho thuê</span>
                  <span>{stats.rentedCars}/{stats.totalCars}</span>
                </div>
              </div>

              <div className={styles.statusItem}>
                <div className={styles.statusBar}>
                  <div 
                    className={styles.statusFill}
                    style={{
                      width: `${stats.totalCars > 0 ? (stats.maintenanceCars / stats.totalCars) * 100 : 0}%`,
                      backgroundColor: '#dc3545'
                    }}
                  ></div>
                </div>
                <div className={styles.statusInfo}>
                  <span>Bảo trì</span>
                  <span>{stats.maintenanceCars}/{stats.totalCars}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h3>Thao tác nhanh</h3>
        <div className={styles.actionButtons}>
          <button 
            className={styles.actionBtn}
            onClick={() => window.location.href = '/admin/cars'}
          >
            <i className="fas fa-plus"></i>
            Thêm xe mới
          </button>
          <button 
            className={styles.actionBtn}
            onClick={() => window.location.href = '/admin/cars'}
          >
            <i className="fas fa-list"></i>
            Xem tất cả xe
          </button>
          <button 
            className={styles.actionBtn}
            onClick={() => window.location.href = '/admin/car-rental-services'}
          >
            <i className="fas fa-handshake"></i>
            Quản lý dịch vụ
          </button>
          <button 
            className={styles.actionBtn}
            onClick={() => window.location.href = '/admin/bookings'}
          >
            <i className="fas fa-calendar"></i>
            Quản lý đặt xe
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
