/**
 * FILE NÀY LÀM GÌ
 * Tập biểu tượng dùng trong giao diện quản trị web để các trang dùng thống nhất.
 *
 * VỊ TRÍ: apps/web/src/components/admin/AdminIcon.tsx
 * DÙNG BỞI: apps/web/src/layouts/AdminLayout.tsx; apps/web/src/pages/admin/ContentEditorPage.tsx;
 * apps/web/src/pages/admin/DashboardPage.tsx; và các nơi import khác.
 * TẠI SAO TÁCH FILE: Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
 * tại một nơi.
 */
// Đặt tên kiểu AdminIconName.
export type AdminIconName = 'dashboard' | 'places' | 'review' | 'users' | 'qr' | 'plus' | 'arrow' | 'search' | 'close' | 'edit' | 'content' | 'pin' | 'image' | 'save'
// CHỨC NĂNG: Vẽ icon bằng một hệ nét và kích thước thống nhất.
// XỬ LÝ: SVG dùng currentColor để tự đổi theo nút đang chọn hoặc nền xanh.
// Khai báo AdminIcon({name}). Component hàm nhận props và dựng phần giao diện AdminIcon. | Khai báo name, kiểu AdminIconName.
export function AdminIcon({name}: {name: AdminIconName}) {
 // Khai báo paths: tạo object gồm dashboard, places, review, users, qr, plus, arrow, search, close.
 const paths = {
  // Gán thuộc tính dashboard: sử dụng <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" r làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Thuộc tính x: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính y: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính width: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính height: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính rx: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
  // Gán thuộc tính places: sử dụng <><path d="m3 9 9-6 9 6M4 21h16M6 10v7m6-7v7m6-7v7M3 18h18"/></> làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Thuộc tính d: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  places: <><path d="m3 9 9-6 9 6M4 21h16M6 10v7m6-7v7m6-7v7M3 18h18"/></>,
  // Gán thuộc tính review: sử dụng <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z"/><path d="m8 12 3 3 5-6"/></> làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Thuộc tính d: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  review: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z"/><path d="m8 12 3 3 5-6"/></>,
  // Gán thuộc tính users: sử dụng <><circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m2-17a3 3 0 0 1 0 6m1 4a5 làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Thuộc tính cx: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính cy: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính r: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính d: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  users: <><circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m2-17a3 3 0 0 1 0 6m1 4a5 5 0 0 1 3 4v3"/></>,
  // Gán thuộc tính qr: sử dụng <><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" r làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Thuộc tính x: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính y: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính width: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính height: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính rx: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính d: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  qr: <><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><path d="M15 15h3v3h3v3h-6m6-6v-3M3 12h9V3"/></>,
  // Gán thuộc tính plus: sử dụng <path d="M12 5v14M5 12h14"/> làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Thuộc tính d: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  plus: <path d="M12 5v14M5 12h14"/>,
  // Gán thuộc tính arrow: sử dụng <path d="m9 5 7 7-7 7M4 12h12"/> làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Thuộc tính d: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  arrow: <path d="m9 5 7 7-7 7M4 12h12"/>,
  // Gán thuộc tính search: sử dụng <><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></> làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Thuộc tính cx: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính cy: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính r: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính d: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  search: <><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></>,
  // Gán thuộc tính close: sử dụng <path d="m6 6 12 12M6 18 18 6"/> làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Thuộc tính d: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  close: <path d="m6 6 12 12M6 18 18 6"/>,
  // Gán thuộc tính edit: sử dụng <><path d="m4 16 12-12 4 4L8 20H4Zm9-9 4 4"/></> làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Thuộc tính d: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  edit: <><path d="m4 16 12-12 4 4L8 20H4Zm9-9 4 4"/></>,
  // Gán thuộc tính content: sử dụng <><path d="M14 3H5v18h14V8Zm0 0v5h5M8 12h8m-8 4h6"/></> làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Thuộc tính d: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  content: <><path d="M14 3H5v18h14V8Zm0 0v5h5M8 12h8m-8 4h6"/></>,
  // Gán thuộc tính pin: sử dụng <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2"/ làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Thuộc tính d: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính cx: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính cy: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính r: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2"/></>,
  // Gán thuộc tính image: sử dụng <><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1"/><path d="m làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Thuộc tính x: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính y: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính width: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính height: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính rx: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính cx: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính cy: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính r: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính d: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  image: <><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1"/><path d="m3 17 5-5 4 4 4-6 5 7"/></>,
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `save: <><path d="M4 3h13l4 4v14H3V3Zm3 0v6h9V3M7 21v-7h10v7"/></>,`: Gán thuộc tính save: sử dụng <><path d="M4 3h13l4 4v14H3V3Zm3 0v6h9V3M7 21v-7h10v7"/></> làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Thuộc tính d: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  save: <><path d="M4 3h13l4 4v14H3V3Zm3 0v6h9V3M7 21v-7h10v7"/></>,
 }
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none"`: Trả cây giao diện của component để React hiển thị. | Thuộc tính aria-hidden: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính viewBox: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính width: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính height: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính fill: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính stroke: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính strokeWidth: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính strokeLinecap: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính strokeLinejoin: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}
// TẠI SAO (AdminIcon): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
// tại một nơi.
/* CÁCH KIỂM TRA: Icon trên menu/nút cùng hệ nét; tên chức năng vẫn đọc được khi ẩn SVG. */
