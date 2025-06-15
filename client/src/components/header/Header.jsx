import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import styles from './Header.module.css';

const Header = () => {
    const navigate = useNavigate();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const userDropdownRef = useRef(null);

    // Giả lập thông tin đăng nhập
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen((prev) => !prev);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setIsUserDropdownOpen(false);
        navigate('/');
    };

    // Đóng dropdown khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setIsUserDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div>
            <header className={styles.headerContainer}>
                <div className={`${styles.subHeader} ${styles.topBar}`}>
                    <div className={styles.logo}>
                        <a href="/">
                            <img src="../logo.png" alt="Tourora Logo" />
                        </a>
                    </div>
                    <div className={styles.topBarContent}>
                        <div className={styles.dropdownWrapper} ref={dropdownRef}>
                            <a href="#" onClick={toggleDropdown}>Hỗ trợ <FontAwesomeIcon icon={faCaretDown} /></a>
                            {isDropdownOpen && (
                                <ul className={styles.dropdownMenu}>
                                    <li><a href="#">Trợ giúp</a></li>
                                    <li><a href="#">Liên hệ chúng tôi</a></li>
                                    <li><a href="#">Hộp thư của tôi</a></li>
                                </ul>
                            )}
                        </div>
                        <a href="#">Hợp tác với chúng tôi</a>
                        <a href="#">Đặt chỗ của tôi</a>

                        {/* Hiển thị đăng nhập / đăng ký nếu chưa đăng nhập */}
                        {!user ? (
                            <div className={styles.authButtons}>
                                <button className={styles.login} onClick={handleLoginClick}>Đăng Nhập</button>
                                <button className={styles.register} onClick={handleRegisterClick}>Đăng Ký</button>
                            </div>
                        ) : (
                            // Hiển thị tên người dùng + dropdown nếu đã đăng nhập
                            <div className={styles.dropdownWrapper} ref={userDropdownRef}>
                                <button className={styles.userButton} onClick={toggleUserDropdown}>
                                    {user.name} <FontAwesomeIcon icon={faCaretDown} />
                                </button>
                                {isUserDropdownOpen && (
                                    <ul className={styles.dropdownMenu}>
                                        <li><a href="/account-info">Chỉnh sửa thông tin</a></li>
                                        <li><a onClick={handleLogout}>Đăng xuất</a></li>
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.subHeader}>
                    <nav>
                        <ul className={styles.navList}>
                            <li><a className={styles.navLink} href="#">Khách sạn</a></li>
                            <li><a className={styles.navLink} href="#">Vé máy bay</a></li>
                            <li><a className={styles.navLink} href="#">Vé xe khách</a></li>
                            <li><a className={styles.navLink} href="#">Đưa đón sân bay</a></li>
                            <li><a className={styles.navLink} href="/car-rental-service">Cho thuê xe</a></li>
                            <li><a className={styles.navLink} href="#">Hoạt động & Vui chơi</a></li>
                        </ul>
                    </nav>
                </div>
            </header>
        </div>
    );
};

export default Header;
