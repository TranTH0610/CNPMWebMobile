/**
 * FILE: apps/web/src/shared/layouts/ChanTrang.tsx
 * FILE NÀY LÀM GÌ: Chân trang du khách gọn, chỉ giữ tên ứng dụng. AppLayout dùng; phụ thuộc useText để tên hiển thị đúng ngôn ngữ. CHỨC NĂNG: Không đưa thông báo tài khoản, dữ liệu mẫu hoặc thông tin kỹ thuật vào chân trang.
 * VAI TRÒ: Giao diện Web; gọi hook/service để xử lý nghiệp vụ.
 * UC: Hỗ trợ chung; không thực hiện một UC độc lập.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { useText } from '../../features/language/i18n/CauHinhNgonNgu'
// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider Footer.
// [HỖ TRỢ CHUNG] Footer — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider Footer.
export function Footer() {
  const t = useText()
  return (
    <footer className="container footer">
      <strong>{t('site')}</strong>
    </footer>
  )
}
