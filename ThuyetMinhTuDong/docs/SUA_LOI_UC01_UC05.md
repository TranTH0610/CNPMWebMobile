> Ghi chú sau sắp xếp 23/10/2026: các đường dẫn src/visitor trong tài liệu lịch sử này đã đổi. Xem [cấu trúc hiện tại](CAU_TRUC_DU_AN.md) và [code hiện tại](UC06-UC11-CODE.md).

# Bản sửa UC01–UC05

Bản sửa dựa trên commit `b6596aa16aa81af4c5799b364bdc888a72a99288` của TranTH0610/CNPMWebMobile. Giữ phần chú thích, kiểm tra tọa độ, thử lại QR và xử lý ô nhập mà bạn đã thêm trên máy.

## Thứ tự chạy trên Windows

Mở PowerShell tại `D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong` (thư mục có `workspaces` trong package.json), không chạy npm tại thư mục cha.

```powershell
npm ci
npm run typecheck
npm run lint
npm test
npm run build:web
```

Dùng Node 22 LTS; bản sửa cũng đã chạy kiểm tra trên Node 20.20.2. `npm ci` cài theo lockfile, không cần cài plugin ESLint riêng trong thư mục cha nữa.

Chạy web:

```powershell
npm run dev --workspace=web
```

Chạy mobile qua Expo Go để kiểm tra UI:

```powershell
npm run start --workspace=mobile -- --clear
```

Expo Go vẫn là công cụ phát triển. Du khách quét QR bằng camera thường sẽ mở website; không phải cài Expo Go.

## Một QR chung

Tất cả trang chi tiết và trang `/qr` tạo cùng URL gốc; chọn địa điểm trên danh sách sau khi quét. Không còn tạo một mã riêng cho từng địa điểm trong UI. Parser vẫn nhận link chi tiết cũ để không làm hỏng link đã chia sẻ.

### Demo trong cùng Wi-Fi

1. Chạy `ipconfig`, lấy IPv4 của card Wi-Fi đang dùng.
2. Mở web trên máy tính bằng `http://<IPv4>:5173`, thay `<IPv4>` bằng IP thật. Khi mở theo IP LAN, web tạo được QR vào chung mà không cần cấu hình tên miền.
3. Hoặc copy `apps/web/.env.example` thành `apps/web/.env.local`, đặt `VITE_PUBLIC_SITE_URL=http://<IPv4>:5173`, rồi khởi động lại Vite.
4. Copy `apps/mobile/.env.example` thành `apps/mobile/.env`; đặt `EXPO_PUBLIC_VISITOR_WEB_ORIGIN` bằng đúng origin ở bước 3 nếu cần quét QR trong app. Khởi động lại Metro.
5. Điện thoại cùng Wi-Fi quét QR tại `/qr`. Địa chỉ `localhost` trên điện thoại là chính điện thoại, vì vậy code không tạo QR chứa localhost.

Nếu máy khác không truy cập được: kiểm tra cùng Wi-Fi, cổng Vite đang chạy và cho phép Node/Vite qua Windows Firewall cho mạng riêng. IP LAN thay đổi thì QR LAN cũng thay đổi. HTTP LAN chỉ hoạt động khi chạy Vite dev; website build công khai cần HTTPS.

### Dùng một QR cố định công khai

Triển khai web lên tên miền HTTPS thật. Đặt `VITE_PUBLIC_SITE_URL` bằng origin đó trước khi build (không thêm `/places`, query hay tài khoản). Đặt cùng origin trong `.env` mobile. Chỉ in QR sau khi URL thật đã chạy.

Không có tên miền thật trong dữ liệu được cung cấp, nên bản sửa không tạo một URL công khai giả. Tại localhost chưa cấu hình, UI hiển thị hướng dẫn bằng đúng ngôn ngữ đang chọn.

### Tự mở app đã cài

Đã có cấu hình mã nguồn, nhưng để hệ điều hành tin cậy liên kết cần định danh và bản app ký thật:

1. Trong mobile `.env`, điền `ANDROID_APPLICATION_ID` và/hoặc `IOS_BUNDLE_IDENTIFIER` của dự án thật. Không tự đổi ID nếu đã có app đang phát hành.
2. Trong web `.env.local` hoặc biến môi trường hosting, điền cùng ID. Thêm `ANDROID_SHA256_CERT_FINGERPRINTS` (một hoặc nhiều SHA-256, ngăn bằng dấu phẩy) và/hoặc `APPLE_TEAM_ID`.
3. Từ thư mục workspaces chạy `npm run links:generate`. Khi đã có cấu hình native, `npm run build:web` cũng tự sinh file này trước khi Vite build.
4. Deploy file `/.well-known/assetlinks.json` và/hoặc `/.well-known/apple-app-site-association` qua HTTPS. File phải truy cập công khai trực tiếp và trả JSON, không bị rewrite thành index.html. `apps/web/vercel.json` đã dành đường dẫn SPA riêng và cấu hình Content-Type cho AASA.
5. Build/cài lại app Android/iOS có định danh và chữ ký tương ứng. Thay cấu hình native không thể áp dụng chỉ bằng Fast Refresh hoặc Expo Go.
6. Quét cùng QR bằng camera ngoài app: chưa cài app thì mở web; app đã cài và tên miền được xác minh thì có thể mở app theo chính sách hệ điều hành/lựa chọn người dùng.

