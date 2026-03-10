export default function CategoryBar({ selectedCategory, onSelectCategory }) {
  const topics = [
    { id: '', name: 'All' },
    { id: 'Electronics', name: 'Electronics' },
    { id: 'Clothing', name: 'Clothing & Fashion' },
    { id: 'Home', name: 'Home & Kitchen' },
    { id: 'Sports', name: 'Sports & Outdoors' },
    { id: 'Books', name: 'Books' },
    { id: 'Food', name: 'Groceries & Fresh' }
  ];

  return (
    <div className="sub-navbar">
      <div className="sub-navbar-content">
        {topics.map((topic) => (
          <button
            key={topic.name}
            className={`sub-nav-item ${selectedCategory === topic.id ? 'active' : ''}`}
            onClick={() => onSelectCategory(topic.id)}
          >
            {topic.name}
          </button>
        ))}
      </div>
    </div>
  );
}
