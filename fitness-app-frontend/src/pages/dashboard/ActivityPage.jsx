import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Slider,
  Collapse,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
} from '@mui/material';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAfter, isBefore, endOfDay, parseISO, startOfDay } from 'date-fns';
import toast from 'react-hot-toast';
import GlowInput from '../../components/ui/GlowInput';
import NeonButton from '../../components/ui/NeonButton';
import NeonBadge from '../../components/ui/NeonBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ExportMenu from '../../components/export/ExportMenu';
import { addActivity, getActivities, getAllRecommendations } from '../../services/api';
import { ACTIVITY_CONFIG, getActivityConfig } from '../../utils/activityColors';
import { formatDisplayDate } from '../../utils/formatters';
import { useActivityStats } from '../../hooks/useActivityStats';
import { useAuth } from '../../hooks/useAuth';

const TYPES = Object.keys(ACTIVITY_CONFIG);

export default function ActivityPage() {
  const navigate = useNavigate();
  const { tokenData, userId } = useAuth();
  const userName = [tokenData?.given_name, tokenData?.family_name].filter(Boolean).join(' ') || 'Athlete';

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [expandedMetrics, setExpandedMetrics] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const { stats, refresh: refreshStats } = useActivityStats(30);

  const [form, setForm] = useState({
    type: 'RUNNING',
    duration: 30,
    caloriesBurned: '',
    pace: '',
    distance: '',
    heartRate: '',
  });
  const [errors, setErrors] = useState({});

  const [filterType, setFilterType] = useState('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState('dateDesc');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [a, r] = await Promise.all([
        getActivities(),
        userId ? getAllRecommendations(userId) : Promise.resolve({ data: [] }),
      ]);
      setActivities(a.data || []);
      setRecommendations(r.data || []);
    } catch (e) {
      toast.error('Could not load activities');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    let list = [...activities];
    if (filterType !== 'ALL') {
      list = list.filter((a) => a.type === filterType);
    }
    if (dateFrom) {
      const from = startOfDay(parseISO(dateFrom));
      list = list.filter((a) => {
        const d = a.startTime || a.createdAt;
        if (!d) return false;
        const ad = typeof d === 'string' ? parseISO(d) : new Date(d);
        return !isBefore(ad, from);
      });
    }
    if (dateTo) {
      const to = endOfDay(parseISO(dateTo));
      list = list.filter((a) => {
        const d = a.startTime || a.createdAt;
        if (!d) return false;
        const ad = typeof d === 'string' ? parseISO(d) : new Date(d);
        return !isAfter(ad, to);
      });
    }
    list.sort((a, b) => {
      const da = new Date(a.startTime || a.createdAt);
      const db = new Date(b.startTime || b.createdAt);
      if (sortBy === 'dateDesc') return db - da;
      if (sortBy === 'dateAsc') return da - db;
      if (sortBy === 'calories') return (b.caloriesBurned || 0) - (a.caloriesBurned || 0);
      if (sortBy === 'duration') return (b.duration || 0) - (a.duration || 0);
      return 0;
    });
    return list;
  }, [activities, filterType, dateFrom, dateTo, sortBy]);

  const validate = () => {
    const e = {};
    const cals = Number(form.caloriesBurned);
    if (form.caloriesBurned === '' || Number.isNaN(cals) || cals < 0) {
      e.caloriesBurned = 'Valid calories required';
    }
    if (!form.duration || form.duration < 1) {
      e.duration = 'Duration must be at least 1 minute';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) {
      toast.error('Fix form errors');
      return;
    }
    setSubmitting(true);
    const additionalMetrics = {};
    if (form.pace) additionalMetrics.pace = form.pace;
    if (form.distance) additionalMetrics.distance = form.distance;
    if (form.heartRate) additionalMetrics.heartRate = form.heartRate;

    const payload = {
      type: form.type,
      duration: Number(form.duration),
      caloriesBurned: Number(form.caloriesBurned),
      startTime: new Date().toISOString(),
      additionalMetrics: Object.keys(additionalMetrics).length ? additionalMetrics : undefined,
    };

    try {
      await addActivity(payload);
      toast.success('Activity logged');
      setForm((f) => ({
        ...f,
        caloriesBurned: '',
        pace: '',
        distance: '',
        heartRate: '',
      }));
      await load();
      refreshStats();
    } catch {
      toast.error('Failed to save activity');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && activities.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Activities
        </Typography>
        <ExportMenu
          activities={filtered}
          recommendations={recommendations}
          stats={stats}
          userName={userName}
          disabled={filtered.length === 0}
        />
      </Box>

      <Box
        component={motion.form}
        onSubmit={handleSubmit}
        className="neon-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{ p: 2, mb: 3 }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Log activity
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
          Activity type
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' },
            gap: 1.5,
            mb: 2,
          }}
        >
          {TYPES.map((t) => {
            const cfg = ACTIVITY_CONFIG[t];
            const Icon = cfg.icon;
            const selected = form.type === t;
            return (
              <Box
                key={t}
                component={motion.button}
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setForm((f) => ({ ...f, type: t }))}
                sx={{
                  cursor: 'pointer',
                  borderRadius: 2,
                  p: 1.5,
                  border: selected ? `2px solid ${cfg.color}` : '1px solid rgba(255,255,255,0.08)',
                  bgcolor: selected ? `${cfg.color}22` : 'rgba(16,16,30,0.6)',
                  boxShadow: selected ? `0 0 20px ${cfg.color}44` : 'none',
                  color: 'text.primary',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <Icon size={26} color={cfg.color} />
                <Typography variant="caption">{cfg.label}</Typography>
              </Box>
            );
          })}
        </Box>

        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
          Duration (minutes)
        </Typography>
        <Slider
          value={form.duration}
          min={5}
          max={180}
          onChange={(_, v) => setForm((f) => ({ ...f, duration: v }))}
          sx={{ color: 'primary.main', mb: 1 }}
        />
        <GlowInput
          label="Duration"
          type="number"
          value={form.duration}
          onChange={(e) => setForm((f) => ({ ...f, duration: Number(e.target.value) || 0 }))}
          error={errors.duration}
        />
        <Box sx={{ mt: 2 }}>
          <GlowInput
            label="Calories burned"
            type="number"
            value={form.caloriesBurned}
            onChange={(e) => setForm((f) => ({ ...f, caloriesBurned: e.target.value }))}
            error={errors.caloriesBurned}
            InputProps={{ endAdornment: <InputAdornment position="end">kcal</InputAdornment> }}
          />
        </Box>

        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Extra metrics
          </Typography>
          <IconButton size="small" onClick={() => setExpandedMetrics((x) => !x)} sx={{ color: 'primary.light' }}>
            {expandedMetrics ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </IconButton>
        </Box>
        <Collapse in={expandedMetrics}>
          <Box sx={{ display: 'grid', gap: 2, mt: 2 }}>
            <GlowInput label="Pace" value={form.pace} onChange={(e) => setForm((f) => ({ ...f, pace: e.target.value }))} />
            <GlowInput label="Distance" value={form.distance} onChange={(e) => setForm((f) => ({ ...f, distance: e.target.value }))} />
            <GlowInput
              label="Heart rate"
              type="number"
              value={form.heartRate}
              onChange={(e) => setForm((f) => ({ ...f, heartRate: e.target.value }))}
            />
          </Box>
        </Collapse>

        <Box sx={{ mt: 2 }}>
          <NeonButton type="submit" disabled={submitting} fullWidth>
            {submitting ? 'Saving…' : 'Submit activity'}
          </NeonButton>
        </Box>
      </Box>

      <Box className="neon-card" sx={{ p: 2, mb: 2 }} component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Type</InputLabel>
            <Select value={filterType} label="Type" onChange={(e) => setFilterType(e.target.value)}>
              <MenuItem value="ALL">All</MenuItem>
              {TYPES.map((t) => (
                <MenuItem key={t} value={t}>
                  {ACTIVITY_CONFIG[t].label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <GlowInput
            label="From"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            sx={{ maxWidth: 200 }}
          />
          <GlowInput
            label="To"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            sx={{ maxWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Sort</InputLabel>
            <Select value={sortBy} label="Sort" onChange={(e) => setSortBy(e.target.value)}>
              <MenuItem value="dateDesc">Date (newest)</MenuItem>
              <MenuItem value="dateAsc">Date (oldest)</MenuItem>
              <MenuItem value="calories">Calories</MenuItem>
              <MenuItem value="duration">Duration</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
        {filtered.map((a) => {
          const cfg = getActivityConfig(a.type);
          const Icon = cfg.icon;
          return (
            <Box
              key={a.id}
              component={motion.div}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="neon-card"
              sx={{ p: 2, cursor: 'pointer' }}
              onClick={() => navigate(`/activities/${a.id}`)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Icon size={22} color={cfg.color} />
                <NeonBadge label={cfg.label} color={cfg.color} />
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {a.duration} min · {a.caloriesBurned ?? '—'} kcal
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.muted' }}>
                {formatDisplayDate(a.startTime || a.createdAt)}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
