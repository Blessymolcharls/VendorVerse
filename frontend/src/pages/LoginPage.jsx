import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginVendor, loginBuyer } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [role, setRole]       = useState('buyer');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const fn = role === 'vendor' ? loginVendor : loginBuyer;
      const { data } = await fn({ email, password });
      login(data.user, data.token);
      navigate(role === 'vendor' ? '/dashboard' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='auth-page'>
      <div className='card auth-card'>
        <h2>Welcome Back</h2>
        <p>Sign in to your account</p>

        {error && <div className='alert alert-error'>{error}</div>}

        {/* Role Toggle */}
        <div style={{ display: 'flex', marginBottom: '1.5rem', borderRadius: 8, overflow: 'hidden', border: '2px solid #6c63ff' }}>
          {['buyer', 'vendor'].map((r) => (
            <button
              key={r}
              type='button'
              onClick={() => setRole(r)}
              style={{
                flex: 1, padding: '0.5rem',
                background: role === r ? '#6c63ff' : 'transparent',
                color: role === r ? '#fff' : '#6c63ff',
                border: 'none', cursor: 'pointer', fontWeight: 600,
                textTransform: 'capitalize',
              }}
            >
              {r === 'vendor' ? '🏪 Vendor' : '🛒 Buyer'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>Email</label>
            <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className='form-group'>
            <label>Password</label>
            <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className='btn btn-primary' type='submit' disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className='auth-switch'>
          Don't have an account? <Link to='/register'>Register</Link>
        </p>
      </div>
    </div>
  );
}
