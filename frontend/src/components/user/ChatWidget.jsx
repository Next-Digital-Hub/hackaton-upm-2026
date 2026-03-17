import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, Send, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import api from '../../services/api'

const AVATAR_META = {
  tired:     { icon: '😴', label: 'Tired' },
  energized: { icon: '⚡', label: 'Energized' },
  sick:      { icon: '🤒', label: 'Sick' },
  athletic:  { icon: '🏃', label: 'Athletic' },
  important: { icon: '💼', label: 'Important Day' },
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

// ─── Single message bubble ────────────────────────────────────────────────────
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
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-sm'
            : 'bg-slate-700/80 text-slate-100 rounded-bl-sm'
        }`}
      >
        <pre className="whitespace-pre-wrap font-sans">{msg.text}</pre>
      </div>
    </motion.div>
  )
}

// ─── ChatWidget ───────────────────────────────────────────────────────────────
export default function ChatWidget({ avatarState = 'energized' }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  const meta = AVATAR_META[avatarState] ?? AVATAR_META.energized

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Focus input when panel opens
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
      const { data } = await api.post('/api/chat/', {
        user_prompt: text,
        avatar_state: avatarState,
      })
      setMessages((prev) => [...prev, { role: 'ai', text: data.response }])
    } catch (err) {
      const detail = err.response?.data?.detail ?? 'Error reaching AI. Please try again.'
      setMessages((prev) => [...prev, { role: 'ai', text: `⚠️ ${detail}` }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {/* ─── Chat Panel ─── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="w-80 sm:w-96 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ height: '480px' }}
            initial={{ opacity: 0, scale: 0.9, y: 20, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-800/80 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xl">{meta.icon}</span>
                <div>
                  <p className="text-white font-semibold text-sm leading-none">WeatherSelf Chat</p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Mode: <span className="text-blue-400 font-medium">{meta.label}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
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
                  <p className="text-slate-400 text-sm">
                    Ask me anything about the weather!
                  </p>
                  <p className="text-slate-500 text-xs">
                    I'll answer as your{' '}
                    <span className="text-slate-400">{meta.label}</span> advisor
                  </p>
                </motion.div>
              )}

              {messages.map((msg, i) => (
                <Bubble key={i} msg={msg} />
              ))}

              {loading && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-slate-700/80 rounded-2xl rounded-bl-sm">
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
                  placeholder="Ask about the weather…"
                  rows={1}
                  className="flex-1 bg-slate-800 border border-slate-700 focus:border-blue-500
                             focus:ring-1 focus:ring-blue-500/30 text-white placeholder-slate-500
                             rounded-xl px-3 py-2.5 text-sm outline-none resize-none
                             transition-all duration-200 max-h-24 overflow-y-auto"
                  style={{ lineHeight: '1.5' }}
                  disabled={loading}
                />
                <motion.button
                  onClick={send}
                  disabled={!input.trim() || loading}
                  className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500
                             text-white p-2.5 rounded-xl transition-colors shrink-0"
                  whileTap={{ scale: 0.9 }}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
              <p className="text-slate-600 text-xs mt-1.5 text-center">
                Enter to send · Shift+Enter for new line
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── FAB Button ─── */}
      <motion.button
        onClick={() => setOpen((p) => !p)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center
                    transition-colors duration-200
                    ${open ? 'bg-slate-700 hover:bg-slate-600' : 'bg-blue-600 hover:bg-blue-500'}`}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        animate={!open ? { boxShadow: ['0 0 0 0 rgba(59,130,246,0.4)', '0 0 0 12px rgba(59,130,246,0)', '0 0 0 0 rgba(59,130,246,0)'] } : {}}
        transition={!open ? { duration: 2.5, repeat: Infinity } : {}}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-6 h-6 text-white" />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
