/**
 * FILE: packages/visitor-core/src/i18n/BanDichGiaoDien.ts
 * FILE NÀY LÀM GÌ: Tài nguyên chuỗi cơ bản du khách theo ngôn ngữ; i18n tra khóa để các nền tảng hiển thị thống
 * VAI TRÒ: Module dùng chung; được giao diện hoặc máy chủ gọi tùy chức năng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC01: Thiết lập và thay đổi ngôn ngữ.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { designMessages } from './BanDichTraiNghiem'
/**
 * FILE NÀY LÀM GÌ
 * Tài nguyên chuỗi cơ bản du khách theo ngôn ngữ; i18n tra khóa để các nền tảng hiển thị thống
 * nhất.
 *
 * VỊ TRÍ: packages/visitor-core/src/i18n/BanDichGiaoDien.ts
 * DÙNG BỞI: packages/visitor-core/src/XuatCongKhai.ts; packages/visitor-core/src/react/TrangThaiReact.tsx.
 * PHỤ THUỘC: ./heritage-messages; ./qr-messages; ./journey-messages; ../domain/model; ./uiMessages
 * TẠI SAO TÁCH FILE: Tập trung ngôn ngữ tại đây giúp cùng một khóa luôn có cùng cách dịch trên
 * các màn.
 */
import { heritageMessages } from './BanDichDiSan'
import { qrMessages } from './BanDichTruyCapQR'

import { journeyMessages } from './BanDichHanhTrinh'

// CHỨC NĂNG: Nhập kiểu ngôn ngữ hợp lệ.
// XỬ LÝ: Không dùng mã ngôn ngữ tùy ý.
import type { Language } from '../domain/KieuDuLieuDuKhach'
// CHỨC NĂNG: Bổ sung nhãn UI mới.
import { uiMessages } from './BanDichThanhPhan'
// CHỨC NĂNG: Khai báo bộ khóa chuẩn bằng tiếng Việt.
// XỬ LÝ: Đây là chữ UI; nội dung từng địa điểm nằm trong dữ liệu.

