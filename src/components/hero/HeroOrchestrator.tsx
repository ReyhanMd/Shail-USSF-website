"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FabricLayer } from "./FabricLayer";
import { FloatingWidgets } from "./FloatingWidgets";
import { ConnectionPaths } from "./ConnectionPaths";
import { DotLayer } from "./DotLayer";
import { ShailCore } from "./ShailCore";
import { GhostCursor } from "./GhostCursor";

export function HeroOrchestrator() {
  const containerRef = useRef<HTMLDivElement>(null);

  // We track the scroll progress of this highly tall container.
  // The container will be 400vh tall to allow a long scroll journey.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Fade out the hero completely when scrolling past the orchestrator area
  const heroOpacity = useTransform(scrollYProgress, [0.95, 1], [1, 0]);

  return (
    <div ref={containerRef} className="relative w-full h-[400vh] bg-black">
      {/* Sticky section that holds the visual composition while we scroll down */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        <motion.div style={{ opacity: heroOpacity }} className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center">
          
          {/* Layer 1: Deterministic Fabric */}
          <FabricLayer scrollYProgress={scrollYProgress} />
          
          {/* Layer 2: Floating Widgets (Fragmented -> Drifting In) */}
          <FloatingWidgets scrollYProgress={scrollYProgress} />
          
          {/* Layer 3: Connection Paths (Draws in) */}
          <ConnectionPaths scrollYProgress={scrollYProgress} />
          
          {/* Layer 4: Pulse Dots (Context Forming) */}
          <DotLayer scrollYProgress={scrollYProgress} />
          
          {/* Layer 5: Orchestration Core (Active) */}
          <ShailCore scrollYProgress={scrollYProgress} />
          
          {/* Layer 6: Ghost Cursor */}
          <GhostCursor scrollYProgress={scrollYProgress} />
          
          {/* Hero Typography overlay - Fades out as we scroll deep into the narrative */}
          <HeroText scrollYProgress={scrollYProgress} />

        </motion.div>
      </div>
    </div>
  );
}

function HeroText({ scrollYProgress }: { scrollYProgress: any }) {
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.15], [0, -50]);

  return (
    <motion.div 
      style={{ opacity, y }}
      className="absolute z-50 text-center flex flex-col items-center pointer-events-none"
    >
      <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-semibold text-white tracking-widest uppercase shadow-2xl">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        Intelligence Layer Active
      </div>
      <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-6">
        FLOW FAST.
      </h1>
      <p className="max-w-2xl text-lg md:text-xl text-zinc-400 font-medium">
        SHAIL captures context, creates blueprints, and executes actions directly in your active workspace. Scroll to see the architecture.
      </p>
    </motion.div>
  );
}
