import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Dumbbell,
  Sparkles,
  User,
  Shield,
  Activity,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Box, useMediaQuery } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

export default function Sidebar({ collapsed, onToggleCollapse }) {
  const { isAdmin } = useAuth();
  const isMobile = useMediaQuery('(max-width:767px)');

  const items = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/activities', icon: Dumbbell, label: 'Activities' },
    { to: '/recommendations', icon: Sparkles, label: 'AI' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];
  if (isAdmin) {
    items.push(
      { to: '/admin/users', icon: Shield, label: 'Admin' },
      { to: '/admin/health', icon: Activity, label: 'Health' },
    );
  }

  if (isMobile) {
    return (
      <Box
        component={motion.nav}
        initial={{ y: 48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
          borderTop: '1px solid rgba(124,58,237,0.25)',
          bgcolor: 'rgba(8,8,16,0.95)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          justifyContent: 'space-around',
          py: 1,
          px: 0.5,
        }}
      >
        {items.slice(0, 4).map((item) => (
          <NavLink key={item.to} to={item.to} style={{ textDecoration: 'none', flex: 1, textAlign: 'center' }}>
            {({ isActive }) => (
              <motion.div whileTap={{ scale: 0.95 }} style={{ color: isActive ? '#a855f7' : '#64748b' }}>
                <item.icon size={22} style={{ margin: '0 auto', display: 'block' }} />
                <Box component="span" sx={{ fontSize: 10, display: 'block', mt: 0.5 }}>
                  {item.label}
                </Box>
              </motion.div>
            )}
          </NavLink>
        ))}
      </Box>
    );
  }

  return (
    <Box
      component={motion.aside}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      sx={{
        flexShrink: 0,
        minHeight: '100vh',
        borderRight: '1px solid rgba(124,58,237,0.25)',
        bgcolor: 'rgba(13,13,26,0.85)',
        backdropFilter: 'blur(14px)',
        py: 2,
        px: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: collapsed ? 'center' : 'space-between',
          alignItems: 'center',
          mb: 2,
          px: 0.5,
        }}
      >
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontWeight: 700, color: '#a855f7' }}>
            FITNESS
          </motion.div>
        )}
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleCollapse}
          style={{
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.35)',
            borderRadius: 10,
            padding: 8,
            cursor: 'pointer',
            color: '#e2e8f0',
          }}
        >
          {collapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
        </motion.button>
      </Box>
      {items.map((item) => (
        <NavLink key={item.to} to={item.to} style={{ textDecoration: 'none' }}>
          {({ isActive }) => (
            <Box
              component={motion.div}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: collapsed ? 0 : 12,
                justifyContent: collapsed ? 'center' : 'flex-start',
                px: collapsed ? 1 : 2,
                py: 1.25,
                borderRadius: 2,
                color: isActive ? '#a855f7' : 'text.secondary',
                border: isActive ? '1px solid rgba(124,58,237,0.45)' : '1px solid transparent',
                boxShadow: isActive ? '0 0 16px rgba(124,58,237,0.25)' : 'none',
                bgcolor: isActive ? 'rgba(124,58,237,0.08)' : 'transparent',
                '&:hover': {
                  borderColor: 'rgba(6,182,212,0.35)',
                  color: '#e2e8f0',
                },
              }}
            >
              <item.icon size={22} />
              {!collapsed && <span>{item.label}</span>}
            </Box>
          )}
        </NavLink>
      ))}
    </Box>
  );
}
