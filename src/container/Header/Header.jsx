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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [supernovas, setSupernovas] = useState([]);
  const [flyingGuitars, setFlyingGuitars] = useState([]);

  // Theme detection
  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement?.getAttribute('data-theme');
      setIsDarkMode(theme === 'dark');
    };

    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);
  
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


  // Create supernova explosion
  const createSupernova = (windowWidth, windowHeight) => {
    // Position supernovas away from center and main content areas
    const safePositions = [
      { x: windowWidth * 0.1, y: windowHeight * 0.2 },   // Top-left corner
      { x: windowWidth * 0.9, y: windowHeight * 0.15 },  // Top-right corner
      { x: windowWidth * 0.05, y: windowHeight * 0.8 },  // Bottom-left corner
      { x: windowWidth * 0.85, y: windowHeight * 0.75 }, // Bottom-right area
    ];
    
    const position = safePositions[Math.floor(Math.random() * safePositions.length)];
    
    return {
      id: `supernova-${Date.now()}-${Math.random()}`,
      x: position.x,
      y: position.y,
      size: 0, // Starts small
      maxSize: 150 + Math.random() * 100, // 150-250px max
      expansionSpeed: 2 + Math.random() * 3, // Expansion rate
      intensity: 0.8 + Math.random() * 0.2, // 0.8-1.0 brightness
      color: Math.random() > 0.5 ? 
        `hsl(${30 + Math.random() * 30}, 100%, 70%)` : // Orange-yellow
        `hsl(${180 + Math.random() * 60}, 80%, 60%)`,   // Blue-cyan
      phase: 0, // 0: expansion, 1: fade
      life: 1.0,
      particles: [], // Explosion particles
      shockwaveRadius: 0,
    };
  };

  // Create beautiful realistic electric guitar
  const createFlyingGuitar = (windowWidth, windowHeight) => {
    // Guitar spawn positions - from far edges of screen
    const spawnPositions = [
      { x: -150, y: windowHeight * 0.3, direction: 1 },   // From left edge
      { x: windowWidth + 150, y: windowHeight * 0.4, direction: -1 }, // From right edge
      { x: windowWidth * 0.2, y: -150, direction: 1 },    // From top left
      { x: windowWidth * 0.8, y: windowHeight + 150, direction: -1 }, // From bottom right
    ];
    
    const spawn = spawnPositions[Math.floor(Math.random() * spawnPositions.length)];
    const guitarTypes = ['les-paul', 'stratocaster', 'telecaster', 'flying-v'];
    const guitarType = guitarTypes[Math.floor(Math.random() * guitarTypes.length)];
    
    // Realistic guitar color schemes
    const colorSchemes = [
      { body: '#8B4513', neck: '#654321', pickguard: '#000000', name: 'Sunburst' },
      { body: '#000000', neck: '#8B4513', pickguard: '#FFFFFF', name: 'Black' },
      { body: '#FF4500', neck: '#654321', pickguard: '#000000', name: 'Orange' },
      { body: '#4169E1', neck: '#8B4513', pickguard: '#FFFFFF', name: 'Blue' },
      { body: '#DC143C', neck: '#654321', pickguard: '#000000', name: 'Red' },
      { body: '#FFFFFF', neck: '#8B4513', pickguard: '#000000', name: 'White' },
    ];
    
    const colorScheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
    
    return {
      id: `guitar-${Date.now()}-${Math.random()}`,
      type: guitarType,
      x: spawn.x,
      y: spawn.y,
      targetX: windowWidth * (0.2 + Math.random() * 0.6), // Wider target area
      targetY: windowHeight * (0.2 + Math.random() * 0.6),
      size: 120 + Math.random() * 80, // 120-200px guitars (larger for detail)
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.05, // Slower, more graceful spinning
      speed: 0.8 + Math.random() * 1.2, // Slower, more elegant movement
      zPosition: -300 - Math.random() * 400, // Start further back
      zSpeed: 2 + Math.random() * 3, // Slower approach
      direction: spawn.direction,
      // Realistic guitar colors
      bodyColor: colorScheme.body,
      neckColor: colorScheme.neck,
      pickguardColor: colorScheme.pickguard,
      colorName: colorScheme.name,
      // Hardware colors
      hardwareColor: Math.random() > 0.5 ? '#C0C0C0' : '#FFD700', // Chrome or gold
      stringColor: '#C0C0C0',
      // Realistic effects
      glowIntensity: 0.3 + Math.random() * 0.4, // Subtle glow
      life: 1.0,
      // Movement physics
      oscillation: Math.random() * Math.PI * 2, // For natural floating motion
      oscillationSpeed: 0.01 + Math.random() * 0.02,
      // Electric effects
      electricPulse: 0.3 + Math.random() * 0.4,
      sparkles: [],
      trailLength: 3 + Math.random() * 5,
    };
  };

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
      
      // Create spread positions across screen, avoiding center and top-left corner
      const getSpreadPositions = () => {
        const isDesktop = windowWidth > 1200;
        const isMobile = windowWidth <= 768;
        
        // Define safe zones to avoid
        const centerX = windowWidth * 0.5;
        const centerY = windowHeight * 0.5;
        const centerRadius = Math.min(windowWidth, windowHeight) * (isDesktop ? 0.2 : isMobile ? 0.18 : 0.22);
        
        // Top-left corner to keep clean (for navbar/menu)
        const topLeftWidth = windowWidth * (isMobile ? 0.25 : 0.3);
        const topLeftHeight = windowHeight * (isMobile ? 0.2 : 0.25);
        
        // Create strategic positions around the screen
        const positions = [];
        
        if (isDesktop) {
          // Desktop positions - spread around edges, avoiding center and top-left
          positions.push(
            // Top-right area
            { x: windowWidth * 0.85, y: windowHeight * 0.15 },
            { x: windowWidth * 0.9, y: windowHeight * 0.3 },
            
            // Right side
            { x: windowWidth * 0.92, y: windowHeight * 0.6 },
            
            // Bottom area
            { x: windowWidth * 0.75, y: windowHeight * 0.85 },
            { x: windowWidth * 0.25, y: windowHeight * 0.9 },
            
            // Left side (avoiding top-left)
            { x: windowWidth * 0.08, y: windowHeight * 0.7 },
            { x: windowWidth * 0.15, y: windowHeight * 0.45 }
          );
        } else if (isMobile) {
          // Mobile positions - utilize corners and side middle spaces
          positions.push(
            // Top-right corner
            { x: windowWidth * 0.85, y: windowHeight * 0.1 },
            
            // Right side middle
            { x: windowWidth * 0.9, y: windowHeight * 0.35 },
            { x: windowWidth * 0.88, y: windowHeight * 0.65 },
            
            // Bottom-right corner
            { x: windowWidth * 0.8, y: windowHeight * 0.9 },
            
            // Bottom-left corner
            { x: windowWidth * 0.15, y: windowHeight * 0.85 },
            
            // Left side middle
            { x: windowWidth * 0.05, y: windowHeight * 0.6 },
            { x: windowWidth * 0.08, y: windowHeight * 0.4 }
          );
        } else {
          // Tablet positions
          positions.push(
            // Top-right area
            { x: windowWidth * 0.82, y: windowHeight * 0.18 },
            { x: windowWidth * 0.88, y: windowHeight * 0.35 },
            
            // Right side
            { x: windowWidth * 0.9, y: windowHeight * 0.6 },
            
            // Bottom area
            { x: windowWidth * 0.7, y: windowHeight * 0.87 },
            { x: windowWidth * 0.3, y: windowHeight * 0.88 },
            
            // Left side
            { x: windowWidth * 0.1, y: windowHeight * 0.65 },
            { x: windowWidth * 0.18, y: windowHeight * 0.4 }
          );
        }
        
        return positions;
      };
      
      // Calculate orbital movement radius around each ring position
      const calculateOrbitalRadius = (isDesktop) => {
        if (isDesktop) {
          return Math.min(windowWidth, windowHeight) * 0.03; // Small orbits around each ring position
        } else {
          return Math.min(windowWidth, windowHeight) * 0.04; // Slightly larger for mobile
        }
      };

      // Get spread positions and create orbital motion
      const spreadPositions = getSpreadPositions();
      const isDesktop = windowWidth > 1200;
      const orbitalRadius = calculateOrbitalRadius(isDesktop);
      
      const initialCircles = skillsData.map((skill, index) => {
        // Calculate planet size with 3D depth effect
        const planetSize = calculatePlanetSize(skill.baseSize, skill.orbitalDistance, isDesktop);
        
        // Get spread position for this planet
        const spreadPoint = spreadPositions[index % spreadPositions.length];
        const centerX = spreadPoint.x;
        const centerY = spreadPoint.y;
        
        // Create small circular motion around each spread position
        const localRadius = orbitalRadius * (0.8 + Math.random() * 0.4); // Vary radius for 3D effect
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
      
      // Initialize first supernova
      setSupernovas([createSupernova(windowWidth, windowHeight)]);
      
      // Initialize flying guitars
      const initialGuitars = [];
      for (let i = 0; i < 2; i++) {
        initialGuitars.push(createFlyingGuitar(windowWidth, windowHeight));
      }
      setFlyingGuitars(initialGuitars);
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


      // Update supernovas
      setSupernovas(prevSupernovas => {
        const updated = prevSupernovas.map(supernova => {
          if (supernova.phase === 0) {
            // Expansion phase
            const newSize = supernova.size + supernova.expansionSpeed;
            const newShockwave = supernova.shockwaveRadius + supernova.expansionSpeed * 1.5;
            
            if (newSize >= supernova.maxSize) {
              return {
                ...supernova,
                size: supernova.maxSize,
                shockwaveRadius: newShockwave,
                phase: 1, // Switch to fade phase
                life: 1.0,
              };
            }
            
            return {
              ...supernova,
              size: newSize,
              shockwaveRadius: newShockwave,
            };
          } else {
            // Fade phase
            return {
              ...supernova,
              life: Math.max(0, supernova.life - 0.008),
              intensity: supernova.intensity * supernova.life,
            };
          }
        }).filter(supernova => supernova.life > 0);

        // Randomly create new supernovas
        if (Math.random() < 0.0005 && updated.length < 2) { // Very rare, max 2 at once
          const windowWidth = window.innerWidth;
          const windowHeight = window.innerHeight;
          updated.push(createSupernova(windowWidth, windowHeight));
        }

        return updated;
      });

      // Update flying guitars with realistic movement
      setFlyingGuitars(prevGuitars => {
        const updated = prevGuitars.map(guitar => {
          // Graceful curved movement toward target
          const dx = guitar.targetX - guitar.x;
          const dy = guitar.targetY - guitar.y;
          const newX = guitar.x + dx * 0.008 + guitar.direction * guitar.speed;
          
          // Natural floating oscillation
          const oscillationY = Math.sin(Date.now() * 0.001 * guitar.oscillationSpeed + guitar.oscillation) * 15;
          const newY = guitar.y + dy * 0.008 + oscillationY;
          
          // Smooth Z-axis movement toward user
          const newZPosition = guitar.zPosition + guitar.zSpeed;
          
          // Gentle rotation
          const newRotation = guitar.rotation + guitar.rotationSpeed;
          
          // Perspective scaling with smooth transitions
          const perspective = Math.max(0.3, 1 + newZPosition / 250);
          const scaledSize = guitar.size * perspective;
          
          // Update oscillation for next frame
          const newOscillation = guitar.oscillation + guitar.oscillationSpeed;
          
          // Remove guitar if it goes too far forward or off screen
          if (newZPosition > 150 || newX < -250 || newX > window.innerWidth + 250 ||
              newY < -250 || newY > window.innerHeight + 250) {
            return null;
          }
          
          return {
            ...guitar,
            x: newX,
            y: newY,
            zPosition: newZPosition,
            rotation: newRotation,
            scaledSize: scaledSize,
            perspective: perspective,
            oscillation: newOscillation,
            life: Math.max(0, guitar.life - 0.0005), // Slower fade for longer visibility
          };
        }).filter(guitar => guitar !== null && guitar.life > 0);

        // Spawn new guitars less frequently for quality over quantity
        if (Math.random() < 0.001 && updated.length < 3) { // Even rarer spawn, max 3 guitars
          const windowWidth = window.innerWidth;
          const windowHeight = window.innerHeight;
          updated.push(createFlyingGuitar(windowWidth, windowHeight));
        }

        return updated;
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

      {/* Render Supernovas */}
      {supernovas.map((supernova) => (
        <div
          key={supernova.id}
          className="supernova"
          style={{
            position: 'absolute',
            left: supernova.x - supernova.size / 2,
            top: supernova.y - supernova.size / 2,
            width: supernova.size,
            height: supernova.size,
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          {/* Main Explosion */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100%',
              height: '100%',
              background: `radial-gradient(circle, ${supernova.color}, transparent 70%)`,
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              opacity: supernova.intensity,
              boxShadow: `0 0 ${supernova.size}px ${supernova.color}`,
            }}
          />
          {/* Shockwave Ring */}
          {supernova.shockwaveRadius > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: supernova.shockwaveRadius * 2,
                height: supernova.shockwaveRadius * 2,
                border: `2px solid ${supernova.color}`,
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: supernova.life * 0.5,
              }}
            />
          )}
        </div>
      ))}

      {/* Render Flying Electric Guitars */}
      {flyingGuitars.map((guitar) => (
        <div
          key={guitar.id}
          className={`flying-guitar ${guitar.type}`}
          style={{
            position: 'absolute',
            left: guitar.x - guitar.scaledSize / 2,
            top: guitar.y - guitar.scaledSize / 2,
            width: guitar.scaledSize,
            height: guitar.scaledSize,
            transform: `rotate(${guitar.rotation}rad) scale(${guitar.perspective})`,
            opacity: guitar.life * (0.7 + guitar.electricPulse * 0.3),
            pointerEvents: 'none',
            zIndex: 3,
            filter: `blur(${Math.max(0, 2 - guitar.perspective * 2)}px) drop-shadow(0 0 ${guitar.scaledSize * 0.3}px ${guitar.bodyColor})`,
          }}
        >
          {/* Guitar Body */}
          <div
            style={{
              position: 'absolute',
              top: '30%',
              left: '50%',
              width: guitar.type === 'v-guitar' ? '70%' : '50%',
              height: guitar.type === 'v-guitar' ? '60%' : '45%',
              background: `linear-gradient(135deg, ${guitar.bodyColor}, ${guitar.bodyColor}dd)`,
              transform: 'translate(-50%, -50%)',
              clipPath: guitar.type === 'v-guitar' ? 
                'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' : // V shape
                'ellipse(50% 50%)', // Strat body shape
              boxShadow: `inset 0 0 20px rgba(0,0,0,0.3), 0 0 ${guitar.scaledSize * 0.2}px ${guitar.bodyColor}`,
            }}
          />
          
          {/* Guitar Neck */}
          <div
            style={{
              position: 'absolute',
              top: '5%',
              left: '50%',
              width: '8%',
              height: '70%',
              background: `linear-gradient(180deg, ${guitar.neckColor}, ${guitar.neckColor}aa)`,
              transform: 'translate(-50%, 0%)',
              borderRadius: '4px',
              boxShadow: `inset 0 0 5px rgba(0,0,0,0.5)`,
            }}
          />
          
          {/* Guitar Headstock */}
          <div
            style={{
              position: 'absolute',
              top: '0%',
              left: '50%',
              width: '15%',
              height: '20%',
              background: guitar.neckColor,
              transform: 'translate(-50%, 0%)',
              borderRadius: '3px',
            }}
          />
          
          {/* Guitar Strings */}
          {[...Array(6)].map((_, stringIndex) => (
            <div
              key={`string-${stringIndex}`}
              style={{
                position: 'absolute',
                top: '5%',
                left: `${45 + stringIndex * 2}%`,
                width: '1px',
                height: '70%',
                background: '#cccccc',
                opacity: 0.8,
                boxShadow: `0 0 2px #ffffff`,
              }}
            />
          ))}
          
          {/* Electric Sparkles */}
          {(guitar.sparkles || []).map((sparkle, sparkleIndex) => (
            <div
              key={`sparkle-${guitar.id}-${sparkleIndex}`}
              style={{
                position: 'absolute',
                left: sparkle.x - guitar.x + guitar.scaledSize / 2,
                top: sparkle.y - guitar.y + guitar.scaledSize / 2,
                width: sparkle.size,
                height: sparkle.size,
                background: '#00ffff',
                borderRadius: '50%',
                opacity: sparkle.life,
                boxShadow: `0 0 ${sparkle.size * 3}px #00ffff`,
              }}
            />
          ))}
          
          {/* Electric Aura */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '120%',
              height: '120%',
              background: `radial-gradient(circle, transparent 40%, ${guitar.bodyColor}22 70%, transparent)`,
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              opacity: guitar.electricPulse,
              animation: `electric-pulse 0.2s infinite alternate`,
            }}
          />
          
          {/* Rock Trail Effect */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: `${guitar.trailLength * 20}px`,
              height: '4px',
              background: `linear-gradient(90deg, ${guitar.bodyColor}, transparent)`,
              transform: 'translate(-50%, -50%) rotate(180deg)',
              opacity: 0.6,
              borderRadius: '2px',
            }}
          />
        </div>
      ))}

      {/* Render Skill Planets */}
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
              position: isMobile ? 'fixed' : 'absolute', // Fixed positioning on mobile to stay above all content
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
                ? (isHovered || isSelected ? 9999 : 9998) // Very high z-index on mobile to overcome all content
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
            // Additional mobile support - multiple event handlers for maximum compatibility
            onPointerDown={(e) => {
              if (isMobile) {
                e.preventDefault();
                e.stopPropagation();
                handlePlanetClick(circle, skillData);
              }
            }}
            onMouseDown={(e) => {
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
            
            {/* Spacecraft Monitoring System Label */}
            {skillData?.name && (isHovered || isSelected) && (
              <div
                className={`spacecraft-label ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
                style={{
                  position: 'absolute',
                  bottom: `-${circle.size * 0.8}px`,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  minWidth: '120px',
                  maxWidth: '200px',
                  padding: '8px 12px',
                  background: isDarkMode 
                    ? 'linear-gradient(135deg, rgba(0, 20, 40, 0.95) 0%, rgba(0, 40, 80, 0.95) 100%)'
                    : 'linear-gradient(135deg, rgba(20, 40, 80, 0.95) 0%, rgba(40, 60, 120, 0.95) 100%)',
                  border: isDarkMode ? '1px solid #00ffff' : '1px solid #4488ff',
                  borderRadius: '4px',
                  color: isDarkMode ? '#00ffff' : '#4488ff',
                  fontSize: `${Math.max(10, circle.size * 0.12)}px`,
                  fontFamily: 'Courier New, monospace',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  boxShadow: isDarkMode 
                    ? '0 0 15px rgba(0, 255, 255, 0.5), inset 0 0 10px rgba(0, 255, 255, 0.1)'
                    : '0 0 15px rgba(255, 136, 0, 0.5), inset 0 0 10px rgba(255, 136, 0, 0.1)',
                  backdropFilter: 'blur(5px)',
                  zIndex: 10000,
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  animation: isDarkMode ? 'spacecraft-glow-dark 2s ease-in-out infinite alternate' : 'spacecraft-glow-light-blue 2s ease-in-out infinite alternate',
                }}
              >
                <div style={{ 
                  fontSize: `${Math.max(8, circle.size * 0.1)}px`, 
                  opacity: 0.7, 
                  marginBottom: '2px',
                  color: isDarkMode ? '#80ffff' : '#66aaff'
                }}>
                  SKILL MODULE
                </div>
                <div style={{ 
                  fontSize: `${Math.max(11, circle.size * 0.13)}px`,
                  textShadow: isDarkMode ? '0 0 8px #00ffff' : '0 0 8px #4488ff'
                }}>
                  {skillData.name}
                </div>
                <div style={{ 
                  fontSize: `${Math.max(7, circle.size * 0.09)}px`, 
                  opacity: 0.6, 
                  marginTop: '2px',
                  color: isDarkMode ? '#60ffff' : '#5599ff'
                }}>
                  STATUS: ACTIVE
                </div>
                
                {/* Technical corner elements */}
                <div style={{
                  position: 'absolute',
                  top: '2px',
                  left: '2px',
                  width: '8px',
                  height: '8px',
                  border: '1px solid #00ffff',
                  borderRight: 'none',
                  borderBottom: 'none'
                }} />
                <div style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  width: '8px',
                  height: '8px',
                  border: '1px solid #00ffff',
                  borderLeft: 'none',
                  borderBottom: 'none'
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: '2px',
                  left: '2px',
                  width: '8px',
                  height: '8px',
                  border: '1px solid #00ffff',
                  borderRight: 'none',
                  borderTop: 'none'
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '8px',
                  height: '8px',
                  border: '1px solid #00ffff',
                  borderLeft: 'none',
                  borderTop: 'none'
                }} />
                
                {/* Connection line to planet */}
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '2px',
                  height: '8px',
                  background: 'linear-gradient(to bottom, #00ffff, transparent)',
                  boxShadow: '0 0 4px #00ffff'
                }} />
              </div>
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
