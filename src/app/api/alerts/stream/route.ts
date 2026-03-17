// SSE Stream endpoint - Citizens connect here to receive real-time alerts
import { alertBus } from '@/lib/alertBus'

export const dynamic = 'force-dynamic'

export async function GET() {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection confirmation
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected', message: 'Conectado al sistema de alertas en tiempo real' })}\n\n`))

      // Subscribe to alert bus
      const unsubscribe = alertBus.subscribe((alertPayload) => {
        try {
          const payload = alertPayload.type ? alertPayload : { type: 'alert', ...alertPayload }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`))
        } catch (e) {
          // Client disconnected
          unsubscribe()
        }
      })

      // Keep-alive ping every 30s to prevent timeout
      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`))
        } catch (e) {
          clearInterval(keepAlive)
          unsubscribe()
        }
      }, 30000)
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  })
}
