/**
 * FILE NÀY LÀM GÌ
 * Trang giới thiệu của website du khách; nội dung giao diện đi qua bộ dịch chung.
 *
 * VỊ TRÍ: apps/web/src/pages/AboutPage.tsx
 * DÙNG BỞI: apps/web/src/navigation/AppRoutes.tsx.
 * PHỤ THUỘC: ../i18n
 * TẠI SAO TÁCH FILE: Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua lớp
 * dùng chung.
 */
// Nhập các thành phần từ '../i18n'.
import { useText } from '../i18n'

// CHỨC NĂNG: Trang giới thiệu của website du khách; nội dung giao diện đi qua bộ dịch chung.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo AboutPage(). Component hàm nhận props và dựng phần giao diện AboutPage. | Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn. | Trả cây giao diện của component để React hiển thị. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
export function AboutPage() { const t = useText(); return <section className="panel detail"><h1>{t('site')}</h1><p>{t('intro')}</p><p>{t('noAccount')}</p><p>{t('demo')}</p></section> }
// TẠI SAO (AboutPage): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua lớp
// dùng chung.
