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

// Moebius-style monkey pizza delivery boy on scooter
function MonkeyPizzaDelivery({ position = [0, 0, 0], velocity = [0, 0, 1], size = 1, isDarkMode = false, monkeyType = 0 }) {
  const groupRef = useRef();
  const wheelRef = useRef();
  const pizzaBoxRef = useRef();
  const helmetRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      // Move towards user
      groupRef.current.position.z += velocity[2];
      groupRef.current.position.x += velocity[0] * 0.07;
      groupRef.current.position.y += velocity[1] * 0.07;

      // Scooter bouncing and leaning
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8 + position[0] * 0.2) * 0.08;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.04;
      groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 1.2 + position[1] * 0.4) * 0.015;

      // Front wheel spinning
      if (wheelRef.current) {
        wheelRef.current.rotation.x += 0.4;
      }

      // Pizza box slight bouncing
      if (pizzaBoxRef.current) {
        pizzaBoxRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.1;
        pizzaBoxRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
      }

      // Helmet slight bobbing
      if (helmetRef.current) {
        helmetRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.8) * 0.02;
      }

      // Reset when out of view
      if (groupRef.current.position.z > 85) {
        const newX = (Math.random() - 0.5) * 150;
        const newY = (Math.random() - 0.5) * 30;
        const newZ = -320 - Math.random() * 80;
        
        groupRef.current.position.set(newX, newY, newZ);
      }
    }
  });

  // Moebius monkey delivery color schemes
  const monkeySchemes = [
    {
      fur: isDarkMode ? '#8b4513' : '#654321', // Brown monkey
      uniform: isDarkMode ? '#ff0000' : '#cc0000', // Red delivery uniform
      scooter: isDarkMode ? '#0066cc' : '#004499', // Blue scooter
      helmet: isDarkMode ? '#ffffff' : '#f0f0f0', // White helmet
      pizza: isDarkMode ? '#ffaa00' : '#ff8800' // Pizza box orange
    },
    {
      fur: isDarkMode ? '#a0522d' : '#8b4513', // Darker brown
      uniform: isDarkMode ? '#00aa00' : '#008800', // Green uniform
      scooter: isDarkMode ? '#ff6600' : '#e55500', // Orange scooter
      helmet: isDarkMode ? '#ffff00' : '#dddd00', // Yellow helmet
      pizza: isDarkMode ? '#ff4444' : '#ee3333' // Red pizza box
    },
    {
      fur: isDarkMode ? '#cd853f' : '#a0522d', // Golden brown
      uniform: isDarkMode ? '#4b0082' : '#330055', // Purple uniform
      scooter: isDarkMode ? '#32cd32' : '#28a028', // Green scooter
      helmet: isDarkMode ? '#ff69b4' : '#e55a9f', // Pink helmet
      pizza: isDarkMode ? '#ffa500' : '#ff8c00' // Orange pizza box
    }
  ];
  
  const colors = monkeySchemes[monkeyType % monkeySchemes.length];

  return (
    <group ref={groupRef} position={position}>
      {/* Scooter base/deck */}
      <mesh position={[0, -size * 0.3, size * 0.2]}>
        <boxGeometry args={[size * 0.3, size * 0.1, size * 1.8]} />
        <meshBasicMaterial color={colors.scooter} />
      </mesh>
      
      {/* Scooter front stem */}
      <mesh position={[0, size * 0.2, size * 0.8]} rotation={[Math.PI / 12, 0, 0]}>
        <cylinderGeometry args={[size * 0.03, size * 0.03, size * 1, 8]} />
        <meshBasicMaterial color={colors.scooter} />
      </mesh>
      
      {/* Handlebars */}
      <mesh position={[0, size * 0.7, size * 1.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[size * 0.02, size * 0.02, size * 0.6, 8]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      
      {/* Front wheel */}
      <mesh ref={wheelRef} position={[0, -size * 0.4, size * 1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[size * 0.3, size * 0.3, size * 0.1, 12]} />
        <meshBasicMaterial color="#2c2c2c" />
      </mesh>
      
      {/* Rear wheel */}
      <mesh position={[0, -size * 0.4, -size * 0.8]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[size * 0.25, size * 0.25, size * 0.08, 12]} />
        <meshBasicMaterial color="#2c2c2c" />
      </mesh>
      
      {/* Scooter body/engine */}
      <mesh position={[0, -size * 0.1, size * 0.1]}>
        <boxGeometry args={[size * 0.4, size * 0.3, size * 0.8]} />
        <meshBasicMaterial color={colors.scooter} />
      </mesh>
      
      {/* Monkey body */}
      <mesh position={[0, size * 0.2, size * 0.1]}>
        <boxGeometry args={[size * 0.4, size * 0.8, size * 0.3]} />
        <meshBasicMaterial color={colors.uniform} />
      </mesh>
      
      {/* Monkey head */}
      <mesh position={[0, size * 0.7, size * 0.2]}>
        <sphereGeometry args={[size * 0.2, 8, 8]} />
        <meshBasicMaterial color={colors.fur} />
      </mesh>
      
      {/* Monkey snout */}
      <mesh position={[0, size * 0.65, size * 0.35]}>
        <sphereGeometry args={[size * 0.08, 6, 6]} />
        <meshBasicMaterial color={colors.fur} />
      </mesh>
      
      {/* Delivery helmet */}
      <mesh ref={helmetRef} position={[0, size * 0.85, size * 0.15]}>
        <sphereGeometry args={[size * 0.22, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.75]} />
        <meshBasicMaterial color={colors.helmet} />
      </mesh>
      
      {/* Helmet visor */}
      <mesh position={[0, size * 0.8, size * 0.35]}>
        <boxGeometry args={[size * 0.25, size * 0.15, size * 0.02]} />
        <meshBasicMaterial color="#87ceeb" transparent opacity={0.6} />
      </mesh>
      
      {/* Monkey arms holding handlebars */}
      <mesh position={[size * 0.3, size * 0.4, size * 0.9]} rotation={[0, 0, -Math.PI / 6]}>
        <cylinderGeometry args={[size * 0.05, size * 0.05, size * 0.5, 8]} />
        <meshBasicMaterial color={colors.fur} />
      </mesh>
      <mesh position={[-size * 0.3, size * 0.4, size * 0.9]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[size * 0.05, size * 0.05, size * 0.5, 8]} />
        <meshBasicMaterial color={colors.fur} />
      </mesh>
      
      {/* Monkey legs on scooter */}
      <mesh position={[size * 0.1, -size * 0.1, size * 0.3]} rotation={[Math.PI / 8, 0, 0]}>
        <cylinderGeometry args={[size * 0.06, size * 0.06, size * 0.6, 8]} />
        <meshBasicMaterial color={colors.fur} />
      </mesh>
      <mesh position={[-size * 0.1, -size * 0.1, size * 0.3]} rotation={[Math.PI / 8, 0, 0]}>
        <cylinderGeometry args={[size * 0.06, size * 0.06, size * 0.6, 8]} />
        <meshBasicMaterial color={colors.fur} />
      </mesh>
      
      {/* Monkey tail */}
      <mesh position={[0, size * 0.1, -size * 0.4]} rotation={[Math.PI / 4, 0, Math.PI / 8]}>
        <cylinderGeometry args={[size * 0.03, size * 0.02, size * 0.8, 6]} />
        <meshBasicMaterial color={colors.fur} />
      </mesh>
      
      {/* Pizza delivery box on back */}
      <mesh ref={pizzaBoxRef} position={[0, size * 0.6, -size * 0.3]}>
        <boxGeometry args={[size * 0.6, size * 0.6, size * 0.1]} />
        <meshBasicMaterial color={colors.pizza} />
      </mesh>
      
      {/* Pizza box text/logo */}
      <mesh position={[0, size * 0.6, -size * 0.24]}>
        <boxGeometry args={[size * 0.4, size * 0.4, size * 0.01]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      {/* Pizza box "PIZZA" text simulation with small boxes */}
      <mesh position={[0, size * 0.65, -size * 0.23]}>
        <boxGeometry args={[size * 0.3, size * 0.08, size * 0.005]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      
      {/* Delivery bag straps */}
      <mesh position={[size * 0.15, size * 0.4, -size * 0.25]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[size * 0.02, size * 0.02, size * 0.4, 6]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      <mesh position={[-size * 0.15, size * 0.4, -size * 0.25]} rotation={[0, 0, -Math.PI / 6]}>
        <cylinderGeometry args={[size * 0.02, size * 0.02, size * 0.4, 6]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      
      {/* Scooter headlight */}
      <mesh position={[0, size * 0.1, size * 1.4]}>
        <sphereGeometry args={[size * 0.08, 6, 6]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
      
      {/* Exhaust pipe */}
      <mesh position={[size * 0.2, -size * 0.2, -size * 0.6]} rotation={[Math.PI / 6, 0, 0]}>
        <cylinderGeometry args={[size * 0.04, size * 0.04, size * 0.3, 8]} />
        <meshBasicMaterial color="#666666" />
      </mesh>
      
      {/* Small exhaust smoke */}
      <mesh position={[size * 0.2, size * 0.1, -size * 0.8]}>
        <sphereGeometry args={[size * 0.05, 4, 4]} />
        <meshBasicMaterial color="#cccccc" transparent opacity={0.5} />
      </mesh>
      
      {/* Monkey eyes */}
      <mesh position={[size * 0.08, size * 0.75, size * 0.32]}>
        <sphereGeometry args={[size * 0.03, 4, 4]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[-size * 0.08, size * 0.75, size * 0.32]}>
        <sphereGeometry args={[size * 0.03, 4, 4]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Delivery uniform logo */}
      <mesh position={[0, size * 0.3, size * 0.26]}>
        <boxGeometry args={[size * 0.15, size * 0.15, size * 0.01]} />
        <meshBasicMaterial color="#ffff00" />
      </mesh>
    </group>
  );
}

// Moebius-style alien on skateboard
function AlienSkateboarder({ position = [0, 0, 0], velocity = [0, 0, 1], size = 1, isDarkMode = false, alienType = 0 }) {
  const groupRef = useRef();
  const boardRef = useRef();
  const wheelRef1 = useRef();
  const wheelRef2 = useRef();
  const alienRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      // Move towards user
      groupRef.current.position.z += velocity[2];
      groupRef.current.position.x += velocity[0] * 0.08;
      groupRef.current.position.y += velocity[1] * 0.08;

      // Skateboard tricks and leaning
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.7 + position[0] * 0.3) * 0.2;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      
      // Skateboard vertical movement for tricks
      groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 1.0 + position[1] * 0.4) * 0.03;

      // Skateboard rotation for tricks
      if (boardRef.current) {
        boardRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.3;
        boardRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.2) * 0.1;
      }

      // Wheels spinning
      if (wheelRef1.current) {
        wheelRef1.current.rotation.x += 0.5;
      }
      if (wheelRef2.current) {
        wheelRef2.current.rotation.x += 0.5;
      }

      // Alien body animation
      if (alienRef.current) {
        alienRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.6) * 0.05;
      }

      // Reset when out of view
      if (groupRef.current.position.z > 90) {
        const newX = (Math.random() - 0.5) * 180;
        const newY = (Math.random() - 0.5) * 40 + 10;
        const newZ = -350 - Math.random() * 100;
        
        groupRef.current.position.set(newX, newY, newZ);
      }
    }
  });

  // Alien skateboarder color schemes
  const alienSchemes = [
    {
      skin: isDarkMode ? '#7fff00' : '#32cd32', // Bright green alien
      clothes: isDarkMode ? '#ff6347' : '#dc143c', // Red clothes
      skateboard: isDarkMode ? '#ff1493' : '#c71585', // Pink skateboard
      wheels: isDarkMode ? '#ffd700' : '#daa520' // Gold wheels
    },
    {
      skin: isDarkMode ? '#00ffff' : '#00ced1', // Cyan alien
      clothes: isDarkMode ? '#9932cc' : '#8b00ff', // Purple clothes
      skateboard: isDarkMode ? '#ff4500' : '#ff6500', // Orange skateboard
      wheels: isDarkMode ? '#32cd32' : '#228b22' // Green wheels
    },
    {
      skin: isDarkMode ? '#ff69b4' : '#ff1493', // Hot pink alien
      clothes: isDarkMode ? '#00fa9a' : '#00ff7f', // Spring green clothes
      skateboard: isDarkMode ? '#1e90ff' : '#0000ff', // Blue skateboard
      wheels: isDarkMode ? '#ffa500' : '#ff8c00' // Orange wheels
    }
  ];
  
  const colors = alienSchemes[alienType % alienSchemes.length];

  return (
    <group ref={groupRef} position={position}>
      {/* Skateboard deck */}
      <mesh ref={boardRef} position={[0, -size * 0.8, 0]}>
        <boxGeometry args={[size * 0.3, size * 0.05, size * 2]} />
        <meshBasicMaterial color={colors.skateboard} />
      </mesh>
      
      {/* Skateboard grip tape */}
      <mesh position={[0, -size * 0.75, 0]}>
        <boxGeometry args={[size * 0.28, size * 0.01, size * 1.9]} />
        <meshBasicMaterial color="#2c2c2c" />
      </mesh>
      
      {/* Front wheels */}
      <mesh ref={wheelRef1} position={[size * 0.12, -size * 0.9, size * 0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[size * 0.08, size * 0.08, size * 0.06, 12]} />
        <meshBasicMaterial color={colors.wheels} />
      </mesh>
      <mesh position={[-size * 0.12, -size * 0.9, size * 0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[size * 0.08, size * 0.08, size * 0.06, 12]} />
        <meshBasicMaterial color={colors.wheels} />
      </mesh>
      
      {/* Back wheels */}
      <mesh ref={wheelRef2} position={[size * 0.12, -size * 0.9, -size * 0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[size * 0.08, size * 0.08, size * 0.06, 12]} />
        <meshBasicMaterial color={colors.wheels} />
      </mesh>
      <mesh position={[-size * 0.12, -size * 0.9, -size * 0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[size * 0.08, size * 0.08, size * 0.06, 12]} />
        <meshBasicMaterial color={colors.wheels} />
      </mesh>
      
      {/* Skateboard trucks */}
      <mesh position={[0, -size * 0.85, size * 0.7]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[size * 0.03, size * 0.03, size * 0.25, 8]} />
        <meshBasicMaterial color="#555555" />
      </mesh>
      <mesh position={[0, -size * 0.85, -size * 0.7]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[size * 0.03, size * 0.03, size * 0.25, 8]} />
        <meshBasicMaterial color="#555555" />
      </mesh>
      
      {/* Alien body */}
      <mesh ref={alienRef} position={[0, size * 0.1, 0]}>
        <boxGeometry args={[size * 0.5, size * 1, size * 0.3]} />
        <meshBasicMaterial color={colors.clothes} />
      </mesh>
      
      {/* Alien head - classic elongated */}
      <mesh position={[0, size * 0.8, size * 0.1]}>
        <sphereGeometry args={[size * 0.3, 8, 8]} />
        <meshBasicMaterial color={colors.skin} />
      </mesh>
      
      {/* Large alien eyes */}
      <mesh position={[size * 0.12, size * 0.85, size * 0.35]}>
        <sphereGeometry args={[size * 0.08, 6, 6]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[-size * 0.12, size * 0.85, size * 0.35]}>
        <sphereGeometry args={[size * 0.08, 6, 6]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Eye highlights */}
      <mesh position={[size * 0.14, size * 0.88, size * 0.37]}>
        <sphereGeometry args={[size * 0.02, 4, 4]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-size * 0.14, size * 0.88, size * 0.37]}>
        <sphereGeometry args={[size * 0.02, 4, 4]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      {/* Alien arms in skateboard stance */}
      <mesh position={[size * 0.4, size * 0.3, size * 0.2]} rotation={[0, Math.PI / 6, -Math.PI / 4]}>
        <cylinderGeometry args={[size * 0.06, size * 0.06, size * 0.6, 8]} />
        <meshBasicMaterial color={colors.skin} />
      </mesh>
      <mesh position={[-size * 0.4, size * 0.3, -size * 0.2]} rotation={[0, -Math.PI / 6, Math.PI / 4]}>
        <cylinderGeometry args={[size * 0.06, size * 0.06, size * 0.6, 8]} />
        <meshBasicMaterial color={colors.skin} />
      </mesh>
      
      {/* Alien legs on skateboard */}
      <mesh position={[size * 0.15, -size * 0.4, size * 0.1]} rotation={[Math.PI / 12, 0, 0]}>
        <cylinderGeometry args={[size * 0.08, size * 0.08, size * 0.8, 8]} />
        <meshBasicMaterial color={colors.skin} />
      </mesh>
      <mesh position={[-size * 0.15, -size * 0.4, -size * 0.1]} rotation={[Math.PI / 12, 0, 0]}>
        <cylinderGeometry args={[size * 0.08, size * 0.08, size * 0.8, 8]} />
        <meshBasicMaterial color={colors.skin} />
      </mesh>
      
      {/* Alien feet/shoes on skateboard */}
      <mesh position={[size * 0.15, -size * 0.85, size * 0.2]}>
        <boxGeometry args={[size * 0.12, size * 0.06, size * 0.25]} />
        <meshBasicMaterial color={colors.clothes} />
      </mesh>
      <mesh position={[-size * 0.15, -size * 0.85, -size * 0.1]}>
        <boxGeometry args={[size * 0.12, size * 0.06, size * 0.25]} />
        <meshBasicMaterial color={colors.clothes} />
      </mesh>
      
      {/* Cool alien antenna */}
      <mesh position={[0, size * 1.1, size * 0.1]}>
        <cylinderGeometry args={[size * 0.01, size * 0.01, size * 0.2, 6]} />
        <meshBasicMaterial color={colors.skin} />
      </mesh>
      
      {/* Antenna tip */}
      <mesh position={[0, size * 1.2, size * 0.1]}>
        <sphereGeometry args={[size * 0.03, 4, 4]} />
        <meshBasicMaterial color={colors.skateboard} />
      </mesh>
      
      {/* Skateboard logo/design */}
      <mesh position={[0, -size * 0.74, size * 0.3]}>
        <boxGeometry args={[size * 0.15, size * 0.005, size * 0.15]} />
        <meshBasicMaterial color={colors.wheels} />
      </mesh>
      
      {/* Energy trail behind skateboard for space effect */}
      <mesh position={[0, -size * 0.8, -size * 1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[size * 0.1, size * 0.4, 6]} />
        <meshBasicMaterial color={colors.skateboard} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

// Moebius-style alien on scooter  
function AlienScooterRider({ position = [0, 0, 0], velocity = [0, 0, 1], size = 1, isDarkMode = false, alienType = 0 }) {
  const groupRef = useRef();
  const frontWheelRef = useRef();
  const rearWheelRef = useRef();
  const handlebarsRef = useRef();
  const alienRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      // Move towards user
      groupRef.current.position.z += velocity[2];
      groupRef.current.position.x += velocity[0] * 0.07;
      groupRef.current.position.y += velocity[1] * 0.07;

      // Scooter leaning and movement
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.6 + position[0] * 0.2) * 0.15;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
      
      // Scooter bouncing
      groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 1.1 + position[1] * 0.3) * 0.02;

      // Front wheel spinning
      if (frontWheelRef.current) {
        frontWheelRef.current.rotation.x += 0.4;
      }
      
      // Rear wheel spinning  
      if (rearWheelRef.current) {
        rearWheelRef.current.rotation.x += 0.4;
      }

      // Handlebars slight turning
      if (handlebarsRef.current) {
        handlebarsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
      }

      // Alien body sway
      if (alienRef.current) {
        alienRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.7) * 0.08;
      }

      // Reset when out of view
      if (groupRef.current.position.z > 85) {
        const newX = (Math.random() - 0.5) * 170;
        const newY = (Math.random() - 0.5) * 35 + 5;
        const newZ = -330 - Math.random() * 90;
        
        groupRef.current.position.set(newX, newY, newZ);
      }
    }
  });

  // Alien scooter rider color schemes
  const alienSchemes = [
    {
      skin: isDarkMode ? '#98fb98' : '#90ee90', // Light green alien
      suit: isDarkMode ? '#4169e1' : '#0000cd', // Blue suit
      scooter: isDarkMode ? '#ff69b4' : '#ff1493', // Hot pink scooter
      wheels: isDarkMode ? '#ffd700' : '#ffa500' // Orange wheels
    },
    {
      skin: isDarkMode ? '#87ceeb' : '#00bfff', // Sky blue alien
      suit: isDarkMode ? '#ff6347' : '#ff0000', // Red suit
      scooter: isDarkMode ? '#9370db' : '#8a2be2', // Purple scooter
      wheels: isDarkMode ? '#00ff7f' : '#00ff00' // Green wheels
    },
    {
      skin: isDarkMode ? '#dda0dd' : '#da70d6', // Orchid alien
      suit: isDarkMode ? '#32cd32' : '#228b22', // Green suit
      scooter: isDarkMode ? '#ff4500' : '#ff6500', // Orange red scooter
      wheels: isDarkMode ? '#00ffff' : '#00ced1' // Cyan wheels
    }
  ];
  
  const colors = alienSchemes[alienType % alienSchemes.length];

  return (
    <group ref={groupRef} position={position}>
      {/* Scooter deck/platform */}
      <mesh position={[0, -size * 0.3, size * 0.2]}>
        <boxGeometry args={[size * 0.3, size * 0.08, size * 1.6]} />
        <meshBasicMaterial color={colors.scooter} />
      </mesh>
      
      {/* Scooter front stem */}
      <mesh position={[0, size * 0.2, size * 0.8]} rotation={[Math.PI / 15, 0, 0]}>
        <cylinderGeometry args={[size * 0.025, size * 0.025, size * 1, 8]} />
        <meshBasicMaterial color={colors.scooter} />
      </mesh>
      
      {/* Handlebars */}
      <mesh ref={handlebarsRef} position={[0, size * 0.7, size * 1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[size * 0.02, size * 0.02, size * 0.6, 8]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      
      {/* Front wheel */}
      <mesh ref={frontWheelRef} position={[0, -size * 0.4, size * 1.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[size * 0.25, size * 0.25, size * 0.08, 12]} />
        <meshBasicMaterial color={colors.wheels} />
      </mesh>
      
      {/* Rear wheel */}
      <mesh ref={rearWheelRef} position={[0, -size * 0.4, -size * 0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[size * 0.2, size * 0.2, size * 0.06, 12]} />
        <meshBasicMaterial color={colors.wheels} />
      </mesh>
      
      {/* Scooter body/frame */}
      <mesh position={[0, -size * 0.1, size * 0.1]}>
        <boxGeometry args={[size * 0.35, size * 0.25, size * 0.7]} />
        <meshBasicMaterial color={colors.scooter} />
      </mesh>
      
      {/* Alien body */}
      <mesh ref={alienRef} position={[0, size * 0.25, size * 0.1]}>
        <boxGeometry args={[size * 0.4, size * 0.8, size * 0.25]} />
        <meshBasicMaterial color={colors.suit} />
      </mesh>
      
      {/* Alien head - classic big head */}
      <mesh position={[0, size * 0.8, size * 0.15]}>
        <sphereGeometry args={[size * 0.25, 8, 8]} />
        <meshBasicMaterial color={colors.skin} />
      </mesh>
      
      {/* Large alien eyes */}
      <mesh position={[size * 0.1, size * 0.85, size * 0.35]}>
        <sphereGeometry args={[size * 0.07, 6, 6]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[-size * 0.1, size * 0.85, size * 0.35]}>
        <sphereGeometry args={[size * 0.07, 6, 6]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Eye reflections */}
      <mesh position={[size * 0.12, size * 0.87, size * 0.37]}>
        <sphereGeometry args={[size * 0.015, 4, 4]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-size * 0.12, size * 0.87, size * 0.37]}>
        <sphereGeometry args={[size * 0.015, 4, 4]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      {/* Alien arms holding handlebars */}
      <mesh position={[size * 0.3, size * 0.45, size * 0.85]} rotation={[0, 0, -Math.PI / 8]}>
        <cylinderGeometry args={[size * 0.05, size * 0.05, size * 0.5, 8]} />
        <meshBasicMaterial color={colors.skin} />
      </mesh>
      <mesh position={[-size * 0.3, size * 0.45, size * 0.85]} rotation={[0, 0, Math.PI / 8]}>
        <cylinderGeometry args={[size * 0.05, size * 0.05, size * 0.5, 8]} />
        <meshBasicMaterial color={colors.skin} />
      </mesh>
      
      {/* Alien legs on scooter */}
      <mesh position={[size * 0.1, -size * 0.1, size * 0.25]} rotation={[Math.PI / 10, 0, 0]}>
        <cylinderGeometry args={[size * 0.06, size * 0.06, size * 0.6, 8]} />
        <meshBasicMaterial color={colors.skin} />
      </mesh>
      <mesh position={[-size * 0.1, -size * 0.1, -size * 0.15]} rotation={[Math.PI / 10, 0, 0]}>
        <cylinderGeometry args={[size * 0.06, size * 0.06, size * 0.6, 8]} />
        <meshBasicMaterial color={colors.skin} />
      </mesh>
      
      {/* Alien space boots */}
      <mesh position={[size * 0.1, -size * 0.45, size * 0.4]}>
        <boxGeometry args={[size * 0.1, size * 0.05, size * 0.2]} />
        <meshBasicMaterial color={colors.suit} />
      </mesh>
      <mesh position={[-size * 0.1, -size * 0.45, -size * 0.05]}>
        <boxGeometry args={[size * 0.1, size * 0.05, size * 0.2]} />
        <meshBasicMaterial color={colors.suit} />
      </mesh>
      
      {/* Cool alien helmet/visor */}
      <mesh position={[0, size * 0.9, size * 0.3]}>
        <boxGeometry args={[size * 0.35, size * 0.12, size * 0.02]} />
        <meshBasicMaterial color="#87ceeb" transparent opacity={0.7} />
      </mesh>
      
      {/* Scooter headlight */}
      <mesh position={[0, size * 0.1, size * 1.3]}>
        <sphereGeometry args={[size * 0.06, 6, 6]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
      
      {/* Energy boost from scooter */}
      <mesh position={[0, -size * 0.2, -size * 1]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[size * 0.08, size * 0.3, 6]} />
        <meshBasicMaterial color={colors.wheels} transparent opacity={0.6} />
      </mesh>
      
      {/* Alien antenna */}
      <mesh position={[0, size * 1.05, size * 0.1]}>
        <cylinderGeometry args={[size * 0.008, size * 0.008, size * 0.15, 6]} />
        <meshBasicMaterial color={colors.skin} />
      </mesh>
      
      {/* Antenna orb */}
      <mesh position={[0, size * 1.12, size * 0.1]}>
        <sphereGeometry args={[size * 0.025, 4, 4]} />
        <meshBasicMaterial color={colors.scooter} />
      </mesh>
      
      {/* Scooter side panels */}
      <mesh position={[size * 0.18, -size * 0.05, size * 0.1]}>
        <boxGeometry args={[size * 0.02, size * 0.15, size * 0.4]} />
        <meshBasicMaterial color={colors.wheels} />
      </mesh>
      <mesh position={[-size * 0.18, -size * 0.05, size * 0.1]}>
        <boxGeometry args={[size * 0.02, size * 0.15, size * 0.4]} />
        <meshBasicMaterial color={colors.wheels} />
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

// Moebius-style planet with rings and surface details
function MoebiusPlanet({ position = [0, 0, 0], velocity = [0, 0, 0.2], size = 3, isDarkMode = false, planetType = 0 }) {
  const planetRef = useRef();
  const ringsRef = useRef();
  const surfaceDetailsRef = useRef();
  const atmosphereRef = useRef();
  const moonsRef = useRef();

  useFrame((state) => {
    if (planetRef.current) {
      // Move towards user slowly
      planetRef.current.position.z += velocity[2];
      planetRef.current.position.x += velocity[0] * 0.02;
      planetRef.current.position.y += velocity[1] * 0.02;

      // Planet rotation on its axis
      planetRef.current.rotation.y += 0.005;
      planetRef.current.rotation.x += 0.001;

      // Rings rotation (opposite direction for visual interest)
      if (ringsRef.current) {
        ringsRef.current.rotation.z += 0.008;
        ringsRef.current.rotation.x += 0.002;
      }

      // Surface details rotation
      if (surfaceDetailsRef.current) {
        surfaceDetailsRef.current.rotation.y += 0.003;
      }

      // Atmosphere pulsing
      if (atmosphereRef.current) {
        const pulse = Math.sin(state.clock.elapsedTime * 0.8) * 0.1 + 1;
        atmosphereRef.current.scale.setScalar(pulse);
      }

      // Moons orbiting
      if (moonsRef.current) {
        moonsRef.current.rotation.y += 0.02;
        moonsRef.current.rotation.x += 0.01;
      }

      // Reset when out of view
      if (planetRef.current.position.z > 150) {
        const newX = (Math.random() - 0.5) * 200;
        const newY = (Math.random() - 0.5) * 100;
        const newZ = -600 - Math.random() * 200;
        
        planetRef.current.position.set(newX, newY, newZ);
      }
    }
  });

  // Moebius planet color schemes
  const planetSchemes = [
    {
      core: isDarkMode ? '#ff6b35' : '#e53935', // Red/Orange planet
      surface: isDarkMode ? '#8bc34a' : '#689f38', // Green continents
      rings: isDarkMode ? '#ffc107' : '#f57c00', // Golden rings
      atmosphere: isDarkMode ? '#64b5f6' : '#1976d2', // Blue atmosphere
      moon: isDarkMode ? '#bdbdbd' : '#757575' // Grey moons
    },
    {
      core: isDarkMode ? '#9c27b0' : '#7b1fa2', // Purple planet
      surface: isDarkMode ? '#00bcd4' : '#0097a7', // Cyan oceans
      rings: isDarkMode ? '#e91e63' : '#c2185b', // Pink rings
      atmosphere: isDarkMode ? '#4caf50' : '#388e3c', // Green atmosphere
      moon: isDarkMode ? '#ffab91' : '#ff7043' // Orange moons
    },
    {
      core: isDarkMode ? '#2196f3' : '#1565c0', // Blue planet
      surface: isDarkMode ? '#ff9800' : '#f57c00', // Orange landmasses
      rings: isDarkMode ? '#9e9e9e' : '#616161', // Grey rings
      atmosphere: isDarkMode ? '#ffeb3b' : '#fbc02d', // Yellow atmosphere
      moon: isDarkMode ? '#8e24aa' : '#6a1b9a' // Purple moons
    }
  ];
  
  const colors = planetSchemes[planetType % planetSchemes.length];

  return (
    <group ref={planetRef} position={position}>
      {/* Main planet core */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshBasicMaterial color={colors.core} />
      </mesh>
      
      {/* Surface continents/landmasses - Moebius geometric style */}
      <group ref={surfaceDetailsRef}>
        {/* Large continent */}
        <mesh position={[size * 0.3, size * 0.2, size * 0.7]}>
          <boxGeometry args={[size * 0.8, size * 0.4, size * 0.1]} />
          <meshBasicMaterial color={colors.surface} />
        </mesh>
        
        {/* Another continent */}
        <mesh position={[-size * 0.4, -size * 0.3, size * 0.8]} rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[size * 0.6, size * 0.3, size * 0.08]} />
          <meshBasicMaterial color={colors.surface} />
        </mesh>
        
        {/* Polar cap */}
        <mesh position={[0, size * 0.9, 0]}>
          <sphereGeometry args={[size * 0.3, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
        
        {/* Southern continent */}
        <mesh position={[size * 0.1, -size * 0.6, size * 0.6]} rotation={[Math.PI / 3, 0, 0]}>
          <boxGeometry args={[size * 0.9, size * 0.2, size * 0.12]} />
          <meshBasicMaterial color={colors.surface} />
        </mesh>
        
        {/* Island chains - small geometric shapes */}
        {[...Array(6)].map((_, i) => (
          <mesh 
            key={i} 
            position={[
              Math.cos(i * Math.PI / 3) * size * 0.8,
              Math.sin(i * Math.PI / 4) * size * 0.7,
              Math.sin(i * Math.PI / 2) * size * 0.6
            ]}
          >
            <boxGeometry args={[size * 0.15, size * 0.08, size * 0.05]} />
            <meshBasicMaterial color={colors.surface} />
          </mesh>
        ))}
      </group>
      
      {/* Planet rings - classic Moebius style */}
      <group ref={ringsRef}>
        {/* Main ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 1.3, size * 1.8, 32]} />
          <meshBasicMaterial color={colors.rings} transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>
        
        {/* Secondary ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 2.0, size * 2.3, 32]} />
          <meshBasicMaterial color={colors.rings} transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
        
        {/* Ring particles - small geometric details */}
        {[...Array(12)].map((_, i) => (
          <mesh 
            key={i} 
            position={[
              Math.cos(i * Math.PI / 6) * size * 1.6,
              0,
              Math.sin(i * Math.PI / 6) * size * 1.6
            ]}
          >
            <boxGeometry args={[size * 0.03, size * 0.02, size * 0.03]} />
            <meshBasicMaterial color={colors.rings} />
          </mesh>
        ))}
      </group>
      
      {/* Atmospheric glow */}
      <mesh ref={atmosphereRef} position={[0, 0, 0]}>
        <sphereGeometry args={[size * 1.1, 16, 16]} />
        <meshBasicMaterial 
          color={colors.atmosphere} 
          transparent 
          opacity={0.2} 
        />
      </mesh>
      
      {/* Orbiting moons */}
      <group ref={moonsRef}>
        {/* First moon */}
        <mesh position={[size * 4, size * 0.5, 0]}>
          <sphereGeometry args={[size * 0.2, 8, 8]} />
          <meshBasicMaterial color={colors.moon} />
        </mesh>
        
        {/* Second moon */}
        <mesh position={[-size * 3.5, -size * 1, size * 0.8]}>
          <sphereGeometry args={[size * 0.15, 6, 6]} />
          <meshBasicMaterial color={colors.moon} />
        </mesh>
        
        {/* Third moon - smaller */}
        <mesh position={[size * 2.5, -size * 2, -size * 1.2]}>
          <sphereGeometry args={[size * 0.1, 6, 6]} />
          <meshBasicMaterial color={colors.moon} />
        </mesh>
      </group>
      
      {/* Space structures - Moebius inspired orbital stations */}
      <mesh position={[0, size * 1.5, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[size * 0.1, size * 1.5, size * 0.1]} />
        <meshBasicMaterial color={colors.rings} />
      </mesh>
      <mesh position={[0, size * 1.5, 0]} rotation={[0, Math.PI / 2, Math.PI / 4]}>
        <boxGeometry args={[size * 0.1, size * 1.5, size * 0.1]} />
        <meshBasicMaterial color={colors.rings} />
      </mesh>
      
      {/* Orbital energy beams */}
      <mesh position={[size * 1.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[size * 0.02, size * 0.02, size * 3.6, 6]} />
        <meshBasicMaterial color={colors.atmosphere} transparent opacity={0.6} />
      </mesh>
      
      {/* Planet's magnetic field lines - abstract Moebius curves */}
      {[...Array(4)].map((_, i) => (
        <mesh 
          key={i} 
          position={[0, 0, 0]}
          rotation={[0, i * Math.PI / 2, Math.PI / 6]}
        >
          <torusGeometry args={[size * 1.4, size * 0.01, 4, 16]} />
          <meshBasicMaterial color={colors.atmosphere} transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// Moebius-style gas giant with swirling patterns
function MoebiusGasGiant({ position = [0, 0, 0], velocity = [0, 0, 0.15], size = 4, isDarkMode = false, giantType = 0 }) {
  const planetRef = useRef();
  const bandsRef = useRef();
  const stormRef = useRef();
  const ringsRef = useRef();

  useFrame((state) => {
    if (planetRef.current) {
      // Move slowly towards user
      planetRef.current.position.z += velocity[2];
      planetRef.current.position.x += velocity[0] * 0.01;
      planetRef.current.position.y += velocity[1] * 0.01;

      // Gas giant rotation - faster than rocky planets
      planetRef.current.rotation.y += 0.008;
      
      // Atmospheric bands rotating at different speeds
      if (bandsRef.current) {
        bandsRef.current.rotation.y += 0.012;
      }
      
      // Great storm rotation
      if (stormRef.current) {
        stormRef.current.rotation.z += 0.02;
      }
      
      // Ring system
      if (ringsRef.current) {
        ringsRef.current.rotation.y += 0.006;
      }

      // Reset when out of view
      if (planetRef.current.position.z > 160) {
        const newX = (Math.random() - 0.5) * 220;
        const newY = (Math.random() - 0.5) * 120;
        const newZ = -700 - Math.random() * 250;
        
        planetRef.current.position.set(newX, newY, newZ);
      }
    }
  });

  // Gas giant color schemes
  const giantSchemes = [
    {
      core: isDarkMode ? '#ff8a65' : '#ff5722', // Orange gas giant (Jupiter-like)
      bands: isDarkMode ? '#8d6e63' : '#5d4037', // Brown bands
      storm: isDarkMode ? '#f44336' : '#d32f2f', // Red storm
      rings: isDarkMode ? '#90a4ae' : '#607d8b', // Blue-grey rings
    },
    {
      core: isDarkMode ? '#42a5f5' : '#2196f3', // Blue gas giant (Neptune-like)
      bands: isDarkMode ? '#26c6da' : '#00bcd4', // Cyan bands
      storm: isDarkMode ? '#ab47bc' : '#9c27b0', // Purple storm
      rings: isDarkMode ? '#fff59d' : '#ffeb3b', // Yellow rings
    },
    {
      core: isDarkMode ? '#66bb6a' : '#4caf50', // Green gas giant
      bands: isDarkMode ? '#29b6f6' : '#03a9f4', // Blue bands
      storm: isDarkMode ? '#ff7043' : '#ff5722', // Orange storm
      rings: isDarkMode ? '#ba68c8' : '#9c27b0', // Purple rings
    }
  ];
  
  const colors = giantSchemes[giantType % giantSchemes.length];

  return (
    <group ref={planetRef} position={position}>
      {/* Main gas giant body */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshBasicMaterial color={colors.core} />
      </mesh>
      
      {/* Atmospheric bands - Moebius geometric style */}
      <group ref={bandsRef}>
        {/* Equatorial band */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[size * 0.8, size * 0.1, 8, 32]} />
          <meshBasicMaterial color={colors.bands} />
        </mesh>
        
        {/* Northern band */}
        <mesh position={[0, size * 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[size * 0.7, size * 0.08, 6, 24]} />
          <meshBasicMaterial color={colors.bands} transparent opacity={0.8} />
        </mesh>
        
        {/* Southern band */}
        <mesh position={[0, -size * 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[size * 0.7, size * 0.08, 6, 24]} />
          <meshBasicMaterial color={colors.bands} transparent opacity={0.8} />
        </mesh>
        
        {/* Polar bands */}
        <mesh position={[0, size * 0.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[size * 0.4, size * 0.05, 4, 16]} />
          <meshBasicMaterial color={colors.bands} transparent opacity={0.6} />
        </mesh>
        <mesh position={[0, -size * 0.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[size * 0.4, size * 0.05, 4, 16]} />
          <meshBasicMaterial color={colors.bands} transparent opacity={0.6} />
        </mesh>
      </group>
      
      {/* Great storm - geometric spiral */}
      <group ref={stormRef} position={[size * 0.6, size * 0.2, size * 0.8]}>
        <mesh>
          <boxGeometry args={[size * 0.3, size * 0.2, size * 0.05]} />
          <meshBasicMaterial color={colors.storm} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[size * 0.25, size * 0.15, size * 0.04]} />
          <meshBasicMaterial color={colors.storm} transparent opacity={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[size * 0.2, size * 0.1, size * 0.03]} />
          <meshBasicMaterial color={colors.storm} transparent opacity={0.6} />
        </mesh>
      </group>
      
      {/* Ring system - complex multi-ring structure */}
      <group ref={ringsRef}>
        {/* Inner ring */}
        <mesh rotation={[Math.PI / 3, 0, Math.PI / 6]}>
          <ringGeometry args={[size * 1.5, size * 2.2, 48]} />
          <meshBasicMaterial color={colors.rings} transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
        
        {/* Middle ring */}
        <mesh rotation={[Math.PI / 3, 0, Math.PI / 6]}>
          <ringGeometry args={[size * 2.4, size * 3.1, 48]} />
          <meshBasicMaterial color={colors.rings} transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
        
        {/* Outer ring */}
        <mesh rotation={[Math.PI / 3, 0, Math.PI / 6]}>
          <ringGeometry args={[size * 3.3, size * 3.8, 48]} />
          <meshBasicMaterial color={colors.rings} transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
        
        {/* Ring shepherding moons */}
        <mesh position={[size * 2.8, 0, 0]}>
          <sphereGeometry args={[size * 0.08, 6, 6]} />
          <meshBasicMaterial color={colors.rings} />
        </mesh>
        <mesh position={[-size * 3.5, size * 0.5, -size * 0.3]}>
          <sphereGeometry args={[size * 0.06, 6, 6]} />
          <meshBasicMaterial color={colors.rings} />
        </mesh>
      </group>
      
      {/* Auroral displays at poles */}
      <mesh position={[0, size * 1.1, 0]}>
        <coneGeometry args={[size * 0.3, size * 0.6, 8]} />
        <meshBasicMaterial color={colors.storm} transparent opacity={0.4} />
      </mesh>
      <mesh position={[0, -size * 1.1, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[size * 0.3, size * 0.6, 8]} />
        <meshBasicMaterial color={colors.storm} transparent opacity={0.4} />
      </mesh>
      
      {/* Geometric cloud formations */}
      {[...Array(8)].map((_, i) => (
        <mesh 
          key={i} 
          position={[
            Math.cos(i * Math.PI / 4) * size * 0.9,
            Math.sin(i * Math.PI / 6) * size * 0.3,
            Math.sin(i * Math.PI / 4) * size * 0.7
          ]}
        >
          <boxGeometry args={[size * 0.15, size * 0.08, size * 0.04]} />
          <meshBasicMaterial color={colors.bands} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

// Moebius-style shooting star with trail
function ShootingStar({ position = [0, 0, 0], velocity = [2, -1, 3], size = 0.1, isDarkMode = false, starType = 0 }) {
  const starRef = useRef();
  const trailRef = useRef();
  const [trailPositions, setTrailPositions] = useState([]);

  useFrame((state) => {
    if (starRef.current) {
      // Fast movement across the sky
      starRef.current.position.x += velocity[0];
      starRef.current.position.y += velocity[1];
      starRef.current.position.z += velocity[2];

      // Update trail positions
      const currentPos = [
        starRef.current.position.x,
        starRef.current.position.y, 
        starRef.current.position.z
      ];
      
      setTrailPositions(prev => {
        const newTrail = [currentPos, ...prev.slice(0, 8)]; // Keep last 8 positions
        return newTrail;
      });

      // Twinkling effect
      const twinkle = Math.sin(state.clock.elapsedTime * 10) * 0.3 + 0.7;
      starRef.current.scale.setScalar(twinkle);

      // Reset when out of view
      if (starRef.current.position.z > 200 || 
          Math.abs(starRef.current.position.x) > 300 || 
          Math.abs(starRef.current.position.y) > 200) {
        
        // Respawn from random edge
        const edge = Math.floor(Math.random() * 4);
        let newX, newY, newZ;
        
        switch(edge) {
          case 0: // Left edge
            newX = -300 - Math.random() * 100;
            newY = (Math.random() - 0.5) * 200;
            newZ = -400 - Math.random() * 200;
            break;
          case 1: // Right edge
            newX = 300 + Math.random() * 100;
            newY = (Math.random() - 0.5) * 200;
            newZ = -400 - Math.random() * 200;
            break;
          case 2: // Top edge
            newX = (Math.random() - 0.5) * 400;
            newY = 200 + Math.random() * 100;
            newZ = -400 - Math.random() * 200;
            break;
          default: // Bottom edge
            newX = (Math.random() - 0.5) * 400;
            newY = -200 - Math.random() * 100;
            newZ = -400 - Math.random() * 200;
            break;
        }
        
        starRef.current.position.set(newX, newY, newZ);
        setTrailPositions([]); // Clear trail
      }
    }
  });

  // Shooting star color schemes
  const starSchemes = [
    {
      core: isDarkMode ? '#ffffff' : '#ffffcc', // White/cream
      trail: isDarkMode ? '#ffeb3b' : '#ffc107' // Yellow trail
    },
    {
      core: isDarkMode ? '#64b5f6' : '#2196f3', // Blue
      trail: isDarkMode ? '#e1f5fe' : '#bbdefb' // Light blue trail
    },
    {
      core: isDarkMode ? '#ff6b6b' : '#f44336', // Red
      trail: isDarkMode ? '#ffcdd2' : '#ffebee' // Pink trail
    }
  ];
  
  const colors = starSchemes[starType % starSchemes.length];

  return (
    <group>
      {/* Main shooting star */}
      <mesh ref={starRef} position={position}>
        <sphereGeometry args={[size, 8, 8]} />
        <meshBasicMaterial color={colors.core} />
      </mesh>
      
      {/* Trail effect */}
      {trailPositions.map((pos, i) => (
        <mesh 
          key={i}
          position={pos}
          scale={[(1 - i * 0.12), (1 - i * 0.12), (1 - i * 0.12)]}
        >
          <sphereGeometry args={[size * 0.8, 6, 6]} />
          <meshBasicMaterial 
            color={colors.trail} 
            transparent 
            opacity={1 - i * 0.15} 
          />
        </mesh>
      ))}
    </group>
  );
}

// Moebius-style satellite
function MoebiusSatellite({ position = [0, 0, 0], velocity = [0, 0, 0.5], size = 1, isDarkMode = false, satelliteType = 0 }) {
  const satelliteRef = useRef();
  const solarPanelsRef = useRef();
  const dishRef = useRef();
  const lightsRef = useRef();

  useFrame((state) => {
    if (satelliteRef.current) {
      // Move towards user
      satelliteRef.current.position.z += velocity[2];
      satelliteRef.current.position.x += velocity[0] * 0.05;
      satelliteRef.current.position.y += velocity[1] * 0.05;

      // Satellite body rotation
      satelliteRef.current.rotation.y += 0.01;
      satelliteRef.current.rotation.z += 0.005;

      // Solar panels rotating to track "sun"
      if (solarPanelsRef.current) {
        solarPanelsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.5;
      }

      // Communication dish movement
      if (dishRef.current) {
        dishRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.3;
        dishRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.3) * 0.4;
      }

      // Blinking lights
      if (lightsRef.current) {
        const blink = Math.sin(state.clock.elapsedTime * 3) > 0 ? 1 : 0.3;
        lightsRef.current.scale.setScalar(blink);
      }

      // Reset when out of view
      if (satelliteRef.current.position.z > 120) {
        const newX = (Math.random() - 0.5) * 200;
        const newY = (Math.random() - 0.5) * 80;
        const newZ = -500 - Math.random() * 200;
        
        satelliteRef.current.position.set(newX, newY, newZ);
      }
    }
  });

  // Satellite color schemes
  const satelliteSchemes = [
    {
      body: isDarkMode ? '#e0e0e0' : '#bdbdbd', // Light grey
      panels: isDarkMode ? '#1a237e' : '#3f51b5', // Blue solar panels
      dish: isDarkMode ? '#ffc107' : '#ff9800', // Orange dish
      lights: isDarkMode ? '#4caf50' : '#2e7d32' // Green lights
    },
    {
      body: isDarkMode ? '#ffcc02' : '#ff9800', // Orange body
      panels: isDarkMode ? '#2e7d32' : '#4caf50', // Green panels
      dish: isDarkMode ? '#e0e0e0' : '#9e9e9e', // Grey dish
      lights: isDarkMode ? '#f44336' : '#d32f2f' // Red lights
    },
    {
      body: isDarkMode ? '#9c27b0' : '#7b1fa2', // Purple body
      panels: isDarkMode ? '#ff6f00' : '#ff8f00', // Amber panels
      dish: isDarkMode ? '#00bcd4' : '#0097a7', // Cyan dish
      lights: isDarkMode ? '#ffeb3b' : '#fbc02d' // Yellow lights
    }
  ];
  
  const colors = satelliteSchemes[satelliteType % satelliteSchemes.length];

  return (
    <group ref={satelliteRef} position={position}>
      {/* Main satellite body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[size * 1.2, size * 0.8, size * 0.6]} />
        <meshBasicMaterial color={colors.body} />
      </mesh>
      
      {/* Solar panels */}
      <group ref={solarPanelsRef}>
        <mesh position={[size * 1.8, 0, 0]}>
          <boxGeometry args={[size * 1.2, size * 2, size * 0.05]} />
          <meshBasicMaterial color={colors.panels} />
        </mesh>
        <mesh position={[-size * 1.8, 0, 0]}>
          <boxGeometry args={[size * 1.2, size * 2, size * 0.05]} />
          <meshBasicMaterial color={colors.panels} />
        </mesh>
        
        {/* Panel grid lines */}
        {[...Array(6)].map((_, i) => (
          <mesh 
            key={i} 
            position={[size * 1.8, -size + i * size * 0.4, size * 0.03]}
          >
            <boxGeometry args={[size * 1.2, size * 0.02, size * 0.01]} />
            <meshBasicMaterial color="#333333" />
          </mesh>
        ))}
      </group>
      
      {/* Communication dish */}
      <group ref={dishRef} position={[0, size * 0.8, 0]}>
        <mesh>
          <cylinderGeometry args={[size * 0.6, size * 0.1, size * 0.1, 16]} />
          <meshBasicMaterial color={colors.dish} />
        </mesh>
        
        {/* Dish support */}
        <mesh position={[0, -size * 0.3, 0]}>
          <cylinderGeometry args={[size * 0.03, size * 0.03, size * 0.6, 8]} />
          <meshBasicMaterial color={colors.body} />
        </mesh>
      </group>
      
      {/* Antenna array */}
      <mesh position={[0, -size * 0.6, 0]}>
        <cylinderGeometry args={[size * 0.02, size * 0.02, size * 0.8, 6]} />
        <meshBasicMaterial color={colors.body} />
      </mesh>
      
      {/* Navigation/status lights */}
      <group ref={lightsRef}>
        <mesh position={[size * 0.7, size * 0.2, size * 0.4]}>
          <sphereGeometry args={[size * 0.05, 6, 6]} />
          <meshBasicMaterial color={colors.lights} />
        </mesh>
        <mesh position={[-size * 0.7, size * 0.2, size * 0.4]}>
          <sphereGeometry args={[size * 0.05, 6, 6]} />
          <meshBasicMaterial color={colors.lights} />
        </mesh>
        <mesh position={[0, size * 0.5, size * 0.4]}>
          <sphereGeometry args={[size * 0.04, 6, 6]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
      
      {/* Thruster nozzles */}
      <mesh position={[0, 0, -size * 0.4]}>
        <cylinderGeometry args={[size * 0.08, size * 0.06, size * 0.2, 8]} />
        <meshBasicMaterial color="#666666" />
      </mesh>
      
      {/* Equipment modules */}
      <mesh position={[size * 0.4, -size * 0.3, 0]}>
        <boxGeometry args={[size * 0.3, size * 0.2, size * 0.4]} />
        <meshBasicMaterial color={colors.dish} />
      </mesh>
      <mesh position={[-size * 0.4, -size * 0.3, 0]}>
        <boxGeometry args={[size * 0.3, size * 0.2, size * 0.4]} />
        <meshBasicMaterial color={colors.dish} />
      </mesh>
    </group>
  );
}

// Moebius-style space station
function MoebiusSpaceStation({ position = [0, 0, 0], velocity = [0, 0, 0.3], size = 3, isDarkMode = false, stationType = 0 }) {
  const stationRef = useRef();
  const rotatingRingRef = useRef();
  const docksRef = useRef();
  const lightsRef = useRef();
  const antennasRef = useRef();

  useFrame((state) => {
    if (stationRef.current) {
      // Move slowly towards user
      stationRef.current.position.z += velocity[2];
      stationRef.current.position.x += velocity[0] * 0.03;
      stationRef.current.position.y += velocity[1] * 0.03;

      // Station rotation
      stationRef.current.rotation.y += 0.003;
      
      // Rotating habitat ring
      if (rotatingRingRef.current) {
        rotatingRingRef.current.rotation.y += 0.02;
      }
      
      // Docking bay animations
      if (docksRef.current) {
        docksRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      }
      
      // Blinking station lights
      if (lightsRef.current) {
        const blink = Math.sin(state.clock.elapsedTime * 2) > 0.5 ? 1 : 0.4;
        lightsRef.current.scale.setScalar(blink);
      }
      
      // Antenna movement
      if (antennasRef.current) {
        antennasRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
      }

      // Reset when out of view
      if (stationRef.current.position.z > 180) {
        const newX = (Math.random() - 0.5) * 250;
        const newY = (Math.random() - 0.5) * 120;
        const newZ = -800 - Math.random() * 300;
        
        stationRef.current.position.set(newX, newY, newZ);
      }
    }
  });

  // Space station color schemes
  const stationSchemes = [
    {
      hull: isDarkMode ? '#90a4ae' : '#607d8b', // Blue grey hull
      ring: isDarkMode ? '#8bc34a' : '#689f38', // Green habitat ring
      docks: isDarkMode ? '#ff9800' : '#f57c00', // Orange docking bays
      lights: isDarkMode ? '#00bcd4' : '#0097a7', // Cyan lights
      panels: isDarkMode ? '#3f51b5' : '#1976d2' // Blue panels
    },
    {
      hull: isDarkMode ? '#8d6e63' : '#5d4037', // Brown hull
      ring: isDarkMode ? '#e91e63' : '#c2185b', // Pink habitat ring
      docks: isDarkMode ? '#9c27b0' : '#7b1fa2', // Purple docking bays
      lights: isDarkMode ? '#ffc107' : '#f57c00', // Amber lights
      panels: isDarkMode ? '#4caf50' : '#388e3c' // Green panels
    },
    {
      hull: isDarkMode ? '#607d8b' : '#455a64', // Dark blue grey
      ring: isDarkMode ? '#ff5722' : '#d84315', // Red habitat ring
      docks: isDarkMode ? '#2196f3' : '#1976d2', // Blue docking bays
      lights: isDarkMode ? '#4caf50' : '#2e7d32', // Green lights
      panels: isDarkMode ? '#ff9800' : '#ef6c00' // Orange panels
    }
  ];
  
  const colors = stationSchemes[stationType % stationSchemes.length];

  return (
    <group ref={stationRef} position={position}>
      {/* Central hub */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[size * 0.8, size * 1.2, size * 2, 8]} />
        <meshBasicMaterial color={colors.hull} />
      </mesh>
      
      {/* Rotating habitat ring */}
      <group ref={rotatingRingRef}>
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[size * 2.5, size * 0.3, 8, 32]} />
          <meshBasicMaterial color={colors.ring} />
        </mesh>
        
        {/* Habitat modules on ring */}
        {[...Array(8)].map((_, i) => (
          <mesh 
            key={i} 
            position={[
              Math.cos(i * Math.PI / 4) * size * 2.5,
              0,
              Math.sin(i * Math.PI / 4) * size * 2.5
            ]}
            rotation={[0, i * Math.PI / 4, 0]}
          >
            <boxGeometry args={[size * 0.4, size * 0.6, size * 0.8]} />
            <meshBasicMaterial color={colors.ring} />
          </mesh>
        ))}
      </group>
      
      {/* Docking bays */}
      <group ref={docksRef}>
        <mesh position={[0, size * 1.8, 0]}>
          <boxGeometry args={[size * 1.5, size * 0.4, size * 1.5]} />
          <meshBasicMaterial color={colors.docks} />
        </mesh>
        <mesh position={[0, -size * 1.8, 0]}>
          <boxGeometry args={[size * 1.5, size * 0.4, size * 1.5]} />
          <meshBasicMaterial color={colors.docks} />
        </mesh>
        
        {/* Docking arms */}
        {[...Array(4)].map((_, i) => (
          <mesh 
            key={i} 
            position={[
              Math.cos(i * Math.PI / 2) * size * 1.3,
              size * 1.8,
              Math.sin(i * Math.PI / 2) * size * 1.3
            ]}
            rotation={[0, i * Math.PI / 2, 0]}
          >
            <boxGeometry args={[size * 0.1, size * 0.6, size * 0.8]} />
            <meshBasicMaterial color={colors.docks} />
          </mesh>
        ))}
      </group>
      
      {/* Solar panel arrays */}
      <mesh position={[size * 3.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[size * 0.1, size * 4, size * 2]} />
        <meshBasicMaterial color={colors.panels} />
      </mesh>
      <mesh position={[-size * 3.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[size * 0.1, size * 4, size * 2]} />
        <meshBasicMaterial color={colors.panels} />
      </mesh>
      
      {/* Communication arrays */}
      <group ref={antennasRef} position={[0, size * 2.5, 0]}>
        <mesh>
          <cylinderGeometry args={[size * 0.8, size * 0.1, size * 0.1, 16]} />
          <meshBasicMaterial color={colors.lights} />
        </mesh>
        
        {/* Multiple antennas */}
        {[...Array(3)].map((_, i) => (
          <mesh 
            key={i} 
            position={[0, size * 0.3, 0]}
            rotation={[0, i * Math.PI * 2 / 3, Math.PI / 6]}
          >
            <cylinderGeometry args={[size * 0.02, size * 0.02, size * 1.5, 6]} />
            <meshBasicMaterial color={colors.hull} />
          </mesh>
        ))}
      </group>
      
      {/* Station lights */}
      <group ref={lightsRef}>
        {[...Array(12)].map((_, i) => (
          <mesh 
            key={i} 
            position={[
              Math.cos(i * Math.PI / 6) * size * 1.1,
              Math.sin(i * Math.PI / 6) * size * 0.3,
              Math.sin(i * Math.PI / 3) * size * 0.8
            ]}
          >
            <sphereGeometry args={[size * 0.06, 6, 6]} />
            <meshBasicMaterial color={colors.lights} />
          </mesh>
        ))}
      </group>
      
      {/* Thruster arrays */}
      {[...Array(4)].map((_, i) => (
        <mesh 
          key={i} 
          position={[
            Math.cos(i * Math.PI / 2) * size * 0.6,
            0,
            -size * 1.2
          ]}
        >
          <cylinderGeometry args={[size * 0.1, size * 0.08, size * 0.3, 8]} />
          <meshBasicMaterial color="#666666" />
        </mesh>
      ))}
      
      {/* Observation decks */}
      <mesh position={[0, 0, size * 1.5]}>
        <sphereGeometry args={[size * 0.4, 8, 8]} />
        <meshBasicMaterial color={colors.lights} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

// Moebius-style spinning black hole
function MoebiusBlackHole({ position = [0, 0, 0], velocity = [0, 0, 0.1], size = 5, isDarkMode = false, blackHoleType = 0 }) {
  const blackHoleRef = useRef();
  const accretionDiskRef = useRef();
  const jetRef = useRef();
  const particlesRef = useRef();
  const distortionRingRef = useRef();
  const eventHorizonRef = useRef();

  useFrame((state) => {
    if (blackHoleRef.current) {
      // Move slowly towards user (black holes are massive and distant)
      blackHoleRef.current.position.z += velocity[2];
      blackHoleRef.current.position.x += velocity[0] * 0.01;
      blackHoleRef.current.position.y += velocity[1] * 0.01;

      // Black hole rotation (slow and ominous)
      blackHoleRef.current.rotation.y += 0.002;
      
      // Accretion disk spinning
      if (accretionDiskRef.current) {
        accretionDiskRef.current.rotation.y += 0.015;
        accretionDiskRef.current.rotation.z += 0.008;
      }
      
      // Polar jets rotation
      if (jetRef.current) {
        jetRef.current.rotation.y += 0.01;
        jetRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      }
      
      // Particle swirl animation
      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.02;
        particlesRef.current.rotation.x += 0.005;
      }
      
      // Gravitational distortion ring pulsing
      if (distortionRingRef.current) {
        const pulse = Math.sin(state.clock.elapsedTime * 0.8) * 0.2 + 1;
        distortionRingRef.current.scale.setScalar(pulse);
        distortionRingRef.current.rotation.z += 0.01;
      }
      
      // Event horizon pulsing
      if (eventHorizonRef.current) {
        const horizonPulse = Math.sin(state.clock.elapsedTime * 1.2) * 0.1 + 1;
        eventHorizonRef.current.scale.setScalar(horizonPulse);
      }

      // Reset when out of view (black holes take a long time to pass)
      if (blackHoleRef.current.position.z > 300) {
        const newX = (Math.random() - 0.5) * 300;
        const newY = (Math.random() - 0.5) * 150;
        const newZ = -1500 - Math.random() * 500; // Very far back for dramatic entrance
        
        blackHoleRef.current.position.set(newX, newY, newZ);
      }
    }
  });

  // Black hole color schemes
  const blackHoleSchemes = [
    {
      core: '#000000', // Black hole itself is always black
      accretion: isDarkMode ? '#ff6b35' : '#ff5722', // Orange accretion disk
      jet: isDarkMode ? '#2196f3' : '#1565c0', // Blue jets
      distortion: isDarkMode ? '#9c27b0' : '#7b1fa2', // Purple distortion
      particles: isDarkMode ? '#ffeb3b' : '#fbc02d' // Yellow particles
    },
    {
      core: '#000000',
      accretion: isDarkMode ? '#e91e63' : '#c2185b', // Pink accretion disk
      jet: isDarkMode ? '#4caf50' : '#388e3c', // Green jets
      distortion: isDarkMode ? '#00bcd4' : '#0097a7', // Cyan distortion
      particles: isDarkMode ? '#ff9800' : '#ef6c00' // Orange particles
    },
    {
      core: '#000000',
      accretion: isDarkMode ? '#9c27b0' : '#7b1fa2', // Purple accretion disk
      jet: isDarkMode ? '#ff6b35' : '#e53935', // Red jets
      distortion: isDarkMode ? '#8bc34a' : '#689f38', // Green distortion
      particles: isDarkMode ? '#00bcd4' : '#0097a7' // Cyan particles
    }
  ];
  
  const colors = blackHoleSchemes[blackHoleType % blackHoleSchemes.length];

  return (
    <group ref={blackHoleRef} position={position}>
      {/* Event horizon - the black hole itself */}
      <mesh ref={eventHorizonRef} position={[0, 0, 0]}>
        <sphereGeometry args={[size * 0.8, 32, 32]} />
        <meshBasicMaterial color={colors.core} />
      </mesh>
      
      {/* Accretion disk - spinning matter */}
      <group ref={accretionDiskRef}>
        {/* Main accretion disk */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 1.2, size * 4, 64]} />
          <meshBasicMaterial 
            color={colors.accretion} 
            transparent 
            opacity={0.8} 
            side={THREE.DoubleSide} 
          />
        </mesh>
        
        {/* Inner hot disk */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 0.9, size * 1.8, 32]} />
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.9} 
            side={THREE.DoubleSide} 
          />
        </mesh>
        
        {/* Outer cooler disk */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 3.5, size * 5.5, 64]} />
          <meshBasicMaterial 
            color={colors.accretion} 
            transparent 
            opacity={0.4} 
            side={THREE.DoubleSide} 
          />
        </mesh>
      </group>
      
      {/* Gravitational distortion rings */}
      <group ref={distortionRingRef}>
        {[...Array(4)].map((_, i) => (
          <mesh 
            key={i} 
            rotation={[Math.PI / 2, 0, i * Math.PI / 4]}
          >
            <torusGeometry args={[size * (2 + i * 0.5), size * 0.02, 4, 32]} />
            <meshBasicMaterial 
              color={colors.distortion} 
              transparent 
              opacity={0.6 - i * 0.1} 
            />
          </mesh>
        ))}
      </group>
      
      {/* Polar jets - relativistic plasma streams */}
      <group ref={jetRef}>
        {/* Top jet */}
        <mesh position={[0, size * 8, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[size * 0.3, size * 12, 8]} />
          <meshBasicMaterial 
            color={colors.jet} 
            transparent 
            opacity={0.7} 
          />
        </mesh>
        
        {/* Bottom jet */}
        <mesh position={[0, -size * 8, 0]}>
          <coneGeometry args={[size * 0.3, size * 12, 8]} />
          <meshBasicMaterial 
            color={colors.jet} 
            transparent 
            opacity={0.7} 
          />
        </mesh>
        
        {/* Jet core streams */}
        <mesh position={[0, size * 6, 0]}>
          <cylinderGeometry args={[size * 0.1, size * 0.05, size * 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, -size * 6, 0]}>
          <cylinderGeometry args={[size * 0.1, size * 0.05, size * 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
      
      {/* Orbiting matter particles - geometric Moebius style */}
      <group ref={particlesRef}>
        {[...Array(16)].map((_, i) => (
          <mesh 
            key={i} 
            position={[
              Math.cos(i * Math.PI / 8) * size * (2 + Math.sin(i) * 0.5),
              Math.sin(i * Math.PI / 12) * size * 0.3,
              Math.sin(i * Math.PI / 8) * size * (2 + Math.cos(i) * 0.5)
            ]}
          >
            <boxGeometry args={[size * 0.08, size * 0.08, size * 0.08]} />
            <meshBasicMaterial color={colors.particles} />
          </mesh>
        ))}
        
        {/* Larger debris chunks */}
        {[...Array(8)].map((_, i) => (
          <mesh 
            key={i} 
            position={[
              Math.cos(i * Math.PI / 4) * size * 3.5,
              Math.sin(i * Math.PI / 6) * size * 0.8,
              Math.sin(i * Math.PI / 4) * size * 3.5
            ]}
          >
            <boxGeometry args={[size * 0.15, size * 0.12, size * 0.18]} />
            <meshBasicMaterial color={colors.accretion} />
          </mesh>
        ))}
      </group>
      
      {/* Photon sphere - light bending visualization */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[size * 1.5, 32, 32]} />
        <meshBasicMaterial 
          color={colors.distortion} 
          transparent 
          opacity={0.1} 
          wireframe={true} 
        />
      </mesh>
      
      {/* Ergosphere - space-time dragging effect */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 6, 0, 0]}>
        <sphereGeometry args={[size * 1.3, 16, 16]} />
        <meshBasicMaterial 
          color={colors.jet} 
          transparent 
          opacity={0.15} 
          wireframe={true} 
        />
      </mesh>
      
      {/* Hawking radiation visualization */}
      {[...Array(24)].map((_, i) => (
        <mesh 
          key={i} 
          position={[
            Math.cos(i * Math.PI / 12) * size * 6,
            Math.sin(i * Math.PI / 18) * size * 2,
            Math.sin(i * Math.PI / 12) * size * 6
          ]}
        >
          <sphereGeometry args={[size * 0.02, 4, 4]} />
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.8} 
          />
        </mesh>
      ))}
      
      {/* Tidal force visualization - stretching effect */}
      <mesh position={[size * 7, 0, 0]} rotation={[0, 0, Math.PI / 2]} scale={[3, 0.3, 1]}>
        <boxGeometry args={[size * 0.3, size * 0.1, size * 0.2]} />
        <meshBasicMaterial 
          color={colors.particles} 
          transparent 
          opacity={0.6} 
        />
      </mesh>
      <mesh position={[-size * 7, 0, 0]} rotation={[0, 0, Math.PI / 2]} scale={[3, 0.3, 1]}>
        <boxGeometry args={[size * 0.3, size * 0.1, size * 0.2]} />
        <meshBasicMaterial 
          color={colors.particles} 
          transparent 
          opacity={0.6} 
        />
      </mesh>
    </group>
  );
}

// Moebius-style flying beer bottle
function FlyingBeerBottle({ position = [0, 0, 0], velocity = [0, 0, 1], size = 1, isDarkMode = false, beerType = 0 }) {
  const beerRef = useRef();
  const wingsRef = useRef();
  const bottleRef = useRef();
  const foamRef = useRef();

  useFrame((state) => {
    if (beerRef.current) {
      // Move through space
      beerRef.current.position.z += velocity[2];
      beerRef.current.position.x += velocity[0] * 0.06;
      beerRef.current.position.y += velocity[1] * 0.06;

      // Flying motion - gentle bobbing
      beerRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8 + position[0] * 0.3) * 0.15;
      beerRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.08;
      beerRef.current.position.y += Math.sin(state.clock.elapsedTime * 1.2 + position[1] * 0.4) * 0.025;

      // Wings flapping
      if (wingsRef.current) {
        const flapSpeed = Math.sin(state.clock.elapsedTime * 6) * 0.3;
        wingsRef.current.rotation.z = flapSpeed;
      }

      // Beer contents sloshing
      if (bottleRef.current) {
        bottleRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.05;
      }

      // Foam bubbling effect
      if (foamRef.current) {
        const bubble = Math.sin(state.clock.elapsedTime * 3) * 0.05 + 1;
        foamRef.current.scale.setScalar(bubble);
      }

      // Reset when out of view
      if (beerRef.current.position.z > 60) {
        const newX = (Math.random() - 0.5) * 60;
        const newY = (Math.random() - 0.5) * 30 + 10;
        const newZ = -120 - Math.random() * 60;
        
        beerRef.current.position.set(newX, newY, newZ);
      }
    }
  });

  // Realistic beer bottle types
  const beerSchemes = [
    {
      bottle: '#4a3728', // Dark brown glass
      liquid: '#d4af37', // Golden beer
      foam: '#fffef7', // Cream foam
      wings: '#ffd700', // Gold wings
      cap: '#2c1810', // Dark brown cap
      label: '#ffffff' // White label
    },
    {
      bottle: '#1a4d1a', // Dark green glass
      liquid: '#ffb347', // Amber beer
      foam: '#f5f5dc', // Beige foam
      wings: '#32cd32', // Green wings
      cap: '#0d2818', // Dark green cap
      label: '#ffffff' // White label
    },
    {
      bottle: '#2f2f2f', // Dark gray glass (stout bottle)
      liquid: '#1a0a00', // Very dark beer (stout)
      foam: '#d2b48c', // Tan foam
      wings: '#708090', // Slate gray wings
      cap: '#000000', // Black cap
      label: '#ffffff' // White label
    },
    {
      bottle: '#8b4513', // Amber glass
      liquid: '#daa520', // Light golden beer
      foam: '#fffacd', // Light cream foam
      wings: '#cd853f', // Peru wings
      cap: '#654321', // Brown cap
      label: '#ffffff' // White label
    }
  ];
  
  const colors = beerSchemes[beerType % beerSchemes.length];

  return (
    <group ref={beerRef} position={position}>
      {/* Realistic Beer Bottle */}
      <group ref={bottleRef}>
        {/* Main bottle body - glass */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[size * 0.32, size * 0.38, size * 1.1, 16]} />
          <meshBasicMaterial color={colors.bottle} transparent opacity={0.3} />
        </mesh>
        
        {/* Bottle shoulder */}
        <mesh position={[0, size * 0.6, 0]}>
          <cylinderGeometry args={[size * 0.15, size * 0.32, size * 0.25, 12]} />
          <meshBasicMaterial color={colors.bottle} transparent opacity={0.3} />
        </mesh>
        
        {/* Bottle neck */}
        <mesh position={[0, size * 0.8, 0]}>
          <cylinderGeometry args={[size * 0.1, size * 0.15, size * 0.3, 12]} />
          <meshBasicMaterial color={colors.bottle} transparent opacity={0.3} />
        </mesh>
        
        {/* Bottle mouth rim */}
        <mesh position={[0, size * 0.98, 0]}>
          <cylinderGeometry args={[size * 0.11, size * 0.11, size * 0.04, 12]} />
          <meshBasicMaterial color={colors.bottle} transparent opacity={0.4} />
        </mesh>
        
        {/* Beer liquid inside */}
        <mesh position={[0, size * -0.05, 0]}>
          <cylinderGeometry args={[size * 0.28, size * 0.34, size * 0.85, 16]} />
          <meshBasicMaterial color={colors.liquid} transparent opacity={0.9} />
        </mesh>
        
        {/* Beer foam/head */}
        <mesh position={[0, size * 0.45, 0]}>
          <cylinderGeometry args={[size * 0.26, size * 0.28, size * 0.15, 12]} />
          <meshBasicMaterial color={colors.foam} transparent opacity={0.8} />
        </mesh>
        
        {/* Bottle cap/cork */}
        <mesh position={[0, size * 1.05, 0]}>
          <cylinderGeometry args={[size * 0.12, size * 0.12, size * 0.1, 8]} />
          <meshBasicMaterial color={colors.cap} />
        </mesh>
        
        {/* Bottle label */}
        <mesh position={[0, size * 0.05, size * 0.33]}>
          <boxGeometry args={[size * 0.45, size * 0.35, size * 0.005]} />
          <meshBasicMaterial color={colors.label} transparent opacity={0.9} />
        </mesh>
        
        {/* Beer brand text on label */}
        <mesh position={[0, size * 0.1, size * 0.335]}>
          <boxGeometry args={[size * 0.3, size * 0.06, size * 0.002]} />
          <meshBasicMaterial color={colors.liquid} />
        </mesh>
        <mesh position={[0, size * 0.0, size * 0.335]}>
          <boxGeometry args={[size * 0.25, size * 0.04, size * 0.002]} />
          <meshBasicMaterial color={colors.liquid} />
        </mesh>
        
        {/* Glass reflection highlights */}
        <mesh position={[size * 0.25, size * 0.2, 0]}>
          <boxGeometry args={[size * 0.03, size * 0.4, size * 0.02]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
        </mesh>
        <mesh position={[size * -0.25, size * 0.2, 0]}>
          <boxGeometry args={[size * 0.03, size * 0.4, size * 0.02]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
        </mesh>
      </group>
      
      {/* Extra foam bubbles escaping */}
      <group ref={foamRef}>
        {/* Foam bubbles floating above */}
        {[...Array(3)].map((_, i) => (
          <mesh 
            key={i} 
            position={[
              (Math.random() - 0.5) * size * 0.2, 
              size * (0.6 + i * 0.08), 
              (Math.random() - 0.5) * size * 0.2
            ]}
          >
            <sphereGeometry args={[size * 0.01, 4, 4]} />
            <meshBasicMaterial color={colors.foam} transparent opacity={0.7} />
          </mesh>
        ))}
      </group>
      
      {/* Simple wings for flying */}
      <group ref={wingsRef}>
        <mesh position={[size * 0.6, size * 0.2, 0]} rotation={[0, 0, Math.PI / 8]}>
          <boxGeometry args={[size * 0.8, size * 0.05, size * 0.3]} />
          <meshBasicMaterial color={colors.wings} />
        </mesh>
        
        <mesh position={[-size * 0.6, size * 0.2, 0]} rotation={[0, 0, -Math.PI / 8]}>
          <boxGeometry args={[size * 0.8, size * 0.05, size * 0.3]} />
          <meshBasicMaterial color={colors.wings} />
        </mesh>
      </group>
    </group>
  );
}

// Moebius-style flying wine bottle
function FlyingWineBottle({ position = [0, 0, 0], velocity = [0, 0, 1], size = 1, isDarkMode = false, wineType = 0 }) {
  const wineRef = useRef();
  const wingsRef = useRef();
  const bottleRef = useRef();

  useFrame((state) => {
    if (wineRef.current) {
      // Move through space
      wineRef.current.position.z += velocity[2];
      wineRef.current.position.x += velocity[0] * 0.05;
      wineRef.current.position.y += velocity[1] * 0.05;

      // Elegant floating motion
      wineRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.6 + position[0] * 0.2) * 0.1;
      wineRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.05;
      wineRef.current.position.y += Math.sin(state.clock.elapsedTime * 1.0 + position[1] * 0.3) * 0.02;

      // Wings flapping gently
      if (wingsRef.current) {
        const flapSpeed = Math.sin(state.clock.elapsedTime * 4) * 0.2;
        wingsRef.current.rotation.z = flapSpeed;
      }

      // Wine sloshing
      if (bottleRef.current) {
        bottleRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
      }

      // Reset when out of view
      if (wineRef.current.position.z > 60) {
        const newX = (Math.random() - 0.5) * 70;
        const newY = (Math.random() - 0.5) * 35 + 15;
        const newZ = -130 - Math.random() * 70;
        
        wineRef.current.position.set(newX, newY, newZ);
      }
    }
  });

  // Wine bottle types
  const wineSchemes = [
    {
      bottle: '#2d4a2d', // Dark green wine bottle
      wine: '#722f37', // Red wine
      cork: '#d2b48c', // Cork color
      wings: '#8b0000', // Dark red wings
      foil: '#ffd700', // Gold foil
      label: '#ffffff' // White label
    },
    {
      bottle: '#1a3d1a', // Very dark green
      wine: '#f5f5dc', // White wine (pale)
      cork: '#deb887', // Light cork
      wings: '#9acd32', // Yellow-green wings
      foil: '#c0c0c0', // Silver foil
      label: '#ffffff' // White label
    },
    {
      bottle: '#2f2f2f', // Dark glass
      wine: '#ffc0cb', // Rosé wine
      cork: '#cd853f', // Peru cork
      wings: '#ff69b4', // Hot pink wings
      foil: '#ff1493', // Deep pink foil
      label: '#ffffff' // White label
    },
    {
      bottle: '#654321', // Brown glass
      wine: '#8b0000', // Dark red wine
      cork: '#f4a460', // Sandy brown cork
      wings: '#800080', // Purple wings
      foil: '#4b0082', // Indigo foil
      label: '#ffffff' // White label
    }
  ];
  
  const colors = wineSchemes[wineType % wineSchemes.length];

  return (
    <group ref={wineRef} position={position}>
      {/* Wine Bottle Body */}
      <group ref={bottleRef}>
        {/* Wine bottle bottom */}
        <mesh position={[0, size * -0.6, 0]}>
          <cylinderGeometry args={[size * 0.35, size * 0.35, size * 0.1, 16]} />
          <meshBasicMaterial color={colors.bottle} transparent opacity={0.4} />
        </mesh>
        
        {/* Main wine bottle body */}
        <mesh position={[0, size * -0.1, 0]}>
          <cylinderGeometry args={[size * 0.32, size * 0.35, size * 1.0, 16]} />
          <meshBasicMaterial color={colors.bottle} transparent opacity={0.4} />
        </mesh>
        
        {/* Bottle shoulder (tapered) */}
        <mesh position={[0, size * 0.5, 0]}>
          <cylinderGeometry args={[size * 0.12, size * 0.32, size * 0.3, 12]} />
          <meshBasicMaterial color={colors.bottle} transparent opacity={0.4} />
        </mesh>
        
        {/* Long wine bottle neck */}
        <mesh position={[0, size * 0.85, 0]}>
          <cylinderGeometry args={[size * 0.08, size * 0.12, size * 0.4, 12]} />
          <meshBasicMaterial color={colors.bottle} transparent opacity={0.4} />
        </mesh>
        
        {/* Wine liquid inside */}
        <mesh position={[0, size * -0.05, 0]}>
          <cylinderGeometry args={[size * 0.28, size * 0.31, size * 0.8, 16]} />
          <meshBasicMaterial color={colors.wine} transparent opacity={0.9} />
        </mesh>
        
        {/* Cork */}
        <mesh position={[0, size * 1.1, 0]}>
          <cylinderGeometry args={[size * 0.07, size * 0.08, size * 0.15, 8]} />
          <meshBasicMaterial color={colors.cork} />
        </mesh>
        
        {/* Foil cap over cork */}
        <mesh position={[0, size * 1.05, 0]}>
          <cylinderGeometry args={[size * 0.09, size * 0.1, size * 0.08, 8]} />
          <meshBasicMaterial color={colors.foil} />
        </mesh>
        
        {/* Wine label */}
        <mesh position={[0, size * 0.1, size * 0.33]}>
          <boxGeometry args={[size * 0.4, size * 0.5, size * 0.005]} />
          <meshBasicMaterial color={colors.label} transparent opacity={0.9} />
        </mesh>
        
        {/* Label text elements */}
        <mesh position={[0, size * 0.25, size * 0.335]}>
          <boxGeometry args={[size * 0.25, size * 0.06, size * 0.002]} />
          <meshBasicMaterial color={colors.wine} />
        </mesh>
        <mesh position={[0, size * 0.15, size * 0.335]}>
          <boxGeometry args={[size * 0.2, size * 0.04, size * 0.002]} />
          <meshBasicMaterial color={colors.wine} />
        </mesh>
        <mesh position={[0, size * -0.05, size * 0.335]}>
          <boxGeometry args={[size * 0.15, size * 0.03, size * 0.002]} />
          <meshBasicMaterial color={colors.wine} />
        </mesh>
        
        {/* Glass reflection highlights */}
        <mesh position={[size * 0.22, size * 0.0, 0]}>
          <boxGeometry args={[size * 0.02, size * 0.6, size * 0.01]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
        </mesh>
      </group>
      
      {/* Elegant wings for flying */}
      <group ref={wingsRef}>
        <mesh position={[size * 0.5, size * 0.1, 0]} rotation={[0, 0, Math.PI / 12]}>
          <boxGeometry args={[size * 0.9, size * 0.04, size * 0.25]} />
          <meshBasicMaterial color={colors.wings} transparent opacity={0.8} />
        </mesh>
        
        <mesh position={[-size * 0.5, size * 0.1, 0]} rotation={[0, 0, -Math.PI / 12]}>
          <boxGeometry args={[size * 0.9, size * 0.04, size * 0.25]} />
          <meshBasicMaterial color={colors.wings} transparent opacity={0.8} />
        </mesh>
        
        {/* Wing details */}
        <mesh position={[size * 0.6, size * 0.1, size * 0.05]} rotation={[0, 0, Math.PI / 12]}>
          <boxGeometry args={[size * 0.15, size * 0.02, size * 0.04]} />
          <meshBasicMaterial color={colors.wings} transparent opacity={0.6} />
        </mesh>
        <mesh position={[-size * 0.6, size * 0.1, size * 0.05]} rotation={[0, 0, -Math.PI / 12]}>
          <boxGeometry args={[size * 0.15, size * 0.02, size * 0.04]} />
          <meshBasicMaterial color={colors.wings} transparent opacity={0.6} />
        </mesh>
      </group>
    </group>
  );
}

// Moebius-style melting Dali clock
function FlyingMeltingClock({ position = [0, 0, 0], velocity = [0, 0, 1], size = 1, isDarkMode = false, clockType = 0 }) {
  const clockRef = useRef();
  const handsRef = useRef();
  const meltRef = useRef();

  useFrame((state) => {
    if (clockRef.current) {
      // Move through space
      clockRef.current.position.z += velocity[2];
      clockRef.current.position.x += velocity[0] * 0.04;
      clockRef.current.position.y += velocity[1] * 0.04;

      // Surreal floating motion
      clockRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + position[0] * 0.1) * 0.2;
      clockRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      clockRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.8 + position[1] * 0.2) * 0.03;

      // Clock hands rotating
      if (handsRef.current) {
        handsRef.current.rotation.z = state.clock.elapsedTime * 0.1; // Slow time
      }

      // Melting oscillation
      if (meltRef.current) {
        const melt = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1;
        meltRef.current.scale.y = melt;
        meltRef.current.position.y = -size * 0.3 * (melt - 1);
      }

      // Reset when out of view
      if (clockRef.current.position.z > 60) {
        const newX = (Math.random() - 0.5) * 90;
        const newY = (Math.random() - 0.5) * 50 + 25;
        const newZ = -150 - Math.random() * 80;
        
        clockRef.current.position.set(newX, newY, newZ);
      }
    }
  });

  // Melting clock color schemes
  const clockSchemes = [
    {
      clock: '#ffd700', // Golden clock
      face: '#fffaf0', // Ivory face
      numbers: '#8b4513', // Brown numbers
      hands: '#2f4f4f', // Dark slate hands
      melt: '#daa520', // Golden melt
      accent: '#ff4500' // Orange red accent
    },
    {
      clock: '#c0c0c0', // Silver clock
      face: '#f5f5f5', // White smoke face
      numbers: '#000000', // Black numbers
      hands: '#4169e1', // Royal blue hands
      melt: '#a9a9a9', // Dark gray melt
      accent: '#8a2be2' // Blue violet accent
    },
    {
      clock: '#cd853f', // Peru clock
      face: '#ffefd5', // Papaya whip face
      numbers: '#8b0000', // Dark red numbers
      hands: '#006400', // Dark green hands
      melt: '#d2691e', // Chocolate melt
      accent: '#dc143c' // Crimson accent
    },
    {
      clock: '#708090', // Slate gray clock
      face: '#f0f8ff', // Alice blue face
      numbers: '#191970', // Midnight blue numbers
      hands: '#b22222', // Fire brick hands
      melt: '#696969', // Dim gray melt
      accent: '#ff69b4' // Hot pink accent
    }
  ];
  
  const colors = clockSchemes[clockType % clockSchemes.length];

  return (
    <group ref={clockRef} position={position}>
      {/* Main Clock Body */}
      <group>
        {/* Clock face (circular) */}
        <mesh position={[0, size * 0.2, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[size * 0.4, size * 0.4, size * 0.08, 24]} />
          <meshBasicMaterial color={colors.clock} />
        </mesh>
        
        {/* Clock face surface */}
        <mesh position={[0, size * 0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[size * 0.35, 24]} />
          <meshBasicMaterial color={colors.face} />
        </mesh>
        
        {/* Clock numbers (12, 3, 6, 9) */}
        <mesh position={[0, size * 0.26, size * 0.28]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[size * 0.06, size * 0.02, size * 0.08]} />
          <meshBasicMaterial color={colors.numbers} />
        </mesh>
        <mesh position={[size * 0.28, size * 0.26, 0]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
          <boxGeometry args={[size * 0.06, size * 0.02, size * 0.08]} />
          <meshBasicMaterial color={colors.numbers} />
        </mesh>
        <mesh position={[0, size * 0.26, -size * 0.28]} rotation={[Math.PI / 2, 0, Math.PI]}>
          <boxGeometry args={[size * 0.06, size * 0.02, size * 0.08]} />
          <meshBasicMaterial color={colors.numbers} />
        </mesh>
        <mesh position={[-size * 0.28, size * 0.26, 0]} rotation={[Math.PI / 2, 0, -Math.PI / 2]}>
          <boxGeometry args={[size * 0.06, size * 0.02, size * 0.08]} />
          <meshBasicMaterial color={colors.numbers} />
        </mesh>
        
        {/* Clock hands */}
        <group ref={handsRef} position={[0, size * 0.27, 0]}>
          {/* Hour hand */}
          <mesh position={[0, 0, size * 0.12]} rotation={[Math.PI / 2, 0, 0]}>
            <boxGeometry args={[size * 0.03, size * 0.02, size * 0.15]} />
            <meshBasicMaterial color={colors.hands} />
          </mesh>
          {/* Minute hand */}
          <mesh position={[size * 0.15, 0, 0]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
            <boxGeometry args={[size * 0.02, size * 0.02, size * 0.2]} />
            <meshBasicMaterial color={colors.hands} />
          </mesh>
          {/* Center dot */}
          <mesh>
            <sphereGeometry args={[size * 0.03, 8, 8]} />
            <meshBasicMaterial color={colors.hands} />
          </mesh>
        </group>
      </group>

      {/* Melting/Draping Parts */}
      <group ref={meltRef}>
        {/* Main melting drape */}
        <mesh position={[0, size * -0.2, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[size * 0.15, size * 0.4, size * 0.6, 12]} />
          <meshBasicMaterial color={colors.melt} />
        </mesh>
        
        {/* Draping blob at bottom */}
        <mesh position={[0, size * -0.6, 0]}>
          <sphereGeometry args={[size * 0.2, 12, 8]} />
          <meshBasicMaterial color={colors.melt} />
        </mesh>
        
        {/* Side drips */}
        <mesh position={[size * 0.3, size * -0.1, 0]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[size * 0.06, size * 0.12, size * 0.3, 8]} />
          <meshBasicMaterial color={colors.melt} />
        </mesh>
        <mesh position={[-size * 0.3, size * -0.1, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <cylinderGeometry args={[size * 0.06, size * 0.12, size * 0.3, 8]} />
          <meshBasicMaterial color={colors.melt} />
        </mesh>
        
        {/* Melting clock edge details */}
        <mesh position={[size * 0.25, size * 0.05, 0]} rotation={[0, 0, Math.PI / 6]}>
          <boxGeometry args={[size * 0.08, size * 0.04, size * 0.15]} />
          <meshBasicMaterial color={colors.clock} />
        </mesh>
        <mesh position={[-size * 0.25, size * 0.05, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <boxGeometry args={[size * 0.08, size * 0.04, size * 0.15]} />
          <meshBasicMaterial color={colors.clock} />
        </mesh>
      </group>
      
      {/* Surreal floating accent pieces */}
      <mesh position={[size * 0.6, size * 0.4, size * 0.2]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <boxGeometry args={[size * 0.05, size * 0.05, size * 0.1]} />
        <meshBasicMaterial color={colors.accent} />
      </mesh>
      <mesh position={[-size * 0.6, size * 0.3, -size * 0.2]} rotation={[-Math.PI / 4, -Math.PI / 4, 0]}>
        <sphereGeometry args={[size * 0.03, 6, 6]} />
        <meshBasicMaterial color={colors.accent} />
      </mesh>
    </group>
  );
}

// Moebius-style flying astronaut
function FlyingAstronaut({ position = [0, 0, 0], velocity = [0, 0, 1], size = 1, isDarkMode = false, astronautType = 0 }) {
  const astronautRef = useRef();
  const jetpackRef = useRef();
  const limbbRef = useRef();

  useFrame((state) => {
    if (astronautRef.current) {
      // Oscillating movement from left to right and bottom to top
      const time = state.clock.elapsedTime;
      
      // Left-right oscillation across the screen
      astronautRef.current.position.x = Math.sin(time * 0.3) * 25; // -25 to +25
      
      // Up-down oscillation across the screen  
      astronautRef.current.position.y = Math.sin(time * 0.2) * 15; // -15 to +15
      
      // Keep depth constant
      astronautRef.current.position.z = -20;

      // Floating astronaut motion (subtle rotation)
      astronautRef.current.rotation.z = Math.sin(time * 0.7) * 0.15;
      astronautRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;

      // Jetpack thrust animation
      if (jetpackRef.current) {
        const thrust = Math.sin(time * 12) * 0.1 + 1;
        jetpackRef.current.scale.setScalar(thrust);
      }

      // Limb movements (floating motion)
      if (limbbRef.current) {
        limbbRef.current.rotation.z = Math.sin(time * 2) * 0.2;
      }
    }
  });

  // Astronaut color schemes
  const astronautSchemes = [
    {
      suit: '#f0f0f0', // White suit
      helmet: '#e6e6fa', // Lavender helmet
      visor: '#4169e1', // Royal blue visor
      details: '#ff4500', // Orange details
      jetpack: '#708090', // Slate gray jetpack
      thrust: '#00bfff' // Deep sky blue thrust
    },
    {
      suit: '#fffaf0', // Floral white suit
      helmet: '#f5f5dc', // Beige helmet
      visor: '#2e8b57', // Sea green visor
      details: '#dc143c', // Crimson details
      jetpack: '#2f4f4f', // Dark slate jetpack
      thrust: '#ff6347' // Tomato thrust
    },
    {
      suit: '#f8f8ff', // Ghost white suit
      helmet: '#dcdcdc', // Gainsboro helmet
      visor: '#8a2be2', // Blue violet visor
      details: '#ffd700', // Gold details
      jetpack: '#696969', // Dim gray jetpack
      thrust: '#32cd32' // Lime green thrust
    }
  ];
  
  const colors = astronautSchemes[astronautType % astronautSchemes.length];

  return (
    <group ref={astronautRef} position={position}>
      {/* Astronaut Body */}
      <group>
        {/* Main torso */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[size * 0.3, size * 0.35, size * 0.8, 12]} />
          <meshBasicMaterial color={colors.suit} />
        </mesh>
        
        {/* Chest control panel */}
        <mesh position={[0, size * 0.1, size * 0.32]}>
          <boxGeometry args={[size * 0.4, size * 0.3, size * 0.05]} />
          <meshBasicMaterial color={colors.details} />
        </mesh>
        
        {/* Control panel buttons */}
        {[...Array(6)].map((_, i) => (
          <mesh 
            key={i}
            position={[
              (i % 3 - 1) * size * 0.1, 
              size * (0.15 - Math.floor(i / 3) * 0.1), 
              size * 0.35
            ]}
          >
            <cylinderGeometry args={[size * 0.02, size * 0.02, size * 0.01, 8]} />
            <meshBasicMaterial color={i % 2 ? '#ff0000' : '#00ff00'} />
          </mesh>
        ))}
        
        {/* Helmet */}
        <mesh position={[0, size * 0.7, 0]}>
          <sphereGeometry args={[size * 0.25, 16, 12]} />
          <meshBasicMaterial color={colors.helmet} transparent opacity={0.9} />
        </mesh>
        
        {/* Helmet visor */}
        <mesh position={[0, size * 0.75, size * 0.15]}>
          <sphereGeometry args={[size * 0.22, 16, 8]} />
          <meshBasicMaterial color={colors.visor} transparent opacity={0.7} />
        </mesh>
        
        {/* Helmet antenna */}
        <mesh position={[size * 0.15, size * 0.9, 0]} rotation={[0, 0, Math.PI / 6]}>
          <cylinderGeometry args={[size * 0.01, size * 0.01, size * 0.1, 6]} />
          <meshBasicMaterial color={colors.details} />
        </mesh>
      </group>

      {/* Arms and Legs */}
      <group ref={limbbRef}>
        {/* Right arm */}
        <mesh position={[size * 0.4, size * 0.15, 0]} rotation={[0, 0, Math.PI / 6]}>
          <cylinderGeometry args={[size * 0.08, size * 0.08, size * 0.4, 8]} />
          <meshBasicMaterial color={colors.suit} />
        </mesh>
        
        {/* Left arm */}
        <mesh position={[-size * 0.4, size * 0.15, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <cylinderGeometry args={[size * 0.08, size * 0.08, size * 0.4, 8]} />
          <meshBasicMaterial color={colors.suit} />
        </mesh>
        
        {/* Right leg */}
        <mesh position={[size * 0.15, size * -0.6, 0]} rotation={[Math.PI / 12, 0, 0]}>
          <cylinderGeometry args={[size * 0.1, size * 0.1, size * 0.5, 8]} />
          <meshBasicMaterial color={colors.suit} />
        </mesh>
        
        {/* Left leg */}
        <mesh position={[-size * 0.15, size * -0.6, 0]} rotation={[-Math.PI / 12, 0, 0]}>
          <cylinderGeometry args={[size * 0.1, size * 0.1, size * 0.5, 8]} />
          <meshBasicMaterial color={colors.suit} />
        </mesh>
        
        {/* Gloves */}
        <mesh position={[size * 0.55, size * 0.05, 0]}>
          <sphereGeometry args={[size * 0.08, 8, 8]} />
          <meshBasicMaterial color={colors.suit} />
        </mesh>
        <mesh position={[-size * 0.55, size * 0.05, 0]}>
          <sphereGeometry args={[size * 0.08, 8, 8]} />
          <meshBasicMaterial color={colors.suit} />
        </mesh>
        
        {/* Boots */}
        <mesh position={[size * 0.15, size * -0.9, 0]}>
          <boxGeometry args={[size * 0.12, size * 0.15, size * 0.2]} />
          <meshBasicMaterial color={colors.details} />
        </mesh>
        <mesh position={[-size * 0.15, size * -0.9, 0]}>
          <boxGeometry args={[size * 0.12, size * 0.15, size * 0.2]} />
          <meshBasicMaterial color={colors.details} />
        </mesh>
      </group>
      
      {/* Jetpack */}
      <mesh position={[0, size * 0.1, -size * 0.4]}>
        <boxGeometry args={[size * 0.35, size * 0.6, size * 0.2]} />
        <meshBasicMaterial color={colors.jetpack} />
      </mesh>
      
      {/* Jetpack thrusters */}
      <group ref={jetpackRef}>
        <mesh position={[-size * 0.1, size * -0.3, -size * 0.55]}>
          <cylinderGeometry args={[size * 0.04, size * 0.06, size * 0.15, 8]} />
          <meshBasicMaterial color={colors.thrust} transparent opacity={0.8} />
        </mesh>
        <mesh position={[size * 0.1, size * -0.3, -size * 0.55]}>
          <cylinderGeometry args={[size * 0.04, size * 0.06, size * 0.15, 8]} />
          <meshBasicMaterial color={colors.thrust} transparent opacity={0.8} />
        </mesh>
      </group>
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

  const monkeyDelivery = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 130,
        (Math.random() - 0.5) * 25 + 5, // Lower altitude for ground-level delivery
        -280 - i * 90 - Math.random() * 70 // Medium distance back positions
      ],
      velocity: [
        (Math.random() - 0.5) * 0.08,
        (Math.random() - 0.5) * 0.04,
        0.85 // Fast delivery speed but not too fast
      ],
      size: Math.random() * 0.2 + 1.0, // Good size for monkey and scooter
      type: i % 3 // Different monkey delivery color schemes
    }));
  }, []);

  const alienSkateboarders = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 140,
        (Math.random() - 0.5) * 25 + 8, // Slightly elevated for skateboard tricks
        -200 - i * 85 - Math.random() * 60 // Medium distance positions
      ],
      velocity: [
        (Math.random() - 0.5) * 0.09,
        (Math.random() - 0.5) * 0.05,
        0.9 // Fast skateboard speed
      ],
      size: Math.random() * 0.3 + 1.1, // Good size for alien skateboarder
      type: i % 3 // Different alien color schemes
    }));
  }, []);

  const alienScooterRiders = useMemo(() => {
    return Array.from({ length: 2 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 125,
        (Math.random() - 0.5) * 20 + 3, // Lower altitude for scooter riding
        -240 - i * 100 - Math.random() * 80 // Spread out initial positions
      ],
      velocity: [
        (Math.random() - 0.5) * 0.08,
        (Math.random() - 0.5) * 0.04,
        0.8 // Moderate scooter speed
      ],
      size: Math.random() * 0.25 + 1.0, // Good size for alien on scooter
      type: i % 3 // Different alien scooter color schemes
    }));
  }, []);

  const planets = useMemo(() => {
    return Array.from({ length: 2 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() < 0.5 ? -1 : 1) * (180 + Math.random() * 120), // Spawn from far sides
        (Math.random() - 0.5) * 80 + 20, // Varied altitudes for planets
        -800 - i * 300 - Math.random() * 200 // Very far back positions for gradual approach
      ],
      velocity: [
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.01,
        0.15 + Math.random() * 0.1 // Slow planetary movement
      ],
      size: Math.random() * 1.5 + 2.5, // Large planet sizes (2.5-4)
      type: i % 3 // Different planet color schemes
    }));
  }, []);

  const gasGiants = useMemo(() => {
    return Array.from({ length: 2 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() < 0.5 ? -1 : 1) * (220 + Math.random() * 150), // Even farther spawn points
        (Math.random() - 0.5) * 100 + 30, // Higher varied altitudes
        -1200 - i * 400 - Math.random() * 300 // Extremely far back for massive scale impression
      ],
      velocity: [
        (Math.random() - 0.5) * 0.015,
        (Math.random() - 0.5) * 0.008,
        0.12 + Math.random() * 0.08 // Very slow gas giant movement for scale
      ],
      size: Math.random() * 2 + 4, // Very large gas giant sizes (4-6)
      type: i % 3 // Different gas giant color schemes
    }));
  }, []);

  const shootingStars = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() < 0.5 ? -1 : 1) * (300 + Math.random() * 100), // Start from screen edges
        (Math.random() - 0.5) * 200, // Random heights
        -400 - Math.random() * 200 // Start from behind
      ],
      velocity: [
        (Math.random() < 0.5 ? -1 : 1) * (1.5 + Math.random() * 2), // Fast horizontal movement
        (Math.random() - 0.5) * 1.5, // Vertical movement
        2.5 + Math.random() * 1.5 // Fast forward movement
      ],
      size: Math.random() * 0.05 + 0.08, // Small shooting star sizes
      type: i % 3 // Different shooting star colors
    }));
  }, []);

  const satellites = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 160,
        (Math.random() - 0.5) * 50 + 15, // Medium altitudes for orbital objects
        -350 - i * 120 - Math.random() * 100 // Staggered positions
      ],
      velocity: [
        (Math.random() - 0.5) * 0.06,
        (Math.random() - 0.5) * 0.03,
        0.6 + Math.random() * 0.2 // Medium satellite speed
      ],
      size: Math.random() * 0.4 + 0.8, // Small to medium satellite sizes
      type: i % 3 // Different satellite color schemes
    }));
  }, []);

  const spaceStations = useMemo(() => {
    return Array.from({ length: 2 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() < 0.5 ? -1 : 1) * (200 + Math.random() * 100), // Spawn from far sides
        (Math.random() - 0.5) * 80 + 25, // Higher altitudes for stations
        -600 - i * 250 - Math.random() * 150 // Very far back for grand scale
      ],
      velocity: [
        (Math.random() - 0.5) * 0.04,
        (Math.random() - 0.5) * 0.02,
        0.25 + Math.random() * 0.15 // Slow majestic station movement
      ],
      size: Math.random() * 1 + 2.5, // Large space station sizes (2.5-3.5)
      type: i % 3 // Different space station color schemes
    }));
  }, []);

  const blackHoles = useMemo(() => {
    return Array.from({ length: 1 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() < 0.5 ? -1 : 1) * (250 + Math.random() * 150), // Spawn from extreme distances
        (Math.random() - 0.5) * 120, // Varied altitudes across the entire space
        -2000 - Math.random() * 1000 // Extremely far back for dramatic approach over time
      ],
      velocity: [
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.01,
        0.08 + Math.random() * 0.04 // Very slow black hole movement for epic scale
      ],
      size: Math.random() * 2 + 4, // Massive black hole sizes (4-6)
      type: i % 3 // Different black hole color schemes
    }));
  }, []);

  const flyingBearBottles = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 60, // Much closer to center horizontally
        (Math.random() - 0.5) * 30 + 10, // Closer to center vertically
        -80 - i * 25 - Math.random() * 30 // Much closer starting positions
      ],
      velocity: [
        (Math.random() - 0.5) * 0.04, // Slower horizontal movement to stay near center
        (Math.random() - 0.5) * 0.02, // Slower vertical movement
        0.4 + Math.random() * 0.2 // Slower forward speed to stay visible longer
      ],
      size: Math.random() * 0.8 + 1.8, // Much larger bear bottle sizes (1.8-2.6)
      type: i % 3 // Different bear bottle color schemes
    }));
  }, []);

  const flyingWineBottles = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 80, // Spread out more than beer bottles
        (Math.random() - 0.5) * 40 + 20, // Higher up in the scene
        -100 - i * 35 - Math.random() * 40 // Different spacing from beer bottles
      ],
      velocity: [
        (Math.random() - 0.5) * 0.03, // Slower, more elegant movement
        (Math.random() - 0.5) * 0.015, // Very gentle vertical movement
        0.3 + Math.random() * 0.15 // Slower forward speed for elegance
      ],
      size: Math.random() * 0.6 + 1.2, // Wine bottle sizes (1.2-1.8)
      type: i % 4 // Different wine types
    }));
  }, []);

  const flyingMeltingClocks = useMemo(() => {
    return Array.from({ length: 2 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 100, // Wide spread across scene
        (Math.random() - 0.5) * 60 + 30, // Higher up for surreal effect
        -120 - i * 50 - Math.random() * 60 // Spaced out timing
      ],
      velocity: [
        (Math.random() - 0.5) * 0.025, // Very slow, dreamlike movement
        (Math.random() - 0.5) * 0.01, // Minimal vertical drift
        0.25 + Math.random() * 0.1 // Slow, hypnotic forward motion
      ],
      size: Math.random() * 0.5 + 0.8, // Clock sizes (0.8-1.3)
      type: i % 4 // Different melting clock styles
    }));
  }, []);

  const flyingAstronauts = useMemo(() => {
    return Array.from({ length: 1 }, (_, i) => ({
      id: i,
      position: [
        -25, // Start at left edge
        -15, // Start at bottom
        -20 // Visible depth
      ],
      velocity: [
        0.08, // Faster horizontal movement
        0.05, // Moderate vertical movement  
        0 // No forward/backward movement
      ],
      size: 5.0, // Even bigger astronaut size!
      type: i % 3 // Different astronaut suit styles
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

      {/* Monkey Pizza Delivery */}
      {monkeyDelivery.map((monkey) => (
        <MonkeyPizzaDelivery
          key={`monkey-${monkey.id}`}
          position={monkey.position}
          velocity={monkey.velocity}
          size={monkey.size}
          isDarkMode={isDarkMode}
          monkeyType={monkey.type}
        />
      ))}

      {/* Alien Skateboarders */}
      {alienSkateboarders.map((skater) => (
        <AlienSkateboarder
          key={`skater-${skater.id}`}
          position={skater.position}
          velocity={skater.velocity}
          size={skater.size}
          isDarkMode={isDarkMode}
          alienType={skater.type}
        />
      ))}

      {/* Alien Scooter Riders */}
      {alienScooterRiders.map((rider) => (
        <AlienScooterRider
          key={`scooter-${rider.id}`}
          position={rider.position}
          velocity={rider.velocity}
          size={rider.size}
          isDarkMode={isDarkMode}
          alienType={rider.type}
        />
      ))}

      {/* Moebius Planets */}
      {planets.map((planet) => (
        <MoebiusPlanet
          key={`planet-${planet.id}`}
          position={planet.position}
          velocity={planet.velocity}
          size={planet.size}
          isDarkMode={isDarkMode}
          planetType={planet.type}
        />
      ))}

      {/* Gas Giants */}
      {gasGiants.map((giant) => (
        <MoebiusGasGiant
          key={`giant-${giant.id}`}
          position={giant.position}
          velocity={giant.velocity}
          size={giant.size}
          isDarkMode={isDarkMode}
          giantType={giant.type}
        />
      ))}

      {/* Shooting Stars */}
      {shootingStars.map((star) => (
        <ShootingStar
          key={`star-${star.id}`}
          position={star.position}
          velocity={star.velocity}
          size={star.size}
          isDarkMode={isDarkMode}
          starType={star.type}
        />
      ))}

      {/* Satellites */}
      {satellites.map((satellite) => (
        <MoebiusSatellite
          key={`satellite-${satellite.id}`}
          position={satellite.position}
          velocity={satellite.velocity}
          size={satellite.size}
          isDarkMode={isDarkMode}
          satelliteType={satellite.type}
        />
      ))}

      {/* Space Stations */}
      {spaceStations.map((station) => (
        <MoebiusSpaceStation
          key={`station-${station.id}`}
          position={station.position}
          velocity={station.velocity}
          size={station.size}
          isDarkMode={isDarkMode}
          stationType={station.type}
        />
      ))}

      {/* Black Holes */}
      {blackHoles.map((blackHole) => (
        <MoebiusBlackHole
          key={`blackhole-${blackHole.id}`}
          position={blackHole.position}
          velocity={blackHole.velocity}
          size={blackHole.size}
          isDarkMode={isDarkMode}
          blackHoleType={blackHole.type}
        />
      ))}

      {/* Flying Beer Bottles */}
      {flyingBearBottles.map((beerBottle) => (
        <FlyingBeerBottle
          key={`beer-${beerBottle.id}`}
          position={beerBottle.position}
          velocity={beerBottle.velocity}
          size={beerBottle.size}
          isDarkMode={isDarkMode}
          beerType={beerBottle.type}
        />
      ))}

      {/* Flying Wine Bottles */}
      {flyingWineBottles.map((wineBottle) => (
        <FlyingWineBottle
          key={`wine-${wineBottle.id}`}
          position={wineBottle.position}
          velocity={wineBottle.velocity}
          size={wineBottle.size}
          isDarkMode={isDarkMode}
          wineType={wineBottle.type}
        />
      ))}

      {/* Flying Melting Clocks */}
      {flyingMeltingClocks.map((clock) => (
        <FlyingMeltingClock
          key={`clock-${clock.id}`}
          position={clock.position}
          velocity={clock.velocity}
          size={clock.size}
          isDarkMode={isDarkMode}
          clockType={clock.type}
        />
      ))}

      {/* Flying Astronauts */}
      {flyingAstronauts.map((astronaut) => (
        <FlyingAstronaut
          key={`astronaut-${astronaut.id}`}
          position={astronaut.position}
          velocity={astronaut.velocity}
          size={astronaut.size}
          isDarkMode={isDarkMode}
          astronautType={astronaut.type}
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