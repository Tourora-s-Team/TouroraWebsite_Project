import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';

const ProtectedRoute = ({ children }) => {
  const { user, setUser } = useContext(UserContext);
  const token = localStorage.getItem('token');

  useEffect(() => {    // Kiểm tra token có hợp lệ không
    const checkAuth = async () => {
      if (token && !user) {
        try {
          const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
          // Gọi API để verify token và lấy thông tin user
          const response = await fetch(`${apiUrl}/api/auth/verify`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData.user);
          } else {
            // Token không hợp lệ, xóa và chuyển hướng
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
        }
      }
    };

    checkAuth();
  }, [token, user, setUser]);

  // Nếu không có token, chuyển hướng về trang đăng nhập admin
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // Nếu có token nhưng chưa có user (đang verify), hiển thị loading
  if (token && !user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Đang xác thực...
      </div>
    );
  }

  // Nếu có token và user, cho phép truy cập
  return children;
};

export default ProtectedRoute;
