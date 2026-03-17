import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  Zap, Minus, Moon, Thermometer,
  Target, Wind, Layers, Heart,
  Sun, Clock, Car, Home,
} from 'lucide-react'
import { useState } from 'react'

// ─── Questions ────────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 'physical',
    subtitle: 'Estado físico',
    title: '¿Cómo está tu cuerpo hoy?',
    options: [
      { value: 'energized', icon: Zap,        colorClass: 'bg-amber-500/20 text-amber-400',   label: 'Con energía' },
      { value: 'normal',    icon: Minus,       colorClass: 'bg-slate-500/20 text-slate-300',   label: 'Bien' },
      { value: 'tired',     icon: Moon,        colorClass: 'bg-blue-500/20 text-blue-400',     label: 'Cansado' },
      { value: 'sick',      icon: Thermometer, colorClass: 'bg-red-500/20 text-red-400',       label: 'Enfermo' },
    ],
  },
  {
    id: 'mental',
    subtitle: 'Estado mental',
    title: '¿Cómo está tu mente hoy?',
    options: [
      { value: 'focused',   icon: Target, colorClass: 'bg-green-500/20 text-green-400',   label: 'Enfocado' },
      { value: 'scattered', icon: Wind,   colorClass: 'bg-purple-500/20 text-purple-400', label: 'Disperso' },
      { value: 'blocked',   icon: Layers, colorClass: 'bg-orange-500/20 text-orange-400', label: 'Bloqueado' },
      { value: 'anxious',   icon: Heart,  colorClass: 'bg-pink-500/20 text-pink-400',     label: 'Ansioso' },
    ],
  },
  {
    id: 'exposure',
    subtitle: 'Exposición al tiempo',
    title: '¿Cuánto tiempo llevas fuera hoy?',
    options: [
      { value: 'outdoors', icon: Sun,   colorClass: 'bg-yellow-500/20 text-yellow-400', label: 'Todo el día' },
      { value: 'some',     icon: Clock, colorClass: 'bg-blue-500/20 text-blue-400',     label: 'Algunos ratos' },
      { value: 'commute',  icon: Car,   colorClass: 'bg-slate-500/20 text-slate-300',   label: 'Solo desplazamientos' },
      { value: 'indoors',  icon: Home,  colorClass: 'bg-green-500/20 text-green-400',   label: 'En casa' },
    ],
  },
]

// ─── Avatar generation ────────────────────────────────────────────────────────
const COMBOS = {
  'energized_focused_outdoors':  { name: 'El Conquistador',        color: 'from-emerald-500 to-teal-600',     desc: 'Condiciones óptimas, rendimiento y actividades al aire libre.' },
  'energized_anxious_outdoors':  { name: 'El Volcán',              color: 'from-orange-500 to-red-600',       desc: 'Mucha energía pero mente acelerada — el tiempo puede calmar o encender.' },
  'energized_focused_indoors':   { name: 'El Estratega',           color: 'from-blue-500 to-indigo-600',      desc: 'Energía lista para aprovechar, aunque te quedas dentro. Plan perfecto.' },
  'energized_scattered_commute': { name: 'El Cohete Disperso',     color: 'from-yellow-500 to-amber-600',     desc: 'Energía sin dirección clara — el clima te dará contexto para centrarte.' },
  'tired_blocked_indoors':       { name: 'El Ermitaño',            color: 'from-slate-600 to-slate-800',      desc: 'Modo mínimo. Solo lo esencial: temperatura y si hay que salir algo.' },
  'tired_focused_indoors':       { name: 'El Monje',               color: 'from-purple-700 to-violet-900',    desc: 'Cansado pero concentrado. Clima suave y resguardado es tu aliado.' },
  'tired_anxious_outdoors':      { name: 'El Resistente',          color: 'from-amber-600 to-orange-800',     desc: 'Fuera a pesar del cansancio y la tensión. Prioridad: seguridad y confort.' },
  'tired_scattered_commute':     { name: 'El Autopiloto',          color: 'from-gray-500 to-zinc-700',        desc: 'Modo supervivencia. Solo lo imprescindible para llegar en un pieza.' },
  'sick_anxious_outdoors':       { name: 'El Valiente Imprudente', color: 'from-amber-500 to-yellow-700',     desc: 'Enfermo y fuera — el clima aquí es crítico. Máxima cautela.' },
  'sick_focused_indoors':        { name: 'El Paciente Estoico',    color: 'from-teal-700 to-cyan-900',        desc: 'Enfermo pero con cabeza. Clima de fondo, prioridad recuperación.' },
  'sick_scattered_some':         { name: 'El Zombi Valiente',      color: 'from-green-800 to-emerald-950',    desc: 'Enfermo, disperso y con salidas puntuales. Muy breve y protector.' },
  'normal_focused_outdoors':     { name: 'El Explorador Sereno',   color: 'from-sky-500 to-blue-700',         desc: 'Día equilibrado al aire libre. Detalles completos para sacar el máximo.' },
  'normal_anxious_commute':      { name: 'El Urbanita Nervioso',   color: 'from-rose-500 to-pink-700',        desc: 'Desplazamientos con tensión. El clima afecta tu día, aquí lo gestionamos.' },
  'normal_blocked_indoors':      { name: 'El Búnker',              color: 'from-stone-600 to-neutral-800',    desc: 'Bloqueado y en casa. Sin presiones externas, solo lo básico.' },
}
const DEFAULT_COMBO = { name: 'El Explorador', color: 'from-indigo-500 to-purple-700', desc: 'Perfil único. Previsión personalizada basada en tu situación.' }

