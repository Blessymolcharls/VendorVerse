import { useState, useEffect } from 'react';
import { getTags, createTag, createProduct, updateProduct } from '../services/api';

export default function ProductForm({ existing, onSaved, onCancel }) {
  const [form, setForm] = useState({
    name: existing?.name || '',
    description: existing?.description || '',
    price: existing?.price || '',
    stock: existing?.stock || '',
    unit: existing?.unit || 'piece',
    minOrderQty: existing?.minOrderQty || 1,
    images: existing?.images?.join(', ') || '',
  });
  const [allTags, setAllTags]       = useState([]);
  const [selectedTags, setSelectedTags] = useState(
    existing?.tags?.map((t) => t._id) || []
  );
  const [newTagName, setNewTagName] = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  useEffect(() => {
    getTags().then((r) => setAllTags(r.data.tags)).catch(() => {});
  }, []);

  const toggleTag = (id) =>
    setSelectedTags((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));

  const addNewTag = async () => {
    if (!newTagName.trim()) return;
    try {
      const { data } = await createTag({ name: newTagName.trim() });
      setAllTags((prev) => [...prev.filter((t) => t._id !== data.tag._id), data.tag]);
      setSelectedTags((prev) => [...prev, data.tag._id]);
      setNewTagName('');
    } catch {
      setError('Could not create tag');
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      minOrderQty: Number(form.minOrderQty),
      images: form.images ? form.images.split(',').map((s) => s.trim()).filter(Boolean) : [],
      tags: selectedTags,
    };
    try {
      if (existing) {
        await updateProduct(existing._id, payload);
      } else {
        await createProduct(payload);
      }
      if (onSaved) onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className='alert alert-error'>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
        <div className='form-group' style={{ gridColumn: '1 / -1' }}>
          <label>Product Name *</label>
          <input name='name' value={form.name} onChange={handleChange} required />
        </div>
        <div className='form-group' style={{ gridColumn: '1 / -1' }}>
          <label>Description *</label>
          <textarea name='description' value={form.description} onChange={handleChange} required />
        </div>
        <div className='form-group'>
          <label>Price (USD) *</label>
          <input name='price' type='number' min='0' step='0.01' value={form.price} onChange={handleChange} required />
        </div>
        <div className='form-group'>
          <label>Stock Quantity *</label>
          <input name='stock' type='number' min='0' value={form.stock} onChange={handleChange} required />
        </div>
        <div className='form-group'>
          <label>Unit</label>
          <input name='unit' placeholder='piece, kg, box...' value={form.unit} onChange={handleChange} />
        </div>
        <div className='form-group'>
          <label>Min Order Qty</label>
          <input name='minOrderQty' type='number' min='1' value={form.minOrderQty} onChange={handleChange} />
        </div>
        <div className='form-group' style={{ gridColumn: '1 / -1' }}>
          <label>Image URLs (comma-separated)</label>
          <input name='images' placeholder='https://..., https://...' value={form.images} onChange={handleChange} />
        </div>
      </div>

      {/* Tags */}
      <div className='form-group'>
        <label>Tags</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          {allTags.map((t) => (
            <span
              key={t._id}
              className={`tag ${selectedTags.includes(t._id) ? 'active' : ''}`}
              onClick={() => toggleTag(t._id)}
            >
              {t.name}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            placeholder='New tag name...'
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addNewTag())}
            style={{ flex: 1 }}
          />
          <button type='button' className='btn btn-outline btn-sm' onClick={addNewTag}>
            + Add Tag
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button className='btn btn-primary' type='submit' disabled={loading}>
          {loading ? 'Saving...' : existing ? 'Update Product' : 'Add Product'}
        </button>
        {onCancel && (
          <button type='button' className='btn btn-outline' onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
