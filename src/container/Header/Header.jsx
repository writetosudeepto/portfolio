import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { AppWrap } from "../../wrapper";
import { images } from "../../constants";
import HeaderTicket from "../../components/CinemaTicket/HeaderTicket";
import "./Header.scss";

const scaleVariants = {
  whileInView: {
    scale: [0, 1],
    opacity: [0, 1],
    transition: {
      duration: 1,
      ease: "easeInOut",
    },
  },
};

// Planetary skill circles component
const PlanetarySkillCircles = () => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  
  // Define skills with their properties - responsive sizes
  const getMobileSize = (size) => {
    if (window.innerWidth <= 768) {
      return Math.round(size * 0.5); // 50% smaller on mobile
    } else if (window.innerWidth <= 1200) {
      return Math.round(size * 0.7); // 30% smaller on tablets
    }
    return size; // Full size on desktop
  };

  const skillsData = [
    { image: images.python, size: getMobileSize(140), color: '#3776ab' },
    { image: images.numpy, size: getMobileSize(180), color: '#013243' },
    { image: images.tableau, size: getMobileSize(150), color: '#e97627' },
    { image: images.sql, size: getMobileSize(160), color: '#336791' },
    { image: images.bigQuery, size: getMobileSize(145), color: '#4285f4' },
    { image: images.flutter, size: getMobileSize(170), color: '#02569b' },
    { image: images.react, size: getMobileSize(155), color: '#61dafb' },
  ];

  const [circles, setCircles] = useState([]);

  // Initialize circles with random positions and velocities
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use a timeout to ensure proper dimensions after component mount
    const initializeCircles = () => {
      const containerRect = container.getBoundingClientRect();
      const isMobile = window.innerWidth <= 768;
      const isTablet = window.innerWidth <= 1200;
      
      let containerWidth, containerHeight;
      if (isMobile) {
        containerWidth = Math.max(containerRect.width, 300); // Smaller minimum for mobile
        containerHeight = Math.max(containerRect.height, 300);
      } else if (isTablet) {
        containerWidth = Math.max(containerRect.width, 450);
        containerHeight = Math.max(containerRect.height, 400);
      } else {
        containerWidth = Math.max(containerRect.width, 600);
        containerHeight = Math.max(containerRect.height, 500);
      }

      const initialCircles = skillsData.map((skill, index) => {
        const radius = skill.size / 2;
        
        // Force some circles to the left side, some to the right
        let x, y;
        if (index < 3) {
          // First 3 circles on the left side (0-40% of width)
          x = radius + Math.random() * (containerWidth * 0.4 - skill.size);
        } else if (index >= 5) {
          // Last 2 circles on the right side (60-100% of width)
          x = containerWidth * 0.6 + Math.random() * (containerWidth * 0.4 - skill.size);
        } else {
          // Middle circles can be anywhere
          x = radius + Math.random() * (containerWidth - skill.size);
        }
        
        y = radius + Math.random() * (containerHeight - skill.size);
        
        return {
          id: index,
          x: x,
          y: y,
          vx: (Math.random() - 0.5) * 0.8, // Slower velocity X
          vy: (Math.random() - 0.5) * 0.8, // Slower velocity Y
          size: skill.size,
          image: skill.image,
          color: skill.color,
          mass: skill.size * 0.01, // Mass for collision physics
          collisionEffect: 0, // For visual collision effects
        };
      });

      setCircles(initialCircles);
    };

    // Initialize after a short delay to ensure proper container dimensions
    setTimeout(initializeCircles, 100);
  }, []);

  // Collision detection function
  const checkCollisions = (circles) => {
    const updatedCircles = [...circles];
    
    for (let i = 0; i < updatedCircles.length; i++) {
      for (let j = i + 1; j < updatedCircles.length; j++) {
        const circle1 = updatedCircles[i];
        const circle2 = updatedCircles[j];
        
        const dx = circle2.x - circle1.x;
        const dy = circle2.y - circle1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = (circle1.size + circle2.size) / 2;
        
        if (distance < minDistance) {
          // Collision detected - apply physics
          const angle = Math.atan2(dy, dx);
          const sin = Math.sin(angle);
          const cos = Math.cos(angle);
          
          // Separate circles
          const overlap = minDistance - distance;
          const separation = overlap / 2;
          
          circle1.x -= separation * cos;
          circle1.y -= separation * sin;
          circle2.x += separation * cos;
          circle2.y += separation * sin;
          
          // Exchange velocities (simplified elastic collision)
          const v1 = circle1.vx * cos + circle1.vy * sin;
          const v2 = circle2.vx * cos + circle2.vy * sin;
          
          const finalV1 = ((circle1.mass - circle2.mass) * v1 + 2 * circle2.mass * v2) / (circle1.mass + circle2.mass);
          const finalV2 = ((circle2.mass - circle1.mass) * v2 + 2 * circle1.mass * v1) / (circle1.mass + circle2.mass);
          
          circle1.vx = finalV1 * cos - circle1.vy * sin;
          circle1.vy = finalV1 * sin + circle1.vy * cos;
          circle2.vx = finalV2 * cos - circle2.vy * sin;
          circle2.vy = finalV2 * sin + circle2.vy * cos;
          
          // Add collision effect
          circle1.collisionEffect = 15;
          circle2.collisionEffect = 15;
        }
      }
    }
    
    return updatedCircles;
  };

  // Animation loop
  useEffect(() => {
    const animate = () => {
      setCircles(prevCircles => {
        const container = containerRef.current;
        if (!container || prevCircles.length === 0) return prevCircles;

        const containerRect = container.getBoundingClientRect();
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth <= 1200;
        
        let containerWidth, containerHeight;
        if (isMobile) {
          containerWidth = Math.max(containerRect.width, 300);
          containerHeight = Math.max(containerRect.height, 300);
        } else if (isTablet) {
          containerWidth = Math.max(containerRect.width, 450);
          containerHeight = Math.max(containerRect.height, 400);
        } else {
          containerWidth = Math.max(containerRect.width, 600);
          containerHeight = Math.max(containerRect.height, 500);
        }
        
        let updatedCircles = prevCircles.map(circle => {
          let newX = circle.x + circle.vx;
          let newY = circle.y + circle.vy;
          let newVx = circle.vx;
          let newVy = circle.vy;

          // Boundary collision detection with proper container dimensions
          const radius = circle.size / 2;
          if (newX - radius <= 0 || newX + radius >= containerWidth) {
            newVx = -newVx;
            newX = Math.max(radius, Math.min(containerWidth - radius, newX));
          }
          if (newY - radius <= 0 || newY + radius >= containerHeight) {
            newVy = -newVy;
            newY = Math.max(radius, Math.min(containerHeight - radius, newY));
          }

          return {
            ...circle,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            collisionEffect: Math.max(0, circle.collisionEffect - 1),
          };
        });

        // Check for collisions between circles
        updatedCircles = checkCollisions(updatedCircles);
        
        return updatedCircles;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="planetary-skills-container">
      {circles.map((circle) => (
        <motion.div
          key={circle.id}
          className="planetary-circle"
          style={{
            left: circle.x - circle.size / 2,
            top: circle.y - circle.size / 2,
            width: circle.size,
            height: circle.size,
            transform: circle.collisionEffect > 0 ? `scale(${1 + circle.collisionEffect * 0.02})` : 'scale(1)',
            boxShadow: circle.collisionEffect > 0 
              ? `0 0 ${circle.collisionEffect * 2}px ${circle.color}, 0 0 ${circle.collisionEffect * 4}px ${circle.color}40`
              : '0px 0px 20px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.1s ease, box-shadow 0.1s ease',
          }}
          whileInView={{ scale: [0, 1], opacity: [0, 1] }}
          transition={{ duration: 0.5, delay: circle.id * 0.1 }}
        >
          <img src={circle.image} alt={`skill-${circle.id}`} />
        </motion.div>
      ))}
    </div>
  );
};

const Header = () => (
  <div className="app__header app__flex">
    <motion.div
      whileInView={{ x: [-100, 0], opacity: [0, 1] }}
      transition={{ duration: 0.5 }}
      className="app__header-info"
    >
      <HeaderTicket />
    </motion.div>

    <motion.div
      whileInView={{ opacity: [0, 1] }}
      transition={{ duration: 0.5, delayChildren: 0.5 }}
      className="app__header-img"
    >
      <img src={images.profile} alt="profile_bg" />
      <motion.img
        whileInView={{ scale: [0, 1] }}
        transition={{ duration: 1, ease: "easeInOut" }}
        src={images.circle}
        alt="profile_circle"
        className="overlay_circle"
      />
    </motion.div>

    <div className="app__header-circles">
      <PlanetarySkillCircles />
    </div>
  </div>
);

export default AppWrap(Header, "home");
