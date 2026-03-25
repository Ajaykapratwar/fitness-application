import { motion } from 'framer-motion';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import MetricCard from '../../components/ui/MetricCard';
import ActivityLineChart from '../../components/charts/ActivityLineChart';
import CaloriesBarChart from '../../components/charts/CaloriesBarChart';
import ActivityDonutChart from '../../components/charts/ActivityDonutChart';
import WeeklyHeatmap from '../../components/charts/WeeklyHeatmap';
import SkeletonCard from '../../components/ui/SkeletonCard';
import NeonBadge from '../../components/ui/NeonBadge';
import { containerVariants } from '../../utils/motionVariants';
import { useActivityStats } from '../../hooks/useActivityStats';
import { getActivities, getAllRecommendations } from '../../services/api';
import { getActivityConfig } from '../../utils/activityColors';
import { formatDisplayDate, formatDurationMinutes } from '../../utils/formatters';

export default function DashboardOverview() {
  const userId = useSelector((s) => s.auth.userId);
  const { stats, loading: statsLoading } = useActivityStats(30);
  const [activities, setActivities] = useState([]);
  const [recCount, setRecCount] = useState(0);
  const [loadingAct, setLoadingAct] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [a, r] = await Promise.all([
          getActivities(),
          userId ? getAllRecommendations(userId) : Promise.resolve({ data: [] }),
        ]);
        if (!cancelled) {
          setActivities(a.data || []);
          setRecCount((r.data || []).length);
        }
      } catch {
        if (!cancelled) {
          setActivities([]);
          setRecCount(0);
        }
      } finally {
        if (!cancelled) setLoadingAct(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const recent = [...activities]
    .sort((x, y) => new Date(y.startTime || y.createdAt) - new Date(x.startTime || x.createdAt))
    .slice(0, 5);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: 'text.primary' }}>
        Dashboard
      </Typography>

      <Box
        component={motion.div}
        variants={containerVariants}
        initial="initial"
        animate="animate"
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <Box key={i}>
            {statsLoading ? (
              <SkeletonCard height={100} />
            ) : (
              <MetricCard
                title={['Total activities', 'Calories burned', 'Total minutes', 'AI recommendations'][i]}
                value={
                  [stats?.totalActivities, stats?.totalCaloriesBurned, stats?.totalDurationMinutes, recCount][i] ?? 0
                }
              />
            )}
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
          gap: 2,
          mt: 2,
        }}
      >
        {statsLoading ? <SkeletonCard height={320} /> : <ActivityLineChart data={stats?.dailyBreakdown} />}
        {statsLoading ? <SkeletonCard height={320} /> : <CaloriesBarChart caloriesByType={stats?.caloriesByType} />}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 2,
          mt: 2,
        }}
      >
        {statsLoading ? <SkeletonCard height={320} /> : <ActivityDonutChart activitiesByType={stats?.activitiesByType} />}
        {loadingAct ? <SkeletonCard height={260} /> : <WeeklyHeatmap activities={activities} />}
      </Box>

      <Box className="neon-card" sx={{ mt: 3, p: 2 }} component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Recent activities</Typography>
          <MuiLink component={Link} to="/activities" underline="hover" sx={{ color: 'secondary.light' }}>
            View all
          </MuiLink>
        </Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'text.secondary' }}>Type</TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>Duration</TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>Calories</TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>Date</TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recent.map((row) => {
              const cfg = getActivityConfig(row.type);
              return (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <NeonBadge label={cfg.label} color={cfg.color} />
                  </TableCell>
                  <TableCell>{formatDurationMinutes(row.duration)}</TableCell>
                  <TableCell>{row.caloriesBurned ?? '—'}</TableCell>
                  <TableCell>{formatDisplayDate(row.startTime || row.createdAt)}</TableCell>
                  <TableCell>
                    <MuiLink component={Link} to={`/activities/${row.id}`} sx={{ color: 'primary.light' }}>
                      View recommendation
                    </MuiLink>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}
