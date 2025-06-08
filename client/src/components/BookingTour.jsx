import React, { useState, useEffect } from "react";
import styles from "./BookingTour.module.css";

const toursData = [
  {
    id: 1,
    title: "Tour Hạ Long Bay - Sapa 4N3Đ",
    location: "Quảng Ninh - Lào Cai",
    duration: "4 ngày 3 đêm",
    groupSize: "12-16 người",
    price: "4,990,000",
    originalPrice: "5,990,000",
    rating: 4.8,
    reviews: 124,
    tags: ["Bán chạy", "Giảm giá"],
  },
  {
    id: 2,
    title: "Khám phá Phú Quốc - Thiên đường biển",
    location: "Kiên Giang",
    duration: "3 ngày 2 đêm",
    groupSize: "8-12 người",
    price: "3,290,000",
    rating: 4.9,
    reviews: 89,
    tags: ["Mới", "Cao cấp"],
  },
  {
    id: 3,
    title: "Hội An - Huế - Động Phong Nha",
    location: "Quảng Nam - Thừa Thiên Huế",
    duration: "5 ngày 4 đêm",
    groupSize: "15-20 người",
    price: "5,490,000",
    rating: 4.7,
    reviews: 156,
    tags: ["Văn hóa", "Lịch sử"],
  },
  {
    id: 4,
    title: "Maldives - Thiên đường biển xanh",
    location: "Maldives",
    duration: "6 ngày 5 đêm",
    groupSize: "2-4 người",
    price: "25,990,000",
    originalPrice: "29,990,000",
    rating: 5.0,
    reviews: 45,
    tags: ["Luxury", "Honeymoon"],
  },
  {
    id: 5,
    title: "Nhật Bản - Mùa hoa anh đào",
    location: "Tokyo - Kyoto - Osaka",
    duration: "7 ngày 6 đêm",
    groupSize: "10-15 người",
    price: "32,990,000",
    rating: 4.9,
    reviews: 78,
    tags: ["Quốc tế", "Văn hóa"],
  },
  {
    id: 6,
    title: "Đà Lạt - Thành phố ngàn hoa",
    location: "Lâm Đồng",
    duration: "2 ngày 1 đêm",
    groupSize: "6-10 người",
    price: "1,890,000",
    rating: 4.6,
    reviews: 203,
    tags: ["Gần", "Giá rẻ"],
  },
];

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
  // State cho search/filter
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [people, setPeople] = useState("");
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const [images, setImages] = useState([]);

  // Lấy ảnh từ API
  useEffect(() => {
    fetch("/api/tour-images")
      .then((res) => res.json())
      .then((data) => setImages(data))
      .catch(() => setImages([]));
  }, []);

  // Gán ảnh vào từng tour (theo index)
  const tours = toursData.map((tour, idx) => ({
    ...tour,
    image: images[idx % images.length] || "",
  }));

  // Filter logic
  const filteredTours = tours.filter((tour) => {
    const matchDestination =
      !destination ||
      tour.location.includes(destination) ||
      tour.title.includes(destination);
    const matchPeople =
      !people ||
      (people === "4+"
        ? parseInt(tour.groupSize) >= 4
        : tour.groupSize.includes(people));
    const matchType =
      !type ||
      type === "Tất cả" ||
      (type === "Trong nước"
        ? !["Maldives", "Tokyo", "Osaka"].some((kw) =>
            tour.location.includes(kw)
          )
        : type === "Nước ngoài"
        ? ["Maldives", "Tokyo", "Osaka"].some((kw) =>
            tour.location.includes(kw)
          )
        : tour.tags.includes(type));
    const matchSearch =
      !search ||
      tour.title.toLowerCase().includes(search.toLowerCase()) ||
      tour.location.toLowerCase().includes(search.toLowerCase());
    return matchDestination && matchPeople && matchType && matchSearch;
  });

  // Đặt tour
  const handleBookTour = (tour) => {
    fetch("/create-tour", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tour),
    })
      .then((res) => res.text())
      .then((msg) => alert(msg))
      .catch(() => alert("Đặt tour thất bại!"));
  };

  return (
    <div>
      {/* Hero + SearchBar */}
      <section
        style={{
          position: "relative",
          background: "linear-gradient(to right, #2563eb, #1e40af)",
          color: "#fff",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            background: "rgba(0,0,0,0.2)",
          }}
        >
          <img
            src="https://images.pexels.com/photos/2577274/pexels-photo-2577274.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
            alt="Travel Background"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              mixBlendMode: "overlay",
            }}
          />
        </div>
        <div
          style={{ position: "relative", zIndex: 1 }}
          className="container mx-auto px-4 py-20"
        >
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
            <h1
              style={{
                fontSize: 40,
                fontWeight: 700,
                marginBottom: 24,
                lineHeight: 1.2,
              }}
            >
              Khám Phá Thế Giới
              <br />
              <span style={{ color: "#facc15" }}>Cùng Chúng Tôi</span>
            </h1>
            <p style={{ fontSize: 22, marginBottom: 32, opacity: 0.9 }}>
              Trải nghiệm những chuyến đi tuyệt vời với dịch vụ chuyên nghiệp và
              giá cả hợp lý
            </p>
            {/* Search form */}
            <div
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: 32,
                boxShadow: "0 8px 32px rgba(25,118,210,0.10)",
                maxWidth: 900,
                margin: "0 auto",
              }}
            >
              <form
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  gap: 16,
                  marginBottom: 24,
                }}
                onSubmit={(e) => e.preventDefault()}
              >
                <div style={{ textAlign: "left" }}>
                  <label
                    style={{
                      color: "#334155",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
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
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #cbd5e1",
                      borderRadius: 8,
                      color: "#334155",
                    }}
                  >
                    <option value="">Chọn điểm đến</option>
                    {destinationList.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div style={{ textAlign: "left" }}>
                  <label
                    style={{
                      color: "#334155",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
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
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #cbd5e1",
                      borderRadius: 8,
                      color: "#334155",
                    }}
                  />
                </div>
                <div style={{ textAlign: "left" }}>
                  <label
                    style={{
                      color: "#334155",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
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
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #cbd5e1",
                      borderRadius: 8,
                      color: "#334155",
                    }}
                  >
                    <option value="">Chọn số người</option>
                    <option value="1">1 người</option>
                    <option value="2">2 người</option>
                    <option value="3">3 người</option>
                    <option value="4+">4+ người</option>
                  </select>
                </div>
                <div style={{ textAlign: "left" }}>
                  <label
                    style={{
                      color: "#334155",
                      fontWeight: 500,
                      marginBottom: 4,
                    }}
                  >
                    Loại tour
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #cbd5e1",
                      borderRadius: 8,
                      color: "#334155",
                    }}
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
                style={{
                  width: "100%",
                  border: "1.5px solid #90caf9",
                  borderRadius: 8,
                  padding: "14px 16px",
                  fontSize: "1.1rem",
                  color: "#1976d2",
                  background: "#f3f7fa",
                  boxShadow: "0 2px 8px rgba(25, 118, 210, 0.06)",
                  outline: "none",
                  marginBottom: 16,
                }}
              />
              <button
                style={{
                  width: "100%",
                  background: "#2563eb",
                  color: "#fff",
                  fontWeight: 700,
                  padding: "16px 0",
                  borderRadius: 8,
                  fontSize: 18,
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
                onClick={() => {}}
              >
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
      <section
        className="py-20 bg-gray-50"
        style={{ background: "#f9fafb", padding: "60px 0" }}
      >
        <div
          className="container mx-auto px-4"
          style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}
        >
          <div
            className="text-center mb-16"
            style={{ textAlign: "center", marginBottom: 64 }}
          >
            <h2
              className="text-4xl font-bold text-gray-800 mb-4"
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: "#1e293b",
                marginBottom: 16,
              }}
            >
              Tour Nổi Bật
            </h2>
            <p
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              style={{
                fontSize: 20,
                color: "#64748b",
                maxWidth: 600,
                margin: "0 auto",
              }}
            >
              Khám phá những điểm đến tuyệt vời với các gói tour được lựa chọn
              kỹ càng
            </p>
          </div>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: 32,
            }}
          >
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
                key={tour.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  boxShadow: "0 2px 16px rgba(30,136,229,0.07)",
                  overflow: "hidden",
                  transition: "all 0.3s",
                  position: "relative",
                }}
              >
                <div className="relative" style={{ position: "relative" }}>
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    style={{
                      width: "100%",
                      height: 260,
                      objectFit: "cover",
                      transition: "transform 0.3s",
                    }}
                  />
                  <div
                    className="absolute top-4 left-4 flex flex-wrap gap-2"
                    style={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    {tour.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded-full text-sm font-medium`}
                        style={{
                          padding: "6px 16px",
                          borderRadius: 999,
                          fontSize: 14,
                          fontWeight: 500,
                          background:
                            tag === "Bán chạy"
                              ? "#ef4444"
                              : tag === "Giảm giá"
                              ? "#22c55e"
                              : tag === "Mới"
                              ? "#3b82f6"
                              : tag === "Cao cấp"
                              ? "#a21caf"
                              : "#64748b",
                          color: "#fff",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      background: "rgba(255,255,255,0.8)",
                      padding: 8,
                      borderRadius: "50%",
                      border: "none",
                      cursor: "pointer",
                    }}
                    title="Yêu thích"
                  >
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
                <div className="p-6" style={{ padding: 24 }}>
                  <h3
                    className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors"
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#1e293b",
                      marginBottom: 8,
                      transition: "color 0.2s",
                    }}
                  >
                    {tour.title}
                  </h3>
                  <div
                    className="flex items-center text-gray-600 mb-4"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: "#64748b",
                      marginBottom: 12,
                    }}
                  >
                    <svg
                      className="w-4 h-4 mr-1"
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
                  <div
                    className="flex items-center justify-between text-sm text-gray-600 mb-4"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: 14,
                      color: "#64748b",
                      marginBottom: 12,
                    }}
                  >
                    <div
                      className="flex items-center"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        width={16}
                        height={16}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ marginRight: 4 }}
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12,6 12,12 16,14" />
                      </svg>
                      <span>{tour.duration}</span>
                    </div>
                    <div
                      className="flex items-center"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <svg
                        className="w-4 h-4 mr-1"
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
                  </div>
                  <div
                    className="flex items-center mb-4"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 16,
                    }}
                  >
                    <div
                      className="flex items-center"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(tour.rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
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
                      <span
                        className="ml-2 text-sm text-gray-600"
                        style={{
                          marginLeft: 8,
                          fontSize: 14,
                          color: "#64748b",
                        }}
                      >
                        {tour.rating} ({tour.reviews} đánh giá)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      {tour.originalPrice && (
                        <span
                          className="text-sm text-gray-500 line-through mr-2"
                          style={{
                            fontSize: 14,
                            color: "#94a3b8",
                            textDecoration: "line-through",
                            marginRight: 8,
                          }}
                        >
                          {tour.originalPrice}đ
                        </span>
                      )}
                      <span
                        className="text-2xl font-bold text-blue-600"
                        style={{
                          fontSize: 24,
                          fontWeight: 700,
                          color: "#2563eb",
                        }}
                      >
                        {tour.price}đ
                      </span>
                    </div>
                    <button
                      className={styles.bookBtn}
                      onClick={() => handleBookTour(tour)}
                      type="button"
                      style={{
                        background: "#2563eb",
                        color: "#fff",
                        fontWeight: 500,
                        padding: "10px 24px",
                        borderRadius: 8,
                        fontSize: 16,
                        border: "none",
                        cursor: "pointer",
                        transition: "background 0.2s",
                      }}
                    >
                      Đặt ngay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div
            className="text-center mt-12"
            style={{ textAlign: "center", marginTop: 48 }}
          >
            <button
              style={{
                background: "#2563eb",
                color: "#fff",
                fontWeight: 500,
                padding: "14px 40px",
                borderRadius: 12,
                fontSize: 18,
                border: "none",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
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
