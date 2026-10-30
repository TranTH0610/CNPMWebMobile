/**
 * FILE NÀY LÀM GÌ
 * Tài nguyên chuỗi trang khám phá và danh mục theo ngôn ngữ; i18n tra khóa để các nền tảng hiển
 * thị thống nhất.
 *
 * VỊ TRÍ: packages/visitor-core/src/i18n/uiMessages.ts
 * DÙNG BỞI: packages/visitor-core/src/catalog/search.ts;
 * packages/visitor-core/src/i18n/messages.ts.
 * PHỤ THUỘC: ../domain/model
 * TẠI SAO TÁCH FILE: Tập trung ngôn ngữ tại đây giúp cùng một khóa luôn có cùng cách dịch trên
 * các màn.
 */
// Nhập kiểu dữ liệu từ '../domain/model'.
import type { Language } from '../domain/model'

// CHỨC NĂNG: Bản Việt xác định bộ khóa bổ sung.
// XỬ LÝ: Đây là chữ UI, không phải bài thuyết minh di tích.
// Khai báo vi: tạo object gồm site, tagline, heroTitle, heroSubtitle, home, about, map, settings, featured.
const vi = {
  // Gán thuộc tính site: chuỗi 'Kinh thành Huế'.
  site: 'Kinh thành Huế',
  // Gán thuộc tính tagline: chuỗi 'KẾT NỐI DI SẢN VIỆT'.
  tagline: 'KẾT NỐI DI SẢN VIỆT',
  // Gán thuộc tính heroTitle: chuỗi 'Khám phá\nKinh thành Huế'.
  heroTitle: 'Khám phá\nKinh thành Huế',
  // Gán thuộc tính heroSubtitle: chuỗi 'Hành trình di sản — Đọc, tìm hiểu, khám phá bằng ngôn ngữ của bạn'.
  heroSubtitle: 'Hành trình di sản — Đọc, tìm hiểu, khám phá bằng ngôn ngữ của bạn',
  // Gán thuộc tính home: chuỗi 'Trang chủ'.
  home: 'Trang chủ',
  // Gán thuộc tính about: chuỗi 'Về chúng tôi'.
  about: 'Về chúng tôi',
  // Gán thuộc tính map: chuỗi 'Bản đồ'.
  map: 'Bản đồ',
  // Gán thuộc tính settings: chuỗi 'Cài đặt'.
  settings: 'Cài đặt',
  // Gán thuộc tính featured: chuỗi 'Địa điểm nổi bật'.
  featured: 'Địa điểm nổi bật',
  // Gán thuộc tính featuredHint: chuỗi 'Những công trình trong danh mục minh họa'.
  featuredHint: 'Những công trình trong danh mục minh họa',
  // Gán thuộc tính featuredEmpty: chuỗi 'Chưa có địa điểm nổi bật phù hợp.'.
  featuredEmpty: 'Chưa có địa điểm nổi bật phù hợp.',
  // Gán thuộc tính featuredEmptyHint: chuỗi 'Bạn vẫn có thể khám phá các địa điểm trong danh sách bên dưới.'.
  featuredEmptyHint: 'Bạn vẫn có thể khám phá các địa điểm trong danh sách bên dưới.',
  // Gán thuộc tính viewAll: chuỗi 'Xem tất cả'.
  viewAll: 'Xem tất cả',
  // Gán thuộc tính allPlaces: chuỗi 'Tất cả điểm tham quan'.
  allPlaces: 'Tất cả điểm tham quan',
  // Gán thuộc tính searchButton: chuỗi 'Tìm kiếm'.
  searchButton: 'Tìm kiếm',
  // Gán thuộc tính searchKeyword: chuỗi 'Nhập từ khóa...'.
  searchKeyword: 'Nhập từ khóa...',
  // Gán thuộc tính searchFieldsHint: chuỗi 'Tìm theo tên, địa chỉ hoặc nội dung.'.
  searchFieldsHint: 'Tìm theo tên, địa chỉ hoặc nội dung.',
  // Gán thuộc tính searchRequired: chuỗi 'Vui lòng nhập tên, địa chỉ hoặc nội dung cần tìm.'.
  searchRequired: 'Vui lòng nhập tên, địa chỉ hoặc nội dung cần tìm.',
  // Gán thuộc tính searchWithin: chuỗi 'Tìm trong kết quả...'.
  searchWithin: 'Tìm trong kết quả...',
  // Gán thuộc tính filters: chuỗi 'Bộ lọc'.
  filters: 'Bộ lọc',
  // Gán thuộc tính clearAll: chuỗi 'Xóa tất cả'.
  clearAll: 'Xóa tất cả',
  // Gán thuộc tính category_monument: chuỗi 'Công trình di tích'.
  category_monument: 'Công trình di tích',
  // Gán thuộc tính category: chuỗi 'Danh mục'.
  category: 'Danh mục',
  // Gán thuộc tính category_palace: chuỗi 'Cung điện'.
  category_palace: 'Cung điện',
  // Gán thuộc tính category_gate: chuỗi 'Cổng thành'.
  category_gate: 'Cổng thành',
  // Gán thuộc tính category_temple: chuỗi 'Điện thờ'.
  category_temple: 'Điện thờ',
  // Gán thuộc tính category_tomb: chuỗi 'Lăng tẩm'.
  category_tomb: 'Lăng tẩm',
  // Gán thuộc tính category_museum: chuỗi 'Bảo tàng'.
  category_museum: 'Bảo tàng',
  // Gán thuộc tính region: chuỗi 'Khu vực'.
  region: 'Khu vực',
  // Gán thuộc tính city: chuỗi 'Thành phố Huế'.
  city: 'Thành phố Huế',
  // Gán thuộc tính grid: chuỗi 'Dạng lưới'.
  grid: 'Dạng lưới',
  // Gán thuộc tính list: chuỗi 'Dạng danh sách'.
  list: 'Dạng danh sách',
  // Gán thuộc tính comingSoon: chuỗi 'Chức năng này sẽ được triển khai sau UC01–UC05.'.
  comingSoon: 'Chức năng này sẽ được triển khai sau UC01–UC05.',
  // Gán thuộc tính notification: chuỗi 'Thông báo'.
  notification: 'Thông báo',
  // Gán thuộc tính qrAccess: chuỗi 'Truy cập bằng QR'.
  qrAccess: 'Truy cập bằng QR',
  // Gán thuộc tính generalQr: chuỗi 'QR vào chung khu di tích'.
  generalQr: 'QR vào chung khu di tích',
  
  // Gán thuộc tính browserOnly: chuỗi "Quét QR bằng camera thường để mở website. Không cần cài hay đăng nhập Expo Go.".
  browserOnly: "Quét QR bằng camera thường để mở website. Không cần cài hay đăng nhập Expo Go.",
  // Gán thuộc tính openWebsite: chuỗi "Mở website".
  openWebsite: "Mở website",
  // Gán thuộc tính shareWebsite: chuỗi "Chia sẻ liên kết".
  shareWebsite: "Chia sẻ liên kết",
  // Gán thuộc tính websiteError: chuỗi "Không mở được liên kết. Hãy thử lại.".
  websiteError: "Không mở được liên kết. Hãy thử lại.",
  // Gán thuộc tính qrSetup: chuỗi 'Chưa có địa chỉ QR dùng chung. Hãy cấu hình URL website công khai hoặc mở web bằng địa ch.
  qrSetup: 'Chưa có địa chỉ QR dùng chung. Hãy cấu hình URL website công khai hoặc mở web bằng địa chỉ IP LAN.',
  // Gán thuộc tính photoCredits: chuỗi 'Nguồn ảnh'.
  photoCredits: 'Nguồn ảnh',
  // Gán thuộc tính noAccount: chuỗi 'Du khách sử dụng không cần tài khoản.'.
  noAccount: 'Du khách sử dụng không cần tài khoản.',
  // Gán thuộc tính clearSearch: chuỗi 'Xóa từ khóa'.
  clearSearch: 'Xóa từ khóa',
  // Gán thuộc tính closePlayer: chuỗi 'Dừng và đóng trình nghe'.
  closePlayer: 'Dừng và đóng trình nghe',
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `filterHint: 'Chọn nhiều mục để mở rộng kết quả trong cùng nhóm.',`: Gán thuộc tính filterHint: chuỗi 'Chọn nhiều mục để mở rộng kết quả trong cùng nhóm.'.
   * DÒNG `} as const`: Khai báo vi: tạo object gồm site, tagline, heroTitle, heroSubtitle, home, about, map, settings, featured.
   */
  filterHint: 'Chọn nhiều mục để mở rộng kết quả trong cùng nhóm.',
  
} as const

