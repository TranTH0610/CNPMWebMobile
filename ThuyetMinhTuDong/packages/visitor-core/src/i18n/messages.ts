/**
 * FILE NÀY LÀM GÌ
 * Tài nguyên chuỗi cơ bản du khách theo ngôn ngữ; i18n tra khóa để các nền tảng hiển thị thống
 * nhất.
 *
 * VỊ TRÍ: packages/visitor-core/src/i18n/messages.ts
 * DÙNG BỞI: packages/visitor-core/src/index.ts; packages/visitor-core/src/react/react.tsx.
 * PHỤ THUỘC: ./heritage-messages; ./qr-messages; ./journey-messages; ../domain/model; ./uiMessages
 * TẠI SAO TÁCH FILE: Tập trung ngôn ngữ tại đây giúp cùng một khóa luôn có cùng cách dịch trên
 * các màn.
 */
// Nhập các thành phần từ './heritage-messages'.
import { heritageMessages } from './heritage-messages'
/**
 * FILE NÀY LÀM GÌ:
 * Chứa chữ giao diện UC01–UC11 của năm ngôn ngữ.
 * createVisitorI18n trong react.tsx dùng file này.
 * Phụ thuộc type Language trong model.ts.
 */
// Nhập các thành phần từ './qr-messages'.
import { qrMessages } from './qr-messages'

// Nhập các thành phần từ './journey-messages'.
import { journeyMessages } from './journey-messages'


// CHỨC NĂNG: Nhập kiểu ngôn ngữ hợp lệ.
// XỬ LÝ: Không dùng mã ngôn ngữ tùy ý.
// Nhập kiểu dữ liệu từ '../domain/model'.
import type { Language } from '../domain/model'
// CHỨC NĂNG: Bổ sung nhãn UI mới.
// XỬ LÝ: Ghép vào resource hiện tại, giữ các khóa UC01–UC11 đã có.
// Nhập các thành phần từ './uiMessages'.
import { uiMessages } from './uiMessages'
// CHỨC NĂNG: Khai báo bộ khóa chuẩn bằng tiếng Việt.
// XỬ LÝ: Đây là chữ UI; nội dung từng địa điểm nằm trong dữ liệu.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `const vi = {`: Khai báo vi: tạo object gồm ...giá trị ghép, ...giá trị ghép, ...giá trị ghép, ...giá trị ghép, brand, explore, intro, demo, language.
 * DÒNG `...heritageMessages.vi, ...qrMessages.vi, ...journeyMessages.vi, ...uiMessages.vi,`: Khai báo vi: tạo object gồm ...giá trị ghép, ...giá trị ghép, ...giá trị ghép, ...giá trị ghép, brand, explore, intro, demo, language.
 */
