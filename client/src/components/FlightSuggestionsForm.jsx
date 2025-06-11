import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./FlightSuggestionsForm.module.css";

const FlightSuggestionsForm = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("oneWay");

  const flights = {
    oneWay: [
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
    ],
    domestic: [
      {
        airline: "VietJet Air",
        logo: "/images/airlines/vietjet.png",
        from: "TP HCM (SGN)",
        to: "Hà Nội (HAN)",
        date: "Thứ Ba, 10 thg 6, 2025",
        price: 799000,
      },
      {
        airline: "Bamboo Airways",
        logo: "/images/airlines/bamboo.png",
        from: "Hà Nội (HAN)",
        to: "Đà Nẵng (DAD)",
        date: "Thứ Tư, 11 thg 6, 2025",
        price: 689000,
      },
      {
        airline: "Vietnam Airlines",
        logo: "/images/airlines/vietnam-airlines.png",
        from: "TP HCM (SGN)",
        to: "Phú Quốc (PQC)",
        date: "Thứ Năm, 12 thg 6, 2025",
        price: 1089000,
      },
      {
        airline: "VietJet Air",
        logo: "/images/airlines/vietjet.png",
        from: "Hà Nội (HAN)",
        to: "Nha Trang (CXR)",
        date: "Thứ Sáu, 13 thg 6, 2025",
        price: 899000,
      },
    ],
    international: [
      {
        airline: "VietJet Air",
        logo: "/images/airlines/vietjet.png",
        from: "TP HCM (SGN)",
        to: "Tokyo (NRT)",
        date: "Thứ Hai, 16 thg 6, 2025",
        price: 3889000,
      },
      {
        airline: "Singapore Airlines",
        logo: "/images/airlines/singapore-airlines.png",
        from: "Hà Nội (HAN)",
        to: "Singapore (SIN)",
        date: "Thứ Ba, 17 thg 6, 2025",
        price: 2989000,
      },
      {
        airline: "Korean Air",
        logo: "/images/airlines/korean-air.png",
        from: "TP HCM (SGN)",
        to: "Seoul (ICN)",
        date: "Thứ Tư, 18 thg 6, 2025",
        price: 4289000,
      },
      {
        airline: "Thai Airways",
        logo: "/images/airlines/thai-airways.png",
        from: "Hà Nội (HAN)",
        to: "Bangkok (BKK)",
        date: "Thứ Năm, 19 thg 6, 2025",
        price: 2489000,
      },
    ],
  };

  const handleSelectFlight = (flight) => {
    navigate("/flight-results", {
      state: {
        search: {
          from: flight.from,
          to: flight.to,
          departDate: flight.date,
          passengers: { adults: 1, children: 0, infants: 0 },
          class: "economy",
          directFlight: true,
        },
      },
    });
  };
  const getFilteredFlights = () => {
    return flights[activeFilter] || flights.oneWay;
  };

  return (
    <div className={styles.container}>
      <h2>Tìm Kiếm Các Ưu Đãi Vé Máy Bay Rẻ Từ Việt Nam</h2>

      <div className={styles.filterTabs}>
        <button
          className={`${styles.filterTab} ${
            activeFilter === "oneWay" ? styles.active : ""
          }`}
          onClick={() => setActiveFilter("oneWay")}
        >
          Một Chiều
        </button>
        <button
          className={`${styles.filterTab} ${
            activeFilter === "domestic" ? styles.active : ""
          }`}
          onClick={() => setActiveFilter("domestic")}
        >
          Nội Địa
        </button>
        <button
          className={`${styles.filterTab} ${
            activeFilter === "international" ? styles.active : ""
          }`}
          onClick={() => setActiveFilter("international")}
        >
          Quốc Tế
        </button>
      </div>

      <div className={styles.flightList}>
        {getFilteredFlights().map((flight, index) => (
          <div
            key={index}
            className={styles.flightCard}
            onClick={() => handleSelectFlight(flight)}
          >
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

export default FlightSuggestionsForm;