// Đặt tên kiểu UiText.
type UiText = Record<keyof typeof vi, string>

// CHỨC NĂNG: Khai báo đầy đủ cùng bộ khóa ở năm ngôn ngữ.
// XỬ LÝ: satisfies giúp TypeScript phát hiện thiếu khóa.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export const uiMessages = {`: Khai báo uiMessages: sử dụng { vi, en: { site: 'Hue Citadel', tagline: 'CONNECT WITH VIETNAMESE HERITAGE', heroTitle: ' làm giá trị của bước hiện tại.
 * DÒNG `vi,`: Đặt trường vi bằng giá trị của biến cùng tên.
 */
export const uiMessages = {
  vi,

  // Gán thuộc tính en: tạo object gồm site, tagline, heroTitle, heroSubtitle, home, about, map, settings, featured.
  en: {
    // Gán thuộc tính site: chuỗi 'Hue Citadel'.
    site: 'Hue Citadel',
    // Gán thuộc tính tagline: chuỗi 'CONNECT WITH VIETNAMESE HERITAGE'.
    tagline: 'CONNECT WITH VIETNAMESE HERITAGE',
    // Gán thuộc tính heroTitle: chuỗi 'Explore\nHue Citadel'.
    heroTitle: 'Explore\nHue Citadel',
    // Gán thuộc tính heroSubtitle: chuỗi 'A heritage journey — Read, learn and explore in your language'.
    heroSubtitle: 'A heritage journey — Read, learn and explore in your language',
    // Gán thuộc tính home: chuỗi 'Home'.
    home: 'Home',
    // Gán thuộc tính about: chuỗi 'About us'.
    about: 'About us',
    // Gán thuộc tính map: chuỗi 'Map'.
    map: 'Map',
    // Gán thuộc tính settings: chuỗi 'Settings'.
    settings: 'Settings',
    // Gán thuộc tính featured: chuỗi 'Featured places'.
    featured: 'Featured places',
    // Gán thuộc tính featuredHint: chuỗi 'Buildings in the sample visitor catalogue'.
    featuredHint: 'Buildings in the sample visitor catalogue',
    // Gán thuộc tính featuredEmpty: chuỗi 'No featured places match this selection.'.
    featuredEmpty: 'No featured places match this selection.',
    // Gán thuộc tính featuredEmptyHint: chuỗi 'You can still explore the places listed below.'.
    featuredEmptyHint: 'You can still explore the places listed below.',
    // Gán thuộc tính viewAll: chuỗi 'View all'.
    viewAll: 'View all',
    // Gán thuộc tính allPlaces: chuỗi 'All places'.
    allPlaces: 'All places',
    // Gán thuộc tính searchButton: chuỗi 'Search'.
    searchButton: 'Search',
    // Gán thuộc tính searchKeyword: chuỗi 'Enter a keyword...'.
    searchKeyword: 'Enter a keyword...',
    // Gán thuộc tính searchFieldsHint: chuỗi 'Search by name, address or content.'.
    searchFieldsHint: 'Search by name, address or content.',
    // Gán thuộc tính searchRequired: chuỗi 'Please enter a name, address or content to search.'.
    searchRequired: 'Please enter a name, address or content to search.',
    // Gán thuộc tính searchWithin: chuỗi 'Search within results...'.
    searchWithin: 'Search within results...',
    // Gán thuộc tính filters: chuỗi 'Filters'.
    filters: 'Filters',
    // Gán thuộc tính clearAll: chuỗi 'Clear all'.
    clearAll: 'Clear all',
    // Gán thuộc tính category: chuỗi 'Category'.
    category: 'Category',
    // Gán thuộc tính category_palace: chuỗi 'Palaces'.
    category_palace: 'Palaces',
    // Gán thuộc tính category_monument: chuỗi 'Monuments'.
    category_monument: 'Monuments',
    // Gán thuộc tính category_gate: chuỗi 'Gates'.
    category_gate: 'Gates',
    // Gán thuộc tính category_temple: chuỗi 'Temples'.
    category_temple: 'Temples',
    // Gán thuộc tính category_tomb: chuỗi 'Tombs'.
    category_tomb: 'Tombs',
    // Gán thuộc tính category_museum: chuỗi 'Museums'.
    category_museum: 'Museums',
    // Gán thuộc tính region: chuỗi 'Area'.
    region: 'Area',
    // Gán thuộc tính city: chuỗi 'Hue City'.
    city: 'Hue City',
    // Gán thuộc tính grid: chuỗi 'Grid view'.
    grid: 'Grid view',
    // Gán thuộc tính list: chuỗi 'List view'.
    list: 'List view',
    // Gán thuộc tính comingSoon: chuỗi 'This feature will be implemented after UC01–UC05.'.
    comingSoon: 'This feature will be implemented after UC01–UC05.',
    // Gán thuộc tính notification: chuỗi 'Notifications'.
    notification: 'Notifications',
    // Gán thuộc tính qrAccess: chuỗi 'QR access'.
    qrAccess: 'QR access',
    // Gán thuộc tính generalQr: chuỗi 'General heritage entry QR'.
    generalQr: 'General heritage entry QR',

    // Gán thuộc tính browserOnly: chuỗi "Scan the QR with your phone camera to open the website. No Expo Go installation or sign-i.
    browserOnly: "Scan the QR with your phone camera to open the website. No Expo Go installation or sign-in is required.",
    // Gán thuộc tính openWebsite: chuỗi "Open website".
    openWebsite: "Open website",
    // Gán thuộc tính shareWebsite: chuỗi "Share link".
    shareWebsite: "Share link",
    // Gán thuộc tính websiteError: chuỗi "Could not open the link. Please try again.".
    websiteError: "Could not open the link. Please try again.",
    // Gán thuộc tính qrSetup: chuỗi 'The shared QR address is unavailable. Configure a public website URL or open the site usi.
    qrSetup: 'The shared QR address is unavailable. Configure a public website URL or open the site using its LAN IP address.',
    // Gán thuộc tính photoCredits: chuỗi 'Photo credits'.
    photoCredits: 'Photo credits',
    // Gán thuộc tính noAccount: chuỗi 'Visitors do not need an account.'.
    noAccount: 'Visitors do not need an account.',
    // Gán thuộc tính clearSearch: chuỗi 'Clear search'.
    clearSearch: 'Clear search',
    // Gán thuộc tính closePlayer: chuỗi 'Stop and close player'.
    closePlayer: 'Stop and close player',
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `filterHint: 'Select multiple items to widen results within a group.',`: Gán thuộc tính filterHint: chuỗi 'Select multiple items to widen results within a group.'.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    filterHint: 'Select multiple items to widen results within a group.',
  },

  // Gán thuộc tính cn: tạo object gồm site, tagline, heroTitle, heroSubtitle, home, about, map, settings, featured.
  cn: {
    // Gán thuộc tính site: chuỗi '顺化京城'.
    site: '顺化京城',
    // Gán thuộc tính tagline: chuỗi '连接越南文化遗产'.
    tagline: '连接越南文化遗产',
    // Gán thuộc tính heroTitle: chuỗi '探索\n顺化京城'.
    heroTitle: '探索\n顺化京城',
    // Gán thuộc tính heroSubtitle: chuỗi '遗产之旅 — 用您的语言阅读、了解和探索'.
    heroSubtitle: '遗产之旅 — 用您的语言阅读、了解和探索',
    // Gán thuộc tính home: chuỗi '首页'.
    home: '首页',
    // Gán thuộc tính about: chuỗi '关于我们'.
    about: '关于我们',
    // Gán thuộc tính map: chuỗi '地图'.
    map: '地图',
    // Gán thuộc tính settings: chuỗi '设置'.
    settings: '设置',
    // Gán thuộc tính featured: chuỗi '精选景点'.
    featured: '精选景点',
    // Gán thuộc tính featuredHint: chuỗi '示例参观目录中的建筑'.
    featuredHint: '示例参观目录中的建筑',
    // Gán thuộc tính featuredEmpty: chuỗi '没有符合条件的精选景点。'.
    featuredEmpty: '没有符合条件的精选景点。',
    // Gán thuộc tính featuredEmptyHint: chuỗi '您仍可浏览下方的景点列表。'.
    featuredEmptyHint: '您仍可浏览下方的景点列表。',
    // Gán thuộc tính viewAll: chuỗi '查看全部'.
    viewAll: '查看全部',
    // Gán thuộc tính allPlaces: chuỗi '全部景点'.
    allPlaces: '全部景点',
    // Gán thuộc tính searchButton: chuỗi '搜索'.
    searchButton: '搜索',
    // Gán thuộc tính searchKeyword: chuỗi '输入关键词…'.
    searchKeyword: '输入关键词…',
    // Gán thuộc tính searchFieldsHint: chuỗi '按名称、地址或内容搜索。'.
    searchFieldsHint: '按名称、地址或内容搜索。',
    // Gán thuộc tính searchRequired: chuỗi '请输入要搜索的名称、地址或内容。'.
    searchRequired: '请输入要搜索的名称、地址或内容。',
    // Gán thuộc tính searchWithin: chuỗi '在结果中搜索...'.
    searchWithin: '在结果中搜索...',
    // Gán thuộc tính filters: chuỗi '筛选'.
    filters: '筛选',
    // Gán thuộc tính clearAll: chuỗi '清除全部'.
    clearAll: '清除全部',
    // Gán thuộc tính category_monument: chuỗi '遗迹建筑'.
    category_monument: '遗迹建筑',
    // Gán thuộc tính category: chuỗi '类别'.
    category: '类别',
    // Gán thuộc tính category_palace: chuỗi '宫殿'.
    category_palace: '宫殿',
    // Gán thuộc tính category_gate: chuỗi '城门'.
    category_gate: '城门',
    // Gán thuộc tính category_temple: chuỗi '庙宇'.
    category_temple: '庙宇',
    // Gán thuộc tính category_tomb: chuỗi '陵墓'.
    category_tomb: '陵墓',
    // Gán thuộc tính category_museum: chuỗi '博物馆'.
    category_museum: '博物馆',
    // Gán thuộc tính region: chuỗi '区域'.
    region: '区域',
    // Gán thuộc tính city: chuỗi '顺化市'.
    city: '顺化市',
    // Gán thuộc tính grid: chuỗi '网格视图'.
    grid: '网格视图',
    // Gán thuộc tính list: chuỗi '列表视图'.
    list: '列表视图',
    // Gán thuộc tính comingSoon: chuỗi '此功能将在 UC01–UC05 之后实现。'.
    comingSoon: '此功能将在 UC01–UC05 之后实现。',
    // Gán thuộc tính notification: chuỗi '通知'.
    notification: '通知',
    // Gán thuộc tính qrAccess: chuỗi '二维码访问'.
    qrAccess: '二维码访问',
    // Gán thuộc tính generalQr: chuỗi '遗迹通用入口二维码'.
    generalQr: '遗迹通用入口二维码',

    // Gán thuộc tính browserOnly: chuỗi "使用手机相机扫描二维码即可打开网站，无需安装或登录 Expo Go。".
    browserOnly: "使用手机相机扫描二维码即可打开网站，无需安装或登录 Expo Go。",
    // Gán thuộc tính openWebsite: chuỗi "打开网站".
    openWebsite: "打开网站",
    // Gán thuộc tính shareWebsite: chuỗi "分享链接".
    shareWebsite: "分享链接",
    // Gán thuộc tính websiteError: chuỗi "无法打开链接，请重试。".
    websiteError: "无法打开链接，请重试。",
    // Gán thuộc tính qrSetup: chuỗi '共用二维码地址不可用。请配置公开网站地址，或使用局域网 IP 地址打开网站。'.
    qrSetup: '共用二维码地址不可用。请配置公开网站地址，或使用局域网 IP 地址打开网站。',
    // Gán thuộc tính photoCredits: chuỗi '图片来源'.
    photoCredits: '图片来源',
    // Gán thuộc tính noAccount: chuỗi '游客无需账户。'.
    noAccount: '游客无需账户。',
    // Gán thuộc tính clearSearch: chuỗi '清除关键词'.
    clearSearch: '清除关键词',
    // Gán thuộc tính closePlayer: chuỗi '停止并关闭播放器'.
    closePlayer: '停止并关闭播放器',
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `filterHint: '同组可多选以扩大结果。',`: Gán thuộc tính filterHint: chuỗi '同组可多选以扩大结果。'.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    filterHint: '同组可多选以扩大结果。',
  },

  // Gán thuộc tính pt: tạo object gồm site, tagline, heroTitle, heroSubtitle, home, about, map, settings, featured.
  pt: {
    // Gán thuộc tính site: chuỗi 'Cidadela de Huế'.
    site: 'Cidadela de Huế',
    // Gán thuộc tính tagline: chuỗi 'LIGAR AO PATRIMÓNIO VIETNAMITA'.
    tagline: 'LIGAR AO PATRIMÓNIO VIETNAMITA',
    // Gán thuộc tính heroTitle: chuỗi 'Explorar\na Cidadela de Huế'.
    heroTitle: 'Explorar\na Cidadela de Huế',
    // Gán thuộc tính heroSubtitle: chuỗi 'Uma viagem pelo património — Leia, conheça e explore no seu idioma'.
    heroSubtitle: 'Uma viagem pelo património — Leia, conheça e explore no seu idioma',
    // Gán thuộc tính home: chuỗi 'Início'.
    home: 'Início',
    // Gán thuộc tính about: chuỗi 'Sobre nós'.
    about: 'Sobre nós',
    // Gán thuộc tính map: chuỗi 'Mapa'.
    map: 'Mapa',
    // Gán thuộc tính settings: chuỗi 'Definições'.
    settings: 'Definições',
    // Gán thuộc tính featured: chuỗi 'Locais em destaque'.
    featured: 'Locais em destaque',
    // Gán thuộc tính featuredHint: chuỗi 'Edifícios no catálogo de demonstração'.
    featuredHint: 'Edifícios no catálogo de demonstração',
    // Gán thuộc tính featuredEmpty: chuỗi 'Não há locais em destaque nesta seleção.'.
    featuredEmpty: 'Não há locais em destaque nesta seleção.',
    // Gán thuộc tính featuredEmptyHint: chuỗi 'Pode explorar os locais na lista abaixo.'.
    featuredEmptyHint: 'Pode explorar os locais na lista abaixo.',
    // Gán thuộc tính viewAll: chuỗi 'Ver todos'.
    viewAll: 'Ver todos',
    // Gán thuộc tính allPlaces: chuỗi 'Todos os locais'.
    allPlaces: 'Todos os locais',
    // Gán thuộc tính searchButton: chuỗi 'Pesquisar'.
    searchButton: 'Pesquisar',
    // Gán thuộc tính searchKeyword: chuỗi 'Introduza uma palavra...'.
    searchKeyword: 'Introduza uma palavra...',
    // Gán thuộc tính searchFieldsHint: chuỗi 'Pesquise por nome, endereço ou conteúdo.'.
    searchFieldsHint: 'Pesquise por nome, endereço ou conteúdo.',
    // Gán thuộc tính searchRequired: chuỗi 'Introduza um nome, endereço ou conteúdo para pesquisar.'.
    searchRequired: 'Introduza um nome, endereço ou conteúdo para pesquisar.',
    // Gán thuộc tính searchWithin: chuỗi 'Pesquisar nos resultados...'.
    searchWithin: 'Pesquisar nos resultados...',
    // Gán thuộc tính filters: chuỗi 'Filtros'.
    filters: 'Filtros',
    // Gán thuộc tính clearAll: chuỗi 'Limpar tudo'.
    clearAll: 'Limpar tudo',
    // Gán thuộc tính category_monument: chuỗi 'Monumentos'.
    category_monument: 'Monumentos',
    // Gán thuộc tính category: chuỗi 'Categoria'.
    category: 'Categoria',
    // Gán thuộc tính category_palace: chuỗi 'Palácios'.
    category_palace: 'Palácios',
    // Gán thuộc tính category_gate: chuỗi 'Portas'.
    category_gate: 'Portas',
    // Gán thuộc tính category_temple: chuỗi 'Templos'.
    category_temple: 'Templos',
    // Gán thuộc tính category_tomb: chuỗi 'Túmulos'.
    category_tomb: 'Túmulos',
    // Gán thuộc tính category_museum: chuỗi 'Museus'.
    category_museum: 'Museus',
    // Gán thuộc tính region: chuỗi 'Área'.
    region: 'Área',
    // Gán thuộc tính city: chuỗi 'Cidade de Huế'.
    city: 'Cidade de Huế',
    // Gán thuộc tính grid: chuỗi 'Grelha'.
    grid: 'Grelha',
    // Gán thuộc tính list: chuỗi 'Lista'.
    list: 'Lista',
    // Gán thuộc tính comingSoon: chuỗi 'Esta função será implementada depois de UC01–UC05.'.
    comingSoon: 'Esta função será implementada depois de UC01–UC05.',
    // Gán thuộc tính notification: chuỗi 'Notificações'.
    notification: 'Notificações',
    // Gán thuộc tính qrAccess: chuỗi 'Acesso por QR'.
    qrAccess: 'Acesso por QR',
    // Gán thuộc tính generalQr: chuỗi 'QR de entrada geral'.
    generalQr: 'QR de entrada geral',

    // Gán thuộc tính browserOnly: chuỗi "Leia o QR com a câmara do telemóvel para abrir o website. Não é necessário instalar nem i.
    browserOnly: "Leia o QR com a câmara do telemóvel para abrir o website. Não é necessário instalar nem iniciar sessão no Expo Go.",
    // Gán thuộc tính openWebsite: chuỗi "Abrir website".
    openWebsite: "Abrir website",
    // Gán thuộc tính shareWebsite: chuỗi "Partilhar ligação".
    shareWebsite: "Partilhar ligação",
    // Gán thuộc tính websiteError: chuỗi "Não foi possível abrir a ligação. Tente novamente.".
    websiteError: "Não foi possível abrir a ligação. Tente novamente.",
    // Gán thuộc tính qrSetup: chuỗi 'O endereço do QR comum não está disponível. Configure o URL público ou abra o site pelo e.
    qrSetup: 'O endereço do QR comum não está disponível. Configure o URL público ou abra o site pelo endereço IP da rede local.',
    // Gán thuộc tính photoCredits: chuỗi 'Créditos das fotografias'.
    photoCredits: 'Créditos das fotografias',
    // Gán thuộc tính noAccount: chuỗi 'Os visitantes não precisam de conta.'.
    noAccount: 'Os visitantes não precisam de conta.',
    // Gán thuộc tính clearSearch: chuỗi 'Limpar pesquisa'.
    clearSearch: 'Limpar pesquisa',
    // Gán thuộc tính closePlayer: chuỗi 'Parar e fechar o leitor'.
    closePlayer: 'Parar e fechar o leitor',
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `filterHint: 'Selecione vários itens para ampliar os resultados no mesmo grupo.',`: Gán thuộc tính filterHint: chuỗi 'Selecione vários itens para ampliar os resultados no mesmo grupo.'.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    filterHint: 'Selecione vários itens para ampliar os resultados no mesmo grupo.',
  },

  // Gán thuộc tính ja: tạo object gồm site, tagline, heroTitle, heroSubtitle, home, about, map, settings, featured.
  ja: {
    // Gán thuộc tính site: chuỗi 'フエ京城'.
    site: 'フエ京城',
    // Gán thuộc tính tagline: chuỗi 'ベトナムの遺産とつながる'.
    tagline: 'ベトナムの遺産とつながる',
    // Gán thuộc tính heroTitle: chuỗi '探索\nフエ京城'.
    heroTitle: '探索\nフエ京城',
    // Gán thuộc tính heroSubtitle: chuỗi '遺産の旅 — 自分の言語で読み、学び、探索する'.
    heroSubtitle: '遺産の旅 — 自分の言語で読み、学び、探索する',
    // Gán thuộc tính home: chuỗi 'ホーム'.
    home: 'ホーム',
    // Gán thuộc tính about: chuỗi '私たちについて'.
    about: '私たちについて',
    // Gán thuộc tính map: chuỗi '地図'.
    map: '地図',
    // Gán thuộc tính settings: chuỗi '設定'.
    settings: '設定',
    // Gán thuộc tính featured: chuỗi '注目のスポット'.
    featured: '注目のスポット',
    // Gán thuộc tính featuredHint: chuỗi 'サンプル参観リストの建物'.
    featuredHint: 'サンプル参観リストの建物',
    // Gán thuộc tính featuredEmpty: chuỗi '条件に合うおすすめスポットはありません。'.
    featuredEmpty: '条件に合うおすすめスポットはありません。',
    // Gán thuộc tính featuredEmptyHint: chuỗi '下の一覧からスポットを探すことができます。'.
    featuredEmptyHint: '下の一覧からスポットを探すことができます。',
    // Gán thuộc tính viewAll: chuỗi 'すべて見る'.
    viewAll: 'すべて見る',
    // Gán thuộc tính allPlaces: chuỗi 'すべてのスポット'.
    allPlaces: 'すべてのスポット',
    // Gán thuộc tính searchButton: chuỗi '検索'.
    searchButton: '検索',
    // Gán thuộc tính searchKeyword: chuỗi 'キーワードを入力…'.
    searchKeyword: 'キーワードを入力…',
    // Gán thuộc tính searchFieldsHint: chuỗi '名前、住所、内容で検索できます。'.
    searchFieldsHint: '名前、住所、内容で検索できます。',
    // Gán thuộc tính searchRequired: chuỗi '検索する名前、住所、または内容を入力してください。'.
    searchRequired: '検索する名前、住所、または内容を入力してください。',
    // Gán thuộc tính searchWithin: chuỗi '結果内を検索...'.
    searchWithin: '結果内を検索...',
    // Gán thuộc tính category_monument: chuỗi '遺跡建築'.
    category_monument: '遺跡建築',
    // Gán thuộc tính filters: chuỗi '絞り込み'.
    filters: '絞り込み',
    // Gán thuộc tính clearAll: chuỗi 'すべて解除'.
    clearAll: 'すべて解除',
    // Gán thuộc tính category: chuỗi 'カテゴリー'.
    category: 'カテゴリー',
    // Gán thuộc tính category_palace: chuỗi '宮殿'.
    category_palace: '宮殿',
    // Gán thuộc tính category_gate: chuỗi '城門'.
    category_gate: '城門',
    // Gán thuộc tính category_temple: chuỗi '寺廟'.
    category_temple: '寺廟',
    // Gán thuộc tính category_tomb: chuỗi '陵墓'.
    category_tomb: '陵墓',
    // Gán thuộc tính category_museum: chuỗi '博物館'.
    category_museum: '博物館',
    // Gán thuộc tính region: chuỗi 'エリア'.
    region: 'エリア',
    // Gán thuộc tính city: chuỗi 'フエ市'.
    city: 'フエ市',
    // Gán thuộc tính grid: chuỗi 'グリッド表示'.
    grid: 'グリッド表示',
    // Gán thuộc tính list: chuỗi 'リスト表示'.
    list: 'リスト表示',
    // Gán thuộc tính comingSoon: chuỗi 'この機能は UC01–UC05 の後に実装予定です。'.
    comingSoon: 'この機能は UC01–UC05 の後に実装予定です。',
    // Gán thuộc tính notification: chuỗi '通知'.
    notification: '通知',
    // Gán thuộc tính qrAccess: chuỗi 'QRでアクセス'.
    qrAccess: 'QRでアクセス',
    // Gán thuộc tính generalQr: chuỗi '遺跡の共通入口QR'.
    generalQr: '遺跡の共通入口QR',

    // Gán thuộc tính browserOnly: chuỗi "スマートフォンのカメラでQRを読み取るとサイトが開きます。Expo Goのインストールやログインは不要です。".
    browserOnly: "スマートフォンのカメラでQRを読み取るとサイトが開きます。Expo Goのインストールやログインは不要です。",
    // Gán thuộc tính openWebsite: chuỗi "サイトを開く".
    openWebsite: "サイトを開く",
    // Gán thuộc tính shareWebsite: chuỗi "リンクを共有".
    shareWebsite: "リンクを共有",
    // Gán thuộc tính websiteError: chuỗi "リンクを開けませんでした。もう一度お試しください。".
    websiteError: "リンクを開けませんでした。もう一度お試しください。",
    // Gán thuộc tính qrSetup: chuỗi '共通QRのURLがありません。公開サイトのURLを設定するか、LANのIPアドレスで開いてください。'.
    qrSetup: '共通QRのURLがありません。公開サイトのURLを設定するか、LANのIPアドレスで開いてください。',
    // Gán thuộc tính photoCredits: chuỗi '写真の出典'.
    photoCredits: '写真の出典',
    // Gán thuộc tính noAccount: chuỗi '観光客のアカウントは不要です。'.
    noAccount: '観光客のアカウントは不要です。',
    // Gán thuộc tính clearSearch: chuỗi '検索語を消去'.
    clearSearch: '検索語を消去',
    // Gán thuộc tính closePlayer: chuỗi '再生を停止して閉じる'.
    closePlayer: '再生を停止して閉じる',
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `filterHint: '同じグループで複数選択して結果を広げられます。',`: Gán thuộc tính filterHint: chuỗi '同じグループで複数選択して結果を広げられます。'.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `} satisfies Record<Language, UiText>`: Khai báo uiMessages: sử dụng { vi, en: { site: 'Hue Citadel', tagline: 'CONNECT WITH VIETNAMESE HERITAGE', heroTitle: ' làm giá trị của bước hiện tại.
     */
    filterHint: '同じグループで複数選択して結果を広げられます。',
  },
} satisfies Record<Language, UiText>
