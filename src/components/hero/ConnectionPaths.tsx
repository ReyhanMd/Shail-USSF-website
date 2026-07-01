"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import timeline from "./hero-timeline.json";

export function ConnectionPaths({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  // Path draws in completely during 0.25 to 0.50
  const pathLength = useTransform(scrollYProgress, [0.25, 0.5], [0, 1]);
  // Opacity peaks when paths finish drawing, then dims slightly as focus shifts to Core
  const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 0.8, 0.3]);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
      <svg className="overflow-visible" width="0" height="0">
        <g>
          {timeline.connections.map((conn) => (
            <motion.path
              key={conn.id}
              d={conn.path}
              fill="none"
              stroke="#EB473D"
              strokeWidth="2"
              strokeDasharray="0 1"
              style={{ pathLength, opacity }}
              className="drop-shadow-[0_0_8px_rgba(235,71,61,0.5)]"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
