/**
 * CHỨC NĂNG: [BIEN-TAP] [THUYET-MINH]
 * VAI TRÒ: GIAO DIỆN WEB
 *
 * FILE NÀY LÀM GÌ:
 * Nghe thử bản thu trong biên tập/kiểm duyệt. Native dùng controller nghe thử; web dùng phần tử audio của trình duyệt.
 *
 * VỊ TRÍ: apps/web/src/features/admin/content/components/NgheThuBanThu.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/features/admin/places/TrangThemSuaDiTich.tsx
 * - apps/web/src/features/admin/reviews/TrangKiemDuyet.tsx
 *
 * PHỤ THUỘC:
 * - react
 * - @travelguide/visitor-core
 * - ../../../journey/adapters/NguonAmThanh
 *
 * CÁC KHỐI CHÍNH:
 * 1. AudioPreview
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { useEffect, useRef } from 'react'
import { playbackCoordinator } from '@travelguide/visitor-core'
import { narrationSource } from '../../../journey/adapters/NguonAmThanh'
// CHỨC NĂNG: Nghe thử bản thu trong biên tập/kiểm duyệt.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.

// ==================== [BIEN-TAP] [THUYET-MINH] AudioPreview ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function AudioPreview({ url }: { url: string }) {
  const ref = useRef<HTMLAudioElement>(null)
  // CHỨC NĂNG: Lấy audio hiện tại để đăng ký thao tác dọn nguồn nghe thử.
  // XỬ LÝ: Effect không gọi play; hàm return pause audio và trả quyền phát khi URL đổi
  // hoặc rời component.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: url.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => {
    const audio = ref.current

    if (!audio) return
    // CHỨC NĂNG: Rời màn/đổi bài dừng và nhả nguồn đang nghe thử.

    return () => {
      audio.pause()
      playbackCoordinator.release(audio)
    }
  }, [url])
  // TẠI SAO: Đổi bản thu hoặc rời trang phải dừng nguồn cũ để không chồng âm với bản mới.

  return (
    <audio
      ref={ref}
      controls
      preload="metadata"
      src={narrationSource(url, true)}
      onPlay={(event) => {
        // XỬ LÝ: Bao gồm cả audio du khách do adapter tạo, không chỉ thẻ trong DOM.
        playbackCoordinator.claim(event.currentTarget)
      }}
    />
  )
}
// TẠI SAO (AudioPreview): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao
// diện tại một nơi.
/* CÁCH KIỂM TRA: Pause tại 0:12, resume từ 0:12; bật bản khác làm bản trước pause. */
