/**
 * FILE NÀY LÀM GÌ: Nguồn ảnh đúng tám công trình, tác giả và giấy phép Commons.
 * mock/presentation và giao diện dùng; ảnh đã đóng gói riêng cho web/native.
 * photo:ID là mã asset, không phải URL mạng; resolver của mỗi nền tảng xử lý.
 */
import type { Language } from '../domain/model'
type PlacePhoto = { id: string; title: string; author: string; url: string; image: string; sourceUrl: string; license: string; licenseUrl: string; changes: string; note?: Partial<Record<Language, string>> }
export const PLACE_PHOTOS: Readonly<Record<string, PlacePhoto>> = {
  "truong-sanh-cung": {
    "id": "truong-sanh-cung",
    "title": "Trường Sanh Cung",
    "author": "Vinhtantran",
    "url": "https://commons.wikimedia.org/wiki/File:Cung_Truong_Sanh.jpg",
    "image": "photo:truong-sanh-cung",
    "sourceUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e3/Cung_Truong_Sanh.jpg/1280px-Cung_Truong_Sanh.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "changes": "Resized and JPEG-optimized for the demo; no content edits."
  },
  "ngo-mon": {
    "id": "ngo-mon",
    "title": "Ngọ Môn",
    "author": "Dennis G. Jarvis",
    "url": "https://commons.wikimedia.org/wiki/File:DGJ_1178_-_Ngo_Mon_Gate_(3442074085).jpg",
    "image": "photo:ngo-mon",
    "sourceUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/DGJ_1178_-_Ngo_Mon_Gate_%283442074085%29.jpg/1280px-DGJ_1178_-_Ngo_Mon_Gate_%283442074085%29.jpg",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "changes": "Resized and JPEG-optimized for the demo; no content edits."
  },
  "cung-dien-tho": {
    "id": "cung-dien-tho",
    "title": "Cung Diên Thọ",
    "author": "Vano111ru",
    "url": "https://commons.wikimedia.org/wiki/File:Di%C3%AAn_Th%E1%BB%8D_palace.jpg",
    "image": "photo:cung-dien-tho",
    "sourceUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Di%C3%AAn_Th%E1%BB%8D_palace.jpg/1280px-Di%C3%AAn_Th%E1%BB%8D_palace.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "changes": "Resized and JPEG-optimized for the demo; no content edits."
  },
  "hien-lam-cac": {
    "id": "hien-lam-cac",
    "title": "Hiển Lâm Các",
    "author": "Bernard Gagnon",
    "url": "https://commons.wikimedia.org/wiki/File:Hien_Lam_Cac_pavilion.jpg",
    "image": "photo:hien-lam-cac",
    "sourceUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/06/Hien_Lam_Cac_pavilion.jpg/1280px-Hien_Lam_Cac_pavilion.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "changes": "Resized and JPEG-optimized for the demo; no content edits."
  },
  "ky-dai": {
    "id": "ky-dai",
    "title": "Kỳ Đài",
    "author": "Chainwit.",
    "url": "https://commons.wikimedia.org/wiki/File:Hu%E1%BA%BF_(2024)_-_flag_tower_K%E1%BB%B3_%C4%90%C3%A0i.jpg",
    "image": "photo:ky-dai",
    "sourceUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2c/Hu%E1%BA%BF_%282024%29_-_flag_tower_K%E1%BB%B3_%C4%90%C3%A0i.jpg/1280px-Hu%E1%BA%BF_%282024%29_-_flag_tower_K%E1%BB%B3_%C4%90%C3%A0i.jpg",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "changes": "Resized and JPEG-optimized for the demo; no content edits."
  },
  "the-mieu": {
    "id": "the-mieu",
    "title": "Thế Miếu",
    "author": "Jorge Cancela",
    "url": "https://commons.wikimedia.org/wiki/File:Inside_The_Mieu_Temple,_Hue_20130810.jpg",
    "image": "photo:the-mieu",
    "sourceUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Inside_The_Mieu_Temple%2C_Hue_20130810.jpg/1280px-Inside_The_Mieu_Temple%2C_Hue_20130810.jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "changes": "Resized and JPEG-optimized for the demo; no content edits."
  },
  "dien-can-chanh": {
    "id": "dien-can-chanh",
    "title": "Nền điện Cần Chánh (2015)",
    "author": "Doãn Hiệu (thảo luận)",
    "url": "https://commons.wikimedia.org/wiki/File:N%E1%BB%81n_%C4%91i%E1%BB%87n_C%E1%BA%A7n_Ch%C3%A1nh_-_Ho%C3%A0ng_th%C3%A0nh_Hu%E1%BA%BF.jpg",
    "image": "photo:dien-can-chanh",
    "sourceUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b8/N%E1%BB%81n_%C4%91i%E1%BB%87n_C%E1%BA%A7n_Ch%C3%A1nh_-_Ho%C3%A0ng_th%C3%A0nh_Hu%E1%BA%BF.jpg/1280px-N%E1%BB%81n_%C4%91i%E1%BB%87n_C%E1%BA%A7n_Ch%C3%A1nh_-_Ho%C3%A0ng_th%C3%A0nh_Hu%E1%BA%BF.jpg",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Public_domain",
    "changes": "Resized and JPEG-optimized for the demo; no content edits.",
    "note": {
      "vi": "Nền điện Cần Chánh — ảnh tư liệu năm 2015.",
      "en": "Can Chanh Palace foundation — archival photo from 2015.",
      "cn": "勤政殿基址，2015年资料照片。",
      "pt": "Fundações do Palácio Can Chanh — fotografia de arquivo de 2015.",
      "ja": "勤政殿の基壇・2015年の記録写真。"
    }
  },
  "dien-thai-hoa": {
    "id": "dien-thai-hoa",
    "title": "Điện Thái Hòa",
    "author": "Bernard Gagnon",
    "url": "https://commons.wikimedia.org/wiki/File:Thai_Hoa_palace.jpg",
    "image": "photo:dien-thai-hoa",
    "sourceUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/81/Thai_Hoa_palace.jpg/1280px-Thai_Hoa_palace.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "changes": "Resized and JPEG-optimized for the demo; no content edits."
  }
}
