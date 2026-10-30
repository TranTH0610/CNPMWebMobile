/**
 * FILE NÀY LÀM GÌ
 * Trình bày các điểm tham quan trên bản đồ và nối thao tác chọn điểm với luồng hành trình của nền
 * tảng.
 *
 * VỊ TRÍ: apps/web/src/components/VisitorMap.tsx
 * DÙNG BỞI: apps/web/src/pages/JourneyPage.tsx.
 * PHỤ THUỘC: react; react-router-dom; leaflet; @travelguide/visitor-core; ../i18n/index;
 * ../hooks/useVisitor; ../hooks/useJourney; @travelguide/visitor-core/journey/data;
 * leaflet/dist/leaflet.css
 * TẠI SAO TÁCH FILE: Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
 * tại một nơi.
 */
// Nhập các thành phần từ 'react'.
import { useCallback, useEffect, useRef, useState } from 'react'
// Nhập các thành phần từ 'react-router-dom'.
import { useNavigate } from 'react-router-dom'
// Nhập các thành phần từ 'leaflet'.
import L from 'leaflet'
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { publishedText } from '@travelguide/visitor-core'
// Nhập các thành phần từ '../i18n/index'.
import { useText } from '../i18n/index'
// Nhập các thành phần từ '../hooks/useVisitor'.
import { useVisitor } from '../hooks/useVisitor'
// Nhập các thành phần từ '../hooks/useJourney'.
import { useJourney } from '../hooks/useJourney'
// Nhập các thành phần từ '@travelguide/visitor-core/journey/data'.
import { mapPointFor } from '@travelguide/visitor-core/journey/data'
// Nhập các thành phần từ 'leaflet/dist/leaflet.css'.
import 'leaflet/dist/leaflet.css'

