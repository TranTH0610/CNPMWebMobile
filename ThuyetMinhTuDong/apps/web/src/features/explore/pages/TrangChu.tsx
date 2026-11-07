/**
 * CHỨC NĂNG: [KHAM-PHA]
 * VAI TRÒ: GIAO DIỆN WEB
 *
 * FILE NÀY LÀM GÌ:
 * Trang chủ web với hero, ô tìm kiếm, danh mục, carousel điểm nổi bật và danh mục bên dưới.
 *
 * VỊ TRÍ: apps/web/src/features/explore/pages/TrangChu.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/app/DinhTuyenDuKhach.tsx
 *
 * PHỤ THUỘC:
 * - ../../../shared/services/XuLyAnhDiTich
 * - ../components/DanhSachVaBoLoc
 * - react
 * - react-router-dom
 * - @travelguide/visitor-core
 * - ../hooks/useDanhSachDiTich
 * - ../../language/i18n/CauHinhNgonNgu
 * - ../components/NutLocDanhMuc
 * - ../../../shared/components/BieuTuong
 * - ../components/TheDiTich
 * - ../../../shared/components/TrangThaiDuLieu
 *
 * CÁC KHỐI CHÍNH:
 * 1. HomePage
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { resolvePlaceImage } from '../../../shared/services/XuLyAnhDiTich'
import { Catalogue } from '../components/DanhSachVaBoLoc'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { categoryOf, HERO_IMAGE } from '@travelguide/visitor-core'
import type { Category } from '@travelguide/visitor-core'
import { usePublishedCatalog } from '../hooks/useDanhSachDiTich'
import { useText } from '../../language/i18n/CauHinhNgonNgu'
import { CategoryChips } from '../components/NutLocDanhMuc'
import { Icon } from '../../../shared/components/BieuTuong'
import { PlaceCard } from '../components/TheDiTich'
import { State } from '../../../shared/components/TrangThaiDuLieu'

// CHỨC NĂNG: Trang chủ gồm hero, carousel và danh sách.
// XỬ LÝ: Tải service một lần tại trang; chia cùng dữ liệu cho các khối.

// ==================== [KHAM-PHA] HomePage ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function HomePage() {
  const data = usePublishedCatalog()

  const t = useText()

  const navigate = useNavigate()

  // CHỨC NĂNG: Từ khóa người dùng đang gõ; giá trị lọc có thể được trì hoãn bằng debounce.

  const [query, setQuery] = useState('')
  // CHỨC NĂNG: Đánh dấu ô tìm kiếm còn trống khi gửi để hiển thị gợi ý nhập.

  const [searchRequired, setSearchRequired] = useState(false)
  // CHỨC NĂNG: Tham chiếu ô tìm kiếm để đưa con trỏ về khi người dùng gửi từ khóa rỗng.

  const searchInput = useRef<HTMLInputElement>(null)
  // CHỨC NĂNG: Các danh mục đang được chọn để lọc danh sách.

  const [selected, setSelected] = useState<Category[]>([])
  // CHỨC NĂNG: Ghi nhận ảnh lỗi để chuyển sang giao diện thay thế.

  const [failedImage, setFailedImage] = useState(false)

  // CHỨC NĂNG: Tham chiếu vùng thẻ cuộn ngang để đo kích thước và điều khiển cuộn.

  const carousel = useRef<HTMLDivElement>(null)
  // CHỨC NĂNG: Trạng thái tràn nội dung và vị trí hai đầu để bật/tắt nút cuộn phù hợp.

  const [carouselState, setCarouselState] = useState({
    overflow: false,
    atStart: true,
    atEnd: true,
  })

  const categories = [...new Set(data.places.map(categoryOf))]

  // CHỨC NĂNG: Chọn danh mục cập nhật ngay cả thẻ nổi bật và danh sách bên dưới.
  // XỬ LÝ: Không dùng từ khóa chưa gửi để tránh lọc ngoài ý muốn khi đang gõ.

  const featured = useMemo(
    () =>
      data.places.filter(
        (place) => place.featured && (!selected.length || selected.includes(categoryOf(place))),
      ),
    [data.places, selected],
  )

  // CHỨC NĂNG: Chỉ hiện mũi tên khi có nội dung thật sự tràn chiều ngang.
  // XỬ LÝ: Đổi danh mục về đầu carousel; đo lại khi resize và khóa nút ở hai đầu.
  // CHỨC NĂNG: Đo vùng thẻ nổi bật, xác định nội dung có tràn và carousel đang ở hai đầu hay
  // chưa.
  // XỬ LÝ: Reset về đầu khi dữ liệu đổi; theo dõi scroll/resize và ResizeObserver;
  // cleanup gỡ cả ba.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: featured,
  // data.loading, data.error.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => {
    const node = carousel.current

    const update = () => {
      const end = node ? Math.max(0, node.scrollWidth - node.clientWidth) : 0

      const next = {
        overflow: end > 1,
        atStart: !node || node.scrollLeft <= 1,

        atEnd: !node || node.scrollLeft >= end - 1,
      }

      setCarouselState((previous) =>
        previous.overflow === next.overflow &&
        previous.atStart === next.atStart &&
        previous.atEnd === next.atEnd
          ? previous
          : next,
      )
    }
    // TẠI SAO (update): Kích thước vùng cuộn thay đổi theo màn hình và số thẻ; đo DOM thật để biết
    // mũi tên nào còn có thể cuộn.

    if (!node) {
      update()
      return
    }

    node.scrollLeft = 0

    update()

    node.addEventListener('scroll', update, { passive: true })

    window.addEventListener('resize', update)

    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : undefined

    observer?.observe(node)

    return () => {
      // Dọn đăng ký/timer: node.removeEventListener('scroll', update).
      node.removeEventListener('scroll', update)
      // Dọn đăng ký/timer: window.removeEventListener('resize', update).
      window.removeEventListener('resize', update)

      observer?.disconnect()
    }
  }, [featured, data.loading, data.error])
  // TẠI SAO: Chỉ hiện và bật mũi tên khi thật sự cuộn được; tránh nút cuộn vô hiệu hoặc listener
  // tăng sau mỗi lần đổi bộ lọc.

  // CHỨC NĂNG: Chuyển điều kiện tìm từ hero sang trang kết quả.
  // XỬ LÝ: URLSearchParams mã hóa từ khóa đúng, không tự ghép ký tự đặc biệt.

  const submit = () => {
    // CHỨC NĂNG: Yêu cầu nhập từ khóa khi gửi tìm kiếm.
    // XỬ LÝ: trim loại khoảng trắng; giữ nguyên trang và đưa con trỏ về ô nhập.

    if (!query.trim()) {
      // Cập nhật trạng thái qua setSearchRequired(true).
      setSearchRequired(true)

      searchInput.current?.focus()

      return
    }
    // Cập nhật trạng thái qua setSearchRequired(false).
    setSearchRequired(false)

    const params = new URLSearchParams()

    if (query.trim()) params.set('q', query.trim())

    if (selected[0]) params.set('category', selected[0])

    navigate('/places?' + params.toString())
  }
  // TẠI SAO (submit): Chặn từ khóa chỉ có khoảng trắng trước khi chuyển route để người dùng biết
  // cần nhập gì và giữ được điều kiện tìm hợp lệ.

  return (
    <>
      <section className="hero">
        <div className="hero-intro">
          <div className="hero-copy">
            <p className="eyebrow">{t('explore')}</p>
            <h1>{t('site')}</h1>
            <p className="hero-description">{t('heroSubtitle')}</p>
            <div className="hero-quick-actions">
              <Link className="button" to="/places">
                <Icon name="compass" />
                {t('startExplore')}
              </Link>
              <Link className="button secondary hero-map-link" to="/journey">
                <Icon name="map" />
                {t('jMap')}
              </Link>
            </div>
          </div>
          {/* CHỨC NĂNG: Ảnh có khung riêng, không đặt ô tìm kiếm hoặc chữ lên vùng ảnh khó đọc. */}
          <div className="hero-visual" aria-hidden="true">
            {!failedImage && (
              <img
                className="hero-image"
                src={resolvePlaceImage(HERO_IMAGE)}
                alt=""
                fetchPriority="high"
                decoding="async"
                onError={() => setFailedImage(true)}
              />
            )}
            <div className="hero-shade" />
          </div>
        </div>
        <div className="hero-tools">
          <form
            className="hero-search"
            onSubmit={(event) => {
              event.preventDefault()
              submit()
            }}
          >
            <Icon name="search" />

            <input
              ref={searchInput}
              type="search"
              aria-invalid={searchRequired}
              aria-describedby={searchRequired ? 'hero-search-error' : undefined}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                if (event.target.value.trim()) setSearchRequired(false)
              }}
              aria-label={t('search')}
              placeholder={t('search')}
            />

            <button type="submit">
              <Icon name="search" />
              {t('searchButton')}
            </button>
          </form>

          {searchRequired && (
            <p id="hero-search-error" className="hero-search-error" role="alert">
              {t('searchRequired')}
            </p>
          )}

          <CategoryChips categories={categories} selected={selected} onSelect={setSelected} />
        </div>
      </section>

      <section className="heritage-welcome" aria-label={t('heritageExperience')}>
        <div>
          <span className="heritage-kicker">{t('heritageTag')}</span>
          <h2>{t('heritageExperience')}</h2>
          <p>{t('heritageExperienceHint')}</p>
        </div>
        <div className="heritage-steps">
          <Link to="/places">
            <Icon name="landmark" />
            <span>{t('discoverStep')}</span>
            <Icon name="arrow" />
          </Link>
          <Link to="/places">
            <Icon name="headphones" />
            <span>{t('listenStep')}</span>
            <Icon name="arrow" />
          </Link>
          <Link to="/journey">
            <Icon name="map" />
            <span>{t('gpsStep')}</span>
            <Icon name="arrow" />
          </Link>
        </div>
      </section>
      <section className="panel featured-panel">
        <div className="section-title">
          <div>
            <h2>{t('featured')}</h2>
            <p>{t('featuredHint')}</p>
          </div>

          <Link to="/places">{t('viewAll')} →</Link>
        </div>

        {data.loading ? (
          <State message="loading" busy />
        ) : data.error ? (
          <State
            message="loadError"
            retry={() => {
              void data.reload()
            }}
          />
        ) : !featured.length ? (
          // CHỨC NĂNG: Không để khung trắng khi danh mục có địa điểm nhưng không có điểm nổi bật.
          // XỬ LÝ: Không tự gắn nhãn nổi bật cho điểm thường; danh sách bên dưới vẫn giữ lọc.
          <div className="featured-empty" role="status">
            <Icon name="search" />
            <div>
              <strong>{t('featuredEmpty')}</strong>
              <p>{t('featuredEmptyHint')}</p>
            </div>
            {!!selected.length && (
              <button className="secondary" onClick={() => setSelected([])}>
                {t('clearAll')}
              </button>
            )}
          </div>
        ) : (
          <div className="carousel-wrap">
            <div ref={carousel} className="featured-carousel">
              {featured.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>

            {carouselState.overflow && (
              <div className="carousel-actions">
                <button
                  className="icon-button"
                  aria-label={t('previous')}
                  disabled={carouselState.atStart}
                  onClick={() =>
                    carousel.current?.scrollBy({
                      left: -280,
                      behavior: 'smooth',
                    })
                  }
                >
                  ‹
                </button>

                <button
                  className="icon-button"
                  aria-label={t('next')}
                  disabled={carouselState.atEnd}
                  onClick={() =>
                    carousel.current?.scrollBy({
                      left: 280,
                      behavior: 'smooth',
                    })
                  }
                >
                  ›
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      <Catalogue data={data} categorySelection={selected} onCategorySelectionChange={setSelected} />
    </>
  )
}
// TẠI SAO (HomePage): Chặn từ khóa chỉ có khoảng trắng trước khi chuyển route để người dùng biết
// cần nhập gì và giữ được điều kiện tìm hợp lệ.
