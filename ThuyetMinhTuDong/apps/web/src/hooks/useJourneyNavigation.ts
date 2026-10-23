/**
 * FILE NÀY LÀM GÌ: Nhận gợi ý GPS và lưu tiến độ khi trang ra nền; App gọi hook này một lần.
 * Vị trí: apps/web/src/hooks/useJourneyNavigation.ts. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useJourney } from './useJourney'

// CHỨC NĂNG: Mở điểm GPS mới khi controller cho phép, không khi đang nghe.
// XỬ LÝ: Chỉ chạy khi ID gợi ý đổi, không điều hướng lại theo mỗi tick audio.
export function useJourneyNavigation() {
  const { engine, state } = useJourney(), navigate = useNavigate()
  useEffect(() => { if (state.suggestedId) navigate('/places/' + state.suggestedId) }, [state.suggestedId, navigate])
  useEffect(() => {
    const save = () => engine.checkpoint()
    window.addEventListener('pagehide', save)
    document.addEventListener('visibilitychange', save)
    return () => { window.removeEventListener('pagehide', save); document.removeEventListener('visibilitychange', save) }
  }, [engine])

}
