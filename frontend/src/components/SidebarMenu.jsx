import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function SidebarMenu({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  const categories = [
    'Electronics',
    'Clothing & Fashion',
    'Home & Kitchen',
    'Sports & Outdoors',
    'Books',
    'Groceries & Fresh'
  ];

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      
      <div className={`sidebar-menu ${isOpen ? 'open' : ''} ${theme}`}>
        <div className="sidebar-header">
          <div className="user-info">
            <svg style={{ width: '28px', height: '28px', marginRight: '10px' }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <h2>Hello, {user ? (user.name || user.businessName) : 'sign in'}</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="sidebar-content">
          <div className="sidebar-section">
            <h3>Account Settings</h3>
            <ul>
              {user ? (
                <>
                  <li><Link to="/profile" onClick={onClose}>Profile Settings</Link></li>
                  {user.role === 'vendor' && (
                    <li><Link to="/dashboard" onClick={onClose}>Vendor Dashboard</Link></li>
                  )}
                </>
              ) : (
                <>
                  <li><Link to="/login" onClick={onClose}>Sign In</Link></li>
                  <li><Link to="/register" onClick={onClose}>Create Account</Link></li>
                </>
              )}
            </ul>
          </div>

          <div className="sidebar-divider"></div>

          <div className="sidebar-section">
            <h3>Shop by Category</h3>
            <ul>
              <li><Link to="/" onClick={onClose}>All Products</Link></li>
              {categories.map((cat, idx) => (
                <li key={idx}>
                  <Link to={`/?category=${encodeURIComponent(cat)}`} onClick={onClose}>
                    {cat}
                    <svg className="chevron-right" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sidebar-divider"></div>

          <div className="sidebar-section">
            <h3>Programs & Features</h3>
            <ul>
              <li><Link to="/about" onClick={onClose}>About VendorVerse</Link></li>
              <li><Link to="/" onClick={onClose}>Today's Deals</Link></li>
            </ul>
          </div>

          {user && (
            <>
              <div className="sidebar-divider"></div>
              <div className="sidebar-section">
                <h3>Settings</h3>
                <ul>
                  <li><button className="text-btn" onClick={handleLogout}>Logout</button></li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
