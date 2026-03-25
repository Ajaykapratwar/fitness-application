import { motion } from 'framer-motion';
import { Box, Typography, MenuItem, Select, FormControl, InputLabel, Button } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NeonBadge from '../../components/ui/NeonBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import { getAllRecommendations } from '../../services/api';
import { getActivityConfig, ACTIVITY_CONFIG } from '../../utils/activityColors';
import { formatDisplayDate } from '../../utils/formatters';
import { Sparkles } from 'lucide-react';

export default function RecommendationsPage() {
  const userId = useSelector((s) => s.auth.userId);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');
  const [sortBy, setSortBy] = useState('dateDesc');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await getAllRecommendations(userId);
        if (!cancelled) setList(data || []);
      } catch {
        if (!cancelled) setList([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const filtered = useMemo(() => {
    let rows = [...list];
    if (filterType !== 'ALL') {
      rows = rows.filter((r) => (r.activityType || '').toUpperCase() === filterType);
    }
    rows.sort((a, b) => {
      const da = new Date(a.createdAt || 0);
      const db = new Date(b.createdAt || 0);
      return sortBy === 'dateDesc' ? db - da : da - db;
    });
    return rows;
  }, [list, filterType, sortBy]);

  if (loading) return <LoadingSpinner />;

  if (!list.length) {
    return <EmptyState title="No recommendations yet" subtitle="Log an activity to generate AI insights." icon={Sparkles} />;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        AI recommendations
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Activity type</InputLabel>
          <Select value={filterType} label="Activity type" onChange={(e) => setFilterType(e.target.value)}>
            <MenuItem value="ALL">All</MenuItem>
            {Object.keys(ACTIVITY_CONFIG).map((t) => (
              <MenuItem key={t} value={t}>
                {ACTIVITY_CONFIG[t].label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Sort</InputLabel>
          <Select value={sortBy} label="Sort" onChange={(e) => setSortBy(e.target.value)}>
            <MenuItem value="dateDesc">Newest</MenuItem>
            <MenuItem value="dateAsc">Oldest</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
        {filtered.map((r) => {
          const cfg = getActivityConfig(r.activityType);
          const excerpt = (r.analysisText || '').slice(0, 120);
          return (
            <Box
              key={r.id}
              component={motion.div}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="neon-card"
              sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}
            >
              <NeonBadge label={cfg.label} color={cfg.color} />
              <Typography variant="caption" sx={{ color: 'text.muted' }}>
                {formatDisplayDate(r.createdAt)}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', flex: 1 }}>
                {excerpt}
                {(r.analysisText || '').length > 120 ? '…' : ''}
              </Typography>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  component={Link}
                  to={`/activities/${r.activityId}`}
                  fullWidth
                  size="small"
                  variant="outlined"
                  color="secondary"
                >
                  View full
                </Button>
              </motion.div>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
