import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CHART_COLORS } from '../../utils/chartColors';
import { getActivityConfig } from '../../utils/activityColors';

const FALLBACK = [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.success, CHART_COLORS.warning, CHART_COLORS.danger];

export default function ActivityDonutChart({ activitiesByType }) {
  const data = Object.entries(activitiesByType || {})
    .filter(([, v]) => v > 0)
    .map(([type, value]) => ({
      name: getActivityConfig(type).label,
      value,
      type,
    }));

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
      className="neon-card"
      sx={{ p: 2, height: 320 }}
    >
      <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>
        Activity mix
      </Typography>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={80}
            paddingAngle={3}
            isAnimationActive
          >
            {data.map((entry, index) => (
              <Cell key={entry.type} fill={getActivityConfig(entry.type).color || FALLBACK[index % FALLBACK.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: CHART_COLORS.tooltip.bg,
              border: CHART_COLORS.tooltip.border,
              borderRadius: 8,
            }}
          />
          <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}
