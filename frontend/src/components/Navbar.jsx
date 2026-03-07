import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className='navbar'>
      <div className='navbar-inner'>
        <Link to='/' className='navbar-brand'>
          Vendor<span>Verse</span>
        </Link>

        <div className='navbar-links'>
          <Link to='/'>Browse</Link>

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
        </div>
      </div>
    </nav>
  );
}
