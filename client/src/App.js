import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import CarRentalPage from "./pages/CarRentalPage";
import BookingTourPage from "./pages/BookingTourPage";
import InformationTour from "./components/InformationTour";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* <Route path="/" element={<HomePage />} /> */}
          <Route path="/car-rental-service" element={<CarRentalPage />} />
          <Route path="/" element={<BookingTourPage />} />
          <Route path="/information-tour/:id" element={<InformationTour />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
