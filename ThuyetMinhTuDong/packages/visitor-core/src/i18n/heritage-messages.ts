/** FILE NÀY LÀM GÌ: Nhãn nguồn lịch sử/giọng tổng hợp cho cả web và mobile.
 * messages.ts ghép vào i18n; UC04/UC06/UC14. */
import type { Language } from '../domain/model'
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
