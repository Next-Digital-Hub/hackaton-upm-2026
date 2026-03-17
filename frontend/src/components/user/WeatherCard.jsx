import { motion } from 'framer-motion'
import { Droplets, RefreshCw, Wind } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { getCondition } from '../shared/WeatherBackground'

// ─── Avatar config ────────────────────────────────────────────────────────────
const AVATAR_CFG = {
  tired:     { icon: '😴', label: 'Tired',        accent: 'border-slate-400',  text: 'text-slate-300',   glow: 'rgba(148,163,184,0.35)',  pill: 'bg-slate-500/20 text-slate-300',   badge: 'bg-slate-500/30 text-slate-200' },
  energized: { icon: '⚡', label: 'Energized',    accent: 'border-blue-400',   text: 'text-blue-300',    glow: 'rgba(96,165,250,0.40)',   pill: 'bg-blue-500/20 text-blue-300',     badge: 'bg-blue-500/30 text-blue-200' },
  sick:      { icon: '🤒', label: 'Sick',          accent: 'border-amber-400',  text: 'text-amber-300',   glow: 'rgba(251,191,36,0.38)',   pill: 'bg-amber-500/20 text-amber-300',   badge: 'bg-amber-500/30 text-amber-200' },
  athletic:  { icon: '🏃', label: 'Athletic',      accent: 'border-orange-400', text: 'text-orange-300',  glow: 'rgba(251,146,60,0.38)',   pill: 'bg-orange-500/20 text-orange-300', badge: 'bg-orange-500/30 text-orange-200' },
  important: { icon: '💼', label: 'Important Day', accent: 'border-purple-400', text: 'text-purple-300',  glow: 'rgba(192,132,252,0.38)',  pill: 'bg-purple-500/20 text-purple-300', badge: 'bg-purple-500/30 text-purple-200' },
}

// Fallback for compound prompt_keys — extract physical dimension
function resolveAvatar(key = 'energized') {
  if (AVATAR_CFG[key]) return AVATAR_CFG[key]
  if (key.startsWith('tired'))     return AVATAR_CFG.tired
  if (key.startsWith('sick'))      return AVATAR_CFG.sick
  if (key.startsWith('athletic'))  return AVATAR_CFG.athletic
  if (key.startsWith('important')) return AVATAR_CFG.important
  return AVATAR_CFG.energized
}

// ─── Condition → hero gradient ────────────────────────────────────────────────
function heroGradient(condition) {
  switch (condition) {
    case 'stormy':  return 'from-violet-900/30 via-slate-900/20 to-transparent'
    case 'snowy':   return 'from-sky-300/15 via-blue-900/10 to-transparent'
    case 'rainy':   return 'from-blue-600/20 via-indigo-900/10 to-transparent'
    case 'cloudy':
    case 'overcast':return 'from-slate-500/20 via-blue-900/10 to-transparent'
    case 'foggy':   return 'from-gray-500/15 via-slate-900/10 to-transparent'
    default:        return 'from-amber-500/20 via-orange-600/10 to-transparent'
  }
}

// Glow colour per condition
function condGlow(condition) {
  switch (condition) {
    case 'stormy':  return 'rgba(167,139,250,0.45)'
    case 'snowy':   return 'rgba(186,230,253,0.40)'
    case 'rainy':   return 'rgba(96,165,250,0.42)'
    case 'cloudy':
    case 'overcast':return 'rgba(148,163,184,0.35)'
    default:        return 'rgba(251,191,36,0.45)'
  }
}

// ─── Shared react-markdown components ─────────────────────────────────────────
const MD = {
  h2:     ({ children }) => <h2 className="text-lg font-bold text-white mt-4 mb-2">{children}</h2>,
  h3:     ({ children }) => <h3 className="text-base font-semibold text-blue-300 mt-3 mb-1">{children}</h3>,
  strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
  em:     ({ children }) => <em className="text-white/70 italic">{children}</em>,
  p:      ({ children }) => <p className="text-white/80 leading-relaxed mb-2 last:mb-0">{children}</p>,
  hr:     ()             => <hr className="border-white/10 my-3" />,
  ul:     ({ children }) => <ul className="list-none space-y-1 mb-2">{children}</ul>,
  ol:     ({ children }) => <ol className="list-none space-y-1 mb-2">{children}</ol>,
  li:     ({ children }) => (
    <li className="text-white/80 flex gap-2 items-start">
      <span className="text-blue-400 shrink-0 mt-0.5">→</span>
      <span>{children}</span>
    </li>
  ),
  code:   ({ children }) => <code className="bg-white/10 text-blue-300 text-xs px-1.5 py-0.5 rounded font-mono">{children}</code>,
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function HeroSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-white/10" />
        <div className="space-y-3">
          <div className="w-36 h-14 rounded-xl bg-white/10" />
          <div className="w-48 h-4 rounded bg-white/10" />
        </div>
      </div>
      <div className="flex gap-2 mt-5">
        <div className="w-24 h-7 rounded-full bg-white/10" />
        <div className="w-20 h-7 rounded-full bg-white/10" />
        <div className="w-28 h-7 rounded-full bg-white/10" />
      </div>
    </div>
  )
}

