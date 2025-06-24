import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './CarRentalDetailPage.module.css';
import CarRentalDetail from '../../components/car-rental/CarRentalDetail';
import CarRentalBookingForm from '../../components/car-rental/CarRentalBookingForm';
import CarRentalBookingSuccess from '../../components/car-rental/CarRentalBookingSuccess';

const CarRentalDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);

    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                // Replace with your actual API call
                const response = await fetch(`/api/cars/${id}`);
                if (!response.ok) {
                    throw new Error('Car not found');
                }
                const data = await response.json();
                setCar(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCarDetails();
    }, [id]);

    const handleBookNowClick = () => {
        setShowBookingForm(true);
    };

    const handleBookingSubmit = async (formData) => {
        try {
            // Replace with your actual booking API call
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    carId: id,
                    ...formData
                }),
            });

            if (!response.ok) {
                throw new Error('Booking failed');
            }

            const bookingResult = await response.json();
            setBookingDetails(bookingResult);
            setBookingSuccess(true);
        } catch (err) {
            setError('Failed to complete booking. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.error}>
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/car-rental-service')}>
                    Back to Car Rental
                </button>
            </div>
        );
    }

    if (bookingSuccess) {
        return <CarRentalBookingSuccess booking={bookingDetails} />;
    }

    return (
        <div className={styles.detailPage}>
            <div className={styles.content}>
                <CarRentalDetail car={car} />
                {!showBookingForm && (
                    <div className={styles.bookingCTA}>
                        <button
                            className={styles.bookNowButton}
                            onClick={handleBookNowClick}
                        >
                            Book Now
                        </button>
                    </div>
                )}
                {showBookingForm && (
                    <div className={styles.bookingFormContainer}>
                        <CarRentalBookingForm
                            car={car}
                            onSubmit={handleBookingSubmit}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CarRentalDetailPage;
