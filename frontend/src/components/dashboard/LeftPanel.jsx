import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import AvatarSelector from '../user/AvatarSelector'

const PHYSICAL_LABELS = {
  energized: '⚡ Energizado', normal: '😐 Normal', tired: '😴 Cansado', sick: '🤒 Enfermo',
}
const PROFILE_PILL = {
  energized: 'bg-green-500/20 text-green-300 border-green-500/30',
  tired:     'bg-blue-500/20  text-blue-300  border-blue-500/30',
  sick:      'bg-amber-500/20 text-amber-300 border-amber-500/30',
  normal:    'bg-slate-500/20 text-slate-300 border-slate-500/30',
}

export default function LeftPanel({ user, profile, onSelect, onReset }) {
  const initial = user?.username?.[0]?.toUpperCase() ?? '?'
  const pillClass = profile ? (PROFILE_PILL[profile.physical] ?? PROFILE_PILL.normal) : ''

  return (
    <div className="flex flex-col h-full rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm overflow-hidden">

      {/* ── User info strip ── */}
      <div className="shrink-0 px-4 py-3 border-b border-white/8 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">{initial}</span>
        </div>
        <div className="min-w-0">
          <p className="text-white font-semibold text-sm leading-none truncate">{user?.username}</p>
          {profile ? (
            <motion.span
              className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full border ${pillClass}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {profile.avatarName}
            </motion.span>
          ) : (
            <p className="text-white/30 text-xs mt-0.5">Completa el test</p>
          )}
        </div>
      </div>

      {/* ── Questionnaire — scrollable ── */}
      <div
        className="flex-1 overflow-y-auto p-4"
        style={{ scrollbarWidth: 'none' }}
      >
        <AvatarSelector onSelect={onSelect} />
      </div>

      {/* ── Reset button (only after questionnaire done) ── */}
      {profile && (
        <motion.div
          className="shrink-0 px-4 py-3 border-t border-white/8"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl
                       border border-white/15 text-white/50 hover:text-white/80
                       hover:border-white/30 text-sm transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Cambiar estado
          </button>
        </motion.div>
      )}
    </div>
  )
}
