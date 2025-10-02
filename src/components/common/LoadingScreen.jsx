/**
 * =========================================================
 * FinApp Haiti - Loading Screen
 * Écran de chargement pendant l'initialisation
 * =========================================================
 */

import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * LoadingScreen Component
 * Affiche un spinner pendant le chargement
 */
const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <CircularProgress size={60} thickness={4} />
      <Typography
        variant="h6"
        sx={{
          mt: 3,
          color: 'text.secondary',
          fontWeight: 500,
        }}
      >
        Chargement de FinApp Haiti...
      </Typography>
    </Box>
  );
};

export default LoadingScreen;