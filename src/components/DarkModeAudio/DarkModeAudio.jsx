import React, { useEffect, useRef, useState } from 'react';
import { images } from '../../constants';

const DarkModeAudio = () => {
  const audioRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);

  // Detect theme changes
  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      const newIsDarkMode = theme === 'dark';
      
      // Update dark mode state
      setIsDarkMode(newIsDarkMode);
      
      if (newIsDarkMode && !hasStartedPlaying) {
        // Start playing when entering dark mode for the first time (including on page load)
        playAudio();
        setHasStartedPlaying(true);
      } else if (newIsDarkMode && hasStartedPlaying) {
        // Resume if returning to dark mode
        playAudio();
      } else if (!newIsDarkMode) {
        // Pause when leaving dark mode
        pauseAudio();
      }
    };

    // Check initial theme
    checkTheme();

    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, [isDarkMode, hasStartedPlaying]);

  const playAudio = async () => {
    if (audioRef.current) {
      try {
        audioRef.current.volume = 1.0; // Full volume
        audioRef.current.loop = true;  // Loop the audio
        await audioRef.current.play();
      } catch (error) {
        console.log('Audio play failed:', error);
        // Some browsers require user interaction before playing audio
        // The audio will be ready to play when user interacts with the page
      }
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  // Handle user interaction to enable audio (required by most browsers)
  useEffect(() => {
    const handleUserInteraction = () => {
      if (isDarkMode && audioRef.current) {
        if (audioRef.current.paused) {
          playAudio();
          if (!hasStartedPlaying) {
            setHasStartedPlaying(true);
          }
        }
      }
    };

    // Add event listeners for user interactions
    const events = ['click', 'touchstart', 'keydown', 'mousemove'];
    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction, { once: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
    };
  }, [isDarkMode, hasStartedPlaying]);

  return (
    <audio
      ref={audioRef}
      preload="auto"
      style={{ display: 'none' }}
    >
      <source src={images.burzumAudio} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
};

export default DarkModeAudio;