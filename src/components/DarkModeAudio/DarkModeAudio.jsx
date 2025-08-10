import React, { useEffect, useRef, useState } from 'react';
import { BsPlayCircle, BsPauseCircle, BsMusicNote } from 'react-icons/bs';
import { images } from '../../constants';
import './DarkModeAudio.scss';

const DarkModeAudio = () => {
  const audioRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Detect theme changes
  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      const newIsDarkMode = theme === 'dark';
      setIsDarkMode(newIsDarkMode);
      
      // Pause music when switching to light mode
      if (!newIsDarkMode && isPlaying) {
        handlePause();
      }
    };

    // Check initial theme
    setTimeout(checkTheme, 100);

    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, [isPlaying]);

  const handlePlay = async () => {
    if (audioRef.current) {
      try {
        audioRef.current.volume = 1.0;
        audioRef.current.loop = true;
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.log('Audio play failed:', error);
      }
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };


  return (
    <>
      <audio
        ref={audioRef}
        preload="auto"
        style={{ display: 'none' }}
      >
        <source src={images.burzumAudio} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      
      {isDarkMode && (
        <button 
          className="music-button"
          onClick={togglePlayPause}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
          title={isPlaying ? 'Pause background music' : 'Play background music'}
        >
          <BsMusicNote className="music-icon" />
          {isPlaying ? (
            <BsPauseCircle className="play-pause-icon" />
          ) : (
            <BsPlayCircle className="play-pause-icon" />
          )}
        </button>
      )}
    </>
  );
};

export default DarkModeAudio;