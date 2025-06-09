import React from "react";
import styles from "./FlightResultsList.module.css";

const FlightResultsList = ({ results }) => {
  return (
    <div className={styles.resultsSection}>
      <h2 className={styles.heading}>Kết Quả Tìm Kiếm</h2>
      <div className={styles.grid}>
        {results.map((flight, index) => (
          <div className={styles.card} key={index}>
            <div className={styles.airline}>
              <img
                src={flight.airlineLogo}
                alt={flight.airline}
                className={styles.logo}
              />
              <span>{flight.airline}</span>
            </div>
            <div className={styles.route}>
              <strong>{flight.from}</strong> ➝ <strong>{flight.to}</strong>
            </div>
            <div className={styles.date}>{flight.date}</div>
            <div className={styles.price}>
              {flight.price.toLocaleString()} VND
            </div>
            <div className={styles.tag}>Một Chiều</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlightResultsList;
