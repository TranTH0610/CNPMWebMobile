/**
 * FILE NÀY LÀM GÌ
 * Hợp đồng kho phiên với heartbeat, end, snapshot và prune; giúp đổi cách lưu sau này mà giữ nơi
 * gọi.
 *
 * VỊ TRÍ: services/presence/repository.d.ts
 * DÙNG BỞI: Entry hoặc nơi import module này trong ứng dụng.
 * TẠI SAO TÁCH FILE: Các nơi dùng cần cùng hợp đồng dữ liệu để TypeScript phát hiện truyền thiếu
 * hoặc sai kiểu.
 */
// Khai báo hợp đồng PresenceRepository.
export interface PresenceRepository {
  // Khai báo heartbeat(session). Ghi nhận phiên còn hoạt động theo sessionId. | Khai báo sessionId, kiểu string. Phân biệt phiên ẩn danh để nhiều nhịp heartbeat không bị đếm thành nhiều phiên. | Khai báo platform, kiểu 'web' | 'mobile-app'. Phân nhóm web và mobile-app trong cùng kho thống kê.
  heartbeat(session: { sessionId: string; platform: 'web' | 'mobile-app' }): void | Promise<void>
  // Khai báo end(sessionId). Mô tả cách gọi trong hợp đồng kiểu.
  end(sessionId: string): void | Promise<void>
  // Khai báo prune(). Dọn phiên đã quá TTL để thống kê chỉ giữ phiên còn sống và kho RAM không tăng mãi.
  prune(): void | Promise<void>
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `snapshot(): { active: number; web: number; mobile: number; updatedAt: number; ttlSeco`: Khai báo snapshot(). Đọc trạng thái hiện tại của kho/controller. | Khai báo active, kiểu number. Biểu diễn số phiên hoạt động; không suy ra số người hoặc số vé từ số này. | Khai báo web, kiểu number. | Khai báo mobile, kiểu number. | Khai báo updatedAt, kiểu number. | Khai báo ttlSeconds, kiểu number.
   * DÒNG `Promise<{ active: number; web: number; mobile: number; updatedAt: number; ttlSeconds:`: Thành phần kiểu `Promise<{ active: number. | Khai báo active, kiểu number. Biểu diễn số phiên hoạt động; không suy ra số người hoặc số vé từ số này. | Khai báo web, kiểu number. | Khai báo mobile, kiểu number. | Khai báo updatedAt, kiểu number. | Khai báo ttlSeconds, kiểu number.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  snapshot(): { active: number; web: number; mobile: number; updatedAt: number; ttlSeconds: number } |
    Promise<{ active: number; web: number; mobile: number; updatedAt: number; ttlSeconds: number }>
}
/* CÁCH KIỂM TRA: Adapter database có đủ bốn phương thức; snapshot chỉ đếm lastSeen còn hạn. */
