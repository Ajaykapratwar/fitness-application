import { motion } from 'framer-motion';
import { Button } from '@mui/material';

export default function NeonButton({ children, fullWidth, ...props }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      style={{ display: fullWidth ? 'block' : 'inline-block', width: fullWidth ? '100%' : undefined }}
    >
      <Button variant="contained" color="primary" fullWidth={fullWidth} {...props}>
        {children}
      </Button>
    </motion.div>
  );
}
