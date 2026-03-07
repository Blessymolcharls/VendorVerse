import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getVendor } from '../services/api';
import ProductCard from '../components/ProductCard';
import RatingSystem from '../components/RatingSystem';

const Stars = ({ score }) => (
  <span className='stars'>
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} className={`star ${s <= Math.round(score) ? 'filled' : ''}`} style={{ fontSize: '1rem' }}>★</span>
    ))}
  </span>
);

export default function VendorProfilePage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getVendor(id)
      .then(({ data }) => setData(data))
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]); // eslint-disable-line

  if (loading) return <div className='spinner-wrap'><div className='spinner' /></div>;
  if (!data) return <div className='page'><p>Vendor not found.</p></div>;

  const { vendor, products, ratings } = data;

  return (
    <div className='page'>
      {/* Hero */}
      <div className='vendor-hero'>
        <div className='vendor-avatar'>
          {vendor.logo ? <img src={vendor.logo} alt={vendor.businessName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : '🏪'}
        </div>
        <div>
          <h1>{vendor.businessName}</h1>
          {vendor.averageRating > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <Stars score={vendor.averageRating} />
              <span style={{ opacity: 0.9 }}>{vendor.averageRating} ({vendor.totalRatings} reviews)</span>
            </div>
          )}
          {vendor.description && <p style={{ marginTop: 8 }}>{vendor.description}</p>}
          <div style={{ marginTop: 8, fontSize: '0.85rem', opacity: 0.8 }}>
            {vendor.address && <span>📍 {vendor.address}  </span>}
            {vendor.phone && <span>📞 {vendor.phone}</span>}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        {/* Products */}
        <div>
          <h2 style={{ marginBottom: '1rem' }}>Products ({products.length})</h2>
          {products.length === 0 ? (
            <div className='card' style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
              No products listed yet.
            </div>
          ) : (
            <div className='products-grid'>
              {products.map((p) => <ProductCard key={p._id} product={{ ...p, vendor }} />)}
            </div>
          )}

          {/* Reviews list */}
          {ratings.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h2 style={{ marginBottom: '1rem' }}>Recent Reviews</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {ratings.map((r) => (
                  <div key={r._id} className='card' style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600 }}>{r.buyer?.name || 'Buyer'}</span>
                      <Stars score={r.score} />
                    </div>
                    {r.review && <p style={{ marginTop: 6, color: 'var(--text-main)', fontSize: '0.9rem' }}>{r.review}</p>}
                    <div style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: 12 }}>
                      {r.reliability && <span>Reliability: {r.reliability}★</span>}
                      {r.communication && <span>Communication: {r.communication}★</span>}
                      {r.delivery && <span>Delivery: {r.delivery}★</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rating form */}
        <aside style={{ position: 'sticky', top: 90, alignSelf: 'start' }}>
          <RatingSystem vendorId={id} onRated={load} />
        </aside>
      </div>
    </div>
  );
}
