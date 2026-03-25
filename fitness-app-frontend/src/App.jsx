import { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AuthContext } from 'react-oauth2-code-pkce';
import { setCredentials } from './store/authSlice';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/auth/LoginPage';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import ActivityPage from './pages/dashboard/ActivityPage';
import ActivityDetail from './pages/dashboard/ActivityDetail';
import RecommendationsPage from './pages/dashboard/RecommendationsPage';
import ProfilePage from './pages/profile/ProfilePage';
import AdminPlaceholder from './pages/admin/AdminPlaceholder';

function App() {
  const { token, tokenData } = useContext(AuthContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token && tokenData) {
      dispatch(setCredentials({ token, user: tokenData }));
    }
  }, [token, tokenData, dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/activities" element={<ActivityPage />} />
            <Route path="/activities/:id" element={<ActivityDetail />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin/users" element={<AdminPlaceholder title="User Management" />} />
            <Route path="/admin/health" element={<AdminPlaceholder title="System Health" />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
