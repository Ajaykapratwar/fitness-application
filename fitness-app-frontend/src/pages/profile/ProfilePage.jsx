import { motion } from 'framer-motion';
import { Avatar, Box, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import ActivityDonutChart from '../../components/charts/ActivityDonutChart';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getActivities } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { ACTIVITY_CONFIG } from '../../utils/activityColors';

function initials(tokenData) {
  const g = tokenData?.given_name?.[0] || '';
  const f = tokenData?.family_name?.[0] || '';
  if (g || f) return `${g}${f}`.toUpperCase();
  const email = tokenData?.email || '?';
  return email.slice(0, 2).toUpperCase();
}

export default function ProfilePage() {
  const { tokenData } = useAuth();
  const keycloakId = useSelector((s) => s.auth.userId);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await getActivities();
        if (!cancelled) setActivities(data || []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const summary = useMemo(() => {
    const byType = {};
    Object.keys(ACTIVITY_CONFIG).forEach((k) => {
      byType[k] = 0;
    });
    let calories = 0;
    activities.forEach((a) => {
      if (a.type) byType[a.type] = (byType[a.type] || 0) + 1;
      calories += a.caloriesBurned || 0;
    });
    let top = 'OTHER';
    let topN = 0;
    Object.entries(byType).forEach(([k, v]) => {
      if (v > topN) {
        topN = v;
        top = k;
      }
    });
    return {
      total: activities.length,
      calories,
      topType: topN ? ACTIVITY_CONFIG[top]?.label || top : '—',
      byType,
    };
  }, [activities]);

  const name =
    [tokenData?.given_name, tokenData?.family_name].filter(Boolean).join(' ') ||
    tokenData?.preferred_username ||
    'Athlete';

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Profile
      </Typography>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="neon-card"
        sx={{ p: 3, mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
      >
        <Avatar sx={{ width: 88, height: 88, fontSize: 32, bgcolor: 'primary.dark', border: '2px solid rgba(124,58,237,0.5)' }}>
          {initials(tokenData)}
        </Avatar>
        <Typography variant="h5">{name}</Typography>
        <Typography sx={{ color: 'text.secondary' }}>{tokenData?.email || '—'}</Typography>
        <Typography variant="body2" sx={{ color: 'text.muted', wordBreak: 'break-all' }}>
          Keycloak ID: {keycloakId || '—'}
        </Typography>
      </Box>

      <Box className="neon-card" sx={{ p: 2, mb: 3 }} component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Your stats
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>Total activities: {summary.total}</Typography>
        <Typography sx={{ color: 'text.secondary' }}>Total calories: {summary.calories}</Typography>
        <Typography sx={{ color: 'text.secondary' }}>Most frequent: {summary.topType}</Typography>
      </Box>

      <Box sx={{ height: 300 }} component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <ActivityDonutChart activitiesByType={summary.byType} />
      </Box>
    </Box>
  );
}
