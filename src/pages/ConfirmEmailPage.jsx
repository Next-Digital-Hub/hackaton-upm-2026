import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Shield, Mail, RefreshCw, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ConfirmEmailPage() {
    const location = useLocation()
    const navigate = useNavigate()
    const email = location.state?.email || ''
    const [resending, setResending] = useState(false)

    async function handleResend() {
        if (!email) {
            toast.error('No se encontró la dirección de correo. Intenta registrarte de nuevo.')
            return
        }
        setResending(true)
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email,
            })
            if (error) throw error
            toast.success('Correo reenviado. Revisa tu bandeja de entrada.')
        } catch (err) {
            toast.error(err.message || 'Error al reenviar el correo.')
        } finally {
            setResending(false)
        }
    }

    return (
        <div className="auth-page">
            {/* Left panel — same branding */}
            <div className="auth-left">
                <div className="auth-left-content">
                    <div className="auth-brand">
                        <Shield size={40} className="auth-brand-icon" />
                        <div>
                            <h1 className="auth-brand-title">
                                Sistema de Gestión de Emergencias Climáticas
                            </h1>
                            <p className="auth-brand-sub">Universidad Politécnica de Madrid</p>
                        </div>
                    </div>

                    <div className="confirm-email-illustration">
                        <Mail size={80} style={{ color: '#60a5fa', opacity: 0.85 }} />
                    </div>
                </div>
            </div>

            {/* Right panel — confirmation message */}
            <div className="auth-right">
                <div className="auth-form">
                    <div className="confirm-email-icon">
                        <Mail size={48} />
                    </div>

                    <h2>Confirma tu correo</h2>
                    <p className="auth-form-sub">
                        Hemos enviado un enlace de verificación a:
                    </p>

                    {email && (
                        <div className="confirm-email-address">
                            {email}
                        </div>
                    )}

                    <p className="confirm-email-hint">
                        Abre el correo y haz clic en el enlace de verificación para activar tu cuenta.
                        Una vez confirmada, podrás iniciar sesión y completar tu perfil.
                    </p>

                    <div className="confirm-email-actions">
                        <button
                            className="btn-primary btn-full"
                            onClick={handleResend}
                            disabled={resending}
                        >
                            <RefreshCw size={16} style={{ marginRight: 8 }} />
                            {resending ? 'Reenviando...' : 'Reenviar correo de verificación'}
                        </button>

                        <button
                            className="btn-secondary btn-full"
                            onClick={() => navigate('/login')}
                            style={{ marginTop: 12 }}
                        >
                            <ArrowLeft size={16} style={{ marginRight: 8 }} />
                            Ir al inicio de sesión
                        </button>
                    </div>

                    <p className="confirm-email-footer">
                        ¿No encuentras el correo? Revisa la carpeta de spam o correo no deseado.
                    </p>
                </div>
            </div>
        </div>
    )
}
