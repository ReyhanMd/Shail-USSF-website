"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function GhostCursor({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  // Ghost Cursor fades in at the very end
  const opacity = useTransform(scrollYProgress, [0.9, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0.9, 1], [40, 0]);

  // A subtle floating animation to suggest it's waiting for input
  const float = {
    y: [0, -8, 0],
    x: [0, 5, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center"
    >
      <motion.div 
        animate={float}
        className="relative left-[120px] top-[40px] flex items-center gap-2"
      >
        <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.8)] relative">
          <div className="w-2 h-2 rounded-full bg-white animate-ping absolute" />
          <div className="w-2 h-2 rounded-full bg-white relative z-10" />
        </div>
        <div className="px-3 py-1 bg-white text-black text-xs font-bold rounded-md shadow-lg whitespace-nowrap">
          Ghost Cursor
        </div>
      </motion.div>
    </motion.div>
  );
}
