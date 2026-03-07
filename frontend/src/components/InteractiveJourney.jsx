import React, { useState, useEffect, useRef } from 'react';
import OrigamiUnfold from './OrigamiUnfold';

/**
 * InteractiveJourney
 * A full-screen component that renders a curved path. A paper airplane flies between checkpoints.
 * At each checkpoint, a specific input field is presented. Pressing enter or a "Next" button advances the plane.
 *
 * @param {Array} steps - Array of objects: { id, label, type, required }
 * @param {Function} onSubmit - Function to call on final step: (formData) => Promise
 * @param {React.ReactNode} topContent - E.g. role toggle or welcome text at top
 */
export default function InteractiveJourney({ steps, onSubmit, topContent, ctaText = "Finish" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false); // Triggers flight
  const [showOrigami, setShowOrigami] = useState(false); // Triggers 3D unfold 1s later
  
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
      if (typeof window !== 'undefined') {
          const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
          handleResize();
          window.addEventListener('resize', handleResize);
          return () => window.removeEventListener('resize', handleResize);
      }
  }, []);

  const stepsArr = typeof steps === 'function' ? steps(formData) : steps;

  // Focus the input automatically whenever the step changes
  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
          inputRef.current?.focus();
          inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 800);
    }
  }, [currentIndex]);

  const currentStep = steps[currentIndex];

  const handleNext = async (e) => {
    e?.preventDefault();
    const currentStep = stepsArr[currentIndex];
    if (!currentStep) return;

    if (currentStep.required && !formData[currentStep.id]) {
        setError(`Please enter your ${currentStep.label.toLowerCase()}`);
        return;
    }
    
    setError('');

    if (currentIndex === stepsArr.length - 1) {
      setLoading(true);
      try {
        await onSubmit(formData);
        setIsSuccess(true);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleNext(e);
    }
  };

  const N = stepsArr.length || 1;
  const paddingY = 200; // Top and bottom padding
  const stepGap = 350; // Vertical distance between each node
  const totalMapHeight = Math.max(dimensions.height, paddingY * 2 + (N - 1) * stepGap);
  
  const paddingX = dimensions.width * 0.15;
  const X_LEFT = paddingX;
  const X_MID = dimensions.width * 0.50;
  const X_RIGHT = dimensions.width - paddingX;

  const nodePositions = [];
  for (let i = 0; i < N; i++) {
      let x, align;
      let cycle = i % 4;
      if (cycle === 0) { x = X_LEFT; align = 'bulletin-content-right'; }
      else if (cycle === 1) { x = X_MID; align = 'bulletin-content-right'; }
      else if (cycle === 2) { x = X_RIGHT; align = 'bulletin-content-left'; }
      else if (cycle === 3) { x = X_MID; align = 'bulletin-content-left'; }
      
      let y = paddingY + i * stepGap;
      nodePositions.push({ x, y, left: `${x}px`, top: `${y}px`, align });
  }

  let pathStr = "";
  if (N > 0) {
      pathStr += `M ${nodePositions[0].x} ${nodePositions[0].y}`;
      for (let i = 0; i < N - 1; i++) {
          let curr = nodePositions[i];
          let next = nodePositions[i+1];
          let D = (next.y - curr.y) / 2; // Perfect vertical tangent bezier
          pathStr += ` C ${curr.x} ${curr.y + D}, ${next.x} ${next.y - D}, ${next.x} ${next.y}`;
      }
  }

  let planeProgress = 0;
  if (stepsArr.length > 1) {
      planeProgress = (currentIndex / (stepsArr.length - 1)) * 100;
  } else if (stepsArr.length === 1) {
      planeProgress = 50;
  }

  useEffect(() => {
      if (isSuccess && !showOrigami) {
          setShowOrigami(true);
      }
  }, [isSuccess, showOrigami]);

  return (
    <div ref={containerRef} className={`interactive-journey-container ${isSuccess ? 'unfolding' : ''}`} style={{ overflowY: 'auto', overflowX: 'hidden', minHeight: '100vh', scrollBehavior: 'smooth' }}>
      
      <div style={{ position: 'relative', width: '100%', height: `${totalMapHeight}px` }}>
        {/* Background SVG Curve completely mathematically generated */}
        <svg className="journey-curve-svg" style={{ zIndex: 1, pointerEvents: 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            {pathStr && <path d={pathStr} fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="3" strokeDasharray="10 10" strokeLinecap="round" />}
        </svg>

      {/* The HTML Paper Airplane. Dynamically tracks path until success. */}
      {!showOrigami && (
        <div
          className="journey-plane-dynamic"
          style={{ 
              offsetPath: `path("${pathStr}")`,
              offsetDistance: `${planeProgress}%`,
              offsetRotate: 'auto',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '40px',
              height: '40px',
              zIndex: 100,
              transition: 'offset-distance 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
            <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%', transform: 'rotate(45deg)', filter: 'drop-shadow(0 0 10px rgba(163, 163, 163,0.8))' }}>
                <path d="M22 2L11 13" stroke="url(#plane-grad0)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="url(#plane-grad1)" stroke="url(#plane-grad1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                    <linearGradient id="plane-grad0" x1="11" y1="13" x2="22" y2="2" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#e5e5e5" />
                        <stop offset="1" stopColor="#F472B6" />
                    </linearGradient>
                    <linearGradient id="plane-grad1" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
                        <stop stopColor="rgba(255, 255, 255, 0.9)" />
                        <stop offset="1" stopColor="rgba(163, 163, 163, 0.9)" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
      )}



      {/* Success Unfold Animation Element */}
      <OrigamiUnfold isSuccess={showOrigami} />

      <div className="map-nodes-layer" style={{ height: `${totalMapHeight}px` }}>
          {topContent && <div className="journey-top-content">{topContent}</div>}

          {!isSuccess && stepsArr.map((step, index) => {
              const pos = nodePositions[index] || nodePositions[0];
              const isActive = index === currentIndex;
              const isCompleted = index < currentIndex;
              
              let wrapperClass = "map-bulletin-wrapper";
              if (isActive) wrapperClass += " active";
              if (isCompleted) wrapperClass += " completed";

              return (
                  <div key={step.id} className={wrapperClass} style={{ left: pos.left, top: pos.top }}>
                      <div className="map-bulletin-marker">
                              <div className="inner-glow"></div>
                          </div>
                          
                          <div className={`map-bulletin-content ${pos.align}`}>
                          <h2>{step.prompt || `Enter your ${step.label.toLowerCase()}`}</h2>
                          
                          {/* Completed Step View */}
                          {isCompleted ? (
                              <div className="completed-summary">
                                  ✓ {step.type === 'password' ? '••••••••' : formData[step.id]}
                              </div>
                          ) : (
                              /* Active Step View */
                              <>
                                  {isActive && error && <div className="alert alert-error" style={{ marginBottom: '1rem', background: 'rgba(115, 115, 115, 0.2)', padding: '0.5rem', fontSize: '0.9rem' }}>{error}</div>}
                                  
                                  {step.type === 'role-selection' ? (
                                      <div style={{ display: 'flex', gap: '1rem', width: '100%', marginTop: '1rem' }}>
                                          <button
                                              onClick={() => { setFormData({...formData, [step.id]: 'buyer'}); setTimeout(() => handleNext(), 100); }}
                                              className="btn btn-primary journey-next-btn"
                                              style={{ flex: 1, fontSize: '1rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.2)', border: '2px solid var(--primary)' }}
                                          >
                                              🛒 Buyer
                                          </button>
                                          <button
                                              onClick={() => { setFormData({...formData, [step.id]: 'vendor'}); setTimeout(() => handleNext(), 100); }}
                                              className="btn btn-primary journey-next-btn"
                                              style={{ flex: 1, fontSize: '1rem', padding: '1rem', background: 'rgba(163, 163, 163, 0.2)', border: '2px solid var(--secondary)' }}
                                          >
                                              🏪 Vendor
                                          </button>
                                      </div>
                                  ) : (
                                      <div style={{ display: 'flex', gap: '0.5rem', width: '100%', flexDirection: step.type === 'textarea' ? 'column' : 'row' }}>
                                          {step.type === 'textarea' ? (
                                              <textarea
                                                  ref={isActive ? inputRef : null}
                                                  value={formData[step.id] || ''}
                                                  onChange={(e) => setFormData({...formData, [step.id]: e.target.value})}
                                                  onKeyDown={(e) => {
                                                      if (e.key === 'Enter' && !e.shiftKey) {
                                                          e.preventDefault();
                                                          handleNext(e);
                                                      }
                                                  }}
                                                  placeholder={step.label}
                                                  className="journey-input"
                                                  style={{ marginBottom: 0, minHeight: '80px', resize: 'vertical' }}
                                                  disabled={!isActive}
                                              />
                                          ) : (
                                              <input 
                                                  ref={isActive ? inputRef : null}
                                                  type={step.type || 'text'}
                                                  value={formData[step.id] || ''}
                                                  onChange={(e) => setFormData({...formData, [step.id]: e.target.value})}
                                                  onKeyDown={handleKeyDown}
                                                  placeholder={step.label}
                                                  className="journey-input"
                                                  style={{ marginBottom: 0, flex: 1 }}
                                                  disabled={!isActive}
                                              />
                                          )}
                                          <button onClick={handleNext} disabled={loading || !isActive} className="btn btn-primary" style={{ padding: '0 1.5rem', height: step.type === 'textarea' ? '48px' : 'auto', alignSelf: step.type === 'textarea' ? 'flex-end' : 'stretch' }}>
                                              {index === stepsArr.length - 1 ? (loading ? 'Wait...' : ctaText) : "➔"}
                                          </button>
                                      </div>
                                  )}
                                  
                                  {step.type !== 'role-selection' && isActive && <p className="hint-text" style={{ marginTop: '0.5rem', marginBottom: 0 }}>Press <strong>Enter</strong> to continue</p>}
                              </>
                          )}
                      </div>
                  </div>
              );
          })}
      </div>
      </div>

    </div>
  );
}
