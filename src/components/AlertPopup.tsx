'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface AlertData {
  type: 'alert' | 'contact_alert'
  id?: string
  title?: string
  message?: string
  level?: string
  province?: string
  emittedBy?: string
  createdAt?: string
  // For contact_alert
  targetUserId?: string
  contactName?: string
  contactProvince?: string
  alertLevel?: string
  alertTitle?: string
}

export default function AlertPopup() {
  const [alert, setAlert] = useState<AlertData | null>(null)
  const [visible, setVisible] = useState(false)
  const [connected, setConnected] = useState(false)
  const [userProvince, setUserProvince] = useState<string>('')
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => { 
        if (d.user) {
          setUserProvince(d.user.province)
          setCurrentUserId(d.user.id)
        }
      })
      .catch(() => {})

    const eventSource = new EventSource('/api/alerts/stream')

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'connected') setConnected(true)
        
        const triggerAlert = () => {
          setAlert(data)
          setVisible(true)
          try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.frequency.value = data.type === 'contact_alert' ? 440 : 880
            osc.type = 'square'
            gain.gain.value = 0.15
            osc.start()
            setTimeout(() => { osc.frequency.value = data.type === 'contact_alert' ? 330 : 660 }, 200)
            setTimeout(() => { osc.frequency.value = data.type === 'contact_alert' ? 440 : 880 }, 400)
            setTimeout(() => { osc.stop(); ctx.close() }, 600)
          } catch { /* audio not available */ }
        }

        if (data.type === 'alert') {
          triggerAlert()
        }

        if (data.type === 'contact_alert') {
          // Verify it's for me!
          setCurrentUserId(prevId => {
            if (data.targetUserId === prevId) {
              triggerAlert()
            }
            return prevId
          })
        }
      } catch { /* ignore parse errors */ }
    }

    eventSource.onerror = () => setConnected(false)
    return () => eventSource.close()
  }, [])

  // Filter direct alerts by province
  useEffect(() => {
    if (alert && alert.type === 'alert' && userProvince && alert.province !== userProvince) {
      setVisible(false)
    }
  }, [alert, userProvince])

  const levelColors: Record<string, string> = {
    CRITICAL: '#ef4444',
    WARNING: '#f59e0b',
    INFO: '#3b82f6'
  }
  const levelLabels: Record<string, string> = {
    CRITICAL: '🔴 ALERTA CRÍTICA',
    WARNING: '⚠️ AVISO IMPORTANTE',
    INFO: 'ℹ️ INFORMACIÓN'
  }

  // Inline indicator (shown in header when no popup)
  const indicator = (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '6px',
      padding: '6px 14px', borderRadius: '20px',
      background: connected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
      border: `1px solid ${connected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
      fontSize: '0.7rem',
      color: connected ? 'var(--accent-color)' : 'var(--alert-red)',
    }}>
      <span style={{
        width: '6px', height: '6px', borderRadius: '50%',
        background: connected ? 'var(--accent-color)' : 'var(--alert-red)',
        animation: connected ? 'pulse-border 2s infinite' : 'none'
      }}></span>
      {connected ? 'En tiempo real' : 'Reconectando...'}
    </div>
  )

  if (!mounted) return indicator

  const alertLevel = alert?.type === 'contact_alert' ? alert.alertLevel : alert?.level
  const color = alertLevel ? (levelColors[alertLevel] || '#f59e0b') : '#f59e0b'
  const isContactAlert = alert?.type === 'contact_alert'

  return (
    <>
      {indicator}
      {visible && alert && createPortal(
        <div style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100vw', height: '100vh',
          background: 'rgba(4, 4, 14, 0.97)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999999,
        }}>
          <div style={{
            background: '#0d0d1a',
            border: `2px solid ${color}`,
            borderRadius: '24px',
            padding: '48px',
            maxWidth: '500px',
            width: '90%',
            textAlign: 'center',
            boxShadow: `0 0 80px ${color}50, 0 20px 60px rgba(0,0,0,0.8)`,
          }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: `${color}25`, border: `3px solid ${color}`,
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              margin: '0 auto 24px', fontSize: '2.5rem',
              animation: 'pulse-border 1.5s infinite'
            }}>
              {isContactAlert ? '👥' : (alert?.level === 'CRITICAL' ? '🚨' : alert?.level === 'WARNING' ? '⚠️' : 'ℹ️')}
            </div>

            <p style={{ color, fontSize: '0.9rem', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
              {isContactAlert ? '📞 AVISO A CONTACTO' : (levelLabels[alert?.level || ''] || 'ALERTA')}
            </p>

            <h2 style={{ color: 'white', fontSize: '1.8rem', fontWeight: '800', marginBottom: '16px', lineHeight: '1.2' }}>
              {isContactAlert ? `Tu contacto ${alert?.contactName} está en riesgo` : alert?.title}
            </h2>

            <p style={{ color: '#aaa', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '32px' }}>
              {isContactAlert 
                ? `Se ha emitido una alerta en ${alert?.contactProvince}: "${alert?.alertTitle}". Tu contacto de emergencia se encuentra en esta zona.` 
                : alert?.message}
            </p>

            <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '24px' }}>
              {alert?.createdAt ? new Date(alert.createdAt).toLocaleString('es-ES') : new Date().toLocaleString('es-ES')}
            </p>

            <button
              onClick={() => setVisible(false)}
              style={{
                padding: '16px 48px', fontSize: '1.1rem', width: '100%',
                background: color, color: 'white', border: 'none',
                borderRadius: '12px', cursor: 'pointer', fontWeight: '700',
                boxShadow: `0 4px 20px ${color}60`
              }}
            >
              Entendido
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
