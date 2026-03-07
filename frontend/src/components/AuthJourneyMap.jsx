import { useState, useEffect, useRef } from 'react';

export default function AuthJourneyMap({ steps, activeStepId }) {
  const containerRef = useRef(null);
  const [planeStyle, setPlaneStyle] = useState({ top: 0, opacity: 0 });

  useEffect(() => {
    // If there is an active step, fly to it
    if (activeStepId && containerRef.current) {
      const activeElement = containerRef.current.querySelector(`[data-step="${activeStepId}"]`);
      if (activeElement) {
        // Offset the plane to align exactly with the center of the checkpoint node
        // The node is 16px tall. The plane is 30px tall. So offset = (16 - 30) / 2 = -7px 
        // We also want it to point slightly downwards as it moves down the list
        setPlaneStyle({
          top: activeElement.offsetTop - 7,
          opacity: 1,
          transform: 'rotate(90deg)' // Pointing down along the map line initially, could refine
        });

        // After a brief moment, level the plane out to point at the form
        setTimeout(() => {
          setPlaneStyle(prev => ({ ...prev, transform: 'rotate(15deg)' }));
        }, 400); 
      }
    } else {
      // Idle / Start state
      setPlaneStyle({ top: 0, opacity: 0, transform: 'rotate(45deg)' });
    }
  }, [activeStepId]);

  return (
    <div className="journey-map" ref={containerRef}>
      
      {/* Dashed Line */}
      <div className="journey-line"></div>

      {/* Checkpoints */}
      {steps.map((step) => {
        const isActive = activeStepId === step.id;
        const isPassed = steps.findIndex(s => s.id === activeStepId) > steps.findIndex(s => s.id === step.id);

        return (
          <div 
            key={step.id} 
            className="journey-step" 
            data-step={step.id}
            style={{ top: step.position }}
          >
            <div className={`checkpoint-node ${isActive ? 'active' : ''} ${isPassed ? 'passed' : ''}`}>
              {/* Optional inner dot for design */}
              <div className="inner-dot"></div>
            </div>
            {/* Optional label if we wanted to show text on the map itself */}
            {/* <span className={`checkpoint-label ${isActive ? 'active' : ''}`}>{step.label}</span> */}
          </div>
        );
      })}

      {/* Paper Airplane */}
      <div 
        className="journey-plane"
        style={{
          ...planeStyle,
          top: `${planeStyle.top}px`, // Apply calculated top position
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 2L11 13" stroke="url(#paint0_linear_map)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="url(#paint1_linear_map)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="rgba(139, 92, 246, 0.4)"/>
          <defs>
            <linearGradient id="paint0_linear_map" x1="11" y1="13" x2="22" y2="2" gradientUnits="userSpaceOnUse">
              <stop stopColor="#A78BFA" />
              <stop offset="1" stopColor="#F472B6" />
            </linearGradient>
            <linearGradient id="paint1_linear_map" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8B5CF6" />
              <stop offset="1" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