Thông tin này theo tài liệu chính thức: [Android App Links](https://docs.expo.dev/linking/android-app-links/), [iOS Universal Links](https://docs.expo.dev/linking/ios-universal-links/), [React Navigation 6 linking](https://reactnavigation.org/docs/6.x/configuring-links/).

Đối với Vercel, chọn Root Directory là `ThuyetMinhTuDong/apps/web`, Output Directory là `dist`; Build Command `npm run build`. CI hiện kiểm tra và tải artifact `web-dist`; không giả vờ deploy lên một hosting chưa được cấu hình.

## Bảng thư mục và file

Đường dẫn dưới đây tính từ gốc repository `D:\3.HTML\Đồ án CNPM`.

| Thư mục/file | Thay đổi | Chức năng |
|---|---|---|
| `.github/workflows/` | Tạo ở gốc Git | GitHub nhận diện workflow CI |
| `.github/workflows/mobile-ci.yml` | Di chuyển và sửa | Cài workspaces, typecheck/lint mobile/core, chạy test |
| `.github/workflows/web-ci.yml` | Di chuyển và sửa | Typecheck/lint, test, build và lưu artifact web |
| `ThuyetMinhTuDong/.github/workflows/` | Bỏ ba workflow cũ | Loại workflow sai cấp và bước deploy placeholder |
| `ThuyetMinhTuDong/package.json` | Sửa | Lệnh kiểm tra chung; khai báo plugin lint tại đúng gốc workspaces |
| `ThuyetMinhTuDong/package-lock.json` | Sửa | Khóa dependency để npm ci cài lại được |
| `ThuyetMinhTuDong/packages/visitor-core/src/mock.ts` | Sửa | Đủ năm bản ngôn ngữ cho tám điểm; buộc đủ tên bằng TypeScript |
| `ThuyetMinhTuDong/packages/visitor-core/src/site.ts` | Tạo | Kiểm tra origin dùng cho QR; từ chối localhost/domain ví dụ |
| `ThuyetMinhTuDong/packages/visitor-core/src/index.ts` | Sửa | Xuất hàm siteOrigin cho mobile/web |
| `ThuyetMinhTuDong/packages/visitor-core/src/uiMessages.ts` | Sửa | Thông báo cấu hình QR bằng VI/EN/CN/PT/JA |
| `ThuyetMinhTuDong/packages/visitor-core/src/messages.ts` | Sửa | Hướng dẫn quét QR chung bằng đủ năm ngôn ngữ |
| `ThuyetMinhTuDong/packages/visitor-core/tests/core.test.cjs` | Sửa | Đưa options đúng phạm vi, cập nhật số điểm, kiểm tra đủ/thiếu bản dịch |
| `ThuyetMinhTuDong/packages/visitor-core/tests/site.test.cjs` | Tạo | Test origin HTTPS/LAN và từ chối URL không dùng được |
| `ThuyetMinhTuDong/packages/visitor-core/tsconfig.test.json` | Sửa | Biên dịch site.ts cho Node test |
| `ThuyetMinhTuDong/packages/visitor-core/package.json` | Sửa | Đăng ký test mới |
| `ThuyetMinhTuDong/apps/mobile/src/visitor/DetailScreen.tsx` | Sửa | Đổi bản bài đọc qua provider chung, đồng bộ tab/tiêu đề/ngôn ngữ lưu |
| `ThuyetMinhTuDong/apps/mobile/src/visitor/platform.ts` | Sửa | Dùng origin hợp lệ cho scanner, không dùng domain ví dụ mặc định |
| `ThuyetMinhTuDong/apps/mobile/src/visitor/linking.ts` | Tạo | Nhận URL từ camera ngoài app, mở danh sách/chi tiết và giữ nút quay lại |
| `ThuyetMinhTuDong/apps/mobile/App.tsx` | Sửa | Gắn linking vào NavigationContainer |
| `ThuyetMinhTuDong/apps/mobile/app.config.js` | Tạo | Ghép scheme/intent filters/associated domains với cấu hình Expo cũ |
| `ThuyetMinhTuDong/apps/mobile/.env.example` | Sửa | Mẫu origin và định danh app thật |
| `ThuyetMinhTuDong/apps/web/src/pages.tsx` | Sửa | Một QR chung, thử lại tạo QR, ngôn ngữ bài đọc đồng bộ UI |
| `ThuyetMinhTuDong/apps/web/src/platform.ts` | Sửa | Chọn origin QR và chính sách parser dùng chung |
| `ThuyetMinhTuDong/apps/web/.env.example` | Sửa | Mẫu origin công khai và thông tin xác minh app |
| `ThuyetMinhTuDong/apps/web/package.json` | Sửa | Sinh association trước build khi có cấu hình native |
| `ThuyetMinhTuDong/apps/web/vite.config.ts` | Sửa | Copy static/.well-known, không copy public/index.html cũ |
| `ThuyetMinhTuDong/apps/web/vercel.json` | Sửa/tạo | Refresh route SPA và phục vụ AASA đúng kiểu JSON |
| `ThuyetMinhTuDong/scripts/generate-app-links.cjs` | Tạo | Kiểm tra thông tin ký, sinh JSON xác minh website/app |
| `ThuyetMinhTuDong/scripts/app-links.test.cjs` | Tạo | Test payload xác minh và giữ plugin Expo khi ghép cấu hình |
| `ThuyetMinhTuDong/docs/SUA_LOI_UC01_UC05.md` | Tạo | Hướng dẫn chạy, cấu hình, bảng file và kiểm tra thủ công |

## Luồng dữ liệu

Chọn ngôn ngữ ở navbar/tab Cài đặt hoặc bài đọc → `changeLanguage` trong provider → i18next phát sự kiện đổi ngôn ngữ → tiêu đề/tab và bản nội dung được render lại → lưu lựa chọn vào localStorage/AsyncStorage. Không còn state ngôn ngữ riêng trong màn chi tiết. Nội dung demo đủ năm bản; API thiếu bản công bố vẫn hiện thông báo thiếu, không tự dịch bản chưa duyệt.

Mở trang QR → `platform.ts` chọn origin → `siteOrigin` kiểm tra → `QRCode.toDataURL` tạo ảnh cục bộ → camera quét cùng URL gốc → hệ điều hành mở app đã xác minh hoặc website. Trong app, `linking.ts` dùng parser chung và chuyển tới danh sách/chi tiết; service tiếp tục kiểm tra ID và bản công bố.

## Cách kiểm tra các file chạy đúng

- Dữ liệu/test: chạy `npm test`; 11 test visitor-core, 5 test place-core và 2 test cấu hình app phải đạt. Mock có tám điểm, mỗi điểm có VI/EN/CN/PT/JA.
- Ngôn ngữ: vào chi tiết Điện Thái Hòa, chọn lần lượt Trung/Bồ/Nhật/Anh/Việt. Bài đọc, nút và tiêu đề/tab phải cùng ngôn ngữ. Tải lại web/mở lại app phải giữ lựa chọn.
- QR web: trên localhost chưa cấu hình phải hiện hướng dẫn; qua IP LAN dev hoặc HTTPS đã cấu hình phải hiện QR. Chuyển giữa hai điểm và `/qr`, URL mã hóa phải giống nhau. Thử lỗi tạo ảnh QR rồi nút Thử lại.
- Router: nhập ID không tồn tại → báo không tìm thấy; QR domain lạ → báo QR sai; sửa nội dung ô nhập → xóa thông báo lỗi cũ. Refresh `/places/ngo-mon` trên hosting phải vẫn mở đúng trang.
- App Links: cần điện thoại thật, app ký riêng và domain thật; thử app tắt hoàn toàn và app đang mở. Thiếu các điều kiện này chưa thể kết luận tính năng xác minh hệ điều hành đã chạy.
- CI: sau khi push lên GitHub, xác nhận Mobile CI/Web CI xuất hiện tại tab Actions. Thay file shared phải kích hoạt cả hai workflow.

## Những giới hạn còn cần triển khai thật

Bài thuyết minh vẫn là nội dung minh họa có thông báo demo. Bản sửa không tự biến nó thành nội dung di tích đã được đơn vị quản lý duyệt. UC01–UC05 hiện là xem/đọc nội dung; không mở rộng thêm TTS hoặc tự phát âm thanh.

Chưa phát hành website hoặc app, chưa có tên miền/chứng thư ký thật, nên chưa xác nhận camera điện thoại, Android App Links và iOS Universal Links trên thiết bị thật. Không cần Expo Go để quét mở website.

Gợi ý commit: `fix(visitor): sync languages, repair checks and support a shared QR entry`.
