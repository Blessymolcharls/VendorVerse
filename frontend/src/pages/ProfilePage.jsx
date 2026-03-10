import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Directly access the API since we are building custom auth routes in this component
const API_URL = 'http://localhost:5000/api';

export default function ProfilePage() {
  const { user, login } = useAuth(); // Need login purely to update context if we want to, though usually reload works
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Profile Editable Fields
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  
  // Addresses Array Management
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const u = data.user;
        setProfile(u);
        setName(u.name || '');
        setBusinessName(u.businessName || '');
        setPhone(u.phone || '');
        setDescription(u.description || '');
        setAddresses(u.addresses || []);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        setMessage({ text: 'Failed to load profile data', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    
    try {
      const token = localStorage.getItem('token');
      const payload = { phone, addresses };
      
      if (user.role === 'buyer') {
        payload.name = name;
      } else {
        payload.businessName = businessName;
        payload.description = description;
      }

      await axios.put(`${API_URL}/auth/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Update failed', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = () => {
    if (newAddress.trim() === '') return;
    setAddresses([...addresses, newAddress.trim()]);
    setNewAddress('');
  };

  const handleRemoveAddress = (index) => {
    const updated = [...addresses];
    updated.splice(index, 1);
    setAddresses(updated);
  };

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontWeight: 600 }}>Your Profile Space</h1>
      
      {message.text && (
        <div style={{
          padding: '1rem', 
          marginBottom: '1.5rem', 
          borderRadius: '8px', 
          backgroundColor: message.type === 'success' ? '#def7ec' : '#fde8e8',
          color: message.type === 'success' ? '#03543f' : '#9b1c1c'
        }}>
          {message.text}
        </div>
      )}

      <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Basic Information Section */}
        <section>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>Personal Information</h2>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem', color: '#4b5563' }}>Email Address (Read Only)</label>
                <input type="text" className="input" value={profile.email} disabled style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem', color: '#4b5563' }}>Role</label>
                <input type="text" className="input" value={profile.role === 'buyer' ? 'Customer' : 'Vendor'} disabled style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed', textTransform: 'capitalize' }} />
              </div>
            </div>

            {profile.role === 'buyer' ? (
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem', color: '#4b5563' }}>Full Name</label>
                <input type="text" className="input" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            ) : (
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem', color: '#4b5563' }}>Business Name</label>
                <input type="text" className="input" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem', color: '#4b5563' }}>Phone Number</label>
              <input type="text" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. +1 234 567 8900" />
            </div>

            {profile.role === 'vendor' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem', color: '#4b5563' }}>Business Description</label>
                <textarea className="input" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" />
              </div>
            )}
            
            <button type="submit" className="btn btn-primary" disabled={saving} style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </section>

        {/* Address Management Section */}
        <section>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>Address Book</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            {addresses.length === 0 ? (
              <p style={{ color: '#6b7280', fontSize: '0.9rem', fontStyle: 'italic' }}>No addresses saved yet.</p>
            ) : (
              addresses.map((addr, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.95rem' }}>{addr}</span>
                  <button onClick={() => handleRemoveAddress(idx)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}>
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              className="input" 
              placeholder="Add a new address (e.g. 123 Main St, Apt 4B...)" 
              value={newAddress} 
              onChange={(e) => setNewAddress(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddAddress()}
              style={{ flex: 1 }}
            />
            <button onClick={handleAddAddress} className="btn btn-outline" style={{ whiteSpace: 'nowrap' }}>
              Add Address
            </button>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.5rem' }}>Always remember to click "Save Changes" at the top to commit your new addresses to the database.</p>
        </section>

        {/* Complaints and Queries Section */}
        <section style={{ marginTop: '1rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg style={{ width: '20px', height: '20px', color: '#ef4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Complaints & Queries
          </h2>
          
          <div style={{ backgroundColor: '#fff5f5', border: '1px solid #fecaca', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ color: '#991b1b', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
              Are you experiencing issues with a vendor, a recent order, or the platform itself? Our support team is here to help resolve any disputes quickly and fairly.
            </p>
            
            <a 
              href="mailto:samerathkumar@gmail.com?subject=VendorVerse%20Complaint%2FQuery&body=Hi%20Samerath%2C%0A%0AI%20am%20reaching%20out%20regarding%20an%20issue%20with%20my%20VendorVerse%20account.%0A%0A%5BPlease%20describe%20your%20complaint%20here%5D"
              className="btn btn-danger"
              style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Customer Support
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
