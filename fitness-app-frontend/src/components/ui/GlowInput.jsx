import { motion } from 'framer-motion';
import { TextField } from '@mui/material';

export default function GlowInput({ error, ...props }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%' }}>
      <TextField
        fullWidth
        error={Boolean(error)}
        helperText={error}
        FormHelperTextProps={{ sx: { color: error ? '#fb7185' : 'text.secondary' } }}
        sx={{
          '& .MuiOutlinedInput-root': {
            color: 'text.primary',
            '& fieldset': { borderColor: 'rgba(124,58,237,0.25)' },
            '&:hover fieldset': { borderColor: 'rgba(6,182,212,0.45)' },
            '&.Mui-focused fieldset': {
              borderColor: '#7c3aed',
              boxShadow: '0 0 12px rgba(124,58,237,0.25)',
            },
          },
          '& .MuiInputLabel-root': { color: 'text.secondary' },
        }}
        {...props}
      />
    </motion.div>
  );
}
