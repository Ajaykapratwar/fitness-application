import { motion } from 'framer-motion';
import { Box } from '@mui/material';

export default function SkeletonCard({ height = 140 }) {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      className="neon-card shimmer"
      sx={{ height, borderRadius: 2 }}
    />
  );
}
