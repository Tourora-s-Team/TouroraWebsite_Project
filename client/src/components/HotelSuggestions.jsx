import React from 'react';
import styles from './HotelSuggestions.module.css';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';


const mockHotels = {
    nearbyHotels: [
        {
            id: 1,
            name: "Mercure Danang French Village Bana Hills",
            location: "Hòa Vang",
            rating: 8.7,
            reviews: 1445,
            originalPrice: 2998200,
            discountPrice: 2983209,
            image: "./assets/images/HotelBookingRoom1.jpg",
            discount: 25,
            label: "Cho gia đình"
        },
        {
            id: 2,
            name: "Awaken Danang Hotel",
            location: "Phước Mỹ",
            rating: 9.2,
            reviews: 13,
            originalPrice: 1820105,
            discountPrice: 1365079,
            image: "./assets/images/HotelBookingRoom2.jpg",
            discount: 25,
            label: "Tiết kiệm"
        },
        {
            id: 3,
            name: "Cicilia Hotels & Spa Danang",
            location: "Mỹ An",
            rating: 8.5,
            reviews: 412,
            originalPrice: 1298571,
            discountPrice: 974229,
            image: "./assets/images/HotelBookingRoom3.jpg",
            discount: 25,
            label: "4-5 sao giá tốt"
        },
        {
            id: 4,
            name: "Novotel Danang Premier Han River",
            location: "Thạch Thang",
            rating: 8.8,
            reviews: 73,
            originalPrice: 2518265,
            discountPrice: 1888699,
            image: "./assets/images/HotelBookingRoom4.jpg",
            discount: 25,
            label: "4-5 sao giá tốt"
        }
    ],
    internationalHotels: [
        {
            id: 5,
            name: "Livotel Hotel Kaset Nawamin Bangkok",
            location: "Sena Nikhom",
            rating: 8.5,
            reviews: 4288,
            originalPrice: 716973,
            discountPrice: 537730,
            image: "./assets/images/HotelBookingRoom5.jpg",
            discount: 25,
            label: "Tiết kiệm"
        },
        {
            id: 6,
            name: "Novotel Bangkok Platinum",
            location: "Pratunam",
            rating: 8.7,
            reviews: 657,
            originalPrice: 5165461,
            discountPrice: 3874096,
            image: "./assets/images/HotelBookingRoom6.jpg",
            discount: 25,
            label: "Tiết kiệm"
        },
        {
            id: 7,
            name: "First House Hotel",
            location: "Pratunam",
            rating: 8.6,
            reviews: 2488,
            originalPrice: 1526531,
            discountPrice: 1391761,
            image: "./assets/images/HotelBookingRoom7.jpg",
            label: "Top yêu thích"
        },
        {
            id: 8,
            name: "Asia Hotel Bangkok",
            location: "Phetchaburi",
            rating: 8.5,
            reviews: 2519,
            originalPrice: 919080,
            discountPrice: 915514,
            image: "./assets/images/HotelBookingRoom8.jpg",
            label: "4-5 sao giá tốt"
        }
    ]
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
};

const HotelSuggestions = () => {
    return (
        <div className={styles.suggestionsContainer}>
            <section className={styles.section}>
                <h2>🌴 Chơi cuối tuần gần nhà</h2>
                <div className={styles.locationTags}>
                    <button className={styles.activeTag}>Đà Nẵng</button>
                    <button>Đà Lạt</button>
                    <button>Tp. Hồ Chí Minh</button>
                    <button>Vũng Tàu</button>
                    <button>Nha Trang</button>
                    <button>Hà Nội</button>
                    <button>Phan Thiết</button>
                    <button>Huế</button>
                </div>
                <div className={styles.hotelGrid}>
                    {mockHotels.nearbyHotels.map(hotel => (
                        <div key={hotel.id} className={styles.hotelCard}>
                            <div className={styles.imageContainer}>
                                <img src={hotel.image} alt={hotel.name} />
                                {hotel.discount && (
                                    <div className={styles.discount}>
                                        Tiết kiệm {hotel.discount}%
                                    </div>
                                )}
                                {hotel.label && (
                                    <div className={styles.label}>
                                        {hotel.label}
                                    </div>
                                )}
                            </div>
                            <div className={styles.hotelInfo}>
                                <h3>{hotel.name}</h3>
                                <div className={styles.location}>
                                    <LocationOnIcon />
                                    <span>{hotel.location}</span>
                                </div>
                                <div className={styles.rating}>
                                    <div className={styles.score}>
                                        <StarIcon />
                                        <span>{hotel.rating}/10</span>
                                    </div>
                                    <span className={styles.reviews}>({hotel.reviews})</span>
                                </div>
                                <div className={styles.pricing}>
                                    {hotel.originalPrice !== hotel.discountPrice && (
                                        <span className={styles.originalPrice}>
                                            {formatPrice(hotel.originalPrice)}
                                        </span>
                                    )}
                                    <span className={styles.price}>
                                        {formatPrice(hotel.discountPrice)}
                                    </span>
                                    <span className={styles.perNight}>/ đêm</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <h2>🌏 Đi chơi Thái-Sing-Mã</h2>
                <div className={styles.locationTags}>
                    <button className={styles.activeTag}>Bangkok</button>
                    <button>Pattaya</button>
                    <button>Phuket</button>
                    <button>Singapore</button>
                    <button>Kuala Lumpur</button>
                    <button>Penang</button>
                    <button>Chiang Mai</button>
                </div>
                <div className={styles.hotelGrid}>
                    {mockHotels.internationalHotels.map(hotel => (
                        <div key={hotel.id} className={styles.hotelCard}>
                            <div className={styles.imageContainer}>
                                <img src={hotel.image} alt={hotel.name} />
                                {hotel.discount && (
                                    <div className={styles.discount}>
                                        Tiết kiệm {hotel.discount}%
                                    </div>
                                )}
                                {hotel.label && (
                                    <div className={styles.label}>
                                        {hotel.label}
                                    </div>
                                )}
                            </div>
                            <div className={styles.hotelInfo}>
                                <h3>{hotel.name}</h3>
                                <div className={styles.location}>
                                    <LocationOnIcon />
                                    <span>{hotel.location}</span>
                                </div>
                                <div className={styles.rating}>
                                    <div className={styles.score}>
                                        <StarIcon />
                                        <span>{hotel.rating}/10</span>
                                    </div>
                                    <span className={styles.reviews}>({hotel.reviews})</span>
                                </div>
                                <div className={styles.pricing}>
                                    {hotel.originalPrice !== hotel.discountPrice && (
                                        <span className={styles.originalPrice}>
                                            {formatPrice(hotel.originalPrice)}
                                        </span>
                                    )}
                                    <span className={styles.price}>
                                        {formatPrice(hotel.discountPrice)}
                                    </span>
                                    <span className={styles.perNight}>/ đêm</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HotelSuggestions;
