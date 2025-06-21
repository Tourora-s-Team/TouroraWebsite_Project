import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store'; // Import Redux store
import '@fortawesome/fontawesome-free/css/all.min.css';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CarRentalPage from './pages/CarRentalPage';
import CarRentalDetailsPage from './pages/CarRentalDetailPage';

import RegisterForm from './components/header/RegisterForm'
import LoginForm from './components/header/LoginForm';

import AccountPage from './pages/AccountInfoPage';
import BookingTourPage from "./pages/BookingTourPage";
import CarRentalResultPage from './pages/CarRentalResultPage';
function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/car-rental-service" element={<CarRentalPage />} />
            <Route path="/car-rental-service/search" element={<CarRentalResultPage />} />
            {/* <Route path="/car-rental-details" element={<CarRentalDetailsPage />} /> */}
            {/* Thêm các route khác nếu cần */}
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/account-info" element={<AccountPage/>}/>
            <Route path="/book-tour" element={<BookingTourPage />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;
