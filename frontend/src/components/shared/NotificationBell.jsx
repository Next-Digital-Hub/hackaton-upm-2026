import { AnimatePresence, motion } from 'framer-motion'
import { Bell } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import api from '../../services/api'
import { useWebSocket } from '../../context/WebSocketContext'

const SEVERITY_STYLES = {
  info:     { dot: 'bg-blue-400',   text: 'text-blue-300',   badge: 'bg-blue-500/20 border-blue-500/30' },
  warning:  { dot: 'bg-amber-400',  text: 'text-amber-300',  badge: 'bg-amber-500/20 border-amber-500/30' },
  critical: { dot: 'bg-red-400',    text: 'text-red-300',    badge: 'bg-red-500/20 border-red-500/30' },
}

function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function NotificationBell() {
  const { unreadCount, clearNotifications } = useWebSocket()
  const [open, setOpen] = useState(false)
  const [alerts, setAlerts] = useState([])
  const panelRef = useRef(null)

  // Fetch latest active alerts when dropdown opens
  useEffect(() => {
    if (!open) return
    api.get('/api/alerts/').then(({ data }) => {
      setAlerts(data.slice(0, 5))
    }).catch(() => {})
  }, [open])

  // Clear badge when panel is opened
  useEffect(() => {
    if (open && unreadCount > 0) {
      clearNotifications()
    }
  }, [open])

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div className="relative" ref={panelRef}>
      {/* ─── Bell button ─── */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="relative btn-ghost py-1.5 px-2.5 flex items-center"
        aria-label="Notifications"
      >
        <motion.div
          animate={unreadCount > 0 ? { rotate: [0, -15, 15, -10, 10, 0] } : {}}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'text-amber-400' : 'text-slate-400'}`} />
        </motion.div>

        {/* Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key="badge"
              className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1
                         bg-red-500 text-white text-[10px] font-black rounded-full
                         flex items-center justify-center leading-none"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* ─── Dropdown panel ─── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-white/10
                       rounded-2xl shadow-2xl overflow-hidden z-50"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-semibold text-white">Active Alerts</span>
              </div>
              <span className="text-xs text-slate-500">{alerts.length} active</span>
            </div>

            {/* Alert list */}
            <div className="max-h-72 overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-slate-500">
                  <Bell className="w-8 h-8 opacity-30" />
                  <p className="text-sm">No active alerts</p>
                </div>
              ) : (
                alerts.map((alert, i) => {
                  const style = SEVERITY_STYLES[alert.severity] ?? SEVERITY_STYLES.info
                  return (
                    <motion.div
                      key={alert.id}
                      className={`px-4 py-3 border-b border-white/5 last:border-0
                                  hover:bg-white/3 transition-colors cursor-default`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Severity dot */}
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${style.dot}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span className="text-sm font-semibold text-white truncate">
                              {alert.title}
                            </span>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5
                                            rounded-full border shrink-0 ${style.badge} ${style.text}`}>
                              {alert.severity}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-2">{alert.message}</p>
                          <p className="text-[10px] text-slate-600 mt-1">
                            {timeAgo(alert.created_at)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-white/5 bg-black/20">
              <p className="text-[10px] text-slate-600 text-center">
                Alerts update in real-time via WebSocket
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
