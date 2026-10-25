/**
 * FILE NÀY LÀM GÌ: Danh sách di tích quản lý có tìm kiếm, ảnh và nhãn trạng thái.
 * AdminRoutes gọi tại /admin/places; dùng service qua useAdmin, PlaceImage và normalize.
 * UC13. Thẻ ảnh gọn trên desktop, tự về một cột trên điện thoại.
 */
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { normalize } from '@travelguide/visitor-core'
import { useDebounce } from '@travelguide/visitor-core/react'
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
import { PlaceImage } from '../../components/PlaceImage'
import { Feedback, Status } from '../../components/admin/AdminUI'
import { AdminIcon } from '../../components/admin/AdminIcon'
export function AdminPlacesPage() {
 const state = useAdmin(), t = useAdminText(), [query,setQuery] = useState('')
 // CHỨC NĂNG: Chờ gõ xong rồi tìm không dấu; chỉ lọc lại khi dữ liệu/từ khóa đổi.
 // XỬ LÝ: Không ẩn di tích đã lưu trữ để người quản lý còn xem và xử lý được.
 const search = useDebounce(query)
 const places = useMemo(() => state.data?.places.filter(p => normalize(p.record.canonicalTitle).includes(normalize(search))) ?? [], [state.data,search])
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
/* CÁCH KIỂM TRA: Gõ ky dai; xóa từ khóa; tìm rỗng; các nút mở đúng id và trạng thái vẫn đủ nhãn. */
