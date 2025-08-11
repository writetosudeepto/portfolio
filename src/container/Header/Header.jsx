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
  
  // Define skills with their properties - appropriately sized for visibility
  const getMobileSize = (size) => {
    if (window.innerWidth <= 450) {
      return Math.round(size * 0.36); // 40% smaller than previous 0.6
    } else if (window.innerWidth <= 768) {
      return Math.round(size * 0.42); // 40% smaller than previous 0.7
    } else if (window.innerWidth <= 1200) {
      return Math.round(size * 0.8); // Keep tablets the same
    }
    return size; // Full size on desktop
  };

  const skillsData = [
    { 
      image: images.python, 
      size: getMobileSize(120), 
      color: '#3776ab', 
      mass: 1.2,
      name: 'Python',
      description: 'Versatile programming language for data science, web development, and automation',
      experience: '5+ years',
      proficiency: 95,
      projects: ['Machine Learning Models', 'Data Analysis Tools', 'Web APIs']
    },
    { 
      image: images.numpy, 
      size: getMobileSize(130), 
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
      size: getMobileSize(115), 
      color: '#e97627', 
      mass: 1.0,
      name: 'Tableau',
      description: 'Powerful data visualization and business intelligence platform',
      experience: '3+ years',
      proficiency: 85,
      projects: ['Business Dashboards', 'Data Analytics', 'Interactive Reports']
    },
    { 
      image: images.sql, 
      size: getMobileSize(125), 
      color: '#336791', 
      mass: 1.1,
      name: 'SQL',
      description: 'Database query language for data retrieval and manipulation',
      experience: '5+ years',
      proficiency: 92,
      projects: ['Database Design', 'Data Warehousing', 'Query Optimization']
    },
    { 
      image: images.bigQuery, 
      size: getMobileSize(110), 
      color: '#4285f4', 
      mass: 0.9,
      name: 'BigQuery',
      description: 'Google Cloud\'s serverless data warehouse for analytics',
      experience: '2+ years',
      proficiency: 80,
      projects: ['Big Data Analytics', 'Cloud Data Processing', 'ML Pipelines']
    },
    { 
      image: images.flutter, 
      size: getMobileSize(135), 
      color: '#02569b', 
      mass: 1.3,
      name: 'Flutter',
      description: 'Cross-platform mobile app development framework by Google',
      experience: '3+ years',
      proficiency: 88,
      projects: ['Mobile Apps', 'Cross-Platform Development', 'UI/UX Design']
    },
    { 
      image: images.react, 
      size: getMobileSize(118), 
      color: '#61dafb', 
      mass: 1.05,
      name: 'React',
      description: 'JavaScript library for building interactive user interfaces',
      experience: '4+ years',
      proficiency: 93,
      projects: ['Web Applications', 'Component Libraries', 'SPA Development']
    },
  ];

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
      
      // Helper function to find free space and avoid overlapping orbits
      const findOptimalOrbitCenter = (index, planetSize, usedPositions) => {
        const margin = planetSize + 50; // Safety margin around planets
        const isDesktop = windowWidth > 1200;
        const isMobile = windowWidth <= 768;
        
        // Define potential orbital centers with safe boundaries
        let candidates;
        
        if (isDesktop) {
          candidates = [
            { x: windowWidth * 0.2, y: windowHeight * 0.3 },   // Top left
            { x: windowWidth * 0.8, y: windowHeight * 0.3 },   // Top right  
            { x: windowWidth * 0.2, y: windowHeight * 0.7 },   // Bottom left
            { x: windowWidth * 0.8, y: windowHeight * 0.7 },   // Bottom right
            { x: windowWidth * 0.15, y: windowHeight * 0.5 },  // Middle left
            { x: windowWidth * 0.85, y: windowHeight * 0.5 },  // Middle right
            { x: windowWidth * 0.5, y: windowHeight * 0.2 },   // Top center
          ];
        } else if (isMobile) {
          // Mobile: Multiple safe centers with much more conservative positioning
          candidates = [
            { x: windowWidth * 0.3, y: windowHeight * 0.35 },  // Top left safe zone
            { x: windowWidth * 0.7, y: windowHeight * 0.35 },  // Top right safe zone
            { x: windowWidth * 0.25, y: windowHeight * 0.55 }, // Middle left safe zone
            { x: windowWidth * 0.75, y: windowHeight * 0.55 }, // Middle right safe zone
            { x: windowWidth * 0.5, y: windowHeight * 0.25 },  // Top center safe zone
            { x: windowWidth * 0.5, y: windowHeight * 0.65 },  // Bottom center safe zone
            { x: windowWidth * 0.4, y: windowHeight * 0.45 },  // Center left
          ];
        } else {
          // Tablet view
          candidates = [
            { x: windowWidth * 0.25, y: windowHeight * 0.35 },
            { x: windowWidth * 0.75, y: windowHeight * 0.35 },
            { x: windowWidth * 0.25, y: windowHeight * 0.65 },
            { x: windowWidth * 0.75, y: windowHeight * 0.65 },
            { x: windowWidth * 0.5, y: windowHeight * 0.3 },
            { x: windowWidth * 0.5, y: windowHeight * 0.7 },
          ];
        }
        
        // Find the position with maximum distance from used positions
        let bestPosition = candidates[0];
        let maxMinDistance = 0;
        
        for (const candidate of candidates) {
          let minDistance = Infinity;
          for (const used of usedPositions) {
            const dist = Math.sqrt((candidate.x - used.x) ** 2 + (candidate.y - used.y) ** 2);
            minDistance = Math.min(minDistance, dist);
          }
          
          if (minDistance > maxMinDistance) {
            maxMinDistance = minDistance;
            bestPosition = candidate;
          }
        }
        
        return bestPosition;
      };
      
      // Helper function to calculate safe orbital radius
      const calculateSafeRadius = (centerX, centerY, planetSize, windowWidth, windowHeight) => {
        // Calculate maximum safe radius to keep planet within screen bounds
        const isMobile = windowWidth <= 768;
        const marginFromEdge = planetSize + (isMobile ? 40 : 25); // Appropriate margin for larger planets
        const maxRadiusX = Math.min(centerX - marginFromEdge, windowWidth - centerX - marginFromEdge);
        const maxRadiusY = Math.min(centerY - marginFromEdge, windowHeight - centerY - marginFromEdge);
        const maxSafeRadius = Math.min(maxRadiusX, maxRadiusY);
        
        // Mobile-specific radius calculations
        if (isMobile) {
          // Conservative radii for mobile to keep smaller planets on screen
          const minRadius = Math.min(windowWidth, windowHeight) * 0.06; // Reduced for smaller planets
          const baseRadius = Math.max(minRadius, maxSafeRadius * 0.3); // More conservative
          const maxRadius = Math.max(minRadius * 1.3, maxSafeRadius * 0.55); // Tighter bounds
          return { baseRadius, maxRadius, maxSafeRadius };
        } else {
          // Desktop calculations with slightly adjusted ratios
          const minRadius = Math.min(windowWidth, windowHeight) * 0.1;
          const baseRadius = Math.max(minRadius, maxSafeRadius * 0.4);
          const maxRadius = Math.max(minRadius * 1.6, maxSafeRadius * 0.75);
          return { baseRadius, maxRadius, maxSafeRadius };
        }
      };

      const usedPositions = [];
      const initialCircles = skillsData.map((skill, index) => {
        const isDesktop = windowWidth > 1200;
        
        // Find optimal position for this planet
        const optimalCenter = findOptimalOrbitCenter(index, skill.size, usedPositions);
        const centerX = optimalCenter.x;
        const centerY = optimalCenter.y;
        usedPositions.push(optimalCenter);
        
        // Calculate safe orbital parameters
        const { baseRadius, maxRadius } = calculateSafeRadius(centerX, centerY, skill.size, windowWidth, windowHeight);
        const radiusVariation = baseRadius + (maxRadius - baseRadius) * (index / (skillsData.length - 1));
        const semiMajorAxis = radiusVariation + Math.random() * (maxRadius - baseRadius) * 0.2; // Reduced randomness
        
        // Mobile-specific eccentricity constraints
        const isMobile = windowWidth <= 768;
        const eccentricity = isMobile 
          ? 0.1 + (Math.random() * 0.2)  // Moderate eccentricity for mobile
          : 0.15 + (Math.random() * 0.25); // Good eccentricity for desktop
        const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity);
        
        // Random starting angles for distribution
        const meanAnomaly = Math.random() * Math.PI * 2;
        
        // Varied orbital periods
        const basePeriod = 0.0004 + (Math.random() * 0.0004);
        const orbitalPeriod = basePeriod * Math.pow(semiMajorAxis / baseRadius, -1.2);
        
        // Calculate initial position with boundary check
        const eccentricAnomaly = meanAnomaly;
        let x = centerX + semiMajorAxis * (Math.cos(eccentricAnomaly) - eccentricity);
        let y = centerY + semiMinorAxis * Math.sin(eccentricAnomaly);
        
        // Ensure initial position is within screen bounds
        const halfSize = skill.size / 2;
        x = Math.max(halfSize, Math.min(windowWidth - halfSize, x));
        y = Math.max(halfSize, Math.min(windowHeight - halfSize, y));
        
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
          clockwise: Math.random() > 0.5,
          size: skill.size,
          image: skill.image,
          color: skill.color,
          mass: skill.mass,
          collisionEffect: 0,
          rotationAngle: Math.random() * Math.PI * 2,
          rotationSpeed: (0.01 + Math.random() * 0.04) * (skill.mass || 1),
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
          
          // Calculate position in elliptical orbit
          let newX = circle.centerX + radius * Math.cos(trueAnomaly);
          let newY = circle.centerY + circle.semiMinorAxis * Math.sin(eccentricAnomaly);
          
          // Apply boundary constraints to keep planets on screen
          const halfSize = circle.size / 2;
          const windowWidth = circle.windowWidth || window.innerWidth;
          const windowHeight = circle.windowHeight || window.innerHeight;
          const isMobile = windowWidth <= 768;
          
          // Increase margin for mobile devices to ensure smaller planets stay visible
          const margin = isMobile ? 35 : 10; // Even larger margin for mobile
          
          // Clamp position to screen boundaries
          newX = Math.max(halfSize + margin, Math.min(windowWidth - halfSize - margin, newX));
          newY = Math.max(halfSize + margin, Math.min(windowHeight - halfSize - margin, newY));
          
          // Update planetary rotation
          const newRotationAngle = circle.rotationAngle + circle.rotationSpeed;
          
          return {
            ...circle,
            x: newX,
            y: newY,
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
                  isHovered ? 1.2 : 
                  isSelected ? 1.15 : 
                  circle.collisionEffect > 0 ? 1 + circle.collisionEffect * 0.02 : 1
                })
                rotate(${circle.rotationAngle || 0}rad)
              `,
              boxShadow: isHovered || isSelected
                ? `0 0 30px ${circle.color}, 0 0 60px ${circle.color}60, 0 0 20px ${circle.color}40`
                : circle.collisionEffect > 0 
                  ? `0 0 ${circle.collisionEffect * 3}px ${circle.color}, 0 0 ${circle.collisionEffect * 6}px ${circle.color}60, 0 0 ${circle.collisionEffect * 2}px ${circle.color}20`
                  : `0 0 ${8 + (circle.mass || 1) * 4}px rgba(0, 0, 0, 0.15), 0 0 ${4 + (circle.mass || 1) * 2}px ${circle.color}30`,
              transition: 'all 0.3s ease',
              background: `radial-gradient(circle at 30% 30%, ${circle.color}${isHovered ? '40' : '20'}, ${circle.color}${isHovered ? '20' : '10'}, var(--white-color))`,
              border: `2px solid ${circle.color}${isHovered ? '80' : '40'}`,
              cursor: 'pointer',
              zIndex: isHovered || isSelected ? 15 : 'auto',
            }}
            whileInView={{ scale: [0, 1], opacity: [0, 1] }}
            transition={{ duration: 0.8, delay: circle.id * 0.15 }}
            onClick={() => handlePlanetClick(circle, skillData)}
            onMouseEnter={() => handlePlanetHover(circle, skillData)}
            onMouseLeave={handlePlanetHoverLeave}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 1.1 }}
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
