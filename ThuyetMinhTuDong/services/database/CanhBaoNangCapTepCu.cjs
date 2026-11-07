/**
 * CHỨC NĂNG: [DATABASE] [TAI-NGUYEN]
 * VAI TRÒ: TRUY CẬP SQL SERVER
 *
 * FILE NÀY LÀM GÌ:
 * Chặn việc chạy riêng migration tệp cũ không phù hợp cấu trúc 11 bảng.
 *
 * VỊ TRÍ: services/database/CanhBaoNangCapTepCu.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - Điểm vào/cấu hình/bộ test hoặc nơi dùng qua package; xem docs/BanDoChucNang.md.
 *
 * PHỤ THUỘC:
 * - Không import module khác.
 *
 * CÁC KHỐI CHÍNH:
 * 1. migrateMedia
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
 */
/** Migration v2 cũ đã được thay bằng migrate11; không chạy riêng trên schema mới. */
// ==================== [DATABASE] [TAI-NGUYEN] migrateMedia ====================
async function migrateMedia() {
  throw Error('Dùng migrate11 hoặc npm run db:init; không chạy migration media v2 riêng.')
}
module.exports = { migrateMedia }
