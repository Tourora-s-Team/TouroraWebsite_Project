import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import CarRentalPage from "./pages/CarRentalPage";
import BookingTourPage from "./pages/BookingTourPage";
import TourDetail from "./components/Tourdetails";
import Booking from "./components/Booking";
import { AuthProvider } from "./components/AuthContext"; // Thêm dòng này
import BookingConfirmation from "./components/BookingConfirmation";
import { BookingProvider } from "./components/BookingContext"; // Thêm dòng này

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <Layout>
            <Routes>
              {/* <Route path="/" element={<HomePage />} /> */}
              <Route path="/car-rental-service" element={<CarRentalPage />} />
              <Route path="/" element={<BookingTourPage />} />
              <Route path="/Tourdetails/:id" element={<TourDetail />} />
              <Route path="/booking/:id" element={<Booking />} />
              <Route
                path="/booking-confirmation"
                element={<BookingConfirmation />}
              />
            </Routes>
          </Layout>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
