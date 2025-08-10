import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { AppWrap } from "../../wrapper";
import { images } from "../../constants";
import HeaderTicket from "../../components/CinemaTicket/HeaderTicket";
import "./Header.scss";

const scaleVariants = {
  whileInView: {
    scale: [0, 1],
    opacity: [0, 1],
    transition: {
      duration: 1,
      ease: "easeInOut",
    },
  },
};

// Planetary skill circles component
const PlanetarySkillCircles = () => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  
  // Define skills with their properties - much smaller on mobile
  const getMobileSize = (size) => {
    if (window.innerWidth <= 450) {
      return Math.round(size * 0.25); // Much smaller on small mobile
    } else if (window.innerWidth <= 768) {
      return Math.round(size * 0.35); // Smaller on mobile
    } else if (window.innerWidth <= 1200) {
      return Math.round(size * 0.6); // Smaller on tablets
    }
    return size; // Full size on desktop
  };

  const skillsData = [
    { image: images.python, size: getMobileSize(140), color: '#3776ab' },
    { image: images.numpy, size: getMobileSize(180), color: '#013243' },
    { image: images.tableau, size: getMobileSize(150), color: '#e97627' },
    { image: images.sql, size: getMobileSize(160), color: '#336791' },
    { image: images.bigQuery, size: getMobileSize(145), color: '#4285f4' },
    { image: images.flutter, size: getMobileSize(170), color: '#02569b' },
    { image: images.react, size: getMobileSize(155), color: '#61dafb' },
  ];

  const [circles, setCircles] = useState([]);

  // Initialize circles with random positions and velocities
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use a timeout to ensure proper dimensions after component mount
    const initializeCircles = () => {
      // Use full window dimensions
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Gravitational center point (center of screen)
      const centerX = windowWidth / 2;
      const centerY = windowHeight / 2;

      const initialCircles = skillsData.map((skill, index) => {
        // Create orbital distances and angles for each planet
        const minOrbit = Math.min(windowWidth, windowHeight) * 0.15; // Minimum orbital radius
        const maxOrbit = Math.min(windowWidth, windowHeight) * 0.4; // Maximum orbital radius
        const orbitRadius = minOrbit + (maxOrbit - minOrbit) * (index / (skillsData.length - 1));
        
        // Random starting angle for orbital position
        const angle = (Math.PI * 2 * index) / skillsData.length + Math.random() * 0.5;
        
        // Calculate initial position based on orbital radius and angle
        const x = centerX + Math.cos(angle) * orbitRadius;
        const y = centerY + Math.sin(angle) * orbitRadius;
        
        // Orbital velocity (slower for planets further from center)
        const baseSpeed = 0.001; // Very slow planetary speed
        const orbitSpeed = baseSpeed * (minOrbit / orbitRadius); // Slower for distant planets
        
        return {
          id: index,
          x: x,
          y: y,
          centerX: centerX,
          centerY: centerY,
          orbitRadius: orbitRadius,
          angle: angle,
          orbitSpeed: orbitSpeed * (Math.random() * 0.5 + 0.75), // Small variation in speed
          clockwise: index % 2 === 0, // Some orbit clockwise, some counterclockwise
          size: skill.size,
          image: skill.image,
          color: skill.color,
          collisionEffect: 0,
        };
      });

      setCircles(initialCircles);
    };

    // Initialize after a short delay to ensure proper container dimensions
    setTimeout(initializeCircles, 100);
  }, []);

  // Simple proximity visual effect (no collision physics for planets)
  const checkProximityEffects = (circles) => {
    const updatedCircles = [...circles];
    
    for (let i = 0; i < updatedCircles.length; i++) {
      for (let j = i + 1; j < updatedCircles.length; j++) {
        const circle1 = updatedCircles[i];
        const circle2 = updatedCircles[j];
        
        const dx = circle2.x - circle1.x;
        const dy = circle2.y - circle1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const proximityThreshold = (circle1.size + circle2.size) * 1.5;
        
        // Subtle visual effect when planets are close (no physics)
        if (distance < proximityThreshold) {
          const intensity = Math.max(0, 5 - (distance / proximityThreshold) * 5);
          circle1.collisionEffect = Math.max(circle1.collisionEffect, intensity);
          circle2.collisionEffect = Math.max(circle2.collisionEffect, intensity);
        }
      }
    }
    
    return updatedCircles;
  };

  // Animation loop for orbital physics
  useEffect(() => {
    const animate = () => {
      setCircles(prevCircles => {
        if (prevCircles.length === 0) return prevCircles;

        let updatedCircles = prevCircles.map(circle => {
          // Update orbital angle based on speed and direction
          const angleIncrement = circle.clockwise ? circle.orbitSpeed : -circle.orbitSpeed;
          const newAngle = circle.angle + angleIncrement;
          
          // Calculate new position based on orbital physics
          const newX = circle.centerX + Math.cos(newAngle) * circle.orbitRadius;
          const newY = circle.centerY + Math.sin(newAngle) * circle.orbitRadius;
          
          return {
            ...circle,
            x: newX,
            y: newY,
            angle: newAngle,
            collisionEffect: Math.max(0, circle.collisionEffect - 0.5), // Slow fade
          };
        });

        // Check for proximity effects (subtle visual feedback)
        updatedCircles = checkProximityEffects(updatedCircles);
        
        return updatedCircles;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="planetary-skills-container">
      {circles.map((circle) => (
        <motion.div
          key={circle.id}
          className="planetary-circle"
          style={{
            left: circle.x - circle.size / 2,
            top: circle.y - circle.size / 2,
            width: circle.size,
            height: circle.size,
            transform: circle.collisionEffect > 0 ? `scale(${1 + circle.collisionEffect * 0.02})` : 'scale(1)',
            boxShadow: circle.collisionEffect > 0 
              ? `0 0 ${circle.collisionEffect * 2}px ${circle.color}, 0 0 ${circle.collisionEffect * 4}px ${circle.color}40`
              : '0px 0px 20px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.1s ease, box-shadow 0.1s ease',
          }}
          whileInView={{ scale: [0, 1], opacity: [0, 1] }}
          transition={{ duration: 0.5, delay: circle.id * 0.1 }}
        >
          <img src={circle.image} alt={`skill-${circle.id}`} />
        </motion.div>
      ))}
    </div>
  );
};

const Header = () => (
  <div className="app__header app__flex">
    <motion.div
      whileInView={{ x: [-100, 0], opacity: [0, 1] }}
      transition={{ duration: 0.5 }}
      className="app__header-info"
    >
      <HeaderTicket />
    </motion.div>

    <motion.div
      whileInView={{ opacity: [0, 1] }}
      transition={{ duration: 0.5, delayChildren: 0.5 }}
      className="app__header-img"
    >
      <img src={images.profile} alt="profile_bg" />
      <motion.img
        whileInView={{ scale: [0, 1] }}
        transition={{ duration: 1, ease: "easeInOut" }}
        src={images.circle}
        alt="profile_circle"
        className="overlay_circle"
      />
    </motion.div>

    <div className="app__header-circles">
      <PlanetarySkillCircles />
    </div>
  </div>
);

export default AppWrap(Header, "home");
