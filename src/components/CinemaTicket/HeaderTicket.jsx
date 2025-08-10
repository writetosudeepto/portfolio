import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Cinema ticket styled component for header
const TicketCard = styled(motion(Card))(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: '30vw', // Never more than 30% of screen width
  minWidth: '280px', // Minimum readable width
  minHeight: 162,
  maxHeight: 198,
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  borderRadius: 12,
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  margin: '0', // Left aligned by default
  
  '&:hover': {
    transform: 'translateY(-6px) scale(1.02)',
    boxShadow: '0 15px 45px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(25px)',
  },
  
  // Phone screens - center aligned
  '@media screen and (max-width: 480px)': {
    maxWidth: '30vw',
    minWidth: '250px',
    minHeight: '130px',
    maxHeight: '150px',
    margin: '0 auto', // Center aligned for mobile only
  },
  
  // Tablet screens
  '@media screen and (min-width: 481px) and (max-width: 768px)': {
    maxWidth: '30vw',
    minWidth: '260px',
    minHeight: '140px',
    maxHeight: '165px',
  },
  
  // Small laptops (13-15 inch)
  '@media screen and (min-width: 769px) and (max-width: 1440px)': {
    maxWidth: '30vw',
    minWidth: '280px',
    minHeight: 180,
    maxHeight: 216,
  },
  
  // Large laptops (15-17 inch)
  '@media screen and (min-width: 1441px) and (max-width: 1920px)': {
    maxWidth: '30vw',
    minWidth: '320px',
    minHeight: 220,
    maxHeight: 280,
  },
  
  // Large monitors (24+ inch)
  '@media screen and (min-width: 1921px) and (max-width: 2560px)': {
    maxWidth: '30vw',
    minWidth: '400px',
    minHeight: 280,
    maxHeight: 350,
  },
  
  // Ultra-wide/4K monitors (32+ inch)
  '@media screen and (min-width: 2561px)': {
    maxWidth: '30vw',
    minWidth: '500px',
    minHeight: 350,
    maxHeight: 450,
  },
}));

const TicketStub = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: 0,
  top: 0,
  bottom: 0,
  width: 100,
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(15px)',
  borderLeft: '1px solid rgba(0, 0, 0, 0.15)',
  borderRadius: '0 12px 12px 0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 3,
  
  // Vintage perforated edge effect
  '&::before': {
    content: '""',
    position: 'absolute',
    left: -1,
    top: 10,
    bottom: 10,
    width: 2,
    background: `
      repeating-linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.3) 0px,
        rgba(0, 0, 0, 0.3) 3px,
        transparent 3px,
        transparent 8px
      )
    `,
  },
  
  // Small decorative corner
  '&::after': {
    content: '""',
    position: 'absolute',
    right: 10,
    top: 10,
    width: 15,
    height: 15,
    border: '1px solid rgba(0, 0, 0, 0.2)',
    borderRadius: 2,
  },
  
  // Phone screens
  '@media screen and (max-width: 768px)': {
    width: 70,
  },
  
  // Large monitors (24+ inch)
  '@media screen and (min-width: 1921px) and (max-width: 2560px)': {
    width: 120,
  },
  
  // Ultra-wide/4K monitors (32+ inch)
  '@media screen and (min-width: 2561px)': {
    width: 140,
  },
}));

const StubText = styled(Typography)(({ theme }) => ({
  writingMode: 'vertical-lr',
  textOrientation: 'mixed',
  fontSize: '0.7rem',
  fontWeight: 300,
  color: '#00ff41',
  textTransform: 'uppercase',
  letterSpacing: 4,
  fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Consolas", monospace',
  textShadow: '0 0 8px #00ff41, 0 0 12px rgba(0, 255, 65, 0.4)',
  
  '@media screen and (max-width: 768px)': {
    fontSize: '0.7rem',
  },
}));

