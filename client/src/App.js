import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ThemeProvider } from '@mui/material/styles';
import Layout from './components/Layout';
import CarRentalPage from './pages/CarRentalPage';
import CarRentalDetailsPage from './pages/CarRentalDetailPage';
import RegisterForm from './components/header/RegisterForm'
import LoginForm from './components/header/LoginForm';

import AccountPage from './pages/AccountInfoPage';
import BookingTourPage from "./pages/BookingTourPage";
import TourDetail from "./components/Tourdetails";
import Booking from "./components/Booking";
import { AuthProvider } from "./components/AuthContext"; // Thêm dòng này
import { BookingProvider } from "./components/BookingContext"; // Thêm dòng này


import PlaneTicketsPage from "./pages/PlaneTicketPage";
import FlightDetailsPage from "./pages/FlightDetailsPage";
import FlightBookingPage from "./pages/FlightBookingPage";

import PaymentPage from "./pages/PaymentForm";
import HotelBookingPage from './pages/HotelBookingPage';
import HotelSearchResultsPage from './pages/HotelSearchResultsPage';
import HotelDetailPage from './pages/HotelDetailPage';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<BookingTourPage />} />
            <Route path="/Tourdetails/:id" element={<TourDetail />} />
            <Route path="/booking/:id" element={<Booking />} />
            <Route path="/car-rental-service" element={<CarRentalPage />} />
            <Route path="/car-rental-details" element={<CarRentalDetailsPage />} />
            {/* Thêm các route khác nếu cần */}
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/account-info" element={<AccountPage />} />
            <Route path="/book-tour" element={<BookingTourPage />} />
            <Route path="/plane-tickets-service" element={<PlaneTicketsPage />} />
            <Route path="/flight-details/:id" element={<FlightDetailsPage />} />
            <Route path="/flight-booking" element={<FlightBookingPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/hotel-booking" element={<HotelBookingPage />} />
            <Route path="/hotel-search" element={<HotelSearchResultsPage />} />
            <Route path="/hotel/:id" element={<HotelDetailPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}
export default App;
