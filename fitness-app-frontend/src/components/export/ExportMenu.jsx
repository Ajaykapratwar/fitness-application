import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { FileDown, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { exportActivitiesCSV, exportFitnessPdf } from '../../services/exportService';

export default function ExportMenu({ activities, recommendations, stats, userName, disabled }) {
  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);

  const handleCsv = () => {
    try {
      exportActivitiesCSV(activities || []);
      toast.success('CSV exported');
    } catch {
      toast.error('CSV export failed');
    }
    setAnchor(null);
  };

  const handlePdf = async () => {
    try {
      await exportFitnessPdf({
        userName,
        activities,
        recommendations,
        stats,
      });
      toast.success('PDF exported');
    } catch {
      toast.error('PDF export failed');
    }
    setAnchor(null);
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button variant="outlined" color="secondary" disabled={disabled} onClick={(e) => setAnchor(e.currentTarget)}>
        Export
      </Button>
      <Menu anchorEl={anchor} open={open} onClose={() => setAnchor(null)}>
        <MenuItem onClick={handleCsv}>
          <ListItemIcon>
            <FileDown size={18} />
          </ListItemIcon>
          <ListItemText primary="Download CSV" />
        </MenuItem>
        <MenuItem onClick={handlePdf}>
          <ListItemIcon>
            <FileText size={18} />
          </ListItemIcon>
          <ListItemText primary="Download PDF report" />
        </MenuItem>
      </Menu>
    </motion.div>
  );
}
