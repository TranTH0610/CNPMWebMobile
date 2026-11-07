/**
 * CHỨC NĂNG: [NGON-NGU]
 * VAI TRÒ: LOGIC / DỮ LIỆU DÙNG CHUNG
 *
 * FILE NÀY LÀM GÌ:
 * Nhãn giao diện Heritage cho đủ năm ngôn ngữ.
 *
 * VỊ TRÍ: packages/visitor-core/src/i18n/BanDichTraiNghiem.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - packages/visitor-core/src/i18n/BanDichGiaoDien.ts
 *
 * PHỤ THUỘC:
 * - ../domain/KieuDuLieuDuKhach
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
import type { Language } from '../domain/KieuDuLieuDuKhach'
const vi = {
  startExplore: 'Bắt đầu khám phá',
  heritageExperience: 'Di sản Huế, theo cách của bạn',
  heritageExperienceHint:
    'Khám phá từng công trình, chọn ngôn ngữ và lắng nghe câu chuyện ngay tại nơi bạn đứng.',
  discoverStep: 'Chọn điểm tham quan',
  listenStep: 'Nghe bằng ngôn ngữ của bạn',
  gpsStep: 'Khám phá cùng bản đồ',
  skipContent: 'Đến nội dung chính',
  gpsInactive: 'Bật vị trí để nhận gợi ý ở gần',
  gpsWaiting: 'Đang xác định vị trí của bạn',
  gpsLocated: 'Đã nhận vị trí hiện tại',
  gpsNearby: 'Đang ở gần một điểm tham quan',
  gpsHelp: 'Khi bật GPS, hệ thống sử dụng vị trí để gợi ý và thuyết minh theo thiết lập hiện có.',
  expandPlayer: 'Mở điều khiển nghe',
  collapsePlayer: 'Thu gọn điều khiển nghe',
  languageHint: 'Chọn ngôn ngữ cho giao diện và nội dung tham quan.',
  heritageTag: 'Hành trình di sản',
  mapPlace: 'Xem trên bản đồ',
}
export const designMessages: Record<Language, Record<keyof typeof vi, string>> = {
  vi,
  en: {
    startExplore: 'Start exploring',
    heritageExperience: 'Hue heritage, your way',
    heritageExperienceHint:
      'Explore each landmark, choose your language and hear its story where you stand.',
    discoverStep: 'Choose a landmark',
    listenStep: 'Listen in your language',
    gpsStep: 'Explore with the map',
    skipContent: 'Skip to main content',
    gpsInactive: 'Enable location for nearby suggestions',
    gpsWaiting: 'Finding your location',
    gpsLocated: 'Current location received',
    gpsNearby: 'You are near a landmark',
    gpsHelp:
      'When enabled, GPS uses your location for suggestions and narration with your existing settings.',
    expandPlayer: 'Expand audio controls',
    collapsePlayer: 'Collapse audio controls',
    languageHint: 'Choose the language for the interface and your visit.',
    heritageTag: 'A heritage journey',
    mapPlace: 'View on map',
  },
  cn: {
    startExplore: '开始探索',
    heritageExperience: '以您的方式探索顺化遗产',
    heritageExperienceHint: '探索每处古迹，选择您的语言，在现场聆听它的故事。',
    discoverStep: '选择参观点',
    listenStep: '用您的语言聆听',
    gpsStep: '通过地图探索',
    skipContent: '跳转到主要内容',
    gpsInactive: '开启定位以获取附近景点建议',
    gpsWaiting: '正在获取您的位置',
    gpsLocated: '已获取当前位置',
    gpsNearby: '您正靠近一处景点',
    gpsHelp: '开启GPS后，系统将按现有设置使用位置提供建议与讲解。',
    expandPlayer: '展开音频控制',
    collapsePlayer: '收起音频控制',
    languageHint: '选择界面和参观内容的语言。',
    heritageTag: '遗产之旅',
    mapPlace: '在地图上查看',
  },
  pt: {
    startExplore: 'Começar a explorar',
    heritageExperience: 'O património de Huế, à sua maneira',
    heritageExperienceHint:
      'Explore cada monumento, escolha o idioma e ouça a sua história no próprio local.',
    discoverStep: 'Escolher um monumento',
    listenStep: 'Ouvir no seu idioma',
    gpsStep: 'Explorar com o mapa',
    skipContent: 'Ir para o conteúdo principal',
    gpsInactive: 'Ative a localização para sugestões próximas',
    gpsWaiting: 'A obter a sua localização',
    gpsLocated: 'Localização atual recebida',
    gpsNearby: 'Está perto de um monumento',
    gpsHelp:
      'Quando ativado, o GPS usa a localização para sugestões e narração, conforme as definições existentes.',
    expandPlayer: 'Expandir controlos de áudio',
    collapsePlayer: 'Recolher controlos de áudio',
    languageHint: 'Escolha o idioma da interface e da visita.',
    heritageTag: 'Uma viagem pelo património',
    mapPlace: 'Ver no mapa',
  },
  ja: {
    startExplore: '探索を始める',
    heritageExperience: '自分らしく巡るフエの遺産',
    heritageExperienceHint: '史跡を選び、お好きな言語で、その場所に息づく物語をお楽しみください。',
    discoverStep: '史跡を選ぶ',
    listenStep: 'お好きな言語で聴く',
    gpsStep: '地図で探索する',
    skipContent: '本文へ移動',
    gpsInactive: '位置情報を有効にして周辺の史跡を探す',
    gpsWaiting: '現在地を取得しています',
    gpsLocated: '現在地を取得しました',
    gpsNearby: '史跡の近くにいます',
    gpsHelp: 'GPSを有効にすると、既存の設定に従って位置情報から史跡や音声ガイドを案内します。',
    expandPlayer: '音声操作を開く',
    collapsePlayer: '音声操作を閉じる',
    languageHint: '画面と観光案内に使用する言語を選んでください。',
    heritageTag: '遺産を巡る旅',
    mapPlace: '地図で見る',
  },
}