// CHỨC NĂNG: Trình bày các điểm tham quan trên bản đồ và nối thao tác chọn điểm với luồng hành
// trình của nền tảng.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo VisitorMap({ selected }). Component hàm nhận props và dựng phần giao diện VisitorMap. | Khai báo selected, kiểu string | null.
export function VisitorMap({ selected }: { selected: string | null }) {
  // Khai báo element: useRef giữ tham chiếu qua render mà thay đổi current không tự yêu cầu render lại.
  const element = useRef<HTMLDivElement>(null)
  // Khai báo [failed, setFailed]: useState(false) giữ trạng thái qua các lần render.
  const [failed, setFailed] = useState(false)
  // Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
  const t = useText()
  // Khai báo mapRef: useRef giữ tham chiếu qua render mà thay đổi current không tự yêu cầu render lại.
  const mapRef = useRef<L.Map | null>(null)
  // Khai báo userLayer: useRef giữ tham chiếu qua render mà thay đổi current không tự yêu cầu render lại.
  const userLayer = useRef<L.LayerGroup | null>(null)
  // Khai báo { state }: useJourney() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình | Khai báo { language }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình | Khai báo navigate: useNavigate() lấy bộ điều hướng của nền tảng để chuyển màn theo sự kiện.
  const { state } = useJourney(), { language } = useVisitor(), navigate = useNavigate()
  // Khai báo open: useCallback giữ tham chiếu hàm theo phụ thuộc.
  const open = useCallback((id: string) => navigate('/places/' + id), [navigate])
  // TẠI SAO (open): Controller cần thời lượng và các thao tác thật từ nền tảng; tách adapter giúp
  // giữ chung nghiệp vụ web/native.
  // DÒNG NÀY LÀM GÌ: Tạo bản đồ Leaflet, lớp nền và các marker của danh mục hiện tại.
  // CÁCH HOẠT ĐỘNG: Tên marker dùng textContent; click gọi open(place.id). Cleanup gỡ bản đồ của
  // lần tạo trước.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: state.places,
  // selected, language, open.
  // LƯU Ý VỀ open: So sánh tham chiếu hàm; nếu cha tạo hàm mới, effect có thể chạy lại dù ID chưa
  // đổi.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => {
    // Rẽ nhánh nếu !element.current. | Thoát hàm hiện tại ngay.
    if (!element.current) return
    // Khai báo map: Gọi L.map(element.current, { zoomAnimation: false }).setView([16.468, 107.578], 17). | Gán thuộc tính zoomAnimation: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    const map = L.map(element.current, { zoomAnimation: false }).setView([16.468, 107.578], 17)
    // Thực hiện tính biểu thức mapRef.current = map.
    mapRef.current = map
    // Thực hiện tính biểu thức userLayer.current = L.layerGroup().addTo(map).
    userLayer.current = L.layerGroup().addTo(map)
    // Đăng ký xử lý sự kiện: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors', maxZoom: 19. | Gán thuộc tính attribution: chuỗi '© OpenStreetMap contributors'. | Gán thuộc tính maxZoom: giá trị số 19.
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors', maxZoom: 19 }).on('tileerror', () => setFailed(true)).addTo(map)
    // Đăng ký xử lý sự kiện: state.places.forEach(place => { const point = mapPointFor(place) if (!point) return const title = publishedText(place, l.
    state.places.forEach(place => {
      // Khai báo point: Gọi mapPointFor(place).
      const point = mapPointFor(place)
      // Rẽ nhánh nếu !point. | Thoát hàm hiện tại ngay.
      if (!point) return
      // Gán title bằng publishedText(place, language)?.title; nếu null hoặc undefined thì dùng place.canonicalTitle.
      const title = publishedText(place, language)?.title ?? place.canonicalTitle
      // Khai báo label: Gọi document.createElement('span'). | Thực hiện tính biểu thức label.textContent = title.
      const label = document.createElement('span'); label.textContent = title
      // CHỨC NĂNG: Marker là nút HTML thật, bấm chuột hoặc Enter đều mở chi tiết.
      // XỬ LÝ: Không chèn tên từ API bằng innerHTML; tránh vùng bấm SVG quá nhỏ.
      // Khai báo button: Gọi document.createElement('button').
      const button = document.createElement('button')
      // Thực hiện tính biểu thức button.type = 'button'. | Thực hiện tính biểu thức button.textContent = '●'. | Thực hiện Gọi button.setAttribute('aria-label', title).
      button.type = 'button'; button.textContent = '●'; button.setAttribute('aria-label', title)
      // Thực hiện tính biểu thức button.style.cssText = 'width:30px.
      button.style.cssText = 'width:30px;height:30px;padding:0;border-radius:50%;background:white;color:#0759c7;border:2px solid #0759c7;font-size:20px;cursor:pointer'
      // Rẽ nhánh nếu selected === place.id. | Thực hiện tính biểu thức button.style.backgroundColor = '#dbeafe'.
      if (selected === place.id) button.style.backgroundColor = '#dbeafe'
      // Đăng ký xử lý sự kiện: button.addEventListener('click', event => { event.stopPropagation(). | Thực hiện Gọi event.stopPropagation(). | Thực hiện Gọi open(place.id).
      button.addEventListener('click', event => { event.stopPropagation(); open(place.id) })
      // Thực hiện Gọi L.marker([point.lat, point.lng], { keyboard: false, icon: L.divIcon({ html: button, classN. | Gán thuộc tính keyboard: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
      L.marker([point.lat, point.lng], { keyboard: false,
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `icon: L.divIcon({ html: button, className: '', iconSize: [30, 30], iconAnchor: [15, 1`: Gán thuộc tính icon: Gọi L.divIcon({ html: button, className: '', iconSize: [30, 30], iconAnchor: [15, 15] }). | Gán thuộc tính html: sử dụng button làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính className: chuỗi ''. | Gán thuộc tính iconSize: tạo mảng [30, 30]. | Gán thuộc tính iconAnchor: tạo mảng [15, 15].
         * DÒNG `.addTo(map).bindTooltip(label)`: Thực hiện Gọi L.marker([point.lat, point.lng], { keyboard: false, icon: L.divIcon({ html: button, classN.
         */
        icon: L.divIcon({ html: button, className: '', iconSize: [30, 30], iconAnchor: [15, 15] }) })
        .addTo(map).bindTooltip(label)
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `if (selected === place.id) map.setView([point.lat, point.lng], 18)`: Rẽ nhánh nếu selected === place.id. | Thực hiện Gọi map.setView([point.lat, point.lng], 18).
       * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      if (selected === place.id) map.setView([point.lat, point.lng], 18)
    })
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return () => { map.remove(); mapRef.current = null; userLayer.current = null }`: Trả kết quả: khai báo callback () => { map.remove(). | Thực hiện Gọi map.remove(). | Thực hiện tính biểu thức mapRef.current = null. | Thực hiện tính biểu thức userLayer.current = null.
     * DÒNG `}, [state.places, selected, language, open])`: Đăng ký useEffect để thực hiện tác vụ sau render.
     */
    return () => { map.remove(); mapRef.current = null; userLayer.current = null }
  }, [state.places, selected, language, open])
  // TẠI SAO: Marker phải khớp dữ liệu/ngôn ngữ/điểm chọn; tạo mới mà không gỡ map cũ sẽ giữ DOM và
  // listener thừa.
  // DÒNG NÀY LÀM GÌ: Xóa marker vị trí khách cũ; nếu có state.fix thì vẽ lại marker ở tọa độ mới.
  // CÁCH HOẠT ĐỘNG: Dùng userLayer riêng để không xóa marker của các di tích.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: state.fix,
  // state.places, selected, language, open.
  // LƯU Ý VỀ open: So sánh tham chiếu hàm; nếu cha tạo hàm mới, effect có thể chạy lại dù ID chưa
  // đổi.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => {
    // Thực hiện Gọi userLayer.current?.clearLayers().
    userLayer.current?.clearLayers()
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `if (state.fix && userLayer.current) L.circleMarker([state.fix.lat, state.fix.lng], { `: Rẽ nhánh nếu state.fix && userLayer.current. | Thực hiện Gọi L.circleMarker([state.fix.lat, state.fix.lng], { radius: 9, color: '#16813c' }).addTo(user. | Gán thuộc tính radius: giá trị số 9. | Gán thuộc tính color: chuỗi '#16813c'.
     * DÒNG `}, [state.fix, state.places, selected, language, open])`: Đăng ký useEffect để thực hiện tác vụ sau render.
     */
    if (state.fix && userLayer.current) L.circleMarker([state.fix.lat, state.fix.lng], { radius: 9, color: '#16813c' }).addTo(userLayer.current)
  }, [state.fix, state.places, selected, language, open])
  // TẠI SAO: Vị trí khách di chuyển cần cập nhật, không để nhiều dấu vị trí cũ tồn tại đồng thời.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return <>{failed && <p role="alert">{t('loadError')}</p>}<div ref={element} role="reg`: Trả cây giao diện của component để React hiển thị. | Thuộc tính role: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính ref: giữ tham chiếu đến phần tử/đối tượng để focus hoặc đo kích thước. | Thuộc tính aria-label: cung cấp tên truy cập cho nút/ô nhập. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính height: giá trị số 360. | Gán thuộc tính width: chuỗi '100%'.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return <>{failed && <p role="alert">{t('loadError')}</p>}<div ref={element} role="region" aria-label={t('jMap')} style={{ height: 360, width: '100%' }} /></>
}
// TẠI SAO (VisitorMap): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
// tại một nơi.
