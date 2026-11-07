/**
 * CHỨC NĂNG: [TRUY-CAP-QR]
 * VAI TRÒ: HOOK XỬ LÝ VÀ VÒNG ĐỜI
 *
 * FILE NÀY LÀM GÌ:
 * Ghi lượt vào từ liên kết QR chung có dấu entry=gate; dùng mã lượt để hạn chế đếm lại khi tải trang.
 *
 * VỊ TRÍ: apps/web/src/features/qr/hooks/useGhiNhanVaoCong.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/features/presence/hooks/useBaoPhienHoatDong.ts
 *
 * PHỤ THUỘC:
 * - react
 * - react-router-dom
 * - @travelguide/admin-core
 * - ../../admin/shared/services/KetNoiDichVuQuanTri
 *
 * CÁC KHỐI CHÍNH:
 * 1. id
 * 2. useGateEntry
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { sendGateEntry } from '@travelguide/admin-core'
import { visitorGateClient } from '../../admin/shared/services/KetNoiDichVuQuanTri'

let visitId: string | undefined

// ==================== [TRUY-CAP-QR] id ====================
// CHỨC NĂNG: Thực hiện bước id trong nhiệm vụ: Ghi lượt vào từ liên kết QR chung có dấu entry=gate; dùng mã lượt để hạn chế đếm lại khi tải trang.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
function id() {
  if (visitId) return visitId

  const fresh =
    'gate_web_' +
    Date.now().toString(36) +
    '_' +
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).slice(2)

  try {
    const old = sessionStorage.getItem('hue-gate-visit')
    visitId = old && /^[-_a-zA-Z0-9]{20,100}$/.test(old) ? old : fresh
    sessionStorage.setItem('hue-gate-visit', visitId)
  } catch {
    visitId = fresh
  }

  return visitId
}
// TẠI SAO (id): Tách vòng đời và việc đọc trạng thái khỏi UI giúp màn hình dễ theo dõi và dùng
// lại.
// CHỨC NĂNG: Ghi lượt mở liên kết QR tại cổng.
// XỬ LÝ: Chỉ xử lý liên kết đúng dấu entry=gate và dùng mã lượt để hạn chế đếm lại.

// ==================== [TRUY-CAP-QR] useGateEntry ====================
export function useGateEntry() {
  const { pathname, search } = useLocation()
  // CHỨC NĂNG: Chỉ gửi lượt QR khi pathname là / và search đúng ?entry=gate.
  // XỬ LÝ: Trả hàm dừng của sendGateEntry để cleanup dùng khi route đổi hoặc component
  // rời.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: pathname, search.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => {
    // CHỨC NĂNG: Chỉ QR do nhân viên cấp có entry=gate mới được ghi nhận.
    // XỬ LÝ: Mở web thường hoặc mở Admin không tăng; API lỗi retry không làm đếm lặp.

    if (pathname !== '/' || search !== '?entry=gate') return

    return sendGateEntry(visitorGateClient, id(), 'web')
  }, [pathname, search])
  // TẠI SAO: Vào website thường hoặc mở trang khác không phải một lượt vào cổng; request thử lại
  // không được tăng lượt giả.
}
// TẠI SAO (useGateEntry): Chỉ lượt vào từ liên kết cổng mới được ghi nhận; tải trang thường
// không phải một lượt mở QR.
/* CÁCH KIỂM TRA: Mở / không tăng; /?entry=gate tăng một; refresh vẫn một; tab phiên mới có thể tăng. */
