/**
 * CHỨC NĂNG: [THONG-KE]
 * VAI TRÒ: GIAO DIỆN WEB
 *
 * FILE NÀY LÀM GÌ:
 * Tổng quan admin web; đọc nội dung, lượt QR và thống kê phiên từ các client tương ứng để hiển thị bốn chỉ số.
 *
 * VỊ TRÍ: apps/web/src/features/admin/dashboard/TrangTongQuan.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/app/DinhTuyenQuanTri.tsx
 *
 * PHỤ THUỘC:
 * - react
 * - react-router-dom
 * - @travelguide/visitor-core/presence/react
 * - ../../presence/services/PhienHoatDong
 * - @travelguide/admin-core
 * - @travelguide/admin-core/react
 * - ../shared/components/ThanhPhanQuanTri
 * - ../shared/services/KetNoiDichVuQuanTri
 * - ../shared/components/BieuTuongQuanTri
 *
 * CÁC KHỐI CHÍNH:
 * 1. DashboardPage
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { usePresenceStatistics } from '@travelguide/visitor-core/presence/react'
import { presenceClient } from '../../presence/services/PhienHoatDong'
import { dashboard } from '@travelguide/admin-core'
import { useAdmin, useAdminText, useGateStatistics } from '@travelguide/admin-core/react'
import { Feedback } from '../shared/components/ThanhPhanQuanTri'
import { gateClient } from '../shared/services/KetNoiDichVuQuanTri'
import { AdminIcon, type AdminIconName } from '../shared/components/BieuTuongQuanTri'
// CHỨC NĂNG: Tổng quan admin web; đọc nội dung, lượt QR và thống kê phiên từ các client tương ứng
// để hiển thị bốn chỉ số.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.

// ==================== [THONG-KE] DashboardPage ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function DashboardPage() {
  const state = useAdmin(),
    t = useAdminText(),
    gate = useGateStatistics(gateClient)

  const presence = usePresenceStatistics(presenceClient)
  // CHỨC NĂNG: Tính lại thống kê nội dung khi kho thay đổi, tách số phiên lấy từ RAM.
  // XỬ LÝ: Chưa có phản hồi presence thì hiển thị —; không đánh đồng lỗi với 0 phiên.

  const metrics = useMemo(() => (state.data ? dashboard(state.data) : null), [state.data])

  const tiles: { key: 'active' | 'gateToday' | 'places' | 'pending'; icon: AdminIconName }[] = [
    { key: 'active', icon: 'users' },
    { key: 'gateToday', icon: 'qr' },
    { key: 'places', icon: 'places' },
    { key: 'pending', icon: 'review' },
  ]

  return (
    <>
      <section className="admin-hero">
        <div>
          <span className="admin-eyebrow">HUEGUIDE</span>
          <h1>{t('dashboard')}</h1>
          <p>{t('overviewHint')}</p>
        </div>
        <Link className="button admin-hero-button" to="/admin/places/new">
          <AdminIcon name="plus" />
          {t('new')}
        </Link>
        <div className="admin-hero-decoration" aria-hidden="true">
          <AdminIcon name="places" />
        </div>
      </section>
      <Feedback state={state} />
      {metrics && (
        <div className="admin-metrics">
          {tiles.map(({ key, icon }, index) => (
            <article className={'admin-metric metric-' + index} key={key}>
              <div className="admin-metric-top">
                <span>{t(key === 'pending' ? 'status_submitted' : key)}</span>
                <span className="admin-metric-icon">
                  <AdminIcon name={icon} />
                </span>
              </div>
              <strong>
                {key === 'active'
                  ? (presence.stats?.active ?? '—')
                  : key === 'gateToday'
                    ? (gate.stats?.today ?? '—')
                    : metrics[key]}
              </strong>
              <div className="admin-metric-line" />
            </article>
          ))}
        </div>
      )}
      {gate.error && (
        <div className="admin-error" role="alert">
          {t('gateError')}
          <button className="secondary" onClick={gate.retry}>
            {t('retry')}
          </button>
        </div>
      )}
      {presence.error ? (
        <div className="admin-error" role="alert">
          {t('presenceError')}
          <button className="secondary" onClick={presence.retry}>
            {t('retry')}
          </button>
        </div>
      ) : !presence.stats ? (
        <p role="status">{t('loading')}</p>
      ) : null}
      <div className="admin-dashboard-grid">
        <section className="admin-card">
          <div className="admin-section-heading">
            <span className="admin-icon-box">
              <AdminIcon name="dashboard" />
            </span>
            <h2>{t('quickActions')}</h2>
          </div>
          <div className="admin-quick-actions">
            {(
              [
                { to: '/admin/places', title: 'places', hint: 'managePlacesHint', icon: 'places' },
                { to: '/admin/reviews', title: 'reviews', hint: 'reviewQueueHint', icon: 'review' },
              ] as const
            ).map((item) => (
              <Link key={item.to} className="admin-quick-action" to={item.to}>
                <span className="admin-icon-box">
                  <AdminIcon name={item.icon} />
                </span>
                <div>
                  <strong>{t(item.title)}</strong>
                  <p>{t(item.hint)}</p>
                </div>
                <AdminIcon name="arrow" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
// TẠI SAO (DashboardPage): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua
// lớp dùng chung.
/* CÁCH KIỂM TRA: Bốn chỉ số đúng; liên kết mở đúng màn; không còn nút reset; tắt RAM hiện lỗi. */
