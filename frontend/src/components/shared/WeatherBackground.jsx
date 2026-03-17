/**
 * WeatherBackground — full-screen animated scene behind all content.
 * Pure SVG + Framer Motion, zero emojis, zero external deps beyond what's already installed.
 */
import { motion } from 'framer-motion'
import { useMemo } from 'react'

// ─── Condition detection ──────────────────────────────────────────────────────
export function getCondition(description = '') {
  const d = description.toLowerCase()
  if (d.includes('thunder') || d.includes('storm'))            return 'stormy'
  if (d.includes('snow') || d.includes('sleet') || d.includes('blizzard')) return 'snowy'
  if (d.includes('rain') || d.includes('shower') || d.includes('drizzle')) return 'rainy'
  if (d.includes('fog')  || d.includes('mist')  || d.includes('haze'))     return 'foggy'
  if (d.includes('overcast') || d.includes('broken cloud'))   return 'overcast'
  if (d.includes('cloud') || d.includes('partly'))            return 'cloudy'
  return 'clear'
}

const GRADIENT = {
  clear:    ['#1a0a00', '#3b1c00', '#0f172a'],   // warm amber night → slate
  cloudy:   ['#0f172a', '#1e293b', '#0f172a'],
  overcast: ['#0c1117', '#1a2030', '#0f172a'],
  rainy:    ['#0a0f1a', '#0f2040', '#0f172a'],
  stormy:   ['#040608', '#08111f', '#000000'],
  snowy:    ['#0f1f30', '#162033', '#0f172a'],
  foggy:    ['#111820', '#1a2030', '#0f172a'],
}

// ─── Sun ──────────────────────────────────────────────────────────────────────
function Sun() {
  const rays = Array.from({ length: 12 }, (_, i) => i)
  return (
    <div className="absolute" style={{ top: '3%', right: '6%', width: 320, height: 320 }}>
      {/* Outer glow — static */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(251,191,36,0.18) 0%, rgba(251,191,36,0.06) 50%, transparent 70%)',
          transform: 'scale(1.8)',
        }}
      />
      {/* Rotating rays */}
      <motion.svg
        viewBox="0 0 200 200"
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
      >
        {rays.map((i) => (
          <rect
            key={i}
            x="96" y="12" width="8" height="24"
            rx="4"
            fill="#fbbf24"
            fillOpacity="0.55"
            transform={`rotate(${i * 30} 100 100)`}
          />
        ))}
      </motion.svg>
      {/* Core disc */}
      <motion.svg
        viewBox="0 0 200 200"
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0 }}
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <defs>
          <radialGradient id="sunCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#fde68a" stopOpacity="1" />
            <stop offset="55%"  stopColor="#f59e0b" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="42" fill="url(#sunCore)" />
      </motion.svg>
    </div>
  )
}

// ─── Cloud shape ──────────────────────────────────────────────────────────────
function Cloud({ xStart, y, scale = 1, opacity = 0.06, duration = 80, delay = 0 }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ top: `${y}%`, left: 0 }}
      initial={{ x: xStart < 50 ? '-25vw' : '110vw' }}
      animate={{ x: xStart < 50 ? '115vw' : '-25vw' }}
      transition={{ duration, repeat: Infinity, ease: 'linear', delay }}
    >
      <svg
        viewBox="0 0 360 130"
        width={360 * scale}
        height={130 * scale}
        style={{ opacity }}
      >
        <ellipse cx="180" cy="100" rx="155" ry="38" fill="white" />
        <circle cx="110" cy="80"  r="48" fill="white" />
        <circle cx="175" cy="62"  r="60" fill="white" />
        <circle cx="248" cy="76"  r="44" fill="white" />
      </svg>
    </motion.div>
  )
}

