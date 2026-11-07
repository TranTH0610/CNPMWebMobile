/**
 * CHỨC NĂNG: [DINH-VI] [THUYET-MINH]
 * VAI TRÒ: GIAO DIỆN WEB
 *
 * FILE NÀY LÀM GÌ:
 * Trình bày các điểm tham quan trên bản đồ và nối thao tác chọn điểm với luồng hành trình của nền tảng.
 *
 * VỊ TRÍ: apps/web/src/features/journey/components/BanDoThamQuan.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/features/journey/pages/TrangHanhTrinh.tsx
 *
 * PHỤ THUỘC:
 * - react
 * - react-router-dom
 * - leaflet
 * - @travelguide/visitor-core
 * - ../../language/i18n/CauHinhNgonNgu
 * - ../../language/hooks/useDuKhach
 * - ../hooks/useHanhTrinh
 * - @travelguide/visitor-core/journey/data
 * - leaflet/dist/leaflet.css
 *
 * CÁC KHỐI CHÍNH:
 * 1. VisitorMap
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import { publishedText } from '@travelguide/visitor-core'
import { useText } from '../../language/i18n/CauHinhNgonNgu'
import { useVisitor } from '../../language/hooks/useDuKhach'
import { useJourney } from '../hooks/useHanhTrinh'
import { mapPointFor } from '@travelguide/visitor-core/journey/data'
import 'leaflet/dist/leaflet.css'

// CHỨC NĂNG: Trình bày các điểm tham quan trên bản đồ và nối thao tác chọn điểm với luồng hành
// trình của nền tảng.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.

// ==================== [DINH-VI] [THUYET-MINH] VisitorMap ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function VisitorMap({ selected }: { selected: string | null }) {
  const element = useRef<HTMLDivElement>(null)

  const [failed, setFailed] = useState(false)

  const t = useText()

  const mapRef = useRef<L.Map | null>(null)

  const userLayer = useRef<L.LayerGroup | null>(null)

  const { state } = useJourney(),
    { language } = useVisitor(),
    navigate = useNavigate()

  const open = useCallback((id: string) => navigate('/places/' + id), [navigate])
  // TẠI SAO (open): Controller cần thời lượng và các thao tác thật từ nền tảng; tách adapter giúp
  // giữ chung nghiệp vụ web/native.
  // CHỨC NĂNG: Tạo bản đồ Leaflet, lớp nền và các marker của danh mục hiện tại.
  // XỬ LÝ: Tên marker dùng textContent; click gọi open(place.id). Cleanup gỡ bản đồ của
  // lần tạo trước.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: state.places,
  // selected, language, open.
  // LƯU Ý VỀ open: So sánh tham chiếu hàm; nếu cha tạo hàm mới, effect có thể chạy lại dù ID chưa
  // đổi.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => {
    if (!element.current) return

    const map = L.map(element.current, { zoomAnimation: false }).setView([16.468, 107.578], 17)

    mapRef.current = map

    userLayer.current = L.layerGroup().addTo(map)

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    })
      .on('tileerror', () => setFailed(true))
      .addTo(map)

    state.places.forEach((place) => {
      const point = mapPointFor(place)

      if (!point) return
      // Gán title bằng publishedText(place, language)?.title; nếu null hoặc undefined thì dùng place.canonicalTitle.
      const title = publishedText(place, language)?.title ?? place.canonicalTitle

      const label = document.createElement('span')
      label.textContent = title
      // CHỨC NĂNG: Marker là nút HTML thật, bấm chuột hoặc Enter đều mở chi tiết.
      // XỬ LÝ: Không chèn tên từ API bằng innerHTML; tránh vùng bấm SVG quá nhỏ.

      const button = document.createElement('button')

      button.type = 'button'
      button.textContent = '●'
      button.setAttribute('aria-label', title)

      button.style.cssText =
        'width:44px;height:44px;padding:0;border-radius:50%;background:var(--background);color:var(--primary);border:2px solid var(--primary);font-size:20px;cursor:pointer'

      if (selected === place.id) button.style.backgroundColor = 'var(--soft)'

      button.addEventListener('click', (event) => {
        event.stopPropagation()
        open(place.id)
      })

      L.marker([point.lat, point.lng], {
        keyboard: false,

        icon: L.divIcon({ html: button, className: '', iconSize: [44, 44], iconAnchor: [22, 22] }),
      })
        .addTo(map)
        .bindTooltip(label)

      if (selected === place.id) map.setView([point.lat, point.lng], 18)
    })

    return () => {
      map.remove()
      mapRef.current = null
      userLayer.current = null
    }
  }, [state.places, selected, language, open])
  // TẠI SAO: Marker phải khớp dữ liệu/ngôn ngữ/điểm chọn; tạo mới mà không gỡ map cũ sẽ giữ DOM và
  // listener thừa.
  // CHỨC NĂNG: Xóa marker vị trí khách cũ; nếu có state.fix thì vẽ lại marker ở tọa độ mới.
  // XỬ LÝ: Dùng userLayer riêng để không xóa marker của các di tích.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: state.fix,
  // state.places, selected, language, open.
  // LƯU Ý VỀ open: So sánh tham chiếu hàm; nếu cha tạo hàm mới, effect có thể chạy lại dù ID chưa
  // đổi.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => {
    userLayer.current?.clearLayers()

    if (state.fix && userLayer.current)
      L.circleMarker([state.fix.lat, state.fix.lng], { radius: 9, color: '#16813c' }).addTo(
        userLayer.current,
      )
  }, [state.fix, state.places, selected, language, open])
  // TẠI SAO: Vị trí khách di chuyển cần cập nhật, không để nhiều dấu vị trí cũ tồn tại đồng thời.

  return (
    <>
      {failed && <p role="alert">{t('loadError')}</p>}
      <div
        ref={element}
        role="region"
        aria-label={t('jMap')}
        style={{ height: 360, width: '100%' }}
      />
    </>
  )
}
// TẠI SAO (VisitorMap): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
// tại một nơi.
