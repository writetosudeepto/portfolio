import React, { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

// Minecraft-style block asteroid
function MinecraftBlock({ position = [0, 0, 0], speed = 0.1, size = 0.2, blockType = 'stone' }) {
  const blockRef = useRef();
  const trailRefs = useRef([]);
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.getAttribute('data-theme') === 'dark'
  );

  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.getAttribute('data-theme') === 'dark');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  const blockColors = {
    // Light mode colors (much more vibrant and visible)
    light: {
      stone: '#2a2a2a',      // Much darker gray - very visible
      cobblestone: '#1a1a1a', // Almost black - maximum contrast
      dirt: '#4a2c00',       // Very dark brown
      grass: '#1b3d0f',      // Very dark green
      diamond: '#0d47a1',    // Deep blue
      emerald: '#004d40',    // Very dark teal
      iron: '#424242',       // Dark gray
      gold: '#d84315'        // Dark red-orange
    },
    // Dark mode colors (original bright colors)
    dark: {
      stone: '#7a7a7a',
      cobblestone: '#6b6b6b', 
      dirt: '#8b6914',
      grass: '#6cb33f',
      diamond: '#4dd0e1',
      emerald: '#00c851',
      iron: '#d1d1d1',
      gold: '#ffb300'
    }
  };

  const currentColors = isDarkMode ? blockColors.dark : blockColors.light;

  useFrame(() => {
    if (blockRef.current) {
      // Move block diagonally
      blockRef.current.position.x -= speed;
      blockRef.current.position.y -= speed * 0.4;
      
      // Minecraft-style slow rotation (15-degree increments)
      blockRef.current.rotation.y += Math.PI / 12 * 0.02; // More visible rotation
      
      // Reset position when off screen - ensure continuous flow
      if (blockRef.current.position.x < -120) {
        blockRef.current.position.x = Math.random() * 40 + 100; // Randomize re-entry
        blockRef.current.position.y = Math.random() * 100 - 50;
        blockRef.current.position.z = Math.random() * -80 - 10;
      }
      
      // Also reset if blocks go too far up or down
      if (blockRef.current.position.y < -60 || blockRef.current.position.y > 60) {
        blockRef.current.position.y = Math.random() * 100 - 50;
        blockRef.current.position.x = Math.random() * 40 + 100;
      }
    }

    // Animate trailing particles
    trailRefs.current.forEach((trail, index) => {
      if (trail) {
        trail.position.x = blockRef.current.position.x + (index + 1) * 2;
        trail.position.y = blockRef.current.position.y + (index + 1) * 0.8;
        trail.scale.setScalar(0.8 - index * 0.2);
      }
    });
  });

  // Trail colors for different themes
  const trailColor = isDarkMode ? '#4dd0e1' : '#0d47a1'; // Darker blue for better visibility

  return (
    <group>
      {/* Main Minecraft block */}
      <mesh ref={blockRef} position={position}>
        <boxGeometry args={[size, size, size]} />
        <meshLambertMaterial 
          color={currentColors[blockType]}
          transparent={false}
          flatShading={true}
          emissive={isDarkMode ? '#000000' : currentColors[blockType]}
          emissiveIntensity={isDarkMode ? 0 : 0.1}
        />
      </mesh>
      
      {/* Pixelated trail particles */}
      {[0, 1, 2].map((index) => (
        <mesh 
          key={index}
          ref={el => trailRefs.current[index] = el}
          position={[position[0] + (index + 1) * 2, position[1] + (index + 1) * 0.8, position[2]]}
        >
          <boxGeometry args={[size * 0.3, size * 0.3, size * 0.3]} />
          <meshBasicMaterial 
            color={trailColor}
            transparent
            opacity={0.7 - index * 0.2}
            flatShading={true}
          />
        </mesh>
      ))}
    </group>
  );
}

// Simplified stars component
function CustomStars({ count = 200 }) {
  const starsRef = useRef();
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.getAttribute('data-theme') === 'dark'
  );

  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.getAttribute('data-theme') === 'dark');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);
  
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  // Theme-based star colors
  const starColor = isDarkMode ? "#ffffff" : "#1a1a1a"; // Much darker for better visibility
  const starOpacity = isDarkMode ? 0.6 : 1.0; // Full opacity for light mode

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        color={starColor}
        size={1} 
        transparent
        opacity={starOpacity}
      />
    </points>
  );
}

// Main Minecraft space scene
function SpaceScene() {
  const blockTypes = ['stone', 'cobblestone', 'dirt', 'grass', 'diamond', 'emerald', 'iron', 'gold'];
  
  const minecraftBlocks = useMemo(() => {
    const blocks = [];
    
    // Create blocks distributed across different viewport areas
    for (let i = 0; i < 60; i++) {
      blocks.push({
        key: `block-${i}`,
        position: [
          Math.random() * 300 - 150, // Much wider spawn area
          Math.random() * 200 - 100, // Much taller spawn area  
          Math.random() * -150 - 10  // Much deeper spawn area
        ],
        speed: Math.random() * 0.6 + 0.15, // Even faster speeds
        size: Math.random() * 1.0 + 0.5,   // Larger blocks
        blockType: blockTypes[Math.floor(Math.random() * blockTypes.length)]
      });
    }
    
    return blocks;
  }, [blockTypes]);

  return (
    <Suspense fallback={null}>
      {/* Minecraft-style lighting (flat, minimal shadows) */}
      <ambientLight intensity={0.8} />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={0.4}
        color="#ffffff"
        castShadow={false}
      />
      
      <CustomStars count={150} />
      
      {minecraftBlocks.map(block => (
        <MinecraftBlock
          key={block.key}
          position={block.position}
          speed={block.speed}
          size={block.size}
          blockType={block.blockType}
        />
      ))}
      
      <Stars
        radius={400}
        depth={100}
        count={800}
        factor={4}
        saturation={0}
        fade={true}
        speed={0.3}
      />
    </Suspense>
  );
}

const SpaceBackground = () => {
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
          position: [0, 0, 20],    // Moved camera further back
          fov: 75,                // Wider field of view
          near: 0.1,
          far: 500
        }}
        style={{ background: 'transparent' }}
        onError={(error) => console.error('Canvas error:', error)}
      >
        <SpaceScene />
      </Canvas>
    </div>
  );
};

export default SpaceBackground;