import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Radio } from 'lucide-react'
import { useState } from 'react'
import api from '../../services/api'

// ─── Static data ──────────────────────────────────────────────────────────────

const CAUSES = [
  { key: 'lluvia',     label: 'Lluvia intensa',     emoji: '🌧️' },
  { key: 'tormenta',   label: 'Tormenta eléctrica', emoji: '⛈️' },
  { key: 'nieve',      label: 'Nieve / Granizo',    emoji: '🌨️' },
  { key: 'viento',     label: 'Viento fuerte',      emoji: '💨' },
  { key: 'calor',      label: 'Ola de calor',       emoji: '🌡️' },
  { key: 'frio',       label: 'Ola de frío',        emoji: '🥶' },
  { key: 'niebla',     label: 'Niebla densa',       emoji: '🌫️' },
  { key: 'inundacion', label: 'Inundación',         emoji: '🌊' },
  { key: 'incendio',   label: 'Riesgo de incendio', emoji: '🔥' },
]

const SEVERITIES = [
  { key: 'amarillo', label: 'AMARILLO', sub: 'Precaución', selBorder: 'border-yellow-400', selBg: 'bg-yellow-500/10', selText: 'text-yellow-300', glow: 'shadow-yellow-400/40' },
  { key: 'naranja',  label: 'NARANJA',  sub: 'Importante', selBorder: 'border-orange-400', selBg: 'bg-orange-500/10', selText: 'text-orange-300', glow: 'shadow-orange-400/40' },
  { key: 'rojo',     label: 'ROJO',     sub: 'Emergencia', selBorder: 'border-red-400',    selBg: 'bg-red-500/10',    selText: 'text-red-300',    glow: 'shadow-red-400/40'    },
]

const SEVERITY_COLOR = { amarillo: '#facc15', naranja: '#fb923c', rojo: '#ef4444' }
const SEVERITY_LABEL = { amarillo: 'Amarilla', naranja: 'Naranja', rojo: 'Roja' }

const ALERT_ACTIONS = {
  lluvia_amarillo:     ['Lleva paraguas', 'Evita zonas inundables', 'Reduce velocidad al conducir'],
  lluvia_naranja:      ['Evita salir si no es necesario', 'Aleja de cauces de ríos', 'Ten linterna a mano'],
  lluvia_rojo:         ['QUÉDATE EN CASA', 'No cruces zonas inundadas', 'Llama al 112 si hay peligro'],
  tormenta_amarillo:   ['Evita espacios abiertos', 'Desconecta aparatos eléctricos'],
  tormenta_naranja:    ['No salgas', 'Aléjate de árboles y postes', 'Cierra ventanas'],
  tormenta_rojo:       ['EMERGENCIA - quédate en interior', 'Llama al 112', 'No toques objetos metálicos'],
  viento_amarillo:     ['Asegura objetos en balcones', 'Precaución en carretera'],
  viento_naranja:      ['Evita zonas arboladas', 'No uses paraguas', 'Aparca lejos de árboles'],
  viento_rojo:         ['NO SALGAS', 'Aléjate de ventanas', 'Busca interior sólido'],
  calor_amarillo:      ['Bebe agua frecuentemente', 'Evita sol entre 12-17h'],
  calor_naranja:       ['Quédate en zonas frescas', 'Vigila a mayores y niños', 'Ropa ligera y clara'],
  calor_rojo:          ['RIESGO VITAL', 'Llama al 112 si hay síntomas', 'No salgas bajo ningún concepto'],
  frio_amarillo:       ['Abrígate bien', 'Precaución en carreteras por hielo'],
  frio_naranja:        ['Evita salir de madrugada', 'Calienta el coche antes de conducir'],
  frio_rojo:           ['Riesgo de hipotermia', 'No salgas', 'Llama al 112 si alguien está en la calle'],
  niebla_amarillo:     ['Reduce velocidad', 'Usa luces antiniebla'],
  niebla_naranja:      ['Evita conducir', 'Visibilidad muy reducida'],
  niebla_rojo:         ['NO CONDUZCAS', 'Visibilidad casi nula', 'Quédate en interior'],
  inundacion_amarillo: ['Evita zonas bajas', 'No aparques en ramblas'],
  inundacion_naranja:  ['Aléjate de cauces', 'Ten lista bolsa de emergencia'],
  inundacion_rojo:     ['EVACUACIÓN POSIBLE', 'Sigue instrucciones de autoridades', 'Llama al 112'],
  incendio_amarillo:   ['No hagas fuego al aire libre', 'Vigila humos'],
  incendio_naranja:    ['Prepárate para evacuar', 'Cierra ventanas', 'Moja tejados si puedes'],
  incendio_rojo:       ['EVACUA AHORA', 'Llama al 112', 'No vuelvas a por pertenencias'],
  nieve_amarillo:      ['Cadenas o neumáticos de invierno', 'Abrígate en exteriores'],
  nieve_naranja:       ['Evita desplazamientos', 'Reserva calefacción y comida'],
  nieve_rojo:          ['NO SALGAS', 'Carreteras cortadas posibles', '112 para emergencias'],
}

