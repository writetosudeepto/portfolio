import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

// Simple spaceship without complex materials
function SimpleSpaceship({ position = [0, 0, 0], velocity = [0, 0, 1], size = 1, isDarkMode = false }) {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      // Movement
      groupRef.current.position.z += velocity[2];
      groupRef.current.position.x += velocity[0] * 0.1;
      groupRef.current.position.y += velocity[1] * 0.1;

      // Simple rotation
      groupRef.current.rotation.z = Math.sin(Date.now() * 0.001) * 0.02;

      // Reset position when out of view
      if (groupRef.current.position.z > 50 || groupRef.current.position.z < -200) {
        groupRef.current.position.set(
          (Math.random() - 0.5) * 150,
          (Math.random() - 0.5) * 80,
          -200 - Math.random() * 100
        );
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Simple fuselage */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[size * 0.1, size * 0.3, size * 3, 8]} />
        <meshBasicMaterial color={isDarkMode ? '#4a5568' : '#2d3748'} />
      </mesh>
      
      {/* Wings */}
      <mesh position={[-size * 0.3, 0, 0]}>
        <boxGeometry args={[size * 1.2, size * 0.1, size * 2.5]} />
        <meshBasicMaterial color={isDarkMode ? '#4a5568' : '#2d3748'} />
      </mesh>
      
      {/* Engine glow */}
      <mesh position={[-size * 1.8, 0, 0]}>
        <sphereGeometry args={[size * 0.15, 6, 6]} />
        <meshBasicMaterial color="#00aaff" />
      </mesh>
      
      {/* Navigation lights */}
      <mesh position={[size * 1.5, 0, size * 1.2]}>
        <sphereGeometry args={[size * 0.02, 4, 4]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <mesh position={[size * 1.5, 0, -size * 1.2]}>
        <sphereGeometry args={[size * 0.02, 4, 4]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>
    </group>
  );
}

// Simple floating asteroids
function SimpleAsteroid({ position = [0, 0, 0], velocity = [0, -0.2, 0], size = 0.5 }) {
  const asteroidRef = useRef();

  useFrame(() => {
    if (asteroidRef.current) {
      asteroidRef.current.position.x += velocity[0];
      asteroidRef.current.position.y += velocity[1];
      asteroidRef.current.position.z += velocity[2];

      // Rotation
      asteroidRef.current.rotation.x += 0.01;
      asteroidRef.current.rotation.y += 0.015;

      // Reset when out of view
      if (asteroidRef.current.position.y < -60) {
        asteroidRef.current.position.set(
          (Math.random() - 0.5) * 100,
          Math.random() * 20 + 50,
          (Math.random() - 0.5) * 80
        );
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
    return Array.from({ length: 3 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 150,
        (Math.random() - 0.5) * 80,
        -150 - Math.random() * 100
      ],
      velocity: [
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.05,
        Math.random() * 1.0 + 0.5
      ],
      size: Math.random() * 0.5 + 0.8
    }));
  }, []);

  const asteroids = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 100,
        Math.random() * 30 + 40,
        (Math.random() - 0.5) * 80
      ],
      velocity: [
        (Math.random() - 0.5) * 0.05,
        -(Math.random() * 0.1 + 0.1),
        (Math.random() - 0.5) * 0.03
      ],
      size: Math.random() * 0.4 + 0.2
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