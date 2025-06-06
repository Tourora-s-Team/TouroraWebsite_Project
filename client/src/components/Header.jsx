import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.logo}>
        <a href="/">
          <img src="../logo.png" alt="Tourora Logo" />
        </a>
      </div>

      <nav>
        <ul className={styles.navList}>
          <li>
            <a className={styles.navLink} href="#">
              Khách sạn
            </a>
          </li>
          <li>
            <a className={styles.navLink} href="/plane-tickets-service">
              Vé máy bay
            </a>
          </li>
          <li>
            <a className={styles.navLink} href="#">
              Vé xe khách
            </a>
          </li>
          <li>
            <a className={styles.navLink} href="#">
              Đưa đón sân bay
            </a>
          </li>
          <li>
            <a className={styles.navLink} href="/car-rental-service">
              Cho thuê xe
            </a>
          </li>
          <li>
            <a className={styles.navLink} href="#">
              Hoạt động & Vui chơi
            </a>
          </li>
        </ul>
      </nav>

      <div className={styles.authButtons}>
        <button className={styles.login}>Đăng Nhập</button>
        <button className={styles.register}>Đăng Ký</button>
      </div>
    </header>
  );
};

export default Header;
