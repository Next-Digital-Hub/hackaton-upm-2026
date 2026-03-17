import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Opciones para cada campo
const AGE_RANGE_OPTIONS = ['0-16', '17-30', '30-50', '50-65', '65+']
const TRANSPORT_OPTIONS = ['Coche', 'Moto', 'Tren', 'Autobús', 'Bici', 'Andando']
const HOUSING_OPTIONS = ['Chalet', 'Piso']
const FLOOR_OPTIONS = ['1º', '2º', '3º', '4º', '5º', '6º+']

export default function ProfileSetup() {
  const { user, completeProfile, loading } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    ageRange: user?.age_range ?? '',
    mobilityIssue: false,
    visionIssue: false,
    preferredTransport: '',
    housingType: '',
    housingFloor: '',
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.ageRange) {
      setError('Selecciona un rango de edad para continuar.')
      return
    }

    if (!formData.preferredTransport) {
      setError('Selecciona un transporte para continuar.')
      return
    }

    if (!formData.housingType) {
      setError('Selecciona un tipo de vivienda para continuar.')
      return
    }

    try {
      await completeProfile({
        age_range: formData.ageRange,
        mobility_issue: formData.mobilityIssue,
        vision_issue: formData.visionIssue,
        preferred_transport: formData.preferredTransport,
        housing_type: formData.housingType,
        housing_floor: formData.housingFloor || null,
      })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const detail = err.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'No se pudo guardar tu perfil. Intenta de nuevo.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-950 flex items-center justify-center px-6 py-10">
      <motion.div
        className="glass rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-2xl font-bold text-white mb-1">Completa tu perfil</h1>
        <p className="text-slate-400 text-sm mb-6">
          Necesitamos algunos datos para personalizar WeatherSelf a tus necesidades.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rango de Edad */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-slate-300 mb-2">Rango de edad *</legend>
            {AGE_RANGE_OPTIONS.map((option) => (
              <label key={option} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 cursor-pointer hover:border-blue-400/40">
                <input
                  type="radio"
                  name="ageRange"
                  value={option}
                  checked={formData.ageRange === option}
                  onChange={(e) => setFormData((p) => ({ ...p, ageRange: e.target.value }))}
                  className="accent-blue-500"
                />
                <span className="text-slate-200 text-sm">{option}</span>
              </label>
            ))}
          </fieldset>

          {/* Problemas de Movilidad */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-slate-300 mb-2">¿Tiene algún problema de movilidad?</legend>
            {['No', 'Sí'].map((option) => (
              <label key={option} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 cursor-pointer hover:border-blue-400/40">
                <input
                  type="radio"
                  name="mobilityIssue"
                  checked={formData.mobilityIssue === (option === 'Sí')}
                  onChange={(e) => setFormData((p) => ({ ...p, mobilityIssue: option === 'Sí' }))}
                  className="accent-blue-500"
                />
                <span className="text-slate-200 text-sm">{option}</span>
              </label>
            ))}
          </fieldset>

          {/* Problemas de Visión */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-slate-300 mb-2">¿Tiene algún problema de visión?</legend>
            {['No', 'Sí'].map((option) => (
              <label key={option} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 cursor-pointer hover:border-blue-400/40">
                <input
                  type="radio"
                  name="visionIssue"
                  checked={formData.visionIssue === (option === 'Sí')}
                  onChange={(e) => setFormData((p) => ({ ...p, visionIssue: option === 'Sí' }))}
                  className="accent-blue-500"
                />
                <span className="text-slate-200 text-sm">{option}</span>
              </label>
            ))}
          </fieldset>

          {/* Transporte Habitual */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-slate-300 mb-2">¿Cuál es el transporte que más usas habitualmente? *</legend>
            {TRANSPORT_OPTIONS.map((option) => (
              <label key={option} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 cursor-pointer hover:border-blue-400/40">
                <input
                  type="radio"
                  name="preferredTransport"
                  value={option}
                  checked={formData.preferredTransport === option}
                  onChange={(e) => setFormData((p) => ({ ...p, preferredTransport: e.target.value }))}
                  className="accent-blue-500"
                />
                <span className="text-slate-200 text-sm">{option}</span>
              </label>
            ))}
          </fieldset>

          {/* Tipo de Vivienda */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-slate-300 mb-2">¿Qué tipo es su vivienda? *</legend>
            {HOUSING_OPTIONS.map((option) => (
              <label key={option} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 cursor-pointer hover:border-blue-400/40">
                <input
                  type="radio"
                  name="housingType"
                  value={option}
                  checked={formData.housingType === option}
                  onChange={(e) => setFormData((p) => ({ ...p, housingType: e.target.value }))}
                  className="accent-blue-500"
                />
                <span className="text-slate-200 text-sm">{option}</span>
              </label>
            ))}
          </fieldset>

          {/* Piso (condicional) */}
          {formData.housingType === 'Piso' && (
            <fieldset className="space-y-3">
              <legend className="text-sm font-semibold text-slate-300 mb-2">En caso de ser piso, ¿en qué piso vive? (Opcional)</legend>
              {FLOOR_OPTIONS.map((option) => (
                <label key={option} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 cursor-pointer hover:border-blue-400/40">
                  <input
                    type="radio"
                    name="housingFloor"
                    value={option}
                    checked={formData.housingFloor === option}
                    onChange={(e) => setFormData((p) => ({ ...p, housingFloor: e.target.value }))}
                    className="accent-blue-500"
                  />
                  <span className="text-slate-200 text-sm">{option}</span>
                </label>
              ))}
            </fieldset>
          )}

          {/* Error Message */}
          {error && (
            <motion.p
              className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Guardando...' : 'Continuar'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
