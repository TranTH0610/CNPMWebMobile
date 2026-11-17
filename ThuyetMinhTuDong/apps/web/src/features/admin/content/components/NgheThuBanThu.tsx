/**
 * FILE: apps/web/src/features/admin/content/components/NgheThuBanThu.tsx
 * FILE NÀY LÀM GÌ: Nghe thử bản thu trong biên tập/kiểm duyệt. Native dùng controller nghe thử; web dùng phần tử audio của trình duyệt.
 * VAI TRÒ: Giao diện Web; gọi hook/service để xử lý nghiệp vụ.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * - UC12: Kiểm duyệt nội dung và âm thanh.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { useEffect, useRef } from 'react'
import { playbackCoordinator } from '@travelguide/visitor-core'
import { narrationSource } from '../../../journey/adapters/NguonAmThanh'
// CHỨC NĂNG: Nghe thử bản thu trong biên tập/kiểm duyệt.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.

// [UC11 / UC12] AudioPreview — Hiển thị điều khiển nghe thử bản thu phục vụ biên tập hoặc kiểm duyệt.
export function AudioPreview({ url }: { url: string }) {
  const ref = useRef<HTMLAudioElement>(null)
  // CHỨC NĂNG: Lấy audio hiện tại để đăng ký thao tác dọn nguồn nghe thử.
  // XỬ LÝ: Effect không gọi play; hàm return pause audio và trả quyền phát khi URL đổi
  // hoặc rời component.
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
