import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

// Simplified realistic meteor
function RealisticMeteor({ 
  position = [0, 0, 0], 
  velocity = [0, 0, 0], 
  size = 0.1,
  isDarkMode = false 
}) {
  const meteorRef = useRef();

  useFrame((state) => {
    if (meteorRef.current) {
      // Update meteor position
      meteorRef.current.position.x += velocity[0];
      meteorRef.current.position.y += velocity[1];
      meteorRef.current.position.z += velocity[2];

      // Add rotation for realism
      meteorRef.current.rotation.x += 0.02;
      meteorRef.current.rotation.y += 0.01;

      // Reset meteor when it goes off screen
      if (meteorRef.current.position.y < -50 || 
          meteorRef.current.position.x < -100 || 
          meteorRef.current.position.x > 100) {
        meteorRef.current.position.set(
          Math.random() * 100 - 50,
          Math.random() * 20 + 30,
          Math.random() * -30 - 10
        );
      }
    }
  });

  return (
    <group>
      {/* Main meteor body */}
      <mesh ref={meteorRef} position={position}>
        <sphereGeometry args={[size, 16, 12]} />
        <meshStandardMaterial 
          color={isDarkMode ? '#ff6b35' : '#8b4513'}
          emissive={isDarkMode ? '#ff4500' : '#4a2c2a'}
          emissiveIntensity={isDarkMode ? 0.8 : 0.3}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Glowing core */}
      <mesh position={position}>
        <sphereGeometry args={[size * 0.7, 12, 8]} />
        <meshBasicMaterial 
          color={isDarkMode ? '#ffff00' : '#ff6600'} 
          transparent 
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

// Realistic starfield with different star types
function RealisticStarfield({ count = 2000, isDarkMode = false }) {
  const starsRef = useRef();
  const { camera } = useThree();

  const [positions, colors, sizes] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    // Star color palette
    const starTypes = [
      { color: [0.7, 0.8, 1.0], weight: 0.4 }, // Blue-white (hot stars)
      { color: [1.0, 1.0, 1.0], weight: 0.3 }, // White
      { color: [1.0, 0.9, 0.7], weight: 0.2 }, // Yellow-white
      { color: [1.0, 0.6, 0.4], weight: 0.1 }, // Orange-red
    ];

    for (let i = 0; i < count; i++) {
      // Position stars in sphere around camera
      const radius = Math.random() * 400 + 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Assign star type based on weight
      const rand = Math.random();
      let cumulative = 0;
      let selectedType = starTypes[0];

      for (const type of starTypes) {
        cumulative += type.weight;
        if (rand < cumulative) {
          selectedType = type;
          break;
        }
      }

      colors[i * 3] = selectedType.color[0];
      colors[i * 3 + 1] = selectedType.color[1];
      colors[i * 3 + 2] = selectedType.color[2];

      // Vary star sizes (bigger stars are rarer)
      sizes[i] = Math.random() < 0.1 ? Math.random() * 3 + 2 : Math.random() * 1.5 + 0.5;
    }

    return [positions, colors, sizes];
  }, [count]);

  useFrame((state) => {
    if (starsRef.current) {
      // Subtle parallax effect
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.0001;
      starsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.0002) * 0.01;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial 
        vertexColors 
        transparent 
        opacity={isDarkMode ? 0.9 : 0.6}
        size={3}
        sizeAttenuation={false}
        blending={THREE.AdditiveBlending}
        alphaTest={0.1}
        depthWrite={false}
      />
    </points>
  );
}

