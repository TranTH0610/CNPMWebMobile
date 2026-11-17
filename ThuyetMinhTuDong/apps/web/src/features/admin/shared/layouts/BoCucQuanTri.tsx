/**
 * FILE: apps/web/src/features/admin/shared/layouts/BoCucQuanTri.tsx
 * FILE NÀY LÀM GÌ: Khung website quản trị gồm điều hướng quản lý, bố cục trang và vùng hiển thị nội dung admin.
 * VAI TRÒ: Giao diện Web; gọi hook/service để xử lý nghiệp vụ.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC09: Truy cập khu vực quản lý được cấp sẵn.
 * - UC10: Quản lý di tích.
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * - UC12: Kiểm duyệt nội dung và âm thanh.
 * - UC13: Công bố phiên bản đã duyệt.
 * - UC14: Theo dõi hoạt động và lượt vào từ QR.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { HeritageMark } from '../../../../shared/components/BieuTrungDiSan'
import { useVisitor } from '@travelguide/visitor-core/react'
import { useEffect } from 'react'
import { useJourney } from '../../../journey/hooks/useHanhTrinh'
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom'
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
import { LanguagePicker } from '../../../language/components/ChonNgonNgu'
import { AdminIcon, type AdminIconName } from '../components/BieuTuongQuanTri'
import '../../styles/GiaoDienQuanTri.css'
// CHỨC NĂNG: Khung website quản trị gồm điều hướng quản lý, bố cục trang và vùng hiển thị nội dung
// admin.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.

// [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] AdminLayout — Khung website quản trị gồm điều hướng quản lý, bố cục trang và vùng hiển thị nội dung
export function AdminLayout() {
  const t = useAdminText(),
    state = useAdmin(),
    { engine } = useJourney(),
    { language } = useVisitor(),
    { pathname } = useLocation()
  // CHỨC NĂNG: Dừng tiếng du khách khi vào quản lý và cập nhật ngôn ngữ tài liệu.
  // XỬ LÝ: Chỉ dùng instance đang có; mã cn nội bộ được chuyển thành zh-CN cho HTML.
  // CHỨC NĂNG: Gọi engine.pause() khi giao diện quản trị được gắn hoặc engine thay đổi.
  // XỬ LÝ: Thao tác tạm dừng phiên bài nghe mà engine đang sở hữu.
  useEffect(() => {
    engine.pause()
  }, [engine])
  // TẠI SAO: Chuyển sang quản trị không nên để bài du khách tiếp tục phát cùng phần nghe thử
  // admin.
  // CHỨC NĂNG: Đồng bộ tiêu đề tab và thuộc tính ngôn ngữ HTML theo ngôn ngữ giao diện.
  // XỬ LÝ: Mã nội bộ cn đổi sang zh-CN khi ghi thuộc tính lang của tài liệu.
  useEffect(() => {
    document.title = 'HueGuide · ' + t('admin')
    document.documentElement.lang = language === 'cn' ? 'zh-CN' : language
  }, [language, t])
  // TẠI SAO: Tiêu đề và trình đọc màn hình cần biết đúng ngôn ngữ sau khi người dùng đổi tiếng.

  const current = pathname.includes('/reviews')
    ? 'reviews'
    : pathname.includes('/places')
      ? 'places'
      : 'dashboard'

  const menu: { key: 'dashboard' | 'places' | 'reviews'; icon: AdminIconName; to: string }[] = [
    { key: 'dashboard', icon: 'dashboard', to: '/admin' },
    { key: 'places', icon: 'places', to: '/admin/places' },
    { key: 'reviews', icon: 'review', to: '/admin/reviews' },
  ]

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" to="/admin">
          <span className="admin-brand-icon">
            <HeritageMark />
          </span>
          <strong>
            HueGuide<small>{t('admin')}</small>
          </strong>
        </Link>
        {/* CHỨC NĂNG: Menu có icon và trạng thái đang chọn; màn nhỏ chia ba cột và xuống dòng khi tên dài. */}
        <nav aria-label={t('admin')}>
          {menu.map((item) => (
            <NavLink end={item.key === 'dashboard'} key={item.key} to={item.to}>
              <AdminIcon name={item.icon} />
              <span>{t(item.key)}</span>
              <span className="admin-nav-arrow">
                <AdminIcon name="arrow" />
              </span>
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-note">
          <AdminIcon name="review" />
          <strong>{t('admin')}</strong>
          <p>{t('overviewHint')}</p>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <small>HUEGUIDE / {t('admin')}</small>
            <strong>{t(current)}</strong>
          </div>
          <div className="admin-topbar-tools">
            <LanguagePicker />
            <div className="admin-identity">
              <span aria-hidden="true">HG</span>
              <div>
                <strong>{state.identity?.displayName ?? 'HueGuide'}</strong>
                <small>{t('admin')}</small>
              </div>
            </div>
          </div>
        </header>
        <div className="admin-workspace">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
// TẠI SAO (AdminLayout): Tập trung luồng chuyển màn và bố cục giúp tránh nhiều nơi tự tạo điều
// hướng không nhất quán.
/* CÁCH KIỂM TRA: Menu đổi đúng route; đổi ngôn ngữ đổi tiêu đề; ở màn nhỏ không tràn ngang trang. */
