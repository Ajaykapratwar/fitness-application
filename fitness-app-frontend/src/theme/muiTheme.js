import { createTheme } from '@mui/material/styles';

export const darkNeonTheme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#080810', paper: '#10101e' },
    primary: { main: '#7c3aed' },
    secondary: { main: '#06b6d4' },
    success: { main: '#10b981' },
    warning: { main: '#eab308' },
    error: { main: '#ec4899' },
    text: { primary: '#f1f5f9', secondary: '#94a3b8' },
  },
  shape: { borderRadius: 12 },
  typography: { fontFamily: 'Inter, system-ui, sans-serif' },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(16,16,30,0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(124,58,237,0.25)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'rgba(13,13,26,0.95)',
          borderLeft: '1px solid rgba(124,58,237,0.35)',
        },
      },
    },
  },
});
