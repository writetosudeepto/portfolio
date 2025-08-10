import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

// Simple Spaceship
function SimpleSpaceship({ position = [0, 0, 0], velocity = [0, 0, 0.5], size = 0.5, isDarkMode = false }) {
  const shipRef = useRef();

  useFrame(() => {
    if (shipRef.current) {
      // Move along Z-axis
      shipRef.current.position.z += velocity[2];
      shipRef.current.position.x += velocity[0];
      shipRef.current.position.y += velocity[1];

      // Rotation for movement effect
      shipRef.current.rotation.z = Math.sin(Date.now() * 0.002) * 0.1;

      // Reset when out of bounds
      if (shipRef.current.position.z > 30 || shipRef.current.position.z < -100) {
        shipRef.current.position.set(
          (Math.random() - 0.5) * 80,
          (Math.random() - 0.5) * 40,
          -80 - Math.random() * 20
        );
      }
    }
  });

  return (
    <group ref={shipRef} position={position}>
      {/* Main hull */}
      <mesh>
        <boxGeometry args={[size * 2, size * 0.5, size * 3]} />
        <meshStandardMaterial
          color={isDarkMode ? '#4a90e2' : '#2c3e50'}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Wings */}
      <mesh>
        <boxGeometry args={[size * 4, size * 0.2, size]} />
        <meshStandardMaterial
          color={isDarkMode ? '#5dade2' : '#34495e'}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Engine glow */}
      <mesh position={[0, 0, -size * 1.5]}>
        <cylinderGeometry args={[size * 0.3, size * 0.2, size * 0.8, 6]} />
        <meshBasicMaterial
          color={isDarkMode ? '#ff6b00' : '#e74c3c'}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}

// Simple Galaxy
function SimpleGalaxy({ isDarkMode = false }) {
  const galaxyRef = useRef();

  const particles = useMemo(() => {
    const count = 10000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 20;
      const angle = Math.random() * Math.PI * 2;
      const spiralAngle = radius * 0.3;

      positions[i * 3] = Math.cos(angle + spiralAngle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 2] = Math.sin(angle + spiralAngle) * radius;

      const colorIntensity = 1 - radius / 20;
      colors[i * 3] = colorIntensity; // Red
      colors[i * 3 + 1] = colorIntensity * 0.8; // Green  
      colors[i * 3 + 2] = isDarkMode ? 1 : 0.6; // Blue
    }

    return [positions, colors];
  }, [isDarkMode]);

  useFrame((state) => {
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y = state.clock.elapsedTime * 0.0001;
    }
  });

  return (
    <points ref={galaxyRef} position={[0, 0, -60]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles[0].length / 3}
          array={particles[0]}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles[1].length / 3}
          array={particles[1]}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        vertexColors
        transparent
        opacity={isDarkMode ? 0.8 : 0.6}
        sizeAttenuation={true}
      />
    </points>
  );
}

// Simple Meteors
function SimpleMeteor({ position = [0, 0, 0], velocity = [0, -0.5, 0], size = 0.1, isDarkMode = false }) {
  const meteorRef = useRef();

  useFrame(() => {
    if (meteorRef.current) {
      meteorRef.current.position.x += velocity[0];
      meteorRef.current.position.y += velocity[1];
      meteorRef.current.position.z += velocity[2];

      meteorRef.current.rotation.x += 0.02;
      meteorRef.current.rotation.y += 0.03;

      // Reset when off screen
      if (meteorRef.current.position.y < -30) {
        meteorRef.current.position.set(
          (Math.random() - 0.5) * 60,
          Math.random() * 10 + 20,
          (Math.random() - 0.5) * 40
        );
      }
    }
  });

  return (
    <mesh ref={meteorRef} position={position}>
      <dodecahedronGeometry args={[size]} />
      <meshStandardMaterial
        color={isDarkMode ? '#ff6b35' : '#8b4513'}
        emissive={isDarkMode ? '#ff4500' : '#654321'}
        emissiveIntensity={0.3}
        roughness={0.8}
      />
    </mesh>
  );
}

// Main Scene
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
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 50,
        -80 - Math.random() * 40
      ],
      velocity: [
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.05,
        Math.random() * 0.8 + 0.3
      ],
      size: Math.random() * 0.3 + 0.2
    }));
  }, []);

  const meteors = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 60,
        Math.random() * 10 + 20,
        (Math.random() - 0.5) * 40
      ],
      velocity: [
        (Math.random() - 0.5) * 0.2,
        -(Math.random() * 0.3 + 0.2),
        (Math.random() - 0.5) * 0.1
      ],
      size: Math.random() * 0.15 + 0.05
    }));
  }, []);

  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      <SimpleGalaxy isDarkMode={isDarkMode} />
      
      <Stars
        radius={300}
        depth={50}
        count={2000}
        factor={4}
        saturation={0}
        fade={true}
        speed={0.1}
      />

      {spaceships.map((ship) => (
        <SimpleSpaceship
          key={ship.id}
          position={ship.position}
          velocity={ship.velocity}
          size={ship.size}
          isDarkMode={isDarkMode}
        />
      ))}

      {meteors.map((meteor) => (
        <SimpleMeteor
          key={meteor.id}
          position={meteor.position}
          velocity={meteor.velocity}
          size={meteor.size}
          isDarkMode={isDarkMode}
        />
      ))}
    </>
  );
}

const SimpleSpaceBackground = () => {
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
          position: [0, 0, 20],
          fov: 75,
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

export default SimpleSpaceBackground;