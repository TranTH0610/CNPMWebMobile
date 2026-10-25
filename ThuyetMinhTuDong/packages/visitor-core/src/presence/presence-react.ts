/**
 * FILE NÀY LÀM GÌ: Hook admin đọc thống kê chung mỗi 5 giây, cho cả web/native.
 * Dashboard dùng; phụ thuộc PresenceClient. Không tự tạo phiên admin trong thống kê.
 */
import { useEffect, useState } from 'react'
import type { PresenceClient, PresenceStats } from './presence'
export function usePresenceStatistics(client: PresenceClient | null) {
  const [stats, setStats] = useState<PresenceStats | null>(null)
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let disposed = false
    let timer: ReturnType<typeof setTimeout> | undefined
    setStats(null); setError(false)
    // CHỨC NĂNG: Tải số phiên hiện tại; lỗi hiển thị chưa có số liệu thay vì số 0 giả.
    // XỬ LÝ: Không chồng request; dọn timer và bỏ kết quả cũ khi rời màn hoặc thử lại.
    const poll = async () => {
      try {
        if (!client) throw new Error('presence_not_configured')
        const next = await client.statistics()
        if (!disposed) { setStats(next); setError(false) }
      } catch { if (!disposed) { setStats(null); setError(true) } }
      if (!disposed) timer = setTimeout(() => { void poll() }, 5000)
    }
    void poll()
    return () => { disposed = true; if (timer) clearTimeout(timer) }
  }, [client, attempt])
  return { stats, error, retry: () => setAttempt(value => value + 1) }
}
/* CÁCH KIỂM TRA: Hai admin dùng cùng URL có cùng số; server tắt hiện lỗi; bật lại tự phục hồi. */