const vi = {
  ...heritageMessages.vi, ...qrMessages.vi, ...journeyMessages.vi,  ...uiMessages.vi,
  // Gán thuộc tính brand: chuỗi 'HueGuide'.
  brand: 'HueGuide',
  // Gán thuộc tính explore: chuỗi 'Khám phá'.
  explore: 'Khám phá',
  // Gán thuộc tính intro: chuỗi 'Các điểm trong danh mục tham quan Kinh thành Huế'.
  intro: 'Các điểm trong danh mục tham quan Kinh thành Huế',
  // Gán thuộc tính demo: chuỗi 'Dữ liệu minh họa cho đồ án.
  demo: 'Dữ liệu minh họa cho đồ án; chưa phải nội dung đã duyệt của đơn vị quản lý di tích.',
  // Gán thuộc tính language: chuỗi 'Ngôn ngữ'.
  language: 'Ngôn ngữ',
  // Gán thuộc tính search: chuỗi 'Tìm tên công trình, địa chỉ hoặc nội dung...'.
  search: 'Tìm tên công trình, địa chỉ hoặc nội dung...',
  // Gán thuộc tính all: chuỗi 'Tất cả'.
  all: 'Tất cả',
  // Gán thuộc tính zone: chuỗi 'Nhóm di tích'.
  zone: 'Nhóm di tích',
  // Gán thuộc tính zone_fortifications: chuỗi 'Thành và cổng'.
  zone_fortifications: 'Thành và cổng',
  // Gán thuộc tính zone_ceremonial: chuỗi 'Công trình nghi lễ'.
  zone_ceremonial: 'Công trình nghi lễ',
  // Gán thuộc tính sort: chuỗi 'Sắp xếp'.
  sort: 'Sắp xếp',
  // Gán thuộc tính name: chuỗi 'Theo tên'.
  name: 'Theo tên',
  // Gán thuộc tính nearest: chuỗi 'Gần nhất'.
  nearest: 'Gần nhất',
  // Gán thuộc tính location: chuỗi 'Lấy vị trí của tôi'.
  location: 'Lấy vị trí của tôi',
  // Gán thuộc tính locationDenied: chuỗi 'Không lấy được vị trí. Bạn vẫn dùng được danh sách và QR.'.
  locationDenied: 'Không lấy được vị trí. Bạn vẫn dùng được danh sách và QR.',
  // Gán thuộc tính distance: chuỗi 'Khoảng cách'.
  distance: 'Khoảng cách',
  // Gán thuộc tính orderFallback: chuỗi 'Chưa có đủ vị trí/tọa độ xác nhận.
  orderFallback: 'Chưa có đủ vị trí/tọa độ xác nhận; đang sắp xếp theo tên.',
  // Gán thuộc tính loading: chuỗi 'Đang tải...'.
  loading: 'Đang tải...',
  // Gán thuộc tính retry: chuỗi 'Thử lại'.
  retry: 'Thử lại',
  // Gán thuộc tính loadError: chuỗi 'Không tải được dữ liệu. Vui lòng thử lại.'.
  loadError: 'Không tải được dữ liệu. Vui lòng thử lại.',
  // Gán thuộc tính empty: chuỗi 'Không có kết quả'.
  empty: 'Không có kết quả',
  // Gán thuộc tính emptyHint: chuỗi 'Thử từ khóa khác hoặc xóa bộ lọc.'.
  emptyHint: 'Thử từ khóa khác hoặc xóa bộ lọc.',
  // Gán thuộc tính reset: chuỗi 'Xóa điều kiện'.
  reset: 'Xóa điều kiện',
  // Gán thuộc tính noImage: chuỗi 'Chưa có ảnh'.
  noImage: 'Chưa có ảnh',
  // Gán thuộc tính missing: chuỗi 'Chưa có bản nội dung đã công bố bằng ngôn ngữ này.'.
  missing: 'Chưa có bản nội dung đã công bố bằng ngôn ngữ này.',
  // Gán thuộc tính missingList: chuỗi 'Một số điểm chưa có bản công bố theo ngôn ngữ hiện tại.
  missingList: 'Một số điểm chưa có bản công bố theo ngôn ngữ hiện tại; tìm kiếm chỉ xét bản có sẵn.',
  // Gán thuộc tính available: chuỗi 'Bản ngôn ngữ đã công bố'.
  available: 'Bản ngôn ngữ đã công bố',
  // Gán thuộc tính details: chuỗi 'Chi tiết địa điểm'.
  details: 'Chi tiết địa điểm',
  // Gán thuộc tính back: chuỗi 'Quay lại danh sách'.
  back: 'Quay lại danh sách',
  // Gán thuộc tính notFound: chuỗi 'Địa điểm không tồn tại hoặc không còn công bố.'.
  notFound: 'Địa điểm không tồn tại hoặc không còn công bố.',
  // Gán thuộc tính version: chuỗi 'Phiên bản nội dung'.
  version: 'Phiên bản nội dung',
  // Gán thuộc tính unverified: chuỗi 'Vị trí điểm chưa được quản lý xác nhận.'.
  unverified: 'Vị trí điểm chưa được quản lý xác nhận.',
  // Gán thuộc tính coordinates: chuỗi 'Tọa độ đã xác nhận'.
  coordinates: 'Tọa độ đã xác nhận',
  // Gán thuộc tính scan: chuỗi 'Quét QR'.
  scan: 'Quét QR',
  // Gán thuộc tính scanHint: chuỗi 'Đưa mã QR điểm di tích vào khung. Quét thành công chỉ mở bài, không tự phát.'.
  scanHint: 'Đưa mã QR điểm di tích vào khung. Quét thành công chỉ mở bài, không tự phát.',
  // Gán thuộc tính cameraInfo: chuỗi 'Cho phép camera để quét QR. Bạn vẫn có thể chọn địa điểm từ danh sách.'.
  cameraInfo: 'Cho phép camera để quét QR. Bạn vẫn có thể chọn địa điểm từ danh sách.',
  // Gán thuộc tính allowCamera: chuỗi 'Cho phép camera'.
  allowCamera: 'Cho phép camera',
  // Gán thuộc tính cameraDenied: chuỗi 'Camera chưa được cấp quyền.'.
  cameraDenied: 'Camera chưa được cấp quyền.',
  // Gán thuộc tính systemSettings: chuỗi 'Mở cài đặt thiết bị'.
  systemSettings: 'Mở cài đặt thiết bị',
  // Gán thuộc tính cameraFailed: chuỗi 'Không khởi động được camera.'.
  cameraFailed: 'Không khởi động được camera.',
  // Gán thuộc tính invalidQr: chuỗi 'QR không đúng định dạng hoặc không thuộc hệ thống.'.
  invalidQr: 'QR không đúng định dạng hoặc không thuộc hệ thống.',
  // Gán thuộc tính again: chuỗi 'Quét lại'.
  again: 'Quét lại',
  // Gán thuộc tính enterQr: chuỗi 'Dán liên kết QR để kiểm tra'.
  enterQr: 'Dán liên kết QR để kiểm tra',
  // Gán thuộc tính openQr: chuỗi 'Mở địa điểm'.
  openQr: 'Mở địa điểm',
  // Gán thuộc tính qrLink: chuỗi 'Liên kết QR của điểm'.
  qrLink: 'Liên kết QR của điểm',
  // Gán thuộc tính qrWebHint: chuỗi 'Quét QR chung bằng camera điện thoại để mở danh sách điểm tham quan trên website.'.
  qrWebHint: 'Quét QR chung bằng camera điện thoại để mở danh sách điểm tham quan trên website.',
  // Gán thuộc tính saveError: chuỗi 'Không lưu được ngôn ngữ. Lựa chọn vẫn có hiệu lực trong phiên này.'.
  saveError: 'Không lưu được ngôn ngữ. Lựa chọn vẫn có hiệu lực trong phiên này.',
  // Gán thuộc tính readError: chuỗi 'Không đọc được lựa chọn đã lưu.
  readError: 'Không đọc được lựa chọn đã lưu; đang dùng ngôn ngữ thiết bị hoặc tiếng Việt.',
  // Gán thuộc tính previous: chuỗi 'Trước'.
  previous: 'Trước',
  // Gán thuộc tính next: chuỗi 'Sau'.
  next: 'Sau',
  // Gán thuộc tính page: chuỗi 'Trang'.
  page: 'Trang',
  // Gán thuộc tính results: chuỗi 'Kết quả'.
  results: 'Kết quả',
  // Gán thuộc tính published: chuỗi 'Bản công bố mô phỏng'.
  published: 'Bản công bố mô phỏng',
  // Gán thuộc tính read: chuỗi 'Bài thuyết minh'.
  read: 'Bài thuyết minh',
  // Gán thuộc tính locationBusy: chuỗi 'Đang lấy vị trí...'.
  locationBusy: 'Đang lấy vị trí...',
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `close: 'Đóng',`: Gán thuộc tính close: chuỗi 'Đóng'.
   * DÒNG `} as const`: Khai báo vi: tạo object gồm ...giá trị ghép, ...giá trị ghép, ...giá trị ghép, ...giá trị ghép, brand, explore, intro, demo, language.
   */
  close: 'Đóng',
} as const