const MainContent = styled(CardContent)(({ theme }) => ({
  paddingRight: 120, // Space for stub
  padding: '1.5rem',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  zIndex: 2,
  
  // Phone screens
  '@media screen and (max-width: 480px)': {
    paddingRight: 70,
    padding: '0.8rem 0.6rem',
  },
  
  // Tablet screens
  '@media screen and (min-width: 481px) and (max-width: 768px)': {
    paddingRight: 75,
    padding: '0.9rem 0.7rem',
  },
  
  // Small laptop screens (14-15 inch)
  '@media screen and (min-width: 769px) and (max-width: 1440px)': {
    paddingRight: 110,
    padding: '1.2rem 1rem',
  },
  
  // Large laptop screens (15-17 inch)
  '@media screen and (min-width: 1441px) and (max-width: 1920px)': {
    paddingRight: 120,
    padding: '1.5rem',
  },
  
  // Large monitors (24+ inch)
  '@media screen and (min-width: 1921px) and (max-width: 2560px)': {
    paddingRight: 140,
    padding: '2rem 1.5rem',
  },
  
  // Ultra-wide/4K monitors (32+ inch)
  '@media screen and (min-width: 2561px)': {
    paddingRight: 160,
    padding: '2.5rem 2rem',
  },
}));

const SystemStatus = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: 16,
  gap: 16,
  
  // Phone screens
  '@media screen and (max-width: 480px)': {
    marginBottom: 6,
    gap: 6,
  },
  
  // Tablet screens
  '@media screen and (min-width: 481px) and (max-width: 768px)': {
    marginBottom: 7,
    gap: 7,
  },
  
  // Small laptop screens (14-15 inch)
  '@media screen and (min-width: 769px) and (max-width: 1440px)': {
    marginBottom: 12,
    gap: 12,
  },
  
  // Large laptop screens (15-17 inch)
  '@media screen and (min-width: 1441px) and (max-width: 1920px)': {
    marginBottom: 16,
    gap: 16,
  },
  
  // Large monitors (24+ inch)
  '@media screen and (min-width: 1921px) and (max-width: 2560px)': {
    marginBottom: 20,
    gap: 20,
  },
  
  // Ultra-wide/4K monitors (32+ inch)
  '@media screen and (min-width: 2561px)': {
    marginBottom: 24,
    gap: 24,
  },
}));

const StatusIcon = styled(Box)(({ theme }) => ({
  fontSize: '1.8rem',
  opacity: 0.8,
  
  '@media screen and (max-width: 768px)': {
    fontSize: '1.3rem',
  },
}));

