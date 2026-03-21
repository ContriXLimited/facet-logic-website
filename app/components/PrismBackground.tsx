"use client";

import { motion } from "framer-motion";

/**
 * Prism refracting light into rainbow fan beams — animated.
 *
 * Phase 1 (0–2s): white beam shoots in from the left toward the prism.
 * Phase 2 (1.5–3.5s): rainbow fan beams unfold one by one.
 * Phase 3 (loop): gentle brightness pulse on all beams.
 */

const COLORS = [
  { color: "255,0,0", opacity: 0.45 },       // red
  { color: "255,127,0", opacity: 0.4 },      // orange
  { color: "255,255,0", opacity: 0.35 },     // yellow
  { color: "0,200,0", opacity: 0.35 },       // green
  { color: "0,100,255", opacity: 0.4 },      // blue
  { color: "75,0,130", opacity: 0.35 },      // indigo
  { color: "148,0,211", opacity: 0.4 },      // violet
];

// Fan total spread: 45° total, ~6.4° per beam
const FAN_START = -22.5;
const BEAM_WIDTH = 45 / 7;
const BEAM_RADIUS = 600;

// Exit point: midpoint of the right edge of the equilateral triangle
const EXIT_X = 660;
const EXIT_Y = 365;

function polarToCart(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function fanPath(index: number, widthOverride?: number) {
  const bw = widthOverride ?? BEAM_WIDTH;
  const startAngle = FAN_START + index * BEAM_WIDTH + (BEAM_WIDTH - bw) / 2;
  const endAngle = startAngle + bw;
  const p1 = polarToCart(EXIT_X, EXIT_Y, BEAM_RADIUS, startAngle);
  const p2 = polarToCart(EXIT_X, EXIT_Y, BEAM_RADIUS, endAngle);
  return `M ${EXIT_X} ${EXIT_Y} L ${p1.x} ${p1.y} A ${BEAM_RADIUS} ${BEAM_RADIUS} 0 0 1 ${p2.x} ${p2.y} Z`;
}

// Blend path sits between two adjacent beams, overlapping both
function blendPath(index: number) {
  const mid = FAN_START + (index + 0.5) * BEAM_WIDTH;
  const halfSpan = BEAM_WIDTH * 0.7;
  const startAngle = mid - halfSpan;
  const endAngle = mid + halfSpan;
  const p1 = polarToCart(EXIT_X, EXIT_Y, BEAM_RADIUS, startAngle);
  const p2 = polarToCart(EXIT_X, EXIT_Y, BEAM_RADIUS, endAngle);
  return `M ${EXIT_X} ${EXIT_Y} L ${p1.x} ${p1.y} A ${BEAM_RADIUS} ${BEAM_RADIUS} 0 0 1 ${p2.x} ${p2.y} Z`;
}

// Blend colors between adjacent beams
const BLEND_COLORS = COLORS.slice(0, -1).map((c, i) => {
  const next = COLORS[i + 1];
  // Parse rgb values and average them
  const [r1, g1, b1] = c.color.split(",").map(Number);
  const [r2, g2, b2] = next.color.split(",").map(Number);
  return {
    color: `${Math.round((r1 + r2) / 2)},${Math.round((g1 + g2) / 2)},${Math.round((b1 + b2) / 2)}`,
    opacity: (c.opacity + next.opacity) / 2 * 0.5,
  };
});

export default function PrismBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center">
      <svg
        viewBox="0 0 1200 800"
        className="w-[80vw] h-[80vh]"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Incoming white light beam */}
          <linearGradient id="beam-in" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="60%" stopColor="rgba(255,255,255,0.12)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.25)" />
          </linearGradient>

          {/* Radial gradients for each rainbow fan beam */}
          {COLORS.map((c, i) => (
            <radialGradient
              key={i}
              id={`rainbow-${i}`}
              cx={EXIT_X}
              cy={EXIT_Y}
              r={BEAM_RADIUS}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={`rgba(${c.color},${c.opacity})`} />
              <stop offset="70%" stopColor={`rgba(${c.color},${c.opacity * 0.3})`} />
              <stop offset="100%" stopColor={`rgba(${c.color},0)`} />
            </radialGradient>
          ))}

          {/* Radial gradients for blend layers between beams */}
          {BLEND_COLORS.map((c, i) => (
            <radialGradient
              key={`blend-${i}`}
              id={`rainbow-blend-${i}`}
              cx={EXIT_X}
              cy={EXIT_Y}
              r={BEAM_RADIUS}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={`rgba(${c.color},${c.opacity})`} />
              <stop offset="50%" stopColor={`rgba(${c.color},${c.opacity * 0.3})`} />
              <stop offset="100%" stopColor={`rgba(${c.color},0)`} />
            </radialGradient>
          ))}

          {/* Prism fill */}
          <linearGradient id="prism-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.07)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
          </linearGradient>

          <filter id="beam-glow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Soft edge filter — heavier blur for diffused light edges */}
          <filter id="beam-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="14" result="soft" />
            <feMerge>
              <feMergeNode in="soft" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Clip path to reveal beam from left to right */}
          <clipPath id="beam-reveal">
            <motion.rect
              x={0}
              y={0}
              height={800}
              initial={{ width: 0 }}
              animate={{ width: 560 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
            />
          </clipPath>
        </defs>

        {/* Phase 1: Incoming light beam — slides in from left */}
        <g clipPath="url(#beam-reveal)">
          <polygon
            points="0,340 0,460 540,405 540,385"
            fill="url(#beam-in)"
            filter="url(#beam-glow)"
          />
        </g>

        {/* Phase 2: Rainbow fan beams — appear one by one with pulse */}
        {COLORS.map((_, i) => (
          <motion.path
            key={i}
            d={fanPath(i)}
            fill={`url(#rainbow-${i})`}
            filter="url(#beam-soft)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 1, 0.7, 1], scale: [0, 1, 1, 1, 1] }}
            transition={{
              duration: 6,
              delay: 1.5 + i * 0.15,
              times: [0, 0.15, 0.5, 0.75, 1],
              repeat: Infinity,
              repeatType: "loop",
              repeatDelay: 0,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: `${EXIT_X}px ${EXIT_Y}px` }}
          />
        ))}

        {/* Blend layers between adjacent beams for smooth color transitions */}
        {BLEND_COLORS.map((_, i) => (
          <motion.path
            key={`blend-${i}`}
            d={blendPath(i)}
            fill={`url(#rainbow-blend-${i})`}
            filter="url(#beam-soft)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0.8, 0.5, 0.8] }}
            transition={{
              duration: 6,
              delay: 1.5 + (i + 0.5) * 0.15,
              times: [0, 0.15, 0.5, 0.75, 1],
              repeat: Infinity,
              repeatType: "loop",
              repeatDelay: 0,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Prism — fades in with the beam */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          {/* Equilateral triangle prism — side 240, tip pointing up */}
          <polygon
            points="600,261 480,469 720,469"
            fill="url(#prism-fill)"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Subtle highlight on the right edge */}
          <line
            x1="600" y1="261" x2="720" y2="469"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        </motion.g>
      </svg>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />
    </div>
  );
}