// Đặt tên kiểu MessageKey.
export type MessageKey = keyof typeof vi

// CHỨC NĂNG: Bắt buộc các ngôn ngữ còn lại có cùng bộ khóa.
// XỬ LÝ: Thêm khóa vào vi mà quên en/cn/pt/ja sẽ bị TypeScript báo.
// Đặt tên kiểu Messages.
type Messages = Record<MessageKey, string>

/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `const en: Messages = {`: Khai báo en: tạo object gồm ...giá trị ghép, ...giá trị ghép, ...giá trị ghép, ...giá trị ghép, brand, explore, intro, demo, language.
 * DÒNG `...heritageMessages.en, ...qrMessages.en, ...journeyMessages.en, ...uiMessages.en,`: Khai báo en: tạo object gồm ...giá trị ghép, ...giá trị ghép, ...giá trị ghép, ...giá trị ghép, brand, explore, intro, demo, language.
 */
const en: Messages = {
  ...heritageMessages.en, ...qrMessages.en, ...journeyMessages.en,  ...uiMessages.en,
  // Gán thuộc tính brand: chuỗi 'HueGuide'.
  brand: 'HueGuide',
  // Gán thuộc tính explore: chuỗi 'Explore'.
  explore: 'Explore',
  // Gán thuộc tính intro: chuỗi 'Selected places in the Hue Citadel visitor catalogue'.
  intro: 'Selected places in the Hue Citadel visitor catalogue',
  // Gán thuộc tính demo: chuỗi 'Coursework sample data.
  demo: 'Coursework sample data; not content approved by the actual heritage management authority.',
  // Gán thuộc tính language: chuỗi 'Language'.
  language: 'Language',
  // Gán thuộc tính search: chuỗi 'Search building names, addresses or content...'.
  search: 'Search building names, addresses or content...',
  // Gán thuộc tính all: chuỗi 'All'.
  all: 'All',
  // Gán thuộc tính zone: chuỗi 'Place group'.
  zone: 'Place group',
  // Gán thuộc tính zone_fortifications: chuỗi 'Walls and gates'.
  zone_fortifications: 'Walls and gates',
  // Gán thuộc tính zone_ceremonial: chuỗi 'Ceremonial buildings'.
  zone_ceremonial: 'Ceremonial buildings',
  // Gán thuộc tính sort: chuỗi 'Sort'.
  sort: 'Sort',
  // Gán thuộc tính name: chuỗi 'Name'.
  name: 'Name',
  // Gán thuộc tính nearest: chuỗi 'Nearest'.
  nearest: 'Nearest',
  // Gán thuộc tính location: chuỗi 'Get my location'.
  location: 'Get my location',
  // Gán thuộc tính locationDenied: chuỗi 'Location is unavailable. The list and QR remain available.'.
  locationDenied: 'Location is unavailable. The list and QR remain available.',
  // Gán thuộc tính distance: chuỗi 'Distance'.
  distance: 'Distance',
  // Gán thuộc tính orderFallback: chuỗi 'Location or verified coordinates are missing.
  orderFallback: 'Location or verified coordinates are missing; sorting by name.',
  // Gán thuộc tính loading: chuỗi 'Loading...'.
  loading: 'Loading...',
  // Gán thuộc tính retry: chuỗi 'Try again'.
  retry: 'Try again',
  // Gán thuộc tính loadError: chuỗi 'Could not load the data. Please try again.'.
  loadError: 'Could not load the data. Please try again.',
  // Gán thuộc tính empty: chuỗi 'No results'.
  empty: 'No results',
  // Gán thuộc tính emptyHint: chuỗi 'Try another keyword or clear the filters.'.
  emptyHint: 'Try another keyword or clear the filters.',
  // Gán thuộc tính reset: chuỗi 'Clear conditions'.
  reset: 'Clear conditions',
  // Gán thuộc tính noImage: chuỗi 'No image available'.
  noImage: 'No image available',
  // Gán thuộc tính missing: chuỗi 'No published content is available in this language.'.
  missing: 'No published content is available in this language.',
  // Gán thuộc tính missingList: chuỗi 'Some places lack a published version in this language.
  missingList: 'Some places lack a published version in this language; search uses available versions only.',
  // Gán thuộc tính available: chuỗi 'Published languages'.
  available: 'Published languages',
  // Gán thuộc tính details: chuỗi 'Place details'.
  details: 'Place details',
  // Gán thuộc tính back: chuỗi 'Back to places'.
  back: 'Back to places',
  // Gán thuộc tính notFound: chuỗi 'This place does not exist or is no longer published.'.
  notFound: 'This place does not exist or is no longer published.',
  // Gán thuộc tính version: chuỗi 'Content version'.
  version: 'Content version',
  // Gán thuộc tính unverified: chuỗi 'The place location has not been confirmed by management.'.
  unverified: 'The place location has not been confirmed by management.',
  // Gán thuộc tính coordinates: chuỗi 'Verified coordinates'.
  coordinates: 'Verified coordinates',
  // Gán thuộc tính scan: chuỗi 'Scan QR'.
  scan: 'Scan QR',
  // Gán thuộc tính scanHint: chuỗi 'Place a site QR code inside the frame. Scanning opens the page without autoplay.'.
  scanHint: 'Place a site QR code inside the frame. Scanning opens the page without autoplay.',
  // Gán thuộc tính cameraInfo: chuỗi 'Allow camera access to scan QR codes. You can still select places from the list.'.
  cameraInfo: 'Allow camera access to scan QR codes. You can still select places from the list.',
  // Gán thuộc tính allowCamera: chuỗi 'Allow camera'.
  allowCamera: 'Allow camera',
  // Gán thuộc tính cameraDenied: chuỗi 'Camera access has not been granted.'.
  cameraDenied: 'Camera access has not been granted.',
  // Gán thuộc tính systemSettings: chuỗi 'Open device settings'.
  systemSettings: 'Open device settings',
  // Gán thuộc tính cameraFailed: chuỗi 'Could not start the camera.'.
  cameraFailed: 'Could not start the camera.',
  // Gán thuộc tính invalidQr: chuỗi 'Invalid QR format or a link outside this system.'.
  invalidQr: 'Invalid QR format or a link outside this system.',
  // Gán thuộc tính again: chuỗi 'Scan again'.
  again: 'Scan again',
  // Gán thuộc tính enterQr: chuỗi 'Paste a QR link to check'.
  enterQr: 'Paste a QR link to check',
  // Gán thuộc tính openQr: chuỗi 'Open place'.
  openQr: 'Open place',
  // Gán thuộc tính qrLink: chuỗi 'Place QR link'.
  qrLink: 'Place QR link',
  // Gán thuộc tính qrWebHint: chuỗi 'Scan the shared QR with your phone camera to open the visitor catalogue on the website.'.
  qrWebHint: 'Scan the shared QR with your phone camera to open the visitor catalogue on the website.',
  // Gán thuộc tính saveError: chuỗi 'Could not save the language. Your choice still applies to this session.'.
  saveError: 'Could not save the language. Your choice still applies to this session.',
  // Gán thuộc tính readError: chuỗi 'Could not read your saved language.
  readError: 'Could not read your saved language; using the device language or Vietnamese.',
  // Gán thuộc tính previous: chuỗi 'Previous'.
  previous: 'Previous',
  // Gán thuộc tính next: chuỗi 'Next'.
  next: 'Next',
  // Gán thuộc tính page: chuỗi 'Page'.
  page: 'Page',
  // Gán thuộc tính results: chuỗi 'Results'.
  results: 'Results',
  // Gán thuộc tính published: chuỗi 'Simulated published version'.
  published: 'Simulated published version',
  // Gán thuộc tính read: chuỗi 'Narration text'.
  read: 'Narration text',
  // Gán thuộc tính locationBusy: chuỗi 'Getting location...'.
  locationBusy: 'Getting location...',
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `close: 'Close',`: Gán thuộc tính close: chuỗi 'Close'.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  close: 'Close',
}

