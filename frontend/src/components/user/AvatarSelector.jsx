import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useRef, useState } from 'react'

// ─── Questions ────────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 'physical',
    subtitle: 'Estado físico',
    title: '¿Cómo está tu cuerpo hoy?',
    bg: 'from-blue-950 to-slate-900',
    options: [
      { value: 'energized', emoji: '⚡', label: 'Lleno de energía' },
      { value: 'normal',    emoji: '😐', label: 'Normal' },
      { value: 'tired',     emoji: '😴', label: 'Cansado' },
      { value: 'sick',      emoji: '🤒', label: 'Enfermo' },
    ],
  },
  {
    id: 'mental',
    subtitle: 'Estado mental',
    title: '¿Cómo está tu mente?',
    bg: 'from-purple-950 to-slate-900',
    options: [
      { value: 'focused',   emoji: '🎯', label: 'Enfocado' },
      { value: 'scattered', emoji: '😵‍💫', label: 'Disperso' },
      { value: 'blocked',   emoji: '🧱', label: 'Bloqueado' },
      { value: 'anxious',   emoji: '😰', label: 'Ansioso' },
    ],
  },
  {
    id: 'exposure',
    subtitle: 'Exposición al tiempo',
    title: '¿Cuánto tiempo fuera hoy?',
    bg: 'from-teal-950 to-slate-900',
    options: [
      { value: 'outdoors', emoji: '🌍', label: 'Todo el día fuera' },
      { value: 'some',     emoji: '🚶', label: 'Algunos ratos' },
      { value: 'commute',  emoji: '🚗', label: 'Solo desplazamientos' },
      { value: 'indoors',  emoji: '🏠', label: 'Me quedo en casa' },
    ],
  },
]

// ─── Avatar generation ────────────────────────────────────────────────────────
const COMBOS = {
  'energized_focused_outdoors':  { name: 'El Conquistador',        emoji: '🏔️⚡',  color: 'from-emerald-500 to-teal-600',          desc: 'Condiciones óptimas, rendimiento y actividades al aire libre.' },
  'energized_anxious_outdoors':  { name: 'El Volcán',              emoji: '🌋😰',  color: 'from-orange-500 to-red-600',            desc: 'Mucha energía pero mente acelerada — el tiempo puede calmar o encender.' },
  'energized_focused_indoors':   { name: 'El Estratega',           emoji: '🧠⚡',  color: 'from-blue-500 to-indigo-600',           desc: 'Energía lista para aprovechar, aunque te quedas dentro. Plan perfecto.' },
  'energized_scattered_commute': { name: 'El Cohete Disperso',     emoji: '🚀😵‍💫', color: 'from-yellow-500 to-amber-600',          desc: 'Energía sin dirección clara — el clima te dará contexto para centrarte.' },
  'tired_blocked_indoors':       { name: 'El Ermitaño',            emoji: '🏠😶',  color: 'from-slate-600 to-slate-800',           desc: 'Modo mínimo. Solo lo esencial: temperatura y si hay que salir algo.' },
  'tired_focused_indoors':       { name: 'El Monje',               emoji: '🧘😴',  color: 'from-purple-700 to-violet-900',         desc: 'Cansado pero concentrado. Clima suave y resguardado es tu aliado.' },
  'tired_anxious_outdoors':      { name: 'El Resistente',          emoji: '🥵🌧️', color: 'from-amber-600 to-orange-800',          desc: 'Fuera a pesar del cansancio y la tensión. Prioridad: seguridad y confort.' },
  'tired_scattered_commute':     { name: 'El Autopiloto',          emoji: '🚗😵‍💫', color: 'from-gray-500 to-zinc-700',             desc: 'Modo supervivencia. Solo lo imprescindible para llegar en un pieza.' },
  'sick_anxious_outdoors':       { name: 'El Valiente Imprudente', emoji: '🤒🌧️', color: 'from-amber-500 to-yellow-700',          desc: 'Enfermo y fuera — el clima aquí es crítico. Máxima cautela.' },
  'sick_focused_indoors':        { name: 'El Paciente Estoico',    emoji: '🤒📖',  color: 'from-teal-700 to-cyan-900',             desc: 'Enfermo pero con cabeza. Clima de fondo, prioridad recuperación.' },
  'sick_scattered_some':         { name: 'El Zombi Valiente',      emoji: '🧟🚶',  color: 'from-green-800 to-emerald-950',         desc: 'Enfermo, disperso y con salidas puntuales. Muy breve y protector.' },
  'normal_focused_outdoors':     { name: 'El Explorador Sereno',   emoji: '🗺️🎯',  color: 'from-sky-500 to-blue-700',              desc: 'Día equilibrado al aire libre. Detalles completos para sacar el máximo.' },
  'normal_anxious_commute':      { name: 'El Urbanita Nervioso',   emoji: '🌆😰',  color: 'from-rose-500 to-pink-700',             desc: 'Desplazamientos con tensión. El clima afecta tu día, aquí lo gestionamos.' },
  'normal_blocked_indoors':      { name: 'El Búnker',              emoji: '🧱🏠',  color: 'from-stone-600 to-neutral-800',         desc: 'Bloqueado y en casa. Sin presiones externas, solo lo básico.' },
}
const DEFAULT_COMBO = { name: 'El Explorador', emoji: '🗺️✨', color: 'from-indigo-500 to-purple-700', desc: 'Perfil único. Previsión personalizada basada en tu situación.' }

