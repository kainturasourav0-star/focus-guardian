import { useMonitorStore } from '../store/useMonitorStore'

/**
 * Derives distraction state and helper flags from monitor store.
 */
export function useDistraction() {
  const {
    currentClassification,
    distractionAlertVisible,
    distractionAlertData,
    dismissDistractionAlert,
    currentApp,
  } = useMonitorStore()

  const isDistracted = currentClassification === 'DISTRACTION'
  const isProductive = currentClassification === 'PRODUCTIVE'

  return {
    isDistracted,
    isProductive,
    currentApp,
    distractionAlertVisible,
    distractionAlertData,
    dismissDistractionAlert,
  }
}
