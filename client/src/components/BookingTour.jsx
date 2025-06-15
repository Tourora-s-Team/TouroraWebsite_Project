import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./BookingTour.module.css";

const destinationList = [
  "Hà Nội",
  "Hồ Chí Minh",
  "Đà Nẵng",
  "Nha Trang",
  "Phú Quốc",
  "Quảng Ninh - Lào Cai",
  "Kiên Giang",
  "Quảng Nam - Thừa Thiên Huế",
  "Maldives",
  "Tokyo - Kyoto - Osaka",
  "Lâm Đồng",
];

const BookingTour = () => {
  const [tours, setTours] = useState([]);
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [people, setPeople] = useState("");
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  // Lấy danh sách tour từ API
  useEffect(() => {
    fetch("/api/tours/all-tours")
      .then((res) => res.json())
      .then((data) => setTours(Array.isArray(data) ? data : []))
      .catch(() => setTours([]));
  }, []);

  useEffect(() => {
    fetch("/api/tours/tour-images")
      .then((res) => res.json())
      .then((data) => setImages(Array.isArray(data) ? data : []))
      .catch(() => setImages([]));
  }, []);

  // Lọc tour theo tìm kiếm và điểm đến
  const filteredTours = tours.filter((tour) => {
    const matchDestination =
      !destination ||
      (tour.location && tour.location.includes(destination)) ||
      (tour.title && tour.title.includes(destination));
    const matchSearch =
      !search ||
      (tour.title && tour.title.toLowerCase().includes(search.toLowerCase())) ||
      (tour.location &&
        tour.location.toLowerCase().includes(search.toLowerCase()));
    return matchDestination && matchSearch;
  });

  const handleBookNow = (tour, idx) => {
    const tourWithImage = {
      ...tour,
      image:
        tour.image ||
        images[idx % images.length] ||
        "https://placehold.co/600x400",
    };
    navigate(`/information-tour/${tour.MaTour}`, {
      state: { tour: tourWithImage },
    });
  };

  return (
    <div>
      {/* Hero section */}
      <section className={styles.heroSection}>
        <div className={styles.heroBg}>
          <img
            src="https://images.pexels.com/photos/2577274/pexels-photo-2577274.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
            alt="Travel Background"
            className={styles.heroImg}
          />
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroCenter}>
            <h1 className={styles.heroTitle}>
              Khám Phá Thế Giới
              <br />
              <span className={styles.heroTitleSpan}>Cùng Chúng Tôi</span>
            </h1>
            <p className={styles.heroDesc}>
              Trải nghiệm những chuyến đi tuyệt vời với dịch vụ chuyên nghiệp và
              giá cả hợp lý
            </p>
            <div className={styles.searchFormWrap}>
              <form
                className={styles.searchForm}
                onSubmit={(e) => e.preventDefault()}
              >
                <div>
                  <label className={styles.label}>
                    <svg
                      width={16}
                      height={16}
                      fill="currentColor"
                      style={{ marginRight: 6 }}
                    >
                      <circle
                        cx="8"
                        cy="8"
                        r="7"
                        stroke="#1976d2"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                    Điểm đến
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className={styles.select}
                  >
                    <option value="">Chọn điểm đến</option>
                    {destinationList.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={styles.label}>
                    <svg
                      width={16}
                      height={16}
                      fill="none"
                      stroke="currentColor"
                      style={{ marginRight: 6 }}
                    >
                      <rect
                        x="2"
                        y="3"
                        width="12"
                        height="11"
                        rx="2"
                        stroke="#1976d2"
                        strokeWidth="2"
                      />
                    </svg>
                    Ngày khởi hành
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={styles.inputDate}
                  />
                </div>
                <div>
                  <label className={styles.label}>
                    <svg
                      width={16}
                      height={16}
                      fill="currentColor"
                      style={{ marginRight: 6 }}
                    >
                      <circle
                        cx="8"
                        cy="8"
                        r="7"
                        stroke="#1976d2"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                    Số người
                  </label>
                  <select
                    value={people}
                    onChange={(e) => setPeople(e.target.value)}
                    className={styles.select}
                  >
                    <option value="">Chọn số người</option>
                    <option value="1">1 người</option>
                    <option value="2">2 người</option>
                    <option value="3">3 người</option>
                    <option value="4+">4+ người</option>
                  </select>
                </div>
                <div>
                  <label className={styles.label}>Loại tour</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className={styles.select}
                  >
                    <option value="">Tất cả</option>
                    <option>Trong nước</option>
                    <option>Nước ngoài</option>
                    <option>Cao cấp</option>
                  </select>
                </div>
              </form>
              <input
                type="text"
                placeholder="Tìm kiếm tour theo tên hoặc địa điểm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
              />
              <button className={styles.searchBtn} onClick={() => {}}>
                <svg
                  width={20}
                  height={20}
                  fill="none"
                  stroke="currentColor"
                  style={{ marginRight: 6 }}
                >
                  <circle cx="9" cy="9" r="7" stroke="#fff" strokeWidth="2" />
                  <path
                    d="M15 15l-3-3"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span>Tìm kiếm tour</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Danh sách tour nổi bật */}
      <section style={{ background: "#f9fafb", padding: "60px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 className={styles.sectionTitle}>Tour Nổi Bật</h2>
            <p className={styles.sectionDesc}>
              Khám phá những điểm đến tuyệt vời với các gói tour được lựa chọn
              kỹ càng
            </p>
          </div>
          <div className={styles.tourGrid}>
            {filteredTours.length === 0 && (
              <div
                style={{
                  gridColumn: "1/-1",
                  textAlign: "center",
                  color: "#888",
                  fontSize: 20,
                }}
              >
                Không tìm thấy tour phù hợp.
              </div>
            )}
            {filteredTours.map((tour, idx) => (
              <div
                key={tour.MaTour || tour.id || idx}
                className={styles.tourCard}
              >
                <div style={{ position: "relative" }}>
                  <img
                    src={
                      tour.image ||
                      images[idx % images.length] ||
                      "https://placehold.co/600x400"
                    }
                    alt={tour.title}
                    className={styles.tourImg}
                  />
                  <div className={styles.tourTags}>
                    {(tour.tags || []).map((tag, idx) => (
                      <span
                        key={idx}
                        className={
                          styles.tourTag +
                          " " +
                          (tag === "Bán chạy"
                            ? styles.tagBanChay
                            : tag === "Giảm giá"
                            ? styles.tagGiamGia
                            : tag === "Mới"
                            ? styles.tagMoi
                            : tag === "Cao cấp"
                            ? styles.tagCaoCap
                            : styles.tagDefault)
                        }
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button className={styles.tourFavBtn} title="Yêu thích">
                    <svg
                      className="w-5 h-5 text-gray-600 hover:text-red-500"
                      width={20}
                      height={20}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>
                <div className={styles.tourContent}>
                  <h3 className={styles.tourTitle}>{tour.title}</h3>
                  <div className={styles.tourLocation}>
                    <svg
                      width={16}
                      height={16}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      style={{ marginRight: 4 }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">{tour.location}</span>
                  </div>
                  <div className={styles.tourDate}>
                    <svg
                      width={16}
                      height={16}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ marginRight: 4 }}
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="18"
                        rx="2"
                        stroke="#1976d2"
                        strokeWidth="2"
                      />
                      <path
                        d="M16 2v4M8 2v4M3 10h18"
                        stroke="#1976d2"
                        strokeWidth="2"
                      />
                    </svg>
                    <span className="text-sm">
                      Ngày khởi hành: <b>{tour.date}</b>
                    </span>
                  </div>
                  <div className={styles.tourGroupSize}>
                    <svg
                      width={16}
                      height={16}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      style={{ marginRight: 4 }}
                    >
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                    <span>{tour.groupSize}</span>
                  </div>
                  <div className={styles.tourRatingWrap}>
                    <div className={styles.tourRating}>
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          width={16}
                          height={16}
                          fill="currentColor"
                          style={{
                            color:
                              i < Math.floor(tour.rating)
                                ? "#facc15"
                                : "#e5e7eb",
                          }}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className={styles.tourRatingText}>
                        {tour.rating} ({tour.reviews} đánh giá)
                      </span>
                    </div>
                  </div>
                  <div className={styles.tourPriceWrap}>
                    <div>
                      {tour.originalPrice && (
                        <span className={styles.tourOriginalPrice}>
                          {tour.originalPrice}đ
                        </span>
                      )}
                      <span className={styles.tourPrice}>{tour.price}đ</span>
                    </div>
                    <button
                      className={styles.bookBtn}
                      onClick={() => handleBookNow(tour, idx)}
                      type="button"
                    >
                      Đặt ngay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <button
              className={styles.tourAllBtn}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Xem tất cả tour
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookingTour;
