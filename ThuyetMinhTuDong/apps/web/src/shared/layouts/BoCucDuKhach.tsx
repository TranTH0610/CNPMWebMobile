/**
 * FILE: apps/web/src/shared/layouts/BoCucDuKhach.tsx
 * FILE NÀY LÀM GÌ: Khung website du khách ghép thanh điều hướng, nội dung route và các thành phần dùng chung của trang.
 * VAI TRÒ: Giao diện Web; gọi hook/service để xử lý nghiệp vụ.
 * UC: Hỗ trợ chung; không thực hiện một UC độc lập.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useText } from '../../features/language/i18n/CauHinhNgonNgu'
import { useVisitor } from '../../features/language/hooks/useDuKhach'
import { Navbar } from './ThanhDieuHuong'
import { Footer } from './ChanTrang'
import { JourneyPlayer } from '../../features/journey/components/TrinhNgheThuyetMinh'

// CHỨC NĂNG: Giữ layout/player khi route con đổi; chỉ nội dung Outlet thay đổi.

// [HỖ TRỢ CHUNG] AppLayout — Giữ layout/player khi route con đổi; chỉ nội dung Outlet thay đổi.
export function AppLayout() {
  const t = useText()
  const { pathname, search } = useLocation()
  // CHỨC NĂNG: Mở trang mới từ đầu để không bỏ lỡ tên/ảnh/nút nghe khi người dùng vừa cuộn danh sách.
  // XỬ LÝ: Chỉ chạy khi đổi route hoặc truy vấn, không nhảy cuộn khi đổi ngôn ngữ hay trạng thái audio.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, search])

  const { language } = useVisitor()

  // CHỨC NĂNG: Đồng bộ tiêu đề tab và thuộc tính ngôn ngữ HTML theo ngôn ngữ giao diện.
  // XỬ LÝ: Mã nội bộ cn đổi sang zh-CN khi ghi thuộc tính lang của tài liệu.
  useEffect(() => {
    document.documentElement.lang = language === 'cn' ? 'zh-CN' : language

    document.title = t('site') + ' · ' + t('explore')
  }, [language, t])
  // TẠI SAO: Tiêu đề và trình đọc màn hình cần biết đúng ngôn ngữ sau khi người dùng đổi tiếng.

  return (
    <>
      <a className="skip-link" href="#visitor-main">
        {t('skipContent')}
      </a>
      <Navbar />
      <main className="container" id="visitor-main" tabIndex={-1}>
        <JourneyPlayer />
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
// TẠI SAO (AppLayout): Tập trung luồng chuyển màn và bố cục giúp tránh nhiều nơi tự tạo điều
// hướng không nhất quán.
