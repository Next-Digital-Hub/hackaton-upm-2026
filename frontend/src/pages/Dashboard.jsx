import { motion } from 'framer-motion'
import { useCallback, useState } from 'react'
import AvatarSelector from '../components/user/AvatarSelector'
import HistoryDashboard from '../components/user/HistoryDashboard'
import WeatherCard from '../components/user/WeatherCard'
import ChatBar from '../components/user/ChatBar'
import Navbar from '../components/shared/Navbar'
import WeatherBackground from '../components/shared/WeatherBackground'
import WeatherTopBar from '../components/shared/WeatherTopBar'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function Dashboard() {
  const { user, updateAvatar } = useAuth()
  const [avatarState, setAvatarState] = useState(user?.avatar_state ?? 'energized')
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [autoSend, setAutoSend] = useState(null)   // { text, id } — triggers ChatBar auto-message

  const handleAvatarSelect = async (profileOrState) => {
    const isProfile = typeof profileOrState !== 'string'
    const state = isProfile ? profileOrState.prompt_key : profileOrState
    setAvatarState(state)

    if (isProfile) {
      // Auto-fire a chat message with the profile context
      setAutoSend({
        text: `Soy ${profileOrState.avatarName} ${profileOrState.avatarEmoji} — hoy estoy ${profileOrState.physical === 'energized' ? 'lleno de energía' : profileOrState.physical === 'tired' ? 'cansado' : profileOrState.physical === 'sick' ? 'enfermo' : 'bien'}, mentalmente ${profileOrState.mental === 'focused' ? 'enfocado' : profileOrState.mental === 'anxious' ? 'ansioso' : profileOrState.mental === 'blocked' ? 'bloqueado' : 'disperso'} y voy a estar ${profileOrState.exposure === 'outdoors' ? 'todo el día fuera' : profileOrState.exposure === 'indoors' ? 'en casa' : profileOrState.exposure === 'commute' ? 'solo en desplazamientos' : 'fuera algunos ratos'}. Dame mi previsión meteorológica personalizada para hoy.`,
        id: Date.now(),
      })
    }

    const backendKey = isProfile
      ? (profileOrState.physical === 'sick' ? 'sick' : profileOrState.physical === 'tired' ? 'tired' : profileOrState.physical === 'energized' ? 'energized' : 'energized')
      : profileOrState
    try {
      await updateAvatar(backendKey)
    } catch {
      // non-critical
    }
  }

  const fetchWeather = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get(`/api/weather/current?avatar_state=${avatarState}`)
      setWeatherData(data)
    } catch (err) {
      setError(err.response?.data?.detail ?? 'Failed to fetch weather. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [avatarState])

  // Extract raw weather_data for background + top bar
  const rawWeather = weatherData?.weather_data ?? null

  return (
    <div className="min-h-screen relative">
      {/* Animated scene — behind everything */}
      <WeatherBackground weatherData={rawWeather} />

      {/* Navbar */}
      <Navbar />

      {/* Live weather top strip — always above content */}
      <WeatherTopBar weatherData={rawWeather} loading={loading && !rawWeather} />

      <div className="max-w-4xl mx-auto px-4 pt-6 pb-32 space-y-6 relative z-10">

        {/* 1 ─ Greeting (compact, one line) */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <h1 className="text-xl font-bold text-white">
            Hola, <span className="text-blue-400">{user?.username}</span>
            <span className="text-white/40 font-normal text-base ml-2">— tu previsión personal</span>
          </h1>
        </motion.div>

        {/* 2 ─ WEATHER HERO CARD (star of the page) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <WeatherCard data={weatherData} loading={loading} onRefresh={fetchWeather} />
        </motion.div>

        {/* 3 ─ Questionnaire + fetch button */}
        <motion.div
          className="glass rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <AvatarSelector selected={avatarState} onSelect={handleAvatarSelect} />

          <div className="mt-5">
            <motion.button
              onClick={fetchWeather}
              disabled={loading}
              className="btn-primary w-full text-base py-3 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
                  />
                  Analizando…
                </>
              ) : (
                <>☁️ Obtener previsión</>
              )}
            </motion.button>
          </div>

          {error && (
            <motion.p
              className="mt-3 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}
        </motion.div>

        {/* 4 ─ History */}
        <motion.div
          className="glass rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <HistoryDashboard />
        </motion.div>

      </div>

      {/* Persistent bottom AI chat bar */}
      <ChatBar avatarState={avatarState} autoSend={autoSend} />
    </div>
  )
}
