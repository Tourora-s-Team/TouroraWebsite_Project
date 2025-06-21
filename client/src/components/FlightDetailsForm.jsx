import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./FlightDetailsForm.module.css";
import FlightSuggestionsForm from "./FlightSuggestionsForm"; // Đổi tên đúng với file bạn có

const tabList = [
  { key: "detail", label: "Chi tiết" },
  { key: "benefit", label: "Các lợi ích đi kèm" },
  { key: "refund", label: "Hoàn vé" },
  { key: "change", label: "Đổi lịch" },
  { key: "promo", label: "Khuyến mãi" },
];

const promoList = [
  {
    code: "BAYHEQUOCTE",
    desc: "Giảm đến 500K bay quốc tế",
    note: "Đặt từ 3 triệu, thời gian bay tùy chọn.",
  },
  {
    code: "ZLP15",
    desc: "Tiết kiệm với Zalopay",
    note: "Tối thiểu giao dịch 2 triệu đồng sử dụng Zalopay",
  },
  {
    code: "VPFLY150",
    desc: "Giảm giá với VPBank",
    note: "Tối thiểu giao dịch 3 triệu đồng sử dụng Thẻ ghi nợ VPBank",
  },
];

const FlightDetailsForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("detail");
  const [showDetail, setShowDetail] = useState(true);
  const [suggestedFlights, setSuggestedFlights] = useState([]); // State cho chuyến bay gợi ý

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/flights/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFlight(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    // Lấy danh sách chuyến bay gợi ý
    fetch(`${process.env.REACT_APP_API_URL}/api/flights?sameRoute=${id}`)
      .then((res) => res.json())
      .then((data) => setSuggestedFlights(data.filter((f) => f.id !== id)))
      .catch((err) => console.error(err));
  }, [id]);

  if (loading) return <div className={styles.loading}>Đang tải...</div>;
  if (!flight)
    return <div className={styles.error}>Không tìm thấy chuyến bay!</div>;

  // Tính thời gian bay
  const dep = new Date(flight.departure.date);
  const arr = new Date(flight.arrival.date);
  const diffMs = arr - dep;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const mins = Math.floor((diffMs / (1000 * 60)) % 60);

  // Tab click handler
  const handleTabClick = (key) => {
    if (key === "detail") {
      // Nếu đang ở tab detail thì toggle, còn tab khác thì show
      setShowDetail((prev) => (activeTab === "detail" ? !prev : true));
    }
    setActiveTab(key);
  };

  return (
    <div className={styles.container}>
      {/* Main flight card */}
      <div className={styles.flightCard}>
        <div className={styles.mainInfo}>
          <div className={styles.airline}>
            <img
              src="https://inkythuatso.com/uploads/images/2021/09/1571733729-logo-vietjet-air-15-13-34-40.jpg"
              alt={flight.airline}
            />
            <span>{flight.airline}</span>
          </div>
          <div className={styles.schedule}>
            <div className={styles.time}>
              <span className={styles.departTime}>
                {dep.getHours().toString().padStart(2, "0")}:
                {dep.getMinutes().toString().padStart(2, "0")}
              </span>
              <span>
                <span className={styles.duration}>
                  {hours}h {mins}m
                </span>
                <span className={styles.flightType}>Bay thẳng</span>
              </span>
              <span className={styles.arriveTime}>
                {arr.getHours().toString().padStart(2, "0")}:
                {arr.getMinutes().toString().padStart(2, "0")}
              </span>
            </div>
            <div className={styles.route}>
              <span>
                {flight.departure.city} ({flight.departure.airport})
              </span>
              <span>→</span>
              <span>
                {flight.arrival.city} ({flight.arrival.airport})
              </span>
            </div>
            <div className={styles.tags}>
              <span className={styles.tag}>BAYHEQUOCTE giảm đến 500K</span>
              <span
                className={styles.tag}
                style={{ background: "#ffeaea", color: "#ff5e1f" }}
              >
                Có thể cung cấp hóa đơn VAT
              </span>
            </div>
          </div>
          <div className={styles.price}>
            <div className={styles.amount}>
              {flight.price.economy.toLocaleString()} VND
            </div>
            <div className={styles.perPerson}>/khách</div>
            <button
              className={`${styles.bookBtn} ${styles.selectBtn}`}
              onClick={() => navigate("/flight-booking", { state: { flight } })}
            >
              <span className={styles.btnIcon}>✈️</span> Chọn
            </button>
          </div>
        </div>
        {/* Tab Navigation */}
        <div className={styles.actions}>
          {tabList.map((tab) => (
            <button
              key={tab.key}
              className={
                activeTab === tab.key && (tab.key !== "detail" || showDetail)
                  ? styles.activeTab
                  : ""
              }
              onClick={() => handleTabClick(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {/* Chi tiết */}
        {activeTab === "detail" && showDetail && (
          <div className={styles.notification}>
            <h4>Chi tiết chuyến bay</h4>
            <div className={styles.tripDetails}>
              <div>
                <b>Khởi hành:</b> {flight.departure.city} (
                {flight.departure.airport})<br />
                {dep.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                - {dep.toLocaleDateString()}
                <br />
                Sân bay quốc tế Soekarno Hatta, Nhà ga 2
              </div>
              <div>
                <b>Đến:</b> {flight.arrival.city} ({flight.arrival.airport})
                <br />
                {arr.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                - {arr.toLocaleDateString()}
                <br />
                Sân bay Nội Bài, Nhà ga 2
              </div>
              <div>
                <b>Hãng:</b> {flight.airline}
                <br />
                <b>Mã chuyến bay:</b> {flight.flightNumber}
                <br />
                Hành lý 0 kg, xách tay 7 kg
                <br />
                Airbus A320-100/200, 3-3 sơ đồ ghế, 28-inches khoảng cách ghế
              </div>
            </div>
          </div>
        )}

        {/* Các lợi ích đi kèm */}
        {activeTab === "benefit" && (
          <div className={styles.notification}>
            <h4>Lợi ích đi kèm</h4>
            <ul>
              <li>Miễn phí chọn chỗ ngồi</li>
              <li>Ưu đãi tích điểm thành viên</li>
              <li>Hỗ trợ đổi lịch linh hoạt</li>
            </ul>
          </div>
        )}

        {/* Hoàn vé */}
        {activeTab === "refund" && (
          <div className={styles.notification}>
            <h4>Chính sách hoàn vé</h4>
            <p>
              <b>Không hoàn lại vé</b>
              <br />
              Tuy nhiên, nếu bạn cần hoàn lại vé do những lý do ngoài tầm kiểm
              soát của mình, bạn vẫn có thể gửi yêu cầu hoàn vé. Những lý do nằm
              ngoài tầm kiểm soát của bạn bao gồm:
            </p>
            <ul>
              <li>Hãng hàng không hủy chuyến bay</li>
              <li>
                Chuyến bay bị hãng hàng không đổi lịch đáng kể (theo quyết định
                của hãng hàng không)
              </li>
            </ul>
          </div>
        )}

        {/* Đổi lịch */}
        {activeTab === "change" && (
          <div className={styles.notification}>
            <h4>Chính sách đổi lịch</h4>
            <ul>
              <li>✔ Giờ khởi hành</li>
              <li>✗ Lộ trình di chuyển</li>
              <li>✗ Hãng hàng không</li>
            </ul>
            <p>
              Regular Reschedule chỉ áp dụng cho việc thay đổi ngày và giờ bay.
              <br />
              Tiến trình đổi lịch bay có thể lên đến 1 giờ.
            </p>
          </div>
        )}

        {/* Khuyến mãi */}
        {activeTab === "promo" && (
          <div className={styles.notification}>
            <h4>Khuyến mãi nổi bật</h4>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {promoList.map((promo, idx) => (
                <div
                  key={idx}
                  style={{
                    border: "1.5px dashed #dbeafe",
                    borderRadius: 12,
                    padding: 16,
                    minWidth: 220,
                    background: "#fff",
                  }}
                >
                  <div style={{ fontWeight: 600, color: "#007bff" }}>
                    {promo.desc}
                  </div>
                  <div style={{ color: "#555", fontSize: "0.98rem" }}>
                    {promo.note}
                  </div>
                  <div className={styles.promoCode}>{promo.code}</div>
                  <button
                    className={styles.copyBtn}
                    onClick={() => navigator.clipboard.writeText(promo.code)}
                  >
                    Sao chép
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Flight Suggestions */}
      <div className={styles.suggestions}>
        <h4>Chuyến bay gợi ý</h4>
        <FlightSuggestionsForm
          flights={suggestedFlights} // suggestedFlights là mảng chuyến bay gợi ý, loại bỏ chuyến bay đang xem nếu cần
          onSelect={(flight) => navigate(`/flight-details/${flight.id}`)}
        />
      </div>
    </div>
  );
};

export default FlightDetailsForm;
