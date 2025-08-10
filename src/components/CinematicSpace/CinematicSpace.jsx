import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

// Realistic Spaceship with detailed geometry and materials
function CinematicSpaceship({ position = [0, 0, 0], velocity = [0, 0, 0.5], size = 0.8, isDarkMode = false }) {
  const groupRef = useRef();
  const engineRef = useRef();
  const [time, setTime] = useState(0);


  useFrame((state) => {
    if (groupRef.current) {
      // Smooth movement along Z-axis
      groupRef.current.position.z += velocity[2];
      groupRef.current.position.x += velocity[0] * 0.1;
      groupRef.current.position.y += velocity[1] * 0.1;

      // Realistic flight dynamics
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      groupRef.current.rotation.x = velocity[1] * 0.2;
      
      // Engine pulse effect
      if (engineRef.current) {
        const pulse = Math.sin(state.clock.elapsedTime * 8) * 0.3 + 0.7;
        engineRef.current.scale.setScalar(pulse);
        // Update opacity for all child meshes
        engineRef.current.children.forEach(child => {
          if (child.material) {
            child.material.opacity = pulse;
          }
        });
      }

      // Reset when too far
      if (groupRef.current.position.z > 40 || groupRef.current.position.z < -150) {
        groupRef.current.position.set(
          (Math.random() - 0.5) * 120,
          (Math.random() - 0.5) * 60,
          -150 - Math.random() * 50
        );
      }
    }
    setTime(state.clock.elapsedTime);
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Main fuselage */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[size * 0.15, size * 0.4, size * 4, 12]} />
        <meshStandardMaterial
          color={isDarkMode ? '#2c3e50' : '#34495e'}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Nose cone */}
      <mesh position={[0, 0, size * 2.2]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[size * 0.15, size * 0.8, 8]} />
        <meshStandardMaterial
          color={isDarkMode ? '#2c3e50' : '#34495e'}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Main wings */}
      <mesh position={[0, 0, -size * 0.5]}>
        <boxGeometry args={[size * 4, size * 0.1, size * 1.2]} />
        <meshStandardMaterial
          color={isDarkMode ? '#2c3e50' : '#34495e'}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Wing tips */}
      <mesh position={[size * 1.8, 0, -size * 0.3]}>
        <boxGeometry args={[size * 0.4, size * 0.15, size * 0.8]} />
        <meshStandardMaterial
          color={isDarkMode ? '#2c3e50' : '#34495e'}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      <mesh position={[-size * 1.8, 0, -size * 0.3]}>
        <boxGeometry args={[size * 0.4, size * 0.15, size * 0.8]} />
        <meshStandardMaterial
          color={isDarkMode ? '#2c3e50' : '#34495e'}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Cockpit */}
      <mesh position={[0, size * 0.15, size * 1.2]}>
        <sphereGeometry args={[size * 0.25, 8, 6]} />
        <meshBasicMaterial
          color={isDarkMode ? '#00d4ff' : '#4169e1'}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Engine exhausts */}
      <group ref={engineRef} position={[0, 0, -size * 2.5]}>
        <mesh position={[size * 0.3, 0, 0]}>
          <cylinderGeometry args={[size * 0.12, size * 0.08, size * 0.6, 6]} />
          <meshBasicMaterial
            color="#0099ff"
            transparent
            opacity={0.8}
            emissive="#0066cc"
            emissiveIntensity={2}
          />
        </mesh>
        <mesh position={[-size * 0.3, 0, 0]}>
          <cylinderGeometry args={[size * 0.12, size * 0.08, size * 0.6, 6]} />
          <meshBasicMaterial
            color="#0099ff"
            transparent
            opacity={0.8}
            emissive="#0066cc"
            emissiveIntensity={2}
          />
        </mesh>
      </group>

      {/* Navigation lights */}
      <mesh position={[size * 2, 0, 0]}>
        <sphereGeometry args={[size * 0.03, 4, 4]} />
        <meshBasicMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={2} />
      </mesh>
      <mesh position={[-size * 2, 0, 0]}>
        <sphereGeometry args={[size * 0.03, 4, 4]} />
        <meshBasicMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={2} />
      </mesh>

      {/* Engine trail */}
      <points position={[0, 0, -size * 3]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={50}
            array={new Float32Array(Array.from({ length: 150 }, () => (Math.random() - 0.5) * size * 0.8))}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={size * 0.05}
          color="#0099ff"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// Realistic Galaxy with nebula effects
function CinematicGalaxy({ isDarkMode = false }) {
  const galaxyRef = useRef();
  const nebulaRef = useRef();

  // Create realistic galaxy with proper stellar distribution
  const [galaxyGeometry, nebulaGeometry] = useMemo(() => {
    const galaxyCount = 50000;
    const nebulaCount = 20000;
    
    const galaxyPositions = new Float32Array(galaxyCount * 3);
    const galaxyColors = new Float32Array(galaxyCount * 3);
    const galaxySizes = new Float32Array(galaxyCount);
    
    const nebulaPositions = new Float32Array(nebulaCount * 3);
    const nebulaColors = new Float32Array(nebulaCount * 3);

    // Galaxy stars
    for (let i = 0; i < galaxyCount; i++) {
      const radius = Math.pow(Math.random(), 0.6) * 25;
      const mixedAngle = Math.random() * Math.PI * 2;
      const spiralAngle = radius * 0.3;
      const finalAngle = mixedAngle + spiralAngle;

      galaxyPositions[i * 3] = Math.cos(finalAngle) * radius;
      galaxyPositions[i * 3 + 1] = (Math.random() - 0.5) * Math.pow(Math.random(), 2) * 2;
      galaxyPositions[i * 3 + 2] = Math.sin(finalAngle) * radius;

      // Realistic stellar colors
      const stellarClass = Math.random();
      if (stellarClass < 0.76) {
        // Red dwarfs (most common)
        galaxyColors[i * 3] = 1;
        galaxyColors[i * 3 + 1] = 0.3 + Math.random() * 0.2;
        galaxyColors[i * 3 + 2] = 0.1;
        galaxySizes[i] = 0.5 + Math.random() * 0.5;
      } else if (stellarClass < 0.9) {
        // Sun-like stars
        galaxyColors[i * 3] = 1;
        galaxyColors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
        galaxyColors[i * 3 + 2] = 0.7 + Math.random() * 0.2;
        galaxySizes[i] = 1 + Math.random();
      } else if (stellarClass < 0.98) {
        // Blue giants
        galaxyColors[i * 3] = 0.7 + Math.random() * 0.3;
        galaxyColors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
        galaxyColors[i * 3 + 2] = 1;
        galaxySizes[i] = 2 + Math.random() * 3;
      } else {
        // White dwarfs
        galaxyColors[i * 3] = 1;
        galaxyColors[i * 3 + 1] = 1;
        galaxyColors[i * 3 + 2] = 1;
        galaxySizes[i] = 0.3 + Math.random() * 0.4;
      }
    }

    // Nebula particles
    for (let i = 0; i < nebulaCount; i++) {
      const radius = Math.random() * 30;
      const angle = Math.random() * Math.PI * 2;
      
      nebulaPositions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 10;
      nebulaPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      nebulaPositions[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 10;

      // Nebula colors (reddish-purple)
      nebulaColors[i * 3] = isDarkMode ? 0.8 + Math.random() * 0.2 : 0.6;
      nebulaColors[i * 3 + 1] = 0.2 + Math.random() * 0.3;
      nebulaColors[i * 3 + 2] = isDarkMode ? 0.6 + Math.random() * 0.4 : 0.8;
    }

    return [
      { positions: galaxyPositions, colors: galaxyColors, sizes: galaxySizes },
      { positions: nebulaPositions, colors: nebulaColors }
    ];
  }, [isDarkMode]);

  useFrame((state) => {
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y = state.clock.elapsedTime * 0.00005;
    }
    if (nebulaRef.current) {
      nebulaRef.current.rotation.y = state.clock.elapsedTime * 0.00002;
    }
  });

  return (
    <group position={[0, 0, -80]}>
      {/* Main galaxy */}
      <points ref={galaxyRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={galaxyGeometry.positions.length / 3}
            array={galaxyGeometry.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={galaxyGeometry.colors.length / 3}
            array={galaxyGeometry.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={galaxyGeometry.sizes.length}
            array={galaxyGeometry.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.01}
          vertexColors
          transparent
          opacity={isDarkMode ? 0.9 : 0.7}
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Nebula */}
      <points ref={nebulaRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={nebulaGeometry.positions.length / 3}
            array={nebulaGeometry.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={nebulaGeometry.colors.length / 3}
            array={nebulaGeometry.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={isDarkMode ? 0.15 : 0.1}
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Central black hole glow */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial
          color={isDarkMode ? '#ff6b00' : '#ff8c00'}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

// Realistic asteroids instead of cartoonish meteors
function CinematicAsteroid({ position = [0, 0, 0], velocity = [0, -0.3, 0], size = 0.2, isDarkMode = false }) {
  const asteroidRef = useRef();

  // Create irregular asteroid geometry
  const asteroidGeometry = useMemo(() => {
    const geometry = new THREE.IcosahedronGeometry(size, 1);
    const positionAttribute = geometry.getAttribute('position');
    
    // Randomize vertices for irregular shape
    for (let i = 0; i < positionAttribute.count; i++) {
      const vertex = new THREE.Vector3();
      vertex.fromBufferAttribute(positionAttribute, i);
      vertex.multiplyScalar(0.8 + Math.random() * 0.4);
      positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    
    geometry.computeVertexNormals();
    return geometry;
  }, [size]);

  useFrame(() => {
    if (asteroidRef.current) {
      asteroidRef.current.position.x += velocity[0];
      asteroidRef.current.position.y += velocity[1];
      asteroidRef.current.position.z += velocity[2];

      asteroidRef.current.rotation.x += 0.01;
      asteroidRef.current.rotation.y += 0.015;
      asteroidRef.current.rotation.z += 0.008;

      // Reset when off screen
      if (asteroidRef.current.position.y < -40) {
        asteroidRef.current.position.set(
          (Math.random() - 0.5) * 80,
          Math.random() * 20 + 30,
          (Math.random() - 0.5) * 60
        );
      }
    }
  });

  return (
    <mesh ref={asteroidRef} position={position} geometry={asteroidGeometry}>
      <meshStandardMaterial
        color={isDarkMode ? '#4a4a4a' : '#2a2a2a'}
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  );
}

// Main cinematic scene
function CinematicSpaceScene() {
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
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 150,
        (Math.random() - 0.5) * 80,
        -150 - Math.random() * 100
      ],
      velocity: [
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.1,
        Math.random() * 1.2 + 0.5
      ],
      size: Math.random() * 0.4 + 0.6
    }));
  }, []);

  const asteroids = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 100,
        Math.random() * 20 + 30,
        (Math.random() - 0.5) * 80
      ],
      velocity: [
        (Math.random() - 0.5) * 0.15,
        -(Math.random() * 0.2 + 0.2),
        (Math.random() - 0.5) * 0.1
      ],
      size: Math.random() * 0.3 + 0.1
    }));
  }, []);

  return (
    <>
      {/* Cinematic lighting */}
      <ambientLight intensity={0.02} color="#0a0a2e" />
      <directionalLight 
        position={[50, 50, 50]} 
        intensity={0.4}
        color="#ffffff"
        castShadow={false}
      />
      <pointLight 
        position={[0, 0, -79]} 
        intensity={3} 
        color="#ff8c00" 
        decay={2}
        distance={50}
      />
      
      {/* Main galaxy */}
      <CinematicGalaxy isDarkMode={isDarkMode} />
      
      {/* Deep space stars */}
      <Stars
        radius={500}
        depth={150}
        count={8000}
        factor={6}
        saturation={0}
        fade={true}
        speed={0.02}
      />

      {/* Spaceships */}
      {spaceships.map((ship) => (
        <CinematicSpaceship
          key={ship.id}
          position={ship.position}
          velocity={ship.velocity}
          size={ship.size}
          isDarkMode={isDarkMode}
        />
      ))}

      {/* Asteroids */}
      {asteroids.map((asteroid) => (
        <CinematicAsteroid
          key={asteroid.id}
          position={asteroid.position}
          velocity={asteroid.velocity}
          size={asteroid.size}
          isDarkMode={isDarkMode}
        />
      ))}
    </>
  );
}

const CinematicSpace = () => {
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
          position: [0, 5, 25],
          fov: 60,
          near: 0.1,
          far: 2000
        }}
        style={{ background: 'transparent' }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          precision: "highp"
        }}
        shadows={false}
      >
        <CinematicSpaceScene />
      </Canvas>
    </div>
  );
};

export default CinematicSpace;