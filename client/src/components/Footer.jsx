import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.banner}>
        <img
          src="https://w.wallhaven.cc/full/rq/wallhaven-rq75r7.jpg"
          alt="Traveloka Banner"
        />
      </div>

      <div className={styles.bottom}>
        <div className={styles.brand}>
          <h2 className={styles.blue}>Tourora</h2>
          <div className={styles.certificates}>
            <img src="../iata.png" alt="IATA" />
            <img src="../dmca.webp" alt="DMCA" />
          </div>
          <button className={styles.partnerBtn}>Hợp tác với Tourora</button>
        </div>

        <div className={styles.columns}>
          <div>
            <h4>Về Tourora</h4>
            <ul>
              <li>Cách đặt chỗ</li>
              <li>Liên hệ</li>
              <li>Trợ giúp</li>
              <li>Tuyển dụng</li>
              <li>Về chúng tôi</li>
            </ul>
          </div>
          <div>
            <h4>Sản phẩm</h4>
            <ul>
              <li>Khách sạn</li>
              <li>Vé máy bay</li>
              <li>Vé xe khách</li>
              <li>Đưa đón sân bay</li>
              <li>Cho thuê xe</li>
            </ul>
          </div>
          <div>
            <h4>Khác</h4>
            <ul>
              <li>Traveloka Affiliate</li>
              <li>Traveloka Blog</li>
              <li>Chính sách riêng tư</li>
              <li>Điều khoản sử dụng</li>
              <li>Đăng ký nơi nghỉ của bạn</li>
            </ul>
          </div>
          <div>
            <h4>Theo dõi chúng tôi</h4>
            <ul className={styles.social}>
              <li>
                <img src="../icon_fb.svg" alt="Facebook" />
                <span>Facebook</span>
              </li>
              <li>
                <img src="../icon_ig.svg" alt="Instagram" />
                <span>Instagram</span>
              </li>
              <li>
                <img src="../icon_tt.svg" alt="Tiktok" />
                <span>Tiktok</span>
              </li>
              <li>
                <img src="../icon_ytb.svg" alt="Youtube" />
                <span>Youtube</span>
              </li>
            </ul>
          </div>
        </div>
        <hr className={styles.horizontalLine} />
        <div className={styles.footerInfo}>
          <span className={styles.team}>TEAMQLDAPTPM-VHU-TOURORA</span>
          <br />
          <span className={styles.txt}>
            © 2023 Tourora. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
