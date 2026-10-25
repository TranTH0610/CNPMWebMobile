/** FILE NÀY LÀM GÌ: Hợp đồng kho lưu trữ cho adapter RAM/database.
 * server.cjs nhận store cùng giao diện; database triển khai async mà FE không đổi.
 * Không lưu thông tin cá nhân; dùng thời gian server cho lastSeen.
 */
export interface PresenceRepository {
  heartbeat(session: { sessionId: string; platform: 'web' | 'mobile-app' }): void | Promise<void>
  end(sessionId: string): void | Promise<void>
  prune(): void | Promise<void>
  snapshot(): { active: number; web: number; mobile: number; updatedAt: number; ttlSeconds: number } |
    Promise<{ active: number; web: number; mobile: number; updatedAt: number; ttlSeconds: number }>
}
/* CÁCH KIỂM TRA: Adapter database có đủ bốn phương thức; snapshot chỉ đếm lastSeen còn hạn. */
