import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CarRentalPage from './pages/CarRentalPage';
import HotelBookingPage from './pages/HotelBookingPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/car-rental-service" element={<CarRentalPage />} />
          <Route path="/hotel-booking" element={<HotelBookingPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
