import { AnimatePresence, motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import api from '../../services/api'

// Shared markdown renderer (same spec as ChatWidget / WeatherCard)
const MD = {
  h2:     ({ children }) => <h2 className="text-sm font-bold text-white mt-3 mb-1">{children}</h2>,
  h3:     ({ children }) => <h3 className="text-sm font-semibold text-blue-300 mt-2 mb-0.5">{children}</h3>,
  strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
  em:     ({ children }) => <em className="text-white/70 italic">{children}</em>,
  p:      ({ children }) => <p className="text-slate-100 leading-relaxed mb-1.5 last:mb-0">{children}</p>,
  hr:     ()             => <hr className="border-white/10 my-2" />,
  ul:     ({ children }) => <ul className="list-none space-y-0.5 mb-1.5">{children}</ul>,
  ol:     ({ children }) => <ol className="list-none space-y-0.5 mb-1.5">{children}</ol>,
  li:     ({ children }) => (
    <li className="text-slate-100 flex gap-1.5 items-start text-sm">
      <span className="text-blue-400 shrink-0 mt-0.5">→</span><span>{children}</span>
    </li>
  ),
  code:   ({ children }) => <code className="bg-white/10 text-blue-300 text-xs px-1 py-0.5 rounded font-mono">{children}</code>,
}

// fires the chat API and appends messages — extracted so autoSend can call it too
async function callChat(text, avatarState, setMessages, setLoading, setExpanded) {
  setExpanded(true)
  setMessages((prev) => [...prev, { role: 'user', text, ts: Date.now() }])
  setLoading(true)
  try {
    const { data } = await api.post('/api/chat/', { user_prompt: text, avatar_state: avatarState })
    setMessages((prev) => [...prev, { role: 'ai', text: data.response, ts: Date.now() }])
  } catch (err) {
    const detail = err.response?.data?.detail ?? 'Error al contactar la IA. Intenta de nuevo.'
    setMessages((prev) => [...prev, { role: 'ai', text: `⚠️ ${detail}`, ts: Date.now() }])
  } finally {
    setLoading(false)
  }
}

// ─── Avatar config with glow colours ─────────────────────────────────────────
const AVATAR_META = {
  tired:     { icon: '😴', label: 'tired',     pill: 'bg-blue-500/20 text-blue-300 border-blue-500/30',   glow: 'rgba(59,130,246,0.35)',  dot: '#3b82f6' },
  energized: { icon: '⚡', label: 'energized', pill: 'bg-green-500/20 text-green-300 border-green-500/30', glow: 'rgba(34,197,94,0.35)',   dot: '#22c55e' },
  sick:      { icon: '🤒', label: 'sick',       pill: 'bg-amber-500/20 text-amber-300 border-amber-500/30', glow: 'rgba(245,158,11,0.35)',  dot: '#f59e0b' },
  athletic:  { icon: '🏃', label: 'athletic',  pill: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',    glow: 'rgba(6,182,212,0.35)',   dot: '#06b6d4' },
  important: { icon: '💼', label: 'important', pill: 'bg-purple-500/20 text-purple-300 border-purple-500/30', glow: 'rgba(168,85,247,0.35)', dot: '#a855f7' },
}

// ─── Simple markdown → JSX (no extra dep) ────────────────────────────────────
const WEATHER_RE = /(-?\d+(?:\.\d+)?(?:°C|°F|mm|%|km\/h|hPa|m\/s|mph|UV\s*\d+)?)/g

function renderText(text) {
  // Split on **bold** and *italic* markers, then highlight weather numbers
  const parts = []
  const mdRe = /(\*\*(.+?)\*\*|\*(.+?)\*)/g
  let last = 0, m

  while ((m = mdRe.exec(text)) !== null) {
    if (m.index > last) parts.push({ type: 'plain', text: text.slice(last, m.index) })
    if (m[0].startsWith('**')) parts.push({ type: 'bold', text: m[2] })
    else                       parts.push({ type: 'italic', text: m[3] })
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push({ type: 'plain', text: text.slice(last) })

  return parts.map((p, i) => {
    const content = highlightNumbers(p.text, i)
    if (p.type === 'bold')   return <strong key={i} className="font-semibold text-white">{content}</strong>
    if (p.type === 'italic') return <em key={i} className="italic text-white/80">{content}</em>
    return <span key={i}>{content}</span>
  })
}

function highlightNumbers(text, keyPrefix) {
  const segments = text.split(WEATHER_RE)
  return segments.map((seg, i) =>
    WEATHER_RE.test(seg)
      ? <span key={`${keyPrefix}-n${i}`} className="text-blue-300 font-semibold">{seg}</span>
      : seg
  )
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingDots({ dotColor }) {
  return (
    <div className="flex items-center gap-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: dotColor }}
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  )
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function Bubble({ msg, meta }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-2`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {/* AI avatar circle */}
      {!isUser && (
        <div
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm
                     bg-white/10 border border-white/15 mt-0.5"
        >
          {meta.icon}
        </div>
      )}

      <div className="flex flex-col gap-1 max-w-[75%]">
        <div
          className={
            isUser
              ? 'bg-gradient-to-br from-blue-600 to-purple-700 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm leading-relaxed shadow-lg shadow-blue-900/30'
              : 'bg-white/5 border border-white/10 backdrop-blur-sm text-slate-100 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed'
          }
        >
          {isUser
            ? <span className="whitespace-pre-wrap">{msg.text}</span>
            : <ReactMarkdown components={MD}>{msg.text}</ReactMarkdown>
          }
        </div>
        <span className={`text-xs text-white/30 ${isUser ? 'text-right' : 'text-left'} px-1`}>
          {formatTime(msg.ts)}
        </span>
      </div>
    </motion.div>
  )
}

// ─── ChatBar ──────────────────────────────────────────────────────────────────
export default function ChatBar({ avatarState = 'energized', autoSend = null }) {
  const [messages, setMessages] = useState([])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [expanded, setExpanded] = useState(false)
  const inputRef   = useRef(null)
  const historyRef = useRef(null)

  const meta = AVATAR_META[avatarState] ?? AVATAR_META.energized

  // Auto-send when parent passes a new { text, id } trigger
  useEffect(() => {
    if (!autoSend?.text) return
    callChat(autoSend.text, avatarState, setMessages, setLoading, setExpanded)
  }, [autoSend?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight
    }
  }, [messages, loading])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    callChat(text, avatarState, setMessages, setLoading, setExpanded)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none">

      {/* ── History panel ── */}
      <AnimatePresence>
        {expanded && messages.length > 0 && (
          <motion.div
            className="max-w-4xl mx-auto px-4 pointer-events-auto"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          >
            <div
              ref={historyRef}
              className="backdrop-blur-md bg-slate-950/80 border border-white/10 border-b-0
                         rounded-t-2xl px-4 py-4 space-y-4 overflow-y-auto"
              style={{ maxHeight: '42vh' }}
            >
              {messages.map((msg, i) => (
                <Bubble key={i} msg={msg} meta={meta} />
              ))}

              {loading && (
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm bg-white/10 border border-white/15 shrink-0">
                    {meta.icon}
                  </div>
                  <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl rounded-tl-sm px-4 py-2.5">
                    <TypingDots dotColor={meta.dot} />
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Input bar ── */}
      <div className="max-w-4xl mx-auto px-4 mb-4 pointer-events-auto">
        {/* Animated glow border wrapper */}
        <motion.div
          className="rounded-2xl p-[1px]"
          animate={{
            boxShadow: [
              `0 0 0px 0px ${meta.glow}`,
              `0 0 18px 4px ${meta.glow}`,
              `0 0 0px 0px ${meta.glow}`,
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: `linear-gradient(135deg, ${meta.dot}33, transparent 60%)` }}
        >
          <div
            className="rounded-2xl backdrop-blur-md bg-white/5 border border-white/10
                       shadow-lg shadow-black/30 px-4 py-3"
          >
            <div className="flex items-center gap-3">

              {/* Mode pill */}
              <div className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${meta.pill}`}>
                <span>{meta.icon}</span>
                <span className="hidden sm:inline">modo {meta.label}</span>
              </div>

              {/* Input */}
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Pregúntame sobre el tiempo, qué llevar puesto, si salir hoy…"
                disabled={loading}
                className="flex-1 bg-transparent border-none outline-none text-white text-sm
                           placeholder:text-white/30 disabled:opacity-50"
              />

              {/* Send */}
              <motion.button
                onClick={send}
                disabled={!input.trim() || loading}
                className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center
                           bg-gradient-to-br from-blue-500 to-purple-600
                           disabled:from-white/10 disabled:to-white/10 disabled:text-white/30
                           text-white shadow-md shadow-blue-900/40 transition-all duration-200"
                whileHover={input.trim() && !loading ? { scale: 1.1 } : {}}
                whileTap={input.trim() && !loading ? { scale: 0.9 } : {}}
              >
                <Send className="w-3.5 h-3.5" />
              </motion.button>
            </div>

            <p className="text-white/20 text-xs mt-2 text-center tracking-wide">
              IA meteorológica · Enter para enviar
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
