/**
 * FILE NÀY LÀM GÌ
 * Các biểu tượng SVG dùng lại trong website du khách.
 *
 * VỊ TRÍ: apps/web/src/components/Icon.tsx
 * DÙNG BỞI: apps/web/src/components/index.ts; apps/web/src/components/JourneyPlayer.tsx;
 * apps/web/src/components/ListenButton.tsx; và các nơi import khác.
 * TẠI SAO TÁCH FILE: Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
 * tại một nơi.
 */
// CHỨC NĂNG: Icon SVG nhỏ để không thêm framework UI.
// XỬ LÝ: Icon trang trí ẩn với trình đọc màn hình;
// nút bên ngoài có aria-label đã dịch.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function Icon({`: Khai báo Icon({ name, }). Component hàm nhận props và dựng phần giao diện Icon.
 * DÒNG `name,`: Nhận đầu vào { name, }: { name: 'search' | 'pin' | 'arrow' | 'grid' | 'list' | 'qr' | 'play' | 'pause' | 're từ nơi gọi hàm.
 * DÒNG `}: {`: Nhận đầu vào { name, }: { name: 'search' | 'pin' | 'arrow' | 'grid' | 'list' | 'qr' | 'play' | 'pause' | 're từ nơi gọi hàm.
 */
export function Icon({
  name,
}: {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `name: 'search' | 'pin' | 'arrow' | 'grid' | 'list' | 'qr' | 'play' | 'pause' | 'repla`: Khai báo name, kiểu 'search' | 'pin' | 'arrow' | 'grid' | 'list' | 'qr' | 'play' | 'pause' | 'r.
   * DÒNG `}) {`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  name: 'search' | 'pin' | 'arrow' | 'grid' | 'list' | 'qr' | 'play' | 'pause' | 'replay' | 'backward' | 'forward' | 'headphones'
}) {
  // Khai báo paths: tạo object gồm play, pause, replay, backward, forward, headphones, search, pin, arrow.
  const paths = {
    // Gán thuộc tính play: sử dụng <path d="m9 5 11 7-11 7Z" fill="currentColor" strokeLinejoin="round" /> làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Thuộc tính d: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính fill: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính strokeLinejoin: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
    play: <path d="m9 5 11 7-11 7Z" fill="currentColor" strokeLinejoin="round" />,
    // Gán thuộc tính pause: sử dụng <><path d="M7 5h3v14H7zM14 5h3v14h-3z" fill="currentColor" /></> làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Thuộc tính d: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính fill: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
    pause: <><path d="M7 5h3v14H7zM14 5h3v14h-3z" fill="currentColor" /></>,
    // Gán thuộc tính replay: sử dụng <><path d="M4 10a8 8 0 1 1 1 8M4 4v6h6" /></> làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Thuộc tính d: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
    replay: <><path d="M4 10a8 8 0 1 1 1 8M4 4v6h6" /></>,
    // Gán thuộc tính backward: sử dụng <><path d="M4 10a8 8 0 1 1 1 8M4 4v6h6" /><text x="12" y="16" textAnchor="middle" fontSize làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Thuộc tính d: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính x: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính y: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính textAnchor: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính fontSize: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính stroke: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính fill: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính fontFamily: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
    backward: <><path d="M4 10a8 8 0 1 1 1 8M4 4v6h6" /><text x="12" y="16" textAnchor="middle" fontSize="8" stroke="none" fill="currentColor" fontFamily="system-ui">10</text></>,
    // Gán thuộc tính forward: sử dụng <><path d="M20 10a8 8 0 1 0-1 8M20 4v6h-6" /><text x="12" y="16" textAnchor="middle" fontS làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Thuộc tính d: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính x: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính y: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính textAnchor: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính fontSize: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính stroke: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính fill: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính fontFamily: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
    forward: <><path d="M20 10a8 8 0 1 0-1 8M20 4v6h-6" /><text x="12" y="16" textAnchor="middle" fontSize="8" stroke="none" fill="currentColor" fontFamily="system-ui">10</text></>,
    // Gán thuộc tính headphones: sử dụng <><path d="M4 14v-3a8 8 0 0 1 16 0v3" /><rect x="3" y="11" width="4" height="9" rx="2" />< làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Thuộc tính d: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính x: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính y: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính width: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính height: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính rx: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
    headphones: <><path d="M4 14v-3a8 8 0 0 1 16 0v3" /><rect x="3" y="11" width="4" height="9" rx="2" /><rect x="17" y="11" width="4" height="9" rx="2" /></>,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `search: (`: Gán thuộc tính search: sử dụng ( <> <circle cx="10" cy="10" r="6" /> <path d="m15 15 5 5" /> </> ) làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `<>`: Gán thuộc tính search: sử dụng ( <> <circle cx="10" cy="10" r="6" /> <path d="m15 15 5 5" /> </> ) làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `<circle cx="10" cy="10" r="6" />`: Dựng circle. | Thuộc tính cx: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính cy: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính r: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
     * DÒNG `<path d="m15 15 5 5" />`: Dựng path. | Thuộc tính d: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
     * DÒNG `</>`: Gán thuộc tính search: sử dụng ( <> <circle cx="10" cy="10" r="6" /> <path d="m15 15 5 5" /> </> ) làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `),`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     */
    search: (
      <>
        <circle cx="10" cy="10" r="6" />
        <path d="m15 15 5 5" />
      </>
    ),
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `pin: (`: Gán thuộc tính pin: sử dụng ( <> <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" /> <circle cx="12" cy="10" r làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `<>`: Gán thuộc tính pin: sử dụng ( <> <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" /> <circle cx="12" cy="10" r làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" />`: Dựng path. | Thuộc tính d: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
     * DÒNG `<circle cx="12" cy="10" r="2" />`: Dựng circle. | Thuộc tính cx: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính cy: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính r: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
     * DÒNG `</>`: Gán thuộc tính pin: sử dụng ( <> <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" /> <circle cx="12" cy="10" r làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `),`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     */
    pin: (
      <>
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    // Gán thuộc tính arrow: sử dụng <path d="m9 5 7 7-7 7M4 12h12" /> làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Thuộc tính d: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
    arrow: <path d="m9 5 7 7-7 7M4 12h12" />,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `grid: (`: Gán thuộc tính grid: sử dụng ( <> <rect x="3" y="3" width="6" height="6" rx="1" /> <rect x="15" y="3" width="6" height= làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `<>`: Gán thuộc tính grid: sử dụng ( <> <rect x="3" y="3" width="6" height="6" rx="1" /> <rect x="15" y="3" width="6" height= làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `<rect x="3" y="3" width="6" height="6" rx="1" />`: Dựng rect. | Thuộc tính x: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính y: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính width: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính height: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính rx: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
     * DÒNG `<rect x="15" y="3" width="6" height="6" rx="1" />`: Dựng rect. | Thuộc tính x: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính y: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính width: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính height: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính rx: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
     * DÒNG `<rect x="3" y="15" width="6" height="6" rx="1" />`: Dựng rect. | Thuộc tính x: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính y: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính width: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính height: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính rx: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
     * DÒNG `<rect x="15" y="15" width="6" height="6" rx="1" />`: Dựng rect. | Thuộc tính x: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính y: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính width: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính height: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính rx: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
     * DÒNG `</>`: Gán thuộc tính grid: sử dụng ( <> <rect x="3" y="3" width="6" height="6" rx="1" /> <rect x="15" y="3" width="6" height= làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `),`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     */
    grid: (
      <>
        <rect x="3" y="3" width="6" height="6" rx="1" />
        <rect x="15" y="3" width="6" height="6" rx="1" />
        <rect x="3" y="15" width="6" height="6" rx="1" />
        <rect x="15" y="15" width="6" height="6" rx="1" />
      </>
    ),
    // Gán thuộc tính list: sử dụng <path d="M3 5h2m4 0h12M3 12h2m4 0h12M3 19h2m4 0h12" /> làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Thuộc tính d: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
    list: <path d="M3 5h2m4 0h12M3 12h2m4 0h12M3 19h2m4 0h12" />,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `qr: (`: Gán thuộc tính qr: sử dụng ( <> <path d="M3 8V3h5m8 0h5v5M3 16v5h5m8 0h5v-5M9 9h6v6H9Z" /> </> ) làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `<>`: Gán thuộc tính qr: sử dụng ( <> <path d="M3 8V3h5m8 0h5v5M3 16v5h5m8 0h5v-5M9 9h6v6H9Z" /> </> ) làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `<path d="M3 8V3h5m8 0h5v5M3 16v5h5m8 0h5v-5M9 9h6v6H9Z" />`: Dựng path. | Thuộc tính d: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
     * DÒNG `</>`: Gán thuộc tính qr: sử dụng ( <> <path d="M3 8V3h5m8 0h5v5M3 16v5h5m8 0h5v-5M9 9h6v6H9Z" /> </> ) làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `),`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    qr: (
      <>
        <path d="M3 8V3h5m8 0h5v5M3 16v5h5m8 0h5v-5M9 9h6v6H9Z" />
      </>
    ),
  }

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<svg`: Dựng svg.
   * DÒNG `aria-hidden="true"`: Thuộc tính aria-hidden: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `viewBox="0 0 24 24"`: Thuộc tính viewBox: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `width="19"`: Thuộc tính width: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `height="19"`: Thuộc tính height: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `fill="none"`: Thuộc tính fill: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `stroke="currentColor"`: Thuộc tính stroke: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `strokeWidth="1.7"`: Thuộc tính strokeWidth: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `strokeLinecap="round"`: Thuộc tính strokeLinecap: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `strokeLinejoin="round"`: Thuộc tính strokeLinejoin: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `>`: Dựng svg.
   * DÒNG `{paths[name]}`: Đưa biểu thức JavaScript paths[name] vào JSX.
   * DÒNG `</svg>`: Đóng phần giao diện svg.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}
// TẠI SAO (Icon): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện tại
// một nơi.
