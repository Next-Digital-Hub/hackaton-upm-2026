import { AnimatePresence, motion } from 'framer-motion'
import { Pin, Send } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import api from '../../services/api'
import { extractSuggestions } from '../../utils/weather'
import PinnedMessage from './PinnedMessage'

// ─── Shared markdown ──────────────────────────────────────────────────────────
const MD = {
  h2:     ({ children }) => <h2 className="text-xs font-bold text-white mt-3 mb-1">{children}</h2>,
  h3:     ({ children }) => <h3 className="text-[10px] font-semibold text-blue-300 mt-2 mb-0.5 uppercase tracking-wide">{children}</h3>,
  strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
  em:     ({ children }) => <em className="text-white/60 italic">{children}</em>,
  p:      ({ children }) => <p className="text-white/75 text-xs leading-relaxed mb-1.5 last:mb-0">{children}</p>,
  hr:     ()             => <hr className="border-white/10 my-2" />,
  ul:     ({ children }) => <ul className="list-none space-y-0.5 mb-1.5">{children}</ul>,
  ol:     ({ children }) => <ol className="list-none space-y-0.5 mb-1.5">{children}</ol>,
  li:     ({ children }) => (
    <li className="text-white/70 text-xs flex gap-1.5 items-start">
      <span className="text-blue-400 shrink-0 mt-0.5 text-[10px]">→</span>
      <span>{children}</span>
    </li>
  ),
  code: ({ children }) => (
    <code className="bg-white/10 text-blue-300 text-[10px] px-1 py-0.5 rounded font-mono">{children}</code>
  ),
}

// ─── Suggestion pill styles ───────────────────────────────────────────────────
const SUG_STYLE = {
  alert: 'bg-amber-500/15 border-amber-500/30 text-amber-200',
  tip:   'bg-blue-500/15  border-blue-500/30  text-blue-200',
  gear:  'bg-green-500/15 border-green-500/30 text-green-200',
  time:  'bg-purple-500/15 border-purple-500/30 text-purple-200',
}

// ─── Chat helpers ─────────────────────────────────────────────────────────────
async function callChat(text, avatarState, weatherMode, setMessages, setLoading) {
  setMessages(p => [...p, { role: 'user', text, ts: Date.now() }])
  setLoading(true)
  try {
    const body = { user_prompt: text, avatar_state: avatarState }
    if (weatherMode && weatherMode !== 'auto') body.weather_mode = weatherMode
    const { data } = await api.post('/api/chat/', body)
    const { cleanText } = extractSuggestions(data.response)
    setMessages(p => [...p, { role: 'ai', text: cleanText, ts: Date.now() }])
  } catch (err) {
    const detail = err.response?.data?.detail ?? 'Error al contactar la IA.'
    setMessages(p => [...p, { role: 'ai', text: `⚠️ ${detail}`, ts: Date.now() }])
  } finally {
    setLoading(false)
  }
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1 px-1">
      {[0, 1, 2].map(i => (
        <motion.div key={i}
          className="w-1.5 h-1.5 bg-blue-400 rounded-full"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
      ))}
    </div>
  )
}

