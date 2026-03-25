import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import CountUp from 'react-countup';
import { cardVariants } from '../../utils/motionVariants';

export default function MetricCard({ title, value, suffix = '', prefix = '', decimals = 0 }) {
  const end = Number(value) || 0;
  return (
    <Box
      component={motion.div}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      className="neon-card"
      sx={{ p: 2.5, height: '100%' }}
    >
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ color: 'primary.light', fontWeight: 700 }}>
        {prefix}
        <CountUp key={end} end={end} duration={1.2} decimals={decimals} preserveValue />
        {suffix}
      </Typography>
    </Box>
  );
}
