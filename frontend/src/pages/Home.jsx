import { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductFilter from '../components/ProductFilter';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [loading, setLoading]   = useState(true);
  const [filters, setFilters]   = useState({ search: '', tags: '' });

  const fetchProducts = useCallback(async (f = filters, p = page) => {
    setLoading(true);
    try {
      const { data } = await getProducts({ ...f, page: p, limit: 12 });
      setProducts(data.products);
      setTotal(data.total);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    fetchProducts(filters, page);
  }, [page]); // eslint-disable-line

  const handleFilter = (f) => {
    setFilters(f);
    setPage(1);
    fetchProducts(f, 1);
  };

  const totalPages = Math.ceil(total / 12);

  return (
    <div className='page'>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #6c63ff 0%, #5a54d4 100%)',
        borderRadius: 16, padding: '3rem 2rem', color: '#fff',
        textAlign: 'center', marginBottom: '2rem',
      }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Welcome to VendorVerse
        </h1>
        <p style={{ opacity: 0.9, fontSize: '1.05rem' }}>
          Discover wholesale products from trusted vendors worldwide.
        </p>
      </div>

      {/* Filter */}
      <ProductFilter onFilter={handleFilter} />

      {/* Results header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1rem', color: '#6b7280' }}>
          {loading ? 'Loading...' : `${total} product${total !== 1 ? 's' : ''} found`}
        </h2>
      </div>

      {/* Grid */}
      {loading ? (
        <div className='spinner-wrap'><div className='spinner' /></div>
      ) : products.length === 0 ? (
        <div className='card' style={{ textAlign: 'center', color: '#6b7280', padding: '3rem', marginTop: '1rem' }}>
          No products found. Try a different search or filter.
        </div>
      ) : (
        <div className='products-grid'>
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: '2rem' }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`btn ${p === page ? 'btn-primary' : 'btn-outline'} btn-sm`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
