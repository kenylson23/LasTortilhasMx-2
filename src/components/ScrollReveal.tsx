import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { ReactNode, memo, useMemo } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  threshold?: number;
  stagger?: boolean;
  staggerDelay?: number;
  staggerIndex?: number;
}

const ScrollReveal = memo(({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 50,
  className = '',
  threshold = 0.1,
  stagger = false,
  staggerDelay = 0.1,
  staggerIndex = 0,
}: ScrollRevealProps) => {
  const { ref, isVisible } = useScrollReveal({ threshold });

  // Memoizar os estados para evitar recalcular a cada render
  const initialState = useMemo(() => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: distance };
      case 'down':
        return { opacity: 0, y: -distance };
      case 'left':
        return { opacity: 0, x: distance };
      case 'right':
        return { opacity: 0, x: -distance };
      case 'fade':
        return { opacity: 0 };
      default:
        return { opacity: 0, y: distance };
    }
  }, [direction, distance]);

  const animateState = useMemo(() => {
    switch (direction) {
      case 'up':
      case 'down':
        return { opacity: 1, y: 0 };
      case 'left':
      case 'right':
        return { opacity: 1, x: 0 };
      case 'fade':
        return { opacity: 1 };
      default:
        return { opacity: 1, y: 0 };
    }
  }, [direction]);

  const finalDelay = useMemo(() => 
    stagger ? delay + (staggerIndex * staggerDelay) : delay,
    [stagger, delay, staggerIndex, staggerDelay]
  );

  const transitionConfig = useMemo(() => ({
    duration,
    delay: finalDelay,
    ease: "easeOut",
  }), [duration, finalDelay]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={initialState}
      animate={isVisible ? animateState : initialState}
      transition={transitionConfig}
    >
      {children}
    </motion.div>
  );
});

ScrollReveal.displayName = 'ScrollReveal';

export default ScrollReveal;