import React, { useState, useEffect } from "react";

const NavigationDots = ({ active }) => {
  const [isDark, setIsDark] = useState(
    document.documentElement.getAttribute('data-theme') === 'dark'
  );

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="app__navigation">
      {["home", "about", "work", "skills", "contact"].map((item, index) => (
        <a
          href={`#${item}`}
          key={item + index}
          className={`app__navigation-dot ${active === item ? 'active' : ''}`}
          style={active === item ? { 
            backgroundColor: isDark ? "#00FF41" : "#C2185B", 
            boxShadow: isDark ? "0 0 3px #00FF41" : "0 0 3px #C2185B" 
          } : {}}
        />
      ))}
    </div>
  );
};

export default NavigationDots;
