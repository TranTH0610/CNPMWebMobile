/**
 * FILE: apps/web/src/shared/pages/TrangKhongTimThay.tsx
 * FILE NÀY LÀM GÌ: Trang thông báo route không tồn tại và đưa người dùng quay về khu vực hợp lệ.
 * VAI TRÒ: Giao diện Web; gọi hook/service để xử lý nghiệp vụ.
 * UC: Hỗ trợ chung; không thực hiện một UC độc lập.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { Link } from 'react-router-dom'
import { useText } from '../../features/language/i18n/CauHinhNgonNgu'
import { State } from '../components/TrangThaiDuLieu'

// CHỨC NĂNG: Trang thông báo route không tồn tại và đưa người dùng quay về khu vực hợp lệ.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.

// [HỖ TRỢ CHUNG] NotFoundPage — Trang thông báo route không tồn tại và đưa người dùng quay về khu vực hợp lệ.
export function NotFoundPage() {
  const t = useText()
  return (
    <section className="panel">
      <State message="notFound" />
      <Link to="/places">{t('back')}</Link>
    </section>
  )
}
// TẠI SAO (NotFoundPage): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua
// lớp dùng chung.
