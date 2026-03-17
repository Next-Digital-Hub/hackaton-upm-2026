/**
 * WeatherTopBar — glass strip at the very top of the dashboard showing live
 * weather at a glance. No emojis — uses lucide-react SVG icons throughout.
 */
import { motion } from 'framer-motion'
import {
  Cloud, CloudLightning, CloudRain, CloudSnow, Droplets,
  Eye, Sun, Thermometer, Wind,
} from 'lucide-react'
import { getCondition } from './WeatherBackground'

// ─── Condition → lucide icon ──────────────────────────────────────────────────
function ConditionIcon({ condition, className = 'w-16 h-16' }) {
  const props = { className, strokeWidth: 1.2 }
  switch (condition) {
    case 'clear':    return <Sun           {...props} className={`${className} text-amber-300`} />
    case 'cloudy':   return <Cloud         {...props} className={`${className} text-slate-300`} />
    case 'overcast': return <Cloud         {...props} className={`${className} text-slate-400`} />
    case 'rainy':    return <CloudRain     {...props} className={`${className} text-blue-300`} />
    case 'stormy':   return <CloudLightning{...props} className={`${className} text-purple-300`} />
    case 'snowy':    return <CloudSnow     {...props} className={`${className} text-sky-200`} />
    default:         return <Cloud         {...props} className={`${className} text-slate-300`} />
  }
}

const CONDITION_LABEL = {
  clear:    'Cielo despejado',
  cloudy:   'Parcialmente nublado',
  overcast: 'Nublado',
  rainy:    'Lluvia',
  stormy:   'Tormenta',
  snowy:    'Nieve',
  foggy:    'Niebla',
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
function Stat({ icon, label, value, unit }) {
  if (value == null) return null
  return (
    <div className="flex items-center gap-2">
      <span className="text-white/40">{icon}</span>
      <div>
        <p className="text-white/40 text-xs leading-none">{label}</p>
        <p className="text-white font-semibold text-sm leading-tight">
          {typeof value === 'number' ? value.toFixed(1) : value}
          <span className="text-white/60 font-normal text-xs ml-0.5">{unit}</span>
        </p>
      </div>
    </div>
  )
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="flex items-center gap-6 px-6 py-4 animate-pulse">
      <div className="w-14 h-14 rounded-full bg-white/10" />
      <div className="space-y-2">
        <div className="w-24 h-6 rounded bg-white/10" />
        <div className="w-32 h-3 rounded bg-white/10" />
      </div>
      <div className="ml-auto flex gap-6">
        {[1,2,3].map(i => <div key={i} className="w-16 h-8 rounded bg-white/10" />)}
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function WeatherTopBar({ weatherData, loading }) {
  const w         = weatherData ?? {}
  const desc      = w.description ?? w.weather?.[0]?.description ?? ''
  const condition = getCondition(desc)

  const temp      = w.temperature ?? w.temp     ?? w.main?.temp
  const feelsLike = w.feels_like  ?? w.main?.feels_like
  const humidity  = w.humidity    ?? w.main?.humidity
  const windSpeed = w.wind_speed  ?? w.wind?.speed
  const uvIndex   = w.uv_index    ?? w.uvi
  const pressure  = w.pressure    ?? w.main?.pressure

  return (
    <motion.div
      className="w-full backdrop-blur-md bg-white/5 border-b border-white/10 relative z-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {loading ? (
        <Skeleton />
      ) : (
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-6 flex-wrap">

          {/* Big icon */}
          <motion.div
            animate={condition === 'clear'
              ? { rotate: [0, 5, -5, 0], scale: [1, 1.04, 1] }
              : condition === 'rainy' || condition === 'stormy'
              ? { y: [0, 2, 0] }
              : { y: [0, -3, 0] }
            }
            transition={{ duration: condition === 'clear' ? 8 : 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ConditionIcon condition={condition} className="w-12 h-12 sm:w-16 sm:h-16" />
          </motion.div>

          {/* Temperature + description */}
          <div className="shrink-0">
            {temp != null ? (
              <motion.p
                className="text-4xl sm:text-5xl font-black text-white leading-none tracking-tight"
                key={temp}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {Math.round(temp)}
                <span className="text-xl font-light text-white/60 ml-1">°C</span>
              </motion.p>
            ) : (
              <p className="text-2xl font-bold text-white/40">— °C</p>
            )}
            <p className="text-white/60 text-sm mt-0.5 capitalize">
              {desc || CONDITION_LABEL[condition] || 'Sin datos'}
            </p>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-12 bg-white/10 mx-2" />

          {/* Stats row */}
          <div className="flex items-center gap-6 flex-wrap">
            <Stat
              icon={<Thermometer className="w-4 h-4" />}
              label="Sensación"
              value={feelsLike}
              unit="°C"
            />
            <Stat
              icon={<Droplets className="w-4 h-4" />}
              label="Humedad"
              value={humidity}
              unit="%"
            />
            <Stat
              icon={<Wind className="w-4 h-4" />}
              label="Viento"
              value={windSpeed}
              unit=" km/h"
            />
            {uvIndex != null && (
              <Stat
                icon={<Sun className="w-4 h-4" />}
                label="Índice UV"
                value={uvIndex}
                unit=""
              />
            )}
            {pressure != null && (
              <Stat
                icon={<Eye className="w-4 h-4" />}
                label="Presión"
                value={pressure}
                unit=" hPa"
              />
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}