const StatusText = styled(Typography)(({ theme }) => ({
  color: '#ff4444',
  fontSize: '0.9rem',
  fontWeight: 400,
  textTransform: 'uppercase',
  letterSpacing: 4,
  fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Consolas", monospace',
  marginBottom: 8,
  textShadow: '0 0 6px #ff4444, 0 0 10px rgba(255, 68, 68, 0.3)',
  
  // Phone screens
  '@media screen and (max-width: 480px)': {
    fontSize: '0.6rem',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  
  // Tablet screens
  '@media screen and (min-width: 481px) and (max-width: 768px)': {
    fontSize: '0.65rem',
    letterSpacing: 2,
    marginBottom: 5,
  },
  
  // Small laptop screens (14-15 inch)
  '@media screen and (min-width: 769px) and (max-width: 1440px)': {
    fontSize: '0.75rem',
    letterSpacing: 3,
    marginBottom: 6,
  },
  
  // Large laptop screens (15-17 inch)
  '@media screen and (min-width: 1441px) and (max-width: 1920px)': {
    fontSize: '0.9rem',
    letterSpacing: 4,
    marginBottom: 8,
  },
  
  // Large monitors (24+ inch)
  '@media screen and (min-width: 1921px) and (max-width: 2560px)': {
    fontSize: '1.1rem',
    letterSpacing: 5,
    marginBottom: 10,
  },
  
  // Ultra-wide/4K monitors (32+ inch)
  '@media screen and (min-width: 2561px)': {
    fontSize: '1.4rem',
    letterSpacing: 6,
    marginBottom: 12,
  },
}));

const DeveloperName = styled(Typography)(({ theme }) => ({
  fontSize: '1.6rem',
  fontWeight: 300,
  fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Consolas", monospace',
  marginBottom: 16,
  letterSpacing: 3,
  textTransform: 'uppercase',
  
  // Light mode - black text
  '[data-theme="light"] &': {
    color: '#000000 !important',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
  },
  
  // Dark mode - white text with glow
  '[data-theme="dark"] &': {
    color: '#ffffff !important',
    textShadow: '0 0 10px #ffffff, 0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.2)',
  },
  
  // Default fallback for light mode
  color: '#000000',
  textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
  
  // Phone screens
  '@media screen and (max-width: 480px)': {
    fontSize: '1rem',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  
  // Tablet screens
  '@media screen and (min-width: 481px) and (max-width: 768px)': {
    fontSize: '1.1rem',
    letterSpacing: 2,
    marginBottom: 7,
  },
  
  // Small laptop screens (14-15 inch)
  '@media screen and (min-width: 769px) and (max-width: 1440px)': {
    fontSize: '1.3rem',
    letterSpacing: 2.5,
    marginBottom: 10,
  },
  
  // Large laptop screens (15-17 inch)
  '@media screen and (min-width: 1441px) and (max-width: 1920px)': {
    fontSize: '1.6rem',
    letterSpacing: 3,
    marginBottom: 16,
  },
  
  // Large monitors (24+ inch)
  '@media screen and (min-width: 1921px) and (max-width: 2560px)': {
    fontSize: '2rem',
    letterSpacing: 4,
    marginBottom: 20,
  },
  
  // Ultra-wide/4K monitors (32+ inch)
  '@media screen and (min-width: 2561px)': {
    fontSize: '2.6rem',
    letterSpacing: 5,
    marginBottom: 24,
  },
}));

const ProtocolText = styled(Typography)(({ theme }) => ({
  color: '#00ccff',
  fontSize: '0.8rem',
  lineHeight: 1.6,
  marginBottom: 6,
  fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Consolas", monospace',
  fontWeight: 300,
  letterSpacing: 1,
  textTransform: 'uppercase',
  textShadow: '0 0 6px #00ccff, 0 0 10px rgba(0, 204, 255, 0.3)',
  
  '&:last-child': {
    color: '#ffaa00',
    fontWeight: 400,
    fontSize: '0.75rem',
    letterSpacing: 2,
    textShadow: '0 0 6px #ffaa00, 0 0 10px rgba(255, 170, 0, 0.3)',
  },
  
  // Phone screens
  '@media screen and (max-width: 480px)': {
    fontSize: '0.55rem',
    lineHeight: 1.2,
    marginBottom: 3,
    letterSpacing: 0.5,
    
    '&:last-child': {
      fontSize: '0.5rem',
    },
  },
  
  // Tablet screens
  '@media screen and (min-width: 481px) and (max-width: 768px)': {
    fontSize: '0.6rem',
    lineHeight: 1.3,
    marginBottom: 4,
    letterSpacing: 1,
    
    '&:last-child': {
      fontSize: '0.57rem',
    },
  },
  
  // Small laptop screens (14-15 inch)
  '@media screen and (min-width: 769px) and (max-width: 1440px)': {
    fontSize: '0.68rem',
    lineHeight: 1.5,
    marginBottom: 4,
    letterSpacing: 1,
    
    '&:last-child': {
      fontSize: '0.65rem',
      letterSpacing: 1.5,
    },
  },
  
  // Large laptop screens (15-17 inch)
  '@media screen and (min-width: 1441px) and (max-width: 1920px)': {
    fontSize: '0.8rem',
    lineHeight: 1.6,
    marginBottom: 6,
    letterSpacing: 1,
    
    '&:last-child': {
      fontSize: '0.75rem',
      letterSpacing: 2,
    },
  },
  
  // Large monitors (24+ inch)
  '@media screen and (min-width: 1921px) and (max-width: 2560px)': {
    fontSize: '1rem',
    lineHeight: 1.6,
    marginBottom: 8,
    letterSpacing: 1.5,
    
    '&:last-child': {
      fontSize: '0.95rem',
      letterSpacing: 2.5,
    },
  },
  
  // Ultra-wide/4K monitors (32+ inch)
  '@media screen and (min-width: 2561px)': {
    fontSize: '1.3rem',
    lineHeight: 1.7,
    marginBottom: 10,
    letterSpacing: 2,
    
    '&:last-child': {
      fontSize: '1.25rem',
      letterSpacing: 3,
    },
  },
}));

const HeaderTicket = () => {
  return (
    <TicketCard
      component={motion.div}
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.5 }}
    >
      <MainContent>
        <SystemStatus>
          <StatusIcon>👁️</StatusIcon>
          <Box>
            <StatusText>SYSTEM ONLINE. DEVELOPER UNIT:</StatusText>
            <DeveloperName>Sudipta Das</DeveloperName>
          </Box>
        </SystemStatus>

        <ProtocolText>
          Full Stack Neural Networks | Data Science Protocol
        </ProtocolText>
        <ProtocolText>
          Resistance is futile. Your bugs will be terminated.
        </ProtocolText>
      </MainContent>

      <TicketStub>
        <StubText>ADMIT ONE</StubText>
      </TicketStub>
    </TicketCard>
  );
};

export default HeaderTicket;