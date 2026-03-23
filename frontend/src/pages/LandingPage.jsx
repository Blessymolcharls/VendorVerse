import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="landing-page">
      {/* Live Animated Background Orbs */}
      <div className="landing-bg-orb landing-orb-1" />
      <div className="landing-bg-orb landing-orb-2" />
      <div className="landing-bg-orb landing-orb-3" />
      <div className="landing-bg-orb landing-orb-4" />

      {/* Floating particles */}
      <div className="landing-particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="landing-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 8}s`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="landing-content">
        {/* Logo */}
        <div className="landing-logo-wrapper">
          <div className="landing-logo-glow" />
          <svg viewBox="0 0 100 120" className="landing-logo-svg">
            <path d="M 10 10 L 40 10 L 70 25 L 70 15 L 60 10 L 90 10 L 90 70 L 10 30 Z" fill="#d1a85b" />
            <path d="M 10 40 L 80 75 L 80 95 L 10 60 Z" fill="#d1a85b" />
            <path d="M 10 70 L 60 95 L 90 80 L 90 100 L 50 120 L 10 90 Z" fill="#d1a85b" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="landing-title">
          <svg viewBox="0 0 100 100" className="landing-title-v">
            <polygon points="2,0 12,0 46,100 36,100" />
            <polygon points="100,0 66,0 32,100 66,100" />
          </svg>
          ENDOR
          <svg viewBox="0 0 100 100" className="landing-title-v">
            <polygon points="2,0 12,0 46,100 36,100" />
            <polygon points="100,0 66,0 32,100 66,100" />
          </svg>
          ERSE
        </h1>

        {/* Tagline */}
        <p className="landing-tagline">
          The Premier Poly-Vendor Marketplace
        </p>
        <p className="landing-subtitle">
          Connecting elite wholesalers with ambitious buyers worldwide
        </p>

        {/* CTA Card */}
        <div className="landing-glass-card">
          <div className="landing-cta-group">
            <Link to="/browse" className="landing-cta-btn landing-cta-primary" id="landing-browse-btn">
              <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Browse Products
            </Link>

            {!user && (
              <Link
                to="/login"
                className="landing-cta-btn landing-cta-secondary"
                id="landing-login-btn"
              >
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Sign In
              </Link>
            )}

            <Link to="/about" className="landing-cta-btn landing-cta-outline" id="landing-about-btn">
              <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About Us
            </Link>
          </div>
        </div>

        {/* Bottom subtle text */}
        <p className="landing-footer-text">
          Trusted by <span className="landing-highlight">500+</span> vendors worldwide
        </p>
      </div>
    </div>
  );
}
