import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { getProducts, getRecommendations } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import CategoryBar from '../components/CategoryBar';
import BlurCarousel from '../components/BlurCarousel';

export default function Home() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [isCategoryHovered, setIsCategoryHovered] = useState(false);

  const search = searchParams.get('search') || '';
  const location = useLocation();
  const imageSearchResults = location.state?.imageSearchResults;
  const isImageSearch = location.state?.isImageSearch;

  const fetchProducts = useCallback(async (s = search, c = category, p = page) => {
    setLoading(true);
    
    if (isImageSearch && imageSearchResults) {
      setProducts(imageSearchResults);
      setTotal(imageSearchResults.length);
      setLoading(false);
      return;
    }

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
  }, [imageSearchResults, isImageSearch]); // eslint-disable-line

  useEffect(() => {
    fetchProducts(search, category, page);
  }, [page, search, category, fetchProducts, location.state]); // Added location.state to trigger on image search

  useEffect(() => {
    if (user && user.role === 'buyer') {
       getRecommendations()
         .then(({ data }) => setRecommendations(data.products || []))
         .catch(() => {});
    }
  }, [user]);

  const handleCategorySelect = (categoryId) => {
    setCategory(categoryId);
    setPage(1);
  };

  const totalPages = Math.ceil(total / 12);

  return (
    <>
      {/* 
        Full-width category sub-navbar that attaches directly to the main navbar above it.
        We deliberately wrap this outside the .page container to bypass its 3rem padding layout constraint.
      */}
      <div 
        onMouseEnter={() => setIsCategoryHovered(true)}
        onMouseLeave={() => setIsCategoryHovered(false)}
        style={{ position: 'relative', width: '100%', zIndex: 10, backgroundColor: '#232f3e' }}
      >
        <CategoryBar selectedCategory={category} onSelectCategory={handleCategorySelect} />

        {/* The Lun Dev Hover Carousel Element */}
        {isCategoryHovered && !loading && products.length > 0 && (
          <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', zIndex: 50, background: 'var(--bg-dark)', borderBottom: '1px solid var(--glass-border)' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
              <BlurCarousel products={products.slice(0, 8)} />
            </div>
          </div>
        )}
      </div>

      <div className='page'>
        {/* Premium Hero Section */}
        {/* The Hero text block was removed by user request to focus on the catalog immediately. */}

        {user && user.role === 'buyer' && recommendations.length > 0 && !search && category === '' && !isImageSearch && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Recommended for You</h2>
            <BlurCarousel products={recommendations} />
          </div>
        )}      {/* Results header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1rem', color: '#6b7280' }}>
          {loading ? 'Loading...' : isImageSearch ? `Found ${total} products matching your image` : `${total} product${total !== 1 ? 's' : ''} found`}
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
    </>
  );
}
