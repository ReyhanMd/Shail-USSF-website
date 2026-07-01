"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import timeline from "./hero-timeline.json";

export function FloatingWidgets({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
      {timeline.widgets.map((widget, i) => (
        <Widget 
          key={widget.id} 
          widget={widget} 
          scrollYProgress={scrollYProgress} 
          index={i}
        />
      ))}
    </div>
  );
}

function Widget({ 
  widget, 
  scrollYProgress, 
  index 
}: { 
  widget: any, 
  scrollYProgress: MotionValue<number>,
  index: number 
}) {
  // Drift inward during the "Connecting" state (0.25 to 0.50)
  const x = useTransform(scrollYProgress, [0.25, 0.5], [widget.start[0], widget.end[0]]);
  const y = useTransform(scrollYProgress, [0.25, 0.5], [widget.start[1], widget.end[1]]);
  
  // Fade in during Fragmented state
  const opacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  // Very subtle floating animation independent of scroll
  const floatY = {
    y: ["-4px", "4px"],
    transition: {
      duration: 3 + index,
      repeat: Infinity,
      repeatType: "mirror" as const,
      ease: "easeInOut"
    }
  };

  return (
    <motion.div
      style={{ x, y, opacity }}
      className="absolute flex items-center justify-center"
    >
      <motion.div
        animate={floatY}
        className="px-6 py-3 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl text-sm font-medium text-zinc-300 tracking-wide"
      >
        {widget.label}
      </motion.div>
    </motion.div>
  );
}
