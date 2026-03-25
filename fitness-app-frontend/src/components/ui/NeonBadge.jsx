import { motion } from 'framer-motion';
import { Box } from '@mui/material';

export default function NeonBadge({ label, color = '#7c3aed' }) {
  return (
    <Box
      component={motion.span}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      sx={{
        display: 'inline-block',
        px: 1.25,
        py: 0.35,
        borderRadius: 999,
        fontSize: '0.75rem',
        fontWeight: 600,
        color: '#f1f5f9',
        border: `1px solid ${color}`,
        boxShadow: `0 0 12px ${color}55`,
        bgcolor: `${color}22`,
      }}
    >
      {label}
    </Box>
  );
}
