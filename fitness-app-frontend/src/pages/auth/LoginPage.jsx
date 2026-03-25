import { motion } from 'framer-motion';
import { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from 'react-oauth2-code-pkce';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import NeonButton from '../../components/ui/NeonButton';
import { pageVariants } from '../../utils/motionVariants';

export default function LoginPage() {
  const { token, logIn, error, loginInProgress } = useContext(AuthContext);

  useEffect(() => {
    document.title = 'Fitness — Sign in';
  }, []);

  if (token) {
    return <Navigate to="/" replace />;
  }

  if (loginInProgress) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <CircularProgress sx={{ color: 'primary.light' }} />
        <Typography sx={{ color: 'text.secondary' }}>Redirecting to sign in…</Typography>
      </Box>
    );
  }

  return (
    <Box
      component={motion.div}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 3,
        px: 2,
      }}
    >
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.light', textShadow: '0 0 24px rgba(124,58,237,0.5)' }}>
          Fitness OS
        </Typography>
        <Typography sx={{ color: 'text.secondary', textAlign: 'center', mt: 1 }}>
          Track workouts. Get AI coaching. Stay consistent.
        </Typography>
      </motion.div>
      {error && (
        <Alert severity="error" sx={{ maxWidth: 420, bgcolor: 'rgba(236,72,153,0.12)', color: '#fecdd3' }}>
          {error}
        </Alert>
      )}
      <NeonButton size="large" onClick={() => logIn()}>
        Continue with Keycloak
      </NeonButton>
    </Box>
  );
}