/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `const cn: Messages = {`: Khai báo cn: tạo object gồm ...giá trị ghép, ...giá trị ghép, ...giá trị ghép, ...giá trị ghép, brand, explore, intro, demo, language.
 * DÒNG `...heritageMessages.cn, ...qrMessages.cn, ...journeyMessages.cn, ...uiMessages.cn,`: Khai báo cn: tạo object gồm ...giá trị ghép, ...giá trị ghép, ...giá trị ghép, ...giá trị ghép, brand, explore, intro, demo, language.
 */
const cn: Messages = {
  ...heritageMessages.cn, ...qrMessages.cn, ...journeyMessages.cn,  ...uiMessages.cn,
  // Gán thuộc tính brand: chuỗi 'HueGuide'.
  brand: 'HueGuide',
  // Gán thuộc tính explore: chuỗi '探索'.
  explore: '探索',
  // Gán thuộc tính intro: chuỗi '顺化京城参观目录中的景点'.
  intro: '顺化京城参观目录中的景点',
  // Gán thuộc tính demo: chuỗi '课程演示数据，并非遗迹管理机构正式审核的内容。'.
  demo: '课程演示数据，并非遗迹管理机构正式审核的内容。',
  // Gán thuộc tính language: chuỗi '语言'.
  language: '语言',
  // Gán thuộc tính search: chuỗi '搜索建筑名称、地址或内容...'.
  search: '搜索建筑名称、地址或内容...',
  // Gán thuộc tính all: chuỗi '全部'.
  all: '全部',
  // Gán thuộc tính zone: chuỗi '遗迹分组'.
  zone: '遗迹分组',
  // Gán thuộc tính zone_fortifications: chuỗi '城墙与城门'.
  zone_fortifications: '城墙与城门',
  // Gán thuộc tính zone_ceremonial: chuỗi '礼仪建筑'.
  zone_ceremonial: '礼仪建筑',
  // Gán thuộc tính sort: chuỗi '排序'.
  sort: '排序',
  // Gán thuộc tính name: chuỗi '按名称'.
  name: '按名称',
  // Gán thuộc tính nearest: chuỗi '距离最近'.
  nearest: '距离最近',
  // Gán thuộc tính location: chuỗi '获取我的位置'.
  location: '获取我的位置',
  // Gán thuộc tính locationDenied: chuỗi '无法获取位置，仍可使用列表和二维码。'.
  locationDenied: '无法获取位置，仍可使用列表和二维码。',
  // Gán thuộc tính distance: chuỗi '距离'.
  distance: '距离',
  // Gán thuộc tính orderFallback: chuỗi '缺少位置或已确认的坐标，当前按名称排序。'.
  orderFallback: '缺少位置或已确认的坐标，当前按名称排序。',
  // Gán thuộc tính loading: chuỗi '正在加载...'.
  loading: '正在加载...',
  // Gán thuộc tính retry: chuỗi '重试'.
  retry: '重试',
  // Gán thuộc tính loadError: chuỗi '无法加载数据，请重试。'.
  loadError: '无法加载数据，请重试。',
  // Gán thuộc tính empty: chuỗi '没有结果'.
  empty: '没有结果',
  // Gán thuộc tính emptyHint: chuỗi '请尝试其他关键词或清除筛选。'.
  emptyHint: '请尝试其他关键词或清除筛选。',
  // Gán thuộc tính reset: chuỗi '清除条件'.
  reset: '清除条件',
  // Gán thuộc tính noImage: chuỗi '暂无图片'.
  noImage: '暂无图片',
  // Gán thuộc tính missing: chuỗi '此语言暂无已发布内容。'.
  missing: '此语言暂无已发布内容。',
  // Gán thuộc tính missingList: chuỗi '部分景点缺少此语言的发布版本，搜索仅使用已有版本。'.
  missingList: '部分景点缺少此语言的发布版本，搜索仅使用已有版本。',
  // Gán thuộc tính available: chuỗi '已发布语言'.
  available: '已发布语言',
  // Gán thuộc tính details: chuỗi '景点详情'.
  details: '景点详情',
  // Gán thuộc tính back: chuỗi '返回列表'.
  back: '返回列表',
  // Gán thuộc tính notFound: chuỗi '景点不存在或已停止发布。'.
  notFound: '景点不存在或已停止发布。',
  // Gán thuộc tính version: chuỗi '内容版本'.
  version: '内容版本',
  // Gán thuộc tính unverified: chuỗi '景点位置尚未由管理人员确认。'.
  unverified: '景点位置尚未由管理人员确认。',
  // Gán thuộc tính coordinates: chuỗi '已确认坐标'.
  coordinates: '已确认坐标',
  // Gán thuộc tính scan: chuỗi '扫描二维码'.
  scan: '扫描二维码',
  // Gán thuộc tính scanHint: chuỗi '将景点二维码放入框内，扫描后仅打开页面，不自动播放。'.
  scanHint: '将景点二维码放入框内，扫描后仅打开页面，不自动播放。',
  // Gán thuộc tính cameraInfo: chuỗi '允许使用相机扫描二维码，也可从列表选择景点。'.
  cameraInfo: '允许使用相机扫描二维码，也可从列表选择景点。',
  // Gán thuộc tính allowCamera: chuỗi '允许相机'.
  allowCamera: '允许相机',
  // Gán thuộc tính cameraDenied: chuỗi '尚未获得相机权限。'.
  cameraDenied: '尚未获得相机权限。',
  // Gán thuộc tính systemSettings: chuỗi '打开设备设置'.
  systemSettings: '打开设备设置',
  // Gán thuộc tính cameraFailed: chuỗi '无法启动相机。'.
  cameraFailed: '无法启动相机。',
  // Gán thuộc tính invalidQr: chuỗi '二维码格式错误或不属于本系统。'.
  invalidQr: '二维码格式错误或不属于本系统。',
  // Gán thuộc tính again: chuỗi '重新扫描'.
  again: '重新扫描',
  // Gán thuộc tính enterQr: chuỗi '粘贴二维码链接进行检查'.
  enterQr: '粘贴二维码链接进行检查',
  // Gán thuộc tính openQr: chuỗi '打开景点'.
  openQr: '打开景点',
  // Gán thuộc tính qrLink: chuỗi '景点二维码链接'.
  qrLink: '景点二维码链接',
  // Gán thuộc tính qrWebHint: chuỗi '使用手机相机扫描共用二维码，在网站打开景点列表。'.
  qrWebHint: '使用手机相机扫描共用二维码，在网站打开景点列表。',
  // Gán thuộc tính saveError: chuỗi '无法保存语言选择，本次会话仍使用此语言。'.
  saveError: '无法保存语言选择，本次会话仍使用此语言。',
  // Gán thuộc tính readError: chuỗi '无法读取已保存语言，使用设备语言或越南语。'.
  readError: '无法读取已保存语言，使用设备语言或越南语。',
  // Gán thuộc tính previous: chuỗi '上一页'.
  previous: '上一页',
  // Gán thuộc tính next: chuỗi '下一页'.
  next: '下一页',
  // Gán thuộc tính page: chuỗi '页'.
  page: '页',
  // Gán thuộc tính results: chuỗi '结果'.
  results: '结果',
  // Gán thuộc tính published: chuỗi '模拟发布版本'.
  published: '模拟发布版本',
  // Gán thuộc tính read: chuỗi '讲解文本'.
  read: '讲解文本',
  // Gán thuộc tính locationBusy: chuỗi '正在获取位置...'.
  locationBusy: '正在获取位置...',
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `close: '关闭',`: Gán thuộc tính close: chuỗi '关闭'.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  close: '关闭',
}

