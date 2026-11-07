/**
 * CHỨC NĂNG: [TRUY-CAP-QR]
 * VAI TRÒ: HOOK XỬ LÝ VÀ VÒNG ĐỜI
 *
 * FILE NÀY LÀM GÌ:
 * Ghi lượt vào từ liên kết QR chung có dấu entry=gate; dùng mã lượt để hạn chế đếm lại khi tải trang.
 *
 * VỊ TRÍ: apps/mobile/src/features/qr/hooks/useGhiNhanVaoCong.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/features/presence/hooks/useBaoPhienHoatDong.ts
 *
 * PHỤ THUỘC:
 * - react
 * - react-native
 * - @travelguide/admin-core
 * - ../../admin/shared/services/KetNoiDichVuQuanTri
 * - ../../../shared/services/KetNoiNenTang
 *
 * CÁC KHỐI CHÍNH:
 * 1. useGateEntry
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
import { useEffect } from 'react'
import { Linking } from 'react-native'
import { sendGateEntry } from '@travelguide/admin-core'
import { visitorGateClient } from '../../admin/shared/services/KetNoiDichVuQuanTri'
import { webOrigin } from '../../../shared/services/KetNoiNenTang'

const visitId =
  'gate_app_' +
  Date.now().toString(36) +
  '_' +
  Math.random().toString(36).slice(2) +
  Math.random().toString(36).slice(2)
// CHỨC NĂNG: Ghi lượt mở liên kết QR tại cổng.
// XỬ LÝ: Chỉ xử lý liên kết đúng dấu entry=gate và dùng mã lượt để hạn chế đếm lại.

// ==================== [TRUY-CAP-QR] useGateEntry ====================
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
export function useGateEntry(enabled: boolean) {
  // CHỨC NĂNG: Nhận liên kết mở app ban đầu và các sự kiện URL mới trong lúc app đang chạy.
  // XỬ LÝ: Chỉ ghi lượt khi origin, đường dẫn và query đúng quy tắc cổng; cleanup hủy gửi
  // và gỡ subscription.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: enabled.
  // Đăng ký useEffect để thực hiện tác vụ sau render. | Rẽ nhánh nếu !enabled. | Thoát hàm hiện tại ngay.
  useEffect(() => {
    if (!enabled) return

    let alive = true
    let stop: (() => void) | undefined

    const receive = (url: string | null | undefined) => {
      if (!alive || !url) return

      try {
        const value = new URL(url)
        if (value.search !== '?entry=gate' || value.pathname !== '/' || value.origin !== webOrigin)
          return
        // CHỨC NĂNG: Giữ cùng ID suốt lần chạy app để sự kiện link lặp không tăng lượt.

        stop?.()
        stop = sendGateEntry(visitorGateClient, visitId, 'mobile-app')
      } catch {
        /* Link sai không làm gián đoạn ứng dụng. */
      }
    }
    // TẠI SAO (receive): Tách vòng đời và việc đọc trạng thái khỏi UI giúp màn hình dễ theo dõi và
    // dùng lại.

    void Linking.getInitialURL()
      .then(receive)
      .catch(() => {})

    const subscription = Linking.addEventListener('url', (event) => receive(event.url))

    return () => {
      alive = false
      stop?.()
      subscription.remove()
    }
  }, [enabled])
  // TẠI SAO: Cùng luồng QR cần hoạt động khi app vừa mở lẫn đang mở; link lặp không nên biến thành
  // nhiều lượt vào.
}
// TẠI SAO (useGateEntry): Chỉ lượt vào từ liên kết cổng mới được ghi nhận; tải trang thường
// không phải một lượt mở QR.
/* CÁCH KIỂM TRA: App cài riêng nhận link HTTPS vào cổng; mở từ icon/Expo không tăng lượt QR. */
