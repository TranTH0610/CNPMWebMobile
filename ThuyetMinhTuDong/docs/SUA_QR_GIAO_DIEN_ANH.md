# Sửa QR, chữ và giao diện nghe — 23/10/2026

## QR dùng chung

Chạy tại thư mục gốc dự án:

```powershell
npm run demo:public
```

Mở `.qr-output/index.html` hoặc ảnh `.qr-output/shared-qr.png` vừa tạo. QR mở website bằng trình duyệt điện thoại, không yêu cầu Expo Go hay tài khoản. Không dùng lại ảnh QR của phiên cũ. Giữ máy tính, Vite và cloudflared chạy trong khi demo. URL tunnel tạm thời hết hiệu lực khi tiến trình dừng; muốn giữ nguyên mã QR lâu dài cần triển khai website trên URL HTTPS cố định.

Nguyên nhân lỗi cũ: kiểm tra nhầm đường dẫn service sau khi sắp xếp thư mục; Vite trả HTML fallback; cấu hình URL trong Vite cũ chưa cập nhật. Script hiện kiểm tra trang HTTPS thật, module đúng và visitor-config.json trước khi thông báo sẵn sàng. Không tắt kiểm tra chứng chỉ hoặc sửa DNS máy tính.

## Bảng thư mục và file

| Đường dẫn | Chức năng |
|---|---|
| scripts/start-public-demo.cjs | Khởi động/kiểm tra Vite và tunnel, chỉ công bố URL khi kiểm tra thành công. |
| scripts/create-public-qr.cjs | Tạo PNG QR, trang xem QR, cập nhật URL và cấu hình runtime. |
| apps/web/src/services/platform.ts | Đọc địa chỉ HTTPS hiện tại hoặc cấu hình runtime cho trang localhost. |
| apps/web/src/components/QrImage.tsx | Chờ địa chỉ sẵn sàng rồi tạo đúng QR chung. |
| apps/web/src/components/JourneyPlayer.tsx | Trình nghe có ảnh, ngôn ngữ, thời gian, tua, tốc độ và trạng thái thật. |
| apps/web/src/components/ListenButton.tsx | Phát/tạm dừng/tiếp tục cùng một nguồn âm thanh. |
| apps/web/src/styles/index.css | Font hệ thống hỗ trợ dấu và các ngôn ngữ, nút bấm và kiểu chữ chung. |
| apps/web/src/styles/player.css | Bố cục trình nghe desktop/điện thoại, nút và thanh tua. |
| apps/mobile/src/components/JourneyPlayer.tsx | Trình nghe native, thanh tua, tốc độ và vùng an toàn màn hình. |
| apps/mobile/src/components/Action.tsx | Nút dùng chung có icon, trạng thái nhấn/vô hiệu hóa và nhãn trợ năng. |
| apps/mobile/src/components/ListenButton.tsx | Nút nghe gọi controller âm thanh đang dùng chung. |
| apps/mobile/src/theme.ts | Khoảng cao dòng tránh cắt dấu tiếng Việt. |
| packages/ui-tokens/colors.ts | Màu dùng chung, bổ sung màu trình nghe. |
| packages/visitor-core/src/photos.ts | Ánh xạ đủ 8 ảnh, tác giả, nguồn và giấy phép. |
| packages/visitor-core/src/mock.ts | Gắn ảnh đúng ID cho từng địa điểm. |
| packages/visitor-core/src/presentation.ts | Ảnh hero và nguồn ảnh lấy từ cùng bảng ảnh. |
| apps/web/static/images/places/ | Tám ảnh JPEG cục bộ do Vite phục vụ. |
| apps/mobile/assets/places/ | Tám ảnh JPEG đóng gói trong ứng dụng native. |
| apps/web/src/services/placeImages.ts | Đổi photo:ID thành đường dẫn ảnh web. |
| apps/mobile/src/services/placeImages.ts | Đổi photo:ID thành asset native; vẫn hỗ trợ URL API. |
| apps/mobile/src/types/assets.d.ts | Khai báo TypeScript cho file ảnh và âm thanh. |
| apps/web/src/components/PlaceImage.tsx, apps/mobile/src/components/PlaceImage.tsx, Cover.tsx | Hiển thị asset đúng nền tảng, giữ placeholder khi thiếu/lỗi. |
| apps/web/src/pages/DetailPage.tsx, apps/mobile/src/screens/DetailScreen.tsx | Nút nghe/bản đồ và chú thích ảnh tư liệu khi cần. |

Ảnh điện Cần Chánh là ảnh tư liệu nền điện năm 2015, có chú thích riêng; không trình bày thành ảnh công trình hiện nay. Các ảnh đều có nguồn và giấy phép tại photos.ts. Audio hiện vẫn là bài demo đa ngôn ngữ đã có, chưa phải tám bài lịch sử riêng.

## Cách tự kiểm tra

1. Quét PNG mới bằng camera điện thoại, thử cả Wi-Fi và 4G; địa chỉ phải là HTTPS công khai, không phải localhost/exp://.
2. Đổi VI/EN/中文/PT/JA: tiêu đề, nút và ngôn ngữ nghe phải đổi cùng nhau. Tạm dừng trước khi kiểm tra thanh tua và tốc độ.
3. Kiểm tra màn hình hẹp: nút không chồng, chữ không cắt dấu, thời gian lấy từ file âm thanh thật.
4. Mở đủ tám chi tiết: ảnh tương ứng, có placeholder nếu nguồn API sai; ảnh demo không phụ thuộc máy chủ ảnh ngoài.
5. Chạy npm run typecheck, npm run lint, npm test và npm run build:web từ gốc dự án. Android: vào apps/mobile chạy npx expo export --platform android --output-dir .verify-native --no-bytecode.

Chưa kiểm tra trực tiếp bằng camera/loa/GPS trên điện thoại thật trong lượt này; kiểm tra trình duyệt và đóng gói không thay thế kiểm tra thiết bị.
