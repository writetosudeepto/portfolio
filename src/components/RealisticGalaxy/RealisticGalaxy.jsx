import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

// Realistic Galaxy with proper spiral arms and stellar distribution
function RealisticGalaxySystem({ isDarkMode = false }) {
  const galaxyRef = useRef();
  const centerRef = useRef();
  const dustRef = useRef();

  // Galaxy parameters based on real Milky Way structure
  const parameters = {
    count: 100000,           // Number of stars
    size: 0.005,            // Star size
    radius: 15,             // Galaxy radius
    branches: 4,            // Spiral arms (like Milky Way)
    spin: 1,                // How much the arms spiral
    randomness: 0.5,        // Star distribution randomness
    randomnessPower: 3,     // Concentration towards arms
    insideColor: '#ff6030', // Center color (hot stars)
    outsideColor: '#1b3984' // Edge color (cooler stars)
  };

  // Create galaxy geometry with realistic stellar distribution
  const [positions, colors, scales] = useMemo(() => {
    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);
    const scales = new Float32Array(parameters.count);

    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    for (let i = 0; i < parameters.count; i++) {
      const i3 = i * 3;

      // Position calculation for spiral arms
      const radius = Math.random() * parameters.radius;
      const spinAngle = radius * parameters.spin;
      const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;

      const randomX = Math.pow(Math.random(), parameters.randomnessPower) * 
        (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
      const randomY = Math.pow(Math.random(), parameters.randomnessPower) * 
        (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius * 0.1;
      const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * 
        (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      // Color based on distance from center (realistic stellar evolution)
      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radius / parameters.radius);

      // Add stellar classification colors
      const stellarType = Math.random();
      if (stellarType < 0.76) {
        // Main sequence stars (red dwarfs) - most common
        mixedColor.lerp(new THREE.Color('#ff4500'), 0.3);
      } else if (stellarType < 0.9) {
        // Sun-like stars
        mixedColor.lerp(new THREE.Color('#fff8dc'), 0.4);
      } else if (stellarType < 0.98) {
        // Blue giants - rare but visible
        mixedColor.lerp(new THREE.Color('#87ceeb'), 0.6);
      } else {
        // White dwarfs and other exotic objects
        mixedColor.lerp(new THREE.Color('#ffffff'), 0.8);
      }

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;

      // Realistic star size distribution (most stars are small)
      if (stellarType < 0.76) {
        scales[i] = 0.5 + Math.random() * 0.5; // Small red dwarfs
      } else if (stellarType < 0.9) {
        scales[i] = 1.0 + Math.random() * 1.0; // Sun-like stars
      } else if (stellarType < 0.98) {
        scales[i] = 2.0 + Math.random() * 3.0; // Blue giants
      } else {
        scales[i] = 0.8 + Math.random() * 0.4; // White dwarfs
      }
    }

    return [positions, colors, scales];
  }, [parameters]);

  // Create galactic center (supermassive black hole region)
  const centerGeometry = useMemo(() => {
    const geometry = new THREE.SphereGeometry(0.2, 32, 32);
    return geometry;
  }, []);

  // Create dust lanes using particle system
  const dustLanes = useMemo(() => {
    const count = 50000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Create dust concentrated in spiral arms
      const radius = 2 + Math.random() * 12;
      const angle = Math.random() * Math.PI * 2;
      const spiralOffset = radius * 0.3;
      
      positions[i3] = Math.cos(angle + spiralOffset) * radius + (Math.random() - 0.5) * 2;
      positions[i3 + 1] = (Math.random() - 0.5) * 0.1; // Thin disk
      positions[i3 + 2] = Math.sin(angle + spiralOffset) * radius + (Math.random() - 0.5) * 2;
      
      // Dust color - reddish brown
      const dustColor = isDarkMode ? 
        new THREE.Color('#8b4513').multiplyScalar(0.6) :
        new THREE.Color('#4a2c2a').multiplyScalar(0.8);
        
      colors[i3] = dustColor.r;
      colors[i3 + 1] = dustColor.g;
      colors[i3 + 2] = dustColor.b;
    }
    
    return [positions, colors];
  }, [isDarkMode]);

  // Animation
  useFrame((state) => {
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y = state.clock.elapsedTime * 0.00002; // Very slow rotation
    }
    
    if (centerRef.current) {
      // Pulsing galactic center
      centerRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.1);
    }
    
    if (dustRef.current) {
      dustRef.current.rotation.y = state.clock.elapsedTime * 0.000015; // Slower than stars
    }
  });

  return (
    <group position={[0, 0, -50]}>
      {/* Main galaxy spiral arms */}
      <points ref={galaxyRef}>
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
            attach="attributes-scale"
            count={scales.length}
            array={scales}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={parameters.size}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors={true}
          transparent={true}
          opacity={isDarkMode ? 0.8 : 0.6}
        />
      </points>

      {/* Galactic center (Sagittarius A*) */}
      <mesh ref={centerRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial
          color={isDarkMode ? '#ff6b00' : '#ff4500'}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Accretion disk around galactic center */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 1.2, 64]} />
        <meshBasicMaterial
          color={isDarkMode ? '#ff4500' : '#ff6600'}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Dust lanes */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={dustLanes[0].length / 3}
            array={dustLanes[0]}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={dustLanes[1].length / 3}
            array={dustLanes[1]}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.003}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.SubtractiveBlending}
          vertexColors={true}
          transparent={true}
          opacity={isDarkMode ? 0.3 : 0.5}
        />
      </points>

      {/* Galactic halo - diffuse light */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[25, 32, 32]} />
        <meshBasicMaterial
          color={isDarkMode ? '#4a0e4e' : '#2a1810'}
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// Realistic Spaceship with 3D geometry
function Spaceship({ position, velocity, size, isDarkMode, shipType = 'fighter' }) {
  const shipRef = useRef();
  const engineRef = useRef();
  const [engineFlicker, setEngineFlicker] = useState(1);


  useFrame((state) => {
    if (shipRef.current) {
      // Move along Z-axis (towards/away from camera)
      shipRef.current.position.z += velocity[2];
      shipRef.current.position.x += velocity[0];
      shipRef.current.position.y += velocity[1];

      // Subtle banking animation
      shipRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      
      // Engine flicker effect
      setEngineFlicker(0.7 + Math.random() * 0.3);

      // Reset ship when it moves too far
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
        {shipType === 'fighter' ? (
          <cylinderGeometry args={[size * 0.3, size * 0.1, size * 3, 8]} />
        ) : shipType === 'cruiser' ? (
          <boxGeometry args={[size * 1.5, size * 0.8, size * 4]} />
        ) : (
          <coneGeometry args={[size * 0.4, size * 2, 6]} />
        )}
        <meshStandardMaterial
          color={isDarkMode ? '#4a90e2' : '#2c3e50'}
          metalness={0.8}
          roughness={0.2}
          emissive={isDarkMode ? '#001122' : '#111111'}
        />
      </mesh>

      {/* Wings */}
      <mesh>
        {shipType === 'fighter' ? (
          <boxGeometry args={[size * 2, size * 0.2, size * 0.8]} />
        ) : shipType === 'cruiser' ? (
          <boxGeometry args={[size * 3, size * 0.3, size * 1.2]} />
        ) : (
          <boxGeometry args={[size * 1.2, size * 0.15, size * 0.6]} />
        )}
        <meshStandardMaterial
          color={isDarkMode ? '#5dade2' : '#34495e'}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Cockpit */}
      <mesh position={[0, 0, size * 1.2]}>
        {shipType === 'fighter' ? (
          <sphereGeometry args={[size * 0.4, 8, 8]} />
        ) : shipType === 'cruiser' ? (
          <coneGeometry args={[size * 0.6, size * 0.8, 6]} />
        ) : (
          <sphereGeometry args={[size * 0.25, 6, 6]} />
        )}
        <meshBasicMaterial
          color={isDarkMode ? '#00ffff' : '#3498db'}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Engine glow */}
      <mesh ref={engineRef} position={[0, 0, -size * 1.5]}>
        <cylinderGeometry args={[size * 0.2, size * 0.1, size * 0.5, 6]} />
        <meshBasicMaterial
          color={isDarkMode ? '#ff6b00' : '#e74c3c'}
          transparent
          opacity={engineFlicker}
          emissive={isDarkMode ? '#ff4500' : '#c0392b'}
        />
      </mesh>

      {/* Navigation lights */}
      <mesh position={[size * 0.8, 0, 0]}>
        <sphereGeometry args={[size * 0.05, 4, 4]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <mesh position={[-size * 0.8, 0, 0]}>
        <sphereGeometry args={[size * 0.05, 4, 4]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>

      {/* Engine trail particles */}
      <points position={[0, 0, -size * 2]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={20}
            array={new Float32Array(Array.from({ length: 60 }, () => (Math.random() - 0.5) * size * 0.5))}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={size * 0.1}
          color={isDarkMode ? '#ff6600' : '#e74c3c'}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// Realistic meteors with proper physics
function RealisticMeteor({ position, velocity, size, isDarkMode }) {
  const meteorRef = useRef();
  const trailRef = useRef();
  const [trailPoints, setTrailPoints] = useState([]);

  useFrame(() => {
    if (meteorRef.current) {
      // Update position with realistic physics
      meteorRef.current.position.x += velocity[0];
      meteorRef.current.position.y += velocity[1];
      meteorRef.current.position.z += velocity[2];

      // Add gravitational acceleration (towards center)
      velocity[1] -= 0.001;

      // Rotation for realism
      meteorRef.current.rotation.x += 0.02;
      meteorRef.current.rotation.y += 0.03;

      // Update trail
      const currentPos = meteorRef.current.position.clone();
      const newTrail = [currentPos, ...trailPoints.slice(0, 19)];
      setTrailPoints(newTrail);

      // Reset when off screen
      if (meteorRef.current.position.y < -30 || 
          Math.abs(meteorRef.current.position.x) > 50) {
        meteorRef.current.position.set(
          (Math.random() - 0.5) * 60,
          Math.random() * 10 + 20,
          (Math.random() - 0.5) * 40
        );
        velocity[0] = (Math.random() - 0.5) * 0.4;
        velocity[1] = -(Math.random() * 0.3 + 0.2);
        velocity[2] = (Math.random() - 0.5) * 0.2;
        setTrailPoints([]);
      }
    }
  });

  return (
    <group>
      {/* Meteor body */}
      <mesh ref={meteorRef} position={position}>
        <dodecahedronGeometry args={[size]} />
        <meshStandardMaterial
          color={isDarkMode ? '#ff6b35' : '#8b4513'}
          emissive={isDarkMode ? '#ff4500' : '#654321'}
          emissiveIntensity={0.6}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Glowing plasma trail */}
      {trailPoints.length > 1 && (
        <mesh>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={trailPoints.length}
              array={new Float32Array(trailPoints.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={size * 2}
            color={isDarkMode ? '#ff6600' : '#ff4500'}
            transparent
            opacity={0.7}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  );
}

// Main realistic galaxy scene
function RealisticGalaxyScene() {
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  // Generate meteors
  const meteors = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 60,
        Math.random() * 10 + 20,
        (Math.random() - 0.5) * 40
      ],
      velocity: [
        (Math.random() - 0.5) * 0.4,
        -(Math.random() * 0.3 + 0.2),
        (Math.random() - 0.5) * 0.2
      ],
      size: Math.random() * 0.15 + 0.05
    }));
  }, []);

  // Generate spaceships moving along Z-axis
  const spaceships = useMemo(() => {
    const shipTypes = ['fighter', 'cruiser', 'scout'];
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 50,
        -80 - Math.random() * 40
      ],
      velocity: [
        (Math.random() - 0.5) * 0.1,  // Slight X movement
        (Math.random() - 0.5) * 0.05, // Slight Y movement
        Math.random() * 0.8 + 0.3      // Main Z movement (towards camera)
      ],
      size: Math.random() * 0.8 + 0.4,
      shipType: shipTypes[Math.floor(Math.random() * shipTypes.length)]
    }));
  }, []);

  return (
    <>
      {/* Realistic lighting for space */}
      <ambientLight intensity={0.05} color="#0a0a2e" />
      <pointLight 
        position={[0, 0, -49]} 
        intensity={2} 
        color="#ff6b00" 
        decay={2}
        distance={30}
      />
      
      {/* Main galaxy system */}
      <RealisticGalaxySystem isDarkMode={isDarkMode} />
      
      {/* Background stars for depth */}
      <Stars
        radius={400}
        depth={100}
        count={5000}
        factor={8}
        saturation={0}
        fade={true}
        speed={0.05}
      />
      
      {/* Realistic meteors */}
      {meteors.map((meteor) => (
        <RealisticMeteor
          key={meteor.id}
          position={meteor.position}
          velocity={meteor.velocity}
          size={meteor.size}
          isDarkMode={isDarkMode}
        />
      ))}
      
      {/* Spaceships moving along Z-axis */}
      {spaceships.map((ship) => (
        <Spaceship
          key={ship.id}
          position={ship.position}
          velocity={ship.velocity}
          size={ship.size}
          shipType={ship.shipType}
          isDarkMode={isDarkMode}
        />
      ))}
    </>
  );
}

const RealisticGalaxy = () => {
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
      >
        <RealisticGalaxyScene />
      </Canvas>
    </div>
  );
};

export default RealisticGalaxy;