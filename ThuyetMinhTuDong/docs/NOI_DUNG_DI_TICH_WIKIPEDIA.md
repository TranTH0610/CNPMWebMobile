# Nội dung di tích và thuyết minh theo Wikipedia

Cập nhật ngày 24/10/2026. Phạm vi là **8 di tích hiện có trong dự án**, mỗi điểm đủ Việt/Anh/Trung/Bồ Đào Nha/Nhật. Bài được biên soạn lại và dịch, ghi công tác giả Wikipedia; không phải văn bản được Trung tâm Bảo tồn Di tích chứng nhận. Audio là giọng tổng hợp gTTS đọc chính trường `body`, không đọc các nút, địa chỉ hay chú thích nguồn.

## Các di tích và nguồn

| Di tích | Wikipedia | MP3 VI / EN / CN / PT / JA (giây) |
|---|---|---|
| ky-dai | [Kỳ đài (Huế)](https://vi.wikipedia.org/wiki/Kỳ_đài_(Huế)) | 31.6 / 26.7 / 29.7 / 28.7 / 30.1 |
| ngo-mon | [Ngọ Môn (Hoàng thành Huế)](https://vi.wikipedia.org/wiki/Ngọ_Môn_(Hoàng_thành_Huế)) | 35.6 / 32.3 / 34.6 / 33.5 / 36.9 |
| dien-thai-hoa | [Điện Thái Hòa (Hoàng thành Huế)](https://vi.wikipedia.org/wiki/Điện_Thái_Hòa_(Hoàng_thành_Huế)) | 33.4 / 31.0 / 32.6 / 34.3 / 37.7 |
| the-mieu | [Thế Tổ miếu (Hoàng thành Huế)](https://vi.wikipedia.org/wiki/Thế_Tổ_miếu_(Hoàng_thành_Huế)) | 34.9 / 30.8 / 34.4 / 34.9 / 38.9 |
| cung-dien-tho | [Cung Diên Thọ](https://vi.wikipedia.org/wiki/Cung_Diên_Thọ) | 34.7 / 34.2 / 35.2 / 34.5 / 38.1 |
| truong-sanh-cung | [Cung Trường Sanh](https://vi.wikipedia.org/wiki/Cung_Trường_Sanh) | 33.7 / 30.9 / 34.0 / 31.9 / 36.9 |
| dien-can-chanh | [Điện Cần Chánh (Hoàng thành Huế)](https://vi.wikipedia.org/wiki/Điện_Cần_Chánh_(Hoàng_thành_Huế)) | 36.3 / 33.9 / 38.3 / 35.1 / 40.8 |
| hien-lam-cac | [Hiển Lâm các](https://vi.wikipedia.org/wiki/Hiển_Lâm_các) | 34.5 / 31.9 / 32.4 / 34.0 / 37.7 |

Mốc Hiển Lâm Các 1821–1822 dùng bài Việt, đối chiếu thêm [Cổng thông tin du lịch Việt Nam](https://www.dulichvn.org.vn/index.php/item/15511); bản Wikipedia Pháp có mốc khác nên không dùng làm nguồn niên đại. Cung Trường Sanh đối chiếu thêm [Bảo tàng Lịch sử Quốc gia](https://baotanglichsu.vn/VI/Articles/3101/16417/binh-phong-trong-cuoc-djieu-tra-tham-sat-khao-co-hoc-di-tich-cung-truong-sanh-djai-noi-hue.html). Không công bố giờ mở cửa, vé hoặc tiến độ thi công hiện tại khi chưa có dữ liệu vận hành xác nhận. Địa chỉ là mô tả vị trí lịch sử; không biến thành tọa độ GPS đã khảo sát.

## Thư mục và tệp

| Vị trí (tính từ gốc monorepo) | Chức năng |
|---|---|
| `packages/visitor-core/src/data/heritageContent.json` | Nguồn chuẩn: 8 bài lịch sử × 5 ngôn ngữ; địa chỉ mô tả, tóm tắt và liên kết Wikipedia. |
| `packages/visitor-core/src/data/narrations.json` | Manifest 40 MP3: mã văn bản/MP3 SHA-256, thời lượng, dung lượng và ngôn ngữ giọng đọc. |
| `packages/visitor-core/src/data/heritage.ts` | Ghép bài với MP3 chỉ khi body khớp, kiểm tra khóa audio; không phụ thuộc UI. |
| `packages/visitor-core/src/data/mock.ts` | Khởi tạo danh mục tám di tích từ bài chuẩn; giữ ảnh và danh mục hiện có. |
| `packages/visitor-core/src/domain/model.ts` | Thêm metadata nguồn có kiểu, optional để tương thích dữ liệu cũ. |
| `packages/visitor-core/src/index.ts` | Xuất helper dữ liệu/audio qua tên package dùng chung. |
| `packages/visitor-core/src/i18n/heritage-messages.ts` | Nhãn nguồn, ngày đối chiếu và giọng tổng hợp đủ năm ngôn ngữ. |
| `packages/visitor-core/src/i18n/messages.ts` | Ghép nhãn mới vào i18n hiện có của hai ứng dụng. |
| `packages/admin-core/src/services/mockService.ts` | Dùng chung seed với du khách; sửa bài bỏ audio cũ; tạo giọng thật qua adapter; giữ workflow duyệt. |
| `packages/admin-core/src/services/httpService.ts` | Chờ tối đa 180 giây riêng lệnh tạo MP3; lệnh khác giữ timeout 8 giây. |
| `packages/admin-core/src/i18n/messages.ts` | Nhãn tạo giọng thật và thông báo dịch tự động vẫn mô phỏng. |
| `apps/mobile/src/services/narrationAssets.ts` | Ánh xạ tĩnh 40 MP3 cho Metro; script tự sinh, không sửa tay. |
| `apps/mobile/src/services/journeyAdapters.ts` | Phát MP3 đóng gói hoặc MP3 Admin mới tạo từ API đúng nền tảng. |
| `apps/mobile/src/components/ContentSources.tsx` | Khung nguồn lịch sử native, nút mở bài gốc và giấy phép. |
| `apps/mobile/src/screens/DetailScreen.tsx` | Trang đọc du khách hiển thị bài và nguồn đang công bố. |
| `apps/mobile/src/screens/admin/ContentEditorScreen.tsx` | Màn biên tập Admin nghe thử cùng MP3, giữ mã nội bộ khỏi ô URL upload. |
| `apps/web/src/services/narrationSource.ts` | Một bộ phân giải URL audio cho trình nghe du khách và nghe thử Admin. |
| `apps/web/src/services/journeyAdapters.ts` | Nối MP3 mới vào HTMLAudioElement, giữ tua/tốc độ và dọn nguồn. |
| `apps/web/src/components/ContentSources.tsx` | Khung ghi nguồn/giấy phép trên web. |
| `apps/web/src/pages/DetailPage.tsx` | Trang bài đọc du khách lấy nguồn và bài từ cùng record công khai. |
| `apps/web/src/pages/admin/ContentEditorPage.tsx` | Admin nghe thử cùng bài/MP3; ô URL dùng cho bản thu ngoài. |
| `apps/web/src/styles/index.css` | Style khung nguồn dễ đọc và xuống dòng trên màn nhỏ. |
| `apps/web/vite.config.ts` | Proxy public chỉ cho audio đã publish; preview nháp đi qua bản Admin. |
| `services/catalog/narration.cjs` | Tạo MP3 thật từ bài Admin, cache theo body/ngôn ngữ, giới hạn tác vụ và phục vụ HTTP Range. |
| `services/catalog/server.cjs` | Gắn bộ tạo giọng vào RAM API chung; kiểm tra audio công bố trước phục vụ khách. |
| `scripts/generate-narrations.py` | Tạo lại đồng loạt MP3 từ body, sinh manifest và ánh xạ Metro; hỗ trợ tác vụ một bài do server gọi. |
| `scripts/requirements-narration.txt` | Hai dependency Python phục vụ tạo MP3, không thêm thư viện runtime FE. |
| `scripts/upgrade-heritage-content.cjs` | Sao lưu RAM và chuẩn bị chuyển nội dung; giữ điểm thêm, ảnh/tọa độ và lịch sử. |
| `scripts/narrations.test.cjs` | Kiểm tra đủ 40 bài, nguồn, hash body/MP3 và hai bản asset giống nhau. |
| `packages/admin-core/tests/admin.test.cjs` | Kiểm tra TTS nhận đúng body và lỗi không làm thay bản công khai. |
| `packages/visitor-core/tests/core.test.cjs` | Cập nhật kỳ vọng tìm kiếm vì bài mới nhắc đến di tích liên quan; test cô lập ngôn ngữ. |
| `packages/visitor-core/tests/journey.test.cjs` | Dùng ID/phiên bản MP3 mới trong test đổi ngôn ngữ và khôi phục nghe. |
| `services/catalog/catalog.test.cjs` | Test HTTP Range và audio không tồn tại/không công bố trả 404. |
| `package.json` | Thêm kiểm tra 40 bài audio vào npm test. |
| `packages/visitor-core/tsconfig.json` | Bật resolveJsonModule để cùng đọc dữ liệu/manifest JSON, giữ TypeScript strict. |
| `packages/visitor-core/tsconfig.test.json` | Bật resolveJsonModule để cùng đọc dữ liệu/manifest JSON, giữ TypeScript strict. |
| `packages/admin-core/tsconfig.json` | Bật resolveJsonModule để cùng đọc dữ liệu/manifest JSON, giữ TypeScript strict. |
| `apps/mobile/tsconfig.json` | Bật resolveJsonModule để cùng đọc dữ liệu/manifest JSON, giữ TypeScript strict. |
| `apps/web/tsconfig.json` | Bật resolveJsonModule để cùng đọc dữ liệu/manifest JSON, giữ TypeScript strict. |
| `apps/mobile/assets/narrations/` | 40 file MP3 đóng gói vào Expo, khoảng 10.4 MB. |
| `apps/web/static/narrations/` | Cùng 40 file MP3, giống từng byte với mobile; Vite copy sang dist và dist-admin. |
| `.runtime/narrations/` | MP3 do Admin tạo thêm khi chạy; cache máy chủ bị bỏ qua bởi Git. Không phải database. |

Gốc dự án hiện tại: `D:/3.HTML/Đồ án CNPM/ThuyetMinhTuDong`. Tất cả tệp mã mới có chú thích FILE NÀY LÀM GÌ và chú thích CHỨC NĂNG/XỬ LÝ. JSON không hỗ trợ comment; chức năng các trường được giải thích trong `heritage.ts` và tài liệu này.

## Luồng dữ liệu

Bài nguồn JSON → heritage.ts ghép đúng MP3 → mock.ts tạo PlaceRecord → seed AdminService → một server RAM → Admin web/mobile đọc record, khách web/mobile đọc published. Hai app không có bản bài riêng để tự lệch nhau.

Admin sửa body → lưu nháp (bỏ audio cũ) → Tạo giọng đọc từ bài đã lưu → server đọc đúng body/ngôn ngữ để tạo MP3 → nghe thử → gửi duyệt → duyệt → công bố → cả mobile và web thấy bản mới sau lượt poll. Mất mạng/TTS lỗi không gắn âm thanh mẫu và không thay bản khách đang đọc. Nếu bài đổi trong lúc tạo giọng, revision chặn kết quả cũ. Audio mới tạo chỉ tải công khai khi đã publish; API preview của Admin tách riêng.

Bài mới do Admin sửa cần người biên tập tự điền bản dịch đã kiểm tra: nút dịch cũ vẫn ghi rõ mô phỏng. Sửa bài sẽ bỏ nguồn của bản cũ để không gán sai nguồn Wikipedia cho nội dung khác. Bộ bài ban đầu có đủ 5 bản đã biên soạn.

## Chạy thử

Web đang chạy: mở http://127.0.0.1:5173/places/ky-dai và http://127.0.0.1:5174/admin/places/ky-dai/content, tải lại nếu đang giữ giao diện cũ. Trong Expo, tải lại app; nếu Metro giữ cache cũ thì chạy lại với `--clear`.

Từ gốc monorepo, khi khởi động lại hệ thống:

```powershell
cd "D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong"
npm run catalog:start
# Terminal khác:
npm run dev --workspace=web
# Terminal khác:
npm run dev:admin --workspace=web
```

Tạo MP3 cho bài Admin mới cần Python có gTTS. Các 40 bài đã đóng gói phát được mà không cần gọi dịch vụ TTS lúc nghe:

```powershell
python -m pip install --target .tools/tts-python -r scripts/requirements-narration.txt
# Nếu máy có nhiều Python, đặt đường dẫn Python đã cài trước khi chạy catalog:start:
$env:NARRATION_PYTHON = "C:\duong-dan\python.exe"
npm run catalog:start
```

Khi thay `heritageContent.json` ở mã nguồn và muốn tạo lại cả bộ (cần Internet):

```powershell
$env:PYTHONPATH = (Join-Path (Get-Location) ".tools/tts-python")
python scripts/generate-narrations.py
npm test
npm run typecheck
npm run lint
npm run build --workspace=web
npm run build:admin --workspace=web
```

Script tái sử dụng MP3 nếu body/ngôn ngữ không đổi, chỉ ghi manifest khi tất cả bài thành công. Không sửa tay `narrations.json` hoặc `narrationAssets.ts`. Muốn dùng bộ bài mới trong server RAM đã chạy phải chuyển nội dung hoặc khởi động lại; sửa seed trên đĩa không tự thay RAM.

## Kiểm tra đã chạy

- Typecheck và lint cho cả hai app và package liên quan: đạt.
- `npm test`: 85 test đạt (20 Admin + 36 visitor + 5 legacy place + 8 link/QR + 7 presence + 7 catalog + 2 narration).
- Build web du khách/Admin: đạt.
- Expo export iOS và Android cho cả target visitor/Admin: đạt, có đủ 40 asset mới.
- Thử TTS thật trên server riêng: lưu bài mới → tạo MP3 → preview trả audio; public 404 trước publish, Range 206 sau publish. Không tạo dữ liệu test vào RAM đang demo.
- Đối chiếu API RAM thực tế: cả 8 record Admin và published trùng đủ 40 body; web visitor/Admin tải được đủ MP3.
- Kiểm tra trang Kỳ Đài trên web: Admin và du khách hiển thị cùng bài, nguồn và phiên bản mới.
- Chưa kiểm nghe phát âm thủ công của từng tên riêng trên 40 bản hoặc chạy trên điện thoại vật lý; người dùng nên nghe lại trước buổi bảo vệ.

## Chuyển dữ liệu đang chạy

Bản cập nhật lần này có sao lưu tại `.runtime/heritage-upgrade-1792821073791/original-document.json`, bản đã chuyển ở `updated-document.json`. Đây là bản sao vận hành cục bộ được tạo chủ động cho lần sửa, không có endpoint reset/restore công khai và không bật tự lưu database. Tổng lượt QR tại thời điểm chuyển là 1; đã giữ lại tổng này khi nạp lại server. Việc nhập tổng chỉ giữ số tổng, không phục hồi được danh sách mã phiên chống trùng của tiến trình cũ. Các lần khởi động thông thường vẫn theo quy tắc RAM đã chốt.

## Checklist bạn thử trên máy

1. Mở mỗi di tích, đổi VI → EN → CN → PT → JA: bài, tiêu đề và bản nghe đổi cùng ngôn ngữ.
2. Nghe Kỳ Đài rồi Ngọ Môn: hai bài nói nội dung khác; tua/tạm dừng/đổi tốc độ/đóng hoạt động.
3. Admin mở cùng ID và ngôn ngữ: đối chiếu body với khách, nghe thử cùng file.
4. Sửa body rồi lưu: bản nghe cũ bị bỏ, khách vẫn đọc bản đã công bố.
5. Tạo giọng mới, nghe thử, duyệt/công bố: khách web/mobile nhận cùng nội dung.
6. Ngắt Internet trước tạo giọng: hiện lỗi, không báo thành công và không lấy MP3 mẫu.
7. Mở liên kết Wikipedia: đúng di tích, có ghi công và CC BY-SA 4.0.

Gợi ý commit: `feat(content): add sourced Hue narrations and synchronize visitor/admin audio`
