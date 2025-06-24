import React, { useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import styles from './LoginModal.module.css';

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const { setUser, setToken, setAccount } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Vui lòng nhập tên đăng nhập');
      return false;
    }
    if (!formData.password.trim()) {
      setError('Vui lòng nhập mật khẩu');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        // Lưu dữ liệu vào context
        setToken(data.token);
        setUser(data.user);
        setAccount(data.account);

        // Gọi callback để auto-fill form
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }

        // Đóng modal
        onClose();
        
        // Reset form
        setFormData({ username: '', password: '' });
      } else {
        setError(data.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Lỗi kết nối đến server. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ username: '', password: '' });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Đăng nhập để tiếp tục</h2>
          <button className={styles.closeBtn} onClick={handleClose}>
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.description}>
            Vui lòng đăng nhập để tiếp tục đặt xe. Thông tin của bạn sẽ được tự động điền vào form.
          </p>

          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="username">Tên đăng nhập</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Nhập tên đăng nhập"
                className={styles.input}
                disabled={loading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Nhập mật khẩu"
                className={styles.input}
                disabled={loading}
              />
            </div>

            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={handleClose}
                disabled={loading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? (
                  <span className={styles.loading}>
                    <span className={styles.spinner}></span>
                    Đang đăng nhập...
                  </span>
                ) : (
                  'Đăng nhập'
                )}
              </button>
            </div>
          </form>

          <div className={styles.registerLink}>
            <p>Chưa có tài khoản? <a href="/register">Đăng ký ngay</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
