import React, { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import styles from "./UserProfile.module.css";

const UserProfile = ({ user, account, bookings }) => {
  const navigate = useNavigate();
  const { logout } = useContext(UserContext);
  const logoutHandle = () => {
    logout();                
    navigate("/");
  };
  
  if (!user || !account) {
  return <p>Đang tải thông tin người dùng...</p>; // hoặc navigate("/login");
  }
  const rawDate = user.dateOfBirth;
  const formattedDate = new Date(rawDate).toLocaleDateString('vi-VN');

  return (
    <div className={styles.mainContainer}>
      <section className={styles.subHeader}>
        <div className={styles.brand}>
          <h1>Tourora</h1>
        </div>
        <button id="logout-in-account" onClick={logoutHandle} className={styles.logoutButton}>
          Đăng xuất
        </button>
      </section>

      <section className={styles.accountContainer}>
        <div className={styles.leftContainer}>
          <div className={styles.info}>
            <img src="./assets/images/profile-picture.png" alt="account picture" />
            <h2 className={styles.name}>{user.fullname}</h2>
            <p className={styles.email}>{user.email}</p>
          </div>
          <div className={styles.selectFea}>
            <div>
              <a href="#personal-info" className={styles.feature}>
                Thông tin cá nhân
              </a>
            </div>
            <div>
              <a href="#booking-history" className={styles.feature}>
                Lịch sử đặt tour
              </a>
            </div>
          </div>
        </div>

        <div className={styles.rightContainer}>
          <div id="personal-info">
            <h1 className={styles.title}>Thông tin cá nhân</h1>
            <p className={styles.titleExplain}>
              Quản lý thông tin cá nhân của bạn, bao gồm tên, ngày sinh
              và địa chỉ email để liên hệ với bạn.
            </p>
            <div className={styles.listItem}>
              <InfoItem title="Họ và tên" icon="fa-circle-user" content={user.fullname} />
              <InfoItem title="Sinh nhật" icon="fa-cake-candles" content={formattedDate} />
              <InfoItem title="Số điện thoại" icon="fa-phone" content={user.numberPhone} />
              <InfoItem title="Email" icon="fa-envelope" content={user.email} />
              <InfoItem title="Username" icon="fa-circle-user" content={account.username} />
            </div>
          </div>

          <div id="booking-history">
            <h1 className={styles.title}>Lịch sử đặt tour</h1>
            <p className={styles.titleExplain}>Hiển thị tất cả các tour  đã đặt.</p>
            <div className={`${styles.listBooking} ${styles.textCenter}`}>
              <div className={styles.itemBooking}>
                <p className={`${styles.item} ${styles.itemCounter}`}>STT</p>
                <p className={`${styles.item} ${styles.itemCountry}`}>Điểm đến</p>
                <p className={`${styles.item} ${styles.itemDay}`}>Ngày</p>
                <p className={`${styles.item} ${styles.itemTime}`}>Giờ</p>
                <p className={`${styles.item} ${styles.itemGuests}`}>Số lượng khách</p>
              </div>

              {bookings.map((booking, index) => (
                <div key={index} className={styles.itemBooking}>
                  <p className={styles.item}>{index + 1}</p>
                  <p className={styles.item}>{booking.country}</p>
                  <p className={styles.item}>{booking.date}</p>
                  <p className={styles.item}>{booking.time}</p>
                  <p className={styles.item}>{booking.guests}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const InfoItem = ({ title, icon, content }) => (
  <div className={styles.item}>
    <h3 className={styles.itemTitle}>
      {title}
      <span>
        <i className={`fa-solid ${icon}`}></i>
      </span>
    </h3>
    <p className={styles.itemContent}>{content}</p>
  </div>
);

export default UserProfile;
