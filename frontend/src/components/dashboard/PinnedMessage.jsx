import { Pin, X } from 'lucide-react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'

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

export default function PinnedMessage({ text, onClear }) {
  if (!text) return null

  return (
    <motion.div
      className="shrink-0 mx-3 mt-3 rounded-xl border border-amber-500/20 bg-amber-500/5 overflow-hidden"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.22 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
        <div className="flex items-center gap-1.5">
          <Pin size={11} className="text-amber-400" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-400/80">
            Mensaje fijado
          </span>
        </div>
        <button
          onClick={onClear}
          className="text-white/25 hover:text-white/60 transition-colors"
          title="Limpiar"
        >
          <X size={13} />
        </button>
      </div>

      {/* Message in markdown format, scrollable if long */}
      <div
        className="px-3 pb-3 max-h-48 overflow-y-auto"
        style={{ scrollbarWidth: 'none' }}
      >
        <ReactMarkdown components={MD}>{text}</ReactMarkdown>
      </div>
    </motion.div>
  )
}
