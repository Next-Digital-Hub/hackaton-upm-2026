import { useEffect, useMemo, useState } from 'react'
import api from '../../services/api'
import { COND_EMOJI, getCondition } from '../../utils/weather'

// ─── Constants ────────────────────────────────────────────────────────────────
const WEEKDAY_LETTERS = ['D', 'L', 'M', 'X', 'J', 'V', 'S']
const MONTH_SHORT = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

// ─── Helpers ──────────────────────────────────────────────────────────────────
function toDateKey(iso) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function tempColor(t) {
  if (t == null) return 'bg-white/10'
  if (t >= 25)   return 'bg-orange-400'
  if (t >= 15)   return 'bg-green-400'
  if (t >= 5)    return 'bg-blue-400'
  return 'bg-slate-400'
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────
function NodeTooltip({ node }) {
  const cond = getCondition(node.description ?? '')
  const emoji = COND_EMOJI[cond] ?? '🌤️'

  return (
    <div className="bg-gray-900 border border-white/10 rounded-xl p-3 text-xs shadow-xl whitespace-nowrap">
      <p className="text-white/80 font-medium capitalize mb-1">{node.tooltipDate}</p>
      {node.description && (
        <p className="text-white/50 mb-1.5 flex items-center gap-1">
          <span>{emoji}</span>
          <span className="truncate max-w-[100px]">{node.description}</span>
        </p>
      )}
      {node.temp != null && (
        <p className="text-white/70">
          Max: <span className="text-white font-semibold">{node.temp}°C</span>
        </p>
      )}
      {node.humidity != null && (
        <p className="text-white/50">Humedad: {node.humidity}%</p>
      )}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function WeekTimeline() {
  const [records, setRecords] = useState([])

  useEffect(() => {
    api.get('/api/weather/history?limit=50')
      .then(({ data }) => setRecords(data))
      .catch(() => {})
  }, [])

  const todayKey = toDateKey(new Date().toISOString())

  const nodes = useMemo(() => {
    // Group by day, keep most recent record per day
    const byDay = {}
    records.forEach(r => {
      const key = toDateKey(r.created_at)
      if (!byDay[key] || new Date(r.created_at) > new Date(byDay[key].created_at)) {
        byDay[key] = r
      }
    })

    const days = Object.entries(byDay)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .slice(-7)
      .map(([key, r]) => {
        const d = new Date(r.created_at)
        return {
          key,
          dayLetter:   WEEKDAY_LETTERS[d.getDay()],
          tooltipDate: `${d.toLocaleDateString('es-ES', { weekday: 'long' })} ${d.getDate()} ${MONTH_SHORT[d.getMonth()]}`,
          temp:        r.temperature != null ? Math.round(r.temperature) : null,
          humidity:    r.humidity    != null ? Math.round(r.humidity)    : null,
          description: r.description ?? '',
          isToday:     key === todayKey,
          empty:       false,
        }
      })

    // Pad front with empty nodes up to 7
    const pad = Math.max(0, 7 - days.length)
    const empties = Array.from({ length: pad }, (_, i) => ({ key: `empty-${i}`, empty: true }))
    return [...empties, ...days]
  }, [records, todayKey])

  return (
    <div className="w-full">
      <p className="text-[10px] uppercase tracking-widest text-white/25 font-semibold mb-3">
        Historial reciente
      </p>

      {/* Temp labels (above circles) */}
      <div className="flex justify-between mb-1 px-1.5">
        {nodes.map((n) => (
          <div key={n.key} className="flex-1 flex justify-center">
            <span className="text-xs text-white/60">
              {!n.empty && n.temp != null ? `${n.temp}°` : ''}
            </span>
          </div>
        ))}
      </div>

      {/* Circles + connecting line */}
      <div className="relative flex justify-between items-center px-1.5 mb-1">
        {/* Line behind circles */}
        <div className="absolute top-1/2 left-4 right-4 h-px bg-white/10 -translate-y-1/2 pointer-events-none" />

        {nodes.map((n) => {
          const circleSize = !n.empty && n.isToday ? 'w-4 h-4' : 'w-3 h-3'
          const circleColor = n.empty ? 'bg-white/10' : tempColor(n.temp)
          const ring = !n.empty && n.isToday ? 'ring-2 ring-white/40' : ''

          return (
            <div key={n.key} className="flex-1 flex justify-center relative group/node z-10">
              <div className={`rounded-full relative z-10 ${circleSize} ${circleColor} ${ring}`} />

              {/* Tooltip — only for nodes with data */}
              {!n.empty && (
                <div
                  className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50
                             opacity-0 group-hover/node:opacity-100 transition-opacity duration-150"
                >
                  <NodeTooltip node={n} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Day letters (below circles) */}
      <div className="flex justify-between px-1.5">
        {nodes.map((n) => (
          <div key={n.key} className="flex-1 flex justify-center">
            <span className={`text-xs ${!n.empty && n.isToday ? 'text-white/70 font-semibold' : 'text-white/40'}`}>
              {n.dayLetter ?? ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
