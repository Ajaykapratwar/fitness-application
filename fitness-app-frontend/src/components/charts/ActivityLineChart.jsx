import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { CHART_COLORS } from '../../utils/chartColors';
import { formatDisplayDate } from '../../utils/formatters';

export default function ActivityLineChart({ data }) {
  const chartData = (data || []).map((d) => ({
    ...d,
    label: formatDisplayDate(d.date),
  }));

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="neon-card"
      sx={{ p: 2, height: 320 }}
    >
      <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>
        Activities per day (last window)
      </Typography>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={chartData}>
          <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
          <XAxis dataKey="label" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              background: CHART_COLORS.tooltip.bg,
              border: CHART_COLORS.tooltip.border,
              borderRadius: 8,
            }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke={CHART_COLORS.primary}
            strokeWidth={2}
            dot={{ fill: CHART_COLORS.primary, strokeWidth: 2, r: 3 }}
            activeDot={{ r: 6, fill: CHART_COLORS.secondary }}
            isAnimationActive
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
