import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store'; // Import Redux store
import '@fortawesome/fontawesome-free/css/all.min.css';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CarRentalPage from './pages/car-rental-page/CarRentalPage';
import CarRentalDetailsPage from './pages/car-rental-page/CarRentalDetailPage';
import CarBookingDetailPage from './pages/car-rental-page/CarBookingDetailPage';
import BookingConfirmationPage from './pages/car-rental-page/BookingConfirmationPage';

import RegisterForm from './components/header/RegisterForm'
import LoginForm from './components/header/LoginForm';

import AccountPage from './pages/AccountInfoPage';
import BookingTourPage from "./pages/BookingTourPage";
import CarRentalSearchPage from './pages/car-rental-page/CarRentalSearchPage';

// Admin pages
import AdminLoginPage from './pages/car-rental-ad-pages/AdminLoginPage';
import AdminDashboardPage from './pages/car-rental-ad-pages/AdminDashboardPage';
import AdminCarManagementPage from './pages/car-rental-ad-pages/AdminCarManagementPage';
import AdminBookingManagementPage from './pages/car-rental-ad-pages/AdminBookingManagementPage';
import CarRentalServiceManagementPage from './pages/car-rental-ad-pages/CarRentalServiceManagementPage';
import ProtectedRoute from './components/car-rental-admin/ProtectedRoute';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Admin routes - không sử dụng Layout */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/cars" element={
            <ProtectedRoute>
              <AdminCarManagementPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/car-rental-services" element={
            <ProtectedRoute>
              <CarRentalServiceManagementPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/bookings" element={
            <ProtectedRoute>
              <AdminBookingManagementPage />
            </ProtectedRoute>
          } />

          {/* Public routes - sử dụng Layout */}
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/car-rental-service" element={<CarRentalPage />} />
                <Route path="/car-rental-service/search" element={<CarRentalSearchPage />} />
                <Route path="/car-rental-service/booking" element={<CarBookingDetailPage />} />
                <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
                {/* <Route path="/car-rental-details" element={<CarRentalDetailsPage />} /> */}
                {/* Thêm các route khác nếu cần */}
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/account-info" element={<AccountPage/>}/>
                <Route path="/book-tour" element={<BookingTourPage />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
