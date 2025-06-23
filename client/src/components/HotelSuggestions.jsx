import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HotelSuggestions.module.css';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';


const HotelCard = ({ hotel }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/hotel/${hotel._id}`);
    };

    return (
        <div className={styles.hotelCard} onClick={handleClick}>
            <div className={styles.imageContainer}>
                <img src={hotel.images && hotel.images[0] ? hotel.images[0] : '/assets/images/HotelBookingRoom1.jpg'} alt={hotel.name} />
            </div>
            <div className={styles.hotelInfo}>
                <h3>{hotel.name}</h3>
                <div className={styles.location}>
                    <LocationOnIcon /> {hotel.address?.city || ''}, {hotel.address?.country || ''}
                </div>
                <div className={styles.rating}>
                    <StarIcon /> {hotel.rating}
                </div>
                <div className={styles.amenities}>
                    <b>Tiện ích:</b> {hotel.amenities?.join(', ')}
                </div>
                <div className={styles.description}>
                    <b>Mô tả:</b> {hotel.description}
                </div>
                <div className={styles.contact}>
                    <b>Liên hệ:</b> {hotel.contactInfo?.phone} | {hotel.contactInfo?.email}
                </div>
                <div className={styles.price}>
                    <span className={styles.discountPrice}>{new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                    }).format(1000000 + (hotel.rating * 100000))}</span>
                </div>
            </div>
        </div>
    );
};

const HotelSuggestions = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/hotel/suggestions`)
            .then((res) => {
                if (!res.ok) throw new Error('Lỗi khi lấy dữ liệu khách sạn');
                return res.json();
            })
            .then((data) => {
                setHotels(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Đang tải gợi ý khách sạn...</div>;
    if (error) return <div style={{ color: 'red' }}>Lỗi: {error}</div>;

    return (
        <div className={styles.suggestionsContainer}>
            <section className={styles.section}>
                <h2>🌴 Gợi ý khách sạn nổi bật</h2>
                <div className={styles.hotelGrid}>
                    {hotels.map(hotel => (
                        <HotelCard key={hotel._id} hotel={hotel} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HotelSuggestions;
