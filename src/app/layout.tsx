import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SafeClima | Emergencias Climáticas',
  description: 'Herramienta de soporte y resiliencia climática universitaria.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <main className="layout-wrapper">
          {children}
        </main>
      </body>
    </html>
  )
}