// ─── Rain ─────────────────────────────────────────────────────────────────────
function Rain({ count = 28, speedBase = 0.9 }) {
  const drops = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      x:        Math.random() * 100,
      delay:    Math.random() * 2.5,
      h:        14 + Math.random() * 18,
      opacity:  0.25 + Math.random() * 0.35,
      duration: speedBase + Math.random() * 0.5,
    })), []  // eslint-disable-line
  )
  return (
    <>
      {drops.map((d, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${d.x}%`,
            top: '-3%',
            width: 1.5,
            height: d.h,
            background: `rgba(147,197,253,${d.opacity})`,
          }}
          animate={{ y: '108vh' }}
          transition={{ duration: d.duration, repeat: Infinity, delay: d.delay, ease: 'linear' }}
        />
      ))}
    </>
  )
}

// ─── Snow ─────────────────────────────────────────────────────────────────────
function Snow({ count = 28 }) {
  const flakes = useMemo(() =>
    Array.from({ length: count }, () => ({
      x:        Math.random() * 100,
      size:     3 + Math.random() * 6,
      delay:    Math.random() * 8,
      duration: 7 + Math.random() * 7,
      drift:    (Math.random() - 0.5) * 80,
      opacity:  0.35 + Math.random() * 0.5,
    })), []  // eslint-disable-line
  )
  return (
    <>
      {flakes.map((f, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{ left: `${f.x}%`, top: '-2%', width: f.size, height: f.size, opacity: f.opacity }}
          animate={{ y: '108vh', x: [0, f.drift, 0] }}
          transition={{ duration: f.duration, repeat: Infinity, delay: f.delay, ease: 'easeInOut' }}
        />
      ))}
    </>
  )
}

// ─── Lightning flash ──────────────────────────────────────────────────────────
function Lightning() {
  return (
    <>
      <motion.div
        className="absolute inset-0"
        style={{ background: 'rgba(180,200,255,0.07)' }}
        animate={{ opacity: [0,0,0,0,0,1,0,0.5,0,0] }}
        transition={{ duration: 7, repeat: Infinity, repeatDelay: 3 + Math.random() * 3 }}
      />
      <motion.div
        className="absolute inset-0"
        style={{ background: 'rgba(180,200,255,0.04)' }}
        animate={{ opacity: [0,0,0,0,0,0,0,1,0,0] }}
        transition={{ duration: 9, repeat: Infinity, repeatDelay: 5 }}
      />
    </>
  )
}

// ─── Fog bands ────────────────────────────────────────────────────────────────
function Fog() {
  return (
    <>
      {[18, 42, 65, 85].map((y, i) => (
        <motion.div
          key={i}
          className="absolute w-[200%]"
          style={{
            top: `${y}%`,
            height: 90,
            left: '-50%',
            background: 'linear-gradient(90deg, transparent 0%, rgba(160,170,180,0.1) 25%, rgba(160,170,180,0.16) 50%, rgba(160,170,180,0.1) 75%, transparent 100%)',
          }}
          animate={{ x: [0, 120, 0] }}
          transition={{ duration: 14 + i * 5, repeat: Infinity, ease: 'easeInOut', delay: i * 3 }}
        />
      ))}
    </>
  )
}

// ─── Stars (clear night) ──────────────────────────────────────────────────────
function Stars() {
  const stars = useMemo(() =>
    Array.from({ length: 55 }, () => ({
      x: Math.random() * 100, y: Math.random() * 55,
      size: 1 + Math.random() * 2,
      delay: Math.random() * 5,
      opacity: 0.3 + Math.random() * 0.55,
    })), []
  )
  return (
    <>
      {stars.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
          animate={{ opacity: [s.opacity, s.opacity * 0.3, s.opacity] }}
          transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: s.delay }}
        />
      ))}
    </>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function WeatherBackground({ weatherData }) {
  const w         = weatherData ?? {}
  const desc      = w.description ?? w.weather?.[0]?.description ?? ''
  const condition = getCondition(desc)
  const [c1, c2, c3] = GRADIENT[condition] ?? GRADIENT.clear

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      style={{ background: `linear-gradient(160deg, ${c1} 0%, ${c2} 50%, ${c3} 100%)` }}
    >
      {/* Per-condition layer */}
      {condition === 'clear' && (
        <>
          <Stars />
          <Sun />
        </>
      )}

      {condition === 'cloudy' && (
        <>
          <Stars />
          <Cloud xStart={5}  y={2}  scale={1.5} opacity={0.07} duration={90} delay={0} />
          <Cloud xStart={60} y={6}  scale={1.1} opacity={0.05} duration={70} delay={20} />
          <Cloud xStart={90} y={12} scale={0.9} opacity={0.06} duration={110} delay={5} />
        </>
      )}

      {condition === 'overcast' && (
        <>
          <Cloud xStart={0}  y={0}  scale={1.8} opacity={0.09} duration={80}  delay={0} />
          <Cloud xStart={50} y={4}  scale={1.4} opacity={0.07} duration={65}  delay={15} />
          <Cloud xStart={80} y={10} scale={1.2} opacity={0.08} duration={95}  delay={8} />
          <Cloud xStart={20} y={15} scale={1.0} opacity={0.06} duration={100} delay={30} />
        </>
      )}

      {condition === 'rainy' && (
        <>
          <Cloud xStart={0}  y={0} scale={1.6} opacity={0.10} duration={60} delay={0} />
          <Cloud xStart={55} y={2} scale={1.3} opacity={0.08} duration={75} delay={10} />
          <Rain count={30} speedBase={0.85} />
        </>
      )}

      {condition === 'stormy' && (
        <>
          <Cloud xStart={0}  y={0} scale={2.0} opacity={0.14} duration={35} delay={0} />
          <Cloud xStart={60} y={3} scale={1.6} opacity={0.12} duration={28} delay={5} />
          <Rain count={50} speedBase={0.5} />
          <Lightning />
        </>
      )}

      {condition === 'snowy' && (
        <>
          <Cloud xStart={0}  y={0} scale={1.4} opacity={0.07} duration={90} delay={0} />
          <Cloud xStart={65} y={5} scale={1.1} opacity={0.06} duration={75} delay={12} />
          <Snow count={32} />
        </>
      )}

      {condition === 'foggy' && <Fog />}

      {/* Vignette — always on top to keep content readable */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 120% 80% at 50% 0%, transparent 30%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </div>
  )
}
