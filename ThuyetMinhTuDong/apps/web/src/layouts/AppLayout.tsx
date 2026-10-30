/**
 * FILE NÀY LÀM GÌ
 * Khung website du khách ghép thanh điều hướng, nội dung route và các thành phần dùng chung của
 * trang.
 *
 * VỊ TRÍ: apps/web/src/layouts/AppLayout.tsx
 * DÙNG BỞI: apps/web/src/navigation/AppRoutes.tsx.
 * PHỤ THUỘC: react; react-router-dom; ../i18n; ../hooks/useVisitor; ../components/Navbar;
 * ../components/Footer; ../components/JourneyPlayer
 * TẠI SAO TÁCH FILE: Tập trung luồng chuyển màn và bố cục giúp tránh nhiều nơi tự tạo điều hướng
 * không nhất quán.
 */
// Nhập các thành phần từ 'react'.
import { useEffect } from 'react'
// Nhập các thành phần từ 'react-router-dom'.
import { Outlet } from 'react-router-dom'
// Nhập các thành phần từ '../i18n'.
import { useText } from '../i18n'
// Nhập các thành phần từ '../hooks/useVisitor'.
import { useVisitor } from '../hooks/useVisitor'
// Nhập các thành phần từ '../components/Navbar'.
import { Navbar } from '../components/Navbar'
// Nhập các thành phần từ '../components/Footer'.
import { Footer } from '../components/Footer'
// Nhập các thành phần từ '../components/JourneyPlayer'.
import { JourneyPlayer } from '../components/JourneyPlayer'

// CHỨC NĂNG: Giữ layout/player khi route con đổi; chỉ nội dung Outlet thay đổi.
// Khai báo AppLayout(). Component hàm nhận props và dựng phần giao diện AppLayout.
export function AppLayout() {
  // Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
  const t = useText()
  // Khai báo { language }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
  const { language } = useVisitor()

  // DÒNG NÀY LÀM GÌ: Đồng bộ tiêu đề tab và thuộc tính ngôn ngữ HTML theo ngôn ngữ giao diện.
  // CÁCH HOẠT ĐỘNG: Mã nội bộ cn đổi sang zh-CN khi ghi thuộc tính lang của tài liệu.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: language, t.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => {
    // Thực hiện tính biểu thức document.documentElement.lang = language === 'cn' ? 'zh-CN' : language.
    document.documentElement.lang = language === 'cn' ? 'zh-CN' : language
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `document.title = t('site') + ' · ' + t('explore')`: Thực hiện tính biểu thức document.title = t('site') + ' · ' + t('explore').
     * DÒNG `}, [language, t])`: Đăng ký useEffect để thực hiện tác vụ sau render.
     */
    document.title = t('site') + ' · ' + t('explore')
  }, [language, t])
  // TẠI SAO: Tiêu đề và trình đọc màn hình cần biết đúng ngôn ngữ sau khi người dùng đổi tiếng.

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<>`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<Navbar />`: Dựng Navbar.
   * DÒNG `<main className="container">`: Dựng main. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<JourneyPlayer />`: Dựng JourneyPlayer.
   * DÒNG `<Outlet />`: Dựng Outlet.
   * DÒNG `</main>`: Đóng phần giao diện main.
   * DÒNG `<Footer />`: Dựng Footer.
   * DÒNG `</>`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return (
    <>
      <Navbar />
      <main className="container">
        <JourneyPlayer />
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
// TẠI SAO (AppLayout): Tập trung luồng chuyển màn và bố cục giúp tránh nhiều nơi tự tạo điều
// hướng không nhất quán.
