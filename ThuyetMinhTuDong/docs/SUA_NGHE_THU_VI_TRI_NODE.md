# Sửa nghe thử, tọa độ và ẩn nguồn nội dung

Ngày 24/10/2026. Gốc dự án: `D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong`.

## Nguyên nhân và cách sửa

Nút nghe thử native trước đây gọi dispose khi dừng; lần bấm sau gọi open nên trở về đầu. Nay tách pause khỏi close: pause chỉ dừng player, resume gọi play trên Track hiện có. Chỉ seek(0) khi bài đã kết thúc. Khi đổi ngôn ngữ, đổi URL, rời màn hoặc unmount mới đóng Track. Generation loại phản hồi mở nguồn đến muộn; thao tác bấm nhanh không tạo hai Track.

Coordinator dùng chung bởi adapter du khách và preview Admin. Một nguồn bắt đầu sẽ pause nguồn trước. Mỗi app giữ một quyền phát; web Preview dùng cùng thẻ audio và không thay src khi pause. Không cam kết dừng âm thanh ở tab trình duyệt/ứng dụng khác trên thiết bị khác.

Đã bỏ khung Nguồn tư liệu trên chi tiết và biên tập của cả web/native. Metadata ghi công/giấy phép, dữ liệu nguồn và tài liệu đối chiếu vẫn giữ trong dự án. Nguồn ảnh và ghi công bản đồ thuộc các thành phần riêng.

## Tọa độ đã đối chiếu

Dùng API chính thức OSM `/api/0.6/way/ID/full.json` để kiểm tra tên và lấy tâm bounding box của hình công trình. Đã gắn position vào tám seed và cập nhật record/published trong RAM qua luồng save → submit → review → publish. Không đánh dấu verified=true vì đây chưa phải khảo sát thực địa/điểm đứng đón GPS. Bản đồ và gợi ý GPS ưu tiên position của API; dùng marker mặc định khi dữ liệu cũ thiếu vị trí.

