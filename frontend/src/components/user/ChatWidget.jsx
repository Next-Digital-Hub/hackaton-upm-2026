import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, Send, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import api from '../../services/api'

const AVATAR_META = {
  tired:     { icon: '😴', label: 'Tired' },
  energized: { icon: '⚡', label: 'Energized' },
  sick:      { icon: '🤒', label: 'Sick' },
  athletic:  { icon: '🏃', label: 'Athletic' },
  important: { icon: '💼', label: 'Important Day' },
}

// ─── Shared markdown renderer for AI bubbles ──────────────────────────────────
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
      <span className="text-blue-400 shrink-0 mt-0.5">→</span>
      <span>{children}</span>
    </li>
  ),
  code:   ({ children }) => (
    <code className="bg-white/10 text-blue-300 text-xs px-1 py-0.5 rounded font-mono">{children}</code>
  ),
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-slate-400 rounded-full"
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  )
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function Bubble({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm ${
          isUser
            ? 'bg-gradient-to-br from-blue-600 to-purple-700 text-white rounded-tr-sm'
            : 'bg-white/5 border border-white/10 backdrop-blur-sm text-slate-100 rounded-tl-sm'
        }`}
      >
        {isUser
          ? <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
          : <ReactMarkdown components={MD}>{msg.text}</ReactMarkdown>
        }
      </div>
    </motion.div>
  )
}

// ─── ChatWidget (FAB) ─────────────────────────────────────────────────────────
export default function ChatWidget({ avatarState = 'energized' }) {
  const [open, setOpen]       = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  // Resolve compound keys (e.g. "tired_focused_indoors") → meta
  const metaKey = Object.keys(AVATAR_META).find((k) => avatarState.startsWith(k)) ?? 'energized'
  const meta    = AVATAR_META[metaKey]

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200)
  }, [open])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text }])
    setLoading(true)
    try {
      const { data } = await api.post('/api/chat/', { user_prompt: text, avatar_state: avatarState })
      setMessages((prev) => [...prev, { role: 'ai', text: data.response }])
    } catch (err) {
      const detail = err.response?.data?.detail ?? 'Error reaching AI. Please try again.'
      setMessages((prev) => [...prev, { role: 'ai', text: `⚠️ ${detail}` }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="w-80 sm:w-96 bg-slate-900/95 backdrop-blur-md border border-white/10
                       rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ height: '480px' }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xl">{meta.icon}</span>
                <div>
                  <p className="text-white font-semibold text-sm leading-none">WeatherSelf Chat</p>
                  <p className="text-white/40 text-xs mt-0.5">
                    Modo: <span className="text-blue-400 font-medium">{meta.label}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/30 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.length === 0 && (
                <motion.div
                  className="flex flex-col items-center gap-2 text-center mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-4xl">{meta.icon}</span>
                  <p className="text-white/40 text-sm">Pregúntame lo que quieras sobre el tiempo</p>
                  <p className="text-white/25 text-xs">
                    Respondo como tu asesor{' '}
                    <span className="text-white/40">{meta.label}</span>
                  </p>
                </motion.div>
              )}

              {messages.map((msg, i) => <Bubble key={i} msg={msg} />)}

              {loading && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm">
                    <TypingDots />
                  </div>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-3 pb-3 pt-2 border-t border-white/10 shrink-0">
              <div className="flex gap-2 items-end">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Escribe tu pregunta…"
                  rows={1}
                  className="flex-1 bg-white/5 border border-white/10 focus:border-blue-500/60
                             focus:ring-1 focus:ring-blue-500/20 text-white placeholder-white/25
                             rounded-xl px-3 py-2.5 text-sm outline-none resize-none
                             transition-all duration-200 max-h-24 overflow-y-auto"
                  style={{ lineHeight: '1.5' }}
                  disabled={loading}
                />
                <motion.button
                  onClick={send}
                  disabled={!input.trim() || loading}
                  className="bg-gradient-to-br from-blue-500 to-purple-600
                             disabled:from-white/10 disabled:to-white/10 disabled:text-white/30
                             text-white p-2.5 rounded-xl transition-all shrink-0 shadow-lg shadow-blue-900/30"
                  whileTap={{ scale: 0.9 }}
                  whileHover={input.trim() && !loading ? { scale: 1.08 } : {}}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
              <p className="text-white/20 text-xs mt-1.5 text-center">Enter · Shift+Enter nueva línea</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        onClick={() => setOpen((p) => !p)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-colors
                    ${open
                      ? 'bg-slate-700 hover:bg-slate-600'
                      : 'bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500'
                    }`}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        animate={!open ? { boxShadow: ['0 0 0 0 rgba(99,102,241,0.4)', '0 0 0 12px rgba(99,102,241,0)', '0 0 0 0 rgba(99,102,241,0)'] } : {}}
        transition={!open ? { duration: 2.5, repeat: Infinity } : {}}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x"
              initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.span>
          ) : (
            <motion.span key="chat"
              initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
