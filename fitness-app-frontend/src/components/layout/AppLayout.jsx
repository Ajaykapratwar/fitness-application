import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery } from '@mui/material';
import { useContext } from 'react';
import { AuthContext } from 'react-oauth2-code-pkce';
import { useDispatch } from 'react-redux';
import { logout as logoutAction } from '../../store/authSlice';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import PageWrapper from './PageWrapper';

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { logOut } = useContext(AuthContext);
  const dispatch = useDispatch();
  const isMobile = useMediaQuery('(max-width:767px)');

  const handleLogout = () => {
    dispatch(logoutAction());
    logOut();
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((c) => !c)} />
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          pb: isMobile ? 8 : 0,
        }}
      >
        <Topbar onLogout={handleLogout} />
        <Box sx={{ p: { xs: 2, sm: 3 }, flex: 1 }}>
          <PageWrapper>
            <Outlet />
          </PageWrapper>
        </Box>
      </Box>
    </Box>
  );
}