// ─── 2-Step Alert Modal ───────────────────────────────────────────────────────
function AlertModal({ onConfirm, onCancel, isLoading }) {
  const [step, setStep] = useState(1)
  const [cause, setCause] = useState(null)
  const [severity, setSeverity] = useState(null)

  const causeObj  = CAUSES.find(c => c.key === cause)
  const actions   = cause && severity ? (ALERT_ACTIONS[`${cause}_${severity}`] ?? []) : []
  const title     = causeObj && severity
    ? `${causeObj.emoji} Alerta ${SEVERITY_LABEL[severity]} — ${causeObj.label}`
    : ''
  const canEmit   = !!(cause && severity)

  const handleEmit = () => {
    if (!canEmit || isLoading) return
    onConfirm({ cause, severity, actions, title, color: SEVERITY_COLOR[severity] })
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={!isLoading ? onCancel : undefined}
      />
      <motion.div
        className="relative z-10 bg-gradient-to-br from-red-950 to-black border-2 border-red-500/60 rounded-2xl p-6 max-w-lg w-full shadow-2xl shadow-red-900/50 max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 30 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-black text-xl uppercase tracking-wide">
            {step === 1 ? '1 — Causa del Alerta' : '2 — Nivel de Severidad'}
          </h2>
          <span className="text-white/30 text-xs font-mono">{step}/2</span>
        </div>

        {/* ── STEP 1: Cause grid ── */}
        {step === 1 && (
          <>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {CAUSES.map(c => (
                <button
                  key={c.key}
                  onClick={() => setCause(c.key)}
                  className={`
                    flex flex-col items-center gap-2 rounded-xl p-4 text-center
                    border transition-all duration-150
                    ${cause === c.key
                      ? 'border-red-400 bg-red-500/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/15'}
                  `}
                >
                  <span className="text-2xl leading-none">{c.emoji}</span>
                  <span className="text-white/80 text-[11px] leading-tight font-medium">{c.label}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 py-3 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 text-slate-300 rounded-xl font-semibold transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!cause}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 border border-red-400 text-white rounded-xl font-black tracking-wide transition-all disabled:opacity-40"
              >
                Siguiente →
              </button>
            </div>
          </>
        )}

        {/* ── STEP 2: Severity + Actions ── */}
        {step === 2 && (
          <>
            <div className="flex gap-3 mb-5">
              {SEVERITIES.map(s => {
                const isSelected = severity === s.key
                return (
                  <button
                    key={s.key}
                    onClick={() => setSeverity(s.key)}
                    className={`
                      flex-1 flex flex-col items-center gap-1 py-4 rounded-xl border-2 transition-all duration-150
                      ${isSelected
                        ? `${s.selBorder} ${s.selBg} shadow-lg ${s.glow}`
                        : 'border-white/10 bg-white/5 hover:bg-white/10'}
                    `}
                  >
                    <span className={`font-black text-sm ${isSelected ? s.selText : 'text-white/60'}`}>
                      {s.label}
                    </span>
                    <span className="text-white/40 text-[10px]">{s.sub}</span>
                  </button>
                )
              })}
            </div>

            {/* Actions preview */}
            {actions.length > 0 && (
              <div className="mb-5 bg-black/40 border border-white/8 rounded-xl p-4">
                <p className="text-white/40 text-[10px] uppercase tracking-wider mb-2">Acciones recomendadas</p>
                <ul className="space-y-1.5">
                  {actions.map((a, i) => (
                    <li key={i} className="text-white/80 text-xs flex gap-2 items-start">
                      <span className="text-white/30 shrink-0 font-mono">{i + 1}.</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 text-slate-300 rounded-xl font-semibold transition-all"
              >
                ← Atrás
              </button>
              <motion.button
                onClick={handleEmit}
                disabled={!canEmit || isLoading}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 border border-red-400 text-white rounded-xl font-black tracking-wide transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                whileTap={{ scale: 0.97 }}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                    />
                    Enviando…
                  </>
                ) : '🚨 EMITIR ALERTA'}
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}

// ─── Result Modal ─────────────────────────────────────────────────────────────
function ResultModal({ result, onClose }) {
  const totalRecipients = result.recipients ?? 0
  const connectedRecipients = result.connected_recipients ?? totalRecipients

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative z-10 bg-gradient-to-br from-slate-900 to-black border border-green-500/50 rounded-2xl p-8 max-w-lg w-full shadow-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-500/20 border border-green-500/40 rounded-full flex items-center justify-center">
            <Radio className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-green-300 font-bold">Alerta Emitida</h3>
            <p className="text-slate-400 text-xs">
              Enviada a {totalRecipients} usuario{totalRecipients !== 1 ? 's' : ''} · {connectedRecipients} conectado{connectedRecipients !== 1 ? 's' : ''} en tiempo real
              {' '}· ID #{result.broadcast_id}
            </p>
          </div>
        </div>
        <div className="bg-black/40 rounded-xl p-4 border border-white/5">
          <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Alerta emitida</p>
          <p className="text-slate-200 text-sm leading-relaxed">{result.message}</p>
        </div>
        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 text-white rounded-xl font-semibold transition-all"
        >
          Cerrar
        </button>
      </motion.div>
    </motion.div>
  )
}

// ─── THE RED BUTTON ───────────────────────────────────────────────────────────
export default function RedButton({ adminPassword }) {
  const [phase, setPhase] = useState('idle') // idle | select | loading | result | error
  const [result, setResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [clicked, setClicked] = useState(false)

  const handleButtonClick = () => {
    setClicked(true)
    setTimeout(() => setClicked(false), 400)
    setPhase('select')
  }

  const handleConfirm = async ({ cause, severity, actions, title, color }) => {
    setPhase('loading')
    try {
      const { data } = await api.post('/api/admin/emergency-broadcast', {
        password: adminPassword,
        cause,
        severity,
        actions,
        title,
        color,
      })
      setResult(data)
      setPhase('result')
    } catch (err) {
      setErrorMsg(err.response?.data?.detail ?? 'Error al emitir. Revisa la conexión con la API.')
      setPhase('error')
    }
  }

  const handleCancel = () => setPhase('idle')
  const handleClose  = () => { setPhase('idle'); setResult(null); setErrorMsg('') }

  return (
    <>
      {/* ─── THE BUTTON ─── */}
      <div className="flex flex-col items-center gap-6 py-6">
        <div className="text-center">
          <h2 className="text-white font-black text-2xl mb-1 uppercase tracking-wider">
            Alerta de Emergencia
          </h2>
          <p className="text-slate-400 text-sm max-w-xs mx-auto">
            Selecciona causa y severidad · alerta global para todos los usuarios
          </p>
        </div>

        {/* Outer glow ring */}
        <div className="relative">
          <motion.div
            className="absolute inset-[-20px] rounded-full"
            animate={{
              boxShadow: [
                '0 0 20px 5px rgba(239,68,68,0.2)',
                '0 0 50px 15px rgba(239,68,68,0.5)',
                '0 0 20px 5px rgba(239,68,68,0.2)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute inset-[-10px] rounded-full border border-red-500/30"
            animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          <motion.button
            onClick={handleButtonClick}
            className={`
              relative w-48 h-48 rounded-full font-black text-white uppercase tracking-widest text-base
              bg-gradient-to-br from-red-500 via-red-600 to-red-800
              border-4 border-red-400/60
              flex flex-col items-center justify-center gap-2
              select-none outline-none
              transition-shadow duration-200
              animate-pulse-glow
              ${clicked ? 'animate-shake' : ''}
            `}
            style={{
              boxShadow: '0 0 30px 8px rgba(239,68,68,0.5), inset 0 -4px 8px rgba(0,0,0,0.4), inset 0 4px 8px rgba(255,255,255,0.1)',
            }}
            whileHover={{
              scale: 1.04,
              boxShadow: '0 0 60px 20px rgba(239,68,68,0.7), inset 0 -4px 8px rgba(0,0,0,0.4)',
            }}
            whileTap={{
              scale: 0.94,
              boxShadow: '0 0 15px 4px rgba(239,68,68,0.4), inset 0 4px 12px rgba(0,0,0,0.6)',
            }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
            <AlertTriangle className="w-10 h-10 mb-1 drop-shadow-lg" />
            <span className="text-sm leading-tight text-center drop-shadow-md">EMERGENCIA</span>
            <span className="text-xs opacity-80">ALERTA</span>
          </motion.button>
        </div>

        {/* Status badge */}
        <motion.div
          className="flex items-center gap-2 px-4 py-2 bg-red-950/50 border border-red-800/50 rounded-full"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-2 h-2 bg-red-500 rounded-full" />
          <span className="text-red-400 text-xs font-semibold uppercase tracking-wider">
            Sistema Activo
          </span>
        </motion.div>
      </div>

      {/* ─── MODALS ─── */}
      <AnimatePresence>
        {(phase === 'select' || phase === 'loading') && (
          <AlertModal
            key="alert"
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            isLoading={phase === 'loading'}
          />
        )}
        {phase === 'result' && result && (
          <ResultModal key="result" result={result} onClose={handleClose} />
        )}
        {phase === 'error' && (
          <motion.div
            key="error"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60" onClick={handleClose} />
            <motion.div
              className="relative z-10 glass rounded-2xl p-6 max-w-sm w-full border border-red-500/40"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <p className="text-red-400 font-semibold mb-2">Error en la Emisión</p>
              <p className="text-slate-300 text-sm mb-4">{errorMsg}</p>
              <button onClick={handleClose} className="btn-ghost w-full">Cerrar</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
