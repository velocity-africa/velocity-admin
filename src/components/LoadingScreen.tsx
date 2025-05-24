import { DirectionsCar as CarIcon } from '@mui/icons-material';
import { Box, Typography, useTheme } from '@mui/material';
import { keyframes } from '@mui/system';

const driveAnimation = keyframes`
  0% {
    transform: translateX(-150%) rotateY(0deg);
  }
  49% {
    transform: translateX(150%) rotateY(0deg);
  }
  50% {
    transform: translateX(150%) rotateY(180deg);
  }
  99% {
    transform: translateX(-150%) rotateY(180deg);
  }
  100% {
    transform: translateX(-150%) rotateY(0deg);
  }
`;

const roadAnimation = keyframes`
  from {
    transform: translateX(-50%);
  }
  to {
    transform: translateX(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const glowAnimation = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(0,208,158,0.5), 0 0 25px rgba(0,208,158,0.2);
  }
  50% {
    box-shadow: 0 0 20px rgba(0,208,158,0.5), 0 0 50px rgba(0,208,158,0.2);
  }
  100% {
    box-shadow: 0 0 5px rgba(0,208,158,0.5), 0 0 25px rgba(0,208,158,0.2);
  }
`;

export default function LoadingScreen() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: theme.palette.background.default,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)',
          backgroundPosition: '0 0, 10px 10px',
          backgroundSize: '20px 20px',
        }}
      />

      <Box
        sx={{
          position: 'relative',
          width: '280px',
          height: '120px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 4,
        }}
      >
        {/* Road */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '20px',
            width: '100%',
            height: '2px',
            bgcolor: theme.palette.primary.main,
            '&::before, &::after': {
              content: '""',
              position: 'absolute',
              top: -1,
              width: '200%',
              height: '2px',
              backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.main} 50%, transparent 50%)`,
              backgroundSize: '20px 2px',
              animation: `${roadAnimation} 1s linear infinite`,
            },
          }}
        />

        {/* Car with shadow */}
        <Box
          sx={{
            position: 'relative',
            animation: `${driveAnimation} 3s linear infinite`,
            transformStyle: 'preserve-3d',
          }}
        >
          <CarIcon
            sx={{
              fontSize: 48,
              color: theme.palette.primary.main,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -25,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '40px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0,0,0,0.1)',
              filter: 'blur(4px)',
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          textAlign: 'center',
          padding: '20px',
          borderRadius: '16px',
          animation: `${glowAnimation} 2s infinite ease-in-out`,
          backgroundColor: 'rgba(255,255,255,0.9)',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            mb: 2,
            animation: `${fadeIn} 1s ease-out`,
            color: theme.palette.primary.main,
          }}
        >
          Car Rental Admin
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            animation: `${fadeIn} 1s ease-out 0.3s backwards`,
          }}
        >
          Preparing your dashboard...
        </Typography>
      </Box>
    </Box>
  );
}