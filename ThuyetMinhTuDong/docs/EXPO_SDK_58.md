# Sửa lỗi Expo Go SDK 58 không mở được dự án SDK 57

Đã nâng mobile lên Expo 58.0.19, React 19.3.0 và React Native 0.88.0 theo bộ dependency SDK 58. Expo Go trên iPhone đang dùng SDK 58 nên cần Metro của dự án gửi SDK 58 tương ứng.

## Các file đã sửa

| File | Chức năng/thay đổi |
| --- | --- |
| apps/mobile/package.json | Expo/module native tương thích 58; thêm expo-font/expo-asset đúng SDK; bỏ cài trực tiếp expo-modules-core; khai báo Node hỗ trợ. |
| package.json | Cố định expo/react-native trong monorepo để peer dependency không kéo SDK 57/RN cũ; neo React 19.3.0 ở gốc. Web giữ React 18 riêng. |
| package-lock.json | Khóa cây dependency sau nâng cấp và dedupe. |
| apps/mobile/metro.config.js | Chọn React mobile cho source dùng chung, tránh lấy React 18 của web. |
| apps/mobile/tsconfig.json | Bỏ đường dẫn ép expo-modules-core cũ; dùng phân giải module chuẩn. |
| apps/mobile/src/hooks/useGateEntry.ts | Chấp nhận undefined từ Linking.getInitialURL theo kiểu RN 0.88; link rỗng vẫn bỏ qua. |
| apps/mobile/src/screens/admin/PlacesScreen.tsx | ListEmptyComponent dùng undefined khi chưa cần hiển thị, đúng kiểu FlatList mới. |
| apps/mobile/src/screens/admin/ReviewsScreen.tsx | Tương tự cho danh sách kiểm duyệt. |
| apps/mobile/.gitignore | Bỏ qua cache .expo sinh từ máy đang chạy. |

Không sửa giao diện, bản dịch, dữ liệu di tích, quy tắc QR hoặc dữ liệu RAM. Không đổi React của web sang 19, không nâng React Navigation lên major khác. Không khởi động lại server RAM.

## Chạy ngay trên máy này

Máy hiện mặc định dùng Node 20.20.2, không phù hợp SDK 58. Node 24.22.1 đã có sẵn tại đường dẫn bên dưới. Lệnh PATH chỉ áp dụng cho terminal hiện tại; không thay đổi Node toàn máy.

1. Dừng Metro cũ bằng Ctrl+C trong terminal đang chạy Expo.
2. Mở PowerShell và chạy:

```powershell
cd "D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong"
$env:Path = "C:\Users\gauba\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;" + $env:Path
node --version
npm run start:admin --workspace=mobile -- --clear
```

Kết quả node --version cần là v24.22.1 hoặc một bản Node được SDK hỗ trợ. Mở lại Expo Go và quét QR mới do Metro vừa chạy cung cấp, không chọn lại phiên Metro SDK 57 trong lịch sử.

Bản du khách thay lệnh cuối bằng:

```powershell
npm run start --workspace=mobile -- --clear
```

QR Expo phục vụ lập trình khác với QR website tại cổng do nhân viên cấp. Lỗi SDK này thuộc Expo Go, không phải QR HTTPS công khai.

Về lâu dài có thể cài/chọn Node 24 làm Node mặc định. Khi đó không cần thêm dòng PATH mỗi lần. Node hỗ trợ theo manifest mobile: nhánh 22 từ 22.13, nhánh 24 từ 24.3 hoặc nhánh 26.

## Đã xác minh

- `expo install --check`: dependencies are up to date.
- `npm run typecheck`: đạt cho packages, mobile và web.
- `npm run lint`: đạt.
- `npm test`: đạt.
- `npm run build --workspace=web`: đạt; React 18 vẫn tách riêng.
- `expo export --platform ios`: đạt cho bản du khách và Admin.
- Chạy tạm Metro cổng 8092 và đọc manifest bằng header iOS: HTTP200, sdkVersion=58.0.0. Đã dừng server kiểm tra này.

Chưa thử thao tác trực tiếp trên iPhone thật. Bundle iOS thành công không thay thế kiểm tra UI, audio, GPS và bản đồ trên thiết bị.

Expo Doctor: 19/20. Còn cảnh báo cache .expo đã được Git theo dõi từ trước; ignore rule hiện đã có. Cảnh báo này không phải lỗi lệch SDK và không chặn Expo Go khởi chạy. Chưa tự thay staging/index Git để gỡ các file cache đã theo dõi. Không có cảnh báo trùng native module hoặc sai bộ dependency SDK trong lần kiểm tra cuối.

Nguồn chính thức:
- https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/
- https://expo.dev/changelog/sdk-58
- https://docs.expo.dev/guides/monorepos/


## Sửa tsconfig ở gốc monorepo

`ThuyetMinhTuDong/tsconfig.json` không phải cấu hình của ứng dụng Expo. Đã bỏ `extends: expo/tsconfig.base` khỏi file gốc; cấu hình gốc kiểm tra các kiểu dữ liệu/token thuần TypeScript trong shared-types và ui-tokens, không gom React web và React Native vào cùng một project TypeScript.

- Mobile tiếp tục dùng `apps/mobile/tsconfig.json`, kế thừa `expo/tsconfig.base` đúng phạm vi.
- Web tiếp tục dùng `apps/web/tsconfig.json` dành cho Vite/React DOM.
- Các package có tsconfig riêng tiếp tục giữ cấu hình riêng.

Nếu VS Code còn hiện thông báo cũ: Ctrl+Shift+P → TypeScript: Restart TS Server. Không cần đổi phiên bản SDK thêm lần nữa chỉ vì lỗi config ở thư mục gốc.

## Android và iPhone

Cùng source mobile dùng Expo SDK 58 cho cả hai nền tảng, không có thao tác chọn SDK riêng theo điện thoại. Expo Go trên thiết bị phải tương thích SDK 58. Không thể cam kết mọi đời điện thoại: bảng SDK 58 chính thức ghi Android 7+ và iOS 16.4+, còn từng module có thể có yêu cầu riêng. Không hạ số deployment target để ép chạy trên iOS cũ hơn yêu cầu của SDK.

Du khách không cài Expo Go: dùng QR HTTPS mở website responsive trên trình duyệt được hỗ trợ. Đây là đường truy cập chung đã có; vẫn cần Internet và server/tunnel hoạt động. App cài riêng Android/iOS là giai đoạn build/phân phối tiếp theo, chưa được tạo APK/IPA chỉ bằng thay tsconfig.

Nguồn giới hạn SDK: https://docs.expo.dev/versions/v58.0.0/

Kiểm tra sau khi sửa config gốc: `tsc --noEmit -p tsconfig.json` và `npm run typecheck` đều đạt; export Android của cả bản du khách và Admin trên SDK 58 đều đạt. Export iOS của hai chế độ đã đạt ở lần kiểm tra trước đó. Chưa kiểm tra UI trên thiết bị Android/iPhone thật.
