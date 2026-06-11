/**
 * Kisan Sarthi Design System — Framer Motion Animation Variants
 */

/** Page transition variants */
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

/** Fade in from below */
export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

/** Fade in from left */
export const fadeInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

/** Fade in from right */
export const fadeInRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

/** Scale in with spring */
export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } },
};

/** Stagger container — children animate in sequence */
export const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

/** Stagger child item */
export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

/** Card hover effect */
export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -4,
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  },
};

/** Subtle card tap */
export const cardTap = {
  scale: 0.98,
  transition: { duration: 0.1 },
};

/** Counter spring animation config */
export const counterSpring = {
  type: 'spring',
  stiffness: 100,
  damping: 30,
  mass: 1,
};

/** Bottom sheet variants */
export const bottomSheet = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: { y: '100%', opacity: 0, transition: { duration: 0.3 } },
};

/** Tab switch animation */
export const tabSwitch = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

/** Sidebar slide in */
export const sidebarSlide = {
  initial: { x: -280, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
};

/** Pulse animation for live indicators */
export const pulse = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [1, 0.7, 1],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
};

/** Skeleton loading shimmer */
export const shimmer = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: { duration: 1.5, repeat: Infinity, ease: 'linear' },
  },
};

/** List item enter animation */
export const listItemEnter = {
  initial: { opacity: 0, x: -20, height: 0 },
  animate: { opacity: 1, x: 0, height: 'auto', transition: { duration: 0.3 } },
  exit: { opacity: 0, x: 20, height: 0, transition: { duration: 0.2 } },
};

/** Notification bell shake */
export const bellShake = {
  animate: {
    rotate: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
};
