'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProfileMenu from '@/components/ProfileMenu'
import WeatherBackground from '@/components/WeatherBackground'

export default function BackofficePage() {
  const router = useRouter()
  const [weather, setWeather] = useState<any>(null)
  const [llmRecommendation, setLlmRecommendation] = useState<string>('')
  const [llmHistory, setLlmHistory] = useState<any[]>([])
  const [weatherHistory, setWeatherHistory] = useState<any[]>([])
  const [alertsHistory, setAlertsHistory] = useState<any[]>([])
  const [adminProvince, setAdminProvince] = useState('')
  
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'weather' | 'llm' | 'alerts'>('weather')

  // Alert form
  const [alertTitle, setAlertTitle] = useState('')
  const [alertMessage, setAlertMessage] = useState('')
  const [alertLevel, setAlertLevel] = useState('WARNING')
  const [emitting, setEmitting] = useState(false)
  const [emitResult, setEmitResult] = useState<string | null>(null)

  // Create admin modal
  const [showCreateAdmin, setShowCreateAdmin] = useState(false)
  const [newAdminUser, setNewAdminUser] = useState('')
  const [newAdminPass, setNewAdminPass] = useState('')
  const [newAdminProvince, setNewAdminProvince] = useState('Madrid')
  const [createResult, setCreateResult] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    async function init() {
      try {
        const meRes = await fetch('/api/auth/me')
        const meData = await meRes.json()
        if (meData.user) setAdminProvince(meData.user.province)

        const resWeather = await fetch('/api/dashboard/weather?disaster=true')
        const wData = await resWeather.json()
        if (wData.success) {
          setWeather(wData.data)
          fetchLlmRec(wData.data)
        }

        const resHist = await fetch('/api/backoffice/history')
        const hData = await resHist.json()
        if (hData.success) {
          setLlmHistory(hData.llmHistory || [])
          setWeatherHistory(hData.weatherHistory || [])
          setAlertsHistory(hData.alerts || [])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  async function fetchLlmRec(weatherData: any) {
    try {
      const res = await fetch('/api/dashboard/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weatherData, isBackoffice: true })
      })
      const data = await res.json()
      if (data.success) setLlmRecommendation(data.response)
    } catch (err) { console.error(err) }
  }

  async function handleEmitAlert() {
    if (!alertTitle.trim() || !alertMessage.trim()) {
      setEmitResult('❌ Debes rellenar título y mensaje.')
      return
    }
    setEmitting(true)
    setEmitResult(null)
    try {
      const res = await fetch('/api/alerts/emit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: alertTitle, message: alertMessage, level: alertLevel })
      })
      const data = await res.json()
      if (data.success) {
        setEmitResult(`✅ Alerta emitida para ${adminProvince} a ${data.broadcastedTo} conexion(es).`)
        setAlertTitle('')
        setAlertMessage('')
      } else {
        setEmitResult(`❌ ${data.error}`)
      }
    } catch { setEmitResult('❌ Error de conexión.') }
    finally { setEmitting(false) }
  }

  async function handleCreateAdmin() {
    if (!newAdminUser.trim() || !newAdminPass.trim()) {
      setCreateResult('❌ Rellena usuario y contraseña.')
      return
    }
    setCreating(true)
    setCreateResult(null)
    try {
      const res = await fetch('/api/auth/register-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newAdminUser, password: newAdminPass, province: newAdminProvince })
      })
      const data = await res.json()
      if (data.success) {
        setCreateResult(`✅ Admin "${data.user.username}" creado para la provincia ${data.user.province}.`)
        setNewAdminUser('')
        setNewAdminPass('')
      } else {
        setCreateResult(`❌ ${data.error}`)
      }
    } catch { setCreateResult('❌ Error de conexión.') }
    finally { setCreating(false) }
  }

  // Show full page loader only until we have basic weather data
  if (loading && !weather) return (
    <div className="animate-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column', gap: '16px' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid var(--accent-glow)', borderTopColor: 'var(--accent-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <h2 style={{ color: 'var(--accent-color)', letterSpacing: '1px' }}>Cargando Centro de Control...</h2>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  )

  const isAlert = weather && parseFloat(weather.prec.replace(',', '.')) > 50
  const provinces = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bizkaia', 'Alicante']

  const tabStyle = (tab: string) => ({
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600' as const,
    letterSpacing: '0.5px',
    transition: 'var(--transition)',
    background: activeTab === tab ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
    color: activeTab === tab ? 'var(--bg-primary)' : 'var(--text-secondary)',
  })

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <WeatherBackground weather={weather} />
      
      <div style={{ 
        minHeight: '100vh', 
        background: 'transparent', 
        padding: '40px'
      }}>
        <div className="animate-in" style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="animate-in stagger-1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', position: 'relative', zIndex: 50 }}>
            <div>
              <h1 style={{ color: 'var(--text-primary)', fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                Safe<span style={{ color: 'var(--alert-red)' }}>Clima</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
                Gestionando alertas de: <strong style={{ color: 'var(--accent-color)' }}>{adminProvince}</strong>
              </p>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button onClick={() => setShowCreateAdmin(true)} className="btn-primary" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid var(--accent-color)', boxShadow: 'none', color: 'var(--accent-color)', fontSize: '0.85rem', padding: '8px 16px' }}>
                + Crear Admin
              </button>
              <ProfileMenu />
            </div>
          </div>

      {/* Create Admin Modal */}
      {showCreateAdmin && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div className="glass-panel" style={{ maxWidth: '420px', width: '90%', padding: '32px' }}>
            <h3 style={{ color: 'var(--accent-color)', marginBottom: '24px', fontSize: '1.2rem' }}>Crear Cuenta Administrador</h3>

            <label className="input-label">Usuario</label>
            <input type="text" className="input-field" placeholder="Nombre de usuario" value={newAdminUser} onChange={(e) => setNewAdminUser(e.target.value)} />

            <label className="input-label">Contraseña</label>
            <input type="password" className="input-field" placeholder="Contraseña" value={newAdminPass} onChange={(e) => setNewAdminPass(e.target.value)} />

            <label className="input-label">Provincia que gestionará</label>
            <select className="input-field" value={newAdminProvince} onChange={(e) => setNewAdminProvince(e.target.value)}>
              {provinces.map(p => <option key={p} value={p}>{p}</option>)}
            </select>

            {createResult && (
              <div style={{ padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem', background: createResult.startsWith('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: createResult.startsWith('✅') ? 'var(--accent-color)' : 'var(--alert-red)' }}>
                {createResult}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleCreateAdmin} className="btn-primary" disabled={creating} style={{ flex: 1, padding: '12px' }}>
                {creating ? 'Creando...' : 'Crear Admin'}
              </button>
              <button onClick={() => { setShowCreateAdmin(false); setCreateResult(null) }} className="btn-primary" style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid var(--glass-border-hover)', boxShadow: 'none' }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {/* Weather - Compact */}
        <div className="glass-panel animate-in stagger-2" style={{ flex: '1 1 300px' }}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '1.1rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Tiempo Hoy</h3>
          {weather ? (
            <ul style={{ listStyle: 'none', lineHeight: '2.5', fontSize: '1.1rem' }}>
              <li style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>📍 <strong style={{ color: 'var(--text-primary)'}}>Estación:</strong> <span style={{color: 'var(--text-secondary)'}}>{weather.nombre}</span></li>
              <li style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px', paddingTop: '8px' }}>🌧️ <strong style={{ color: 'var(--text-primary)'}}>Precipitación:</strong> <span style={{color: 'var(--accent-color)', fontWeight: 'bold'}}>{weather.prec} mm</span></li>
              <li style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px', paddingTop: '8px' }}>🌡️ <strong style={{ color: 'var(--text-primary)'}}>Temp. Máxima:</strong> <span style={{color: 'var(--alert-yellow)'}}>{weather.tmax} °C</span></li>
              <li style={{ paddingTop: '8px' }}>💧 <strong style={{ color: 'var(--text-primary)'}}>Humedad Máx:</strong> <span style={{color: 'var(--text-secondary)'}}>{weather.hrMax} %</span></li>
            </ul>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No hay datos disponibles.</p>
          )}
        </div>

        {/* Alert Emission */}
        <div className="glass-panel animate-in stagger-3" style={{ flex: '2 1 400px', borderTop: `4px solid ${isAlert ? 'var(--alert-red)' : 'var(--alert-yellow)'}` }}>
          <h3 style={{ color: isAlert ? 'var(--alert-red)' : 'var(--alert-yellow)', marginBottom: '16px', fontSize: '1.1rem' }}>
            📢 Emitir Alerta — {adminProvince}
          </h3>

          <label className="input-label">Nivel de Gravedad</label>
          <select value={alertLevel} onChange={(e) => setAlertLevel(e.target.value)} className="input-field">
            <option value="INFO">ℹ️ Informativo</option>
            <option value="WARNING">⚠️ Aviso Importante</option>
            <option value="CRITICAL">🔴 Alerta Crítica (Evacuación)</option>
          </select>

          <label className="input-label">Título</label>
          <input type="text" className="input-field" placeholder="Ej: Lluvias torrenciales previstas" value={alertTitle} onChange={(e) => setAlertTitle(e.target.value)} />

          <label className="input-label">Mensaje</label>
          <textarea className="input-field" placeholder="Instrucciones para los ciudadanos..." value={alertMessage} onChange={(e) => setAlertMessage(e.target.value)} style={{ minHeight: '80px', resize: 'vertical' }} />

          {emitResult && (
            <div style={{ padding: '10px', borderRadius: '8px', marginBottom: '12px', fontSize: '0.85rem', background: emitResult.startsWith('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: emitResult.startsWith('✅') ? 'var(--accent-color)' : 'var(--alert-red)' }}>
              {emitResult}
            </div>
          )}

          <button onClick={handleEmitAlert} className="btn-primary" disabled={emitting} style={{ 
            background: alertLevel === 'CRITICAL' ? 'var(--alert-red)' : alertLevel === 'WARNING' ? 'var(--alert-yellow)' : 'var(--accent-color)', 
            width: '100%', padding: '14px', fontSize: '1rem',
            boxShadow: alertLevel === 'CRITICAL' ? '0 4px 15px var(--alert-red-glow)' : 'none'
          }}>
            {emitting ? 'Emitiendo...' : alertLevel === 'CRITICAL' ? '🚨 EMITIR ALERTA CRÍTICA' : '📢 Emitir Alerta'}
          </button>
        </div>
      </div>

      {/* Recommendation */}
      <div className="glass-panel animate-in stagger-3" style={{ marginBottom: '24px', borderLeft: `5px solid ${isAlert ? 'var(--alert-red)' : 'var(--accent-color)'}`, padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '1.3rem' }}>{isAlert ? '🚨' : '📋'}</span>
          <h3 style={{ color: isAlert ? 'var(--alert-red)' : 'var(--accent-color)', fontSize: '1.1rem', margin: 0 }}>
            Recomendación Alerta General
          </h3>
          <span style={{ padding: '4px 14px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '700', background: isAlert ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)', color: isAlert ? 'var(--alert-red)' : 'var(--accent-color)', border: `1px solid ${isAlert ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}` }}>
            {isAlert ? 'SE RECOMIENDA EMITIR ALERTA' : 'SIN ALERTA NECESARIA'}
          </span>
        </div>
        <div style={{ fontSize: '0.95rem', lineHeight: '1.8', color: 'var(--text-primary)' }}>
          {llmRecommendation 
            ? llmRecommendation.split('\n').filter((l: string) => l.trim()).map((line: string, i: number) => (
                <p key={i} style={{ margin: '0 0 6px 0' }}>{line}</p>
              ))
            : <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Analizando datos meteorológicos...</p>
          }
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-panel animate-in stagger-3">
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button style={tabStyle('weather')} onClick={() => setActiveTab('weather')}>
            🌦️ Datos Meteorológicos ({weatherHistory.length})
          </button>
          <button style={tabStyle('llm')} onClick={() => setActiveTab('llm')}>
            🤖 Consultas LLM ({llmHistory.length})
          </button>
          <button style={tabStyle('alerts')} onClick={() => setActiveTab('alerts')}>
            📢 Alertas Emitidas ({alertsHistory.length})
          </button>
        </div>

        <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
          {activeTab === 'weather' && (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <th style={{ padding: '10px' }}>Fecha</th>
                    <th style={{ padding: '10px' }}>Usuario</th>
                    <th style={{ padding: '10px' }}>Provincia</th>
                    <th style={{ padding: '10px' }}>Precip.</th>
                    <th style={{ padding: '10px' }}>Temp.</th>
                  </tr>
                </thead>
                <tbody>
                  {weatherHistory.map((w: any) => {
                    let p: any = {}; try { p = JSON.parse(w.data) } catch {}
                    return (
                      <tr key={w.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <td style={{ padding: '10px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{new Date(w.timestamp).toLocaleString('es-ES')}</td>
                        <td style={{ padding: '10px' }}>{w.user?.username || '-'}</td>
                        <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{w.user?.province || '-'}</td>
                        <td style={{ padding: '10px', color: 'var(--accent-color)', fontWeight: '600' }}>{p.prec || '-'} mm</td>
                        <td style={{ padding: '10px', color: 'var(--alert-yellow)' }}>{p.tmax || '-'} °C</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {weatherHistory.length === 0 && <p style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>Sin registros meteorológicos.</p>}
            </>
          )}

          {activeTab === 'llm' && (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <th style={{ padding: '10px' }}>Fecha</th>
                    <th style={{ padding: '10px' }}>Usuario</th>
                    <th style={{ padding: '10px' }}>Provincia</th>
                    <th style={{ padding: '10px' }}>Respuesta IA</th>
                  </tr>
                </thead>
                <tbody>
                  {llmHistory.map((h: any) => (
                    <tr key={h.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '10px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{new Date(h.timestamp).toLocaleString('es-ES')}</td>
                      <td style={{ padding: '10px' }}>{h.user?.username || '-'}</td>
                      <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{h.user?.province || '-'}</td>
                      <td style={{ padding: '10px', maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-secondary)' }}>{h.response}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {llmHistory.length === 0 && <p style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>Sin consultas LLM registradas.</p>}
            </>
          )}

          {activeTab === 'alerts' && (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <th style={{ padding: '10px' }}>Fecha</th>
                    <th style={{ padding: '10px' }}>Nivel</th>
                    <th style={{ padding: '10px' }}>Provincia</th>
                    <th style={{ padding: '10px' }}>Título</th>
                    <th style={{ padding: '10px' }}>Emitida por</th>
                  </tr>
                </thead>
                <tbody>
                  {alertsHistory.map((a: any) => (
                    <tr key={a.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '10px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{new Date(a.createdAt).toLocaleString('es-ES')}</td>
                      <td style={{ padding: '10px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '700', background: a.level === 'CRITICAL' ? 'rgba(239,68,68,0.2)' : a.level === 'WARNING' ? 'rgba(245,158,11,0.2)' : 'rgba(59,130,246,0.2)', color: a.level === 'CRITICAL' ? 'var(--alert-red)' : a.level === 'WARNING' ? 'var(--alert-yellow)' : '#3b82f6' }}>
                          {a.level}
                        </span>
                      </td>
                      <td style={{ padding: '10px', color: 'var(--accent-color)', fontWeight: '600' }}>{a.province}</td>
                      <td style={{ padding: '10px', fontWeight: '600' }}>{a.title}</td>
                      <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{a.emittedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {alertsHistory.length === 0 && <p style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>Sin alertas emitidas.</p>}
            </>
          )}
        </div>
        </div>
      </div>
    </div>
  </div>
  )
}

