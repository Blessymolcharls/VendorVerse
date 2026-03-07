import { useState, useEffect } from 'react';
import { getMyVendorProfile, updateVendorProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';
import VendorDashboard from '../components/VendorDashboard';

export default function DashboardPage() {
  const { user } = useAuth();
  const [vendor, setVendor] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getMyVendorProfile()
      .then(({ data }) => { setVendor(data.vendor); setProfileForm(data.vendor); })
      .catch(() => { });
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await updateVendorProfile(profileForm);
      setVendor(data.vendor);
      setEditProfile(false);
      setMsg('Profile updated!');
      setTimeout(() => setMsg(''), 3000);
    } catch { /**/ }
    finally { setSaving(false); }
  };

  return (
    <div className='page'>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
        Vendor Dashboard
      </h1>

      {msg && <div className='alert alert-success'>{msg}</div>}

      <div className='dashboard-layout'>
        {/* Sidebar */}
        <aside>
          <div className='card dashboard-sidebar'>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.8rem', margin: '0 auto 0.75rem',
              }}>
                🏪
              </div>
              <div style={{ fontWeight: 700 }}>{vendor?.businessName}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.email}</div>
              {vendor?.averageRating > 0 && (
                <div style={{ color: '#fbbf24', fontWeight: 700, marginTop: 4 }}>
                  ★ {vendor.averageRating} ({vendor.totalRatings} reviews)
                </div>
              )}
            </div>

            {!editProfile ? (
              <>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{vendor?.description}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{vendor?.address}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{vendor?.phone}</div>
                <button
                  className='btn btn-outline btn-sm'
                  style={{ marginTop: '1rem', width: '100%' }}
                  onClick={() => setEditProfile(true)}
                >
                  Edit Profile
                </button>
              </>
            ) : (
              <form onSubmit={handleProfileSave}>
                <div className='form-group'>
                  <label>Business Name</label>
                  <input value={profileForm.businessName || ''} onChange={(e) => setProfileForm({ ...profileForm, businessName: e.target.value })} />
                </div>
                <div className='form-group'>
                  <label>Description</label>
                  <textarea value={profileForm.description || ''} onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })} rows={2} />
                </div>
                <div className='form-group'>
                  <label>Phone</label>
                  <input value={profileForm.phone || ''} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
                </div>
                <div className='form-group'>
                  <label>Address</label>
                  <input value={profileForm.address || ''} onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })} />
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className='btn btn-primary btn-sm' type='submit' disabled={saving}>
                    {saving ? '...' : 'Save'}
                  </button>
                  <button className='btn btn-outline btn-sm' type='button' onClick={() => setEditProfile(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </aside>

        {/* Main dashboard */}
        <main>
          <VendorDashboard vendor={vendor} />
        </main>
      </div>
    </div>
  );
}