const vi = {
  ...designMessages.vi,
  ...heritageMessages.vi,
  ...qrMessages.vi,
  ...journeyMessages.vi,
  ...uiMessages.vi,
  brand: 'HueGuide',
  explore: 'Khám phá',
  intro: 'Các điểm trong danh mục tham quan Kinh thành Huế',
  demo: 'Dữ liệu minh họa cho đồ án; chưa phải nội dung đã duyệt của đơn vị quản lý di tích.',
  language: 'Ngôn ngữ',
  // CHỨC NĂNG: Tên ngôn ngữ được dịch theo ngôn ngữ giao diện hiện tại.
  // XỬ LÝ: Chỉ dịch nhãn; giữ nguyên mã vi/en/cn/pt/ja và lựa chọn đã lưu.
  language_vi: 'Tiếng Việt',
  language_en: 'Tiếng Anh',
  language_cn: 'Tiếng Trung',
  language_pt: 'Tiếng Bồ Đào Nha',
  language_ja: 'Tiếng Nhật',
  search: 'Tìm tên công trình, địa chỉ hoặc nội dung...',
  all: 'Tất cả',
  zone: 'Nhóm di tích',
  zone_fortifications: 'Thành và cổng',
  zone_ceremonial: 'Công trình nghi lễ',
  sort: 'Sắp xếp',
  name: 'Theo tên',
  nearest: 'Gần nhất',
  location: 'Lấy vị trí của tôi',
  locationDenied: 'Không lấy được vị trí. Bạn vẫn dùng được danh sách và QR.',
  distance: 'Khoảng cách',
  orderFallback: 'Chưa có đủ vị trí/tọa độ xác nhận; đang sắp xếp theo tên.',
  loading: 'Đang tải...',
  retry: 'Thử lại',
  loadError: 'Không tải được dữ liệu. Vui lòng thử lại.',
  empty: 'Không có kết quả',
  emptyHint: 'Thử từ khóa khác hoặc xóa bộ lọc.',
  reset: 'Xóa điều kiện',
  noImage: 'Chưa có ảnh',
  missing: 'Chưa có bản nội dung đã công bố bằng ngôn ngữ này.',
  missingList:
    'Một số điểm chưa có bản công bố theo ngôn ngữ hiện tại; tìm kiếm chỉ xét bản có sẵn.',
  available: 'Bản ngôn ngữ đã công bố',
  details: 'Chi tiết địa điểm',
  back: 'Quay lại danh sách',
  notFound: 'Địa điểm không tồn tại hoặc không còn công bố.',
  version: 'Phiên bản nội dung',
  unverified: 'Vị trí điểm chưa được quản lý xác nhận.',
  coordinates: 'Tọa độ đã xác nhận',
  scan: 'Quét QR',
  scanHint: 'Đưa mã QR điểm di tích vào khung. Quét thành công chỉ mở bài, không tự phát.',
  cameraInfo: 'Cho phép camera để quét QR. Bạn vẫn có thể chọn địa điểm từ danh sách.',
  allowCamera: 'Cho phép camera',
  cameraDenied: 'Camera chưa được cấp quyền.',
  systemSettings: 'Mở cài đặt thiết bị',
  cameraFailed: 'Không khởi động được camera.',
  invalidQr: 'QR không đúng định dạng hoặc không thuộc hệ thống.',
  again: 'Quét lại',
  enterQr: 'Dán liên kết QR để kiểm tra',
  openQr: 'Mở địa điểm',
  qrLink: 'Liên kết QR của điểm',
  qrWebHint: 'Quét QR chung bằng camera điện thoại để mở danh sách điểm tham quan trên website.',
  saveError: 'Không lưu được ngôn ngữ. Lựa chọn vẫn có hiệu lực trong phiên này.',
  readError: 'Không đọc được lựa chọn đã lưu; đang dùng ngôn ngữ thiết bị hoặc tiếng Việt.',
  previous: 'Trước',
  next: 'Sau',
  page: 'Trang',
  results: 'Kết quả',
  published: 'Bản công bố mô phỏng',
  read: 'Bài thuyết minh',
  locationBusy: 'Đang lấy vị trí...',
  
  close: 'Đóng',
} as const

export type MessageKey = keyof typeof vi

// CHỨC NĂNG: Bắt buộc các ngôn ngữ còn lại có cùng bộ khóa.
// XỬ LÝ: Thêm khóa vào vi mà quên en/cn/pt/ja sẽ bị TypeScript báo.
type Messages = Record<MessageKey, string>


