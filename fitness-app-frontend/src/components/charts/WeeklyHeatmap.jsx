import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { addDays, isSameDay, parseISO, startOfWeek, subWeeks } from 'date-fns';
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function activityDate(a) {
  const raw = a.startTime || a.createdAt;
  if (!raw) return null;
  try {
    return typeof raw === 'string' ? parseISO(raw) : new Date(raw);
  } catch {
    return null;
  }
}

export default function WeeklyHeatmap({ activities }) {
  const today = new Date();
  const matrix = Array.from({ length: 4 }, () => Array(7).fill(0));
  for (let w = 0; w < 4; w++) {
    const weekStart = startOfWeek(subWeeks(today, 3 - w), { weekStartsOn: 1 });
    for (let d = 0; d < 7; d++) {
      const cellDate = addDays(weekStart, d);
      const count = (activities || []).filter((a) => {
        const ad = activityDate(a);
        return ad && isSameDay(ad, cellDate);
      }).length;
      matrix[w][d] = count;
    }
  }

  const max = Math.max(1, ...matrix.flat());

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.12 }}
      className="neon-card"
      sx={{ p: 2 }}
    >
      <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>
        4-week activity heatmap
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', gap: 0.5, pl: 4 }}>
          {DAYS.map((d) => (
            <Typography key={d} variant="caption" sx={{ width: 36, textAlign: 'center', color: 'text.muted' }}>
              {d}
            </Typography>
          ))}
        </Box>
        {matrix.map((row, wi) => (
          <Box key={wi} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ width: 28, color: 'text.muted' }}>
              W{wi + 1}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {row.map((v, di) => {
                const intensity = v / max;
                const bg =
                  v === 0
                    ? 'rgba(124,58,237,0.08)'
                    : `rgba(124,58,237,${0.25 + intensity * 0.65})`;
                return (
                  <motion.div
                    key={`${wi}-${di}`}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.02 * (wi * 7 + di) }}
                    title={`${v} activities`}
                    style={{
                      width: 36,
                      height: 28,
                      borderRadius: 6,
                      background: bg,
                      boxShadow: v > 0 ? `0 0 ${8 + intensity * 12}px rgba(6,182,212,0.35)` : 'none',
                      border: '1px solid rgba(124,58,237,0.2)',
                    }}
                  />
                );
              })}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
