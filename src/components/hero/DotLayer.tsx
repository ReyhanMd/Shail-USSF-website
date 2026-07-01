"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import timeline from "./hero-timeline.json";

export function DotLayer({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  // Dots fade in during Context Forming (0.50 to 0.75)
  const opacity = useTransform(scrollYProgress, [0.5, 0.75], [0, 1]);

  return (
    <motion.div 
      style={{ opacity }}
      className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center"
    >
      <svg className="overflow-visible" width="0" height="0">
        <g>
          {timeline.dots.map((coord, i) => (
            <Dot key={i} x={coord[0]} y={coord[1]} index={i} />
          ))}
        </g>
      </svg>
    </motion.div>
  );
}

function Dot({ x, y, index }: { x: number, y: number, index: number }) {
  const pulse = {
    opacity: [0.2, 0.8, 0.2],
    scale: [0.8, 1.2, 0.8],
    transition: {
      duration: 2,
      repeat: Infinity,
      delay: index * 0.1,
      ease: "easeInOut"
    }
  };

  return (
    <motion.circle
      cx={x}
      cy={y}
      r="2"
      fill="#fff"
      animate={pulse}
      className="drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]"
    />
  );
}
