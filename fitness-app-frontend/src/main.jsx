import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from 'react-oauth2-code-pkce';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { authConfig } from './authConfig';
import { store } from './store/store';
import { darkNeonTheme } from './theme/muiTheme';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider authConfig={authConfig} loadingComponent={<div className="neon-card" style={{ margin: 24, padding: 24 }}>Loading…</div>}>
    <Provider store={store}>
      <ThemeProvider theme={darkNeonTheme}>
        <CssBaseline />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#161628',
              color: '#f1f5f9',
              border: '1px solid rgba(124,58,237,0.35)',
            },
          }}
        />
        <App />
      </ThemeProvider>
    </Provider>
  </AuthProvider>,
);
