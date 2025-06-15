import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CarRentalPage from './pages/CarRentalPage';
import RegisterForm from './components/header/RegisterForm'
import LoginForm from './components/header/LoginForm';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/car-rental-service" element={<CarRentalPage />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
