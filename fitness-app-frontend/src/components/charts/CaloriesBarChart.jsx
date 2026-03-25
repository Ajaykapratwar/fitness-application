import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import { CHART_COLORS } from '../../utils/chartColors';
import { getActivityConfig } from '../../utils/activityColors';

const BAR_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.success,
  CHART_COLORS.warning,
  CHART_COLORS.danger,
  '#a855f7',
  '#0ea5e9',
  '#f97316',
];

export default function CaloriesBarChart({ caloriesByType }) {
  const entries = Object.entries(caloriesByType || {})
    .filter(([, v]) => v > 0)
    .map(([name, calories]) => ({
      name: getActivityConfig(name).label,
      calories,
      key: name,
    }));

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.05 }}
      className="neon-card"
      sx={{ p: 2, height: 320 }}
    >
      <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>
        Calories by activity type
      </Typography>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={entries}>
          <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} interval={0} angle={-25} textAnchor="end" height={70} />
          <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              background: CHART_COLORS.tooltip.bg,
              border: CHART_COLORS.tooltip.border,
              borderRadius: 8,
            }}
          />
          <Bar dataKey="calories" radius={[6, 6, 0, 0]} isAnimationActive>
            {entries.map((e, i) => (
              <Cell key={e.key} fill={getActivityConfig(e.key).color || BAR_COLORS[i % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
