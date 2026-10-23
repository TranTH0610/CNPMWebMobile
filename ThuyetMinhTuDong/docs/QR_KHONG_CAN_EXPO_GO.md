# QR dùng chung không cần Expo Go

Đã sửa dự án gốc tại `D:/3.HTML/Đồ án CNPM/ThuyetMinhTuDong`.

URL demo hiện tại: https://simply-solutions-addressed-flowers.trycloudflare.com/

Ảnh QR: `.qr-output/shared-qr.png`. QR chứa URL HTTPS website, không chứa `exp://` và không yêu cầu tài khoản Expo. Camera điện thoại có đọc QR và kết nối Internet có thể mở website. Đã kiểm tra HTTP 200 qua URL công khai cho trang chủ và route chi tiết; chưa quét thử trên điện thoại thật.

## Các file

| File tính từ thư mục ThuyetMinhTuDong | Vai trò |
|---|---|
| `apps/mobile/src/visitor/WebAccessCard.tsx` | Mở website, mở trang QR và chia sẻ cùng URL từ mobile |
| `apps/mobile/src/visitor/MainTabs.tsx` | Ghép thẻ truy cập trong Cài đặt, thêm cuộn cho màn nhỏ |
| `apps/mobile/src/visitor/ScanScreen.tsx` | Hiện hướng dẫn dùng camera thường mà không cần Expo Go |
| `apps/mobile/eas.json` | Profile preview tạo APK standalone, không phải development client |
| `packages/visitor-core/src/uiMessages.ts` | Nhãn mới đủ Việt/Anh/Trung/Bồ/Nhật |
| `scripts/create-public-qr.cjs` | Tạo PNG QR website và đồng bộ đúng biến URL của mobile/web |
| `scripts/public-qr.test.cjs` | Kiểm tra từ chối QR Expo và giữ lại biến .env khác |
| `package.json` | Lệnh qr:create và đăng ký test mới |
| `.gitignore` | Bỏ ảnh QR và bản sao .env cá nhân khỏi Git |
| `apps/web/.env.local` | URL HTTPS của QR website, không commit |
| `apps/mobile/.env` | Cùng URL cho mobile, cần khởi động lại Metro/build lại khi thay đổi |

## Khởi động demo

Giữ hai tiến trình đang chạy. Tắt Vite hoặc cloudflared thì link công khai sẽ không hoạt động.

Terminal 1:

```powershell
cd "D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong"
npm run dev --workspace=web -- --port 5173 --strictPort
```

Terminal 2:

```powershell
& "C:\Users\gauba\OneDrive\Documents\ChatGPT\CNPM 6\tools\cloudflared.exe" tunnel --url http://127.0.0.1:5173 --http-host-header localhost --protocol http2
```

Khi cloudflared khởi động lại, nó cấp URL khác. Thay URL mới trong lệnh sau rồi chạy từ thư mục workspaces:

```powershell
npm run qr:create -- --url https://simply-solutions-addressed-flowers.trycloudflare.com --configure
```

Lệnh có `--configure` chỉ cập nhật `VITE_PUBLIC_SITE_URL` của web và `EXPO_PUBLIC_VISITOR_WEB_ORIGIN` của mobile; giữ biến khác. Nếu file .env đã tồn tại, bản sao trước khi sửa được giữ trong `.qr-output`.

Kiểm tra: tắt Wi-Fi điện thoại, bật 4G, quét ảnh QR bằng camera thường; website phải mở mà không yêu cầu Expo Go. Thử đổi ngôn ngữ và mở chi tiết.

## APK Android không dùng Expo Go

Đã có cấu hình, chưa tạo APK vì chưa có tài khoản build và application ID thật. Trong mobile `.env`, điền `ANDROID_APPLICATION_ID` của dự án. Nếu đã có app phát hành, giữ đúng ID cũ. Sau đó:

```powershell
cd "D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile"
npx eas-cli@latest login
npx eas-cli@latest build:configure
npx eas-cli@latest build --platform android --profile preview
```

Người phát triển đăng nhập EAS để build; người dùng mở website hoặc cài/chạy APK không phải đăng nhập Expo Go. Khi APK đã build xong, tải về và cài trực tiếp. iPhone cần phân phối app theo TestFlight/App Store hoặc provisioning phù hợp; không cài được file APK. Website qua QR dùng được trên iPhone ngay.

## Liên kết tự mở native app

Quick Tunnel chỉ là địa chỉ demo tạm thời. Chưa khai báo/triển khai file xác minh và bản app ký riêng cho domain này, vì vậy chưa xác nhận Universal Links/App Links. Muốn một mã in cố định tự mở native app đã cài, cần hosting/domain ổn định và cấu hình xác minh đã mô tả trong `docs/SUA_LOI_UC01_UC05.md`.

Nguồn chính thức: [Cloudflare Quick Tunnels](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/), [Expo APK](https://docs.expo.dev/build-reference/apk/), [Expo internal distribution](https://docs.expo.dev/build/internal-distribution/).

## Kiểm tra

```powershell
npm run typecheck
npm run lint
npm test
npm run build:web
```

Tổng hiện tại 20 test: 11 visitor-core, 5 place-core, 4 kiểm tra cấu hình/QR công khai.

Gợi ý commit: `feat(mobile): share public QR links and configure standalone APK builds`.

## Quy tắc một QR vào chung

- Chỉ trang `/qr` hiển thị mã vào chung. Trang chi tiết web và mobile không hiển thị QR địa điểm.
- QR chứa URL gốc của hệ thống, không chứa ID địa điểm. Không yêu cầu quét lại khi chuyển điểm tham quan.
- App đã cài và domain được hệ điều hành xác minh: có thể mở app; các trường hợp khác mở web. Không tự mở đồng thời cả hai cửa sổ.
- Chưa triển khai GPS tự xác định địa điểm trong lần sửa này. Hiện có thể chọn địa điểm từ danh sách.
- Luồng tự mở app không qua Expo Go vẫn cần app ký riêng và xác minh domain thật; đường hầm tạm hiện phục vụ mở web.
