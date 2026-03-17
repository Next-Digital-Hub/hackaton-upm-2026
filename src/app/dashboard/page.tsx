'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AlertPopup from '@/components/AlertPopup'
import ProfileMenu from '@/components/ProfileMenu'
import WeatherBackground from '@/components/WeatherBackground'
import SpeechButton from '@/components/SpeechButton'
import EmergencyContacts from '@/components/EmergencyContacts'

interface DayForecast {
  date: string
  dayName: string
  tempMax: number
  tempMin: number
  precipitationSum: number
  weatherIcon: string
  weatherLabel: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [weather, setWeather] = useState<any>(null)
  const [llmResponse, setLlmResponse] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [llmLoading, setLlmLoading] = useState(true)
  const [forecast, setForecast] = useState<DayForecast[]>([])

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch('/api/dashboard/weather?disaster=true')
        const data = await res.json()
        if (data.success) {
          setWeather(data.data)
          fetchLlmAdvice(data.data)
        } else {
          setLoading(false)
        }

        // Fetch 7-day forecast in parallel
        const resForecast = await fetch('/api/dashboard/forecast')
        const fData = await resForecast.json()
        if (fData.success) {
          setForecast(fData.forecast)
        }
      } catch (err) {
        console.error(err)
        setLoading(false)
      }
    }
    init()
  }, [])

  async function fetchLlmAdvice(weatherData: any) {
    try {
      setLlmLoading(true)
      const res = await fetch('/api/dashboard/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weatherData, isBackoffice: false })
      })
      const data = await res.json()
      if (data.success) {
        setLlmResponse(data.response)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      setLlmLoading(false)
    }
  }



  // Show full page loader only until we have basic weather data
  if (loading && !weather) {
    return (
      <div className="animate-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column', gap: '16px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--accent-glow)', borderTopColor: 'var(--accent-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <h2 style={{ color: 'var(--accent-color)', letterSpacing: '1px' }}>Detectando ubicación y clima...</h2>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const isAlert = weather && weather.prec && parseFloat(weather.prec.replace(',', '.')) > 50;

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <WeatherBackground weather={weather} />
      
      {/* Overlay to ensure readability - now more transparent to show animations */}
      <div style={{ 
        minHeight: '100vh', 
        background: 'transparent', 
        padding: '40px'
      }}>
        <div className="animate-in" style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="animate-in stagger-1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', position: 'relative', zIndex: 50 }}>
            <h1 style={{ color: 'var(--text-primary)', fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
              Safe<span style={{ color: 'var(--accent-color)' }}>Clima</span>
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <AlertPopup />
              <EmergencyContacts />
              <ProfileMenu />
            </div>
          </div>

      {isAlert && (
        <div className="glass-panel alert-pulse animate-in stagger-2" style={{ background: 'rgba(239, 68, 68, 0.15)', borderColor: 'var(--alert-red)', marginBottom: '40px' }}>
          <h2 style={{ color: 'var(--alert-red)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.5rem' }}>⚠️</span> ALERTA CLIMÁTICA ACTIVA
            <SpeechButton text={`Alerta climática activa. Precipitación inusual detectada de ${weather.prec} milímetros. Por favor, lee atentamente las siguientes instrucciones.`} color="var(--alert-red)" />
          </h2>
          <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>Precipitación inusual detectada ({weather.prec} mm). <strong>Por favor, lee atentamente las siguientes instrucciones.</strong></p>
        </div>
      )}

      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', marginBottom: '32px' }}>
        <div className="glass-panel animate-in stagger-3" style={{ flex: '1 1 300px' }}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '1.1rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Tiempo Hoy</h3>
          {weather ? (
            <ul style={{ listStyle: 'none', lineHeight: '2.5', fontSize: '1.1rem' }}>
              <li style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>📍 <strong style={{ color: 'var(--text-primary)'}}>Estación:</strong> <span style={{color: 'var(--text-secondary)'}}>{weather.nombre}</span></li>
              <li style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px', paddingTop: '8px' }}>🌧️ <strong style={{ color: 'var(--text-primary)'}}>Precipitación:</strong> <span style={{color: 'var(--accent-color)', fontWeight: 'bold'}}>{weather.prec} mm</span></li>
              <li style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px', paddingTop: '8px' }}>🌡️ <strong style={{ color: 'var(--text-primary)'}}>Temp. Máxima:</strong> <span style={{color: 'var(--alert-yellow)'}}>{weather.tmax} °C</span></li>
              <li style={{ paddingTop: '8px' }}>💧 <strong style={{ color: 'var(--text-primary)'}}>Humedad Máx:</strong> <span style={{color: 'var(--text-secondary)'}}>{weather.hrMax} %</span></li>
            </ul>
          ) : (
            <p>No se pudieron obtener datos del clima.</p>
          )}
        </div>

        <div className="glass-panel animate-in stagger-3" style={{ flex: '2 1 400px', borderTop: '4px solid var(--accent-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ color: 'var(--accent-color)', fontSize: '1.4rem', margin: 0 }}>Coordinación de Emergencias</h3>
            {!llmLoading && llmResponse && <SpeechButton text={llmResponse} color="var(--accent-color)" />}
          </div>
          {llmLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               <div style={{ height: '20px', background: 'var(--glass-border)', borderRadius: '4px', width: '100%', animation: 'pulse-border 2s infinite' }}></div>
               <div style={{ height: '20px', background: 'var(--glass-border)', borderRadius: '4px', width: '80%', animation: 'pulse-border 2s infinite', animationDelay: '0.2s' }}></div>
               <div style={{ height: '20px', background: 'var(--glass-border)', borderRadius: '4px', width: '90%', animation: 'pulse-border 2s infinite', animationDelay: '0.4s' }}></div>
               <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '16px' }}>El Coordinador de Emergencias de IA está evaluando su riesgo específico...</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {llmResponse
                .split('\n')
                .filter((l: string) => l.trim().length > 2)
                .map((line: string, i: number) => (
                  <p key={i} style={{ 
                    lineHeight: '1.8', 
                    fontSize: '1.2rem', 
                    color: 'var(--text-primary)', 
                    margin: '0 0 20px 0',
                    animation: 'fadeInUp 0.3s ease-out',
                    animationDelay: `${i * 0.1}s`
                  }}>
                    {line.trim()}
                  </p>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* 7-Day Forecast - Apple Weather Style */}
      {forecast.length > 0 && (
        <div className="glass-panel animate-in stagger-3" style={{ marginTop: '8px' }}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '1.1rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
            📅 Previsión Próximos Días
          </h3>
          <div style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '8px',
            scrollSnapType: 'x mandatory'
          }}>
            {forecast.map((day, i) => {
              const isRainy = day.precipitationSum > 20
              const isSevere = day.precipitationSum > 50
              return (
                <div
                  key={day.date}
                  style={{
                    minWidth: '110px',
                    padding: '20px 16px',
                    borderRadius: '16px',
                    background: isSevere
                      ? 'rgba(239, 68, 68, 0.12)'
                      : isRainy
                        ? 'rgba(59, 130, 246, 0.1)'
                        : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${isSevere ? 'rgba(239, 68, 68, 0.3)' : isRainy ? 'rgba(59, 130, 246, 0.2)' : 'var(--glass-border)'}`,
                    textAlign: 'center',
                    scrollSnapAlign: 'start',
                    transition: 'var(--transition)',
                    cursor: 'default',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-color)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.borderColor = isSevere ? 'rgba(239, 68, 68, 0.3)' : isRainy ? 'rgba(59, 130, 246, 0.2)' : 'var(--glass-border)' }}
                >
                  <p style={{ color: i === 0 ? 'var(--accent-color)' : 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>
                    {day.dayName}
                  </p>
                  <p style={{ fontSize: '2.2rem', marginBottom: '8px', lineHeight: '1' }}>
                    {day.weatherIcon}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '12px', minHeight: '30px' }}>
                    {day.weatherLabel}
                  </p>
                  <p style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {day.tempMax}°
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {day.tempMin}°
                  </p>
                  {day.precipitationSum > 0 && (
                    <p style={{ fontSize: '0.75rem', color: isSevere ? 'var(--alert-red)' : 'var(--accent-color)', marginTop: '8px', fontWeight: '600' }}>
                      💧 {day.precipitationSum.toFixed(1)} mm
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  )
}


