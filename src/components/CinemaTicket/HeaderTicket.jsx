import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Cinema ticket styled component for header
const TicketCard = styled(motion(Card))(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: 450,
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  borderRadius: 12,
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  
  
  '&:hover': {
    transform: 'translateY(-6px) scale(1.02)',
    boxShadow: '0 15px 45px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(25px)',
  },
  
  '@media screen and (max-width: 768px)': {
    maxWidth: '100%',
    margin: '0 auto',
    minHeight: '160px',
    maxHeight: '180px',
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
  
  '@media screen and (max-width: 768px)': {
    width: 70,
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
  
  '@media screen and (max-width: 768px)': {
    paddingRight: 80,
    padding: '1rem 0.8rem',
  },
}));

const SystemStatus = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: 16,
  gap: 16,
  
  '@media screen and (max-width: 768px)': {
    marginBottom: 8,
    gap: 8,
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
  
  '@media screen and (max-width: 768px)': {
    fontSize: '0.7rem',
    letterSpacing: 2,
    marginBottom: 6,
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
  
  '@media screen and (max-width: 768px)': {
    fontSize: '1.2rem',
    letterSpacing: 2,
    marginBottom: 8,
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
  
  '@media screen and (max-width: 768px)': {
    fontSize: '0.65rem',
    lineHeight: 1.3,
    marginBottom: 4,
    letterSpacing: 1,
    
    '&:last-child': {
      fontSize: '0.6rem',
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