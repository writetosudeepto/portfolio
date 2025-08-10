import React, { useEffect, useRef, useState } from 'react';
import './MeteorEffect.scss';

const MeteorEffect = ({ intensity = 'normal' }) => {
  const canvasRef = useRef(null);
  const meteorsRef = useRef([]);
  const animationRef = useRef();
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Mathematical shape generators
  const generateKleinBottle = (t, scale = 1) => {
    const u = t * Math.PI * 2;
    const v = t * Math.PI;
    const x = (2 + Math.cos(v / 2) * Math.sin(u) - Math.sin(v / 2) * Math.sin(2 * u)) * scale;
    const y = (Math.sin(v / 2) * Math.sin(u) + Math.cos(v / 2) * Math.sin(2 * u)) * scale;
    return { x: isNaN(x) ? 0 : x, y: isNaN(y) ? 0 : y };
  };

  const generateTorus = (t, scale = 1) => {
    const R = 3;
    const r = 1;
    const u = t * Math.PI * 2;
    const v = t * Math.PI * 4;
    const x = (R + r * Math.cos(v)) * Math.cos(u) * scale;
    const y = (R + r * Math.cos(v)) * Math.sin(u) * scale;
    const z = r * Math.sin(v) * scale;
    return { x: isNaN(x) ? 0 : x, y: isNaN(y) ? 0 : y, z: isNaN(z) ? 0 : z };
  };

  const generateMobiusStrip = (t, scale = 1) => {
    const u = t * Math.PI * 2;
    const v = (t - 0.5) * 2;
    const x = (1 + v / 2 * Math.cos(u / 2)) * Math.cos(u) * scale;
    const y = (1 + v / 2 * Math.cos(u / 2)) * Math.sin(u) * scale;
    const z = v / 2 * Math.sin(u / 2) * scale;
    return { x: isNaN(x) ? 0 : x, y: isNaN(y) ? 0 : y, z: isNaN(z) ? 0 : z };
  };

  const generateHypercube = (t, scale = 1) => {
    const angle = t * Math.PI * 2;
    const vertices = [];
    // Generate 4D hypercube vertices projected to 2D
    for (let i = 0; i < 16; i++) {
      const x = ((i & 1) ? 1 : -1) * scale;
      const y = ((i & 2) ? 1 : -1) * scale;
      const z = ((i & 4) ? 1 : -1) * scale;
      const w = ((i & 8) ? 1 : -1) * scale;
      
      // 4D to 2D projection
      const projX = x + z * Math.cos(angle) + w * Math.sin(angle);
      const projY = y + z * Math.sin(angle) - w * Math.cos(angle);
      vertices.push({ x: projX, y: projY });
    }
    return vertices[Math.floor(t * 15.999)] || { x: 0, y: 0 };
  };

  const generateFractal = (t, scale = 1, iterations = 3) => {
    let x = 0, y = 0;
    let z = { x: t * 2 - 1, y: t * 2 - 1 };
    
    // Julia set computation
    for (let i = 0; i < iterations; i++) {
      const xtemp = z.x * z.x - z.y * z.y + 0.285;
      z.y = 2 * z.x * z.y + 0.01;
      z.x = xtemp;
      
      if (z.x * z.x + z.y * z.y > 4) break;
    }
    
    return { x: isNaN(z.x) ? 0 : z.x * scale, y: isNaN(z.y) ? 0 : z.y * scale };
  };

  const createMeteor = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const shapeTypes = ['klein', 'torus', 'mobius', 'hypercube', 'fractal', 'cube'];
    const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    
    return {
      x: Math.random() * canvas.width,
      y: -50,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 8 + 4,
      size: Math.random() * 20 + 10,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      color: isDarkTheme 
        ? `hsl(${Math.random() * 60 + 180}, 70%, 60%)` // Blue/cyan for dark theme
        : `hsl(${Math.random() * 60 + 300}, 80%, 40%)`, // Purple/magenta for light theme
      shapeType,
      life: 1.0,
      trail: [],
      morphTime: 0,
      complexity: Math.floor(Math.random() * 5) + 3,
    };
  };

  const drawComplexShape = (ctx, meteor) => {
    ctx.save();
    ctx.translate(meteor.x, meteor.y);
    ctx.rotate(meteor.rotation);
    ctx.globalAlpha = meteor.life;

    const scale = meteor.size / 20;
    const time = meteor.morphTime;

    switch (meteor.shapeType) {
      case 'klein':
        ctx.beginPath();
        for (let i = 0; i < meteor.complexity * 10; i++) {
          const t = i / (meteor.complexity * 10);
          const point = generateKleinBottle(t, scale * 10);
          if (point && typeof point.x === 'number' && typeof point.y === 'number') {
            if (i === 0) ctx.moveTo(point.x, point.y);
            else ctx.lineTo(point.x, point.y);
          }
        }
        ctx.strokeStyle = meteor.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        break;

      case 'torus':
        ctx.beginPath();
        for (let i = 0; i < meteor.complexity * 8; i++) {
          const t = i / (meteor.complexity * 8);
          const point = generateTorus(t + time, scale * 5);
          if (point && typeof point.x === 'number' && typeof point.y === 'number') {
            if (i === 0) ctx.moveTo(point.x, point.y);
            else ctx.lineTo(point.x, point.y);
          }
        }
        ctx.strokeStyle = meteor.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        break;

      case 'mobius':
        ctx.beginPath();
        for (let i = 0; i < meteor.complexity * 6; i++) {
          const t = i / (meteor.complexity * 6);
          const point = generateMobiusStrip(t + time, scale * 8);
          if (point && typeof point.x === 'number' && typeof point.y === 'number') {
            if (i === 0) ctx.moveTo(point.x, point.y);
            else ctx.lineTo(point.x, point.y);
          }
        }
        ctx.strokeStyle = meteor.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        break;

      case 'hypercube':
        ctx.strokeStyle = meteor.color;
        ctx.lineWidth = 2;
        // Draw hypercube edges
        for (let i = 0; i < 16; i++) {
          for (let j = i + 1; j < 16; j++) {
            const diff = i ^ j;
            if ((diff & (diff - 1)) === 0) { // Adjacent vertices
              const p1 = generateHypercube(i / 16 + time, scale * 15);
              const p2 = generateHypercube(j / 16 + time, scale * 15);
              if (p1 && p2 && typeof p1.x === 'number' && typeof p1.y === 'number' && 
                  typeof p2.x === 'number' && typeof p2.y === 'number') {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
              }
            }
          }
        }
        break;

      case 'fractal':
        ctx.fillStyle = meteor.color;
        for (let i = 0; i < meteor.complexity * 4; i++) {
          const t = i / (meteor.complexity * 4);
          const point = generateFractal(t + time, scale * 12);
          if (point && typeof point.x === 'number' && typeof point.y === 'number') {
            ctx.fillRect(point.x - 1, point.y - 1, 2, 2);
          }
        }
        break;

      case 'cube':
        // 3D cube with perspective
        const cubeSize = scale * 20;
        const depth = cubeSize * 0.7;
        ctx.strokeStyle = meteor.color;
        ctx.lineWidth = 2;
        
        // Front face
        ctx.strokeRect(-cubeSize/2, -cubeSize/2, cubeSize, cubeSize);
        // Back face (offset for 3D effect)
        ctx.strokeRect(-cubeSize/2 + depth/2, -cubeSize/2 - depth/2, cubeSize, cubeSize);
        
        // Connect corners
        ctx.beginPath();
        ctx.moveTo(-cubeSize/2, -cubeSize/2);
        ctx.lineTo(-cubeSize/2 + depth/2, -cubeSize/2 - depth/2);
        ctx.moveTo(cubeSize/2, -cubeSize/2);
        ctx.lineTo(cubeSize/2 + depth/2, -cubeSize/2 - depth/2);
        ctx.moveTo(-cubeSize/2, cubeSize/2);
        ctx.lineTo(-cubeSize/2 + depth/2, cubeSize/2 - depth/2);
        ctx.moveTo(cubeSize/2, cubeSize/2);
        ctx.lineTo(cubeSize/2 + depth/2, cubeSize/2 - depth/2);
        ctx.stroke();
        break;
    }

    ctx.restore();
  };

  const drawTrail = (ctx, meteor) => {
    if (meteor.trail.length < 2) return;

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    
    for (let i = 0; i < meteor.trail.length - 1; i++) {
      const current = meteor.trail[i];
      const next = meteor.trail[i + 1];
      const alpha = (i / meteor.trail.length) * 0.5;
      
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = meteor.color;
      ctx.lineWidth = meteor.size * (i / meteor.trail.length);
      ctx.beginPath();
      ctx.moveTo(current.x, current.y);
      ctx.lineTo(next.x, next.y);
      ctx.stroke();
    }
    
    ctx.restore();
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    // Use appropriate background clear color based on theme
    ctx.fillStyle = isDarkTheme 
      ? 'rgba(0, 0, 0, 0.1)' // Dark overlay for dark theme
      : 'rgba(255, 255, 255, 0.1)'; // Light overlay for light theme
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Create new meteors
    const meteorCount = intensity === 'high' ? 8 : intensity === 'low' ? 2 : 5;
    if (meteorsRef.current.length < meteorCount && Math.random() < 0.1) {
      meteorsRef.current.push(createMeteor());
    }

    // Update and draw meteors
    meteorsRef.current = meteorsRef.current.filter(meteor => {
      // Update position
      meteor.x += meteor.vx;
      meteor.y += meteor.vy;
      meteor.rotation += meteor.rotationSpeed;
      meteor.morphTime += 0.02;
      
      // Add to trail
      meteor.trail.push({ x: meteor.x, y: meteor.y });
      if (meteor.trail.length > 15) {
        meteor.trail.shift();
      }
      
      // Update life
      if (meteor.y > canvas.height / 2) {
        meteor.life -= 0.02;
      }

      // Draw trail
      drawTrail(ctx, meteor);
      
      // Draw meteor
      drawComplexShape(ctx, meteor);

      // Remove dead meteors
      return meteor.life > 0 && meteor.y < canvas.height + 100;
    });

    animationRef.current = requestAnimationFrame(animate);
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  // Detect theme changes
  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      // Default to light theme if no theme is set
      setIsDarkTheme(theme === 'dark');
    };

    // Check initial theme
    checkTheme();

    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [intensity, isDarkTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="meteor-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 2,
        opacity: 0.8,
      }}
    />
  );
};

export default MeteorEffect;