function generateAvatar(physical, mental, exposure) {
  const key = `${physical}_${mental}_${exposure}`
  const combo = COMBOS[key] ?? DEFAULT_COMBO
  return { physical, mental, exposure, avatarName: combo.name, avatarEmoji: combo.emoji, color: combo.color, prompt_key: key, desc: combo.desc }
}

const PHYSICAL_LABELS  = { energized: '⚡ Energizado', normal: '😐 Normal', tired: '😴 Cansado', sick: '🤒 Enfermo' }
const MENTAL_LABELS    = { focused: '🎯 Enfocado', scattered: '😵‍💫 Disperso', blocked: '🧱 Bloqueado', anxious: '😰 Ansioso' }
const EXPOSURE_LABELS  = { outdoors: '🌍 Todo el día', some: '🚶 Algunos ratos', commute: '🚗 Desplazamientos', indoors: '🏠 En casa' }

// Floating background emojis per question
const BG_EMOJIS = [
  ['💪', '🏋️', '😤', '✨', '😪', '🛌'],
  ['🧠', '💭', '🌀', '😤', '🧘', '💡'],
  ['☀️', '🌧️', '🚗', '🏠', '🌤️', '🚶'],
]

// ─── Floating background emoji ────────────────────────────────────────────────
function FloatingEmoji({ emoji, x, delay, duration }) {
  return (
    <motion.span
      className="absolute text-2xl select-none pointer-events-none"
      style={{ left: `${x}%`, bottom: '-10%' }}
      initial={{ y: 0, opacity: 0, rotate: 0 }}
      animate={{ y: '-120vh', opacity: [0, 0.18, 0.18, 0], rotate: [0, 15, -10, 5] }}
      transition={{ duration, delay, ease: 'linear', repeat: Infinity, repeatDelay: Math.random() * 4 }}
    >
      {emoji}
    </motion.span>
  )
}

// ─── Confetti burst on result ─────────────────────────────────────────────────
const CONFETTI_COLORS = ['#60a5fa','#a78bfa','#34d399','#fb923c','#f472b6','#facc15']
function Confetti() {
  const particles = useRef(
    Array.from({ length: 18 }, (_, i) => ({
      angle: (i / 18) * 360,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      dist:  80 + Math.random() * 60,
      size:  5 + Math.random() * 5,
    }))
  )
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-2xl">
      {particles.current.map((p, i) => {
        const rad = (p.angle * Math.PI) / 180
        const tx  = Math.cos(rad) * p.dist
        const ty  = Math.sin(rad) * p.dist
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ width: p.size, height: p.size, backgroundColor: p.color }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: tx, y: ty, opacity: 0, scale: 0 }}
            transition={{ duration: 0.9, delay: 0.1 + i * 0.03, ease: 'easeOut' }}
          />
        )
      })}
    </div>
  )
}

