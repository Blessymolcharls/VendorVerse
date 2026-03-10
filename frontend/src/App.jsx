import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import VendorProfilePage from './pages/VendorProfilePage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import LandingPage from './pages/LandingPage';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to='/login' replace />;
  if (role && user.role !== role) return <Navigate to='/' replace />;
  return children;
};

function AppRoutes() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <>
      {!isLanding && <Navbar />}
      {!isLanding && <CartSidebar />}
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/browse' element={<Home />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/vendors/:id' element={<VendorProfilePage />} />
        <Route path='/products/:id' element={<ProductDetailPage />} />
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute role='vendor'>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
