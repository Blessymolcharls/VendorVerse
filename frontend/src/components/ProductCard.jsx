import { Link } from 'react-router-dom';

const StarRow = ({ score }) => (
  <span className='stars'>
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} className={`star ${s <= Math.round(score) ? 'filled' : ''}`}>
        ★
      </span>
    ))}
  </span>
);

export default function ProductCard({ product }) {
  const { _id, name, price, images, vendor, tags, stock, unit } = product;

  return (
    <div className='card' style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Image */}
      <Link to={`/products/${_id}`}>
        <div
          style={{
            height: 160,
            borderRadius: 8,
            overflow: 'hidden',
            background: '#ede9fe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {images?.[0] ? (
            <img
              src={images[0]}
              alt={name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span style={{ fontSize: '2.5rem' }}>📦</span>
          )}
        </div>
      </Link>

      {/* Name */}
      <Link to={`/products/${_id}`} style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a2e' }}>
        {name}
      </Link>

      {/* Price & stock */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#6c63ff', fontWeight: 800, fontSize: '1.1rem' }}>
          ${Number(price).toFixed(2)}
          <span style={{ fontSize: '0.7rem', fontWeight: 400, color: '#6b7280' }}>
            {' '}/ {unit || 'pc'}
          </span>
        </span>
        <span
          style={{
            fontSize: '0.75rem',
            color: stock > 0 ? '#059669' : '#dc2626',
            fontWeight: 600,
          }}
        >
          {stock > 0 ? `${stock} in stock` : 'Out of stock'}
        </span>
      </div>

      {/* Tags */}
      {tags?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {tags.map((t) => (
            <span key={t._id} className='tag'>
              {t.name}
            </span>
          ))}
        </div>
      )}

      {/* Vendor */}
      {vendor && (
        <Link
          to={`/vendors/${vendor._id}`}
          style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 'auto' }}
        >
          🏪 {vendor.businessName}
          {vendor.averageRating > 0 && (
            <span style={{ marginLeft: 6, color: '#f59e0b' }}>
              ★ {vendor.averageRating}
            </span>
          )}
        </Link>
      )}
    </div>
  );
}
