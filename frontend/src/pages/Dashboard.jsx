import { AnimatePresence, motion } from 'framer-motion'
import { CloudSun, MessageCircle, User } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import CenterPanel from '../components/dashboard/CenterPanel'
import LeftPanel from '../components/dashboard/LeftPanel'
import RightPanel from '../components/dashboard/RightPanel'
import WeatherBackground from '../components/shared/WeatherBackground'
import Navbar from '../components/shared/Navbar'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { extractWeather } from '../utils/weather'
import { useRef } from 'react'

// ─── Mobile tab config ────────────────────────────────────────────────────────
const TABS = [
  { id: 'estado',    label: 'Estado',   icon: User },
  { id: 'prevision', label: 'Previsión', icon: CloudSun },
  { id: 'chat',      label: 'Chat',      icon: MessageCircle },
]

const TAB_ORDER = ['estado', 'prevision', 'chat']

const slideVariants = {
  enter:  (d) => ({ x: d > 0 ? '60%' : '-60%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (d) => ({ x: d > 0 ? '-40%' : '40%', opacity: 0 }),
}

// ─── Resize handle ────────────────────────────────────────────────────────────
function ResizeHandle({ onDelta }) {
  const dragging = useRef(false)
  const lastX    = useRef(0)

  const onMouseDown = (e) => {
    dragging.current = true
    lastX.current = e.clientX
    e.preventDefault()

    const onMove = (ev) => {
      if (!dragging.current) return
      onDelta(ev.clientX - lastX.current)
      lastX.current = ev.clientX
    }
    const onUp = () => {
      dragging.current = false
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  return (
    <div
      className="shrink-0 w-3 h-full flex items-center justify-center cursor-col-resize group select-none"
      onMouseDown={onMouseDown}
    >
      <div className="w-px h-12 rounded-full bg-white/10 group-hover:bg-white/35 group-active:bg-blue-400/60 transition-colors duration-150" />
    </div>
  )
}

// ─── Simulated weather icon mapping for WeatherBackground ────────────────────
const MODE_BG_DESC = {
  rain:   'Lluvia fuerte',
  fog:    'Niebla densa',
  desert: 'Despejado extremo',
  snow:   'Nevada',
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, updateAvatar } = useAuth()

  const [avatarState,   setAvatarState]   = useState(user?.avatar_state ?? 'energized')
  const [profile,       setProfile]       = useState(null)
  const [weatherData,   setWeatherData]   = useState(null)
  const [loading,       setLoading]       = useState(false)
  const [autoSend,      setAutoSend]      = useState(null)
  const [forecastDone,  setForecastDone]  = useState(false)
  const [simulatedMode, setSimulatedMode] = useState('auto')

  // Mobile tab state
  const [activeTab, setActiveTab] = useState('prevision')
  const [tabDir,    setTabDir]    = useState(1)

  // Panel widths (desktop)
  const [leftW,  setLeftW]  = useState(280)
  const [rightW, setRightW] = useState(310)

  // Reset forecastDone when mode changes so user can trigger a new fetch
  useEffect(() => { setForecastDone(false) }, [simulatedMode])

  // ── Avatar selection ──────────────────────────────────────────────────────
  const handleAvatarSelect = async (profileObj) => {
    const isProfile = typeof profileObj !== 'string'
    const state     = isProfile ? profileObj.prompt_key : profileObj

    setAvatarState(state)
    if (isProfile) {
      setProfile(profileObj)
      setWeatherData(null)    // clear old data → show fresh EmptyState
      setForecastDone(false)

      const physLabel = {
        energized: 'lleno de energía', normal: 'bien', tired: 'cansado', sick: 'enfermo',
      }[profileObj.physical] ?? profileObj.physical
      const mentalLabel = {
        focused: 'enfocado', scattered: 'disperso', blocked: 'bloqueado', anxious: 'ansioso',
      }[profileObj.mental] ?? profileObj.mental
      const expLabel = {
        outdoors: 'todo el día fuera', some: 'fuera algunos ratos',
        commute: 'solo en desplazamientos', indoors: 'en casa',
      }[profileObj.exposure] ?? profileObj.exposure

      setAutoSend({
        text: `Soy ${profileObj.avatarName} ${profileObj.avatarEmoji} — hoy estoy ${physLabel}, mentalmente ${mentalLabel} y voy a estar ${expLabel}. Dame mi previsión meteorológica personalizada para hoy.`,
        id: Date.now(),
      })
    }

    const backendKey = isProfile
      ? ({ sick: 'sick', tired: 'tired', energized: 'energized' }[profileObj.physical] ?? 'energized')
      : profileObj
    try { await updateAvatar(backendKey) } catch { /* non-critical */ }
  }

  const handleReset = () => {
    setProfile(null)
    setAvatarState(user?.avatar_state ?? 'energized')
    setWeatherData(null)
    setForecastDone(false)
  }

  // ── Weather fetch ─────────────────────────────────────────────────────────
  const fetchWeather = useCallback(async () => {
    if (loading) return
    setLoading(true)
    try {
      const modeParam = simulatedMode !== 'auto' ? `&mode=${simulatedMode}` : ''
      const { data } = await api.get(`/api/weather/current?avatar_state=${avatarState}${modeParam}`)
      setWeatherData(data)
      setForecastDone(true)
    } catch (err) {
      console.error('Weather fetch failed:', err)
    } finally {
      setLoading(false)
    }
  }, [avatarState, simulatedMode, loading])

  // ── Tab switching ─────────────────────────────────────────────────────────
  const switchTab = (id) => {
    const from = TAB_ORDER.indexOf(activeTab)
    const to   = TAB_ORDER.indexOf(id)
    setTabDir(to > from ? 1 : -1)
    setActiveTab(id)
  }

  // WeatherBackground uses simulated description when mode is active
  const bgWeather = simulatedMode !== 'auto'
    ? { description: MODE_BG_DESC[simulatedMode] }
    : (weatherData?.weather_data ?? null)

  const { temp } = extractWeather(weatherData?.weather_data ?? {})

  const leftProps   = { user, profile, onSelect: handleAvatarSelect, onReset: handleReset }
  const centerProps = {
    weatherData, loading, onRefresh: fetchWeather,
    forecastDone, simulatedMode, onModeChange: setSimulatedMode,
  }
  const rightProps  = { weatherData, avatarState, autoSend, simulatedMode }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <WeatherBackground weatherData={bgWeather} />
      <Navbar simulatedMode={simulatedMode} onResetMode={() => setSimulatedMode('auto')} />

      {/* ── DESKTOP: flex row with resize handles ── */}
      <div className="hidden lg:flex flex-1 min-h-0 p-2 overflow-hidden relative z-10">
        <div className="shrink-0 min-h-0" style={{ width: leftW }}>
          <LeftPanel {...leftProps} />
        </div>

        <ResizeHandle onDelta={(d) => setLeftW((w) => Math.max(200, Math.min(420, w + d)))} />

        <div className="flex-1 min-w-0 min-h-0">
          <CenterPanel {...centerProps} />
        </div>

        <ResizeHandle onDelta={(d) => setRightW((w) => Math.max(240, Math.min(500, w - d)))} />

        <div className="shrink-0 min-h-0" style={{ width: rightW }}>
          <RightPanel {...rightProps} />
        </div>
      </div>

      {/* ── MOBILE: tab layout ── */}
      <div className="lg:hidden flex-1 min-h-0 flex flex-col overflow-hidden relative z-10">
        <div className="flex-1 overflow-hidden relative p-3">
          <AnimatePresence mode="wait" custom={tabDir}>
            <motion.div
              key={activeTab}
              custom={tabDir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-3"
            >
              {activeTab === 'estado'    && <LeftPanel   {...leftProps} />}
              {activeTab === 'prevision' && <CenterPanel {...centerProps} />}
              {activeTab === 'chat'      && <RightPanel  {...rightProps} />}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="shrink-0 border-t border-white/10 bg-slate-950/80 backdrop-blur-md">
          <div className="flex">
            {TABS.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id
              return (
                <button
                  key={id}
                  onClick={() => switchTab(id)}
                  className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors
                    ${isActive ? 'text-blue-400' : 'text-white/40 hover:text-white/60'}`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                  {isActive && (
                    <motion.div
                      className="w-1 h-1 rounded-full bg-blue-400"
                      layoutId="tab-dot"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {temp != null && (
        <motion.div
          className="lg:hidden fixed top-14 right-4 z-20 px-3 py-1 rounded-full
                     bg-black/40 backdrop-blur-sm border border-white/10 text-white text-sm font-bold"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {Math.round(temp)}°C
        </motion.div>
      )}
    </div>
  )
}
