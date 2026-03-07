import React from 'react';

export default function AboutPage() {
  return (
    <div className='page'>
      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.8))',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '4rem 2rem',
        color: '#fff',
        textAlign: 'center',
        margin: '2rem auto',
        maxWidth: '800px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 800,
          marginBottom: '1rem',
          background: 'linear-gradient(to right, #fff, #cbd5e1)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          About VendorVerse
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.15rem', lineHeight: '1.6', marginBottom: '2rem' }}>
          VendorVerse is the premier poly-vendor marketplace connecting elite wholesalers with ambitious buyers. Our platform is designed from the ground up to provide a seamless, premium, and highly visual experience for B2B transactions.
        </p>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '200px', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>Global Reach</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Connect with vendors and buyers from across the globe in one unified marketplace.</p>
            </div>
            <div style={{ flex: '1', minWidth: '200px', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>Premium Design</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Experience a hyper-modern interface tailored for clarity, speed, and elegance.</p>
            </div>
        </div>
      </div>
    </div>
  );
}
