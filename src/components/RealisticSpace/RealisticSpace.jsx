import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Stars, useGLTF, Environment, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Simplified material creation to avoid uniform issues

// Simplified spaceship component
function RealisticSpaceship({ position = [0, 0, 0], velocity = [0, 0, 1], size = 1, isDarkMode = false }) {
  const groupRef = useRef();
  const engineRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      // Smooth movement
      groupRef.current.position.z += velocity[2];
      groupRef.current.position.x += velocity[0] * 0.1;
      groupRef.current.position.y += velocity[1] * 0.1;

      // Realistic flight dynamics
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.03;
      groupRef.current.rotation.x = velocity[1] * 0.1;
      groupRef.current.rotation.y = velocity[0] * 0.1;

      // Reset position
      if (groupRef.current.position.z > 40 || groupRef.current.position.z < -200) {
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
      {/* Main fuselage */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[size * 0.15, size * 0.4, size * 4, 12]} />
        <meshStandardMaterial 
          color={isDarkMode ? '#2c3e50' : '#34495e'}
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
      
      {/* Nose cone */}
      <mesh position={[size * 2.2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[size * 0.15, size * 0.8, 8]} />
        <meshStandardMaterial 
          color={isDarkMode ? '#2c3e50' : '#34495e'}
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
      
      {/* Wings */}
      <mesh position={[-size * 0.5, 0, 0]}>
        <boxGeometry args={[size * 1.5, size * 0.15, size * 4]} />
        <meshStandardMaterial 
          color={isDarkMode ? '#2c3e50' : '#34495e'}
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
      
      {/* Cockpit */}
      <mesh position={[size * 1.2, size * 0.2, 0]}>
        <sphereGeometry args={[size * 0.25, 8, 6]} />
        <meshBasicMaterial 
          color={isDarkMode ? '#00d4ff' : '#4169e1'}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Engine exhausts */}
      <group ref={engineRef} position={[-size * 2.5, 0, 0]}>
        <mesh position={[0, 0, size * 0.3]}>
          <cylinderGeometry args={[size * 0.08, size * 0.12, size * 0.6, 6]} />
          <meshBasicMaterial color="#0099ff" emissive="#0066cc" />
        </mesh>
        <mesh position={[0, 0, -size * 0.3]}>
          <cylinderGeometry args={[size * 0.08, size * 0.12, size * 0.6, 6]} />
          <meshBasicMaterial color="#0099ff" emissive="#0066cc" />
        </mesh>
      </group>
      
      {/* Navigation lights */}
      <mesh position={[size * 2, 0, size * 0.8]}>
        <sphereGeometry args={[size * 0.03, 4, 4]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <mesh position={[size * 2, 0, -size * 0.8]}>
        <sphereGeometry args={[size * 0.03, 4, 4]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>
    </group>
  );
}

// Simplified asteroid component
function RealisticAsteroid({ position = [0, 0, 0], velocity = [0, -0.2, 0], size = 0.5 }) {
  const asteroidRef = useRef();

  useFrame(() => {
    if (asteroidRef.current) {
      asteroidRef.current.position.x += velocity[0];
      asteroidRef.current.position.y += velocity[1];
      asteroidRef.current.position.z += velocity[2];

      // Rotation
      asteroidRef.current.rotation.x += 0.005;
      asteroidRef.current.rotation.y += 0.008;
      asteroidRef.current.rotation.z += 0.003;

      // Reset position
      if (asteroidRef.current.position.y < -50) {
        asteroidRef.current.position.set(
          (Math.random() - 0.5) * 100,
          Math.random() * 20 + 40,
          (Math.random() - 0.5) * 80
        );
      }
    }
  });

  return (
    <mesh ref={asteroidRef} position={position}>
      <icosahedronGeometry args={[size, 1]} />
      <meshStandardMaterial 
        color="#2a2a2a"
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  );
}

// Realistic galaxy with proper star formation regions
function RealisticGalaxySystem({ isDarkMode = false }) {
  const galaxyRef = useRef();
  const dustRef = useRef();

  const [galaxyData, dustData] = useMemo(() => {
    const starCount = 80000;
    const dustCount = 30000;
    
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    
    const dustPositions = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);

    // Create realistic stellar distribution
    for (let i = 0; i < starCount; i++) {
      const radius = Math.pow(Math.random(), 0.7) * 30;
      const branchAngle = (i % 4) * Math.PI * 0.5; // 4 spiral arms
      const spinAngle = radius * 0.4;
      const angle = branchAngle + spinAngle;
      
      // Add randomness for realistic distribution
      const randomRadius = Math.pow(Math.random(), 3) * 2;
      const randomAngle = (Math.random() - 0.5) * 0.5;
      
      starPositions[i * 3] = Math.cos(angle + randomAngle) * (radius + randomRadius);
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * Math.pow(Math.random(), 2) * 3;
      starPositions[i * 3 + 2] = Math.sin(angle + randomAngle) * (radius + randomRadius);

      // Realistic stellar classification
      const stellarType = Math.random();
      const distance = Math.sqrt(starPositions[i * 3] ** 2 + starPositions[i * 3 + 2] ** 2);
      const centralIntensity = Math.max(0, 1 - distance / 30);
      
      if (stellarType < 0.76) {
        // Red dwarfs
        starColors[i * 3] = 1;
        starColors[i * 3 + 1] = 0.2 + Math.random() * 0.3;
        starColors[i * 3 + 2] = 0.1 + Math.random() * 0.1;
        starSizes[i] = 0.3 + Math.random() * 0.4;
      } else if (stellarType < 0.88) {
        // Sun-like stars
        starColors[i * 3] = 1;
        starColors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
        starColors[i * 3 + 2] = 0.6 + Math.random() * 0.3;
        starSizes[i] = 0.8 + Math.random() * 0.8;
      } else if (stellarType < 0.96) {
        // Blue giants
        starColors[i * 3] = 0.6 + Math.random() * 0.4;
        starColors[i * 3 + 1] = 0.7 + Math.random() * 0.3;
        starColors[i * 3 + 2] = 1;
        starSizes[i] = 1.5 + Math.random() * 2;
      } else {
        // Supergiants
        starColors[i * 3] = 1;
        starColors[i * 3 + 1] = 1;
        starColors[i * 3 + 2] = 0.9 + Math.random() * 0.1;
        starSizes[i] = 2 + Math.random() * 3;
      }
      
      // Apply central brightness
      starColors[i * 3] = Math.min(1, starColors[i * 3] + centralIntensity * 0.3);
      starColors[i * 3 + 1] = Math.min(1, starColors[i * 3 + 1] + centralIntensity * 0.2);
      starColors[i * 3 + 2] = Math.min(1, starColors[i * 3 + 2] + centralIntensity * 0.1);
    }

    // Create dust lanes
    for (let i = 0; i < dustCount; i++) {
      const radius = Math.random() * 25;
      const angle = Math.random() * Math.PI * 2;
      
      dustPositions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 5;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
      dustPositions[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 5;

      dustColors[i * 3] = isDarkMode ? 0.6 : 0.4;
      dustColors[i * 3 + 1] = isDarkMode ? 0.3 : 0.2;
      dustColors[i * 3 + 2] = isDarkMode ? 0.2 : 0.1;
    }

    return [
      { positions: starPositions, colors: starColors, sizes: starSizes },
      { positions: dustPositions, colors: dustColors }
    ];
  }, [isDarkMode]);

  useFrame((state) => {
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y = state.clock.elapsedTime * 0.00003;
    }
    if (dustRef.current) {
      dustRef.current.rotation.y = state.clock.elapsedTime * 0.00001;
    }
  });

  return (
    <group position={[0, 0, -120]}>
      {/* Main galaxy stars */}
      <points ref={galaxyRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={galaxyData.positions.length / 3}
            array={galaxyData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={galaxyData.colors.length / 3}
            array={galaxyData.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={galaxyData.sizes.length}
            array={galaxyData.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.008}
          vertexColors
          transparent
          opacity={isDarkMode ? 1 : 0.8}
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Dust lanes */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={dustData.positions.length / 3}
            array={dustData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={dustData.colors.length / 3}
            array={dustData.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.3}
          sizeAttenuation={true}
          blending={THREE.MultiplyBlending}
          depthWrite={false}
        />
      </points>

      {/* Galactic center */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={isDarkMode ? '#ffaa00' : '#ff8800'}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}

// Main realistic space scene
function RealisticSpaceScene() {
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
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 100,
        -200 - Math.random() * 150
      ],
      velocity: [
        (Math.random() - 0.5) * 0.15,
        (Math.random() - 0.5) * 0.08,
        Math.random() * 1.5 + 0.8
      ],
      size: Math.random() * 0.6 + 0.8
    }));
  }, []);

  const asteroids = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 120,
        Math.random() * 30 + 40,
        (Math.random() - 0.5) * 100
      ],
      velocity: [
        (Math.random() - 0.5) * 0.08,
        -(Math.random() * 0.15 + 0.15),
        (Math.random() - 0.5) * 0.05
      ],
      size: Math.random() * 0.8 + 0.3
    }));
  }, []);

  return (
    <>
      {/* Professional lighting setup */}
      <ambientLight intensity={0.005} color="#000011" />
      
      {/* Key light from galactic center */}
      <pointLight 
        position={[0, 0, -119]} 
        intensity={4} 
        color="#ffaa00" 
        decay={2}
        distance={80}
      />
      
      {/* Rim lighting */}
      <directionalLight 
        position={[100, 50, 100]} 
        intensity={0.2}
        color="#4488ff"
        castShadow={false}
      />
      
      {/* Galaxy system */}
      <RealisticGalaxySystem isDarkMode={isDarkMode} />
      
      {/* Deep space environment */}
      <Stars
        radius={800}
        depth={200}
        count={12000}
        factor={8}
        saturation={0}
        fade={true}
        speed={0.005}
      />
      
      {/* Distant nebula sparkles */}
      <Sparkles
        count={500}
        scale={[200, 50, 200]}
        size={2}
        speed={0.1}
        color={isDarkMode ? "#ff6b6b" : "#4ecdc4"}
      />

      {/* Realistic spaceships */}
      {spaceships.map((ship) => (
        <RealisticSpaceship
          key={ship.id}
          position={ship.position}
          velocity={ship.velocity}
          size={ship.size}
          isDarkMode={isDarkMode}
        />
      ))}

      {/* Realistic asteroids */}
      {asteroids.map((asteroid) => (
        <RealisticAsteroid
          key={asteroid.id}
          position={asteroid.position}
          velocity={asteroid.velocity}
          size={asteroid.size}
        />
      ))}
    </>
  );
}

const RealisticSpace = () => {
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
      <Suspense fallback={null}>
        <Canvas
          camera={{ 
            position: [0, 8, 30],
            fov: 55,
            near: 0.1,
            far: 3000
          }}
          style={{ background: 'transparent' }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            precision: "highp",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2
          }}
          shadows
        >
          <RealisticSpaceScene />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default RealisticSpace;