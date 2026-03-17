'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'

export default function ProfileMenu() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [user, setUser] = useState<any>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Form states
  const [province, setProvince] = useState('')
  const [housingType, setHousingType] = useState('')
  const [specialNeeds, setSpecialNeeds] = useState('')
  const [isDependent, setIsDependent] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    fetchUser()
    
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function fetchUser() {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      if (data.user) {
        setUser(data.user)
        setProvince(data.user.province)
        setHousingType(data.user.housingType || 'Piso alto')
        setSpecialNeeds(data.user.specialNeeds || '')
        setIsDependent(!!data.user.isDependent)
      }
    } catch (err) {
      console.error('Error fetching user:', err)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaveMessage('')
    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ province, housingType, specialNeeds, isDependent })
      })
      const data = await res.json()
      if (data.success) {
        setSaveMessage('✅ Perfil actualizado correctamente')
        setUser(data.user)
        setTimeout(() => setShowModal(false), 1500)
        // Refresh page to update AI advice if needed
        window.location.reload()
      } else {
        setSaveMessage('❌ Error: ' + (data.error || 'No se pudo guardar'))
      }
    } catch (err) {
      setSaveMessage('❌ Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  if (!user) return null

  const provinces = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bizkaia', 'Alicante']
  const housingTypes = ['Sótano', 'Planta baja', 'Piso alto', 'Casa de campo', 'Residencia']

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={menuRef}>
      {/* Profile Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          background: '#10b981', // Solid emerald
          border: '2px solid rgba(255,255,255,0.2)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          color: 'white',
          fontWeight: '800',
          fontSize: '1.2rem',
          transition: 'all 0.2s ease',
          boxShadow: isOpen ? '0 0 20px var(--accent-glow)' : '0 4px 10px rgba(0,0,0,0.3)',
          padding: 0
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {user.username.charAt(0).toUpperCase()}
      </button>

      {/* Dropdown Menu - Premium & Opaque */}
      {isOpen && (
        <div 
          style={{
            position: 'absolute',
            top: '52px',
            right: 0,
            width: '260px',
            background: 'rgba(10, 10, 15, 0.98)', // Almost solid for readability
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1.5px solid var(--accent-color)',
            borderRadius: '20px',
            padding: '16px',
            zIndex: 10000, 
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 15px rgba(16, 185, 129, 0.1)',
            animation: 'fadeInUp 0.15s ease-out',
            display: 'block'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ padding: '8px 12px 14px 12px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '8px' }}>
            <p style={{ fontSize: '0.7rem', color: '#a1a1aa', margin: 0, textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800' }}>Sesión</p>
            <p style={{ fontSize: '1.2rem', color: 'white', margin: '4px 0 0 0', fontWeight: '800' }}>{user.username}</p>
          </div>
          
          <button 
            type="button"
            onClick={() => { 
              console.log('DEBUG: Ver perfil clicked');
              setShowModal(true); 
              setIsOpen(false); 
            }}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '14px 16px',
              background: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              borderRadius: '12px',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'background 0.2s',
              zIndex: 10001
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            👤 Ver mi perfil
          </button>
          
          <button 
            type="button"
            onClick={() => {
              console.log('DEBUG: Cerrar sesión clicked');
              handleLogout();
            }}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '14px 16px',
              background: 'transparent',
              border: 'none',
              color: '#ff4d4d',
              cursor: 'pointer',
              borderRadius: '12px',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'background 0.2s',
              zIndex: 10001
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            🚪 Cerrar sesión
          </button>
        </div>
      )}

      {/* Edit Profile Modal - Using Portal for perfect centering */}
      {showModal && createPortal(
        <div style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100vw', height: '100vh',
          background: 'rgba(2, 2, 8, 0.85)', // Slightly more transparent for depth
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000000, // Extremely high
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '500px',
            padding: '40px',
            border: '2.5px solid var(--accent-color)',
            boxShadow: '0 0 80px rgba(16, 185, 129, 0.25)',
            animation: 'fadeInUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
            pointerEvents: 'auto',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ color: 'var(--accent-color)', marginBottom: '32px', textAlign: 'center', fontSize: '2rem', fontWeight: '800' }}>Configuración Perfil</h2>
            
            <form onSubmit={(e) => { handleUpdateProfile(e); }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label className="input-label">📍 Provincia</label>
                <select 
                  className="input-field" 
                  value={province} 
                  onChange={(e) => setProvince(e.target.value)}
                  style={{ width: '100%', margin: '8px 0 0 0' }}
                >
                  {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="input-label">🏠 Tipo de Vivienda</label>
                <select 
                  className="input-field" 
                  value={housingType} 
                  onChange={(e) => setHousingType(e.target.value)}
                  style={{ width: '100%', margin: '8px 0 0 0' }}
                >
                  {housingTypes.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              <div 
                onClick={() => setIsDependent(!isDependent)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '18px', borderRadius: '16px', cursor: 'pointer',
                  background: isDependent ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255,255,255,0.03)',
                  border: `1.5px solid ${isDependent ? '#f59e0b' : 'rgba(255,255,255,0.08)'}`,
                  transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
                }}
              >
                <div style={{
                  width: '24px', height: '24px', border: '2.5px solid #f59e0b',
                  borderRadius: '8px', background: isDependent ? '#f59e0b' : 'transparent',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '16px', color: 'black'
                }}>
                  {isDependent && '✓'}
                </div>
                <span style={{ fontSize: '1.05rem', color: isDependent ? '#f59e0b' : 'white', fontWeight: '600' }}>
                  Persona con movilidad reducida
                </span>
              </div>

              {saveMessage && (
                <div style={{ 
                  textAlign: 'center', 
                  fontSize: '1rem', 
                  padding: '14px',
                  borderRadius: '12px',
                  background: saveMessage.includes('✅') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: saveMessage.includes('✅') ? 'var(--accent-color)' : 'var(--alert-red)',
                  fontWeight: '600',
                  border: `1px solid ${saveMessage.includes('✅') ? 'var(--accent-color)' : 'var(--alert-red)'}40`
                }}>
                  {saveMessage}
                </div>
              )}

              <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={saving}
                  style={{ flex: 2, padding: '18px', height: '60px' }}
                >
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-primary"
                  style={{ 
                    flex: 1, 
                    height: '60px',
                    background: 'transparent', 
                    border: '1.5px solid rgba(255,255,255,0.15)', 
                    boxShadow: 'none',
                    color: 'white'
                  }}
                >
                  Cerrar
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
