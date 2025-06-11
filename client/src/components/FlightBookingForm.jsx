import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./FlightBookingForm.module.css";

const FlightBookingForm = () => {
  const location = useLocation();
  const { flight, searchParams } = location.state || {};

  // Add meals data
  const meals = [
    {
      id: 1,
      name: "Uncle Chin's Chicken Rice",
      image: "/images/meals/chicken-rice.jpg",
      price: 85963,
      description: "Cơm gà hấp dẫn kiểu Malaysia",
    },
    {
      id: 2,
      name: "Cheesy Mushroom Chicken Panini",
      image: "/images/meals/panini.jpg",
      price: 85963,
      description: "Bánh mì kẹp gà nấm phô mai",
    },
    {
      id: 3,
      name: "Nasi Goreng Teri Daun Jeruk",
      image: "/images/meals/nasi-goreng.jpg",
      price: 85963,
      description: "Cơm chiên Indonesia truyền thống",
    },
    {
      id: 4,
      name: "Pak Nasser's Nasi Lemak",
      image: "/images/meals/nasi-lemak.jpg",
      price: 85963,
      description: "Cơm dừa Malaysia đặc trưng",
    },
  ];

  // Initialize form state
  const [form, setForm] = useState({
    contactInfo: {
      lastName: "",
      firstName: "",
      phone: "",
      email: "",
      countryCode: "+84",
    },
    passengers: Array(searchParams?.passengers || 1).fill({
      title: "",
      lastName: "",
      firstName: "",
      dob: "",
      nationality: "",
    }),
    addOns: {
      seat: false,
      meal: false,
      baggage: false,
    },
  });

  return (
    <div className={styles.container}>
      {/* Flight Summary Header */}
      <div className={styles.summaryHeader}>
        <div className={styles.flightInfo}>
          <div className={styles.route}>
            <h3>
              {flight?.from} → {flight?.to}
            </h3>
            <div className={styles.details}>
              <span>{flight?.date}</span>
              <span>{searchParams?.passengers || 1} hành khách</span>
              <span>
                {searchParams?.class === "economy" ? "Phổ thông" : "Thương gia"}
              </span>
            </div>
          </div>
          <div className={styles.tags}>
            <span className={styles.tag}>Có ÁP DỤNg đổi LỊCH Bay</span>
            <span className={styles.tag}>Có Thể HoàN Vé</span>
          </div>
        </div>

        {/* Price Summary */}
        <div className={styles.priceSummary}>
          <h4>Tóm tắt</h4>
          <div className={styles.priceDisplay}>
            <span>Giá bán trả</span>
            <span className={styles.price}>
              {flight?.price.toLocaleString()} VND
            </span>
          </div>
        </div>
      </div>

      {/* Add-ons Section */}
      <div className={styles.addOns}>
        <section className={styles.addOnItem}>
          <div className={styles.addOnHeader}>
            <img src="/icons/luggage.png" alt="Hành lý" />
            <div>
              <h4>Hành lý</h4>
              <p>
                Bạn có thể mang 20 kg kiện/khách. Cần mua thêm? Chạm tại đây.
              </p>
            </div>
          </div>
          <div className={styles.baggage}>
            <div className={styles.baggageRoute}>
              <span>1. CGK → DPS</span>
              <span>20kg/khách</span>
            </div>
            <div className={styles.price}>
              <span>Từ 281.909 VND</span>
              <button>Chọn</button>
            </div>
          </div>
        </section>

        <section className={styles.addOnItem}>
          <div className={styles.addOnHeader}>
            <img src="/icons/seat.png" alt="Số ghế" />
            <div>
              <h4>Số ghế</h4>
              <p>
                Đảm bảo chỗ ngồi của bạn ngay bây giờ để đảm bảo rằng bạn không
                ngồi riêng với bạn bè/gia đình.
              </p>
            </div>
          </div>
          <div className={styles.price}>
            <span>Từ 73.872 VND</span>
            <button>Chọn</button>
          </div>
        </section>

        <section className={styles.addOnItem}>
          <div className={styles.addOnHeader}>
            <img src="/icons/meal.png" alt="Bữa ăn" />
            <div>
              <h4>Bữa ăn trên máy bay</h4>
              <p>
                Lựa chọn từ nhiều món ăn ngon và nóng hổi phục vụ trên chuyến
                bay của bạn.
              </p>
            </div>
          </div>
          <div className={styles.mealList}>
            {meals.map((meal) => (
              <div key={meal.id} className={styles.mealItem}>
                <img src={meal.image} alt={meal.name} />
                <h5>{meal.name}</h5>
                <p>{meal.description}</p>
                <span className={styles.mealPrice}>
                  {meal.price.toLocaleString()} VND
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Contact Form */}
      <div className={styles.bookingForm}>
        <h3>Thông tin liên hệ (nhận vé/phiếu thanh toán)</h3>
        <div className={styles.formSection}>
          <div className={styles.formGroup}>
            <label>Họ (vd: Nguyen)*</label>
            <input type="text" placeholder="Nhập họ" />
            <small>như trên CMND (không dấu)</small>
          </div>
          <div className={styles.formGroup}>
            <label>Tên Đệm & Tên (vd: Thi Ngoc Anh)*</label>
            <input type="text" placeholder="Nhập tên đệm & tên" />
            <small className={styles.required}>
              Tên Đệm & Tên là phần bắt buộc
            </small>
          </div>
        </div>

        <div className={styles.formSection}>
          <div className={styles.formGroup}>
            <label>Điện thoại di động*</label>
            <div className={styles.phoneInput}>
              <select>
                <option value="+62">+62</option>
                <option value="+84">+84</option>
              </select>
              <input type="tel" placeholder="Số điện thoại" />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Email*</label>
            <input type="email" placeholder="VD: email@example.com" />
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className={styles.actions}>
        <button className={styles.continueBtn}>Tiếp tục</button>
      </div>
    </div>
  );
};

export default FlightBookingForm;
