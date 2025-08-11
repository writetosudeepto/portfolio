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
const PlanetarySkillCircles = ({ selectedPlanet, setSelectedPlanet }) => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const meteorsRef = useRef([]);
  const [collisionEffects, setCollisionEffects] = useState([]);
  const [hoveredPlanet, setHoveredPlanet] = useState(null);
  
  // Define skills as planets with orbital distances and size scaling
  const skillsData = [
    { 
      image: images.react, 
      baseSize: 90, 
      orbitalDistance: 0.8, // Closest to center (Mercury-like)
      color: '#61dafb', 
      mass: 1.05,
      name: 'React',
      description: 'JavaScript library for building interactive user interfaces',
      experience: '4+ years',
      proficiency: 93,
      projects: ['Web Applications', 'Component Libraries', 'SPA Development']
    },
    { 
      image: images.python, 
      baseSize: 95, 
      orbitalDistance: 1.2, // Second orbit (Venus-like)
      color: '#3776ab', 
      mass: 1.2,
      name: 'Python',
      description: 'Versatile programming language for data science, web development, and automation',
      experience: '5+ years',
      proficiency: 95,
      projects: ['Machine Learning Models', 'Data Analysis Tools', 'Web APIs']
    },
    { 
      image: images.sql, 
      baseSize: 85, 
      orbitalDistance: 1.6, // Third orbit (Earth-like)
      color: '#336791', 
      mass: 1.1,
      name: 'SQL',
      description: 'Database query language for data retrieval and manipulation',
      experience: '5+ years',
      proficiency: 92,
      projects: ['Database Design', 'Data Warehousing', 'Query Optimization']
    },
    { 
      image: images.flutter, 
      baseSize: 80, 
      orbitalDistance: 2.0, // Fourth orbit (Mars-like)
      color: '#02569b', 
      mass: 1.3,
      name: 'Flutter',
      description: 'Cross-platform mobile app development framework by Google',
      experience: '3+ years',
      proficiency: 88,
      projects: ['Mobile Apps', 'Cross-Platform Development', 'UI/UX Design']
    },
    { 
      image: images.numpy, 
      baseSize: 75, 
      orbitalDistance: 2.4, // Fifth orbit (Jupiter-like)
      color: '#013243', 
      mass: 1.5,
      name: 'NumPy',
      description: 'Fundamental package for scientific computing with Python',
      experience: '4+ years',
      proficiency: 90,
      projects: ['Data Processing', 'Mathematical Computations', 'Array Operations']
    },
    { 
      image: images.tableau, 
      baseSize: 70, 
      orbitalDistance: 2.8, // Sixth orbit (Saturn-like)
      color: '#e97627', 
      mass: 1.0,
      name: 'Tableau',
      description: 'Powerful data visualization and business intelligence platform',
      experience: '3+ years',
      proficiency: 85,
      projects: ['Business Dashboards', 'Data Analytics', 'Interactive Reports']
    },
    { 
      image: images.bigQuery, 
      baseSize: 65, 
      orbitalDistance: 3.2, // Seventh orbit (Uranus-like)
      color: '#4285f4', 
      mass: 0.9,
      name: 'BigQuery',
      description: 'Google Cloud\'s serverless data warehouse for analytics',
      experience: '2+ years',
      proficiency: 80,
      projects: ['Big Data Analytics', 'Cloud Data Processing', 'ML Pipelines']
    },
  ];

  // Calculate planet size based on distance (perspective scaling)
  const calculatePlanetSize = (baseSize, orbitalDistance, isDesktop = true) => {
    if (!isDesktop) {
      // Mobile scaling - simpler approach
      if (window.innerWidth <= 450) {
        return Math.round(baseSize * 0.3);
      } else if (window.innerWidth <= 768) {
        return Math.round(baseSize * 0.4);
      }
      return Math.round(baseSize * 0.6);
    }
    
    // Desktop - realistic distance-based scaling
    // Closer planets appear larger, distant ones smaller
    const perspectiveScale = Math.max(0.6, 1.1 - (orbitalDistance - 0.8) * 0.15);
    return Math.round(baseSize * perspectiveScale);
  };

  const [circles, setCircles] = useState([]);

  // Calculate orbital velocity and physics data
  const calculatePlanetPhysics = (circle) => {
    const velocity = circle.orbitalPeriod ? (2 * Math.PI * circle.semiMajorAxis) / (1 / circle.orbitalPeriod) : 0;
    const aphelion = circle.semiMajorAxis * (1 + circle.eccentricity);
    const perihelion = circle.semiMajorAxis * (1 - circle.eccentricity);
    const currentDistance = Math.sqrt((circle.x - circle.centerX) ** 2 + (circle.y - circle.centerY) ** 2);
    
    return {
      velocity: Math.round(velocity * 100) / 100,
      aphelion: Math.round(aphelion),
      perihelion: Math.round(perihelion),
      currentDistance: Math.round(currentDistance),
      eccentricity: Math.round(circle.eccentricity * 100) / 100,
      mass: circle.mass,
      semiMajorAxis: Math.round(circle.semiMajorAxis),
      orbitalPeriod: Math.round((1 / circle.orbitalPeriod) * 100) / 100,
    };
  };

  // Handle planet click
  const handlePlanetClick = (circle, skillData) => {
    const physics = calculatePlanetPhysics(circle);
    setSelectedPlanet({
      ...skillData,
      physics,
      circle
    });
  };

  // Handle planet hover
  const handlePlanetHover = (circle, skillData) => {
    setHoveredPlanet(circle.id);
  };

  // Handle planet hover leave
  const handlePlanetHoverLeave = () => {
    setHoveredPlanet(null);
  };

  // Collision detection between meteors and planets
  const detectCollisions = (circles, meteors) => {
    const newCollisionEffects = [];
    
    circles.forEach((circle, circleIndex) => {
      meteors.forEach((meteor, meteorIndex) => {
        if (meteor && typeof meteor.x === 'number' && typeof meteor.y === 'number') {
          const dx = meteor.x - circle.x;
          const dy = meteor.y - circle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const collisionThreshold = (circle.size / 2) + (meteor.size || 20) / 2;
          
          if (distance < collisionThreshold) {
            // Create collision effect
            newCollisionEffects.push({
              id: `collision-${Date.now()}-${circleIndex}-${meteorIndex}`,
              x: circle.x,
              y: circle.y,
              time: 0,
              planetColor: circle.color,
              meteorColor: meteor.color || '#ff6b35',
              intensity: Math.min(meteor.size || 20, circle.size) / 10,
            });
            
            // Update planet collision effect
            circle.collisionEffect = Math.max(circle.collisionEffect || 0, 15);
            circle.collisionTime = Date.now();
            
            // Mark meteor for removal or reduce its life
            if (meteor.life !== undefined) {
              meteor.life = Math.max(0, meteor.life - 0.5);
            }
          }
        }
      });
    });
    
    return newCollisionEffects;
  };

  // Create animated collision particles
  const createCollisionParticles = (collision) => {
    const particles = [];
    const particleCount = Math.floor(collision.intensity * 8);
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        id: `particle-${collision.id}-${i}`,
        x: collision.x + (Math.random() - 0.5) * 40,
        y: collision.y + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1.0,
        size: Math.random() * 6 + 2,
        color: Math.random() > 0.5 ? collision.planetColor : collision.meteorColor,
      });
    }
    
    return particles;
  };

  // Get meteors from the global meteor effect (if available)
  const getMeteors = () => {
    // Try to access meteors from the meteor canvas if it exists
    const meteorCanvas = document.querySelector('.meteor-canvas');
    if (meteorCanvas && window.meteorsData) {
      return window.meteorsData;
    }
    return meteorsRef.current;
  };

  // Initialize circles with Kepler's elliptical orbits
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use a timeout to ensure proper dimensions after component mount
    const initializeCircles = () => {
      // Use full window dimensions
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Get garland positions around screen edges (avoiding center)
      const getGarlandPositions = () => {
        const isDesktop = windowWidth > 1200;
        const isMobile = windowWidth <= 768;
        
        if (isDesktop) {
          // Desktop: Respect boundaries - below navbar, outside tickets, away from center profile
          return [
            { x: windowWidth * 0.85, y: windowHeight * 0.2 },   // Top-right (below navbar, outside ticket area)
            { x: windowWidth * 0.92, y: windowHeight * 0.4 },   // Right-upper (safe from ticket zone)
            { x: windowWidth * 0.92, y: windowHeight * 0.65 },  // Right-lower  
            { x: windowWidth * 0.82, y: windowHeight * 0.85 },  // Bottom-right (inside screen bounds)
            { x: windowWidth * 0.25, y: windowHeight * 0.85 },  // Bottom-left (inside screen bounds)
            { x: windowWidth * 0.08, y: windowHeight * 0.7 },   // Left-lower (inside screen, away from center)
            { x: windowWidth * 0.08, y: windowHeight * 0.35 },  // Left-upper (below navbar, away from center)
          ];
        } else if (isMobile) {
          // Mobile: Spread around entire screen perimeter
          return [
            { x: windowWidth * 0.2, y: windowHeight * 0.15 },  // Top-left
            { x: windowWidth * 0.8, y: windowHeight * 0.15 },  // Top-right
            { x: windowWidth * 0.9, y: windowHeight * 0.4 },   // Right-upper
            { x: windowWidth * 0.9, y: windowHeight * 0.6 },   // Right-lower
            { x: windowWidth * 0.8, y: windowHeight * 0.85 },  // Bottom-right
            { x: windowWidth * 0.2, y: windowHeight * 0.85 },  // Bottom-left
            { x: windowWidth * 0.1, y: windowHeight * 0.4 },   // Left-upper
          ];
        } else {
          // Tablet view
          return [
            { x: windowWidth * 0.2, y: windowHeight * 0.2 },   // Top-left
            { x: windowWidth * 0.8, y: windowHeight * 0.2 },   // Top-right
            { x: windowWidth * 0.85, y: windowHeight * 0.5 },  // Right-middle
            { x: windowWidth * 0.8, y: windowHeight * 0.8 },   // Bottom-right
            { x: windowWidth * 0.2, y: windowHeight * 0.8 },   // Bottom-left
            { x: windowWidth * 0.15, y: windowHeight * 0.5 },  // Left-middle
            { x: windowWidth * 0.5, y: windowHeight * 0.15 },  // Top-center
          ];
        }
      };
      
      // Calculate 3D garland movement radius around each position
      const calculateGarlandRadius = (isDesktop) => {
        if (isDesktop) {
          return Math.min(windowWidth, windowHeight) * 0.06; // Small orbits around each garland point
        } else {
          return Math.min(windowWidth, windowHeight) * 0.08; // Slightly larger for mobile
        }
      };

      // Get garland positions and create 3D floating motion
      const garlandPositions = getGarlandPositions();
      const isDesktop = windowWidth > 1200;
      const garlandRadius = calculateGarlandRadius(isDesktop);
      
      const initialCircles = skillsData.map((skill, index) => {
        // Calculate planet size with 3D depth effect
        const planetSize = calculatePlanetSize(skill.baseSize, skill.orbitalDistance, isDesktop);
        
        // Assign each planet to a garland position
        const garlandPoint = garlandPositions[index % garlandPositions.length];
        const centerX = garlandPoint.x;
        const centerY = garlandPoint.y;
        
        // Create small circular motion around each garland point
        const localRadius = garlandRadius * (0.5 + Math.random() * 0.5); // Vary radius for 3D effect
        const eccentricity = 0.1 + Math.random() * 0.2; // Slight elliptical motion
        const semiMajorAxis = localRadius;
        const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity);
        
        // Random starting angle for natural distribution
        const meanAnomaly = Math.random() * Math.PI * 2;
        
        // Varied orbital periods for dynamic movement
        const baseOrbitalPeriod = 0.0008 + (Math.random() * 0.0006);
        const orbitalPeriod = baseOrbitalPeriod * (0.8 + Math.random() * 0.4); // Varied speeds
        
        // Calculate initial position
        const eccentricAnomaly = meanAnomaly;
        let x = centerX + semiMajorAxis * (Math.cos(eccentricAnomaly) - eccentricity);
        let y = centerY + semiMinorAxis * Math.sin(eccentricAnomaly);
        
        // Add 3D motion parameters (X, Y, Z axes)
        const bobbingAmplitude = 15 + Math.random() * 20; // Vertical bobbing range
        const bobbingPhase = Math.random() * Math.PI * 2; // Random starting phase
        const bobbingSpeed = 0.01 + Math.random() * 0.015; // Bobbing frequency
        
        // Z-axis (depth) motion parameters
        const zDepthRange = 200 + Math.random() * 300; // How far forward/backward planet moves
        const zPhase = Math.random() * Math.PI * 2; // Random Z starting phase
        const zSpeed = 0.005 + Math.random() * 0.01; // Z-axis movement speed
        const baseZ = 100 + Math.random() * 100; // Base Z position (distance from viewer)
        
        // Ensure planet stays within screen bounds
        const halfSize = planetSize / 2;
        x = Math.max(halfSize + 10, Math.min(windowWidth - halfSize - 10, x));
        y = Math.max(halfSize + 10, Math.min(windowHeight - halfSize - 10, y));
        
        return {
          id: index,
          x: x,
          y: y,
          centerX: centerX,
          centerY: centerY,
          semiMajorAxis: semiMajorAxis,
          semiMinorAxis: semiMinorAxis,
          eccentricity: eccentricity,
          meanAnomaly: meanAnomaly,
          orbitalPeriod: orbitalPeriod,
          orbitalDistance: skill.orbitalDistance, // For size scaling
          clockwise: Math.random() > 0.5,
          size: planetSize,
          image: skill.image,
          color: skill.color,
          mass: skill.mass,
          collisionEffect: 0,
          rotationAngle: Math.random() * Math.PI * 2,
          rotationSpeed: (0.005 + Math.random() * 0.02) * (skill.mass || 1),
          // 3D floating parameters
          bobbingAmplitude: bobbingAmplitude,
          bobbingPhase: bobbingPhase,
          bobbingSpeed: bobbingSpeed,
          baseY: centerY, // Store base Y for bobbing calculation
          // Z-axis (depth) parameters
          zDepthRange: zDepthRange,
          zPhase: zPhase,
          zSpeed: zSpeed,
          baseZ: baseZ,
          currentZ: baseZ, // Current Z position
          baseSize: planetSize, // Store original size for perspective scaling
          // Store window bounds for boundary checking
          windowWidth: windowWidth,
          windowHeight: windowHeight,
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

  // Kepler's motion animation loop
  useEffect(() => {
    const animate = () => {
      setCircles(prevCircles => {
        if (prevCircles.length === 0) return prevCircles;

        let updatedCircles = prevCircles.map(circle => {
          // Update mean anomaly based on orbital period (Kepler's 2nd law: areas swept in equal time)
          const deltaTime = 1;
          const meanMotion = circle.orbitalPeriod;
          const direction = circle.clockwise ? 1 : -1;
          const newMeanAnomaly = circle.meanAnomaly + (meanMotion * direction * deltaTime);
          
          // Solve Kepler's equation: E = M + e*sin(E) using Newton-Raphson iteration
          let eccentricAnomaly = newMeanAnomaly;
          for (let i = 0; i < 3; i++) {
            const f = eccentricAnomaly - circle.eccentricity * Math.sin(eccentricAnomaly) - newMeanAnomaly;
            const df = 1 - circle.eccentricity * Math.cos(eccentricAnomaly);
            eccentricAnomaly = eccentricAnomaly - f / df;
          }
          
          // Calculate true anomaly from eccentric anomaly
          const trueAnomaly = 2 * Math.atan2(
            Math.sqrt(1 + circle.eccentricity) * Math.sin(eccentricAnomaly / 2),
            Math.sqrt(1 - circle.eccentricity) * Math.cos(eccentricAnomaly / 2)
          );
          
          // Calculate distance from focus (variable distance in ellipse)
          const radius = circle.semiMajorAxis * (1 - circle.eccentricity * Math.cos(eccentricAnomaly));
          
          // Calculate position in elliptical orbit (small circular motion around garland point)
          let newX = circle.centerX + radius * Math.cos(trueAnomaly);
          let newY = circle.centerY + circle.semiMinorAxis * Math.sin(eccentricAnomaly);
          
          // Add 3D motion along all three axes
          const currentTime = Date.now() * 0.001; // Convert to seconds
          
          // Y-axis (vertical bobbing)
          const bobbingTime = currentTime * circle.bobbingSpeed + circle.bobbingPhase;
          const bobbingOffset = Math.sin(bobbingTime) * circle.bobbingAmplitude;
          newY += bobbingOffset;
          
          // X-axis (horizontal swaying)
          const swayingOffset = Math.cos(bobbingTime * 0.7) * (circle.bobbingAmplitude * 0.3);
          newX += swayingOffset;
          
          // Z-axis (depth movement) - true 3D motion
          const zTime = currentTime * circle.zSpeed + circle.zPhase;
          const zOffset = Math.sin(zTime) * circle.zDepthRange;
          const currentZ = circle.baseZ + zOffset;
          
          // Apply perspective scaling based on Z position
          // Closer objects (lower Z) appear larger, farther objects (higher Z) appear smaller
          const perspectiveDistance = 800; // Increased virtual camera distance for less dramatic scaling
          const perspectiveScale = Math.max(0.4, Math.min(1.4, perspectiveDistance / (perspectiveDistance + currentZ)));
          const scaledSize = Math.max(30, Math.min(120, circle.baseSize * perspectiveScale));
          
          // Apply perspective to position (parallax effect)
          const currentWindowWidth = circle.windowWidth || window.innerWidth;
          const currentWindowHeight = circle.windowHeight || window.innerHeight;
          const centerX = currentWindowWidth / 2;
          const centerY = currentWindowHeight / 2;
          const parallaxX = (newX - centerX) * perspectiveScale + centerX;
          const parallaxY = (newY - centerY) * perspectiveScale + centerY;
          
          newX = parallaxX;
          newY = parallaxY;
          
          // Apply boundary constraints respecting UI elements
          const halfSize = scaledSize / 2;
          const isMobile = currentWindowWidth <= 768;
          
          // Define safe zones avoiding navbar, tickets, and center profile
          const navbarHeight = isMobile ? currentWindowHeight * 0.12 : currentWindowHeight * 0.15;
          const centerZoneLeft = currentWindowWidth * 0.35;
          const centerZoneRight = currentWindowWidth * 0.65;
          const centerZoneTop = currentWindowHeight * 0.25;
          const centerZoneBottom = currentWindowHeight * 0.75;
          
          // Margin to keep planets visible and away from UI elements
          const margin = isMobile ? 25 : 20;
          
          // Horizontal boundaries (stay in viewport)
          newX = Math.max(halfSize + margin, Math.min(currentWindowWidth - halfSize - margin, newX));
          
          // Vertical boundaries (below navbar, in viewport)  
          newY = Math.max(navbarHeight + halfSize, Math.min(currentWindowHeight - halfSize - margin, newY));
          
          // Avoid center profile image area (push planets away if they get too close)
          if (newX > centerZoneLeft && newX < centerZoneRight && 
              newY > centerZoneTop && newY < centerZoneBottom) {
            // Push to nearest edge outside center zone
            const distToLeft = newX - centerZoneLeft;
            const distToRight = centerZoneRight - newX;
            const distToTop = newY - centerZoneTop;
            const distToBottom = centerZoneBottom - newY;
            
            const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);
            
            if (minDist === distToLeft) {
              newX = centerZoneLeft - halfSize - 10;
            } else if (minDist === distToRight) {
              newX = centerZoneRight + halfSize + 10;
            } else if (minDist === distToTop) {
              newY = centerZoneTop - halfSize - 10;
            } else {
              newY = centerZoneBottom + halfSize + 10;
            }
          }
          
          // Update planetary rotation
          const newRotationAngle = circle.rotationAngle + circle.rotationSpeed;
          
          return {
            ...circle,
            x: newX,
            y: newY,
            size: scaledSize, // Update size based on Z-depth perspective
            currentZ: currentZ, // Store current Z position
            meanAnomaly: newMeanAnomaly,
            eccentricAnomaly: eccentricAnomaly,
            trueAnomaly: trueAnomaly,
            radius: radius,
            rotationAngle: newRotationAngle,
            collisionEffect: Math.max(0, circle.collisionEffect - 0.5),
          };
        });

        // Check for proximity effects (gravitational influence visualization)
        updatedCircles = checkProximityEffects(updatedCircles);
        
        // Check for collisions with meteors
        const meteors = getMeteors();
        const newCollisions = detectCollisions(updatedCircles, meteors);
        
        // Add new collision effects
        if (newCollisions.length > 0) {
          setCollisionEffects(prev => [...prev, ...newCollisions]);
        }
        
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

  // Update collision effects
  useEffect(() => {
    const updateCollisionEffects = () => {
      setCollisionEffects(prev => 
        prev.map(effect => ({
          ...effect,
          time: effect.time + 1
        })).filter(effect => effect.time < 60) // Remove after 60 frames (1 second at 60fps)
      );
    };

    const interval = setInterval(updateCollisionEffects, 16); // ~60fps
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="planetary-skills-container">
      {circles.map((circle) => {
        const skillData = skillsData[circle.id];
        const isHovered = hoveredPlanet === circle.id;
        const isSelected = selectedPlanet && selectedPlanet.circle.id === circle.id;
        const isMobile = window.innerWidth <= 768;
        
        // Calculate depth effect based on distance from center
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const distanceFromCenter = Math.sqrt((circle.x - centerX) ** 2 + (circle.y - centerY) ** 2);
        const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2);
        const depthRatio = distanceFromCenter / maxDistance; // 0 = center, 1 = edge
        
        // Depth effects
        const depthScale = 1 - (depthRatio * 0.2); // Closer planets appear larger
        const depthOpacity = 1 - (depthRatio * 0.3); // Closer planets appear more opaque
        const depthBlur = depthRatio * 1; // Distant planets appear slightly blurred
        
        return (
          <motion.div
            key={circle.id}
            className={`planetary-circle ${isHovered ? 'hovered' : ''} ${isSelected ? 'selected' : ''}`}
            style={{
              left: circle.x - circle.size / 2,
              top: circle.y - circle.size / 2,
              width: circle.size,
              height: circle.size,
              transform: `
                scale(${
                  (isHovered ? 1.3 : 
                  isSelected ? 1.2 : 
                  circle.collisionEffect > 0 ? 1 + circle.collisionEffect * 0.02 : 1) * depthScale
                })
                rotate(${circle.rotationAngle || 0}rad)
              `,
              opacity: depthOpacity,
              filter: `blur(${depthBlur}px)`,
              boxShadow: isHovered || isSelected
                ? `0 0 ${30 * depthScale}px ${circle.color}, 0 0 ${60 * depthScale}px ${circle.color}60, 0 0 ${20 * depthScale}px ${circle.color}40`
                : circle.collisionEffect > 0 
                  ? `0 0 ${circle.collisionEffect * 3 * depthScale}px ${circle.color}, 0 0 ${circle.collisionEffect * 6 * depthScale}px ${circle.color}60, 0 0 ${circle.collisionEffect * 2 * depthScale}px ${circle.color}20`
                  : `0 0 ${(8 + (circle.mass || 1) * 4) * depthScale}px rgba(0, 0, 0, 0.15), 0 0 ${(4 + (circle.mass || 1) * 2) * depthScale}px ${circle.color}30`,
              transition: 'all 0.3s ease',
              background: `radial-gradient(circle at 30% 30%, ${circle.color}${isHovered ? '40' : '20'}, ${circle.color}${isHovered ? '20' : '10'}, var(--white-color))`,
              border: `2px solid ${circle.color}${isHovered ? '80' : '40'}`,
              cursor: 'pointer',
              zIndex: isMobile 
                ? (isHovered || isSelected ? 25 : 20) // Force high z-index on mobile
                : (isHovered || isSelected ? 20 : Math.round((1 - depthRatio) * 10) + 5), // Desktop depth-based z-index
              // Ensure mobile clickability
              touchAction: 'manipulation',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none',
              pointerEvents: 'auto', // Force pointer events
            }}
            whileInView={{ scale: [0, 1], opacity: [0, 1] }}
            transition={{ duration: 0.8, delay: circle.id * 0.15 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handlePlanetClick(circle, skillData);
            }}
            onMouseEnter={() => handlePlanetHover(circle, skillData)}
            onMouseLeave={handlePlanetHoverLeave}
            onTouchStart={(e) => {
              e.preventDefault();
              handlePlanetHover(circle, skillData);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handlePlanetClick(circle, skillData);
            }}
            // Additional mobile support
            onPointerDown={(e) => {
              if (isMobile) {
                e.preventDefault();
                e.stopPropagation();
                handlePlanetClick(circle, skillData);
              }
            }}
            whileHover={{ scale: isMobile ? 1.2 : 1.3 }}
            whileTap={{ scale: isMobile ? 1.1 : 1.2 }}
          >
            <img 
              src={circle.image} 
              alt={skillData?.name || `skill-${circle.id}`}
              style={{
                transform: `rotate(${-(circle.rotationAngle || 0)}rad)`,
                transition: 'transform 0.08s ease',
                filter: isHovered ? 'brightness(1.2)' : 'none',
              }}
            />
            
            {/* Hover tooltip */}
            {isHovered && (
              <motion.div
                className="planet-tooltip"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  position: 'absolute',
                  top: circle.size + 10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: `linear-gradient(135deg, ${circle.color}20, rgba(0,0,0,0.9))`,
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${circle.color}40`,
                  zIndex: 20,
                }}
              >
                {skillData?.name}
              </motion.div>
            )}
          </motion.div>
        );
      })}
      
      {/* Collision Effects */}
      {collisionEffects.map((collision) => {
        const progress = collision.time / 60;
        const opacity = Math.max(0, 1 - progress);
        const scale = 1 + progress * 2;
        
        return (
          <motion.div
            key={collision.id}
            className="collision-effect"
            style={{
              position: 'absolute',
              left: collision.x - 50,
              top: collision.y - 50,
              width: 100,
              height: 100,
              pointerEvents: 'none',
              zIndex: 20,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ 
              scale: [0, 1.5, 2], 
              opacity: [1, 0.7, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 1,
              ease: "easeOut"
            }}
          >
            {/* Shockwave ring */}
            <div
              className="collision-shockwave"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100px',
                height: '100px',
                border: `3px solid ${collision.planetColor}`,
                borderRadius: '50%',
                opacity: opacity,
                transform: `translate(-50%, -50%) scale(${scale})`,
                boxShadow: `0 0 20px ${collision.planetColor}, inset 0 0 20px ${collision.meteorColor}`,
              }}
            />
            
            {/* Energy particles */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const distance = 30 + progress * 40;
              const x = Math.cos(angle) * distance;
              const y = Math.sin(angle) * distance;
              
              return (
                <div
                  key={`particle-${i}`}
                  className="collision-particle"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '6px',
                    height: '6px',
                    backgroundColor: i % 2 === 0 ? collision.planetColor : collision.meteorColor,
                    borderRadius: '50%',
                    transform: `translate(${x - 3}px, ${y - 3}px)`,
                    opacity: opacity,
                    boxShadow: `0 0 10px ${i % 2 === 0 ? collision.planetColor : collision.meteorColor}`,
                  }}
                />
              );
            })}
            
            {/* Central flash */}
            <div
              className="collision-flash"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '20px',
                height: '20px',
                background: `radial-gradient(circle, ${collision.planetColor}, ${collision.meteorColor})`,
                borderRadius: '50%',
                opacity: opacity * 2,
                boxShadow: `0 0 30px ${collision.planetColor}, 0 0 50px ${collision.meteorColor}`,
              }}
            />
          </motion.div>
        );
      })}

    </div>
  );
};

const Header = () => {
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  return (
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
        <PlanetarySkillCircles 
          selectedPlanet={selectedPlanet} 
          setSelectedPlanet={setSelectedPlanet} 
        />
      </div>

      {/* Planet Information Modal - Rendered outside planetary container */}
      {selectedPlanet && (
        <motion.div
          className="planet-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedPlanet(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(5px)',
            pointerEvents: 'auto',
          }}
        >
          <motion.div
            className="planet-modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: `linear-gradient(135deg, ${selectedPlanet.color}10, rgba(20, 20, 30, 0.95))`,
              border: `2px solid ${selectedPlanet.color}60`,
              borderRadius: '20px',
              padding: '30px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
              color: 'white',
              backdropFilter: 'blur(20px)',
              boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${selectedPlanet.color}30`,
              zIndex: 10001,
              position: 'relative',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <img 
                src={selectedPlanet.image} 
                alt={selectedPlanet.name}
                style={{ 
                  width: '60px', 
                  height: '60px', 
                  marginRight: '15px',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                }}
              />
              <div>
                <h2 style={{ 
                  margin: 0, 
                  fontSize: '28px', 
                  color: selectedPlanet.color,
                  textShadow: `0 0 10px ${selectedPlanet.color}50`
                }}>
                  {selectedPlanet.name}
                </h2>
                <p style={{ 
                  margin: '5px 0 0 0', 
                  opacity: 0.8,
                  fontSize: '14px'
                }}>
                  {selectedPlanet.description}
                </p>
              </div>
              <button
                onClick={() => setSelectedPlanet(null)}
                style={{
                  marginLeft: 'auto',
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '10px',
                  opacity: 0.8,
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.opacity = '1';
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = '0.8';
                  e.target.style.background = 'none';
                }}
              >
                ✕
              </button>
            </div>

            {/* Skill Information */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
              <div>
                <h3 style={{ color: selectedPlanet.color, marginBottom: '10px' }}>Experience</h3>
                <p>{selectedPlanet.experience}</p>
              </div>
              <div>
                <h3 style={{ color: selectedPlanet.color, marginBottom: '10px' }}>Proficiency</h3>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '100px',
                    height: '8px',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginRight: '10px'
                  }}>
                    <div style={{
                      width: `${selectedPlanet.proficiency}%`,
                      height: '100%',
                      background: selectedPlanet.color,
                      borderRadius: '4px',
                    }}></div>
                  </div>
                  <span>{selectedPlanet.proficiency}%</span>
                </div>
              </div>
            </div>

            {/* Projects */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ color: selectedPlanet.color, marginBottom: '10px' }}>Key Projects</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedPlanet.projects.map((project, index) => (
                  <span
                    key={index}
                    style={{
                      background: `${selectedPlanet.color}20`,
                      color: selectedPlanet.color,
                      padding: '6px 12px',
                      borderRadius: '15px',
                      fontSize: '12px',
                      border: `1px solid ${selectedPlanet.color}40`,
                    }}
                  >
                    {project}
                  </span>
                ))}
              </div>
            </div>

            {/* Orbital Physics */}
            <div>
              <h3 style={{ color: selectedPlanet.color, marginBottom: '15px' }}>Orbital Physics</h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                gap: '15px',
                fontSize: '13px'
              }}>
                <div>
                  <span style={{ opacity: 0.7 }}>Velocity</span>
                  <div style={{ color: selectedPlanet.color, fontWeight: 'bold' }}>
                    {selectedPlanet.physics.velocity}px/s
                  </div>
                </div>
                <div>
                  <span style={{ opacity: 0.7 }}>Distance</span>
                  <div style={{ color: selectedPlanet.color, fontWeight: 'bold' }}>
                    {selectedPlanet.physics.currentDistance}px
                  </div>
                </div>
                <div>
                  <span style={{ opacity: 0.7 }}>Eccentricity</span>
                  <div style={{ color: selectedPlanet.color, fontWeight: 'bold' }}>
                    {selectedPlanet.physics.eccentricity}
                  </div>
                </div>
                <div>
                  <span style={{ opacity: 0.7 }}>Mass</span>
                  <div style={{ color: selectedPlanet.color, fontWeight: 'bold' }}>
                    {selectedPlanet.physics.mass}
                  </div>
                </div>
                <div>
                  <span style={{ opacity: 0.7 }}>Aphelion</span>
                  <div style={{ color: selectedPlanet.color, fontWeight: 'bold' }}>
                    {selectedPlanet.physics.aphelion}px
                  </div>
                </div>
                <div>
                  <span style={{ opacity: 0.7 }}>Perihelion</span>
                  <div style={{ color: selectedPlanet.color, fontWeight: 'bold' }}>
                    {selectedPlanet.physics.perihelion}px
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AppWrap(Header, "home");
