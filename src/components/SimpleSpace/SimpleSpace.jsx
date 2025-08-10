import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

// Beautiful sci-fi cartoon spaceship
function SimpleSpaceship({ position = [0, 0, 0], velocity = [0, 0, 1], size = 1, isDarkMode = false, shipType = 0 }) {
  const groupRef = useRef();
  const engineRef = useRef();
  const cockpitRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      // Smooth continuous movement
      groupRef.current.position.z += velocity[2];
      groupRef.current.position.x += velocity[0] * 0.1;
      groupRef.current.position.y += velocity[1] * 0.1;

      // Smooth flight dynamics
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + position[0] * 0.1) * 0.05;
      groupRef.current.rotation.x = velocity[1] * 0.15 + Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
      groupRef.current.rotation.y = velocity[0] * 0.15 + Math.cos(state.clock.elapsedTime * 0.4) * 0.02;

      // Engine pulse effect
      if (engineRef.current) {
        const pulse = Math.sin(state.clock.elapsedTime * 8 + position[1] * 0.2) * 0.3 + 0.7;
        engineRef.current.scale.setScalar(pulse);
      }

      // Smooth respawn when out of view - always from behind camera
      if (groupRef.current.position.z > 60) {
        // Respawn far behind with smooth entry
        const newX = (Math.random() - 0.5) * 120;
        const newY = (Math.random() - 0.5) * 60;
        const newZ = -250 - Math.random() * 50;
        
        groupRef.current.position.set(newX, newY, newZ);
        
        // Reset with slight variation to prevent synchronization
        velocity[0] = (Math.random() - 0.5) * 0.08;
        velocity[1] = (Math.random() - 0.5) * 0.04;
        velocity[2] = Math.random() * 0.8 + 0.8; // Always moving forward
      }
    }
  });

  // Different color schemes for different ship types
  const colorSchemes = [
    {
      hull: isDarkMode ? '#6366f1' : '#4338ca', // Indigo
      accent: isDarkMode ? '#ec4899' : '#db2777', // Pink
      glow: isDarkMode ? '#06b6d4' : '#0891b2' // Cyan
    },
    {
      hull: isDarkMode ? '#10b981' : '#059669', // Emerald
      accent: isDarkMode ? '#f59e0b' : '#d97706', // Amber
      glow: isDarkMode ? '#8b5cf6' : '#7c3aed' // Violet
    },
    {
      hull: isDarkMode ? '#ef4444' : '#dc2626', // Red
      accent: isDarkMode ? '#06b6d4' : '#0891b2', // Cyan
      glow: isDarkMode ? '#f59e0b' : '#d97706' // Amber
    }
  ];
  
  const colors = colorSchemes[shipType % colorSchemes.length];
  const hullColor = colors.hull;
  const accentColor = colors.accent;
  const glowColor = colors.glow;

  return (
    <group ref={groupRef} position={position}>
      {/* Main fuselage - sleek sci-fi design */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[size * 0.4, size * 3.5, 4, 16]} />
        <meshBasicMaterial color={hullColor} />
      </mesh>
      
      {/* Nose cone - sharp and aerodynamic */}
      <mesh position={[size * 2.2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[size * 0.35, size * 1.2, 8]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>
      
      {/* Main wings - swept back design */}
      <mesh position={[-size * 0.5, 0, 0]} rotation={[0, 0, Math.PI * 0.1]}>
        <boxGeometry args={[size * 2, size * 0.12, size * 4]} />
        <meshBasicMaterial color={hullColor} />
      </mesh>
      
      {/* Wing tips with energy cores */}
      <mesh position={[size * 0.8, 0, size * 1.8]}>
        <sphereGeometry args={[size * 0.15, 8, 8]} />
        <meshBasicMaterial color={glowColor} />
      </mesh>
      <mesh position={[size * 0.8, 0, -size * 1.8]}>
        <sphereGeometry args={[size * 0.15, 8, 8]} />
        <meshBasicMaterial color={glowColor} />
      </mesh>
      
      {/* Cockpit - glowing dome */}
      <mesh ref={cockpitRef} position={[size * 1.2, size * 0.3, 0]}>
        <sphereGeometry args={[size * 0.4, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshBasicMaterial 
          color={isDarkMode ? '#fbbf24' : '#f59e0b'}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Secondary hull details */}
      <mesh position={[size * 0.3, size * 0.2, 0]}>
        <cylinderGeometry args={[size * 0.15, size * 0.15, size * 2, 8]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>
      
      {/* Engine nacelles - twin thrusters */}
      <mesh position={[-size * 2.2, 0, size * 0.6]}>
        <cylinderGeometry args={[size * 0.2, size * 0.15, size * 1.5, 8]} />
        <meshBasicMaterial color={hullColor} />
      </mesh>
      <mesh position={[-size * 2.2, 0, -size * 0.6]}>
        <cylinderGeometry args={[size * 0.2, size * 0.15, size * 1.5, 8]} />
        <meshBasicMaterial color={hullColor} />
      </mesh>
      
      {/* Engine exhausts - pulsing glow */}
      <group ref={engineRef} position={[-size * 3.2, 0, 0]}>
        <mesh position={[0, 0, size * 0.6]}>
          <coneGeometry args={[size * 0.25, size * 0.8, 8]} />
          <meshBasicMaterial 
            color="#00ffff" 
            transparent
            opacity={0.8}
          />
        </mesh>
        <mesh position={[0, 0, -size * 0.6]}>
          <coneGeometry args={[size * 0.25, size * 0.8, 8]} />
          <meshBasicMaterial 
            color="#00ffff" 
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>
      
      {/* Decorative fins */}
      <mesh position={[-size * 1.5, size * 0.4, 0]} rotation={[Math.PI / 4, 0, 0]}>
        <boxGeometry args={[size * 0.8, size * 0.05, size * 1.2]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>
      <mesh position={[-size * 1.5, -size * 0.4, 0]} rotation={[-Math.PI / 4, 0, 0]}>
        <boxGeometry args={[size * 0.8, size * 0.05, size * 1.2]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>
      
      {/* Navigation lights */}
      <mesh position={[size * 2.8, 0, size * 0.3]}>
        <sphereGeometry args={[size * 0.05, 6, 6]} />
        <meshBasicMaterial color="#ff0040" />
      </mesh>
      <mesh position={[size * 2.8, 0, -size * 0.3]}>
        <sphereGeometry args={[size * 0.05, 6, 6]} />
        <meshBasicMaterial color="#00ff40" />
      </mesh>
      
      {/* Wing strobe lights */}
      <mesh position={[size * 0.8, 0, size * 2.2]}>
        <sphereGeometry args={[size * 0.03, 4, 4]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[size * 0.8, 0, -size * 2.2]}>
        <sphereGeometry args={[size * 0.03, 4, 4]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

// Simple floating asteroids
function SimpleAsteroid({ position = [0, 0, 0], velocity = [0, -0.2, 0], size = 0.5 }) {
  const asteroidRef = useRef();

  useFrame((state) => {
    if (asteroidRef.current) {
      // Smooth movement
      asteroidRef.current.position.x += velocity[0];
      asteroidRef.current.position.y += velocity[1];
      asteroidRef.current.position.z += velocity[2];

      // Varied rotation speeds for each asteroid
      asteroidRef.current.rotation.x += 0.008 + Math.sin(state.clock.elapsedTime * 0.1) * 0.002;
      asteroidRef.current.rotation.y += 0.012 + Math.cos(state.clock.elapsedTime * 0.15) * 0.003;
      asteroidRef.current.rotation.z += 0.005;

      // Smooth respawn from top when out of view
      if (asteroidRef.current.position.y < -70) {
        asteroidRef.current.position.set(
          (Math.random() - 0.5) * 120,
          60 + Math.random() * 20,
          (Math.random() - 0.5) * 100
        );
        // Randomize velocity slightly to prevent synchronization
        velocity[0] = (Math.random() - 0.5) * 0.06;
        velocity[1] = -(Math.random() * 0.08 + 0.12);
        velocity[2] = (Math.random() - 0.5) * 0.04;
      }
    }
  });

  return (
    <mesh ref={asteroidRef} position={position}>
      <dodecahedronGeometry args={[size]} />
      <meshBasicMaterial color="#444444" />
    </mesh>
  );
}

// Simple particle field for distant stars
function SimpleStarField({ isDarkMode = false }) {
  const starsRef = useRef();

  const starPositions = useMemo(() => {
    const positions = new Float32Array(8000 * 3);
    for (let i = 0; i < 8000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
    }
    return positions;
  }, []);

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0002;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={starPositions.length / 3}
          array={starPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1}
        color={isDarkMode ? '#ffffff' : '#000000'}
        sizeAttenuation={false}
      />
    </points>
  );
}

// Main scene component
function SimpleSpaceScene() {
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const spaceships = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 50,
        -200 - i * 80 - Math.random() * 50 // Stagger initial positions
      ],
      velocity: [
        (Math.random() - 0.5) * 0.08,
        (Math.random() - 0.5) * 0.04,
        0.8 + Math.random() * 0.6 // Consistent forward movement
      ],
      size: Math.random() * 0.4 + 0.8,
      type: i % 3 // Different ship types for variety
    }));
  }, []);

  const asteroids = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 120,
        50 + i * 12 + Math.random() * 8, // Stagger vertically
        (Math.random() - 0.5) * 100
      ],
      velocity: [
        (Math.random() - 0.5) * 0.04,
        -(Math.random() * 0.06 + 0.12), // Consistent downward movement
        (Math.random() - 0.5) * 0.02
      ],
      size: Math.random() * 0.3 + 0.3
    }));
  }, []);

  return (
    <>
      {/* Basic lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      
      {/* Star field */}
      <SimpleStarField isDarkMode={isDarkMode} />
      
      {/* Background stars from drei */}
      <Stars
        radius={300}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade={true}
        speed={0.5}
        color={isDarkMode ? '#ffffff' : '#000000'}
      />

      {/* Spaceships */}
      {spaceships.map((ship) => (
        <SimpleSpaceship
          key={ship.id}
          position={ship.position}
          velocity={ship.velocity}
          size={ship.size}
          isDarkMode={isDarkMode}
          shipType={ship.type}
        />
      ))}

      {/* Asteroids */}
      {asteroids.map((asteroid) => (
        <SimpleAsteroid
          key={asteroid.id}
          position={asteroid.position}
          velocity={asteroid.velocity}
          size={asteroid.size}
        />
      ))}
    </>
  );
}

// Main component
const SimpleSpace = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      pointerEvents: 'none'
    }}>
      <Canvas
        camera={{ 
          position: [0, 0, 30],
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        style={{ background: 'transparent' }}
      >
        <SimpleSpaceScene />
      </Canvas>
    </div>
  );
};

export default SimpleSpace;