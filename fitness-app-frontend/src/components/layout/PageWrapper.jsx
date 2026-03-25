import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { pageVariants } from '../../utils/motionVariants';

export default function PageWrapper({ children }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ width: '100%', minHeight: '60vh' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
