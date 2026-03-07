import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BlurCarousel({ products }) {
  const navigate = useNavigate();
  // We keep track of the hovered item by index, initially null
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!products || products.length === 0) return null;

  return (
    <div 
      className="blur-carousel-wrapper" 
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <div className="blur-carousel-scroller">
        {products.map((product, index) => {
          const isHovered = hoveredIndex === index;
          const isSiblingHovered = hoveredIndex !== null && hoveredIndex !== index;
          
          let itemClass = "blur-carousel-item";
          if (isHovered) itemClass += " active";
          if (isSiblingHovered) itemClass += " blurred";

          return (
            <div 
              key={product._id} 
              className={itemClass}
              onMouseEnter={() => setHoveredIndex(index)}
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <div className="blur-carousel-image-container">
                  <img 
                    src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/400?text=No+Image'} 
                    alt={product.title} 
                    className="blur-carousel-image"
                  />
                  {/* Glowing backdrop layer specifically behind the image */}
                  <div className="blur-carousel-glow"></div>
              </div>

              <div className="blur-carousel-info">
                  <span className="blur-carousel-badge">Popular</span>
                  <h3>{product.title}</h3>
                  <div className="blur-carousel-price">
                      ${product.price.toFixed(2)}
                  </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
