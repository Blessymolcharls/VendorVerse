import { useState } from 'react';
import { submitRating } from '../services/api';
import { useAuth } from '../context/AuthContext';

const StarPicker = ({ value, onChange, label }) => (
  <div className='form-group'>
    {label && <label>{label}</label>}
    <div className='stars'>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={`star ${s <= value ? 'filled' : ''}`}
          onClick={() => onChange(s)}
          style={{ fontSize: '1.5rem' }}
        >
          ★
        </span>
      ))}
    </div>
  </div>
);

export default function RatingSystem({ vendorId, onRated }) {
  const { user } = useAuth();
  const [score, setScore]               = useState(0);
  const [reliability, setReliability]   = useState(0);
  const [communication, setCommunication] = useState(0);
  const [delivery, setDelivery]         = useState(0);
  const [review, setReview]             = useState('');
  const [loading, setLoading]           = useState(false);
  const [msg, setMsg]                   = useState('');
  const [error, setError]               = useState('');

  if (!user || user.role !== 'buyer') {
    return (
      <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
        <a href='/login'>Log in as a buyer</a> to rate this vendor.
      </p>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (score === 0) return setError('Please select an overall score.');
    setLoading(true);
    setError('');
    setMsg('');
    try {
      await submitRating({ vendorId, score, reliability, communication, delivery, review });
      setMsg('Rating submitted! Thank you.');
      if (onRated) onRated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='card'>
      <h3 style={{ marginBottom: '1rem' }}>Rate This Vendor</h3>
      {msg   && <div className='alert alert-success'>{msg}</div>}
      {error && <div className='alert alert-error'>{error}</div>}

      <form onSubmit={handleSubmit}>
        <StarPicker value={score} onChange={setScore} label='Overall Score *' />
        <StarPicker value={reliability}   onChange={setReliability}   label='Reliability' />
        <StarPicker value={communication} onChange={setCommunication} label='Communication' />
        <StarPicker value={delivery}      onChange={setDelivery}      label='Delivery Speed' />

        <div className='form-group'>
          <label>Review (optional)</label>
          <textarea
            placeholder='Share your experience...'
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </div>

        <button className='btn btn-primary' type='submit' disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Rating'}
        </button>
      </form>
    </div>
  );
}
