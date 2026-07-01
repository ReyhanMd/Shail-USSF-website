"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import { useMemo } from "react";

export function FabricLayer({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  // Subtly zoom out and increase intensity as context forms
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1.0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.15, 0.3, 0.2]);

  // Generate deterministic topographical paths
  const paths = useMemo(() => {
    const lines = [];
    for (let i = 0; i < 60; i++) {
      // Deterministic pseudo-random generation
      const yOffset = i * 18;
      const wave1 = 40 * Math.sin(i * 0.1);
      const wave2 = 60 * Math.cos(i * 0.15);
      
      const d = `M -200 ${yOffset + wave1} 
                 C 200 ${yOffset + wave2}, 
                   600 ${yOffset - wave1}, 
                   1200 ${yOffset + wave2}`;
      lines.push(d);
    }
    return lines;
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center"
      style={{ scale, opacity }}
    >
      <svg 
        className="w-full h-full min-w-[1200px]" 
        viewBox="0 0 1000 1000" 
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="fabric-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EB473D" stopOpacity="0.0" />
            <stop offset="20%" stopColor="#EB473D" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="80%" stopColor="#EB473D" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#EB473D" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <g transform="translate(0, -100) rotate(-15 500 500)">
          {paths.map((d, i) => (
            <path 
              key={i} 
              d={d} 
              fill="none" 
              stroke="url(#fabric-grad)" 
              strokeWidth={i % 3 === 0 ? "1.5" : "0.5"} 
            />
          ))}
        </g>
      </svg>
    </motion.div>
  );
}
