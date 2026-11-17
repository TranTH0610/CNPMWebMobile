/**
 * FILE: apps/web/src/features/journey/components/BanDoThamQuan.tsx
 * FILE NÀY LÀM GÌ: Trình bày các điểm tham quan trên bản đồ và nối thao tác chọn điểm với luồng hành trình của nền tảng.
 * VAI TRÒ: Giao diện Web; gọi hook/service để xử lý nghiệp vụ.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC08: Xem bản đồ, tuyến tham quan và tìm đường.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
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

// [UC08] VisitorMap — Hiển thị marker, vị trí và các thao tác chọn di tích/mở bản đồ ngoài.
export function VisitorMap({ selected }: { selected: string | null }) {
  const element = useRef<HTMLDivElement>(null)

  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)

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
  // selected, language, open.
  // LƯU Ý VỀ open: So sánh tham chiếu hàm; nếu cha tạo hàm mới, effect có thể chạy lại dù ID chưa
  // đổi.
  useEffect(() => {
    if (!element.current) return

    // CHỨC NĂNG: Mỗi lần thử lại xóa lỗi cũ và tạo lớp bản đồ mới.
    setFailed(false)
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
  }, [state.places, selected, language, open, attempt])
  // TẠI SAO: Marker phải khớp dữ liệu/ngôn ngữ/điểm chọn; tạo mới mà không gỡ map cũ sẽ giữ DOM và
  // listener thừa.
  // CHỨC NĂNG: Xóa marker vị trí khách cũ; nếu có state.fix thì vẽ lại marker ở tọa độ mới.
  // XỬ LÝ: Dùng userLayer riêng để không xóa marker của các di tích.
  // state.places, selected, language, open.
  // LƯU Ý VỀ open: So sánh tham chiếu hàm; nếu cha tạo hàm mới, effect có thể chạy lại dù ID chưa
  // đổi.
  useEffect(() => {
    userLayer.current?.clearLayers()

    if (state.fix && userLayer.current)
      L.circleMarker([state.fix.lat, state.fix.lng], { radius: 9, color: '#16813c' }).addTo(
        userLayer.current,
      )
  }, [state.fix, state.places, selected, language, open, attempt])
  // TẠI SAO: Vị trí khách di chuyển cần cập nhật, không để nhiều dấu vị trí cũ tồn tại đồng thời.

  return (
    <>
      {failed && (
        <div role="alert">
          <p>{t('jMapFailed')}</p>
          <button type="button" onClick={() => setAttempt(value => value + 1)}>{t('jRetry')}</button>
        </div>
      )}
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
