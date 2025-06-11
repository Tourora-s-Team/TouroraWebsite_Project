import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import CarRentalPage from "./pages/CarRentalPage";
import PlaneTicketsPage from "./pages/PlaneTicketPage";
import FlightResultsPage from "./pages/FlightResultsPage";
import FlightBookingForm from "./components/FlightBookingForm";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/car-rental-service" element={<CarRentalPage />} />
          <Route path="/plane-tickets-service" element={<PlaneTicketsPage />} />
          <Route path="/flight-results" element={<FlightResultsPage />} />
          <Route path="/flight-booking" element={<FlightBookingForm />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
