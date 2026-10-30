/**
 * FILE NÀY LÀM GÌ
 * Tài nguyên chuỗi liên quan nội dung di tích theo ngôn ngữ; i18n tra khóa để các nền tảng hiển
 * thị thống nhất.
 *
 * VỊ TRÍ: packages/visitor-core/src/i18n/heritage-messages.ts
 * DÙNG BỞI: packages/visitor-core/src/i18n/messages.ts.
 * PHỤ THUỘC: ../domain/model
 * TẠI SAO TÁCH FILE: Tập trung ngôn ngữ tại đây giúp cùng một khóa luôn có cùng cách dịch trên
 * các màn.
 */
// Nhập kiểu dữ liệu từ '../domain/model'.
import type { Language } from '../domain/model'
// Khai báo heritageMessages: sử dụng { "vi": { "mapCoordinates": "Vị trí công trình trên bản đồ", "heritageSources": "Nguồn tư  làm giá trị của bước hiện tại.
export const heritageMessages = {
  // Gán thuộc tính "vi": tạo object gồm "mapCoordinates", "heritageSources", "heritageCredit", "heritageChecked", "heritageSynthetic".
  "vi": {
    // Gán thuộc tính "mapCoordinates": chuỗi "Vị trí công trình trên bản đồ".
    "mapCoordinates": "Vị trí công trình trên bản đồ",
    // Gán thuộc tính "heritageSources": chuỗi "Nguồn tư liệu".
    "heritageSources": "Nguồn tư liệu",
    // Gán thuộc tính "heritageCredit": chuỗi "Biên soạn lại và dịch từ Wikipedia, ghi công các tác giả bài viết.
    "heritageCredit": "Biên soạn lại và dịch từ Wikipedia, ghi công các tác giả bài viết; chia sẻ theo CC BY-SA 4.0.",
    // Gán thuộc tính "heritageChecked": chuỗi "Ngày đối chiếu".
    "heritageChecked": "Ngày đối chiếu",
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `"heritageSynthetic": "Giọng đọc tổng hợp từ đúng bài thuyết minh hiển thị."`: Gán thuộc tính "heritageSynthetic": chuỗi "Giọng đọc tổng hợp từ đúng bài thuyết minh hiển thị.".
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    "heritageSynthetic": "Giọng đọc tổng hợp từ đúng bài thuyết minh hiển thị."
  },
  // Gán thuộc tính "en": tạo object gồm "mapCoordinates", "heritageSources", "heritageCredit", "heritageChecked", "heritageSynthetic".
  "en": {
    // Gán thuộc tính "mapCoordinates": chuỗi "Building location on map".
    "mapCoordinates": "Building location on map",
    // Gán thuộc tính "heritageSources": chuỗi "Historical sources".
    "heritageSources": "Historical sources",
    // Gán thuộc tính "heritageCredit": chuỗi "Rewritten and translated from Wikipedia, credited to its article contributors.
    "heritageCredit": "Rewritten and translated from Wikipedia, credited to its article contributors; shared under CC BY-SA 4.0.",
    // Gán thuộc tính "heritageChecked": chuỗi "Checked on".
    "heritageChecked": "Checked on",
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `"heritageSynthetic": "Synthetic speech reads the displayed narration text."`: Gán thuộc tính "heritageSynthetic": chuỗi "Synthetic speech reads the displayed narration text.".
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    "heritageSynthetic": "Synthetic speech reads the displayed narration text."
  },
  // Gán thuộc tính "cn": tạo object gồm "mapCoordinates", "heritageSources", "heritageCredit", "heritageChecked", "heritageSynthetic".
  "cn": {
    // Gán thuộc tính "mapCoordinates": chuỗi "建筑在地图上的位置".
    "mapCoordinates": "建筑在地图上的位置",
    // Gán thuộc tính "heritageSources": chuỗi "历史资料来源".
    "heritageSources": "历史资料来源",
    // Gán thuộc tính "heritageCredit": chuỗi "依据维基百科重新编写并翻译，署名归原条目贡献者；按 CC BY-SA 4.0 分享。".
    "heritageCredit": "依据维基百科重新编写并翻译，署名归原条目贡献者；按 CC BY-SA 4.0 分享。",
    // Gán thuộc tính "heritageChecked": chuỗi "核对日期".
    "heritageChecked": "核对日期",
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `"heritageSynthetic": "合成语音朗读页面显示的讲解正文。"`: Gán thuộc tính "heritageSynthetic": chuỗi "合成语音朗读页面显示的讲解正文。".
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    "heritageSynthetic": "合成语音朗读页面显示的讲解正文。"
  },
  // Gán thuộc tính "pt": tạo object gồm "mapCoordinates", "heritageSources", "heritageCredit", "heritageChecked", "heritageSynthetic".
  "pt": {
    // Gán thuộc tính "mapCoordinates": chuỗi "Localização do edifício no mapa".
    "mapCoordinates": "Localização do edifício no mapa",
    // Gán thuộc tính "heritageSources": chuỗi "Fontes históricas".
    "heritageSources": "Fontes históricas",
    // Gán thuộc tính "heritageCredit": chuỗi "Texto reescrito e traduzido da Wikipédia, com crédito aos autores dos artigos.
    "heritageCredit": "Texto reescrito e traduzido da Wikipédia, com crédito aos autores dos artigos; partilhado sob CC BY-SA 4.0.",
    // Gán thuộc tính "heritageChecked": chuỗi "Verificado em".
    "heritageChecked": "Verificado em",
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `"heritageSynthetic": "A voz sintética lê o texto de narração apresentado."`: Gán thuộc tính "heritageSynthetic": chuỗi "A voz sintética lê o texto de narração apresentado.".
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    "heritageSynthetic": "A voz sintética lê o texto de narração apresentado."
  },
  // Gán thuộc tính "ja": tạo object gồm "mapCoordinates", "heritageSources", "heritageCredit", "heritageChecked", "heritageSynthetic".
  "ja": {
    // Gán thuộc tính "mapCoordinates": chuỗi "地図上の建物の位置".
    "mapCoordinates": "地図上の建物の位置",
    // Gán thuộc tính "heritageSources": chuỗi "歴史資料の出典".
    "heritageSources": "歴史資料の出典",
    // Gán thuộc tính "heritageCredit": chuỗi "ウィキペディアの記事を再構成・翻訳。原記事の執筆者に帰属し、CC BY-SA 4.0で共有します。".
    "heritageCredit": "ウィキペディアの記事を再構成・翻訳。原記事の執筆者に帰属し、CC BY-SA 4.0で共有します。",
    // Gán thuộc tính "heritageChecked": chuỗi "照合日".
    "heritageChecked": "照合日",
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `"heritageSynthetic": "表示されている解説文を合成音声で読み上げます。"`: Gán thuộc tính "heritageSynthetic": chuỗi "表示されている解説文を合成音声で読み上げます。".
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `} satisfies Record<Language, Record<'mapCoordinates' | 'heritageSources' | 'heritageC`: Khai báo heritageMessages: sử dụng { "vi": { "mapCoordinates": "Vị trí công trình trên bản đồ", "heritageSources": "Nguồn tư  làm giá trị của bước hiện tại.
     */
    "heritageSynthetic": "表示されている解説文を合成音声で読み上げます。"
  }
} satisfies Record<Language, Record<'mapCoordinates' | 'heritageSources' | 'heritageCredit' | 'heritageChecked' | 'heritageSynthetic', string>>
