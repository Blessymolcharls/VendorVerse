import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import CategoryBar from '../components/CategoryBar';
import BlurCarousel from '../components/BlurCarousel';

export default function Home() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [isCategoryHovered, setIsCategoryHovered] = useState(false);

  const search = searchParams.get('search') || '';

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
  }, [page, search, category, fetchProducts]); // Added fetchProducts to deps

  const handleCategorySelect = (categoryId) => {
    setCategory(categoryId);
    setPage(1);
  };

  const totalPages = Math.ceil(total / 12);

  return (
    <div className='page'>
      {/* Premium Hero Section */}
      {/* The Hero text block was removed by user request to focus on the catalog immediately. */}

      {/* The Category Section Bar and Filter were here. Filter removed as requested. */}
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