/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `const pt: Messages = {`: Khai báo pt: tạo object gồm ...giá trị ghép, ...giá trị ghép, ...giá trị ghép, ...giá trị ghép, brand, explore, intro, demo, language.
 * DÒNG `...heritageMessages.pt, ...qrMessages.pt, ...journeyMessages.pt, ...uiMessages.pt,`: Khai báo pt: tạo object gồm ...giá trị ghép, ...giá trị ghép, ...giá trị ghép, ...giá trị ghép, brand, explore, intro, demo, language.
 */
const pt: Messages = {
  ...heritageMessages.pt, ...qrMessages.pt, ...journeyMessages.pt,  ...uiMessages.pt,
  // Gán thuộc tính brand: chuỗi 'HueGuide'.
  brand: 'HueGuide',
  // Gán thuộc tính explore: chuỗi 'Explorar'.
  explore: 'Explorar',
  // Gán thuộc tính intro: chuỗi 'Locais selecionados no catálogo da Cidadela de Huế'.
  intro: 'Locais selecionados no catálogo da Cidadela de Huế',
  // Gán thuộc tính demo: chuỗi 'Dados de demonstração académica.
  demo: 'Dados de demonstração académica; não são conteúdos aprovados pela entidade gestora do património.',
  // Gán thuộc tính language: chuỗi 'Idioma'.
  language: 'Idioma',
  // Gán thuộc tính search: chuỗi 'Pesquisar nomes, endereços ou conteúdo...'.
  search: 'Pesquisar nomes, endereços ou conteúdo...',
  // Gán thuộc tính all: chuỗi 'Todos'.
  all: 'Todos',
  // Gán thuộc tính zone: chuỗi 'Grupo de locais'.
  zone: 'Grupo de locais',
  // Gán thuộc tính zone_fortifications: chuỗi 'Muralhas e portas'.
  zone_fortifications: 'Muralhas e portas',
  // Gán thuộc tính zone_ceremonial: chuỗi 'Edifícios cerimoniais'.
  zone_ceremonial: 'Edifícios cerimoniais',
  // Gán thuộc tính sort: chuỗi 'Ordenar'.
  sort: 'Ordenar',
  // Gán thuộc tính name: chuỗi 'Nome'.
  name: 'Nome',
  // Gán thuộc tính nearest: chuỗi 'Mais próximos'.
  nearest: 'Mais próximos',
  // Gán thuộc tính location: chuỗi 'Obter a minha localização'.
  location: 'Obter a minha localização',
  // Gán thuộc tính locationDenied: chuỗi 'Localização indisponível. A lista e os códigos QR continuam disponíveis.'.
  locationDenied: 'Localização indisponível. A lista e os códigos QR continuam disponíveis.',
  // Gán thuộc tính distance: chuỗi 'Distância'.
  distance: 'Distância',
  // Gán thuộc tính orderFallback: chuỗi 'Faltam localização ou coordenadas confirmadas.
  orderFallback: 'Faltam localização ou coordenadas confirmadas; ordenação por nome.',
  // Gán thuộc tính loading: chuỗi 'A carregar...'.
  loading: 'A carregar...',
  // Gán thuộc tính retry: chuỗi 'Tentar novamente'.
  retry: 'Tentar novamente',
  // Gán thuộc tính loadError: chuỗi 'Não foi possível carregar os dados. Tente novamente.'.
  loadError: 'Não foi possível carregar os dados. Tente novamente.',
  // Gán thuộc tính empty: chuỗi 'Sem resultados'.
  empty: 'Sem resultados',
  // Gán thuộc tính emptyHint: chuỗi 'Experimente outra palavra ou limpe os filtros.'.
  emptyHint: 'Experimente outra palavra ou limpe os filtros.',
  // Gán thuộc tính reset: chuỗi 'Limpar condições'.
  reset: 'Limpar condições',
  // Gán thuộc tính noImage: chuỗi 'Sem imagem'.
  noImage: 'Sem imagem',
  // Gán thuộc tính missing: chuỗi 'Não existe conteúdo publicado neste idioma.'.
  missing: 'Não existe conteúdo publicado neste idioma.',
  // Gán thuộc tính missingList: chuỗi 'Alguns locais não têm versão publicada neste idioma.
  missingList: 'Alguns locais não têm versão publicada neste idioma; a pesquisa usa apenas as versões disponíveis.',
  // Gán thuộc tính available: chuỗi 'Idiomas publicados'.
  available: 'Idiomas publicados',
  // Gán thuộc tính details: chuỗi 'Detalhes do local'.
  details: 'Detalhes do local',
  // Gán thuộc tính back: chuỗi 'Voltar à lista'.
  back: 'Voltar à lista',
  // Gán thuộc tính notFound: chuỗi 'O local não existe ou já não está publicado.'.
  notFound: 'O local não existe ou já não está publicado.',
  // Gán thuộc tính version: chuỗi 'Versão do conteúdo'.
  version: 'Versão do conteúdo',
  // Gán thuộc tính unverified: chuỗi 'A localização ainda não foi confirmada pela gestão.'.
  unverified: 'A localização ainda não foi confirmada pela gestão.',
  // Gán thuộc tính coordinates: chuỗi 'Coordenadas confirmadas'.
  coordinates: 'Coordenadas confirmadas',
  // Gán thuộc tính scan: chuỗi 'Ler QR'.
  scan: 'Ler QR',
  // Gán thuộc tính scanHint: chuỗi 'Coloque o QR do local no enquadramento. A leitura abre a página sem reprodução automática.
  scanHint: 'Coloque o QR do local no enquadramento. A leitura abre a página sem reprodução automática.',
  // Gán thuộc tính cameraInfo: chuỗi 'Permita a câmara para ler QR. Pode continuar a escolher locais na lista.'.
  cameraInfo: 'Permita a câmara para ler QR. Pode continuar a escolher locais na lista.',
  // Gán thuộc tính allowCamera: chuỗi 'Permitir câmara'.
  allowCamera: 'Permitir câmara',
  // Gán thuộc tính cameraDenied: chuỗi 'O acesso à câmara não foi concedido.'.
  cameraDenied: 'O acesso à câmara não foi concedido.',
  // Gán thuộc tính systemSettings: chuỗi 'Abrir definições do dispositivo'.
  systemSettings: 'Abrir definições do dispositivo',
  // Gán thuộc tính cameraFailed: chuỗi 'Não foi possível iniciar a câmara.'.
  cameraFailed: 'Não foi possível iniciar a câmara.',
  // Gán thuộc tính invalidQr: chuỗi 'Formato QR inválido ou ligação fora deste sistema.'.
  invalidQr: 'Formato QR inválido ou ligação fora deste sistema.',
  // Gán thuộc tính again: chuỗi 'Ler novamente'.
  again: 'Ler novamente',
  // Gán thuộc tính enterQr: chuỗi 'Cole uma ligação QR para verificar'.
  enterQr: 'Cole uma ligação QR para verificar',
  // Gán thuộc tính openQr: chuỗi 'Abrir local'.
  openQr: 'Abrir local',
  // Gán thuộc tính qrLink: chuỗi 'Ligação QR do local'.
  qrLink: 'Ligação QR do local',
  // Gán thuộc tính qrWebHint: chuỗi 'Leia o QR comum com a câmara do telemóvel para abrir a lista de locais no website.'.
  qrWebHint: 'Leia o QR comum com a câmara do telemóvel para abrir a lista de locais no website.',
  // Gán thuộc tính saveError: chuỗi 'Não foi possível guardar o idioma. A escolha mantém-se nesta sessão.'.
  saveError: 'Não foi possível guardar o idioma. A escolha mantém-se nesta sessão.',
  // Gán thuộc tính readError: chuỗi 'Não foi possível ler o idioma guardado.
  readError: 'Não foi possível ler o idioma guardado; a usar o idioma do dispositivo ou vietnamita.',
  // Gán thuộc tính previous: chuỗi 'Anterior'.
  previous: 'Anterior',
  // Gán thuộc tính next: chuỗi 'Seguinte'.
  next: 'Seguinte',
  // Gán thuộc tính page: chuỗi 'Página'.
  page: 'Página',
  // Gán thuộc tính results: chuỗi 'Resultados'.
  results: 'Resultados',
  // Gán thuộc tính published: chuỗi 'Versão publicada simulada'.
  published: 'Versão publicada simulada',
  // Gán thuộc tính read: chuỗi 'Texto da narração'.
  read: 'Texto da narração',
  // Gán thuộc tính locationBusy: chuỗi 'A obter localização...'.
  locationBusy: 'A obter localização...',
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `close: 'Fechar',`: Gán thuộc tính close: chuỗi 'Fechar'.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  close: 'Fechar',
}

