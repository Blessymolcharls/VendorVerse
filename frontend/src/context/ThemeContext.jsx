import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  // On mount, check if there's a saved theme in localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('vendorverse-theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = (e) => {
    // Fallback if the browser doesn't support View Transitions API or if no event passed
    if (!document.startViewTransition || !e) {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      localStorage.setItem('vendorverse-theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      return;
    }

    // Capture the click coordinates for the ripple origin
    let x, y;
    if (e && e.clientX !== undefined && e.clientX !== 0) {
      x = e.clientX;
      y = e.clientY;
    } else {
      // Fallback to exactly center of the toggle switch if triggered via keyboard or onChange without MouseEvent
      const toggleEl = document.querySelector('.theme-toggle-switch');
      if (toggleEl) {
        const rect = toggleEl.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      } else {
        x = window.innerWidth / 2;
        y = 50;
      }
    }
    
    // Calculate the maximum radius needed to cover the entire screen from the click point
    const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
    );
    
    const isDark = theme === 'dark';

    // Start the transition
    const transition = document.startViewTransition(() => {
      const newTheme = isDark ? 'light' : 'dark';
      setTheme(newTheme);
      localStorage.setItem('vendorverse-theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    });

    // Execute the ripple animation when the DOM is ready
    transition.ready.then(() => {
        const clipPath = [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
        ];
        
        document.documentElement.animate(
            {
                // If switching to Light, reverse the animation (shrink old dark root away)
                // If switching to Dark, expand the new dark root out
                clipPath: isDark ? [...clipPath].reverse() : clipPath,
            },
            {
                duration: 500,
                easing: "ease-in-out",
                // Target the old frame if reversing, otherwise the new frame
                pseudoElement: isDark ? "::view-transition-old(root)" : "::view-transition-new(root)",
            }
        );
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
