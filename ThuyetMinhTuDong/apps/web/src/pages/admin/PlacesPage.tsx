/**
 * FILE NÀY LÀM GÌ
 * Trang danh sách địa điểm. Bản du khách đọc điều kiện route và dùng Catalogue; bản admin quản lý
 * danh sách di tích.
 *
 * VỊ TRÍ: apps/web/src/pages/admin/PlacesPage.tsx
 * DÙNG BỞI: apps/web/src/navigation/AdminRoutes.tsx.
 * PHỤ THUỘC: react; react-router-dom; @travelguide/visitor-core; @travelguide/visitor-core/react;
 * @travelguide/admin-core/react; ../../components/PlaceImage; ../../components/admin/AdminUI;
 * ../../components/admin/AdminIcon
 * TẠI SAO TÁCH FILE: Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua lớp
 * dùng chung.
 */
// Nhập các thành phần từ 'react'.
import { useMemo, useState } from 'react'
// Nhập các thành phần từ 'react-router-dom'.
import { Link } from 'react-router-dom'
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { normalize } from '@travelguide/visitor-core'
// Nhập các thành phần từ '@travelguide/visitor-core/react'.
import { useDebounce } from '@travelguide/visitor-core/react'
// Nhập các thành phần từ '@travelguide/admin-core/react'.
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
// Nhập các thành phần từ '../../components/PlaceImage'.
import { PlaceImage } from '../../components/PlaceImage'
// Nhập các thành phần từ '../../components/admin/AdminUI'.
import { Feedback, Status } from '../../components/admin/AdminUI'
// Nhập các thành phần từ '../../components/admin/AdminIcon'.
import { AdminIcon } from '../../components/admin/AdminIcon'
// CHỨC NĂNG: Trang danh sách địa điểm.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo AdminPlacesPage(). Component hàm nhận props và dựng phần giao diện AdminPlacesPage.
export function AdminPlacesPage() {
 // CHỨC NĂNG: Từ khóa người dùng đang gõ; giá trị lọc có thể được trì hoãn bằng debounce.
 // Khai báo state: useAdmin() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình | Khai báo t: useAdminText() lấy hàm dịch từ provider ngôn ngữ đang chọn | Khai báo [query,setQuery]: useState('') giữ trạng thái qua các lần render.
 const state = useAdmin(), t = useAdminText(), [query,setQuery] = useState('')
 // CHỨC NĂNG: Chờ gõ xong rồi tìm không dấu; chỉ lọc lại khi dữ liệu/từ khóa đổi.
 // XỬ LÝ: Không ẩn di tích đã lưu trữ để người quản lý còn xem và xử lý được.
 // Khai báo search: Gọi useDebounce(query).
 const search = useDebounce(query)
 // Khai báo places: useMemo lưu kết quả theo mảng phụ thuộc.
 const places = useMemo(() => state.data?.places.filter(p => normalize(p.record.canonicalTitle).includes(normalize(search))) ?? [], [state.data,search])
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return <><div className="admin-page-title"><div><h1>{t('places')}</h1><p>{t('catalogH`: Trả cây giao diện của component để React hiển thị. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Đặt đường dẫn mở khi người dùng bấm liên kết. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<Feedback state={state}/>`: Dựng Feedback. | Thuộc tính state: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<div className="admin-list-toolbar"><div className="admin-search-wrap"><AdminIcon nam`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái. | Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái. | Thuộc tính placeholder: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính aria-label: cung cấp tên truy cập cho nút/ô nhập. | Thuộc tính onClick: nối thao tác bấm với callback. | Thuộc tính role: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `<div className="admin-place-grid">{places.map(place => <article className="admin-plac`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách.
  * DÒNG `<div className="admin-place-cover"><PlaceImage uri={place.record.images[0]} title={pl`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Truyền địa chỉ tài nguyên vào component. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái.
  * DÒNG `<div className="admin-place-info"><span className="admin-revision">{t('revision')}: {`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
  * DÒNG `<div className="admin-actions"><Link className="button secondary" to={'/admin/places/`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Đặt đường dẫn mở khi người dùng bấm liên kết. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `</div></article>)}</div>`: Đóng phần giao diện div.
  * DÒNG `{!state.loading&&!state.error&&!places.length&&<div className="admin-card admin-empty`: Đưa biểu thức JavaScript !state.loading&&!state.error&&!places.length&&<div className="admin-card admin-empty"><AdminIcon name="search" vào JSX. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onClick: nối thao tác bấm với callback.
  * DÒNG `</>`: Trả cây giao diện của component để React hiển thị.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return <><div className="admin-page-title"><div><h1>{t('places')}</h1><p>{t('catalogHint')}</p></div><Link className="button" to="/admin/places/new"><AdminIcon name="plus"/>{t('new')}</Link></div>
  <Feedback state={state}/>
  <div className="admin-list-toolbar"><div className="admin-search-wrap"><AdminIcon name="search"/><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={t('search')} aria-label={t('search')}/>{query&&<button type="button" className="secondary admin-clear-search" aria-label={t('clearSearch')} onClick={()=>setQuery('')}><AdminIcon name="close"/></button>}</div><span className="admin-result-count" role="status">{places.length} {t('places')}</span></div>
  <div className="admin-place-grid">{places.map(place => <article className="admin-place-card" key={place.id}>
   <div className="admin-place-cover"><PlaceImage uri={place.record.images[0]} title={place.record.canonicalTitle}/><Status value={place.workflow}/></div>
   <div className="admin-place-info"><span className="admin-revision">{t('revision')}: {place.revision}</span><h2>{place.record.canonicalTitle}</h2>{place.period&&<p>{place.period}</p>}
    <div className="admin-actions"><Link className="button secondary" to={'/admin/places/' + place.id + '/edit'}><AdminIcon name="edit"/>{t('edit')}</Link><Link className="button" to={'/admin/places/' + place.id + '/content'}><AdminIcon name="content"/>{t('content')}</Link></div>
   </div></article>)}</div>
  {!state.loading&&!state.error&&!places.length&&<div className="admin-card admin-empty"><AdminIcon name="search"/><h2>{t('empty')}</h2>{query&&<button className="secondary" onClick={()=>setQuery('')}>{t('clearSearch')}</button>}</div>}
 </>
}
// TẠI SAO (AdminPlacesPage): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi
// qua lớp dùng chung.
/* CÁCH KIỂM TRA: Gõ ky dai; xóa từ khóa; tìm rỗng; các nút mở đúng id và trạng thái vẫn đủ nhãn. */
