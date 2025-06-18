import React from 'react';
import HotelSearchResults from '../components/HotelSearchResults';

const mockHotels = [
    {
        name: "Khách sạn Melia Vinpearl Riverfront Đà Nẵng",
        rating: 4.5,
        reviewCount: 337,
        location: "An Hải Bắc, Sơn Trà",
        mainImage: "/assets/images/HotelBookingRoom1.jpg",
        images: [
            "/assets/images/HotelBookingRoom2.jpg",
            "/assets/images/HotelBookingRoom3.jpg",
            "/assets/images/HotelBookingRoom4.jpg"
        ],
        hasPool: true,
        hasWifi: true,
        hasRestaurant: true,
        hasParking: true,
        promoTag: "Mã giảm đến 500K có sẵn trong ví của bạn!",
        originalPrice: "2.611.190 VND",
        currentPrice: "1.958.399 VND"
    },
    {
        name: "Muong Thanh Grand Da Nang Hotel",
        rating: 4.2,
        reviewCount: 1200,
        location: "An Hải Tây, Sơn Trà",
        mainImage: "/assets/images/HotelBookingRoom5.jpg",
        images: [
            "/assets/images/HotelBookingRoom6.jpg",
            "/assets/images/HotelBookingRoom7.jpg",
            "/assets/images/HotelBookingRoom8.jpg"
        ],
        hasPool: true,
        hasWifi: true,
        hasRestaurant: true,
        hasParking: true,
        promoTag: "Mã giảm đến 500K có sẵn trong ví của bạn!",
        originalPrice: "1.250.297 VND",
        currentPrice: "943.723 VND"
    }
];

const HotelSearchResultsPage = () => {
    return (
        <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', paddingTop: '24px' }}>
            <HotelSearchResults hotels={mockHotels} />
        </div>
    );
};

export default HotelSearchResultsPage;