function generateAvatar(physical, mental, exposure) {
  const key   = `${physical}_${mental}_${exposure}`
  const combo = COMBOS[key] ?? DEFAULT_COMBO
  return { physical, mental, exposure, avatarName: combo.name, color: combo.color, prompt_key: key, desc: combo.desc }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getOption(qId, value) {
  const q = QUESTIONS.find((q) => q.id === qId)
  return q?.options.find((o) => o.value === value) ?? null
}

// ─── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ step }) {
  return (
    <div className="mb-5 space-y-1.5">
      <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-white/60 rounded-full"
          initial={false}
          animate={{ width: `${((step + 1) / 3) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />
      </div>
      <div className="flex justify-between">
        <span className="text-[10px] uppercase tracking-widest text-white/30 font-semibold">
          Pregunta {step + 1} de 3
        </span>
        <span className="text-[10px] text-white/20 font-medium">
          {Math.round(((step + 1) / 3) * 100)}%
        </span>
      </div>
    </div>
  )
}

// ─── Answer card ──────────────────────────────────────────────────────────────
function AnswerCard({ option, picked, onClick }) {
  const { icon: Icon, colorClass, label, value } = option
  const isChosen = picked === value

  return (
    <motion.button
      onClick={onClick}
      disabled={!!picked}
      whileHover={!picked ? { scale: 1.03, y: -2 } : {}}
      whileTap={!picked ? { scale: 0.97 } : {}}
      animate={{ opacity: picked && !isChosen ? 0.25 : 1 }}
      transition={{ duration: 0.2 }}
      className={`
        flex flex-col items-center justify-center gap-3
        p-4 rounded-2xl border transition-all duration-200 cursor-pointer
        ${isChosen
          ? 'bg-white/15 border-white/40 shadow-lg shadow-white/10'
          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
        }
      `}
    >
      {/* Icon bubble */}
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon size={22} strokeWidth={1.5} />
      </div>
      {/* Label */}
      <span className="text-xs font-medium text-white/80 text-center leading-tight">
        {label}
      </span>
    </motion.button>
  )
}

// ─── Avatar result card ───────────────────────────────────────────────────────
function AvatarCard({ profile, onConfirm, onReset }) {
  const dominantOpt = getOption('physical', profile.physical)
  const DominantIcon = dominantOpt?.icon ?? Zap

  const pills = [
    getOption('physical', profile.physical),
    getOption('mental',   profile.mental),
    getOption('exposure', profile.exposure),
  ].filter(Boolean)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, rotate: -3 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={`p-[1px] rounded-2xl bg-gradient-to-br ${profile.color}`}
    >
      <div className="bg-slate-950/90 rounded-2xl p-6 text-center backdrop-blur-sm">

        {/* Dominant icon */}
        <motion.div
          className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${dominantOpt?.colorClass ?? 'bg-white/10 text-white'}`}
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 360, damping: 18, delay: 0.1 }}
        >
          <DominantIcon size={32} strokeWidth={1.5} />
        </motion.div>

        {/* Avatar name */}
        <motion.h2
          className="text-2xl font-bold text-white mb-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, type: 'spring', stiffness: 300 }}
        >
          {profile.avatarName}
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-white/50 text-xs mb-5 max-w-xs mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.32 }}
        >
          {profile.desc}
        </motion.p>

        {/* Pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-6"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
        >
          {pills.map((opt) => {
            const PillIcon = opt.icon
            return (
              <span
                key={opt.value}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 text-xs font-medium ${opt.colorClass}`}
              >
                <PillIcon size={11} strokeWidth={2} />
                {opt.label}
              </span>
            )
          })}
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="flex gap-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.46 }}
        >
          <motion.button
            onClick={() => onConfirm(profile)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className={`flex-1 py-2.5 rounded-xl bg-gradient-to-r ${profile.color}
                        text-white font-semibold text-sm shadow-lg transition-opacity hover:opacity-90`}
          >
            Ver previsión
          </motion.button>
          <motion.button
            onClick={onReset}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="px-4 py-2.5 rounded-xl border border-white/15 text-white/50
                       hover:text-white/80 hover:border-white/25 font-medium text-sm transition-all"
          >
            Repetir
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ─── Page variants ────────────────────────────────────────────────────────────
const pageVariants = {
  enter:  (d) => ({ x: d > 0 ? '75%'  : '-75%',  opacity: 0, scale: 0.88, rotate: d > 0 ? 4 : -4 }),
  center: {        x: 0,                           opacity: 1, scale: 1,    rotate: 0 },
  exit:   (d) => ({ x: d > 0 ? '-55%' : '55%',   opacity: 0, scale: 0.88, rotate: d > 0 ? -3 : 3 }),
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AvatarSelector({ onSelect }) {
  const [step,    setStep]    = useState(0)
  const [answers, setAnswers] = useState({})
  const [dir,     setDir]     = useState(1)
  const [picked,  setPicked]  = useState(null)

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

  const goBack = () => { setDir(-1); setPicked(null); setStep((s) => s - 1) }
  const reset  = () => { setDir(-1); setPicked(null); setAnswers({}); setStep(0) }

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
          >
            {/* Progress bar */}
            <ProgressBar step={step} />

            {/* Header */}
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
                  className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-0.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.06 }}
                >
                  {q.subtitle}
                </motion.p>
                <motion.h3
                  className="text-base font-semibold text-white leading-tight"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 340 }}
                >
                  {q.title}
                </motion.h3>
              </div>
            </div>

            {/* Options grid — 4 cols, one row */}
            <div className="grid grid-cols-4 gap-2">
              {q.options.map((opt) => (
                <AnswerCard
                  key={opt.value}
                  option={opt}
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