// ─── Chat bubble ──────────────────────────────────────────────────────────────
function ChatBubble({ msg, onPin }) {
  const isUser   = msg.role === 'user'
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-1.5`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`relative max-w-[88%] rounded-xl px-3 py-2 text-xs ${
          isUser
            ? 'bg-gradient-to-br from-blue-600 to-purple-700 text-white rounded-tr-sm'
            : 'bg-white/8 border border-white/10 text-white/85 rounded-tl-sm'
        }`}
        onMouseEnter={() => !isUser && setHovered(true)}
        onMouseLeave={() => !isUser && setHovered(false)}
      >
        {/* Pin button — visible on hover for all AI bubbles */}
        {!isUser && onPin && (
          <motion.button
            onClick={() => onPin(msg.text)}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-700 border border-white/20
                       flex items-center justify-center text-white/50 hover:text-amber-300 hover:bg-slate-600
                       transition-colors shadow-lg z-10"
            animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.7 }}
            transition={{ duration: 0.15 }}
            title="Fijar mensaje"
          >
            <Pin className="w-2.5 h-2.5" />
          </motion.button>
        )}

        {isUser
          ? <p className="leading-relaxed">{msg.text}</p>
          : <ReactMarkdown components={MD}>{msg.text}</ReactMarkdown>
        }
        <p className="text-white/20 text-[9px] mt-0.5 text-right">{formatTime(msg.ts)}</p>
      </div>
    </motion.div>
  )
}

// ─── Suggestions pills (no pinned logic — handled by PinnedMessage) ───────────
function SuggestionsSection({ suggestions }) {
  if (!suggestions?.length) return null

  return (
    <div className="shrink-0 px-3 pt-2.5 pb-1.5 border-b border-white/8 max-h-24 overflow-hidden">
      <div className="flex flex-wrap gap-1 overflow-hidden" style={{ maxHeight: '3.2rem' }}>
        {suggestions.map((s, i) => (
          <span
            key={i}
            className={`flex items-center gap-1 border rounded-full px-2 py-0.5 text-[10px] font-medium ${SUG_STYLE[s.type] ?? SUG_STYLE.tip}`}
          >
            {s.icon && <span className="text-xs leading-none">{s.icon}</span>}
            {s.text}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Avatar config ────────────────────────────────────────────────────────────
const AVATAR_CFG = {
  tired:     { badge: 'bg-slate-500/25 text-slate-300' },
  energized: { badge: 'bg-blue-500/25  text-blue-300'  },
  sick:      { badge: 'bg-amber-500/25 text-amber-300' },
  athletic:  { badge: 'bg-orange-500/25 text-orange-300' },
  important: { badge: 'bg-purple-500/25 text-purple-300' },
}
function resolveAvatar(key = '') {
  return AVATAR_CFG[key] ?? Object.entries(AVATAR_CFG).find(([k]) => key.startsWith(k))?.[1] ?? AVATAR_CFG.energized
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function RightPanel({ weatherData, avatarState, autoSend, simulatedMode, emergency, onDismissEmergency }) {
  const [messages,    setMessages]    = useState([])
  const [input,       setInput]       = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [pinnedText,  setPinnedText]  = useState(null)
  const endRef   = useRef(null)
  const inputRef = useRef(null)

  const cfg = resolveAvatar(avatarState)

  // Auto-pin emergency message when broadcast arrives
  useEffect(() => {
    if (!emergency) return
    const text = `🚨 ${emergency.title}\n\n${emergency.actions.map((a, i) => `${i + 1}. ${a}`).join('\n')}`
    setPinnedText(text)
  }, [emergency])

  const handleEntendido = () => {
    setPinnedText(null)
    onDismissEmergency?.()
  }

  // Auto-suggestions from latest forecast
  const { suggestions } = useMemo(
    () => extractSuggestions(weatherData?.llm_response ?? ''),
    [weatherData?.llm_response]
  )

  // Auto-send triggered by questionnaire completion
  useEffect(() => {
    if (!autoSend?.text) return
    callChat(autoSend.text, avatarState, simulatedMode, setMessages, setChatLoading)
  }, [autoSend?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll to bottom on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, chatLoading])

  const send = () => {
    const text = input.trim()
    if (!text || chatLoading) return
    setInput('')
    callChat(text, avatarState, simulatedMode, setMessages, setChatLoading)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const handlePin = (msgText) => setPinnedText(msgText)

  return (
    <div className="flex flex-col h-full rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm overflow-hidden">

      {/* ── Header ── */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2 border-b border-white/8">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}>
          Chat IA
        </span>
        <span className="text-white/20 text-[10px]">WeatherSelf</span>
      </div>

      {/* ── Suggestion pills ── */}
      <SuggestionsSection suggestions={suggestions} />

      {/* ── Pinned message bar ── */}
      <AnimatePresence>
        {pinnedText && (
          emergency ? (
            <motion.div
              key="emergency-pin"
              className="mx-3 mt-3 rounded-xl p-3 border-2"
              style={{ borderColor: emergency.color, backgroundColor: `${emergency.color}18` }}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <div className="flex items-start gap-2">
                <span className="text-sm shrink-0 mt-0.5">🚨</span>
                <pre className="text-white/85 text-xs leading-snug flex-1 whitespace-pre-wrap font-sans">{pinnedText}</pre>
                <button
                  onClick={handleEntendido}
                  className="shrink-0 text-[10px] font-bold px-2 py-1 rounded-lg transition-colors whitespace-nowrap"
                  style={{ backgroundColor: `${emergency.color}30`, color: emergency.color }}
                >
                  ✓ Entendido
                </button>
              </div>
            </motion.div>
          ) : (
            <PinnedMessage key="pinned" text={pinnedText} onClear={() => setPinnedText(null)} />
          )
        )}
      </AnimatePresence>

      {/* ── Chat messages ── */}
      <div
        className="flex-1 overflow-y-auto px-3 py-2 space-y-2"
        style={{ scrollbarWidth: 'none' }}
      >
        <AnimatePresence initial={false}>
          {messages.length === 0 && (
            <motion.p
              className="text-white/20 text-xs text-center py-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              Pregúntame sobre el tiempo…
            </motion.p>
          )}
          {messages.map((msg, i) => (
            <ChatBubble
              key={i}
              msg={msg}
              onPin={msg.role === 'ai' && !pinnedText ? () => handlePin(msg.text) : null}
            />
          ))}
          {chatLoading && (
            <motion.div className="flex justify-start"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-white/8 border border-white/10 rounded-xl rounded-tl-sm">
                <TypingDots />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      {/* ── Input ── */}
      <div className="shrink-0 px-3 pb-3 pt-2 border-t border-white/8">
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Pregunta algo…"
            disabled={chatLoading}
            className="flex-1 bg-white/5 border border-white/10 focus:border-blue-500/50
                       focus:ring-1 focus:ring-blue-500/20 text-white text-xs
                       placeholder-white/25 rounded-xl px-3 py-2 outline-none
                       transition-all disabled:opacity-40"
          />
          <motion.button
            onClick={send}
            disabled={!input.trim() || chatLoading}
            className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center
                       bg-gradient-to-br from-blue-500 to-purple-600
                       disabled:from-white/10 disabled:to-white/10 disabled:text-white/25
                       text-white shadow-md transition-all"
            whileHover={input.trim() && !chatLoading ? { scale: 1.1 } : {}}
            whileTap={input.trim() && !chatLoading ? { scale: 0.9 } : {}}
          >
            <Send className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
