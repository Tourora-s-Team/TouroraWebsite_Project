import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage  from './pages/HomePage';
import CarRentalPage from './pages/CarRentalPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/car-rental-service" element={<CarRentalPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
