import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Chip, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { AiFillEye, AiFillGithub } from "react-icons/ai";
import { SiGooglecolab } from "react-icons/si";

// Styled components using MUI's styled API
const TicketCard = styled(motion(Card))(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: 380,
  background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 50%, #f1f3f4 100%)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
  borderRadius: 0,
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  
  // Ticket perforation top
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: 'linear-gradient(90deg, #ff6b6b 0%, #4ecdc4 50%, #ff6b6b 100%)',
    zIndex: 1,
  },
  
  // Ticket perforation middle (vertical)
  '&::after': {
    content: '""',
    position: 'absolute',
    left: '75%',
    top: 0,
    bottom: 0,
    width: 2,
    background: `repeating-linear-gradient(
      to bottom,
      #e0e0e0 0px,
      #e0e0e0 8px,
      transparent 8px,
      transparent 16px
    )`,
    zIndex: 1,
  },
  
  '&:hover': {
    transform: 'translateY(-12px) rotateY(5deg)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
  },
}));

const TicketStub = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: 0,
  top: 0,
  bottom: 0,
  width: 100,
  background: 'linear-gradient(135deg, #f1f3f4 0%, #e8eaed 100%)',
  borderLeft: '2px dashed #ccc',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2,
  
  // Circular punch hole
  '&::before': {
    content: '""',
    position: 'absolute',
    left: -8,
    top: '50%',
    width: 16,
    height: 16,
    background: 'white',
    borderRadius: '50%',
    transform: 'translateY(-50%)',
    boxShadow: 'inset 0 0 0 2px #e0e0e0',
  },
}));

const StubText = styled(Typography)(({ theme }) => ({
  writingMode: 'vertical-lr',
  textOrientation: 'mixed',
  fontSize: '0.7rem',
  fontWeight: 700,
  color: '#666',
  textTransform: 'uppercase',
  letterSpacing: 1,
}));

const MainContent = styled(CardContent)(({ theme }) => ({
  paddingRight: 120, // Space for stub
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
}));

const TicketHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 16,
  paddingBottom: 8,
  borderBottom: '1px solid #e0e0e0',
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  gap: 12,
  opacity: 0,
  transition: 'opacity 0.3s ease',
  zIndex: 3,
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  width: 48,
  height: 48,
  background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
  color: 'white',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
  },
}));

const ImageOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.8) 100%)',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  
  '&:hover': {
    opacity: 1,
  },
  
  '&:hover .action-buttons': {
    opacity: 1,
  },
}));

const CinemaTicket = ({ work, getSourceIcon }) => {
  console.log("🎬 CinemaTicket MUI rendering:", work.title);

  return (
    <TicketCard
      component={motion.div}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.5 }}
    >
      <MainContent>
        <TicketHeader>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 700, color: '#1a1a1a', flex: 1 }}>
            {work.title}
          </Typography>
          <Chip
            label={work.tags && work.tags[0]}
            sx={{
              background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.7rem',
              textTransform: 'uppercase',
            }}
          />
        </TicketHeader>

        <Box sx={{ position: 'relative', mb: 2 }}>
          <CardMedia
            component="img"
            height="180"
            image={work.imgUrl}
            alt={work.title}
            sx={{
              borderRadius: 1,
              border: '1px solid #e0e0e0',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          />
          
          <ImageOverlay>
            <ActionButtons className="action-buttons">
              {work.projectLink && work.projectLink.trim() !== "" && (
                <ActionButton
                  href={work.projectLink}
                  target="_blank"
                  rel="noreferrer"
                  component="a"
                >
                  <AiFillEye />
                </ActionButton>
              )}
              <ActionButton
                href={work.codeLink}
                target="_blank"
                rel="noreferrer"
                component="a"
              >
                {getSourceIcon(work.codeSource)}
              </ActionButton>
            </ActionButtons>
          </ImageOverlay>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5, flex: 1 }}>
          {work.description}
        </Typography>
      </MainContent>

      <TicketStub>
        <StubText>PORTFOLIO</StubText>
      </TicketStub>
    </TicketCard>
  );
};

export default CinemaTicket;