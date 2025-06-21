import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import CarRentalPage from "./pages/CarRentalPage";
import PlaneTicketsPage from "./pages/PlaneTicketPage";
import FlightDetailsPage from "./pages/FlightDetailsPage";
import FlightBookingPage from "./pages/FlightBookingPage";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/car-rental-service" element={<CarRentalPage />} />
          <Route path="/plane-tickets-service" element={<PlaneTicketsPage />} />
          <Route path="/flight-details/:id" element={<FlightDetailsPage />} />
          <Route path="/flight-booking" element={<FlightBookingPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}
export default App;
