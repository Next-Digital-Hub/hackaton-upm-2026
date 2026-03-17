'use client'

import { useEffect, useState } from 'react'

interface WeatherBackgroundProps {
  weather: any
}

export default function WeatherBackground({ weather }: WeatherBackgroundProps) {
  const [type, setType] = useState<'sunny' | 'rainy' | 'cloudy'>('cloudy')

  useEffect(() => {
    if (!weather) return
    
    const precStr = String(weather.prec || '0').toLowerCase()
    const precValue = parseFloat(precStr.replace(',', '.'))
    
    // "Ip" significa lluvia inapreciable pero lluvia al fin y al cabo.
    // Cualquier valor > 0 o la palabra "ip" activa el modo lluvia.
    if (precValue > 0 || precStr.includes('ip')) {
      setType('rainy')
    } else {
      setType('sunny')
    }
  }, [weather])

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100%', height: '100%',
      zIndex: -1,
      overflow: 'hidden',
      background: '#050510', // Deep base
      transition: 'background 2s ease'
    }}>
      {/* Dynamic Gradients */}
      <div style={{
        position: 'absolute',
        width: '100%', height: '100%',
        background: type === 'sunny' 
          ? 'radial-gradient(circle at 20% 20%, rgba(245, 158, 11, 0.15) 0%, transparent 50%)' 
          : type === 'rainy'
            ? 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle at 80% 20%, rgba(161, 161, 170, 0.05) 0%, transparent 40%)',
        transition: 'all 2s ease'
      }} />

      {/* RAIN EFFECT */}
      {type === 'rainy' && (
        <div className="rain-container">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="drop" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${0.5 + Math.random() * 0.5}s`
            }} />
          ))}
        </div>
      )}

      {/* SUN EFFECTS */}
      {type === 'sunny' && (
        <div className="sun-system">
          <div className="sun-glow" />
          <div className="sun-rays">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="ray" style={{ transform: `rotate(${i * 45}deg)` }} />
            ))}
          </div>
        </div>
      )}

      {/* CLOUDY MIST */}
      {type === 'cloudy' && (
        <div className="clouds">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="cloud" style={{
              top: `${20 + i * 15}%`,
              animationDuration: `${20 + Math.random() * 20}s`,
              animationDelay: `${-Math.random() * 20}s`,
              opacity: 0.1 + Math.random() * 0.1
            }} />
          ))}
        </div>
      )}

      <style jsx>{`
        .rain-container {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        .drop {
          position: absolute;
          top: -20px;
          width: 1px;
          height: 25px;
          background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.3));
          animation: fall linear infinite;
          will-change: transform;
        }
        @keyframes fall {
          from { transform: translateY(-20px) translateZ(0); }
          to { transform: translateY(110vh) translateZ(0); }
        }

        .sun-system {
          position: absolute;
          top: -100px;
          left: -100px;
          width: 600px;
          height: 600px;
          animation: breathe 8s ease-in-out infinite;
        }

        .sun-glow {
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%);
          filter: blur(40px);
          will-change: transform;
        }

        .sun-rays {
          position: absolute;
          width: 100%;
          height: 100%;
          animation: rotate-slow 40s linear infinite;
        }

        .ray {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 1000px;
          height: 2px;
          background: linear-gradient(to right, rgba(245, 158, 11, 0.1), transparent);
          transform-origin: left center;
        }

        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 1; }
        }

        .cloud {
          position: absolute;
          left: -400px;
          width: 500px;
          height: 150px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 100px;
          filter: blur(50px);
          animation: drift linear infinite;
          will-change: transform, left;
        }
        @keyframes drift {
          from { transform: translateX(0) translateZ(0); }
          to { transform: translateX(calc(100vw + 800px)) translateZ(0); }
        }

        @keyframes rotate-slow {
          from { transform: rotate(0deg) translateZ(0); }
          to { transform: rotate(360deg) translateZ(0); }
        }
      `}</style>
    </div>
  )
}
