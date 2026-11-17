/**
 * FILE: apps/mobile/src/features/qr/hooks/useGhiNhanVaoCong.ts
 * FILE NÀY LÀM GÌ: Ghi lượt vào từ liên kết QR chung có dấu entry=gate; dùng mã lượt để hạn chế đếm lại khi tải trang.
 * VAI TRÒ: Khởi tạo, điều hướng hoặc thành phần hỗ trợ ứng dụng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC05: Bắt đầu tham quan bằng QR chung tại cổng.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
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

// [UC05] useGateEntry — Nhận liên kết vào cổng và gửi lượt QR nền; giữ visitId để hạn chế ghi trùng.
export function useGateEntry(enabled: boolean) {
  // CHỨC NĂNG: Nhận liên kết mở app ban đầu và các sự kiện URL mới trong lúc app đang chạy.
  // XỬ LÝ: Chỉ ghi lượt khi origin, đường dẫn và query đúng quy tắc cổng; cleanup hủy gửi
  // và gỡ subscription.
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
