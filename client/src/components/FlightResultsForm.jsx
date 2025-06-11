import React from "react";
import { useNavigate } from "react-router-dom";

import styles from "./FlightResultsForm.module.css";

const FlightResults = ({ searchParams }) => {
  const navigate = useNavigate();

  const handleSelectFlight = (flight) => {
    navigate("/flight-booking", {
      state: {
        flight: flight,
        searchParams: searchParams,
      },
    });
  };

  const flightResults = [
    {
      airline: "VietJet Air",
      departTime: "17:15",
      arriveTime: "18:45",
      duration: "1h 30m",
      from: "SGN",
      to: "BKK",
      price: 1444555,
      tags: ["BAYHEO500K", "Có thể cộng cộng hóa đơn VAT"],
      type: "Bay thẳng",
    },
    {
      airline: "VietJet Air",
      departTime: "11:15",
      arriveTime: "12:45",
      duration: "1h 30m",
      from: "SGN",
      to: "BKK",
      price: 1798444,
      tags: ["BAYHEO500K", "Có thế cộng cộng hóa đơn VAT"],
      type: "Bay thẳng",
    },
    {
      airline: "VietJet Air",
      departTime: "08:35",
      arriveTime: "10:05",
      duration: "1h 30m",
      from: "SGN",
      to: "BKK",
      price: 2443772,
      tags: ["BAYHEO500K", "Có thế cộng cộng hóa đơn VAT"],
      type: "Bay thẳng",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.routeInfo}>
          <h3>TP HCM (SGN) → Bangkok (BKK)</h3>
          <div className={styles.tripDetails}>
            <span>CN, 6 thg 7 2025</span>
            <span>1 hành khách</span>
            <span>Phổ thông</span>
          </div>
        </div>
        <div className={styles.notifications}>
          <span>✈️ Vé sinh viên</span>
          <span>Được hoàn vé khi bị từ chối cấp thị thực</span>
        </div>
      </div>

      <div className={styles.dateSelector}>
        <button className={styles.dateNav}>←</button>
        <div className={styles.dates}>
          <div className={styles.dateOption}>
            <span>Thứ 6, 4 thg 7</span>
            <span className={styles.price}>1.444.000 VND</span>
          </div>
          <div className={`${styles.dateOption} ${styles.active}`}>
            <span>Thứ 7, 5 thg 7</span>
            <span className={styles.price}>1.417.000 VND</span>
          </div>
          {/* Add more date options */}
        </div>
        <button className={styles.dateNav}>→</button>
        <button className={styles.calendar}>
          <span>Lịch</span>
        </button>
      </div>

      <div className={styles.filters}>
        <div className={styles.sortOptions}>
          <span className={styles.active}>Giá thấp nhất</span>
          <span>Thời gian bay ngắn nhất</span>
          <div className={styles.priceSort}>
            <span>Ưu tiên bay thẳng</span>
            <span>1.444.555 VND</span>
          </div>
        </div>
      </div>

      <div className={styles.flightList}>
        {flightResults.map((flight, index) => (
          <div key={index} className={styles.flightCard}>
            <div className={styles.mainInfo}>
              <div className={styles.airline}>
                <img src="/images/airlines/vietjet.png" alt={flight.airline} />
                <span>{flight.airline}</span>
              </div>

              <div className={styles.schedule}>
                <div className={styles.time}>
                  <span className={styles.departTime}>{flight.departTime}</span>
                  <span className={styles.duration}>{flight.duration}</span>
                  <span className={styles.arriveTime}>{flight.arriveTime}</span>
                </div>
                <div className={styles.route}>
                  <span>{flight.from}</span>
                  <span className={styles.flightType}>{flight.type}</span>
                  <span>{flight.to}</span>
                </div>
              </div>

              <div className={styles.priceInfo}>
                <p className={styles.price}>
                  {flight.price.toLocaleString()} VND
                </p>
                <p className={styles.type}>Một Chiều</p>
                <button
                  className={styles.viewBtn}
                  onClick={() => handleSelectFlight(flight)}
                >
                  →
                </button>
              </div>
            </div>

            <div className={styles.tags}>
              {flight.tags.map((tag, i) => (
                <span key={i} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>

            <div className={styles.actions}>
              <button>Chi tiết</button>
              <button>Các lợi ích đi kèm</button>
              <button>Hoàn vé</button>
              <button>Đổi lịch</button>
              <button>Khuyến mãi ⚡</button>
              <button className={styles.selectBtn}>Chọn</button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.notification}>
        <h4>Là người đầu tiên biết khi giá giảm!</h4>
        <p>
          Bật thông báo giá và chúng tôi sẽ cho bạn biết ngay khi giá giảm sâu.
        </p>
        <a href="#">Bật thông báo tại đây</a>
      </div>
    </div>
  );
};

export default FlightResults;
