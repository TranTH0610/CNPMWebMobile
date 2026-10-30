/**
 * FILE NÀY LÀM GÌ
 * Khai báo tham chiếu ảnh, thông tin ảnh và các tài nguyên ảnh dùng cho địa điểm/hero.
 *
 * VỊ TRÍ: packages/visitor-core/src/data/photos.ts
 * DÙNG BỞI: packages/visitor-core/src/catalog/presentation.ts;
 * packages/visitor-core/src/data/mock.ts; packages/visitor-core/src/index.ts.
 * PHỤ THUỘC: ../domain/model
 * TẠI SAO TÁCH FILE: Dữ liệu nguồn cần một nơi đối chiếu để ảnh, văn bản và bản thu không bị
 * ghép lệch nhau.
 */
// Nhập kiểu dữ liệu từ '../domain/model'.
import type { Language } from '../domain/model'
// Đặt tên kiểu PlacePhoto. | Khai báo id, kiểu string. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi. | Khai báo title, kiểu string. | Khai báo author, kiểu string. | Khai báo url, kiểu string. | Khai báo image, kiểu string. | Khai báo sourceUrl, kiểu string. | Khai báo license, kiểu string. | Khai báo licenseUrl, kiểu string. | Khai báo changes, kiểu string. | Khai báo note không bắt buộc, kiểu Partial<Record<Language, string>>.
type PlacePhoto = { id: string; title: string; author: string; url: string; image: string; sourceUrl: string; license: string; licenseUrl: string; changes: string; note?: Partial<Record<Language, string>> }
// Khai báo PLACE_PHOTOS: tạo object gồm "truong-sanh-cung", "ngo-mon", "cung-dien-tho", "hien-lam-cac", "ky-dai", "the-mieu", "dien-can-chanh", "dien-thai-hoa".
export const PLACE_PHOTOS: Readonly<Record<string, PlacePhoto>> = {
  // Gán thuộc tính "truong-sanh-cung": tạo object gồm "id", "title", "author", "url", "image", "sourceUrl", "license", "licenseUrl", "changes".
  "truong-sanh-cung": {
    // Gán thuộc tính "id": chuỗi "truong-sanh-cung".
    "id": "truong-sanh-cung",
    // Gán thuộc tính "title": chuỗi "Trường Sanh Cung".
    "title": "Trường Sanh Cung",
    // Gán thuộc tính "author": chuỗi "Vinhtantran".
    "author": "Vinhtantran",
    // Gán thuộc tính "url": chuỗi "https://commons.wikimedia.org/wiki/File:Cung_Truong_Sanh.jpg".
    "url": "https://commons.wikimedia.org/wiki/File:Cung_Truong_Sanh.jpg",
    // Gán thuộc tính "image": chuỗi "photo:truong-sanh-cung".
    "image": "photo:truong-sanh-cung",
    // Gán thuộc tính "sourceUrl": chuỗi "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e3/Cung_Truong_Sanh.jpg/1280px-Cung.
    "sourceUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e3/Cung_Truong_Sanh.jpg/1280px-Cung_Truong_Sanh.jpg",
    // Gán thuộc tính "license": chuỗi "CC BY-SA 4.0".
    "license": "CC BY-SA 4.0",
    // Gán thuộc tính "licenseUrl": chuỗi "https://creativecommons.org/licenses/by-sa/4.0".
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `"changes": "Resized and JPEG-optimized for the demo; no content edits."`: Gán thuộc tính "changes": chuỗi "Resized and JPEG-optimized for the demo.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    "changes": "Resized and JPEG-optimized for the demo; no content edits."
  },
  // Gán thuộc tính "ngo-mon": tạo object gồm "id", "title", "author", "url", "image", "sourceUrl", "license", "licenseUrl", "changes".
  "ngo-mon": {
    // Gán thuộc tính "id": chuỗi "ngo-mon".
    "id": "ngo-mon",
    // Gán thuộc tính "title": chuỗi "Ngọ Môn".
    "title": "Ngọ Môn",
    // Gán thuộc tính "author": chuỗi "Dennis G. Jarvis".
    "author": "Dennis G. Jarvis",
    // Gán thuộc tính "url": chuỗi "https://commons.wikimedia.org/wiki/File:DGJ_1178_-_Ngo_Mon_Gate_(3442074085).jpg".
    "url": "https://commons.wikimedia.org/wiki/File:DGJ_1178_-_Ngo_Mon_Gate_(3442074085).jpg",
    // Gán thuộc tính "image": chuỗi "photo:ngo-mon".
    "image": "photo:ngo-mon",
    // Gán thuộc tính "sourceUrl": chuỗi "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/DGJ_1178_-_Ngo_Mon_Gate_%2834420.
    "sourceUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/DGJ_1178_-_Ngo_Mon_Gate_%283442074085%29.jpg/1280px-DGJ_1178_-_Ngo_Mon_Gate_%283442074085%29.jpg",
    // Gán thuộc tính "license": chuỗi "CC BY-SA 2.0".
    "license": "CC BY-SA 2.0",
    // Gán thuộc tính "licenseUrl": chuỗi "https://creativecommons.org/licenses/by-sa/2.0".
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `"changes": "Resized and JPEG-optimized for the demo; no content edits."`: Gán thuộc tính "changes": chuỗi "Resized and JPEG-optimized for the demo.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    "changes": "Resized and JPEG-optimized for the demo; no content edits."
  },
  // Gán thuộc tính "cung-dien-tho": tạo object gồm "id", "title", "author", "url", "image", "sourceUrl", "license", "licenseUrl", "changes".
  "cung-dien-tho": {
    // Gán thuộc tính "id": chuỗi "cung-dien-tho".
    "id": "cung-dien-tho",
    // Gán thuộc tính "title": chuỗi "Cung Diên Thọ".
    "title": "Cung Diên Thọ",
    // Gán thuộc tính "author": chuỗi "Vano111ru".
    "author": "Vano111ru",
    // Gán thuộc tính "url": chuỗi "https://commons.wikimedia.org/wiki/File:Di%C3%AAn_Th%E1%BB%8D_palace.jpg".
    "url": "https://commons.wikimedia.org/wiki/File:Di%C3%AAn_Th%E1%BB%8D_palace.jpg",
    // Gán thuộc tính "image": chuỗi "photo:cung-dien-tho".
    "image": "photo:cung-dien-tho",
    // Gán thuộc tính "sourceUrl": chuỗi "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Di%C3%AAn_Th%E1%BB%8D_palace.jpg.
    "sourceUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Di%C3%AAn_Th%E1%BB%8D_palace.jpg/1280px-Di%C3%AAn_Th%E1%BB%8D_palace.jpg",
    // Gán thuộc tính "license": chuỗi "CC BY-SA 4.0".
    "license": "CC BY-SA 4.0",
    // Gán thuộc tính "licenseUrl": chuỗi "https://creativecommons.org/licenses/by-sa/4.0".
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `"changes": "Resized and JPEG-optimized for the demo; no content edits."`: Gán thuộc tính "changes": chuỗi "Resized and JPEG-optimized for the demo.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    "changes": "Resized and JPEG-optimized for the demo; no content edits."
  },
  // Gán thuộc tính "hien-lam-cac": tạo object gồm "id", "title", "author", "url", "image", "sourceUrl", "license", "licenseUrl", "changes".
  "hien-lam-cac": {
    // Gán thuộc tính "id": chuỗi "hien-lam-cac".
    "id": "hien-lam-cac",
    // Gán thuộc tính "title": chuỗi "Hiển Lâm Các".
    "title": "Hiển Lâm Các",
    // Gán thuộc tính "author": chuỗi "Bernard Gagnon".
    "author": "Bernard Gagnon",
    // Gán thuộc tính "url": chuỗi "https://commons.wikimedia.org/wiki/File:Hien_Lam_Cac_pavilion.jpg".
    "url": "https://commons.wikimedia.org/wiki/File:Hien_Lam_Cac_pavilion.jpg",
    // Gán thuộc tính "image": chuỗi "photo:hien-lam-cac".
    "image": "photo:hien-lam-cac",
    // Gán thuộc tính "sourceUrl": chuỗi "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/06/Hien_Lam_Cac_pavilion.jpg/1280px.
    "sourceUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/06/Hien_Lam_Cac_pavilion.jpg/1280px-Hien_Lam_Cac_pavilion.jpg",
    // Gán thuộc tính "license": chuỗi "CC BY-SA 3.0".
    "license": "CC BY-SA 3.0",
    // Gán thuộc tính "licenseUrl": chuỗi "https://creativecommons.org/licenses/by-sa/3.0".
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `"changes": "Resized and JPEG-optimized for the demo; no content edits."`: Gán thuộc tính "changes": chuỗi "Resized and JPEG-optimized for the demo.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    "changes": "Resized and JPEG-optimized for the demo; no content edits."
  },
  // Gán thuộc tính "ky-dai": tạo object gồm "id", "title", "author", "url", "image", "sourceUrl", "license", "licenseUrl", "changes".
  "ky-dai": {
    // Gán thuộc tính "id": chuỗi "ky-dai".
    "id": "ky-dai",
    // Gán thuộc tính "title": chuỗi "Kỳ Đài".
    "title": "Kỳ Đài",
    // Gán thuộc tính "author": chuỗi "Chainwit.".
    "author": "Chainwit.",
    // Gán thuộc tính "url": chuỗi "https://commons.wikimedia.org/wiki/File:Hu%E1%BA%BF_(2024)_-_flag_tower_K%E1%BB%B3_%C4%90.
    "url": "https://commons.wikimedia.org/wiki/File:Hu%E1%BA%BF_(2024)_-_flag_tower_K%E1%BB%B3_%C4%90%C3%A0i.jpg",
    // Gán thuộc tính "image": chuỗi "photo:ky-dai".
    "image": "photo:ky-dai",
    // Gán thuộc tính "sourceUrl": chuỗi "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2c/Hu%E1%BA%BF_%282024%29_-_flag_to.
    "sourceUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2c/Hu%E1%BA%BF_%282024%29_-_flag_tower_K%E1%BB%B3_%C4%90%C3%A0i.jpg/1280px-Hu%E1%BA%BF_%282024%29_-_flag_tower_K%E1%BB%B3_%C4%90%C3%A0i.jpg",
    // Gán thuộc tính "license": chuỗi "CC BY 4.0".
    "license": "CC BY 4.0",
    // Gán thuộc tính "licenseUrl": chuỗi "https://creativecommons.org/licenses/by/4.0".
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `"changes": "Resized and JPEG-optimized for the demo; no content edits."`: Gán thuộc tính "changes": chuỗi "Resized and JPEG-optimized for the demo.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    "changes": "Resized and JPEG-optimized for the demo; no content edits."
  },
  // Gán thuộc tính "the-mieu": tạo object gồm "id", "title", "author", "url", "image", "sourceUrl", "license", "licenseUrl", "changes".
  "the-mieu": {
    // Gán thuộc tính "id": chuỗi "the-mieu".
    "id": "the-mieu",
    // Gán thuộc tính "title": chuỗi "Thế Miếu".
    "title": "Thế Miếu",
    // Gán thuộc tính "author": chuỗi "Jorge Cancela".
    "author": "Jorge Cancela",
    // Gán thuộc tính "url": chuỗi "https://commons.wikimedia.org/wiki/File:Inside_The_Mieu_Temple,_Hue_20130810.jpg".
    "url": "https://commons.wikimedia.org/wiki/File:Inside_The_Mieu_Temple,_Hue_20130810.jpg",
    // Gán thuộc tính "image": chuỗi "photo:the-mieu".
    "image": "photo:the-mieu",
    // Gán thuộc tính "sourceUrl": chuỗi "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Inside_The_Mieu_Temple%2C_Hue_20.
    "sourceUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Inside_The_Mieu_Temple%2C_Hue_20130810.jpg/1280px-Inside_The_Mieu_Temple%2C_Hue_20130810.jpg",
    // Gán thuộc tính "license": chuỗi "CC BY 2.0".
    "license": "CC BY 2.0",
    // Gán thuộc tính "licenseUrl": chuỗi "https://creativecommons.org/licenses/by/2.0".
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `"changes": "Resized and JPEG-optimized for the demo; no content edits."`: Gán thuộc tính "changes": chuỗi "Resized and JPEG-optimized for the demo.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    "changes": "Resized and JPEG-optimized for the demo; no content edits."
  },
  // Gán thuộc tính "dien-can-chanh": tạo object gồm "id", "title", "author", "url", "image", "sourceUrl", "license", "licenseUrl", "changes".
  "dien-can-chanh": {
    // Gán thuộc tính "id": chuỗi "dien-can-chanh".
    "id": "dien-can-chanh",
    // Gán thuộc tính "title": chuỗi "Nền điện Cần Chánh (2015)".
    "title": "Nền điện Cần Chánh (2015)",
    // Gán thuộc tính "author": chuỗi "Doãn Hiệu (thảo luận)".
    "author": "Doãn Hiệu (thảo luận)",
    // Gán thuộc tính "url": chuỗi "https://commons.wikimedia.org/wiki/File:N%E1%BB%81n_%C4%91i%E1%BB%87n_C%E1%BA%A7n_Ch%C3%A.
    "url": "https://commons.wikimedia.org/wiki/File:N%E1%BB%81n_%C4%91i%E1%BB%87n_C%E1%BA%A7n_Ch%C3%A1nh_-_Ho%C3%A0ng_th%C3%A0nh_Hu%E1%BA%BF.jpg",
    // Gán thuộc tính "image": chuỗi "photo:dien-can-chanh".
    "image": "photo:dien-can-chanh",
    // Gán thuộc tính "sourceUrl": chuỗi "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b8/N%E1%BB%81n_%C4%91i%E1%BB%87n_C%.
    "sourceUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b8/N%E1%BB%81n_%C4%91i%E1%BB%87n_C%E1%BA%A7n_Ch%C3%A1nh_-_Ho%C3%A0ng_th%C3%A0nh_Hu%E1%BA%BF.jpg/1280px-N%E1%BB%81n_%C4%91i%E1%BB%87n_C%E1%BA%A7n_Ch%C3%A1nh_-_Ho%C3%A0ng_th%C3%A0nh_Hu%E1%BA%BF.jpg",
    // Gán thuộc tính "license": chuỗi "Public domain".
    "license": "Public domain",
    // Gán thuộc tính "licenseUrl": chuỗi "https://commons.wikimedia.org/wiki/Commons:Public_domain".
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Public_domain",
    // Gán thuộc tính "changes": chuỗi "Resized and JPEG-optimized for the demo.
    "changes": "Resized and JPEG-optimized for the demo; no content edits.",
    // Gán thuộc tính "note": tạo object gồm "vi", "en", "cn", "pt", "ja".
    "note": {
      // Gán thuộc tính "vi": chuỗi "Nền điện Cần Chánh — ảnh tư liệu năm 2015.".
      "vi": "Nền điện Cần Chánh — ảnh tư liệu năm 2015.",
      // Gán thuộc tính "en": chuỗi "Can Chanh Palace foundation — archival photo from 2015.".
      "en": "Can Chanh Palace foundation — archival photo from 2015.",
      // Gán thuộc tính "cn": chuỗi "勤政殿基址，2015年资料照片。".
      "cn": "勤政殿基址，2015年资料照片。",
      // Gán thuộc tính "pt": chuỗi "Fundações do Palácio Can Chanh — fotografia de arquivo de 2015.".
      "pt": "Fundações do Palácio Can Chanh — fotografia de arquivo de 2015.",
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `"ja": "勤政殿の基壇・2015年の記録写真。"`: Gán thuộc tính "ja": chuỗi "勤政殿の基壇・2015年の記録写真。".
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      "ja": "勤政殿の基壇・2015年の記録写真。"
    }
  },
  // Gán thuộc tính "dien-thai-hoa": tạo object gồm "id", "title", "author", "url", "image", "sourceUrl", "license", "licenseUrl", "changes".
  "dien-thai-hoa": {
    // Gán thuộc tính "id": chuỗi "dien-thai-hoa".
    "id": "dien-thai-hoa",
    // Gán thuộc tính "title": chuỗi "Điện Thái Hòa".
    "title": "Điện Thái Hòa",
    // Gán thuộc tính "author": chuỗi "Bernard Gagnon".
    "author": "Bernard Gagnon",
    // Gán thuộc tính "url": chuỗi "https://commons.wikimedia.org/wiki/File:Thai_Hoa_palace.jpg".
    "url": "https://commons.wikimedia.org/wiki/File:Thai_Hoa_palace.jpg",
    // Gán thuộc tính "image": chuỗi "photo:dien-thai-hoa".
    "image": "photo:dien-thai-hoa",
    // Gán thuộc tính "sourceUrl": chuỗi "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/81/Thai_Hoa_palace.jpg/1280px-Thai_.
    "sourceUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/81/Thai_Hoa_palace.jpg/1280px-Thai_Hoa_palace.jpg",
    // Gán thuộc tính "license": chuỗi "CC BY-SA 3.0".
    "license": "CC BY-SA 3.0",
    // Gán thuộc tính "licenseUrl": chuỗi "https://creativecommons.org/licenses/by-sa/3.0".
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `"changes": "Resized and JPEG-optimized for the demo; no content edits."`: Gán thuộc tính "changes": chuỗi "Resized and JPEG-optimized for the demo.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    "changes": "Resized and JPEG-optimized for the demo; no content edits."
  }
}
