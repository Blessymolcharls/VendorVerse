import { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi'; // Assumes react-icons is installed, will fallback gracefully if not.

export default function ProductFilter({ onFilter }) {
  const [search, setSearch] = useState('');

  const handleSearch = () => {
    onFilter({ search });
  };

  const clearSearch = () => {
    setSearch('');
    onFilter({ search: '' });
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{
        position: 'relative',
        maxWidth: '600px',
        margin: '0 auto',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '999px',
          padding: '0.5rem 1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s ease',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#ffffff';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.2)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        }}
        >
          <svg style={{ color: '#94a3b8', width: '20px', height: '20px', marginLeft: '0.5rem', flexShrink: 0 }}
               fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          <input
            type='text'
            placeholder='Search for products, brands, or keywords...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#f8fafc',
              fontSize: '1rem',
              padding: '0.5rem 1rem',
              width: '100%'
            }}
          />

          {search && (
            <button
              onClick={clearSearch}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#737373'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
            >
              <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          <button 
            className='btn btn-primary' 
            style={{ padding: '0.5rem 1.5rem', borderRadius: '999px', marginLeft: '0.5rem' }}
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
