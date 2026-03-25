import { AnimatePresence, motion } from 'framer-motion';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import { X, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearAll, markRead, removeNotification } from '../../store/notificationSlice';
import { formatDateTime } from '../../utils/formatters';

export default function NotificationDrawer({ open, onClose }) {
  const items = useSelector((s) => s.notifications.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 360, maxWidth: '100%' } }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ color: 'primary.light' }}>
          Notifications
        </Typography>
        <Box>
          {items.length > 0 && (
            <IconButton size="small" onClick={() => dispatch(clearAll())} sx={{ color: 'text.secondary' }}>
              <Trash2 size={18} />
            </IconButton>
          )}
          <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>
            <X size={18} />
          </IconButton>
        </Box>
      </Box>
      <Divider sx={{ borderColor: 'rgba(124,58,237,0.2)' }} />
      <List sx={{ py: 1 }}>
        <AnimatePresence>
          {items.length === 0 && (
            <Typography sx={{ px: 2, py: 4, color: 'text.secondary' }}>No notifications yet.</Typography>
          )}
          {items.map((n) => (
            <motion.div
              key={n.id}
              layout
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
            >
              <ListItemButton
                sx={{
                  bgcolor: n.read ? 'transparent' : 'rgba(124,58,237,0.06)',
                  borderLeft: n.read ? 'none' : '3px solid #7c3aed',
                  mb: 0.5,
                }}
                onClick={() => {
                  dispatch(markRead(n.id));
                  onClose();
                  if (n.activityId) navigate(`/activities/${n.activityId}`);
                }}
              >
                <ListItemText
                  primary={n.message}
                  secondary={formatDateTime(n.timestamp)}
                  primaryTypographyProps={{ sx: { color: 'text.primary', fontSize: '0.9rem' } }}
                  secondaryTypographyProps={{ sx: { color: 'text.secondary' } }}
                />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(removeNotification(n.id));
                  }}
                >
                  <X size={16} />
                </IconButton>
              </ListItemButton>
            </motion.div>
          ))}
        </AnimatePresence>
      </List>
    </Drawer>
  );
}
