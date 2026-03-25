import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from 'react-oauth2-code-pkce';
import { motion } from 'framer-motion';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * While Keycloak redirects back with ?code=, the access token is not set yet.
 * If we <Navigate to="/login"> here, React Router drops the query string and
 * react-oauth2-code-pkce never sees the code → "Bad authorization state".
 */
export default function ProtectedRoute() {
  const { token, loginInProgress } = useContext(AuthContext);
  const location = useLocation();

  // Keep ?code= on the URL until AuthProvider finishes the token exchange (do not Navigate away).
  if (loginInProgress) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          minHeight: '50vh',
        }}
      >
        <CircularProgress size={28} sx={{ color: 'primary.light' }} />
        <Typography sx={{ color: 'text.secondary' }}>Signing you in…</Typography>
      </Box>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
      <Outlet />
    </motion.div>
  );
}
