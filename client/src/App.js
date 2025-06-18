import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CarRentalPage from './pages/CarRentalPage';
import CarRentalDetailsPage from './pages/CarRentalDetailPage';
import RegisterForm from './components/header/RegisterForm'
import LoginForm from './components/header/LoginForm';

import AccountPage from './pages/AccountInfoPage';
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/car-rental-service" element={<CarRentalPage />} />
          <Route path="/car-rental-details" element={<CarRentalDetailsPage />} />
          {/* Thêm các route khác nếu cần */}
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/account-info" element={<AccountPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
