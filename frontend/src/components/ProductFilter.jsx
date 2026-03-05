import { useState, useEffect } from 'react';
import { getTags } from '../services/api';

export default function ProductFilter({ onFilter }) {
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getTags().then((r) => setTags(r.data.tags)).catch(() => {});
  }, []);

  const toggleTag = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const apply = () => {
    onFilter({ search, tags: selectedTags.join(',') });
  };

  const reset = () => {
    setSearch('');
    setSelectedTags([]);
    onFilter({ search: '', tags: '' });
  };

  return (
    <div className='card' style={{ marginBottom: '1.5rem' }}>
      <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Filter Products</h3>

      {/* Search */}
      <div className='form-group'>
        <label>Search</label>
        <input
          type='text'
          placeholder='Search products...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && apply()}
        />
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 8 }}>
            Tags
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {tags.map((t) => (
              <span
                key={t._id}
                className={`tag ${selectedTags.includes(t._id) ? 'active' : ''}`}
                onClick={() => toggleTag(t._id)}
              >
                {t.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button className='btn btn-primary btn-sm' onClick={apply}>
          Apply
        </button>
        <button className='btn btn-outline btn-sm' onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
}
