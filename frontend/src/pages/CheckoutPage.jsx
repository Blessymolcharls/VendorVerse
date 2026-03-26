import { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { mockCheckoutPayment } from '../services/api';
import {
  FiMapPin,
  FiCreditCard,
  FiSmartphone,
  FiBox,
  FiCheckCircle,
  FiXCircle,
  FiPackage,
  FiPlus,
  FiShield,
  FiArrowRight,
  FiTruck,
} from 'react-icons/fi';

const PAYMENT_METHODS = [
  { id: 'COD', label: 'Cash on Delivery', subLabel: 'Pay securely when your package arrives', icon: FiPackage },
  { id: 'MOCK_UPI', label: 'Mock UPI', subLabel: 'Instant payment via any UPI app', icon: FiSmartphone },
  { id: 'MOCK_CARD', label: 'Mock Card', subLabel: 'Use any Visa or Mastercard', icon: FiCreditCard },
];

const Spinner = () => (
  <svg 
    viewBox="0 0 50 50" 
    style={{ width: '20px', height: '20px', animation: 'spinner-rotate 2s linear infinite' }}
  >
    <circle 
      cx="25" cy="25" r="20" fill="none" strokeWidth="5" 
      style={{ stroke: 'currentColor', strokeLinecap: 'round', animation: 'spinner-dash 1.5s ease-in-out infinite' }} 
    />
  </svg>
);

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [selectedAddress, setSelectedAddress] = useState(user?.addresses?.[0] || '');
  const [isEnteringNew, setIsEnteringNew] = useState(!user?.addresses || user.addresses.length === 0);
  const [customAddress, setCustomAddress] = useState('');
  
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Sync state if user loads asynchronously
  useEffect(() => {
    if (user?.addresses?.length > 0 && !selectedAddress && !isEnteringNew) {
      setSelectedAddress(user.addresses[0]);
      setIsEnteringNew(false);
    } else if (user && (!user.addresses || user.addresses.length === 0)) {
      setIsEnteringNew(true);
    }
  }, [user, selectedAddress, isEnteringNew]);

  const shippingAddress = useMemo(
    () => (isEnteringNew ? customAddress.trim() : (selectedAddress || '').trim()),
    [isEnteringNew, customAddress, selectedAddress]
  );

  const handleSelectSavedAddress = (addr) => {
    setSelectedAddress(addr);
    setIsEnteringNew(false);
  };

  const handleSelectNewAddress = () => {
    setIsEnteringNew(true);
    setSelectedAddress('');
  };

  const placeOrder = async () => {
    setError('');
    setResult(null);

    if (cartItems.length === 0) {
      setError('Your cart is empty. Add items before checkout.');
      return;
    }

    if (!shippingAddress) {
      setError('Please select or enter a shipping address.');
      return;
    }

    setPlacingOrder(true);
    try {
      const payload = {
        paymentMethod,
        shippingAddress,
        simulateFailure,
        items: cartItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),
      };

      const { data } = await mockCheckoutPayment(payload);
      setResult(data);

      if (data.status === 'success') {
        clearCart();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not process dummy payment');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (cartItems.length === 0 && !result) {
    return (
      <div className="page" style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', padding: '4rem 1rem' }}>
        <div className="card" style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <FiBox size={48} style={{ color: 'var(--border-subtle)' }} />
          <div>
            <h2 style={{ marginBottom: '0.5rem' }}>Your Cart is Empty</h2>
            <p style={{ color: 'var(--text-muted)' }}>You haven't added any items to your cart yet.</p>
          </div>
          <Link className="btn btn-primary" to="/browse">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ padding: '0.75rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius)', border: '1px solid var(--glass-border)', display: 'flex', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <FiShield size={24} style={{ color: 'var(--primary)' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.8rem', letterSpacing: '-0.5px', marginBottom: '0.2rem' }}>Secure Checkout</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            This is a simulated payment flow. No real money is charged.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        {/* Left Column: Forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative', transition: 'all 0.4s ease' }}>
          
          {/* Success/Failure Result State */}
          {result && (
            <div className="card" style={{ 
              padding: '3rem 2rem', 
              textAlign: 'center',
              border: `2px solid ${result.status === 'success' ? '#10B981' : '#EF4444'}`,
              boxShadow: `0 0 40px ${result.status === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
              animation: 'slideInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              background: 'linear-gradient(135deg, var(--glass-bg), rgba(20, 20, 20, 0.9))'
            }}>
              <div style={{ 
                display: 'inline-flex', 
                padding: '1.25rem', 
                borderRadius: '50%', 
                background: result.status === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: result.status === 'success' ? '#10B981' : '#EF4444',
                marginBottom: '1.5rem',
                boxShadow: `0 0 20px ${result.status === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
              }}>
                {result.status === 'success' ? <FiCheckCircle size={56} /> : <FiXCircle size={56} />}
              </div>
              
              <h2 style={{ marginBottom: '1rem', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
                {result.status === 'success' ? 'Payment Successful!' : 'Payment Failed'}
              </h2>
              
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                {result.status === 'success' ? 'Your order has been placed and is being processed.' : 'There was an issue processing your dummy payment.'}
              </p>

              <div style={{ display: 'inline-block', textAlign: 'left', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', width: '100%', maxWidth: '300px', margin: '0 auto 2rem' }}>
                <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <span>Method:</span> <strong style={{ color: 'var(--text-main)' }}>{PAYMENT_METHODS.find(m => m.id === result.method)?.label || result.method}</strong>
                </p>
                <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <span>Amount:</span> <strong style={{ color: 'var(--text-main)' }}>₹{result.amount.toFixed(2)}</strong>
                </p>
                <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <span>Txn ID:</span> <strong style={{ color: 'var(--text-main)', fontSize: '0.8rem', wordBreak: 'break-all', textAlign: 'right', maxWidth: '150px' }}>{result.transactionId}</strong>
                </p>
                {result.orderId && (
                  <p style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.9rem', paddingTop: '0.75rem', borderTop: '1px solid var(--glass-border)' }}>
                    <span>Order ID:</span> <strong style={{ color: 'var(--text-main)' }}>{result.orderId}</strong>
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                {result.status !== 'success' ? (
                  <button className="btn btn-primary" onClick={() => setResult(null)}>
                    Try again
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={() => navigate('/browse')} style={{ padding: '1rem 2rem' }}>
                    Continue Shopping <FiArrowRight />
                  </button>
                )}
              </div>
            </div>
          )}

          {!result && (
            <>
              {/* Shipping Address Section */}
              <div className="card" style={{ padding: '2rem', animation: 'fadeIn 0.4s ease-out' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
                    <FiMapPin size={22} color="var(--primary)" />
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.3px' }}>Shipping Address</h3>
                </div>

                <div className="radio-card-group">
                  {user?.addresses?.map((addr) => (
                    <div 
                      key={addr} 
                      className={`radio-card address-card ${(!isEnteringNew && selectedAddress === addr) ? 'active' : ''}`}
                      onClick={() => handleSelectSavedAddress(addr)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', color: (!isEnteringNew && selectedAddress === addr) ? 'var(--primary)' : 'var(--text-muted)', width: '100%', transition: 'all 0.3s' }}>
                        <FiMapPin size={16} /> <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}>Saved Address</span>
                      </div>
                      <span className="radio-card-label" style={{ fontWeight: 400, color: 'var(--text-muted)', lineHeight: '1.6' }}>{addr}</span>
                    </div>
                  ))}
                  <div 
                    className={`radio-card address-card ${isEnteringNew ? 'active' : ''}`}
                    onClick={handleSelectNewAddress}
                    style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: '120px' }}
                  >
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '50%', marginBottom: '0.5rem' }}>
                      <FiPlus size={24} style={{ color: isEnteringNew ? 'var(--primary)' : 'var(--text-main)', transition: 'color 0.3s' }} />
                    </div>
                    <span className="radio-card-label" style={{ color: 'var(--text-main)', fontWeight: 600 }}>Enter New Address</span>
                  </div>
                </div>

                {isEnteringNew && (
                  <div className="form-group" style={{ animation: 'fadeIn 0.3s ease-out', marginTop: '1rem' }}>
                    <textarea
                      rows={3}
                      placeholder="Enter the full shipping address (Street, City, Zip, Country)..."
                      value={customAddress}
                      onChange={(e) => setCustomAddress(e.target.value)}
                      autoFocus
                    />
                  </div>
                )}
              </div>

              {/* Delivery Estimate Widget */}
              {shippingAddress && (
                <div style={{ 
                  padding: '1.5rem', 
                  borderRadius: 'var(--radius)', 
                  background: 'linear-gradient(to right, rgba(79, 70, 229, 0.08), rgba(0,0,0,0.2))',
                  border: '1px solid var(--glass-border)',
                  borderLeft: '4px solid var(--primary)',
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1.25rem',
                  animation: 'fadeIn 0.5s ease-out'
                }}>
                  <div style={{ background: 'var(--bg-dark)', padding: '0.75rem', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', display: 'flex' }}>
                    <FiTruck size={24} color="var(--primary)" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.2rem' }}>Estimated Delivery</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>Arriving in <strong style={{ color: '#fff', fontWeight: 600 }}>3–5 Business Days</strong></p>
                  </div>
                </div>
              )}

              {/* Payment Method Section */}
              <div className="card" style={{ padding: '2rem', animation: 'fadeIn 0.6s ease-out' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
                    <FiCreditCard size={22} color="var(--primary)" />
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.3px' }}>Payment Method</h3>
                </div>

                <div className="radio-card-group" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                  {PAYMENT_METHODS.map((method) => {
                    const Icon = method.icon;
                    return (
                      <div 
                        key={method.id} 
                        className={`radio-card ${paymentMethod === method.id ? 'active' : ''}`}
                        onClick={() => setPaymentMethod(method.id)}
                        style={{ alignItems: 'flex-start', textAlign: 'left', padding: '1.25rem', justifyContent: 'center' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', marginBottom: '0.4rem' }}>
                          <div style={{ 
                            background: paymentMethod === method.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)', 
                            color: paymentMethod === method.id ? '#fff' : 'var(--text-muted)',
                            padding: '0.5rem', 
                            borderRadius: '50%',
                            display: 'flex',
                            transition: 'all 0.3s'
                          }}>
                            <Icon size={18} />
                          </div>
                          <span className="radio-card-label" style={{ fontSize: '1rem', flex: 1 }}>{method.label}</span>
                          {paymentMethod === method.id && <FiCheckCircle color="var(--primary)" size={18} style={{ animation: 'fadeIn 0.3s' }} />}
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, paddingLeft: '2.75rem', lineHeight: '1.4' }}>
                          {method.subLabel}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px dashed rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)', transition: 'background 0.3s' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={simulateFailure}
                      onChange={(e) => setSimulateFailure(e.target.checked)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#ef4444' }}
                    />
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      Force simulated payment failure (for testing UI behavior)
                    </span>
                  </label>
                </div>
                
                {error && (
                  <div className="alert alert-error" style={{ marginTop: '1.5rem', marginBottom: 0, animation: 'fadeIn 0.3s' }}>
                    <FiXCircle size={20} />
                    {error}
                  </div>
                )}
                
                <button 
                  className="btn btn-primary" 
                  disabled={placingOrder} 
                  onClick={placeOrder}
                  style={{ 
                    width: '100%', 
                    marginTop: '2rem', 
                    padding: '1.25rem', 
                    fontSize: '1.1rem', 
                    borderRadius: 'var(--radius-sm)',
                    opacity: placingOrder ? 0.8 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem'
                  }}
                >
                  {placingOrder ? (
                    <>
                      <Spinner /> Processing Payment...
                    </>
                  ) : (
                    <>
                      Confirm & Pay ₹{cartTotal.toFixed(2)} <FiArrowRight size={20} />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Right Column: Order Summary Glass Receipt */}
        <div style={{ position: 'sticky', top: '100px', transition: 'all 0.4s ease' }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden', border: 'none', background: 'transparent' }}>
            
            <div style={{ background: 'var(--glass-bg)', padding: '1.5rem 1.5rem', border: '1px solid var(--glass-border)', borderBottom: 'none', borderRadius: 'var(--radius) var(--radius) 0 0' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <FiPackage size={18} color="var(--primary)" /> Order Summary
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                {cartItems.map((item) => (
                  <div key={item._id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ 
                      width: '60px', height: '60px', 
                      background: 'var(--bg-darker)', 
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1px solid var(--glass-border)',
                      flexShrink: 0, overflow: 'hidden'
                    }}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <FiBox size={24} style={{ color: 'var(--text-muted)' }} />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '0.25rem' }}>
                        {item.name}
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</p>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Section with Receipt look */}
            <div style={{ 
              background: 'linear-gradient(135deg, var(--bg-dark), var(--bg-darker))', 
              padding: '1.5rem', 
              border: '1px solid var(--glass-border)', 
              borderTop: '1px dashed var(--border-subtle)',
              borderRadius: '0 0 var(--radius) var(--radius)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <span>Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <span>Shipping</span>
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Free</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '1.25rem', borderTop: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '1rem', fontWeight: 500 }}>Total</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}