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
      // Move directly towards user (positive Z direction)
      groupRef.current.position.z += velocity[2];
      
      // Keep ships aligned - moving straight towards user
      // groupRef.current.position.x += velocity[0] * 0.1;
      // groupRef.current.position.y += velocity[1] * 0.1;

      // Keep spaceships pointing forward (towards user) - same angle for all
      groupRef.current.rotation.x = 0;
      groupRef.current.rotation.y = 0;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3 + position[0] * 0.1) * 0.02; // Very slight roll

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
      }
    }
  });

  // Moebius-inspired color schemes
  const colorSchemes = [
    {
      hull: isDarkMode ? '#c0c0c0' : '#a0a0a0', // Silver/Grey - classic Moebius
      accent: isDarkMode ? '#ff6b35' : '#e55100', // Orange
      glow: isDarkMode ? '#4fc3f7' : '#0277bd' // Blue
    },
    {
      hull: isDarkMode ? '#8bc34a' : '#689f38', // Green
      accent: isDarkMode ? '#ffc107' : '#f57c00', // Yellow/Orange
      glow: isDarkMode ? '#e91e63' : '#c2185b' // Pink
    },
    {
      hull: isDarkMode ? '#2196f3' : '#1565c0', // Blue
      accent: isDarkMode ? '#ff5722' : '#d84315', // Deep Orange
      glow: isDarkMode ? '#9c27b0' : '#7b1fa2' // Purple
    }
  ];
  
  const colors = colorSchemes[shipType % colorSchemes.length];
  const hullColor = colors.hull;
  const accentColor = colors.accent;
  const glowColor = colors.glow;

  return (
    <group ref={groupRef} position={position}>
      {/* Main body - elongated Moebius style */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[size * 0.8, size * 0.6, size * 4]} />
        <meshBasicMaterial color={hullColor} />
      </mesh>
      
      {/* Front nose - angular wedge */}
      <mesh position={[0, 0, size * 2.5]}>
        <boxGeometry args={[size * 0.6, size * 0.4, size * 1]} />
        <meshBasicMaterial color={hullColor} />
      </mesh>
      
      {/* Cockpit canopy - large bubble */}
      <mesh ref={cockpitRef} position={[0, size * 0.4, size * 1.2]}>
        <sphereGeometry args={[size * 0.5, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
        <meshBasicMaterial 
          color={isDarkMode ? '#87ceeb' : '#4682b4'}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Side engine pods - Moebius characteristic */}
      <mesh position={[size * 1.2, 0, -size * 0.8]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[size * 0.2, size * 0.25, size * 2.5, 8]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>
      <mesh position={[-size * 1.2, 0, -size * 0.8]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[size * 0.2, size * 0.25, size * 2.5, 8]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>
      
      {/* Rear engine block */}
      <mesh position={[0, 0, -size * 2.5]}>
        <boxGeometry args={[size * 1, size * 0.8, size * 1.2]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>
      
      {/* Engine exhausts - rectangular Moebius style */}
      <group ref={engineRef} position={[0, 0, -size * 3.2]}>
        <mesh position={[size * 0.3, size * 0.2, 0]}>
          <boxGeometry args={[size * 0.2, size * 0.2, size * 0.4]} />
          <meshBasicMaterial 
            color="#ff6600" 
            transparent
            opacity={0.9}
          />
        </mesh>
        <mesh position={[-size * 0.3, size * 0.2, 0]}>
          <boxGeometry args={[size * 0.2, size * 0.2, size * 0.4]} />
          <meshBasicMaterial 
            color="#ff6600" 
            transparent
            opacity={0.9}
          />
        </mesh>
        <mesh position={[size * 0.3, -size * 0.2, 0]}>
          <boxGeometry args={[size * 0.2, size * 0.2, size * 0.4]} />
          <meshBasicMaterial 
            color="#ff6600" 
            transparent
            opacity={0.9}
          />
        </mesh>
        <mesh position={[-size * 0.3, -size * 0.2, 0]}>
          <boxGeometry args={[size * 0.2, size * 0.2, size * 0.4]} />
          <meshBasicMaterial 
            color="#ff6600" 
            transparent
            opacity={0.9}
          />
        </mesh>
      </group>
      
      {/* Side fins - angular Moebius design */}
      <mesh position={[size * 0.6, size * 0.4, -size * 1]} rotation={[Math.PI / 6, 0, Math.PI / 8]}>
        <boxGeometry args={[size * 1.8, size * 0.1, size * 0.8]} />
        <meshBasicMaterial color={glowColor} />
      </mesh>
      <mesh position={[-size * 0.6, size * 0.4, -size * 1]} rotation={[Math.PI / 6, 0, -Math.PI / 8]}>
        <boxGeometry args={[size * 1.8, size * 0.1, size * 0.8]} />
        <meshBasicMaterial color={glowColor} />
      </mesh>
      
      {/* Ventral fins */}
      <mesh position={[size * 0.4, -size * 0.4, -size * 0.5]} rotation={[-Math.PI / 8, 0, Math.PI / 12]}>
        <boxGeometry args={[size * 1.2, size * 0.08, size * 1.5]} />
        <meshBasicMaterial color={glowColor} />
      </mesh>
      <mesh position={[-size * 0.4, -size * 0.4, -size * 0.5]} rotation={[-Math.PI / 8, 0, -Math.PI / 12]}>
        <boxGeometry args={[size * 1.2, size * 0.08, size * 1.5]} />
        <meshBasicMaterial color={glowColor} />
      </mesh>
      
      {/* Sensor array - front details */}
      <mesh position={[0, size * 0.1, size * 3.2]}>
        <cylinderGeometry args={[size * 0.05, size * 0.05, size * 0.3, 6]} />
        <meshBasicMaterial color={glowColor} />
      </mesh>
      
      {/* Side detail panels */}
      <mesh position={[size * 0.45, 0, size * 0.5]}>
        <boxGeometry args={[size * 0.1, size * 0.4, size * 1.5]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>
      <mesh position={[-size * 0.45, 0, size * 0.5]}>
        <boxGeometry args={[size * 0.1, size * 0.4, size * 1.5]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>
      
      {/* Navigation lights - Moebius positioning */}
      <mesh position={[size * 0.2, size * 0.1, size * 3.4]}>
        <sphereGeometry args={[size * 0.04, 6, 6]} />
        <meshBasicMaterial color="#00ff88" />
      </mesh>
      <mesh position={[-size * 0.2, size * 0.1, size * 3.4]}>
        <sphereGeometry args={[size * 0.04, 6, 6]} />
        <meshBasicMaterial color="#ff4400" />
      </mesh>
      
      {/* Wing tip lights */}
      <mesh position={[size * 1.5, size * 0.4, -size * 0.6]}>
        <sphereGeometry args={[size * 0.03, 4, 4]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-size * 1.5, size * 0.4, -size * 0.6]}>
        <sphereGeometry args={[size * 0.03, 4, 4]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

// Moebius-style alien on superbike
function AlienBiker({ position = [0, 0, 0], velocity = [0, 0, 1], size = 1, isDarkMode = false, bikerType = 0 }) {
  const groupRef = useRef();
  const wheelRef1 = useRef();
  const wheelRef2 = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      // Move towards user
      groupRef.current.position.z += velocity[2];
      groupRef.current.position.x += velocity[0] * 0.05;
      groupRef.current.position.y += velocity[1] * 0.05;

      // Slight lean and banking
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4 + position[0] * 0.1) * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;

      // Wheel spinning
      if (wheelRef1.current) {
        wheelRef1.current.rotation.x += 0.3;
      }
      if (wheelRef2.current) {
        wheelRef2.current.rotation.x += 0.3;
      }

      // Reset when out of view
      if (groupRef.current.position.z > 80) {
        const newX = (Math.random() - 0.5) * 160;
        const newY = (Math.random() - 0.5) * 40;
        const newZ = -300 - Math.random() * 100;
        
        groupRef.current.position.set(newX, newY, newZ);
      }
    }
  });

  // Moebius alien color schemes
  const alienSchemes = [
    {
      skin: isDarkMode ? '#90ee90' : '#7cbd7c', // Green alien
      suit: isDarkMode ? '#4169e1' : '#2e5cb8', // Blue suit
      bike: isDarkMode ? '#ff4500' : '#d63900' // Orange bike
    },
    {
      skin: isDarkMode ? '#dda0dd' : '#b589b5', // Purple alien
      suit: isDarkMode ? '#ffd700' : '#ccaa00', // Gold suit
      bike: isDarkMode ? '#32cd32' : '#28a428' // Green bike
    },
    {
      skin: isDarkMode ? '#87ceeb' : '#6ba8cd', // Blue alien
      suit: isDarkMode ? '#ff6347' : '#cc472f', // Red suit
      bike: isDarkMode ? '#9370db' : '#7a5ab8' // Purple bike
    }
  ];
  
  const colors = alienSchemes[bikerType % alienSchemes.length];

  return (
    <group ref={groupRef} position={position}>
      {/* Superbike chassis */}
      <mesh position={[0, -size * 0.2, 0]}>
        <boxGeometry args={[size * 0.4, size * 0.3, size * 2.5]} />
        <meshBasicMaterial color={colors.bike} />
      </mesh>
      
      {/* Bike front fairing */}
      <mesh position={[0, 0, size * 1.5]} rotation={[Math.PI / 12, 0, 0]}>
        <boxGeometry args={[size * 0.6, size * 0.8, size * 0.8]} />
        <meshBasicMaterial color={colors.bike} />
      </mesh>
      
      {/* Front wheel */}
      <mesh ref={wheelRef1} position={[0, -size * 0.4, size * 1.8]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[size * 0.4, size * 0.4, size * 0.15, 12]} />
        <meshBasicMaterial color="#2c2c2c" />
      </mesh>
      
      {/* Rear wheel */}
      <mesh ref={wheelRef2} position={[0, -size * 0.4, -size * 1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[size * 0.45, size * 0.45, size * 0.18, 12]} />
        <meshBasicMaterial color="#2c2c2c" />
      </mesh>
      
      {/* Bike exhaust pipes */}
      <mesh position={[size * 0.3, -size * 0.1, -size * 0.8]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[size * 0.06, size * 0.06, size * 1.5, 8]} />
        <meshBasicMaterial color="#666666" />
      </mesh>
      <mesh position={[-size * 0.3, -size * 0.1, -size * 0.8]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[size * 0.06, size * 0.06, size * 1.5, 8]} />
        <meshBasicMaterial color="#666666" />
      </mesh>
      
      {/* Alien rider body */}
      <mesh position={[0, size * 0.2, size * 0.2]}>
        <boxGeometry args={[size * 0.6, size * 1, size * 0.4]} />
        <meshBasicMaterial color={colors.suit} />
      </mesh>
      
      {/* Alien head - elongated Moebius style */}
      <mesh position={[0, size * 0.9, size * 0.3]}>
        <sphereGeometry args={[size * 0.35, 8, 6]} />
        <meshBasicMaterial color={colors.skin} />
      </mesh>
      
      {/* Large alien eyes */}
      <mesh position={[size * 0.15, size * 0.95, size * 0.6]}>
        <sphereGeometry args={[size * 0.1, 6, 6]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[-size * 0.15, size * 0.95, size * 0.6]}>
        <sphereGeometry args={[size * 0.1, 6, 6]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Alien arms on handlebars */}
      <mesh position={[size * 0.4, size * 0.3, size * 0.8]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[size * 0.08, size * 0.08, size * 0.8, 8]} />
        <meshBasicMaterial color={colors.skin} />
      </mesh>
      <mesh position={[-size * 0.4, size * 0.3, size * 0.8]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[size * 0.08, size * 0.08, size * 0.8, 8]} />
        <meshBasicMaterial color={colors.skin} />
      </mesh>
      
      {/* Handlebars */}
      <mesh position={[0, size * 0.6, size * 1.2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[size * 0.03, size * 0.03, size * 0.8, 8]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      
      {/* Bike headlight */}
      <mesh position={[0, size * 0.1, size * 2.2]}>
        <sphereGeometry args={[size * 0.15, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
      
      {/* Engine glow */}
      <mesh position={[0, -size * 0.1, size * 0.5]}>
        <boxGeometry args={[size * 0.3, size * 0.2, size * 0.6]} />
        <meshBasicMaterial color="#ff4400" transparent opacity={0.7} />
      </mesh>
      
      {/* Alien antenna/helmet details */}
      <mesh position={[0, size * 1.2, size * 0.1]}>
        <cylinderGeometry args={[size * 0.02, size * 0.02, size * 0.3, 6]} />
        <meshBasicMaterial color={colors.suit} />
      </mesh>
      
      {/* Side exhaust flames */}
      <mesh position={[size * 0.8, -size * 0.1, -size * 1.2]}>
        <coneGeometry args={[size * 0.1, size * 0.4, 6]} />
        <meshBasicMaterial color="#ff6600" transparent opacity={0.8} />
      </mesh>
      <mesh position={[-size * 0.8, -size * 0.1, -size * 1.2]}>
        <coneGeometry args={[size * 0.1, size * 0.4, 6]} />
        <meshBasicMaterial color="#ff6600" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

// Moebius-style witch on broomstick
function WitchRider({ position = [0, 0, 0], velocity = [0, 0, 1], size = 1, isDarkMode = false, witchType = 0 }) {
  const groupRef = useRef();
  const capeRef = useRef();
  const sparkleRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      // Move towards user
      groupRef.current.position.z += velocity[2];
      groupRef.current.position.x += velocity[0] * 0.08;
      groupRef.current.position.y += velocity[1] * 0.08;

      // Magical undulating flight
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.6 + position[0] * 0.2) * 0.15;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
      groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.8 + position[1] * 0.3) * 0.02;

      // Cape flowing animation
      if (capeRef.current) {
        capeRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.2) * 0.3;
        capeRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.9) * 0.2;
      }

      // Magical sparkles rotation
      if (sparkleRef.current) {
        sparkleRef.current.rotation.y += 0.05;
        sparkleRef.current.rotation.x += 0.03;
      }

      // Reset when out of view
      if (groupRef.current.position.z > 90) {
        const newX = (Math.random() - 0.5) * 180;
        const newY = (Math.random() - 0.5) * 60 + 20;
        const newZ = -350 - Math.random() * 100;
        
        groupRef.current.position.set(newX, newY, newZ);
      }
    }
  });

  // Moebius witch color schemes
  const witchSchemes = [
    {
      skin: isDarkMode ? '#f5deb3' : '#deb887', // Pale skin
      robe: isDarkMode ? '#4b0082' : '#2f004f', // Deep purple
      hat: isDarkMode ? '#2c2c2c' : '#1a1a1a', // Dark grey/black
      broom: isDarkMode ? '#8b4513' : '#654321', // Brown
      magic: isDarkMode ? '#ff69b4' : '#ff1493' // Hot pink magic
    },
    {
      skin: isDarkMode ? '#8fbc8f' : '#6b8e6b', // Green-tinted skin
      robe: isDarkMode ? '#006400' : '#003300', // Dark green
      hat: isDarkMode ? '#654321' : '#4a2c17', // Brown
      broom: isDarkMode ? '#d2691e' : '#a0522d', // Orange-brown
      magic: isDarkMode ? '#00ff7f' : '#00cc66' // Green magic
    },
    {
      skin: isDarkMode ? '#dda0dd' : '#ba7dba', // Purplish skin
      robe: isDarkMode ? '#8b0000' : '#660000', // Dark red
      hat: isDarkMode ? '#191970' : '#0f0f47', // Midnight blue
      broom: isDarkMode ? '#daa520' : '#b8860b', // Golden brown
      magic: isDarkMode ? '#ffd700' : '#ccaa00' // Gold magic
    }
  ];
  
  const colors = witchSchemes[witchType % witchSchemes.length];

  return (
    <group ref={groupRef} position={position}>
      {/* Broomstick handle - rotated to point towards user */}
      <mesh position={[0, -size * 0.3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[size * 0.04, size * 0.04, size * 3.5, 8]} />
        <meshBasicMaterial color={colors.broom} />
      </mesh>
      
      {/* Broomstick bristles - moved to back and rotated */}
      <mesh position={[0, -size * 0.3, -size * 1.6]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[size * 0.2, size * 0.1, size * 0.8, 12]} />
        <meshBasicMaterial color={colors.broom} />
      </mesh>
      
      {/* Individual bristle strands */}
      {[...Array(8)].map((_, i) => (
        <mesh 
          key={i} 
          position={[
            (Math.random() - 0.5) * size * 0.3,
            -size * 0.3 + (Math.random() - 0.5) * size * 0.4, 
            -size * (1.8 + Math.random() * 0.3)
          ]} 
          rotation={[0, Math.PI / 2, 0]}
        >
          <cylinderGeometry args={[size * 0.01, size * 0.01, size * 0.4, 4]} />
          <meshBasicMaterial color={colors.broom} />
        </mesh>
      ))}
      
      {/* Witch body */}
      <mesh position={[size * 0.2, size * 0.1, 0]}>
        <boxGeometry args={[size * 0.5, size * 1.2, size * 0.4]} />
        <meshBasicMaterial color={colors.robe} />
      </mesh>
      
      {/* Witch head */}
      <mesh position={[size * 0.2, size * 0.8, size * 0.1]}>
        <sphereGeometry args={[size * 0.25, 8, 8]} />
        <meshBasicMaterial color={colors.skin} />
      </mesh>
      
      {/* Witch hat */}
      <mesh position={[size * 0.2, size * 1.2, size * 0.1]} rotation={[Math.PI / 12, 0, 0]}>
        <coneGeometry args={[size * 0.3, size * 0.8, 8]} />
        <meshBasicMaterial color={colors.hat} />
      </mesh>
      
      {/* Hat brim */}
      <mesh position={[size * 0.2, size * 0.9, size * 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[size * 0.4, size * 0.4, size * 0.05, 12]} />
        <meshBasicMaterial color={colors.hat} />
      </mesh>
      
      {/* Witch cape - flowing */}
      <mesh ref={capeRef} position={[size * 0.1, size * 0.1, -size * 0.3]} rotation={[0, 0, Math.PI / 16]}>
        <boxGeometry args={[size * 0.8, size * 1.5, size * 0.05]} />
        <meshBasicMaterial color={colors.robe} />
      </mesh>
      
      {/* Witch arms holding broom */}
      <mesh position={[size * 0.3, size * 0.3, size * 0.6]} rotation={[Math.PI / 6, 0, -Math.PI / 6]}>
        <cylinderGeometry args={[size * 0.06, size * 0.06, size * 0.6, 8]} />
        <meshBasicMaterial color={colors.skin} />
      </mesh>
      <mesh position={[-size * 0.2, size * 0.2, -size * 0.4]} rotation={[-Math.PI / 8, 0, Math.PI / 8]}>
        <cylinderGeometry args={[size * 0.06, size * 0.06, size * 0.5, 8]} />
        <meshBasicMaterial color={colors.skin} />
      </mesh>
      
      {/* Witch legs */}
      <mesh position={[size * 0.1, -size * 0.4, size * 0.1]}>
        <cylinderGeometry args={[size * 0.08, size * 0.08, size * 0.8, 8]} />
        <meshBasicMaterial color={colors.skin} />
      </mesh>
      <mesh position={[size * 0.3, -size * 0.4, -size * 0.1]}>
        <cylinderGeometry args={[size * 0.08, size * 0.08, size * 0.8, 8]} />
        <meshBasicMaterial color={colors.skin} />
      </mesh>
      
      {/* Pointed witch boots */}
      <mesh position={[size * 0.1, -size * 0.9, size * 0.2]} rotation={[Math.PI / 6, 0, 0]}>
        <boxGeometry args={[size * 0.15, size * 0.1, size * 0.4]} />
        <meshBasicMaterial color={colors.hat} />
      </mesh>
      <mesh position={[size * 0.3, -size * 0.9, size * 0.1]} rotation={[Math.PI / 6, 0, 0]}>
        <boxGeometry args={[size * 0.15, size * 0.1, size * 0.4]} />
        <meshBasicMaterial color={colors.hat} />
      </mesh>
      
      {/* Magical sparkles around witch */}
      <group ref={sparkleRef} position={[size * 0.2, size * 0.5, 0]}>
        {[...Array(6)].map((_, i) => (
          <mesh 
            key={i} 
            position={[
              Math.cos(i * Math.PI / 3) * size * 0.8,
              Math.sin(i * Math.PI / 3) * size * 0.8,
              Math.sin(i * Math.PI / 2) * size * 0.5
            ]}
          >
            <sphereGeometry args={[size * 0.03, 6, 6]} />
            <meshBasicMaterial color={colors.magic} transparent opacity={0.8} />
          </mesh>
        ))}
      </group>
      
      {/* Magical trail behind broomstick */}
      <mesh position={[0, -size * 0.3, -size * 2.2]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[size * 0.15, size * 0.6, 6]} />
        <meshBasicMaterial color={colors.magic} transparent opacity={0.6} />
      </mesh>
      
      {/* Witch's familiar - small bat */}
      <mesh position={[size * 1, size * 1.2, size * 0.5]} rotation={[0, Math.PI, 0]}>
        <sphereGeometry args={[size * 0.08, 6, 6]} />
        <meshBasicMaterial color="#2c2c2c" />
      </mesh>
      
      {/* Bat wings */}
      <mesh position={[size * 0.9, size * 1.2, size * 0.4]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[size * 0.3, size * 0.02, size * 0.15]} />
        <meshBasicMaterial color="#2c2c2c" />
      </mesh>
      <mesh position={[size * 1.1, size * 1.2, size * 0.4]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[size * 0.3, size * 0.02, size * 0.15]} />
        <meshBasicMaterial color="#2c2c2c" />
      </mesh>
    </group>
  );
}

// Moebius-style Aladdin on magic carpet
function AladdinRider({ position = [0, 0, 0], velocity = [0, 0, 1], size = 1, isDarkMode = false, aladdinType = 0 }) {
  const groupRef = useRef();
  const carpetRef = useRef();
  const tasselsRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      // Move towards user
      groupRef.current.position.z += velocity[2];
      groupRef.current.position.x += velocity[0] * 0.06;
      groupRef.current.position.y += velocity[1] * 0.06;

      // Magical carpet undulation
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + position[0] * 0.15) * 0.12;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.35) * 0.08;
      groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.7 + position[1] * 0.25) * 0.03;

      // Carpet ripple animation
      if (carpetRef.current) {
        carpetRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
        carpetRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.1) * 0.05;
      }

      // Tassels swaying
      if (tasselsRef.current) {
        tasselsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.3;
        tasselsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.8) * 0.2;
      }

      // Reset when out of view
      if (groupRef.current.position.z > 95) {
        const newX = (Math.random() - 0.5) * 170;
        const newY = (Math.random() - 0.5) * 50 + 25;
        const newZ = -380 - Math.random() * 120;
        
        groupRef.current.position.set(newX, newY, newZ);
      }
    }
  });

  // Moebius Aladdin color schemes
  const aladdinSchemes = [
    {
      skin: isDarkMode ? '#deb887' : '#d2b48c', // Tan skin
      vest: isDarkMode ? '#4169e1' : '#1e3a8a', // Blue vest
      pants: isDarkMode ? '#ffffff' : '#f0f0f0', // White pants
      turban: isDarkMode ? '#ffd700' : '#daa520', // Gold turban
      carpet: isDarkMode ? '#8b0000' : '#660000', // Deep red carpet
      pattern: isDarkMode ? '#ffd700' : '#daa520' // Gold patterns
    },
    {
      skin: isDarkMode ? '#cd853f' : '#a0522d', // Darker tan
      vest: isDarkMode ? '#006400' : '#004000', // Green vest  
      pants: isDarkMode ? '#f5f5dc' : '#e5e5d0', // Beige pants
      turban: isDarkMode ? '#ff6347' : '#cc472f', // Orange turban
      carpet: isDarkMode ? '#4b0082' : '#2f004f', // Purple carpet
      pattern: isDarkMode ? '#ff6347' : '#cc472f' // Orange patterns
    },
    {
      skin: isDarkMode ? '#f4a460' : '#daa520', // Golden tan
      vest: isDarkMode ? '#8b0000' : '#660000', // Red vest
      pants: isDarkMode ? '#fffaf0' : '#ede8dc', // Cream pants
      turban: isDarkMode ? '#20b2aa' : '#008b8b', // Teal turban
      carpet: isDarkMode ? '#ff8c00' : '#cc7000', // Orange carpet
      pattern: isDarkMode ? '#20b2aa' : '#008b8b' // Teal patterns
    }
  ];
  
  const colors = aladdinSchemes[aladdinType % aladdinSchemes.length];

  return (
    <group ref={groupRef} position={position}>
      {/* Magic carpet base */}
      <mesh ref={carpetRef} position={[0, -size * 0.2, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[size * 3, size * 0.08, size * 2]} />
        <meshBasicMaterial color={colors.carpet} />
      </mesh>
      
      {/* Carpet pattern stripes */}
      <mesh position={[0, -size * 0.15, size * 0.3]}>
        <boxGeometry args={[size * 2.8, size * 0.02, size * 0.2]} />
        <meshBasicMaterial color={colors.pattern} />
      </mesh>
      <mesh position={[0, -size * 0.15, -size * 0.3]}>
        <boxGeometry args={[size * 2.8, size * 0.02, size * 0.2]} />
        <meshBasicMaterial color={colors.pattern} />
      </mesh>
      <mesh position={[size * 0.8, -size * 0.15, 0]}>
        <boxGeometry args={[size * 0.2, size * 0.02, size * 1.8]} />
        <meshBasicMaterial color={colors.pattern} />
      </mesh>
      <mesh position={[-size * 0.8, -size * 0.15, 0]}>
        <boxGeometry args={[size * 0.2, size * 0.02, size * 1.8]} />
        <meshBasicMaterial color={colors.pattern} />
      </mesh>
      
      {/* Carpet tassels */}
      <group ref={tasselsRef}>
        {[...Array(8)].map((_, i) => (
          <mesh 
            key={i} 
            position={[
              size * (1.6 - i * 0.2), 
              -size * 0.4, 
              size * (i % 2 === 0 ? 1.1 : -1.1)
            ]}
          >
            <cylinderGeometry args={[size * 0.02, size * 0.02, size * 0.3, 6]} />
            <meshBasicMaterial color={colors.pattern} />
          </mesh>
        ))}
      </group>
      
      {/* Aladdin body */}
      <mesh position={[0, size * 0.2, size * 0.1]}>
        <boxGeometry args={[size * 0.4, size * 0.8, size * 0.3]} />
        <meshBasicMaterial color={colors.vest} />
      </mesh>
      
      {/* Aladdin head */}
      <mesh position={[0, size * 0.7, size * 0.15]}>
        <sphereGeometry args={[size * 0.2, 8, 8]} />
        <meshBasicMaterial color={colors.skin} />
      </mesh>
      
      {/* Aladdin turban */}
      <mesh position={[0, size * 0.85, size * 0.1]} rotation={[Math.PI / 8, 0, 0]}>
        <sphereGeometry args={[size * 0.25, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.8]} />
        <meshBasicMaterial color={colors.turban} />
      </mesh>
      
      {/* Turban jewel */}
      <mesh position={[0, size * 0.9, size * 0.3]}>
        <sphereGeometry args={[size * 0.05, 6, 6]} />
        <meshBasicMaterial color="#ff1493" />
      </mesh>
      
      {/* Aladdin pants */}
      <mesh position={[0, -size * 0.1, size * 0.1]}>
        <boxGeometry args={[size * 0.5, size * 0.6, size * 0.4]} />
        <meshBasicMaterial color={colors.pants} />
      </mesh>
      
      {/* Aladdin arms */}
      <mesh position={[size * 0.35, size * 0.3, size * 0.2]} rotation={[0, Math.PI / 6, -Math.PI / 8]}>
        <cylinderGeometry args={[size * 0.06, size * 0.06, size * 0.5, 8]} />
        <meshBasicMaterial color={colors.skin} />
      </mesh>
      <mesh position={[-size * 0.35, size * 0.3, size * 0.2]} rotation={[0, -Math.PI / 6, Math.PI / 8]}>
        <cylinderGeometry args={[size * 0.06, size * 0.06, size * 0.5, 8]} />
        <meshBasicMaterial color={colors.skin} />
      </mesh>
      
      {/* Aladdin legs - sitting position */}
      <mesh position={[size * 0.15, -size * 0.4, size * 0.3]} rotation={[Math.PI / 3, 0, 0]}>
        <cylinderGeometry args={[size * 0.08, size * 0.08, size * 0.6, 8]} />
        <meshBasicMaterial color={colors.skin} />
      </mesh>
      <mesh position={[-size * 0.15, -size * 0.4, size * 0.3]} rotation={[Math.PI / 3, 0, 0]}>
        <cylinderGeometry args={[size * 0.08, size * 0.08, size * 0.6, 8]} />
        <meshBasicMaterial color={colors.skin} />
      </mesh>
      
      {/* Pointed shoes */}
      <mesh position={[size * 0.15, -size * 0.6, size * 0.7]} rotation={[Math.PI / 6, 0, 0]}>
        <boxGeometry args={[size * 0.12, size * 0.08, size * 0.3]} />
        <meshBasicMaterial color={colors.turban} />
      </mesh>
      <mesh position={[-size * 0.15, -size * 0.6, size * 0.7]} rotation={[Math.PI / 6, 0, 0]}>
        <boxGeometry args={[size * 0.12, size * 0.08, size * 0.3]} />
        <meshBasicMaterial color={colors.turban} />
      </mesh>
      
      {/* Magic lamp */}
      <mesh position={[size * 0.5, size * 0.1, size * 0.3]}>
        <sphereGeometry args={[size * 0.08, 8, 6]} />
        <meshBasicMaterial color="#ffd700" />
      </mesh>
      
      {/* Lamp spout */}
      <mesh position={[size * 0.55, size * 0.1, size * 0.4]} rotation={[0, Math.PI / 4, 0]}>
        <cylinderGeometry args={[size * 0.02, size * 0.03, size * 0.15, 6]} />
        <meshBasicMaterial color="#ffd700" />
      </mesh>
      
      {/* Magic sparkles around carpet */}
      <group position={[0, size * 0.1, 0]}>
        {[...Array(12)].map((_, i) => (
          <mesh 
            key={i} 
            position={[
              Math.cos(i * Math.PI / 6) * size * 1.8,
              Math.sin(i * Math.PI / 4) * size * 0.3,
              Math.sin(i * Math.PI / 3) * size * 1.2
            ]}
          >
            <sphereGeometry args={[size * 0.02, 4, 4]} />
            <meshBasicMaterial color="#ffd700" transparent opacity={0.7} />
          </mesh>
        ))}
      </group>
      
      {/* Magic trail behind carpet */}
      <mesh position={[0, -size * 0.3, -size * 1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[size * 0.2, size * 0.8, 8]} />
        <meshBasicMaterial color="#ffd700" transparent opacity={0.5} />
      </mesh>
      
      {/* Abu the monkey */}
      <mesh position={[-size * 0.8, size * 0.4, size * 0.2]}>
        <sphereGeometry args={[size * 0.12, 6, 6]} />
        <meshBasicMaterial color="#8B4513" />
      </mesh>
      
      {/* Abu's tail */}
      <mesh position={[-size * 0.9, size * 0.3, size * 0.1]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[size * 0.02, size * 0.03, size * 0.4, 6]} />
        <meshBasicMaterial color="#8B4513" />
      </mesh>
      
      {/* Abu's vest */}
      <mesh position={[-size * 0.8, size * 0.35, size * 0.25]}>
        <boxGeometry args={[size * 0.08, size * 0.15, size * 0.06]} />
        <meshBasicMaterial color="#FF6347" />
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
        0, // No X movement - straight towards user
        0, // No Y movement - straight towards user  
        0.8 // Slower forward speed for all ships
      ],
      size: Math.random() * 0.4 + 0.8,
      type: i % 3 // Different ship types for variety
    }));
  }, []);

  const asteroids = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => ({
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

  const alienBikers = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 140,
        (Math.random() - 0.5) * 30,
        -250 - i * 100 - Math.random() * 80 // Stagger initial positions
      ],
      velocity: [
        (Math.random() - 0.5) * 0.08,
        (Math.random() - 0.5) * 0.04,
        0.9 // Slower forward movement
      ],
      size: Math.random() * 0.3 + 0.8,
      type: i % 3 // Different alien types
    }));
  }, []);

  const witches = useMemo(() => {
    return Array.from({ length: 2 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 160,
        (Math.random() - 0.5) * 40 + 30, // Higher altitude for witches
        -400 - i * 120 - Math.random() * 100 // Far back initial positions
      ],
      velocity: [
        (Math.random() - 0.5) * 0.08,
        (Math.random() - 0.5) * 0.05,
        0.7 // Slower magical steady flight
      ],
      size: Math.random() * 0.4 + 1.6, // Much bigger size
      type: i % 3 // Different witch types
    }));
  }, []);

  const aladdin = useMemo(() => {
    return Array.from({ length: 2 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() < 0.5 ? -1 : 1) * (120 + Math.random() * 80), // Spawn from far left/right edges
        (Math.random() - 0.5) * 35 + 25, // Medium altitude for carpet rides
        -450 - i * 130 - Math.random() * 120 // Farthest back positions for magical entrance
      ],
      velocity: [
        (Math.random() - 0.5) * 0.06,
        (Math.random() - 0.5) * 0.04,
        0.6 // Slower smooth magic carpet gliding speed
      ],
      size: Math.random() * 0.3 + 1.2, // Good size for magic carpet
      type: i % 3 // Different Aladdin color schemes
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

      {/* Alien Bikers */}
      {alienBikers.map((biker) => (
        <AlienBiker
          key={`biker-${biker.id}`}
          position={biker.position}
          velocity={biker.velocity}
          size={biker.size}
          isDarkMode={isDarkMode}
          bikerType={biker.type}
        />
      ))}

      {/* Witches on Broomsticks */}
      {witches.map((witch) => (
        <WitchRider
          key={`witch-${witch.id}`}
          position={witch.position}
          velocity={witch.velocity}
          size={witch.size}
          isDarkMode={isDarkMode}
          witchType={witch.type}
        />
      ))}

      {/* Aladdin on Magic Carpet */}
      {aladdin.map((rider) => (
        <AladdinRider
          key={`aladdin-${rider.id}`}
          position={rider.position}
          velocity={rider.velocity}
          size={rider.size}
          isDarkMode={isDarkMode}
          aladdinType={rider.type}
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