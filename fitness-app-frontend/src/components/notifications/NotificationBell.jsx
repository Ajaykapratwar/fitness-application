import { motion } from 'framer-motion';
import { Badge, IconButton } from '@mui/material';
import { Bell } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLatestRecommendations } from '../../services/api';
import { addNotification, setLastPollSince } from '../../store/notificationSlice';
import NotificationDrawer from './NotificationDrawer';

const POLL_MS = 30_000;

export default function NotificationBell({ userId }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const items = useSelector((s) => s.notifications.items);
  const lastSinceRef = useRef(null);
  const seenRecIds = useRef(new Set());

  const unread = items.filter((n) => !n.read).length;

  useEffect(() => {
    if (!userId) return undefined;
    if (!lastSinceRef.current) {
      lastSinceRef.current = new Date().toISOString();
    }

    const tick = async () => {
      try {
        const since = lastSinceRef.current;
        const { data } = await getLatestRecommendations(userId, since);
        (data || []).forEach((rec) => {
          if (!rec?.id || seenRecIds.current.has(rec.id)) return;
          seenRecIds.current.add(rec.id);
          dispatch(
            addNotification({
              activityId: rec.activityId,
              activityType: rec.activityType,
              message: `Your ${rec.activityType || 'activity'} session analysis is ready!`,
            }),
          );
        });
        const now = new Date().toISOString();
        lastSinceRef.current = now;
        dispatch(setLastPollSince(now));
      } catch {
        /* ignore poll errors */
      }
    };

    const id = setInterval(tick, POLL_MS);
    tick();
    return () => clearInterval(id);
  }, [userId, dispatch]);

  return (
    <>
      <motion.div
        animate={unread > 0 ? { scale: [1, 1.06, 1] } : {}}
        transition={{ repeat: unread > 0 ? Infinity : 0, duration: 2.2 }}
      >
        <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: 'text.primary' }}>
          <Badge
            badgeContent={unread}
            color="error"
            overlap="circular"
            sx={{
              '& .MuiBadge-badge': {
                boxShadow: unread > 0 ? '0 0 10px rgba(236,72,153,0.7)' : 'none',
              },
            }}
          >
            <Bell size={22} />
          </Badge>
        </IconButton>
      </motion.div>
      <NotificationDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
