import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerVendor, registerBuyer } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [role, setRole] = useState('buyer');
  const [form, setForm] = useState({ name: '', businessName: '', email: '', password: '', phone: '', address: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const fn = role === 'vendor' ? registerVendor : registerBuyer;
      const payload = role === 'vendor'
        ? { businessName: form.businessName, email: form.email, password: form.password, phone: form.phone, address: form.address, description: form.description }
        : { name: form.name, email: form.email, password: form.password, phone: form.phone, address: form.address };
      const { data } = await fn(payload);
      login(data.user, data.token);
      navigate(role === 'vendor' ? '/dashboard' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='auth-page'>
      <div className='card auth-card' style={{ maxWidth: 500 }}>
        <h2>Create Account</h2>
        <p>Join VendorVerse today</p>

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
              }}
            >
              {r === 'vendor' ? '🏪 I\'m a Vendor' : '🛒 I\'m a Buyer'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {role === 'buyer' ? (
            <div className='form-group'>
              <label>Full Name *</label>
              <input name='name' value={form.name} onChange={handleChange} required />
            </div>
          ) : (
            <>
              <div className='form-group'>
                <label>Business Name *</label>
                <input name='businessName' value={form.businessName} onChange={handleChange} required />
              </div>
              <div className='form-group'>
                <label>Business Description</label>
                <textarea name='description' value={form.description} onChange={handleChange} rows={2} />
              </div>
            </>
          )}

          <div className='form-group'>
            <label>Email *</label>
            <input name='email' type='email' value={form.email} onChange={handleChange} required />
          </div>
          <div className='form-group'>
            <label>Password *</label>
            <input name='password' type='password' value={form.password} onChange={handleChange} required minLength={6} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <div className='form-group'>
              <label>Phone</label>
              <input name='phone' value={form.phone} onChange={handleChange} />
            </div>
            <div className='form-group'>
              <label>Address</label>
              <input name='address' value={form.address} onChange={handleChange} />
            </div>
          </div>

          <button className='btn btn-primary' type='submit' disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className='auth-switch'>
          Already have an account? <Link to='/login'>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
