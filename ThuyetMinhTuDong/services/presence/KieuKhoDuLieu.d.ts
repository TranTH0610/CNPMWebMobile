/**
 * CHỨC NĂNG: [PHIEN-HOAT-DONG] [THONG-KE]
 * VAI TRÒ: API PHÍA MÁY CHỦ
 *
 * FILE NÀY LÀM GÌ:
 * Hợp đồng kho phiên với heartbeat, end, snapshot và prune; giúp đổi cách lưu sau này mà giữ nơi
 *
 * VỊ TRÍ: services/presence/KieuKhoDuLieu.d.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - Điểm vào/cấu hình/bộ test hoặc nơi dùng qua package; xem docs/BanDoChucNang.md.
 *
 * PHỤ THUỘC:
 * - Không import module khác.
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
// Khai báo hợp đồng PresenceRepository.
export interface PresenceRepository {
  // Khai báo heartbeat(session). Ghi nhận phiên còn hoạt động theo sessionId. | Khai báo sessionId, kiểu string. Phân biệt phiên ẩn danh để nhiều nhịp heartbeat không bị đếm thành nhiều phiên. | Khai báo platform, kiểu 'web' | 'mobile-app'. Phân nhóm web và mobile-app trong cùng kho thống kê.
  heartbeat(session: { sessionId: string; platform: 'web' | 'mobile-app' }): void | Promise<void>
  // Khai báo end(sessionId). Mô tả cách gọi trong hợp đồng kiểu.
  end(sessionId: string): void | Promise<void>
  // Khai báo prune(). Dọn phiên đã quá TTL để thống kê chỉ giữ phiên còn sống và kho RAM không tăng mãi.
  prune(): void | Promise<void>
  
  snapshot(): { active: number; web: number; mobile: number; updatedAt: number; ttlSeconds: number } |
    Promise<{ active: number; web: number; mobile: number; updatedAt: number; ttlSeconds: number }>
}
/* CÁCH KIỂM TRA: Adapter database có đủ bốn phương thức; snapshot chỉ đếm lastSeen còn hạn. */
