import { motion } from 'framer-motion';
import { Avatar, Box, IconButton, Typography } from '@mui/material';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import NotificationBell from '../notifications/NotificationBell';

function initials(tokenData) {
  const g = tokenData?.given_name?.[0] || '';
  const f = tokenData?.family_name?.[0] || '';
  if (g || f) return `${g}${f}`.toUpperCase();
  const email = tokenData?.email || tokenData?.preferred_username || '?';
  return email.slice(0, 2).toUpperCase();
}

export default function Topbar({ onLogout }) {
  const { tokenData, userId } = useAuth();
  const name =
    [tokenData?.given_name, tokenData?.family_name].filter(Boolean).join(' ') ||
    tokenData?.preferred_username ||
    'Athlete';

  return (
    <Box
      component={motion.header}
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 2,
        px: { xs: 2, sm: 3 },
        py: 2,
        borderBottom: '1px solid rgba(124,58,237,0.2)',
        bgcolor: 'rgba(8,8,16,0.6)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Box sx={{ flex: 1, display: { xs: 'none', sm: 'block' } }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Welcome back
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
          {name}
        </Typography>
      </Box>
      <NotificationBell userId={userId} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar sx={{ bgcolor: 'primary.dark', border: '1px solid rgba(124,58,237,0.5)' }}>
          {initials(tokenData)}
        </Avatar>
        <IconButton onClick={onLogout} sx={{ color: 'text.secondary' }} aria-label="Log out">
          <LogOut size={20} />
        </IconButton>
      </Box>
    </Box>
  );
}
