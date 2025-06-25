import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
    const [searchParams] = useSearchParams();
    const [searchResults, setSearchResults] = useState(mockHotels);

    useEffect(() => {
        // Get search parameters
        const destination = searchParams.get('destination');
        const checkIn = searchParams.get('checkIn');
        const checkOut = searchParams.get('checkOut');
        const guests = searchParams.get('guests');

        // Here you would typically make an API call to get the search results
        // For now, we'll just filter the mock data based on the destination
        if (destination) {
            const filteredHotels = mockHotels.filter(hotel =>
                hotel.location.toLowerCase().includes(destination.toLowerCase()) ||
                hotel.name.toLowerCase().includes(destination.toLowerCase())
            );
            setSearchResults(filteredHotels);
        }
    }, [searchParams]);

    return (
        <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', paddingTop: '24px' }}>
            <HotelSearchResults hotels={searchResults} />
        </div>
    );
};

export default HotelSearchResultsPage;
