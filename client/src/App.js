import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import HomePage  from './pages/HomePage';
import CarRentalPage from './pages/CarRentalPage';
import CarRentalDetailPage from './pages/CarRentalDetailsPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/car-rental-service" element={<CarRentalPage />} />
          <Route path="/car-rental-details" element={<CarRentalDetailPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