const en: Messages = {
  ...designMessages.en,
  ...heritageMessages.en,
  ...qrMessages.en,
  ...journeyMessages.en,
  ...uiMessages.en,
  brand: 'HueGuide',
  explore: 'Explore',
  intro: 'Selected places in the Hue Citadel visitor catalogue',
  demo: 'Coursework sample data; not content approved by the actual heritage management authority.',
  language: 'Language',
  // CHỨC NĂNG: Tên ngôn ngữ được dịch theo ngôn ngữ giao diện hiện tại.
  // XỬ LÝ: Chỉ dịch nhãn; giữ nguyên mã vi/en/cn/pt/ja và lựa chọn đã lưu.
  language_vi: 'Vietnamese',
  language_en: 'English',
  language_cn: 'Chinese',
  language_pt: 'Portuguese',
  language_ja: 'Japanese',
  search: 'Search building names, addresses or content...',
  all: 'All',
  zone: 'Place group',
  zone_fortifications: 'Walls and gates',
  zone_ceremonial: 'Ceremonial buildings',
  sort: 'Sort',
  name: 'Name',
  nearest: 'Nearest',
  location: 'Get my location',
  locationDenied: 'Location is unavailable. The list and QR remain available.',
  distance: 'Distance',
  orderFallback: 'Location or verified coordinates are missing; sorting by name.',
  loading: 'Loading...',
  retry: 'Try again',
  loadError: 'Could not load the data. Please try again.',
  empty: 'No results',
  emptyHint: 'Try another keyword or clear the filters.',
  reset: 'Clear conditions',
  noImage: 'No image available',
  missing: 'No published content is available in this language.',
  missingList:
    'Some places lack a published version in this language; search uses available versions only.',
  available: 'Published languages',
  details: 'Place details',
  back: 'Back to places',
  notFound: 'This place does not exist or is no longer published.',
  version: 'Content version',
  unverified: 'The place location has not been confirmed by management.',
  coordinates: 'Verified coordinates',
  scan: 'Scan QR',
  scanHint: 'Place a site QR code inside the frame. Scanning opens the page without autoplay.',
  cameraInfo: 'Allow camera access to scan QR codes. You can still select places from the list.',
  allowCamera: 'Allow camera',
  cameraDenied: 'Camera access has not been granted.',
  systemSettings: 'Open device settings',
  cameraFailed: 'Could not start the camera.',
  invalidQr: 'Invalid QR format or a link outside this system.',
  again: 'Scan again',
  enterQr: 'Paste a QR link to check',
  openQr: 'Open place',
  qrLink: 'Place QR link',
  qrWebHint:
    'Scan the shared QR with your phone camera to open the visitor catalogue on the website.',
  saveError: 'Could not save the language. Your choice still applies to this session.',
  readError: 'Could not read your saved language; using the device language or Vietnamese.',
  previous: 'Previous',
  next: 'Next',
  page: 'Page',
  results: 'Results',
  published: 'Simulated published version',
  read: 'Narration text',
  locationBusy: 'Getting location...',
  
  close: 'Close',
}


const cn: Messages = {
  ...designMessages.cn,
  ...heritageMessages.cn,
  ...qrMessages.cn,
  ...journeyMessages.cn,
  ...uiMessages.cn,
  brand: 'HueGuide',
  explore: '探索',
  intro: '顺化京城参观目录中的景点',
  demo: '课程演示数据，并非遗迹管理机构正式审核的内容。',
  language: '语言',
  // CHỨC NĂNG: Tên ngôn ngữ được dịch theo ngôn ngữ giao diện hiện tại.
  // XỬ LÝ: Chỉ dịch nhãn; giữ nguyên mã vi/en/cn/pt/ja và lựa chọn đã lưu.
  language_vi: '越南语',
  language_en: '英语',
  language_cn: '中文',
  language_pt: '葡萄牙语',
  language_ja: '日语',
  search: '搜索建筑名称、地址或内容...',
  all: '全部',
  zone: '遗迹分组',
  zone_fortifications: '城墙与城门',
  zone_ceremonial: '礼仪建筑',
  sort: '排序',
  name: '按名称',
  nearest: '距离最近',
  location: '获取我的位置',
  locationDenied: '无法获取位置，仍可使用列表和二维码。',
  distance: '距离',
  orderFallback: '缺少位置或已确认的坐标，当前按名称排序。',
  loading: '正在加载...',
  retry: '重试',
  loadError: '无法加载数据，请重试。',
  empty: '没有结果',
  emptyHint: '请尝试其他关键词或清除筛选。',
  reset: '清除条件',
  noImage: '暂无图片',
  missing: '此语言暂无已发布内容。',
  missingList: '部分景点缺少此语言的发布版本，搜索仅使用已有版本。',
  available: '已发布语言',
  details: '景点详情',
  back: '返回列表',
  notFound: '景点不存在或已停止发布。',
  version: '内容版本',
  unverified: '景点位置尚未由管理人员确认。',
  coordinates: '已确认坐标',
  scan: '扫描二维码',
  scanHint: '将景点二维码放入框内，扫描后仅打开页面，不自动播放。',
  cameraInfo: '允许使用相机扫描二维码，也可从列表选择景点。',
  allowCamera: '允许相机',
  cameraDenied: '尚未获得相机权限。',
  systemSettings: '打开设备设置',
  cameraFailed: '无法启动相机。',
  invalidQr: '二维码格式错误或不属于本系统。',
  again: '重新扫描',
  enterQr: '粘贴二维码链接进行检查',
  openQr: '打开景点',
  qrLink: '景点二维码链接',
  qrWebHint: '使用手机相机扫描共用二维码，在网站打开景点列表。',
  saveError: '无法保存语言选择，本次会话仍使用此语言。',
  readError: '无法读取已保存语言，使用设备语言或越南语。',
  previous: '上一页',
  next: '下一页',
  page: '页',
  results: '结果',
  published: '模拟发布版本',
  read: '讲解文本',
  locationBusy: '正在获取位置...',
  
  close: '关闭',
}


