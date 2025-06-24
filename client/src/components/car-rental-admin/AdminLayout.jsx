import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import styles from './AdminLayout.module.css';

const AdminLayout = ({ children }) => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Admin Panel</h2>
          <p>Quản lý xe cho thuê</p>
        </div>
        
        <nav className={styles.sidebarNav}>
          <Link 
            to="/admin/dashboard" 
            className={`${styles.navItem} ${isActive('/admin/dashboard') ? styles.active : ''}`}
          >
            <i className="fas fa-tachometer-alt"></i>
            Dashboard
          </Link>
          
          <Link 
            to="/admin/cars" 
            className={`${styles.navItem} ${isActive('/admin/cars') ? styles.active : ''}`}
          >
            <i className="fas fa-car"></i>
            Quản lý xe
          </Link>

          <Link 
            to="/admin/car-rental-services" 
            className={`${styles.navItem} ${isActive('/admin/car-rental-services') ? styles.active : ''}`}
          >
            <i className="fas fa-handshake"></i>
            Dịch vụ cho thuê
          </Link>
          
          <Link 
            to="/admin/bookings" 
            className={`${styles.navItem} ${isActive('/admin/bookings') ? styles.active : ''}`}
          >
            <i className="fas fa-calendar-check"></i>
            Quản lý đặt xe
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1>Trang quản trị</h1>
          </div>
          
          <div className={styles.headerRight}>
            <div className={styles.userInfo}>
              <span>Xin chào, {user?.full_name || 'Admin'}</span>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                <i className="fas fa-sign-out-alt"></i>
                Đăng xuất
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