// ─── Answer card ──────────────────────────────────────────────────────────────
const CARD_ROTATIONS = [-3.5, 2, -1.5, 3]

function AnswerCard({ option, index, picked, onClick }) {
  const isChosen = picked === option.value
  const rot = CARD_ROTATIONS[index % 4]

  return (
    <motion.button
      onClick={onClick}
      disabled={!!picked}
      className="relative flex flex-col items-center gap-3 p-5 rounded-2xl border
                 border-white/10 bg-white/5 cursor-pointer w-full overflow-hidden"
      initial={{ opacity: 0, y: 30, rotate: rot, scale: 0.85 }}
      animate={{
        opacity: picked && !isChosen ? 0.2 : 1,
        y: 0,
        rotate: isChosen ? 0 : rot,
        scale: isChosen ? 1.12 : 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 22, delay: index * 0.07 }}
      whileHover={!picked ? { scale: 1.08, rotate: 0, borderColor: 'rgba(255,255,255,0.3)' } : {}}
      whileTap={!picked ? { scale: 0.94 } : {}}
    >
      {/* Glow flash when chosen */}
      {isChosen && (
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 0.35 }}
        />
      )}

      <motion.span
        className="text-4xl leading-none"
        animate={isChosen ? { scale: [1, 1.4, 1.2], rotate: [0, -10, 8, 0] } : {}}
        transition={{ duration: 0.35 }}
      >
        {option.emoji}
      </motion.span>
      <span className="text-sm font-medium text-white/90 text-center leading-snug">
        {option.label}
      </span>
    </motion.button>
  )
}

// ─── Animated progress dots ───────────────────────────────────────────────────
function ProgressDots({ step }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-6">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="rounded-full"
          animate={
            i < step
              ? { width: 24, height: 8, backgroundColor: '#6366f1' }
              : i === step
              ? { width: 32, height: 8, backgroundColor: '#818cf8' }
              : { width: 8, height: 8, backgroundColor: 'rgba(255,255,255,0.15)' }
          }
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        />
      ))}
      <motion.span
        key={step}
        className="text-white/40 text-xs font-semibold ml-1"
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {step + 1}/3
      </motion.span>
    </div>
  )
}

