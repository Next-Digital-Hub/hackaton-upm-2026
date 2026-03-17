'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const username = formData.get('username')
    const password = formData.get('password')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error al iniciar sesión')
      }

      if (data.user.role === 'ADMIN') {
        router.push('/backoffice')
      } else {
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {/* Left Column: Branding, Images & Logos */}
      <div className="animate-in login-hero" style={{ 
        flex: '1', 
        position: 'relative',
        background: 'linear-gradient(rgba(10, 14, 23, 0.4), rgba(5, 5, 5, 0.9)), url("https://images.unsplash.com/photo-1527482797697-8795b05a13fe?q=80&w=1200&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '60px',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRight: '1px solid rgba(255,255,255,0.05)'
      }}>
        
        <div className="stagger-1">
          <h1 style={{ color: 'white', fontSize: '3.5rem', fontWeight: '800', letterSpacing: '-1px', lineHeight: '1.1' }}>
            Cada segundo cuenta.<br/><span style={{ color: 'var(--accent-color)' }}>Tu seguridad, nuestra prioridad.</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginTop: '16px', maxWidth: '80%', lineHeight: '1.7' }}>
            Alertas climáticas personalizadas impulsadas por Inteligencia Artificial. Instrucciones adaptadas a tu vivienda, tu ubicación y tus necesidades.
          </p>
        </div>

        {/* Logos at bottom left */}
        <div className="stagger-3" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px 24px', borderRadius: '12px', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center' }}>
            <img src="/logos/upm.png" alt="Logo UPM" style={{ height: '45px' }} />
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px 24px', borderRadius: '12px', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center' }}>
             <img src="/logos/nextdigital.png" alt="Logo Next Digital" style={{ height: '35px' }} />
          </div>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', position: 'relative', zIndex: 1, background: 'var(--bg-primary)' }}>
        <div className="glass-panel animate-in stagger-2" style={{ width: '100%', maxWidth: '420px', padding: '40px', background: 'transparent', border: 'none', boxShadow: 'none' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1px' }}>
               Safe<span style={{ color: 'var(--accent-color)' }}>Clima</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '8px' }}>Save Lives</p>
          </div>
          
          {error && <div className="alert-pulse" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--alert-red)', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.95rem', textAlign: 'center', border: '1px solid var(--alert-red)' }}>{error}</div>}
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <label className="input-label" style={{ marginBottom: '8px' }}>Usuario o ID</label>
            <input name="username" type="text" className="input-field" required placeholder="Introduce tu usuario..." />

            <label className="input-label" style={{ marginBottom: '8px' }}>Contraseña</label>
            <input name="password" type="password" className="input-field" required placeholder="••••••••" />

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '8px', padding: '16px' }}>
              {loading ? 'Accediendo...' : 'Iniciar Sesión'}
            </button>
          </form>

          <p style={{ marginTop: '32px', textAlign: 'center', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            <Link href="/register" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: '600', display: 'inline-block', marginTop: '8px' }}>Crea tu perfil ciudadano</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
