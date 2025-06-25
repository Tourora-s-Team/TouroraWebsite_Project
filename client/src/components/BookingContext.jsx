import React, { createContext, useContext, useState, useEffect } from "react";

const BookingContext = createContext(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);

  useEffect(() => {
    const savedBookings = localStorage.getItem("bookings");
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
  }, []);

  const createBooking = async (tour, travelers, startDate, specialRequests) => {
    const totalPrice = tour.price * travelers.length;
    const bookingId = Date.now().toString();

    const newBooking = {
      id: bookingId,
      tourId: tour.id,
      tour: tour,
      userId: "1", // Would be dynamic in real app
      travelers: travelers,
      startDate: startDate,
      totalPrice: totalPrice,
      status: "pending",
      paymentStatus: "pending",
      createdAt: new Date().toISOString(),
      specialRequests: specialRequests,
    };

    const updatedBookings = [...bookings, newBooking];
    setBookings(updatedBookings);
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));
    setCurrentBooking(newBooking);

    return bookingId;
  };

  const updateBookingStatus = (bookingId, status) => {
    const updatedBookings = bookings.map((booking) =>
      booking.id === bookingId ? { ...booking, status } : booking
    );
    setBookings(updatedBookings);
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));
  };

  const clearCurrentBooking = () => {
    setCurrentBooking(null);
  };

  const getBookingById = (id) => {
    return bookings.find((booking) => booking.id === id);
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        currentBooking,
        createBooking,
        updateBookingStatus,
        clearCurrentBooking,
        setCurrentBooking,
        getBookingById,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
