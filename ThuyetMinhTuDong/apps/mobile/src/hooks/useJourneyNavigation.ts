/**
 * FILE NÀY LÀM GÌ: Điều hướng theo gợi ý GPS và chốt tiến độ khi app đổi trạng thái.
 * Vị trí: apps/mobile/src/hooks/useJourneyNavigation.ts. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { useEffect } from 'react'
import { AppState } from 'react-native'
import { useJourney } from './useJourney'

export function useJourneyNavigation({ open }: { open: (id: string) => void }) {
  const { engine, state } = useJourney()
  useEffect(() => { if (state.suggestedId) open(state.suggestedId) }, [state.suggestedId, open])
  useEffect(() => { const subscription = AppState.addEventListener('change', () => engine.checkpoint()); return () => subscription.remove() }, [engine])

}
