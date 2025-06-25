import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
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

function App() {
  return (
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
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
