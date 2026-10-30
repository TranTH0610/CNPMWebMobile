/**
 * FILE NÀY LÀM GÌ
 * Trang thông báo route không tồn tại và đưa người dùng quay về khu vực hợp lệ.
 *
 * VỊ TRÍ: apps/web/src/pages/NotFoundPage.tsx
 * DÙNG BỞI: apps/web/src/navigation/AdminRoutes.tsx; apps/web/src/navigation/AppRoutes.tsx.
 * PHỤ THUỘC: react-router-dom; ../i18n; ../components/State
 * TẠI SAO TÁCH FILE: Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua lớp
 * dùng chung.
 */
// Nhập các thành phần từ 'react-router-dom'.
import { Link } from 'react-router-dom'
// Nhập các thành phần từ '../i18n'.
import { useText } from '../i18n'
// Nhập các thành phần từ '../components/State'.
import { State } from '../components/State'

// CHỨC NĂNG: Trang thông báo route không tồn tại và đưa người dùng quay về khu vực hợp lệ.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo NotFoundPage(). Component hàm nhận props và dựng phần giao diện NotFoundPage. | Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn. | Trả cây giao diện của component để React hiển thị. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính message: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Đặt đường dẫn mở khi người dùng bấm liên kết.
export function NotFoundPage() { const t = useText(); return <section className="panel"><State message="notFound" /><Link to="/places">{t('back')}</Link></section> }
// TẠI SAO (NotFoundPage): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua
// lớp dùng chung.
