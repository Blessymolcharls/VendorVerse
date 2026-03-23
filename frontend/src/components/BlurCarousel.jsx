import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BlurCarousel({ products }) {
  const navigate = useNavigate();
  const listRef = useRef(null);

  if (!products || products.length === 0) return null;

  // Lun Dev slider needs at least 6 items to look correct with the nth-child rules.
  // If we have fewer, loop them so the CSS rules don't break.
  let renderProducts = [...products];
  while (renderProducts.length > 0 && renderProducts.length < 6) {
    renderProducts = [...renderProducts, ...products];
  }

  const handleNext = () => {
    if (listRef.current) {
      listRef.current.appendChild(listRef.current.firstElementChild);
    }
  };

  const handlePrev = () => {
    if (listRef.current) {
      listRef.current.prepend(listRef.current.lastElementChild);
    }
  };

  return (
    <div className="lun-slider-container">
      <div className="lun-slider-list" ref={listRef}>
        {renderProducts.map((product, idx) => (
          <div 
            key={`${product._id}-${idx}`} 
            className="lun-slider-item"
            onClick={() => navigate(`/product/${product._id}`)}
          >
            <div className="lun-slider-image">
              <img 
                src={product.images?.[0] || 'https://placehold.co/400?text=No+Image'} 
                alt={product.name} 
              />
            </div>
            <div className="lun-slider-content">
              <h2>{product.name}</h2>
              <p className="lun-slider-price">₹{product.price?.toFixed(2)}</p>
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
