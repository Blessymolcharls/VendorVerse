import { useState, useEffect, useCallback } from 'react';
import { getMyProducts, deleteProduct } from '../services/api';
import ProductForm from './ProductForm';

export default function VendorDashboard({ vendor }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState(null);   // product being edited
  const [adding, setAdding]     = useState(false);
  const [error, setError]       = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getMyProducts();
      setProducts(data.products);
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      setError('Failed to delete product');
    }
  };

  const handleSaved = () => {
    setEditing(null);
    setAdding(false);
    fetchProducts();
  };

  return (
    <div>
      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className='card dashboard-stat'>
          <div className='number'>{products.length}</div>
          <div className='label'>Products Listed</div>
        </div>
        <div className='card dashboard-stat'>
          <div className='number'>{vendor?.averageRating || '—'}</div>
          <div className='label'>Avg Rating</div>
        </div>
        <div className='card dashboard-stat'>
          <div className='number'>{vendor?.totalRatings || 0}</div>
          <div className='label'>Total Reviews</div>
        </div>
      </div>

      {/* Add Product */}
      <div className='card' style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: adding ? '1rem' : 0 }}>
          <h2 style={{ fontSize: '1.1rem' }}>My Products</h2>
          {!adding && (
            <button className='btn btn-primary btn-sm' onClick={() => { setAdding(true); setEditing(null); }}>
              + Add Product
            </button>
          )}
        </div>

        {adding && (
          <ProductForm
            onSaved={handleSaved}
            onCancel={() => setAdding(false)}
          />
        )}
      </div>

      {error && <div className='alert alert-error'>{error}</div>}

      {/* Product list */}
      {loading ? (
        <div className='spinner-wrap'><div className='spinner' /></div>
      ) : products.length === 0 ? (
        <div className='card' style={{ textAlign: 'center', color: '#6b7280', padding: '3rem' }}>
          No products yet. Add your first product above!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {products.map((p) => (
            <div key={p._id} className='card'>
              {editing?._id === p._id ? (
                <>
                  <h3 style={{ marginBottom: '1rem' }}>Edit: {p.name}</h3>
                  <ProductForm existing={editing} onSaved={handleSaved} onCancel={() => setEditing(null)} />
                </>
              ) : (
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  {/* Image */}
                  <div style={{
                    width: 80, height: 80, borderRadius: 8, overflow: 'hidden',
                    background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {p.images?.[0]
                      ? <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: '1.8rem' }}>📦</span>
                    }
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{p.name}</div>
                    <div style={{ color: '#6c63ff', fontWeight: 700 }}>₹{Number(p.price).toFixed(2)} / {p.unit}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Stock: {p.stock}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                      {p.tags?.map((t) => <span key={t._id} className='tag'>{t.name}</span>)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      className='btn btn-outline btn-sm'
                      onClick={() => { setEditing(p); setAdding(false); }}
                    >
                      Edit
                    </button>
                    <button className='btn btn-danger btn-sm' onClick={() => handleDelete(p._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
