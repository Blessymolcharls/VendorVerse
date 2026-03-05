import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../services/api';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx]   = useState(0);

  useEffect(() => {
    getProduct(id)
      .then(({ data }) => setProduct(data.product))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className='spinner-wrap'><div className='spinner' /></div>;
  if (!product) return <div className='page'><p>Product not found.</p></div>;

  const { name, description, price, stock, unit, minOrderQty, images, vendor, tags, isAvailable } = product;

  return (
    <div className='page'>
      {/* Breadcrumb */}
      <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1.5rem' }}>
        <Link to='/'>Browse</Link> › {name}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Images */}
        <div>
          <div style={{
            background: '#ede9fe', borderRadius: 12, height: 360,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', marginBottom: 12,
          }}>
            {images?.[imgIdx] ? (
              <img src={images[imgIdx]} alt={name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <span style={{ fontSize: '5rem' }}>📦</span>
            )}
          </div>
          {images?.length > 1 && (
            <div style={{ display: 'flex', gap: 8 }}>
              {images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setImgIdx(i)}
                  style={{
                    width: 60, height: 60, borderRadius: 8, overflow: 'hidden',
                    border: i === imgIdx ? '3px solid #6c63ff' : '2px solid #e5e7eb',
                    cursor: 'pointer',
                  }}
                >
                  <img src={img} alt='' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>{name}</h1>

          {/* Tags */}
          {tags?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1rem' }}>
              {tags.map((t) => <span key={t._id} className='tag'>{t.name}</span>)}
            </div>
          )}

          {/* Price */}
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#6c63ff', marginBottom: '1rem' }}>
            ${Number(price).toFixed(2)}
            <span style={{ fontSize: '1rem', color: '#6b7280', fontWeight: 400 }}> / {unit}</span>
          </div>

          {/* Availability */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
            <span style={{ color: isAvailable && stock > 0 ? '#059669' : '#dc2626', fontWeight: 600 }}>
              {isAvailable && stock > 0 ? `✓ In Stock (${stock} units)` : '✗ Out of Stock'}
            </span>
            {minOrderQty > 1 && (
              <span style={{ color: '#6b7280' }}>Min order: {minOrderQty}</span>
            )}
          </div>

          {/* Description */}
          <div className='card' style={{ marginBottom: '1.5rem', background: '#f8f9fc' }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#6b7280' }}>Description</h3>
            <p style={{ lineHeight: 1.7 }}>{description}</p>
          </div>

          {/* Vendor */}
          {vendor && (
            <Link to={`/vendors/${vendor._id}`} style={{ textDecoration: 'none' }}>
              <div className='card' style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#6c63ff,#ff6584)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0,
                }}>🏪</div>
                <div>
                  <div style={{ fontWeight: 700, color: '#1a1a2e' }}>{vendor.businessName}</div>
                  {vendor.averageRating > 0 && (
                    <div style={{ color: '#f59e0b', fontSize: '0.85rem' }}>
                      ★ {vendor.averageRating} · {vendor.totalRatings} reviews
                    </div>
                  )}
                  <div style={{ fontSize: '0.8rem', color: '#6c63ff', marginTop: 2 }}>View vendor profile →</div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
