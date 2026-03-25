import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';

export default function EmptyState({ title, subtitle, icon: Icon }) {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="neon-card"
      sx={{ p: 4, textAlign: 'center', maxWidth: 420, mx: 'auto', mt: 4 }}
    >
      {Icon && (
        <Box sx={{ color: 'primary.light', mb: 2, display: 'flex', justifyContent: 'center' }}>
          <Icon size={48} strokeWidth={1.25} />
        </Box>
      )}
      <Typography variant="h6" sx={{ mb: 1 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
