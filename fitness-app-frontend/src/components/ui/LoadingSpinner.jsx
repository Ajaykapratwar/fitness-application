import { motion } from 'framer-motion';
import { Box, CircularProgress } from '@mui/material';

export default function LoadingSpinner() {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      sx={{ display: 'flex', justifyContent: 'center', py: 6 }}
    >
      <CircularProgress sx={{ color: 'primary.light' }} />
    </Box>
  );
}
