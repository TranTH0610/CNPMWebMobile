/**
 * FILE: packages/visitor-core/src/i18n/BanDichDiSan.ts
 * FILE NÀY LÀM GÌ: Tài nguyên chuỗi liên quan nội dung di tích theo ngôn ngữ; i18n tra khóa để các nền tảng hiển
 * VAI TRÒ: Module dùng chung; được giao diện hoặc máy chủ gọi tùy chức năng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC01: Thiết lập và thay đổi ngôn ngữ.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import type { Language } from '../domain/KieuDuLieuDuKhach'
export const heritageMessages = {
  "vi": {
    "mapCoordinates": "Vị trí công trình trên bản đồ",
    "heritageSources": "Nguồn tư liệu",
    "heritageCredit": "Biên soạn lại và dịch từ Wikipedia, ghi công các tác giả bài viết; chia sẻ theo CC BY-SA 4.0.",
    "heritageChecked": "Ngày đối chiếu",
    
    "heritageSynthetic": "Giọng đọc tổng hợp từ đúng bài thuyết minh hiển thị."
  },
  "en": {
    "mapCoordinates": "Building location on map",
    "heritageSources": "Historical sources",
    "heritageCredit": "Rewritten and translated from Wikipedia, credited to its article contributors; shared under CC BY-SA 4.0.",
    "heritageChecked": "Checked on",
    
    "heritageSynthetic": "Synthetic speech reads the displayed narration text."
  },
  "cn": {
    "mapCoordinates": "建筑在地图上的位置",
    "heritageSources": "历史资料来源",
    "heritageCredit": "依据维基百科重新编写并翻译，署名归原条目贡献者；按 CC BY-SA 4.0 分享。",
    "heritageChecked": "核对日期",
    
    "heritageSynthetic": "合成语音朗读页面显示的讲解正文。"
  },
  "pt": {
    "mapCoordinates": "Localização do edifício no mapa",
    "heritageSources": "Fontes históricas",
    "heritageCredit": "Texto reescrito e traduzido da Wikipédia, com crédito aos autores dos artigos; partilhado sob CC BY-SA 4.0.",
    "heritageChecked": "Verificado em",
    
    "heritageSynthetic": "A voz sintética lê o texto de narração apresentado."
  },
  "ja": {
    "mapCoordinates": "地図上の建物の位置",
    "heritageSources": "歴史資料の出典",
    "heritageCredit": "ウィキペディアの記事を再構成・翻訳。原記事の執筆者に帰属し、CC BY-SA 4.0で共有します。",
    "heritageChecked": "照合日",
    
    "heritageSynthetic": "表示されている解説文を合成音声で読み上げます。"
  }
} satisfies Record<Language, Record<'mapCoordinates' | 'heritageSources' | 'heritageCredit' | 'heritageChecked' | 'heritageSynthetic', string>>
