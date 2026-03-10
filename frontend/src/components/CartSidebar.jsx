import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './CartSidebar.css';

export default function CartSidebar() {
  const { isCartOpen, closeCart, cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [isRendered, setIsRendered] = useState(false);

  // Allow CSS animation strictly on mount/unmount logic
  useEffect(() => {
    if (isCartOpen) setIsRendered(true);
    else {
      const timer = setTimeout(() => setIsRendered(false), 400); // Wait for transition
      return () => clearTimeout(timer);
    }
  }, [isCartOpen]);

  if (!isRendered) return null;

  return (
    <>
      <div 
        className={`cart-overlay ${isCartOpen ? 'open' : ''}`} 
        onClick={closeCart}
      />
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="cart-close-btn" onClick={closeCart}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p>Your cart is empty.</p>
              <button className="btn btn-outline" onClick={closeCart}>Continue Shopping</button>
            </div>
          ) : (
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item._id} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.images?.[0] || 'https://via.placeholder.com/100'} alt={item.name} />
                  </div>
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <p className="cart-item-price">₹{item.price.toFixed(2)}</p>
                    <div className="cart-item-actions">
                      <div className="cart-quantity-control">
                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                      </div>
                      <button className="cart-remove-btn" onClick={() => removeFromCart(item._id)}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <button 
              className="btn btn-primary cart-checkout-btn" 
              onClick={() => {
                closeCart();
                // Navigate to checkout in future, for now just alert
                alert('Proceeding to checkout...');
              }}
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
