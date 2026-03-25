import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';

export default function AdminPlaceholder({ title }) {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="neon-card"
      sx={{ p: 4, textAlign: 'center' }}
    >
      <Typography variant="h5" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography sx={{ color: 'text.secondary' }}>This admin area is reserved for a future release.</Typography>
    </Box>
  );
}
