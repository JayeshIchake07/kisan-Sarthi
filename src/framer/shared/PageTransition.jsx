import { motion, AnimatePresence } from 'framer-motion';
import { pageTransition } from './animations';

/**
 * Wrapper component for animated page enter/exit transitions.
 */
export default function PageTransition({ children, id }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={id}
        initial={pageTransition.initial}
        animate={pageTransition.animate}
        exit={pageTransition.exit}
        style={{ width: '100%', height: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
