import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useState, useEffect, useRef } from 'react';
import { searchProductsByImage } from '../services/api';
import SidebarMenu from './SidebarMenu';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { cartCount, toggleCart } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const { data } = await searchProductsByImage(formData);
      if (data.success) {
        setSearchQuery('');
        navigate('/', { state: { imageSearchResults: data.products, isImageSearch: true } });
      }
    } catch (err) {
      console.error("Image search failed:", err);
      alert("Image search failed. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      if (searchQuery.trim()) {
        navigate(`/?search=${encodeURIComponent(searchQuery)}`, { state: null });
      } else {
        navigate('/', { state: null });
      }
    }
  };

  return (
    <>
      <SidebarMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <nav className='navbar'>
        <div className='navbar-inner'>
          <div style={{ display: 'flex', alignItems: 'center', width: '25%', justifyContent: 'flex-start' }}>
            <div 
              className="navbar-hamburger" 
              onClick={() => setIsSidebarOpen(true)}
              onMouseEnter={() => setIsLogoHovered(true)}
              onMouseLeave={() => setIsLogoHovered(false)}
              style={{ background: 'transparent', border: 'none', padding: 0, marginRight: '0.8rem', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              title="Open Menu"
            >
              <svg width="34" height="40" viewBox="0 0 100 120" style={{ overflow: 'visible', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))' }}>
                <path 
                  d={(isSidebarOpen || isLogoHovered) 
                    ? "M 10 20 L 40 20 L 70 20 L 70 20 L 60 20 L 90 20 L 90 35 L 10 35 Z" 
                    : "M 10 10 L 40 10 L 70 25 L 70 15 L 60 10 L 90 10 L 90 70 L 10 30 Z"} 
                  fill="#d1a85b" 
                  style={{ transition: 'd 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)' }} 
                />
                <path 
                  d={(isSidebarOpen || isLogoHovered) 
                    ? "M 10 55 L 90 55 L 90 70 L 10 70 Z" 
                    : "M 10 40 L 80 75 L 80 95 L 10 60 Z"} 
                  fill="#d1a85b" 
                  style={{ transition: 'd 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)' }} 
                />
                <path 
                  d={(isSidebarOpen || isLogoHovered) 
                    ? "M 10 90 L 60 90 L 90 90 L 90 105 L 50 105 L 10 105 Z" 
                    : "M 10 70 L 60 95 L 90 80 L 90 100 L 50 120 L 10 90 Z"} 
                  fill="#d1a85b" 
                  style={{ transition: 'd 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)' }} 
                />
              </svg>
            </div>
            <Link to='/' className='navbar-brand' style={{ textDecoration: 'none' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                letterSpacing: '0.12em', 
                fontWeight: '800', 
                fontFamily: '"Montserrat", "Outfit", sans-serif',
                fontSize: '1.55rem',
                color: 'var(--text-main)',
                transition: 'color 0.3s ease'
              }}>
                <svg viewBox="0 0 100 100" style={{ width: '0.9em', height: '0.9em', fill: 'currentColor', marginRight: '0.04em', transform: 'translateY(-1px)' }}>
                  <polygon points="2,0 12,0 46,100 36,100" />
                  <polygon points="100,0 66,0 32,100 66,100" />
                </svg>
                ENDOR
                <svg viewBox="0 0 100 100" style={{ width: '0.9em', height: '0.9em', fill: 'currentColor', marginLeft: '0.08em', marginRight: '0.04em', transform: 'translateY(-1px)' }}>
                  <polygon points="2,0 12,0 46,100 36,100" />
                  <polygon points="100,0 66,0 32,100 66,100" />
                </svg>
                ERSE
              </div>
            </Link>
          </div>
        
        {/* Functional Search Bar positioned right near the Logo */}
        {/* Premium Search Bar positioned near the Logo */}
        <div 
            className="navbar-search-wrapper"
            style={{ 
                flex: 1, 
                margin: '0 2rem', 
                maxWidth: '1000px',
                position: 'relative',
                borderRadius: '30px',
                background: theme === 'dark' 
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.05))' 
                    : 'linear-gradient(135deg, var(--primary), var(--secondary))',
                padding: '1px', /* This creates the gradient border */
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
            }}
            /* Add glow on hover to the whole wrapper */
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = theme === 'dark' 
                    ? '0 0 20px rgba(255,255,255,0.15), 0 4px 15px rgba(0,0,0,0.3)'
                    : '0 0 20px rgba(79, 70, 229, 0.3), 0 4px 15px rgba(0,0,0,0.2)';
                e.currentTarget.style.background = theme === 'dark'
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0.1))'
                    : 'linear-gradient(135deg, var(--primary), var(--accent))';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                e.currentTarget.style.background = theme === 'dark'
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.05))'
                    : 'linear-gradient(135deg, var(--primary), var(--secondary))';
            }}
        >
            <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                background: 'var(--bg-dark)',
                backdropFilter: 'blur(20px)',
                borderRadius: '29px',
                overflow: 'hidden',
                transition: 'background 0.3s ease'
            }}>
                <svg 
                    style={{ position: 'absolute', left: '1.2rem', color: 'var(--text-muted)', width: '18px', height: '18px', pointerEvents: 'none', zIndex: 2, opacity: 0.7 }} 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                    className="premium-search-input"
                    type="text" 
                    placeholder="Search products, vendors..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    style={{ 
                        width: '100%',
                        padding: '0.8rem 3.2rem 0.8rem 3.2rem', 
                        fontSize: '0.95rem',
                        fontWeight: '500',
                        backgroundColor: 'transparent',
                        color: 'var(--text-main)', 
                        border: 'none',
                        outline: 'none',
                    }}
                    onFocus={(e) => {
                        e.currentTarget.parentElement.style.background = 'var(--bg-light)';
                    }}
                    onBlur={(e) => {
                        e.currentTarget.parentElement.style.background = 'var(--bg-dark)';
                    }}
                />
                
                {/* Camera Icon for Image Search */}
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment" 
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    position: 'absolute',
                    right: '0.8rem',
                    background: 'transparent',
                    border: 'none',
                    color: isUploading ? 'var(--primary)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    transition: 'color 0.3s'
                  }}
                  title="Search by Image"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
                  ) : (
                    <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
            </div>
        </div>

        <div className='navbar-links' style={{ width: '25%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        {/* Navbar Links Cleared - Relying on Sidebar exclusively */}

          {/* Cart Toggle Icon */}
          <div 
            onClick={toggleCart}
            style={{
              position: 'relative',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(128, 128, 128, 0.1)',
              transition: 'all 0.3s ease',
              marginLeft: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(128, 128, 128, 0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(128, 128, 128, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            title="Open Shopping Cart"
          >
            <svg style={{ width: '26px', height: '26px', color: 'var(--text-main)', strokeWidth: '2.5' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {/* Basket Outline */}
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l2.5 10h10.5l2-8H6.5" />
              {/* Axle and Solid Wheels */}
              <circle cx="9.5" cy="18" r="2" fill="currentColor" stroke="none" />
              <circle cx="16.5" cy="18" r="2" fill="currentColor" stroke="none" />
              <path strokeLinecap="round" strokeWidth="3" d="M10 18h6" />
            </svg>
            
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ef4444',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                minWidth: '20px',
                height: '20px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
                border: '2px solid var(--glass-bg)',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}>
                {cartCount}
              </span>
            )}
          </div>

          {/* Animated Theme Toggle Switch */}
          <label className="theme-toggle-switch" title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            <input 
              type="checkbox" 
              className="theme-toggle-checkbox" 
              checked={theme === 'dark'} 
              onChange={toggleTheme} 
            />
            <div className="theme-toggle-slider">
              <div className="theme-toggle-circle">
                <svg className="theme-toggle-sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="4"></circle>
                    <path d="M12 2v2"></path>
                    <path d="M12 20v2"></path>
                    <path d="M5 5l1.5 1.5"></path>
                    <path d="M17.5 17.5L19 19"></path>
                    <path d="M2 12h2"></path>
                    <path d="M20 12h2"></path>
                    <path d="M5 19l1.5-1.5"></path>
                    <path d="M17.5 6.5L19 5"></path>
                  </g>
                </svg>
                <svg className="theme-toggle-moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
                </svg>
              </div>
            </div>
          </label>
        </div>
      </div>
      </nav>
    </>
  );
}
