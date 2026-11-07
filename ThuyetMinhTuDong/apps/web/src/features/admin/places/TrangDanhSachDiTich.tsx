/**
 * CHỨC NĂNG: [QUAN-LY-DI-TICH] [LUU-NHAP]
 * VAI TRÒ: GIAO DIỆN WEB
 *
 * FILE NÀY LÀM GÌ:
 * Trang danh sách địa điểm. Bản du khách đọc điều kiện route và dùng Catalogue; bản admin quản lý danh sách di tích.
 *
 * VỊ TRÍ: apps/web/src/features/admin/places/TrangDanhSachDiTich.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/app/DinhTuyenQuanTri.tsx
 *
 * PHỤ THUỘC:
 * - react
 * - react-router-dom
 * - @travelguide/visitor-core
 * - @travelguide/visitor-core/react
 * - @travelguide/admin-core/react
 * - ../../../shared/components/AnhDiTich
 * - ../shared/components/ThanhPhanQuanTri
 * - ../shared/components/BieuTuongQuanTri
 *
 * CÁC KHỐI CHÍNH:
 * 1. AdminPlacesPage
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { normalize } from '@travelguide/visitor-core'
import { useDebounce } from '@travelguide/visitor-core/react'
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
import { PlaceImage } from '../../../shared/components/AnhDiTich'
import { Feedback, Status } from '../shared/components/ThanhPhanQuanTri'
import { AdminIcon } from '../shared/components/BieuTuongQuanTri'
// CHỨC NĂNG: Trang danh sách địa điểm.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.

// ==================== [QUAN-LY-DI-TICH] [LUU-NHAP] AdminPlacesPage ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function AdminPlacesPage() {
  // CHỨC NĂNG: Từ khóa người dùng đang gõ; giá trị lọc có thể được trì hoãn bằng debounce.

  const state = useAdmin(),
    t = useAdminText(),
    [query, setQuery] = useState('')
  // CHỨC NĂNG: Chờ gõ xong rồi tìm không dấu; chỉ lọc lại khi dữ liệu/từ khóa đổi.
  // XỬ LÝ: Không ẩn di tích đã lưu trữ để người quản lý còn xem và xử lý được.

  const [workflow, setWorkflow] = useState('all')
  const search = useDebounce(query)

  const places = useMemo(
    () =>
      state.data?.places.filter(
        (p) =>
          (workflow === 'all' || p.workflow === workflow) &&
          normalize(p.record.canonicalTitle).includes(normalize(search)),
      ) ?? [],
    [state.data, search, workflow],
  )

  return (
    <>
      <div className="admin-page-title">
        <div>
          <h1>{t('places')}</h1>
          <p>{t('catalogHint')}</p>
        </div>
        <Link className="button" to="/admin/places/new">
          <AdminIcon name="plus" />
          {t('new')}
        </Link>
      </div>
      <Feedback state={state} />
      <div className="admin-list-toolbar">
        <select
          aria-label={t('workflowSection')}
          value={workflow}
          onChange={(event) => setWorkflow(event.target.value)}
        >
          <option value="all">{t('places')}</option>
          {(['draft', 'submitted', 'changes', 'approved', 'published', 'archived'] as const).map(
            (value) => (
              <option value={value} key={value}>
                {t(`status_${value}`)}
              </option>
            ),
          )}
        </select>
        <div className="admin-search-wrap">
          <AdminIcon name="search" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search')}
            aria-label={t('search')}
          />
          {query && (
            <button
              type="button"
              className="secondary admin-clear-search"
              aria-label={t('clearSearch')}
              onClick={() => setQuery('')}
            >
              <AdminIcon name="close" />
            </button>
          )}
        </div>
        <span className="admin-result-count" role="status">
          {places.length} {t('places')}
        </span>
      </div>
      <div className="admin-place-grid">
        {places.map((place) => (
          <article className="admin-place-card" key={place.id}>
            <div className="admin-place-cover">
              <PlaceImage uri={place.record.images[0]} title={place.record.canonicalTitle} />
              <Status value={place.workflow} />
            </div>
            <div className="admin-place-info">
              <span className="admin-revision">
                {t('revision')}: {place.revision}
              </span>
              <h2>{place.record.canonicalTitle}</h2>
              {place.period && <p>{place.period}</p>}
              <div className="admin-actions">
                <Link className="button secondary" to={'/admin/places/' + place.id + '/edit'}>
                  <AdminIcon name="edit" />
                  {t('edit')}
                </Link>
                <Link className="button" to={'/admin/places/' + place.id + '/content'}>
                  <AdminIcon name="content" />
                  {t('content')}
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!state.loading && !state.error && !places.length && (
        <div className="admin-card admin-empty">
          <AdminIcon name="search" />
          <h2>{t('empty')}</h2>
          {query && (
            <button className="secondary" onClick={() => setQuery('')}>
              {t('clearSearch')}
            </button>
          )}
        </div>
      )}
    </>
  )
}
// TẠI SAO (AdminPlacesPage): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi
// qua lớp dùng chung.
/* CÁCH KIỂM TRA: Gõ ky dai; xóa từ khóa; tìm rỗng; các nút mở đúng id và trạng thái vẫn đủ nhãn. */
