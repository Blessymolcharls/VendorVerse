import { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductFilter from '../components/ProductFilter';
import CategoryBar from '../components/CategoryBar';
import BlurCarousel from '../components/BlurCarousel';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [isCategoryHovered, setIsCategoryHovered] = useState(false);

  const fetchProducts = useCallback(async (s = search, c = category, p = page) => {
    setLoading(true);
    try {
      // Tags here functions as the category ID if we set one
      const { data } = await getProducts({ search: s, tags: c, page: p, limit: 12 });
      setProducts(data.products);
      setTotal(data.total);
    } catch {
      // MOCK FALLBACK for UI testing if DB is down
      console.warn("Backend failed. Loading mock products for UI testing.");
      const mockProducts = Array.from({ length: 8 }).map((_, i) => ({
          _id: `mock-${i}`,
          title: `Premium Item ${i+1}`,
          price: 99.99 + (i * 10),
          images: [`https://picsum.photos/seed/${i+10}/400/400`]
      }));
      setProducts(mockProducts);
      setTotal(8);
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    fetchProducts(search, category, page);
  }, [page, search, category]); // eslint-disable-line

  const handleFilter = ({ search: newSearch }) => {
    setSearch(newSearch);
    setPage(1);
  };

  const handleCategorySelect = (categoryId) => {
    setCategory(categoryId);
    setPage(1);
  };

  const totalPages = Math.ceil(total / 12);

  return (
    <div className='page'>
      {/* Premium Hero Section */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.8))',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '4rem 2rem',
        color: '#fff',
        textAlign: 'center',
        marginBottom: '2rem',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
      }}>
        {/* Decorative glowing orbs */}
        <div style={{
          position: 'absolute', top: '-50%', left: '-10%', width: '50%', height: '200%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 60%)',
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute', bottom: '-50%', right: '-10%', width: '40%', height: '200%',
          background: 'radial-gradient(circle, rgba(163, 163, 163, 0.15) 0%, transparent 60%)',
          zIndex: 0
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 800,
            marginBottom: '1rem',
            background: 'linear-gradient(to right, #fff, #cbd5e1)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Welcome to VendorVerse
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto' }}>
            Discover exceptional wholesale products from trusted vendors worldwide, reimagined in a premium marketplace.
          </p>
        </div>
      </div>

      {/* Category Section Bar */}
      <div 
        onMouseEnter={() => setIsCategoryHovered(true)}
        onMouseLeave={() => setIsCategoryHovered(false)}
        style={{ position: 'relative' }}
      >
        <CategoryBar selectedCategory={category} onSelectCategory={handleCategorySelect} />

        {/* The Lun Dev Hover Carousel Element */}
        {isCategoryHovered && !loading && (
            <BlurCarousel products={products.slice(0, 8)} />
        )}
      </div>

      {/* Filter */}
      <ProductFilter onFilter={handleFilter} />

      {/* Results header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
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
        <div className='products-grid' style={{ marginTop: 0 }}>
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
