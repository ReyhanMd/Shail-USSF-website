"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function ShailCore({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  // Fade in and scale up during SHAIL Active phase (0.75 to 1.0)
  const opacity = useTransform(scrollYProgress, [0.75, 1], [0, 1]);
  const scale = useTransform(scrollYProgress, [0.75, 1], [0.8, 1]);

  return (
    <motion.div
      style={{ opacity, scale }}
      className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center"
    >
      <div className="relative flex flex-col items-center justify-center">
        {/* Core Glowing Orb */}
        <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center backdrop-blur-xl border border-red-500/30 shadow-[0_0_40px_rgba(235,71,61,0.4)]">
          <img src="/logo.png" alt="SHAIL" className="w-12 h-12 object-contain" />
        </div>
        
        {/* Connection Ring */}
        <motion.div 
          className="absolute w-32 h-32 rounded-full border border-red-500/50 border-dashed"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        
        <div className="mt-4 px-4 py-1.5 rounded-full bg-black/60 border border-white/10 text-xs font-semibold text-white tracking-widest uppercase backdrop-blur-md">
          SHAIL Active
        </div>
      </div>
    </motion.div>
  );
}
