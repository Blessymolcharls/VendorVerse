import { useState, useEffect } from 'react';
import { getTags } from '../services/api';

export default function CategoryBar({ selectedCategory, onSelectCategory }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getTags()
      .then((r) => setCategories(r.data.tags))
      .catch(() => {
        console.warn("Categories failed. Loading mock categories.");
        setCategories([
          { _id: 'cat1', name: 'Electronics' },
          { _id: 'cat2', name: 'Fashion' },
          { _id: 'cat3', name: 'Home & Kitchen' }
        ]);
      });
  }, []);

  return (
    <div className="category-bar-container">
      <div className="category-bar">
        <button
          className={`category-pill ${selectedCategory === '' ? 'active' : ''}`}
          onClick={() => onSelectCategory('')}
        >
          All Products
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            className={`category-pill ${selectedCategory === cat._id ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat._id)}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
