import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FlightSuggestionsForm.module.css";

const FlightSuggestionsForm = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/flights/suggestions`)
      .then((res) => res.json())
      .then((data) => {
        setFlights(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>✈️ Gợi ý chuyến bay</h2>
      <div className={styles.flightList}>
        {flights.map((flight) => (
          <div key={flight._id} className={styles.flightCard}>
            <div className={styles.cardHeader}>
              <img
                src="https://inkythuatso.com/uploads/images/2021/09/1571733729-logo-vietjet-air-15-13-34-40.jpg"
                alt={flight.airline}
                className={styles.flightImg}
              />
              <div>
                <div className={styles.flightNumber}>{flight.flightNumber}</div>
                <div className={styles.airline}>{flight.airline}</div>
              </div>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.route}>
                <div>
                  <span className={styles.city}>{flight.departure.city}</span>
                  <span className={styles.airport}>
                    ({flight.departure.airport})
                  </span>
                  <div className={styles.time}>
                    {new Date(flight.departure.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <span className={styles.arrow}>→</span>
                <div>
                  <span className={styles.city}>{flight.arrival.city}</span>
                  <span className={styles.airport}>
                    ({flight.arrival.airport})
                  </span>
                  <div className={styles.time}>
                    {new Date(flight.arrival.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
              <div className={styles.date}>
                Ngày đi: {new Date(flight.departure.date).toLocaleDateString()}
              </div>
              <div className={styles.priceRow}>
                <span className={styles.priceEco}>
                  Economy: <b>{flight.price.economy.toLocaleString()} VND</b>
                </span>
                <span className={styles.priceBiz}>
                  Business: <b>{flight.price.business.toLocaleString()} VND</b>
                </span>
              </div>
            </div>
            <button
              className={styles.viewBtn}
              onClick={() => navigate(`/flight-details/${flight._id}`)}
            >
              Xem chi tiết
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlightSuggestionsForm;
