'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isDependent, setIsDependent] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data: any = Object.fromEntries(formData.entries())
    data.isDependent = isDependent

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const resData = await res.json()
      if (!res.ok) throw new Error(resData.error || 'Error en el registro')
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px' }}>
        <h2 style={{ marginBottom: '24px', color: 'var(--accent-color)', textAlign: 'center' }}>Crea tu perfil ciudadano</h2>

        {error && <div style={{ color: 'var(--alert-red)', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label className="input-label">Usuario</label>
              <input name="username" type="text" className="input-field" required />
            </div>
            <div style={{ flex: 1 }}>
              <label className="input-label">Contraseña</label>
              <input name="password" type="password" className="input-field" required />
            </div>
          </div>

          <div>
            <label className="input-label">Provincia</label>
            <select name="province" className="input-field" required>
              <option value="">Selecciona...</option>
              <option value="Madrid">Madrid</option>
              <option value="Barcelona">Barcelona</option>
              <option value="Valencia">Valencia</option>
              <option value="Sevilla">Sevilla</option>
              <option value="Bizkaia">Bizkaia</option>
              <option value="Alicante">Alicante</option>
            </select>
          </div>

          <label className="input-label">Tipo de Vivienda</label>
          <select name="housingType" className="input-field" required>
            <option value="">Selecciona...</option>
            <option value="Sótano">Sótano</option>
            <option value="Planta baja">Planta baja</option>
            <option value="Piso alto">Piso alto</option>
            <option value="Casa de campo">Casa de campo</option>
            <option value="Residencia">Residencia</option>
          </select>

          <label className="input-label">Necesidades Especiales (opcional)</label>
          <input name="specialNeeds" type="text" className="input-field" placeholder="Ej: Silla de ruedas, mascotas..." />

          {/* Dependent person toggle */}
          <div
            onClick={() => setIsDependent(!isDependent)}
            style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '14px 16px', borderRadius: '10px', cursor: 'pointer',
              marginTop: '4px', marginBottom: '4px',
              background: isDependent ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${isDependent ? 'rgba(245,158,11,0.5)' : 'var(--glass-border)'}`,
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{
              width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
              background: isDependent ? 'var(--alert-yellow)' : 'transparent',
              border: `2px solid ${isDependent ? 'var(--alert-yellow)' : 'var(--glass-border-hover)'}`,
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              transition: 'all 0.2s ease', fontSize: '14px'
            }}>
              {isDependent && '✓'}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem', color: isDependent ? 'var(--alert-yellow)' : 'var(--text-primary)' }}>
                🧓 Soy una persona dependiente
              </p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Anciano, discapacidad, movilidad reducida, menor de edad...
              </p>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '16px' }}>
            {loading ? 'Registrando...' : 'Completar Registro'}
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          ¿Ya tienes cuenta? <Link href="/login" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
