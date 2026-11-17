/**
 * FILE: apps/web/src/features/qr/hooks/useGhiNhanVaoCong.ts
 * FILE NÀY LÀM GÌ: Ghi lượt vào từ liên kết QR chung có dấu entry=gate; dùng mã lượt để hạn chế đếm lại khi tải trang.
 * VAI TRÒ: Khởi tạo, điều hướng hoặc thành phần hỗ trợ ứng dụng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC05: Bắt đầu tham quan bằng QR chung tại cổng.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { sendGateEntry } from '@travelguide/admin-core'
import { visitorGateClient } from '../../admin/shared/services/KetNoiDichVuQuanTri'

let visitId: string | undefined

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

// [UC05] useGateEntry — Nhận liên kết vào cổng và gửi lượt QR nền; giữ visitId để hạn chế ghi trùng.
export function useGateEntry() {
  const { pathname, search } = useLocation()
  // CHỨC NĂNG: Chỉ gửi lượt QR khi pathname là / và search đúng ?entry=gate.
  // XỬ LÝ: Trả hàm dừng của sendGateEntry để cleanup dùng khi route đổi hoặc component
  // rời.
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