const pt: Messages = {
  ...designMessages.pt,
  ...heritageMessages.pt,
  ...qrMessages.pt,
  ...journeyMessages.pt,
  ...uiMessages.pt,
  brand: 'HueGuide',
  explore: 'Explorar',
  intro: 'Locais selecionados no catálogo da Cidadela de Huế',
  demo: 'Dados de demonstração académica; não são conteúdos aprovados pela entidade gestora do património.',
  language: 'Idioma',
  // CHỨC NĂNG: Tên ngôn ngữ được dịch theo ngôn ngữ giao diện hiện tại.
  // XỬ LÝ: Chỉ dịch nhãn; giữ nguyên mã vi/en/cn/pt/ja và lựa chọn đã lưu.
  language_vi: 'Vietnamita',
  language_en: 'Inglês',
  language_cn: 'Chinês',
  language_pt: 'Português',
  language_ja: 'Japonês',
  search: 'Pesquisar nomes, endereços ou conteúdo...',
  all: 'Todos',
  zone: 'Grupo de locais',
  zone_fortifications: 'Muralhas e portas',
  zone_ceremonial: 'Edifícios cerimoniais',
  sort: 'Ordenar',
  name: 'Nome',
  nearest: 'Mais próximos',
  location: 'Obter a minha localização',
  locationDenied: 'Localização indisponível. A lista e os códigos QR continuam disponíveis.',
  distance: 'Distância',
  orderFallback: 'Faltam localização ou coordenadas confirmadas; ordenação por nome.',
  loading: 'A carregar...',
  retry: 'Tentar novamente',
  loadError: 'Não foi possível carregar os dados. Tente novamente.',
  empty: 'Sem resultados',
  emptyHint: 'Experimente outra palavra ou limpe os filtros.',
  reset: 'Limpar condições',
  noImage: 'Sem imagem',
  missing: 'Não existe conteúdo publicado neste idioma.',
  missingList:
    'Alguns locais não têm versão publicada neste idioma; a pesquisa usa apenas as versões disponíveis.',
  available: 'Idiomas publicados',
  details: 'Detalhes do local',
  back: 'Voltar à lista',
  notFound: 'O local não existe ou já não está publicado.',
  version: 'Versão do conteúdo',
  unverified: 'A localização ainda não foi confirmada pela gestão.',
  coordinates: 'Coordenadas confirmadas',
  scan: 'Ler QR',
  scanHint:
    'Coloque o QR do local no enquadramento. A leitura abre a página sem reprodução automática.',
  cameraInfo: 'Permita a câmara para ler QR. Pode continuar a escolher locais na lista.',
  allowCamera: 'Permitir câmara',
  cameraDenied: 'O acesso à câmara não foi concedido.',
  systemSettings: 'Abrir definições do dispositivo',
  cameraFailed: 'Não foi possível iniciar a câmara.',
  invalidQr: 'Formato QR inválido ou ligação fora deste sistema.',
  again: 'Ler novamente',
  enterQr: 'Cole uma ligação QR para verificar',
  openQr: 'Abrir local',
  qrLink: 'Ligação QR do local',
  qrWebHint: 'Leia o QR comum com a câmara do telemóvel para abrir a lista de locais no website.',
  saveError: 'Não foi possível guardar o idioma. A escolha mantém-se nesta sessão.',
  readError:
    'Não foi possível ler o idioma guardado; a usar o idioma do dispositivo ou vietnamita.',
  previous: 'Anterior',
  next: 'Seguinte',
  page: 'Página',
  results: 'Resultados',
  published: 'Versão publicada simulada',
  read: 'Texto da narração',
  locationBusy: 'A obter localização...',
  
  close: 'Fechar',
}


