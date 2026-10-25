/**
 * FILE NÀY LÀM GÌ: Bộ icon SVG cho quản lý, dùng bởi layout và các trang Admin.
 * Không thêm thư viện; icon trang trí được ẩn với trình đọc màn hình.
 * Liên quan UC12–UC17; nhãn chức năng nằm ở nút/liên kết gọi icon.
 */
export type AdminIconName = 'dashboard' | 'places' | 'review' | 'users' | 'qr' | 'plus' | 'arrow' | 'search' | 'close' | 'edit' | 'content' | 'pin' | 'image' | 'save'
// CHỨC NĂNG: Vẽ icon bằng một hệ nét và kích thước thống nhất.
// XỬ LÝ: SVG dùng currentColor để tự đổi theo nút đang chọn hoặc nền xanh.
export function AdminIcon({name}: {name: AdminIconName}) {
 const paths = {
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
  places: <><path d="m3 9 9-6 9 6M4 21h16M6 10v7m6-7v7m6-7v7M3 18h18"/></>,
  review: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z"/><path d="m8 12 3 3 5-6"/></>,
  users: <><circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m2-17a3 3 0 0 1 0 6m1 4a5 5 0 0 1 3 4v3"/></>,
  qr: <><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><path d="M15 15h3v3h3v3h-6m6-6v-3M3 12h9V3"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  arrow: <path d="m9 5 7 7-7 7M4 12h12"/>,
  search: <><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></>,
  close: <path d="m6 6 12 12M6 18 18 6"/>,
  edit: <><path d="m4 16 12-12 4 4L8 20H4Zm9-9 4 4"/></>,
  content: <><path d="M14 3H5v18h14V8Zm0 0v5h5M8 12h8m-8 4h6"/></>,
  pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2"/></>,
  image: <><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1"/><path d="m3 17 5-5 4 4 4-6 5 7"/></>,
  save: <><path d="M4 3h13l4 4v14H3V3Zm3 0v6h9V3M7 21v-7h10v7"/></>,
 }
 return <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}
/* CÁCH KIỂM TRA: Icon trên menu/nút cùng hệ nét; tên chức năng vẫn đọc được khi ẩn SVG. */
