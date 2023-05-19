export const containerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // delay between child animations
    },
  },
};

export const itemVariants = {
  hidden: { y: -20, opacity: 0 }, // start above and faded out
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring", // 'spring' will make it look like they're dropping
      damping: 15,
      stiffness: 100,
    },
  },
};