const ja: Messages = {
  ...designMessages.ja,
  ...heritageMessages.ja,
  ...qrMessages.ja,
  ...journeyMessages.ja,
  ...uiMessages.ja,
  brand: 'HueGuide',
  explore: '探索',
  intro: 'フエ京城の参観対象スポット',
  demo: '授業用のサンプルデータです。実際の遺跡管理機関が承認した内容ではありません。',
  language: '言語',
  // CHỨC NĂNG: Tên ngôn ngữ được dịch theo ngôn ngữ giao diện hiện tại.
  // XỬ LÝ: Chỉ dịch nhãn; giữ nguyên mã vi/en/cn/pt/ja và lựa chọn đã lưu.
  language_vi: 'ベトナム語',
  language_en: '英語',
  language_cn: '中国語',
  language_pt: 'ポルトガル語',
  language_ja: '日本語',
  search: '建物名、住所、内容を検索...',
  all: 'すべて',
  zone: '遺跡グループ',
  zone_fortifications: '城壁と城門',
  zone_ceremonial: '儀式の建物',
  sort: '並び替え',
  name: '名前順',
  nearest: '近い順',
  location: '現在地を取得',
  locationDenied: '位置情報を取得できません。リストとQRは利用できます。',
  distance: '距離',
  orderFallback: '位置情報または確認済み座標がないため、名前順で表示します。',
  loading: '読み込み中...',
  retry: '再試行',
  loadError: 'データを取得できません。再試行してください。',
  empty: '結果がありません',
  emptyHint: '別のキーワードを試すか、絞り込みを解除してください。',
  reset: '条件を解除',
  noImage: '画像がありません',
  missing: 'この言語の公開済みコンテンツはありません。',
  missingList: '一部のスポットにはこの言語の公開版がなく、検索は既存の公開版のみを対象にします。',
  available: '公開済みの言語',
  details: 'スポット詳細',
  back: 'リストに戻る',
  notFound: 'スポットが存在しないか、公開が停止されています。',
  version: 'コンテンツ版',
  unverified: '管理者による位置の確認が完了していません。',
  coordinates: '確認済み座標',
  scan: 'QRを読み取る',
  scanHint: 'スポットのQRを枠内に入れてください。ページを開くだけで自動再生はしません。',
  cameraInfo: 'QRを読むにはカメラを許可してください。リストからも選択できます。',
  allowCamera: 'カメラを許可',
  cameraDenied: 'カメラが許可されていません。',
  systemSettings: '端末の設定を開く',
  cameraFailed: 'カメラを起動できません。',
  invalidQr: 'QRの形式が正しくないか、このシステム以外のリンクです。',
  again: '再読み取り',
  enterQr: 'QRリンクを貼り付けて確認',
  openQr: 'スポットを開く',
  qrLink: 'スポットのQRリンク',
  qrWebHint: 'スマートフォンのカメラで共通QRを読み取ると、ウェブのスポット一覧を開きます。',
  saveError: '言語を保存できません。このセッションでは選択を維持します。',
  readError: '保存済み言語を取得できないため、端末の言語またはベトナム語を使用します。',
  previous: '前へ',
  next: '次へ',
  page: 'ページ',
  results: '結果',
  published: '公開版の模擬データ',
  read: '解説文',
  locationBusy: '位置を取得中...',
  
  close: '閉じる',
}

// CHỨC NĂNG: Ghép đúng resource với đúng mã.
// XỬ LÝ: cn luôn lấy bản Trung, pt luôn lấy bản Bồ; tránh đổi nhầm biến.

export const messages: Record<Language, Messages> = {
  vi,
  en,
  cn,
  pt,
  ja,
}
