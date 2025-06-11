import React from "react";
import styles from "./FlightSuggestionsForm.module.css";

const FlightSuggestions = () => {
  const suggestedFlights = [
    {
      airline: "VietJet Air",
      logo: "/images/airlines/vietjet.png",
      from: "TP HCM (SGN)",
      to: "Bangkok (BKK)",
      date: "Thứ Năm, 12 thg 6, 2025",
      price: 1406930,
    },
    {
      airline: "VietJet Air",
      logo: "/images/airlines/vietjet.png",
      from: "TP HCM (SGN)",
      to: "Singapore (SIN)",
      date: "Thứ Ba, 24 thg 6, 2025",
      price: 1136290,
    },
    {
      airline: "Thai AirAsia",
      logo: "/images/airlines/airasia.png",
      from: "TP HCM (SGN)",
      to: "Bangkok (DMK)",
      date: "Thứ Sáu, 11 thg 7, 2025",
      price: 1360356,
    },
    {
      airline: "VietJet Air",
      logo: "/images/airlines/vietjet.png",
      from: "Singapore (SIN)",
      to: "TP HCM (SGN)",
      date: "Thứ Năm, 26 thg 6, 2025",
      price: 1821845,
    },
  ];

  return (
    <div className={styles.container}>
      <h2>Tìm Kiếm Các Ưu Đãi Vé Máy Bay Rẻ Từ Việt Nam</h2>

      <div className={styles.filterTabs}>
        <button className={`${styles.filterTab} ${styles.active}`}>
          Một Chiều
        </button>
        <button className={styles.filterTab}>Nội Địa</button>
        <button className={styles.filterTab}>Quốc Tế</button>
      </div>

      <div className={styles.flightList}>
        {suggestedFlights.map((flight, index) => (
          <div key={index} className={styles.flightCard}>
            <div className={styles.flightInfo}>
              <img src={flight.logo} alt={flight.airline} />
              <div className={styles.flightDetails}>
                <p className={styles.airline}>{flight.airline}</p>
                <p className={styles.route}>
                  {flight.from} → {flight.to}
                </p>
                <p className={styles.date}>{flight.date}</p>
              </div>
            </div>
            <div className={styles.priceInfo}>
              <p className={styles.price}>
                {flight.price.toLocaleString()} VND
              </p>
              <p className={styles.type}>Một Chiều</p>
              <button className={styles.viewBtn}>→</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlightSuggestions;