// ─── Condition icon (large, SVG-based via lucide would work but keep emojis for size) ──
const COND_ICON = {
  clear:    '☀️',
  cloudy:   '⛅',
  overcast: '☁️',
  rainy:    '🌧️',
  stormy:   '⛈️',
  snowy:    '❄️',
  foggy:    '🌫️',
}

// ─── Hero Card ────────────────────────────────────────────────────────────────
function HeroCard({ data, loading, onRefresh }) {
  const w         = data?.weather_data ?? {}
  const desc      = w.description ?? w.weather?.[0]?.description ?? ''
  const condition = getCondition(desc)
  const temp      = w.temperature ?? w.temp ?? w.main?.temp
  const humidity  = w.humidity ?? w.main?.humidity
  const windSpeed = w.wind_speed ?? w.wind?.speed
  const feelsLike = w.feels_like ?? w.main?.feels_like
  const glow      = condGlow(condition)

  return (
    <motion.div
      className={`relative w-full min-h-[180px] rounded-3xl border border-white/10
                  backdrop-blur-md overflow-hidden bg-gradient-to-br ${heroGradient(condition)}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      {/* Refresh button */}
      <button
        onClick={onRefresh}
        className="absolute top-4 right-4 text-white/30 hover:text-white/70 transition-colors z-10"
      >
        <RefreshCw className="w-4 h-4" />
      </button>

      <div className="px-6 py-6">
        {loading && !data ? (
          <HeroSkeleton />
        ) : !data ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-6 gap-3">
            <div className="text-5xl opacity-30">☁️</div>
            <p className="text-white/30 text-sm text-center">
              Selecciona tu estado y pulsa <span className="text-white/50">Obtener previsión</span>
            </p>
          </div>
        ) : (
          /* Live data */
          <div className="flex flex-col gap-4">
            {/* Main row: icon + temperature */}
            <div className="flex items-center gap-5">
              <motion.span
                className="text-[64px] leading-none shrink-0"
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                {COND_ICON[condition] ?? '🌤️'}
              </motion.span>

              <div>
                <motion.p
                  key={temp}
                  className="font-bold text-white leading-none"
                  style={{
                    fontSize: '4.5rem',
                    textShadow: `0 0 40px ${glow}, 0 0 80px ${glow}`,
                  }}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 280 }}
                >
                  {temp != null ? `${Math.round(temp)}°` : '—°'}
                  <span className="text-2xl font-light text-white/50 ml-1">C</span>
                </motion.p>
                <p className="text-white/55 text-sm capitalize mt-0.5">
                  {desc || 'Sin descripción'}
                </p>
              </div>
            </div>

            {/* Stats pills */}
            <div className="flex flex-wrap gap-2">
              {humidity != null && (
                <span className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 text-xs text-white/80">
                  <Droplets className="w-3 h-3 text-blue-300" />
                  {Math.round(humidity)}% hum.
                </span>
              )}
              {windSpeed != null && (
                <span className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 text-xs text-white/80">
                  <Wind className="w-3 h-3 text-slate-300" />
                  {Math.round(windSpeed)} km/h
                </span>
              )}
              {feelsLike != null && (
                <span className="bg-white/10 rounded-full px-3 py-1 text-xs text-white/80">
                  Sensación {Math.round(feelsLike)}°C
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─── AI Analysis card ─────────────────────────────────────────────────────────
function AIAnalysis({ data }) {
  if (!data?.llm_response) return null

  const avatarKey = data.avatar_state ?? 'energized'
  const cfg       = resolveAvatar(avatarKey)

  return (
    <motion.div
      className={`rounded-2xl border border-white/10 bg-black/25 backdrop-blur-sm
                  border-l-2 ${cfg.accent} overflow-hidden`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-lg">{cfg.icon}</span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.badge}`}>
            {cfg.label}
          </span>
        </div>
        <span className="text-white/30 text-xs">Generado por IA</span>
      </div>

      {/* Markdown content */}
      <div
        className="px-4 py-4 overflow-y-auto"
        style={{
          maxHeight: '26rem',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.15) transparent',
        }}
      >
        <ReactMarkdown components={MD}>{data.llm_response}</ReactMarkdown>
      </div>
    </motion.div>
  )
}

// ─── Public export ────────────────────────────────────────────────────────────
export default function WeatherCard({ data, loading, onRefresh }) {
  return (
    <div className="space-y-4">
      <HeroCard data={data} loading={loading} onRefresh={onRefresh} />
      <AIAnalysis data={data} />
    </div>
  )
}