/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `const ja: Messages = {`: Khai báo ja: tạo object gồm ...giá trị ghép, ...giá trị ghép, ...giá trị ghép, ...giá trị ghép, brand, explore, intro, demo, language.
 * DÒNG `...heritageMessages.ja, ...qrMessages.ja, ...journeyMessages.ja, ...uiMessages.ja,`: Khai báo ja: tạo object gồm ...giá trị ghép, ...giá trị ghép, ...giá trị ghép, ...giá trị ghép, brand, explore, intro, demo, language.
 */
const ja: Messages = {
  ...heritageMessages.ja, ...qrMessages.ja, ...journeyMessages.ja,  ...uiMessages.ja,
  // Gán thuộc tính brand: chuỗi 'HueGuide'.
  brand: 'HueGuide',
  // Gán thuộc tính explore: chuỗi '探索'.
  explore: '探索',
  // Gán thuộc tính intro: chuỗi 'フエ京城の参観対象スポット'.
  intro: 'フエ京城の参観対象スポット',
  // Gán thuộc tính demo: chuỗi '授業用のサンプルデータです。実際の遺跡管理機関が承認した内容ではありません。'.
  demo: '授業用のサンプルデータです。実際の遺跡管理機関が承認した内容ではありません。',
  // Gán thuộc tính language: chuỗi '言語'.
  language: '言語',
  // Gán thuộc tính search: chuỗi '建物名、住所、内容を検索...'.
  search: '建物名、住所、内容を検索...',
  // Gán thuộc tính all: chuỗi 'すべて'.
  all: 'すべて',
  // Gán thuộc tính zone: chuỗi '遺跡グループ'.
  zone: '遺跡グループ',
  // Gán thuộc tính zone_fortifications: chuỗi '城壁と城門'.
  zone_fortifications: '城壁と城門',
  // Gán thuộc tính zone_ceremonial: chuỗi '儀式の建物'.
  zone_ceremonial: '儀式の建物',
  // Gán thuộc tính sort: chuỗi '並び替え'.
  sort: '並び替え',
  // Gán thuộc tính name: chuỗi '名前順'.
  name: '名前順',
  // Gán thuộc tính nearest: chuỗi '近い順'.
  nearest: '近い順',
  // Gán thuộc tính location: chuỗi '現在地を取得'.
  location: '現在地を取得',
  // Gán thuộc tính locationDenied: chuỗi '位置情報を取得できません。リストとQRは利用できます。'.
  locationDenied: '位置情報を取得できません。リストとQRは利用できます。',
  // Gán thuộc tính distance: chuỗi '距離'.
  distance: '距離',
  // Gán thuộc tính orderFallback: chuỗi '位置情報または確認済み座標がないため、名前順で表示します。'.
  orderFallback: '位置情報または確認済み座標がないため、名前順で表示します。',
  // Gán thuộc tính loading: chuỗi '読み込み中...'.
  loading: '読み込み中...',
  // Gán thuộc tính retry: chuỗi '再試行'.
  retry: '再試行',
  // Gán thuộc tính loadError: chuỗi 'データを取得できません。再試行してください。'.
  loadError: 'データを取得できません。再試行してください。',
  // Gán thuộc tính empty: chuỗi '結果がありません'.
  empty: '結果がありません',
  // Gán thuộc tính emptyHint: chuỗi '別のキーワードを試すか、絞り込みを解除してください。'.
  emptyHint: '別のキーワードを試すか、絞り込みを解除してください。',
  // Gán thuộc tính reset: chuỗi '条件を解除'.
  reset: '条件を解除',
  // Gán thuộc tính noImage: chuỗi '画像がありません'.
  noImage: '画像がありません',
  // Gán thuộc tính missing: chuỗi 'この言語の公開済みコンテンツはありません。'.
  missing: 'この言語の公開済みコンテンツはありません。',
  // Gán thuộc tính missingList: chuỗi '一部のスポットにはこの言語の公開版がなく、検索は既存の公開版のみを対象にします。'.
  missingList: '一部のスポットにはこの言語の公開版がなく、検索は既存の公開版のみを対象にします。',
  // Gán thuộc tính available: chuỗi '公開済みの言語'.
  available: '公開済みの言語',
  // Gán thuộc tính details: chuỗi 'スポット詳細'.
  details: 'スポット詳細',
  // Gán thuộc tính back: chuỗi 'リストに戻る'.
  back: 'リストに戻る',
  // Gán thuộc tính notFound: chuỗi 'スポットが存在しないか、公開が停止されています。'.
  notFound: 'スポットが存在しないか、公開が停止されています。',
  // Gán thuộc tính version: chuỗi 'コンテンツ版'.
  version: 'コンテンツ版',
  // Gán thuộc tính unverified: chuỗi '管理者による位置の確認が完了していません。'.
  unverified: '管理者による位置の確認が完了していません。',
  // Gán thuộc tính coordinates: chuỗi '確認済み座標'.
  coordinates: '確認済み座標',
  // Gán thuộc tính scan: chuỗi 'QRを読み取る'.
  scan: 'QRを読み取る',
  // Gán thuộc tính scanHint: chuỗi 'スポットのQRを枠内に入れてください。ページを開くだけで自動再生はしません。'.
  scanHint: 'スポットのQRを枠内に入れてください。ページを開くだけで自動再生はしません。',
  // Gán thuộc tính cameraInfo: chuỗi 'QRを読むにはカメラを許可してください。リストからも選択できます。'.
  cameraInfo: 'QRを読むにはカメラを許可してください。リストからも選択できます。',
  // Gán thuộc tính allowCamera: chuỗi 'カメラを許可'.
  allowCamera: 'カメラを許可',
  // Gán thuộc tính cameraDenied: chuỗi 'カメラが許可されていません。'.
  cameraDenied: 'カメラが許可されていません。',
  // Gán thuộc tính systemSettings: chuỗi '端末の設定を開く'.
  systemSettings: '端末の設定を開く',
  // Gán thuộc tính cameraFailed: chuỗi 'カメラを起動できません。'.
  cameraFailed: 'カメラを起動できません。',
  // Gán thuộc tính invalidQr: chuỗi 'QRの形式が正しくないか、このシステム以外のリンクです。'.
  invalidQr: 'QRの形式が正しくないか、このシステム以外のリンクです。',
  // Gán thuộc tính again: chuỗi '再読み取り'.
  again: '再読み取り',
  // Gán thuộc tính enterQr: chuỗi 'QRリンクを貼り付けて確認'.
  enterQr: 'QRリンクを貼り付けて確認',
  // Gán thuộc tính openQr: chuỗi 'スポットを開く'.
  openQr: 'スポットを開く',
  // Gán thuộc tính qrLink: chuỗi 'スポットのQRリンク'.
  qrLink: 'スポットのQRリンク',
  // Gán thuộc tính qrWebHint: chuỗi 'スマートフォンのカメラで共通QRを読み取ると、ウェブのスポット一覧を開きます。'.
  qrWebHint: 'スマートフォンのカメラで共通QRを読み取ると、ウェブのスポット一覧を開きます。',
  // Gán thuộc tính saveError: chuỗi '言語を保存できません。このセッションでは選択を維持します。'.
  saveError: '言語を保存できません。このセッションでは選択を維持します。',
  // Gán thuộc tính readError: chuỗi '保存済み言語を取得できないため、端末の言語またはベトナム語を使用します。'.
  readError: '保存済み言語を取得できないため、端末の言語またはベトナム語を使用します。',
  // Gán thuộc tính previous: chuỗi '前へ'.
  previous: '前へ',
  // Gán thuộc tính next: chuỗi '次へ'.
  next: '次へ',
  // Gán thuộc tính page: chuỗi 'ページ'.
  page: 'ページ',
  // Gán thuộc tính results: chuỗi '結果'.
  results: '結果',
  // Gán thuộc tính published: chuỗi '公開版の模擬データ'.
  published: '公開版の模擬データ',
  // Gán thuộc tính read: chuỗi '解説文'.
  read: '解説文',
  // Gán thuộc tính locationBusy: chuỗi '位置を取得中...'.
  locationBusy: '位置を取得中...',
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `close: '閉じる',`: Gán thuộc tính close: chuỗi '閉じる'.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  close: '閉じる',
}

// CHỨC NĂNG: Ghép đúng resource với đúng mã.
// XỬ LÝ: cn luôn lấy bản Trung, pt luôn lấy bản Bồ; tránh đổi nhầm biến.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export const messages: Record<Language, Messages> = {`: Khai báo messages: tạo object gồm vi, en, cn, pt, ja.
 * DÒNG `vi,`: Đặt trường vi bằng giá trị của biến cùng tên.
 * DÒNG `en,`: Đặt trường en bằng giá trị của biến cùng tên.
 * DÒNG `cn,`: Đặt trường cn bằng giá trị của biến cùng tên.
 * DÒNG `pt,`: Đặt trường pt bằng giá trị của biến cùng tên.
 * DÒNG `ja,`: Đặt trường ja bằng giá trị của biến cùng tên.
 * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
 */
export const messages: Record<Language, Messages> = {
  vi,
  en,
  cn,
  pt,
  ja,
}
