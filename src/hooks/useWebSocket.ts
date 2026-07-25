import { useEffect, useRef, useCallback } from 'react'
import { useMonitorStore } from '../store/useMonitorStore'
import { WsEvent, ActivityUpdateData, DistractionAlertData } from '../types'

const WS_URL = 'ws://127.0.0.1:8000/ws/monitor'
const MAX_RETRIES = 10
const BASE_DELAY = 1000

/**
 * Auto-reconnecting WebSocket hook with exponential backoff.
 * Dispatches incoming events to the monitor store.
 */
export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null)
  const retriesRef = useRef(0)
  const mountedRef = useRef(true)
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const {
    setConnected,
    updateFromActivityEvent,
    showDistractionAlert,
    setCoachMessage,
  } = useMonitorStore()

  const handleEvent = useCallback(
    (event: WsEvent) => {
      switch (event.type) {
        case 'activity_update':
          updateFromActivityEvent(event.data as ActivityUpdateData)
          break
        case 'distraction_alert':
          showDistractionAlert(event.data as DistractionAlertData)
          // Also trigger native notification
          if (window.electronAPI) {
            const d = event.data as DistractionAlertData
            window.electronAPI.showNotification(
              '🎯 Focus Guardian',
              `You've spent ${d.minutes_on_distraction} min on ${d.app_name}. Ready to get back?`
            )
          }
          break
        case 'coach_message':
          setCoachMessage(event.data as string)
          break
        default:
          break
      }
    },
    [updateFromActivityEvent, showDistractionAlert, setCoachMessage]
  )

  const connect = useCallback(() => {
    if (!mountedRef.current) return

    try {
      const ws = new WebSocket(WS_URL)
      wsRef.current = ws

      ws.onopen = () => {
        console.log('[WS] Connected to monitor')
        setConnected(true)
        retriesRef.current = 0
      }

      ws.onmessage = (msg) => {
        try {
          const event: WsEvent = JSON.parse(msg.data)
          handleEvent(event)
        } catch (err) {
          console.warn('[WS] Failed to parse message:', err)
        }
      }

      ws.onerror = (err) => {
        console.warn('[WS] Error:', err)
      }

      ws.onclose = () => {
        setConnected(false)
        if (!mountedRef.current) return

        const retries = retriesRef.current
        if (retries < MAX_RETRIES) {
          const delay = Math.min(BASE_DELAY * 2 ** retries, 30000)
          console.log(`[WS] Reconnecting in ${delay}ms (attempt ${retries + 1})`)
          retriesRef.current += 1
          reconnectTimerRef.current = setTimeout(connect, delay)
        } else {
          console.error('[WS] Max reconnect attempts reached')
        }
      }
    } catch (err) {
      console.error('[WS] Failed to create WebSocket:', err)
    }
  }, [handleEvent, setConnected])

  useEffect(() => {
    mountedRef.current = true
    connect()

    return () => {
      mountedRef.current = false
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current)
      wsRef.current?.close()
    }
  }, [connect])

  const sendMessage = useCallback((type: string, data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, data }))
    }
  }, [])

  return { sendMessage }
}
