import { motion } from 'framer-motion'
import { Cloud, LogOut, Settings, Wifi, WifiOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useWebSocket } from '../../context/WebSocketContext'
import NotificationBell from './NotificationBell'

const AVATAR_ICONS = {
  tired: '😴', energized: '⚡', sick: '🤒', athletic: '🏃', important: '💼',
}

export default function Navbar({ simulatedMode = 'auto', onResetMode }) {
  const { user, logout } = useAuth()
  const { connected } = useWebSocket()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <motion.nav
      className="sticky top-0 z-50 glass-dark border-b border-white/10"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-full px-4 py-2.5 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Cloud className="w-6 h-6 text-blue-400" />
          </motion.div>
          <span className="font-black text-lg bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            WeatherSelf
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Simulated mode badge */}
          {simulatedMode !== 'auto' && (
            <motion.button
              onClick={onResetMode}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full
                         bg-amber-500/15 border border-amber-500/30 text-amber-300
                         text-xs font-medium hover:bg-amber-500/25 transition-colors"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileTap={{ scale: 0.92 }}
              title="Clic para volver a datos reales"
            >
              🧪 Modo simulado · {simulatedMode}
            </motion.button>
          )}

          {/* WS indicator */}
          <div className="flex items-center gap-1">
            {connected ? (
              <>
                <motion.div
                  className="w-1.5 h-1.5 bg-green-400 rounded-full"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <Wifi className="w-3.5 h-3.5 text-green-400" />
              </>
            ) : (
              <>
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
                <WifiOff className="w-3.5 h-3.5 text-slate-500" />
              </>
            )}
          </div>

          {/* User avatar + name */}
          {user && (
            <div className="flex items-center gap-2 glass px-3 py-1 rounded-full">
              <span className="text-base">{AVATAR_ICONS[user.avatar_state] ?? '🌤️'}</span>
              <span className="text-xs text-slate-200 font-medium">{user.username}</span>
            </div>
          )}

          <NotificationBell />

          <Link to="/admin" className="btn-ghost text-xs py-1.5 px-2.5">
            <Settings className="w-4 h-4" />
          </Link>

          {user && (
            <button onClick={handleLogout} className="btn-ghost text-xs py-1.5 px-2.5">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.nav>
  )
}
