'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface Contact {
  id: string;
  contact: {
    username: string;
    province: string;
  }
}

export default function EmergencyContacts() {
  const [isOpen, setIsOpen] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [pendingSent, setPendingSent] = useState<Contact[]>([])
  const [pendingReceived, setPendingReceived] = useState<Contact[]>([])
  const [newUsername, setNewUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (isOpen) {
      fetchContacts()
    }
  }, [isOpen])

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/contacts', { cache: 'no-store' })
      const data = await res.json()
      if (data.success) {
        setContacts(data.contacts || [])
        setPendingSent(data.pendingSent || [])
        setPendingReceived(data.pendingReceived || [])
      }
    } catch (err) {
      console.error('Error fetching contacts:', err)
    }
  }

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUsername.trim()) return

    setLoading(true)
    setMessage('')
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername })
      })
      const data = await res.json()
      if (data.success) {
        setMessage('✅ Solicitud enviada')
        setNewUsername('')
        fetchContacts()
      } else {
        setMessage(`❌ ${data.error}`)
      }
    } catch (err) {
      setMessage('❌ Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (id: string, action: 'ACCEPT' | 'REJECT') => {
    try {
      const res = await fetch('/api/contacts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action })
      })
      const data = await res.json()
      if (data.success) {
        setMessage(action === 'ACCEPT' ? '✅ Contacto aceptado' : 'ℹ️ Solicitud rechazada')
        fetchContacts()
      } else {
        setMessage(`❌ ${data.error}`)
      }
    } catch (err) {
      setMessage('❌ Error procesando solicitud')
    }
  }

  const pendingCount = pendingReceived.length;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        title="Contactos de Emergencia"
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          background: pendingCount > 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.1)',
          border: `1px solid ${pendingCount > 0 ? 'var(--alert-red)' : 'rgba(255, 255, 255, 0.2)'}`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          color: pendingCount > 0 ? 'var(--alert-red)' : 'var(--accent-color)',
          fontSize: '1.2rem',
          transition: 'all 0.2s ease',
          position: 'relative'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)'
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.background = pendingCount > 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.1)'
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <line x1="19" y1="8" x2="19" y2="14"></line>
          <line x1="22" y1="11" x2="16" y2="11"></line>
        </svg>
        
        {pendingCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-5px', right: '-5px',
            background: 'var(--alert-red)',
            color: 'white',
            borderRadius: '50%',
            width: '18px', height: '18px',
            fontSize: '0.7rem',
            fontWeight: 'bold',
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
            {pendingCount}
          </span>
        )}
      </button>

      {isOpen && createPortal(
        <div style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100vw', height: '100vh',
          background: 'rgba(2, 2, 8, 0.85)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '550px',
            padding: '40px',
            border: '2.5px solid var(--accent-color)',
            boxShadow: '0 0 80px rgba(16, 185, 129, 0.25)',
            animation: 'fadeInUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
            pointerEvents: 'auto',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h2 style={{ color: 'var(--accent-color)', marginBottom: '8px', textAlign: 'center', fontSize: '1.8rem', fontWeight: '800' }}>Contactos de Emergencia</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>Busca y envía solicitudes a tus familiares o amigos para poder contactar en caso de alerta extrema.</p>
            
            <form onSubmit={handleAddContact} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <input 
                type="text" 
                placeholder="Nombre de usuario a añadir..." 
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                style={{
                  flex: 1,
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid var(--glass-border)',
                  color: 'white',
                  padding: '14px',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
              />
              <button 
                type="submit" 
                disabled={loading || !newUsername.trim()}
                className="btn-primary"
                style={{ padding: '0 24px', whiteSpace: 'nowrap' }}
              >
                {loading ? 'Enviando...' : 'Enviar Petición'}
              </button>
            </form>

            {message && (
              <div style={{ 
                textAlign: 'center', 
                fontSize: '0.9rem', 
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px',
                background: message.includes('❌') ? 'rgba(239, 68, 68, 0.15)' : (message.includes('ℹ️') ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)'),
                color: message.includes('❌') ? 'var(--alert-red)' : (message.includes('ℹ️') ? '#3b82f6' : 'var(--accent-color)'),
                border: `1px solid ${message.includes('❌') ? 'var(--alert-red)' : (message.includes('ℹ️') ? '#3b82f6' : 'var(--accent-color)')}40`
              }}>
                {message}
              </div>
            )}

            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '24px', paddingRight: '8px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* RECEIVED REQUESTS */}
              {pendingReceived.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '1.05rem', color: 'var(--alert-yellow)', marginBottom: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>
                    🔔 Solicitudes Recibidas ({pendingReceived.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {pendingReceived.map((req) => (
                      <div key={req.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(245, 158, 11, 0.1)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                        <div>
                          <p style={{ fontWeight: '600', margin: 0, fontSize: '1rem', color: 'white' }}>{req.contact.username}</p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>📍 {req.contact.province}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleAction(req.id, 'ACCEPT')} className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>Aceptar</button>
                          <button onClick={() => handleAction(req.id, 'REJECT')} className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.85rem', background: 'transparent', border: '1px solid var(--alert-red)', color: 'var(--alert-red)', boxShadow: 'none' }}>Rechazar</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SENT REQUESTS */}
              {pendingSent.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>
                    ⏳ Peticiones Enviadas (Esperando respuesta)
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {pendingSent.map((req) => (
                      <div key={req.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '10px', opacity: 0.6 }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{req.contact.username}</span>
                        <span style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>Pendiente...</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ACCEPTED FRIENDS */}
              <div>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>
                  👥 Mis Contactos ({contacts.length})
                </h3>
                {contacts.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>Aún no tienes contactos vinculados.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {contacts.map((c) => (
                      <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(16, 185, 129, 0.1)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: 'black' }}>
                            {c.contact.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p style={{ fontWeight: '600', margin: 0, fontSize: '1.05rem', color: 'white' }}>{c.contact.username}</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>📍 {c.contact.province}</p>
                          </div>
                        </div>
                        <span style={{ fontSize: '1.2rem' }}>✅</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              className="btn-primary"
              style={{ 
                width: '100%',
                background: 'transparent', 
                border: '1.5px solid rgba(255,255,255,0.15)', 
                boxShadow: 'none',
                color: 'white',
                marginTop: 'auto'
              }}
            >
              Cerrar
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
