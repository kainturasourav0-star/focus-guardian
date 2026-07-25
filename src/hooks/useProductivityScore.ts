import { useMonitorStore } from '../store/useMonitorStore'

/**
 * Returns the current productivity score and a derived label.
 */
export function useProductivityScore() {
  const productivityScore = useMonitorStore((s) => s.productivityScore)

  const label =
    productivityScore >= 80
      ? 'Excellent'
      : productivityScore >= 60
        ? 'Good'
        : productivityScore >= 40
          ? 'Fair'
          : productivityScore >= 20
            ? 'Low'
            : 'Very Low'

  const color =
    productivityScore >= 80
      ? '#10b981'
      : productivityScore >= 60
        ? '#06b6d4'
        : productivityScore >= 40
          ? '#f59e0b'
          : '#ef4444'

  return { productivityScore, label, color }
}
