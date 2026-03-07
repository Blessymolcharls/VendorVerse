import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { cartCount, toggleCart } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      if (searchQuery.trim()) {
        navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      } else {
        navigate('/');
      }
    }
  };

  return (
    <nav className='navbar'>
      <div className='navbar-inner'>
        <Link to='/' className='navbar-brand'>
          Vendor<span>Verse</span>
        </Link>
        
        {/* Functional Search Bar positioned right near the Logo */}
        {/* Premium Search Bar positioned near the Logo */}
        <div 
            className="navbar-search-wrapper"
            style={{ 
                flex: 1, 
                marginLeft: '3rem', 
                maxWidth: '450px',
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
                        padding: '0.8rem 1.5rem 0.8rem 3.2rem', 
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
            </div>
        </div>

        <div className='navbar-links'>
          <Link to='/'>Browse</Link>
          <Link to='/about'>About</Link>

          {!user && (
            <>
              <Link to='/login'>
                <button className='btn btn-outline btn-sm'>Log in</button>
              </Link>
              <Link to='/register'>
                <button className='btn btn-primary btn-sm'>Sign up</button>
              </Link>
            </>
          )}

          {user?.role === 'vendor' && (
            <>
              <Link to='/dashboard'>Dashboard</Link>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {user.businessName}
              </span>
              <button className='btn btn-outline btn-sm' onClick={handleLogout}>
                Logout
              </button>
            </>
          )}

          {user?.role === 'buyer' && (
            <>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Hi, {user.name}
              </span>
              <button className='btn btn-outline btn-sm' onClick={handleLogout}>
                Logout
              </button>
            </>
          )}

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
            <svg style={{ width: '22px', height: '22px', color: 'var(--text-main)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
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

          {/* Theme Toggle Switch */}
          <div 
            onClick={toggleTheme}
            style={{
              width: '56px',
              height: '30px',
              borderRadius: '30px',
              background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'var(--primary)',
              border: '1px solid var(--glass-border)',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
              cursor: 'pointer',
              marginLeft: '0.5rem',
              position: 'relative',
              transition: 'background 0.3s ease'
             }}
             title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {/* Sliding Knob */}
            <div 
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: '#fff',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: theme === 'dark' ? 'translateX(0)' : 'translateX(24px)',
                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {theme === 'dark' ? (
                  // Moon Icon (Small)
                  <svg style={{ width: '14px', height: '14px', color: '#000' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
              ) : (
                  // Sun Icon (Small)
                  <svg style={{ width: '14px', height: '14px', color: '#f59e0b' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