// ─── Avatar result card ───────────────────────────────────────────────────────
function AvatarCard({ profile, onConfirm, onReset }) {
  return (
    <motion.div
      className={`relative rounded-2xl bg-gradient-to-br ${profile.color} p-6 text-center shadow-2xl overflow-hidden`}
      initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <Confetti />

      {/* Big emoji with elastic bounce */}
      <motion.div
        className="text-7xl mb-3 leading-none relative z-10"
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 15, delay: 0.15 }}
      >
        {profile.avatarEmoji}
      </motion.div>

      {/* Name with stagger */}
      <motion.h2
        className="text-2xl font-black text-white mb-1 relative z-10"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, type: 'spring', stiffness: 300 }}
      >
        {profile.avatarName}
      </motion.h2>

      <motion.p
        className="text-white/70 text-sm mb-5 max-w-xs mx-auto leading-relaxed relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.38 }}
      >
        {profile.desc}
      </motion.p>

      {/* Pills */}
      <motion.div
        className="flex flex-wrap justify-center gap-2 mb-6 relative z-10"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.44 }}
      >
        {[PHYSICAL_LABELS[profile.physical], MENTAL_LABELS[profile.mental], EXPOSURE_LABELS[profile.exposure]].map((label) => (
          <motion.span
            key={label}
            className="px-3 py-1 rounded-full bg-black/25 border border-white/20 text-white/90 text-xs font-medium"
            whileHover={{ scale: 1.08, backgroundColor: 'rgba(0,0,0,0.4)' }}
          >
            {label}
          </motion.span>
        ))}
      </motion.div>

      {/* Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-3 relative z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.52 }}
      >
        <motion.button
          onClick={() => onConfirm(profile)}
          className="flex-1 py-3 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30
                     text-white font-bold text-sm transition-colors backdrop-blur-sm"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
        >
          ☁️ Ver mi previsión
        </motion.button>
        <motion.button
          onClick={onReset}
          className="flex-1 py-3 rounded-xl border border-white/20 hover:bg-white/10
                     text-white/70 hover:text-white font-medium text-sm transition-colors"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
        >
          🔄 Repetir test
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
// Slide + slight scale on transition (more dynamic than plain slide)
const pageVariants = {
  enter:  (d) => ({ x: d > 0 ? '75%'  : '-75%',  opacity: 0, scale: 0.88, rotate: d > 0 ? 4 : -4 }),
  center: {        x: 0,                           opacity: 1, scale: 1,    rotate: 0 },
  exit:   (d) => ({ x: d > 0 ? '-55%' : '55%',   opacity: 0, scale: 0.88, rotate: d > 0 ? -3 : 3 }),
}

export default function AvatarSelector({ onSelect }) {
  const [step,    setStep]    = useState(0)
  const [answers, setAnswers] = useState({})
  const [dir,     setDir]     = useState(1)
  const [picked,  setPicked]  = useState(null)   // value of the tapped card, cleared after transition

  const q = QUESTIONS[step] ?? QUESTIONS[0]

  const pick = (value) => {
    if (picked) return
    setPicked(value)
    const next = { ...answers, [q.id]: value }
    setTimeout(() => {
      setAnswers(next)
      setPicked(null)
      if (step < 2) { setDir(1); setStep((s) => s + 1) }
      else          { setDir(1); setStep(3) }
    }, 380)
  }

  const goBack  = () => { setDir(-1); setPicked(null); setStep((s) => s - 1) }
  const reset   = () => { setDir(-1); setPicked(null); setAnswers({}); setStep(0) }

  const profile = step === 3 ? generateAvatar(answers.physical, answers.mental, answers.exposure) : null

  return (
    <div className="space-y-2 overflow-hidden">
      <AnimatePresence mode="wait" custom={dir}>
        {step < 3 ? (
          <motion.div
            key={`q${step}`}
            custom={dir}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Floating background emojis */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl">
              {BG_EMOJIS[step].map((em, i) => (
                <FloatingEmoji
                  key={em}
                  emoji={em}
                  x={10 + i * 16}
                  delay={i * 0.8}
                  duration={6 + i * 1.2}
                />
              ))}
            </div>

            {/* Progress */}
            <ProgressDots step={step} />

            {/* Back + title */}
            <div className="flex items-center gap-3 mb-5">
              {step > 0 && (
                <motion.button
                  onClick={goBack}
                  className="text-white/40 hover:text-white transition-colors shrink-0"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileTap={{ scale: 0.85, rotate: -15 }}
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
              )}
              <div>
                <motion.p
                  className="text-white/40 text-xs uppercase tracking-widest font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.08 }}
                >
                  {q.subtitle}
                </motion.p>
                <motion.h3
                  className="text-white font-bold text-lg leading-tight"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, type: 'spring', stiffness: 340 }}
                >
                  {q.title}
                </motion.h3>
              </div>
            </div>

            {/* Answer grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {q.options.map((opt, i) => (
                <AnswerCard
                  key={opt.value}
                  option={opt}
                  index={i}
                  picked={picked}
                  onClick={() => pick(opt.value)}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            custom={dir}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            <AvatarCard profile={profile} onConfirm={onSelect} onReset={reset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
