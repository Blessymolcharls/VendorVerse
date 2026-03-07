import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BlurCarousel({ products: initialProducts }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  if (!products || products.length === 0) return null;

  const handleNext = () => {
    setProducts((prev) => {
      const clone = [...prev];
      const first = clone.shift();
      clone.push(first);
      return clone;
    });
  };

  const handlePrev = () => {
    setProducts((prev) => {
      const clone = [...prev];
      const last = clone.pop();
      clone.unshift(last);
      return clone;
    });
  };

  return (
    <div className="lun-slider-container">
      <div className="lun-slider-list">
        {products.map((product) => (
          <div 
            key={product._id} 
            className="lun-slider-item"
            onClick={() => navigate(`/product/${product._id}`)}
          >
            <div className="lun-slider-image">
              <img 
                src={product.images?.[0] || 'https://placehold.co/400?text=No+Image'} 
                alt={product.title} 
              />
            </div>
            <div className="lun-slider-content">
              <span className="lun-slider-badge">Premium Selection</span>
              <h2>{product.title}</h2>
              <p className="lun-slider-price">${product.price.toFixed(2)}</p>
              <button className="lun-slider-detail-btn">See Detail</button>
            </div>
          </div>
        ))}
      </div>

      <div className="lun-slider-arrows">
        <button id="prev" onClick={(e) => { e.stopPropagation(); handlePrev(); }}>&lt;</button>
        <button id="next" onClick={(e) => { e.stopPropagation(); handleNext(); }}>&gt;</button>
      </div>
    </div>
  );
}
