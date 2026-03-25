export const pageVariants = {
  initial: { opacity: 0, y: 24, filter: 'blur(4px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.45, ease: 'easeOut' },
  },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25 } },
};

export const containerVariants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.07 },
  },
};

export const cardVariants = {
  initial: { opacity: 0, scale: 0.94, y: 16 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4 } },
};
