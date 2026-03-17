import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useAuth } from './AuthContext'

const WebSocketContext = createContext(null)

// Message types that should NOT be treated as user notifications
const SYSTEM_TYPES = new Set(['CONNECTED', 'PONG', 'EMERGENCY_BROADCAST'])

export function WebSocketProvider({ children }) {
  const { user } = useAuth()
  const [emergency, setEmergency] = useState(null)
  const [connected, setConnected] = useState(false)
  // Non-emergency real-time notifications (e.g. ALERT_NOTIFICATION from admin)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const wsRef = useRef(null)
  const reconnectTimer = useRef(null)

  const connect = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return

    const userId = user?.id ?? 'anon'
    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const url = `${proto}//${window.location.host}/ws?user_id=${userId}`

    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onopen = () => {
      setConnected(true)
      clearTimeout(reconnectTimer.current)
    }

    ws.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data)

        if (msg.type === 'EMERGENCY_BROADCAST') {
          setEmergency(msg)
          return
        }

        // Any other non-system message goes to the notifications tray
        if (!SYSTEM_TYPES.has(msg.type)) {
          setNotifications((prev) => [msg, ...prev].slice(0, 20)) // keep last 20
          setUnreadCount((n) => n + 1)
        }
      } catch {
        // ignore malformed frames
      }
    }

    ws.onclose = () => {
      setConnected(false)
      reconnectTimer.current = setTimeout(connect, 5000)
    }

    ws.onerror = () => {
      ws.close()
    }

    // Client-side keepalive ping every 25s
    const ping = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'PING' }))
      }
    }, 25_000)

    ws._pingInterval = ping
  }, [user?.id])

  useEffect(() => {
    connect()
    return () => {
      clearTimeout(reconnectTimer.current)
      if (wsRef.current) {
        clearInterval(wsRef.current._pingInterval)
        wsRef.current.onclose = null
        wsRef.current.close()
      }
    }
  }, [connect])

  const dismissEmergency = useCallback(() => setEmergency(null), [])

  const clearNotifications = useCallback(() => {
    setUnreadCount(0)
  }, [])

  return (
    <WebSocketContext.Provider
      value={{ emergency, connected, dismissEmergency, notifications, unreadCount, clearNotifications }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}

export function useWebSocket() {
  const ctx = useContext(WebSocketContext)
  if (!ctx) throw new Error('useWebSocket must be inside WebSocketProvider')
  return ctx
}
