/**
 * FILE NÀY LÀM GÌ: Kho phiên RAM cho thống kê, không dùng database hay ghi tệp.
 * server.cjs gọi qua heartbeat/end/snapshot; sau này thay bằng kho database cùng hợp đồng.
 * Liên quan thống kê phiên đang hoạt động; không coi phiên là người/vé.
 */
function createMemoryStore({ now = Date.now, ttlMs = 90000, maxSessions = 10000 } = {}) {
  const sessions = new Map()
  // CHỨC NĂNG: Xóa phiên hết hạn để RAM không tăng mãi.
  // XỬ LÝ: Dùng thời gian server; client không được gửi thời gian để kéo dài phiên.
  function prune() {
    const cutoff = now() - ttlMs
    for (const [id, session] of sessions) if (session.lastSeen <= cutoff) sessions.delete(id)
  }
  return {
    prune,
    heartbeat({ sessionId, platform }) {
      prune()
      const previous = sessions.get(sessionId)
      if (previous && previous.platform !== platform) throw new Error('platform_conflict')
      if (!previous && sessions.size >= maxSessions) throw new Error('capacity')
      sessions.set(sessionId, { platform, lastSeen: now() })
    },
    end(sessionId) { sessions.delete(sessionId) },
    snapshot() {
      prune()
      const rows = [...sessions.values()]
      return { active: rows.length, web: rows.filter(s => s.platform === 'web').length,
        mobile: rows.filter(s => s.platform === 'mobile-app').length,
        updatedAt: now(), ttlSeconds: ttlMs / 1000 }
    },
  }
}
module.exports = { createMemoryStore }
/* CÁCH KIỂM TRA: Cùng mã heartbeat nhiều lần chỉ tính một; hết 90 giây về 0; tạo kho mới mất phiên cũ. */
