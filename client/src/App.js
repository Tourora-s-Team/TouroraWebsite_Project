import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import HomePage  from './pages/HomePage';
import CarRentalPage from './pages/CarRentalPage';
import CarRentalResPage from './pages/CarRentalResultPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/car-rental-service" element={<CarRentalPage />} />
          <Route path="/car-rental-results" element={<CarRentalResPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
