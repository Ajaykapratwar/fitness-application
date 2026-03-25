import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Alert,
} from '@mui/material';
import { ChevronDown, Share2, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import NeonBadge from '../../components/ui/NeonBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import NeonButton from '../../components/ui/NeonButton';
import { getActivity, getActivitieDetail } from '../../services/api';
import { getActivityConfig } from '../../utils/activityColors';
import { formatDateTime, formatDurationMinutes } from '../../utils/formatters';

function AnalysisBlocks({ text }) {
  if (!text) return null;
  return text.split(/\n+/).map((line, i) => {
    const t = line.trim();
    if (t.startsWith('**') && t.endsWith('**') && t.length > 4) {
      return (
        <Typography key={i} variant="subtitle1" sx={{ fontWeight: 700, mt: 1.5, color: 'primary.light' }}>
          {t.slice(2, -2)}
        </Typography>
      );
    }
    return (
      <Typography key={i} paragraph sx={{ color: 'text.secondary', mb: 1 }}>
        {line}
      </Typography>
    );
  });
}

export default function ActivityDetail() {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [rec, setRec] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recPending, setRecPending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [actRes, recRes] = await Promise.allSettled([getActivity(id), getActivitieDetail(id)]);
        if (cancelled) return;
        if (actRes.status === 'fulfilled') setActivity(actRes.value.data);
        if (recRes.status === 'fulfilled') {
          setRec(recRes.value.data);
          setRecPending(false);
        } else {
          setRec(null);
          setRecPending(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied');
    } catch {
      toast.error('Could not copy');
    }
  };

  if (loading) return <LoadingSpinner />;

  const type = activity?.type || rec?.activityType;
  const cfg = getActivityConfig(type);
  const Icon = cfg.icon;
  const improvements = rec?.improvements || [];
  const suggestions = rec?.suggestions || [];
  const safety = [...(rec?.safetyGuidelines || []), ...(rec?.safety || [])];

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Box
        component={motion.section}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="neon-card"
        sx={{ p: 3, mb: 2, position: 'relative' }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Icon size={40} color={cfg.color} />
            <Box>
              <NeonBadge label={cfg.label} color={cfg.color} />
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                {formatDateTime(activity?.startTime || activity?.createdAt || rec?.createdAt)}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                {formatDurationMinutes(activity?.duration)} · {activity?.caloriesBurned ?? '—'} kcal
              </Typography>
            </Box>
          </Box>
          <NeonButton startIcon={<Share2 size={18} />} onClick={share} variant="outlined" color="secondary">
            Share
          </NeonButton>
        </Box>
      </Box>

      {recPending && (
        <Box className="neon-card" sx={{ p: 2, mb: 2 }}>
          <Typography sx={{ color: 'warning.light' }}>
            AI recommendation is still processing. Notifications will alert you when it is ready.
          </Typography>
        </Box>
      )}

      {rec?.analysisText && (
        <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="neon-card" sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            AI analysis
          </Typography>
          <AnalysisBlocks text={rec.analysisText} />
          {rec.recommendation && (
            <Typography sx={{ mt: 2, color: 'secondary.light' }}>{rec.recommendation}</Typography>
          )}
        </Box>
      )}

      {improvements.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Improvements
          </Typography>
          {improvements.map((item, idx) => (
            <Accordion
              key={idx}
              defaultExpanded={idx === 0}
              sx={{
                mb: 1,
                borderLeft: '4px solid #7c3aed',
                bgcolor: 'rgba(16,16,30,0.55)',
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary expandIcon={<ChevronDown color="#a855f7" />}>
                <Typography sx={{ color: 'text.primary' }}>Focus area {idx + 1}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ color: 'text.secondary' }}>{item}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}

      {suggestions.length > 0 && (
        <Box className="neon-card" sx={{ p: 2, mb: 2 }} component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Suggested workouts
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
            {suggestions.map((s, i) => (
              <Box
                key={i}
                component={motion.div}
                whileHover={{ scale: 1.02 }}
                sx={{
                  minWidth: 260,
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid rgba(6,182,212,0.35)',
                  bgcolor: 'rgba(6,182,212,0.06)',
                }}
              >
                <Typography variant="subtitle2" sx={{ color: 'secondary.light', mb: 0.5 }}>
                  Idea {i + 1}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {s}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {safety.length > 0 && (
        <Alert
          severity="warning"
          icon={<AlertTriangle size={22} />}
          sx={{
            bgcolor: 'rgba(234,179,8,0.08)',
            color: '#fde68a',
            border: '1px solid rgba(249,115,22,0.4)',
            '& .MuiAlert-icon': { color: '#f97316' },
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Safety guidelines
          </Typography>
          {safety.map((s, i) => (
            <Typography key={i} variant="body2" sx={{ display: 'block', mb: 0.5 }}>
              • {s}
            </Typography>
          ))}
        </Alert>
      )}
    </Box>
  );
}