| Công trình | Vĩ độ | Kinh độ | Đối chiếu |
|---|---|---|---|
| Kỳ Đài | 16.4663575 | 107.5802462 | [OSM way 218427614](https://www.openstreetmap.org/way/218427614) |
| Ngọ Môn | 16.4676824 | 107.5791834 | [OSM way 172657562](https://www.openstreetmap.org/way/172657562) |
| Điện Thái Hòa | 16.4687434 | 107.5783867 | [OSM way 531031566](https://www.openstreetmap.org/way/531031566) |
| Thế Miếu | 16.4671614 | 107.5767398 | [OSM way 172657567](https://www.openstreetmap.org/way/172657567) |
| Cung Diên Thọ | 16.4688916 | 107.5754008 | [OSM way 172763420](https://www.openstreetmap.org/way/172763420) |
| Cung Trường Sanh | 16.4697182 | 107.5746783 | [OSM way 172763427](https://www.openstreetmap.org/way/172763427) |
| Điện Cần Chánh | 16.4694768 | 107.5777963 | [OSM way 285990343](https://www.openstreetmap.org/way/285990343) |
| Hiển Lâm Các | 16.4667375 | 107.5770629 | [OSM way 172657564](https://www.openstreetmap.org/way/172657564) |

Dữ liệu trước cập nhật RAM: `.runtime/coordinate-update-1792822746/original-document.json`. Bản sau cập nhật ở cùng thư mục, `updated-document.json`. Không restart server và không gửi lượt QR thử.

## Folder và file

| Vị trí từ gốc dự án | Chức năng |
|---|---|
| `packages/visitor-core/src/audio/playback.ts` | TẠO MỚI — Bộ cấp quyền phát duy nhất, tạm dừng nguồn trước khi bật nguồn mới. |
| `packages/visitor-core/src/audio/preview.ts` | TẠO MỚI — Controller nghe thử giữ Track, tiến độ và chống nguồn bất đồng bộ đến muộn. |
| `apps/mobile/src/components/admin/AdminUI.tsx` | SỬA — AudioPreview dùng controller, pause/resume đúng giây, blur/unmount đóng nguồn. |
| `apps/mobile/src/services/journeyAdapters.ts` | SỬA — Adapter native dùng quyền phát chung với preview; giải phóng lock-screen đúng chủ. |
| `apps/web/src/services/journeyAdapters.ts` | SỬA — Quyền phát chung, chặn play đến muộn làm chồng tiếng. |
| `apps/web/src/components/admin/AudioPreview.tsx` | TẠO MỚI — Thẻ HTML audio ổn định, giữ currentTime, dừng khi đổi bài/rời màn. |
| `apps/web/src/pages/admin/ContentEditorPage.tsx` | SỬA — Dùng component nghe thử chung; bỏ khung nguồn nội dung. |
| `apps/web/src/pages/admin/ReviewsPage.tsx` | SỬA — Dùng cùng component nghe thử và coordinator, không có hai bộ luật riêng. |
| `apps/mobile/src/screens/admin/ContentEditorScreen.tsx` | SỬA — Bỏ khung nguồn nội dung; dùng AudioPreview native đã sửa. |
| `apps/mobile/src/screens/DetailScreen.tsx` | SỬA — Bỏ nguồn nội dung, hiển thị tọa độ bản đồ đã có dù chưa khảo sát GPS. |
| `apps/web/src/pages/DetailPage.tsx` | SỬA — Cùng quy tắc hiển thị nguồn/tọa độ với mobile. |
| `packages/visitor-core/src/domain/model.ts` | SỬA — Optional source/checkedAt của position, không đổi luật verified thực địa. |
| `packages/visitor-core/src/data/mock.ts` | SỬA — Seed Admin và du khách có tọa độ của tám công trình. |
| `packages/visitor-core/src/journey/journey-data.ts` | SỬA — Tâm OSM được đối chiếu lại; mapPointFor ưu tiên tọa độ từ API Admin. |
| `packages/visitor-core/src/journey/journey.ts` | SỬA — Gợi ý GPS dùng position đã công bố thay vì cố định marker mặc định. |
| `apps/mobile/src/components/VisitorMap.tsx` | SỬA — Marker/định tâm lấy cùng record đã công bố. |
| `apps/web/src/components/VisitorMap.tsx` | SỬA — Bản đồ web dùng cùng helper vị trí với native. |
| `apps/mobile/src/screens/JourneyScreen.tsx` | SỬA — Nguồn tọa độ theo vị trí đang công bố, không trỏ nhầm marker cũ. |
| `apps/web/src/pages/JourneyPage.tsx` | SỬA — Danh sách/bản đồ lấy cùng helper vị trí. |
| `packages/admin-core/src/i18n/messages.ts` | SỬA — Nhãn Tạm dừng/Tiếp tục đủ 5 ngôn ngữ. |
| `packages/visitor-core/src/i18n/heritage-messages.ts` | SỬA — Nhãn Vị trí công trình trên bản đồ đủ 5 ngôn ngữ. |
| `packages/visitor-core/src/index.ts` | SỬA — Xuất controller và coordinator qua tên package. |
| `packages/visitor-core/tests/audio.test.cjs` | TẠO MỚI — 8 test hồi quy pause/resume, nguồn chậm, quyền phát và vị trí seed/Admin. |
| `packages/visitor-core/tests/journey.test.cjs` | SỬA — GPS fixture tách tọa độ thật; thêm test ưu tiên position mới công bố. |
| `packages/visitor-core/tsconfig.test.json` | SỬA — Biên dịch các module audio cho test thuần. |
| `packages/visitor-core/package.json` | SỬA — Nối test audio vào lệnh kiểm thử hiện có. |

## Cảnh báo Node.js

Máy đang ưu tiên `D:/14,nodejs/node.exe` phiên bản 20.20.2. Node 24.22.1 hiện có tại `C:/Users/gauba/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`. Các kiểm tra lần sửa này dùng Node 24. Không thay Node toàn hệ thống hoặc PATH lâu dài.

Node 20 không đáp ứng yêu cầu Expo của dự án; có thể gặp lỗi chạy CLI/Metro, cài dependency hoặc build. Cảnh báo không phải nguyên nhân trực tiếp của lỗi nút nghe thử: nguyên nhân đó là code dispose/open. Node 20 đã EOL; ưu tiên Node 24 LTS. Nguồn: https://nodejs.org/en/about/previous-releases

Dùng Node 24 hiện có trong một cửa sổ PowerShell (không thay hệ thống):

```powershell
cd "D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong"
$node24 = "C:\Users\gauba\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$env:Path = "$(Split-Path $node24);$env:Path"
& $node24 -v
# Bản quản lý mobile:
& $node24 "D:\14,nodejs\node_modules\npm\bin\npm-cli.js" run start:admin --workspace=mobile -- --clear
# Bản du khách: thay dòng trên bằng:
# & $node24 "D:\14,nodejs\node_modules\npm\bin\npm-cli.js" run start --workspace=mobile -- --clear
```

Cách lâu dài: cài Node 24 LTS từ https://nodejs.org/en/download rồi mở lại terminal, chạy `node -v` và `where.exe node`, đảm bảo Node 24 đứng trước Node 20. Không cần đổi SDK Expo hay hạ dependency vì lỗi nghe thử.

## Kiểm tra

- 94 test đạt, gồm giữ tiến độ, chỉ một nguồn phát, pending/cleanup và ưu tiên tọa độ Admin.
- Typecheck/lint đạt cho package, web/mobile.
- Build web visitor và Admin đạt.
- Expo export Android/iOS cho cả hai target visitor/Admin đạt.
- Trang public qua tunnel đã hiện tọa độ Ngọ Môn và không còn khung nguồn nội dung; trang Admin cùng ID cũng không còn khung nguồn.
- Chưa kiểm trên điện thoại vật lý; cần Reload Expo để nhận module mới trước khi thử.

## Bạn thử lại

1. Reload Admin mobile. Nghe đến khoảng 0:12 → Tạm dừng → Tiếp tục: phải tiếp tục từ 0:12.
2. Mở một bản nghe khác/đổi ngôn ngữ: bản cũ dừng, không phát chồng.
3. Rời màn lúc đang tải hoặc phát: audio phải dừng, không phát lại khi request cũ hoàn thành.
4. Sau khi nghe hết, bấm nghe lại: bắt đầu từ 0:00.
5. Mở tám di tích trên bản đồ; Admin xem ô vĩ độ/kinh độ, đối chiếu cùng bảng trên.
6. Refresh trang web đang mở qua QR, kiểm tra khung nguồn đã ẩn.

Gợi ý commit: `fix(audio): preserve admin preview progress and synchronize place positions`
