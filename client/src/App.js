import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CarRentalPage from './pages/CarRentalPage';
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
            <Route path="/" element={<HomePage />} />
            <Route path="/car-rental-service" element={<CarRentalPage />} />
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
