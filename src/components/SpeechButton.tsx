'use client'

import { useState, useEffect } from 'react'

interface SpeechButtonProps {
  text: string
  color?: string
}

export default function SpeechButton({ text, color = 'var(--text-primary)' }: SpeechButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    setSupported('speechSynthesis' in window)
  }, [])

  const speak = () => {
    if (!supported) return

    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    // Clean text for better speech (remove emojis, etc)
    const cleanText = text.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim()
    
    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = 'es-ES'
    utterance.rate = 0.85 // Slightly slower for better comprehension
    utterance.pitch = 1.1 // Slightly higher for better clarity/definition

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onerror = () => setIsSpeaking(false)
    
    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  if (!supported) return null

  return (
    <button
      onClick={speak}
      title={isSpeaking ? "Detener lectura" : "Leer en voz alta"}
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        border: `1px solid ${isSpeaking ? 'var(--accent-color)' : 'rgba(255, 255, 255, 0.2)'}`,
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        color: isSpeaking ? 'var(--accent-color)' : color,
        transition: 'all 0.2s ease',
        marginLeft: '12px',
        padding: 0,
        boxShadow: isSpeaking ? '0 0 10px var(--accent-glow)' : 'none'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)'
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
      }}
    >
      {isSpeaking ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
        </svg>
      )}
    </button>
  )
}
