import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HotelDetail from '../components/HotelDetail';

const mockHotelsDetails = {
    1: {
        id: 1,
        name: "Mercure Danang French Village Bana Hills",
        location: "Hòa Vang",
        rating: 8.7,
        reviews: 1445,
        description: "Tọa lạc tại vị trí đắc địa trên đỉnh Bà Nà Hills, Mercure Danang French Village Bana Hills mang đến trải nghiệm nghỉ dưỡng độc đáo với kiến trúc Pháp cổ điển.",
        amenities: ["Hồ bơi", "Nhà hàng", "Spa", "Phòng gym", "WiFi miễn phí"],
        images: ["./assets/images/HotelBookingRoom1.jpg", "./assets/images/HotelBookingRoom2.jpg"],
        price: 2983209
    },

    2: {
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
    // Add more hotel details as needed
};

const HotelDetailPage = () => {
    const { id } = useParams();
    const [hotel, setHotel] = useState(null);

    useEffect(() => {
        // In a real application, you would fetch the hotel details from an API
        // For now, we'll use the mock data
        const hotelData = mockHotelsDetails[id];
        if (hotelData) {
            setHotel(hotelData);
        }
    }, [id]);

    if (!hotel) {
        return <div>Loading...</div>;
    }

    return <HotelDetail hotel={hotel} />;
};

export default HotelDetailPage;