// Galaxy spiral arms using particle system
function GalaxyArms({ isDarkMode = false }) {
  const galaxyRef = useRef();
  
  const [positions, colors] = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Create spiral galaxy pattern
      const radius = Math.random() * 300 + 50;
      const spinAngle = radius * 0.01;
      const branchAngle = (Math.PI * 2 * Math.random()) / 3; // 3 spiral arms
      
      const angle = branchAngle + spinAngle;
      
      // Add randomness to create more realistic distribution
      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1);
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1);
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1);

      positions[i * 3] = Math.cos(angle) * radius + randomX * 10;
      positions[i * 3 + 1] = randomY * 2;
      positions[i * 3 + 2] = Math.sin(angle) * radius + randomZ * 10;

      // Color gradient from center (yellow/white) to edges (blue/purple)
      const centerDistance = radius / 300;
      
      if (isDarkMode) {
        colors[i * 3] = Math.max(0.3, 1 - centerDistance); // Red
        colors[i * 3 + 1] = Math.max(0.2, 0.8 - centerDistance * 0.5); // Green
        colors[i * 3 + 2] = Math.min(1, 0.5 + centerDistance); // Blue
      } else {
        colors[i * 3] = 0.4 + centerDistance * 0.3; // Red
        colors[i * 3 + 1] = 0.3 + centerDistance * 0.2; // Green
        colors[i * 3 + 2] = 0.6 + centerDistance * 0.4; // Blue
      }
    }

    return [positions, colors];
  }, [isDarkMode]);

  useFrame((state) => {
    if (galaxyRef.current) {
      // Slowly rotate galaxy
      galaxyRef.current.rotation.y = state.clock.elapsedTime * 0.00005;
    }
  });

  return (
    <points ref={galaxyRef} position={[0, 0, -200]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        vertexColors 
        transparent 
        opacity={isDarkMode ? 0.4 : 0.2}
        size={1}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Simple space dust particles for nebula effect
function SpaceDust({ isDarkMode = false }) {
  const dustRef = useRef();
  
  const [positions, colors] = useMemo(() => {
    const count = 1000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 300;

      const colorIntensity = Math.random() * 0.5;
      if (isDarkMode) {
        colors[i * 3] = 0.5 + colorIntensity; // Red
        colors[i * 3 + 1] = 0.2 + colorIntensity * 0.5; // Green
        colors[i * 3 + 2] = 0.8; // Blue
      } else {
        colors[i * 3] = 0.3 + colorIntensity * 0.3;
        colors[i * 3 + 1] = 0.2 + colorIntensity * 0.2;
        colors[i * 3 + 2] = 0.4 + colorIntensity * 0.4;
      }
    }

    return [positions, colors];
  }, [isDarkMode]);
  
  useFrame((state) => {
    if (dustRef.current) {
      dustRef.current.rotation.y = state.clock.elapsedTime * 0.0001;
    }
  });

  return (
    <points ref={dustRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        vertexColors 
        transparent 
        opacity={isDarkMode ? 0.2 : 0.1}
        size={2}
        sizeAttenuation={true}
      />
    </points>
  );
}

// Main space scene
function RealisticSpaceScene() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Listen for theme changes
  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.getAttribute('data-theme') === 'dark');
    };

    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  // Generate meteors with realistic physics
  const meteors = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      key: `meteor-${i}`,
      position: [
        Math.random() * 80 - 40,
        Math.random() * 30 + 20,
        Math.random() * -20 - 5
      ],
      velocity: [
        (Math.random() - 0.7) * 0.8,
        -(Math.random() * 0.6 + 0.3),
        (Math.random() - 0.5) * 0.2
      ],
      size: Math.random() * 0.3 + 0.1
    }));
  }, []);

  return (
    <>
      {/* Lighting setup for realistic space */}
      <ambientLight intensity={0.1} color="#0a0a2e" />
      <directionalLight 
        position={[100, 50, 100]} 
        intensity={0.3}
        color="#ffffff"
        castShadow={false}
      />
      
      {/* Galaxy background */}
      <GalaxyArms isDarkMode={isDarkMode} />
      
      {/* Realistic starfield */}
      <RealisticStarfield count={3000} isDarkMode={isDarkMode} />
      
      {/* Space dust */}
      <SpaceDust isDarkMode={isDarkMode} />
      
      {/* Meteors with realistic physics */}
      {meteors.map((meteor) => (
        <RealisticMeteor
          key={meteor.key}
          position={meteor.position}
          velocity={meteor.velocity}
          size={meteor.size}
          isDarkMode={isDarkMode}
        />
      ))}
      
      {/* Built-in animated stars for extra depth */}
      <Stars
        radius={500}
        depth={100}
        count={1000}
        factor={6}
        saturation={0.1}
        fade={true}
        speed={0.1}
      />
    </>
  );
}

const RealisticSpaceBackground = () => {
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
          fov: 75,
          near: 0.1,
          far: 1000
        }}
        style={{ background: 'transparent' }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
          precision: "highp",
          pixelRatio: Math.min(window.devicePixelRatio, 2)
        }}
        dpr={Math.min(window.devicePixelRatio, 2)}
        resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
      >
        <RealisticSpaceScene />
      </Canvas>
    </div>
  );
};

export default RealisticSpaceBackground;