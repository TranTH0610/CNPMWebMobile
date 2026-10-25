# Admin FE dùng chung cho mobile và web

Nguồn đối chiếu: GitHub TranTH0610/CNPMWebMobile, main e207cb7 (UC6–UC11). Triển khai tại D:/3.HTML/Đồ án CNPM/ThuyetMinhTuDong. Không commit/push trong lượt này.

## Phạm vi đã chốt

| UC | Chức năng | Bản FE hiện tại |
|---|---|---|
| UC12 | Truy cập quản lý bằng danh tính cung cấp sẵn | Không đăng nhập; mode demo; cùng một vai trò quản lý |
| UC13 | Quản lý di tích | Tìm không dấu, thêm/sửa metadata, ảnh, tọa độ, lưu trữ |
| UC14 | Biên tập đa ngôn ngữ | Việt/Anh/Trung/Bồ/Nhật, bản nháp, URL hoặc tệp thu, nghe trước |
| UC14.1 | Yêu cầu dịch | Mock bất đồng bộ, nhãn DEMO; không phải dịch thật |
| UC14.2 | Chuẩn bị giọng đọc | MP3 mẫu theo ngôn ngữ hoặc bản thu người dùng chọn; TTS mock không đọc văn bản mới |
| UC15 | Kiểm duyệt | So sánh/nghe các bản, yêu cầu sửa có ghi chú, duyệt đúng revision |
| UC16 | Công bố | Xác nhận, chặn bản chưa duyệt/đã sửa; bản cũ giữ nguyên nếu ghi lỗi |
| UC17 bổ sung | Thống kê phiên | Web/App/đang nghe/lượt QR mô phỏng; 90 giây hết active |
| SCR-W06 | QR tại cổng | Web xuất PNG QR chung; native mở/chia sẻ liên kết và trang QR |

Đây là bản FE demo, không phải xác thực/bảo mật quản trị thực tế. Danh tính được cung cấp sẵn, không có màn đăng nhập. Chỉ có vai trò Quản lý. Không trộn tài khoản du khách vào luồng này.

## Cách chạy

Từ gốc ThuyetMinhTuDong:

```powershell
npm install
npm run dev --workspace=web -- --port 5173 --strictPort
```

Mở http://localhost:5173/admin (hoặc http://127.0.0.1:5173/admin). Hai hostname có bộ nhớ trình duyệt riêng; nên chọn một địa chỉ cố định khi demo. Nếu cổng đang dùng, tận dụng Vite đang chạy, không mở thêm một server cùng cổng.

Mobile:

```powershell
cd apps/mobile
npx expo start --clear
```

Vào Cài đặt → Quản lý · Demo. Package mới được nối qua npm workspaces; nếu báo không tìm thấy admin-core, chạy npm install tại gốc rồi khởi động lại Metro/TypeScript server. Đã thêm expo-document-picker ~57.0.3 và expo-file-system ~57.0.7 bằng `npx expo install expo-document-picker expo-file-system -- --ignore-scripts` theo SDK hiện tại. Máy khác dùng `npm ci` sau khi có lockfile mới.

## Thư mục và vai trò

- packages/admin-core: kiểu, hợp đồng service, validation, workflow mock, bộ dịch và hooks dùng chung. Không có UI native/DOM.
- apps/web/src/pages/admin và components/admin: giao diện web responsive, sidebar, form, preview và modal.
- apps/mobile/src/screens/admin và components/admin: màn native, FlatList, biểu mẫu, preview và bộ chọn tệp.
- services/admin/services.ts của mỗi app: ghép storage riêng với cùng service.
- navigation: route riêng; không tạo NavigationContainer/i18n thứ hai.

| File | Thao tác | Vai trò |
|---|---|---|
| `packages/admin-core/package.json` | TẠO MỚI | Cấu hình workspace, dependency hoặc triển khai |
| `packages/admin-core/tsconfig.json` | TẠO MỚI | Cấu hình workspace, dependency hoặc triển khai |
| `packages/admin-core/tsconfig.test.json` | TẠO MỚI | Cấu hình workspace, dependency hoặc triển khai |
| `packages/admin-core/src/models.ts` | TẠO MỚI | Kiểu dữ liệu Admin UC12–UC17 và danh tính được cấp sẵn. |
| `packages/admin-core/src/contracts.ts` | TẠO MỚI | Hợp đồng service để sau thay mock bằng API mà giữ UI. |
| `packages/admin-core/src/validation.ts` | TẠO MỚI | Kiểm tra biểu mẫu và tính thống kê phiên mô phỏng. |
| `packages/admin-core/src/mockService.ts` | TẠO MỚI | Adapter Admin demo có lưu cục bộ và kiểm tra phiên bản. |
| `packages/admin-core/src/messages.ts` | TẠO MỚI | Chữ Admin đủ năm ngôn ngữ dùng chung mobile/web. |
| `packages/admin-core/src/index.ts` | TẠO MỚI | Entry logic thuần Admin; app import bằng tên package. |
| `packages/admin-core/src/react.tsx` | TẠO MỚI | Context và hooks Admin dùng chung, UI không biết adapter lưu ở đâu. |
| `.gitignore` | SỬA | Cấu hình workspace, dependency hoặc triển khai |
| `apps/mobile/package.json` | SỬA | Cấu hình workspace, dependency hoặc triển khai |
| `apps/mobile/src/components/admin/AdminUI.tsx` | TẠO MỚI | Khung, trường nhập, feedback và nghe thử cho Admin native. |
| `apps/mobile/src/components/admin/LocalMediaPicker.tsx` | TẠO MỚI | Chọn ảnh/bản thu từ thiết bị, lưu cục bộ cho FE demo. |
| `apps/mobile/src/navigation/AdminNavigator.tsx` | TẠO MỚI | Stack Admin native không đăng nhập, tách khỏi các màn visitor. |
| `apps/mobile/src/navigation/RootNavigator.tsx` | SỬA | Stack điều hướng mobile, giữ một NavigationContainer và một trình phát toàn app. |
| `apps/mobile/src/navigation/adminTypes.ts` | TẠO MỚI | Kiểu route Admin native; AdminNavigator và màn hình dùng. |
| `apps/mobile/src/navigation/types.ts` | SỬA | Tách riêng một phần giao diện để dễ tìm và bảo trì. |
| `apps/mobile/src/providers/AppProviders.tsx` | SỬA | Ghép các provider mobile một lần tại gốc, giữ nguyên khóa lưu ngôn ngữ/tiến độ. |
| `apps/mobile/src/screens/DetailScreen.tsx` | SỬA | Hiển thị bài đọc đúng ngôn ngữ, nút nghe và nút mở bản đồ của địa điểm. |
| `apps/mobile/src/screens/SettingsScreen.tsx` | SỬA | Hiển thị chọn ngôn ngữ chung và liên kết truy cập website/QR. |
| `apps/mobile/src/screens/admin/ContentEditorScreen.tsx` | TẠO MỚI | Biên tập 5 ngôn ngữ native, audio URL và dịch/TTS demo. |
| `apps/mobile/src/screens/admin/DashboardScreen.tsx` | TẠO MỚI | Dashboard native cùng số liệu/quy tắc với Admin Web. |
| `apps/mobile/src/screens/admin/PlaceFormScreen.tsx` | TẠO MỚI | Metadata native tương đương biểu mẫu web. |
| `apps/mobile/src/screens/admin/PlacesScreen.tsx` | TẠO MỚI | FlatList danh mục Admin, tìm không dấu và mở biểu mẫu. |
| `apps/mobile/src/screens/admin/QrScreen.tsx` | TẠO MỚI | Quản lý liên kết QR chung trên native. |
| `apps/mobile/src/screens/admin/ReviewsScreen.tsx` | TẠO MỚI | Danh sách chờ duyệt, so sánh năm bản và công bố native. |
| `apps/mobile/src/services/admin/services.ts` | TẠO MỚI | Ghép adapter cục bộ của nền tảng với hợp đồng Admin. |
| `apps/web/package.json` | SỬA | Cấu hình workspace, dependency hoặc triển khai |
| `apps/web/src/components/Navbar.tsx` | SỬA | Thanh điều hướng web, logo, chọn ngôn ngữ và liên kết QR chung. |
| `apps/web/src/components/admin/AdminUI.tsx` | TẠO MỚI | Thành phần và hooks nhỏ dùng lại trong Admin Web. |
| `apps/web/src/components/admin/LocalMediaPicker.tsx` | TẠO MỚI | Chọn tệp local cho bản FE, không giả gọi upload server. |
| `apps/web/src/layouts/AdminLayout.tsx` | TẠO MỚI | Khung Admin Web màu xanh/trắng cùng trang du khách. |
| `apps/web/src/main.tsx` | SỬA | Mount React 18, BrowserRouter và các provider; giữ ngôn ngữ/tiến độ dùng chung. |
| `apps/web/src/navigation/AdminRoutes.tsx` | TẠO MỚI | Cây route Admin Web, không có route đăng nhập theo phạm vi FE. |
| `apps/web/src/navigation/AppRoutes.tsx` | SỬA | Bảng route web; không chứa code UI của từng trang. |
| `apps/web/src/pages/DetailPage.tsx` | SỬA | Trang bài đọc, đổi ngôn ngữ, nghe thuyết minh và mở marker địa điểm. |
| `apps/web/src/pages/admin/ContentEditorPage.tsx` | TẠO MỚI | Biên tập năm ngôn ngữ, bản thu URL, dịch/TTS demo và gửi duyệt. |
| `apps/web/src/pages/admin/DashboardPage.tsx` | TẠO MỚI | Dashboard thống kê phiên mô phỏng và tình trạng nội dung. |
| `apps/web/src/pages/admin/PlaceFormPage.tsx` | TẠO MỚI | Tạo/sửa metadata di tích, ảnh và tọa độ xác nhận. |
| `apps/web/src/pages/admin/PlacesPage.tsx` | TẠO MỚI | Danh mục di tích Admin có tìm không dấu, ảnh và trạng thái. |
| `apps/web/src/pages/admin/QrPage.tsx` | TẠO MỚI | Xuất cùng QR tại cổng, tái sử dụng component visitor. |
| `apps/web/src/pages/admin/ReviewsPage.tsx` | TẠO MỚI | So sánh văn bản/audio, yêu cầu sửa, duyệt và công bố đúng bản. |
| `apps/web/src/services/admin/services.ts` | TẠO MỚI | Ghép adapter cục bộ của nền tảng với hợp đồng Admin. |
| `apps/web/src/styles/admin.css` | TẠO MỚI | Màu xanh/trắng và typography Admin theo token trang du khách. |
| `apps/web/vercel.json` | SỬA | Cấu hình workspace, dependency hoặc triển khai |
| `package.json` | SỬA | Cấu hình workspace, dependency hoặc triển khai |
| `packages/admin-core/tests/admin.test.cjs` | TẠO MỚI | Test nghiệp vụ thật Admin không cần trình duyệt/BE. |
| `packages/visitor-core/src/catalog.ts` | SỬA |  |
| `packages/visitor-core/src/journey-react.tsx` | SỬA | Giữ một phiên nghe/GPS xuyên suốt mọi màn UC06–UC11. |
| `packages/visitor-core/src/journey.ts` | SỬA | Điều phối GPS, một nguồn audio và lưu tiến độ UC06–UC11. |
| `packages/visitor-core/src/model.ts` | SỬA |  |
| `packages/visitor-core/src/react.tsx` | SỬA |  |
| `scripts/build-admin-tests.cjs` | TẠO MỚI | Bundle logic Admin để Node test đọc được workspace TypeScript. |

Hai workflow thật nằm ở D:/3.HTML/Đồ án CNPM/.github/workflows, ngoài gốc npm workspace một cấp. Đã thêm typecheck/lint admin-core tại đây để CI kiểm tra package mới. package-lock.json cập nhật bằng npm; không cần copy thủ công nội dung lockfile.

## Luồng dữ liệu và trạng thái

Người quản lý nhập form → hook gọi AdminService → mock kiểm tra dữ liệu/revision → ghi storage thành công → cập nhật cache và thông báo → hook tải snapshot mới → UI đổi trạng thái. Không báo thành công nếu ghi lỗi.

record là bản đang sửa; published là snapshot công khai riêng. Lưu nháp không thay published. Gửi duyệt cần ảnh, nội dung Việt và audio cho các bản ngôn ngữ đã nhập. Duyệt gắn approvedRevision. Sửa sau duyệt tăng revision và xóa approval. Công bố chỉ nhận đúng revision đã duyệt; bản public cũ được giữ đến khi ghi thành công. Thay body làm audio cũ không còn khớp và yêu cầu chuẩn bị lại.

publicCatalog chỉ đọc published. Subscription làm mới danh sách/chi tiết/map trong cùng ứng dụng sau thay đổi, không tạo lại player. Bài đang nghe không bị ép chuyển nguồn vì thao tác quản trị. Vào Admin chủ động pause bài du khách trước khi nghe preview.

Tệp local là data URL có MIME cho phép và tối đa 1 MB gốc mỗi tệp. Có thể gặp giới hạn tổng dung lượng localStorage/AsyncStorage; khi đó báo saveError, không giả lưu thành công. Trong bản thật, thay bằng upload API trả URL; không đưa base64 vào database tùy tiện.

## Giới hạn cần trình bày đúng

- Dữ liệu chỉ thuộc app/trình duyệt đang dùng, chưa đồng bộ điện thoại với web hoặc nhiều tab khác instance.
- Thống kê hoàn toàn mô phỏng; chưa tự đo điện thoại quét QR thực tế. Web trên điện thoại vẫn là Web; App Mobile là native.
- Phiên hết active sau 90 giây là tham số demo. Lượt QR hôm nay là số phiên mô phỏng tạo trong ngày, không phải vé hay người duy nhất.
- Dịch chỉ tạo chuỗi [DEMO]; TTS gắn MP3 mẫu có sẵn, không đọc văn bản vừa sửa. Upload bản thu thật là lựa chọn FE nếu có file nhỏ phù hợp.
- Hàng rào tọa độ quanh Huế chỉ là kiểm tra nhập liệu sơ bộ, không thay ranh giới triển khai hoặc khảo sát thực địa.
- Kiểm thử build không chứng minh native UI/permission/file picker chạy trên mọi thiết bị; cần thử Expo Go/bản cài thật.
- Hỏi rời form web bảo vệ liên kết và đóng/tải lại tab; cần kiểm tra thêm thao tác Back/Forward của browser. Native beforeRemove cần kiểm tra trên thiết bị thật.

## Ghép BE sau này

1. BE thống nhất AdminService ở contracts.ts và mã lỗi AdminErrorCode; bổ sung mapping request/response, không để UI đoán schema.
2. Viết HTTP adapter thực hiện cùng interface, thay factory tại services/admin/services.ts. Hiện chưa có API adapter hoạt động vì chưa có BE/hợp đồng endpoint được chốt.
3. identity() lấy danh tính/phiên được cấp; BE kiểm tra quyền trên mọi thao tác. Không coi danh tính demo là cơ chế xác thực.
4. BE xử lý revision/xung đột và công bố bằng giao dịch; không chỉ tin điều kiện FE.
5. Translation/TTS adapter dùng job id + revision; API key chỉ ở BE. Mock hiện kiểm tra revision khi tác vụ hoàn tất.
6. published() đọc endpoint public dùng chung; invalidate sau publish. Nguồn GPS/tuyến OSM demo vẫn tách riêng, chưa trở thành dữ liệu khảo sát chỉ vì Admin đánh dấu tọa độ.
7. Analytics đọc số tổng hợp từ BE; đổi simulate/endSessions thành công cụ demo riêng. Giữ đúng khái niệm phiên, tránh tuyên bố số người thật.

## Checklist chạy thử

1. /admin vào thẳng, có nhãn demo; mobile vào từ Cài đặt.
2. Mô phỏng Web/App/đang nghe: bộ đếm tăng đúng; kết thúc phiên về active=0; chờ >90 giây không còn active.
3. Tìm ky dai; thêm/sửa metadata; nhập tọa độ ngoài Huế hoặc URL javascript phải lỗi.
4. Sửa bản nháp, quay lại visitor trước publish: vẫn bản cũ.
5. Sửa body → audio cũ bỏ; chọn file <=1MB hoặc tạo audio demo; lưu rồi gửi duyệt.
6. Yêu cầu sửa cần ghi chú; sửa sau approve phải duyệt lại.
7. Duyệt → xác nhận công bố → visitor nhận phiên bản mới trong cùng app.
8. JSON hỏng/lưu storage lỗi có feedback; Reset demo có xác nhận và phục hồi được dữ liệu hỏng.
9. VI/EN/CN/PT/JA đổi nhãn Admin đồng nhất; màn 390px không tràn ngang.
10. QR Admin vẫn vào trang du khách, không vào /admin, không có QR từng điểm.

```powershell
npm run typecheck
npm run lint
npm test
npm run build:web
cd apps/mobile
npx expo export --platform android --output-dir .verify-admin --no-bytecode
```

Gợi ý commit: `feat(admin): add shared demo management for web and mobile`.

## Kết quả kiểm tra lần triển khai này

- TypeScript và ESLint đạt cho admin-core, visitor-core, mobile và web.
- 59 tests đạt: 15 Admin + 32 visitor-core + 5 place-core + 7 scripts.
- Vite production build đạt; code UI Admin được tách thành chunk tải khi vào /admin.
- Expo export Android đạt, gồm document-picker/file-system. Chưa chạy UI Admin native trên thiết bị thật, chưa nghiệm thu thao tác chọn file/Back của từng hệ điều hành.
- UI web đã thử: thêm phiên Web/App/đang nghe; lưu nháp→gửi duyệt→duyệt→xác nhận công bố; trang khách hiển thị phiên bản mới; reset demo; responsive 390px; đổi nhãn tiếng Trung rồi trả về Việt.
- Bộ nhớ test ở http://127.0.0.1:5173 khác http://localhost:5173. Không dùng sự khác nhau này để kết luận mất dữ liệu.


## Bổ sung xóa vĩnh viễn từng di tích

Admin → Di tích → Thông tin → Xóa vĩnh viễn → kiểm tra tên điểm → Xác nhận. Nút này xóa cả bản nháp và bản công khai của đúng điểm khỏi bộ nhớ cục bộ, kể cả điểm đã lưu trữ; không ảnh hưởng điểm khác và không xóa ảnh asset dùng chung. Không có nút hoàn tác. Reset toàn bộ demo vẫn có thể nạp lại các điểm seed mặc định, vì đây không phải xóa trên database thật.

Web dùng hộp xác nhận trong ứng dụng; mobile dùng Alert có nút Hủy/Xóa vĩnh viễn. Service mới deletePlace(id, revision) giữ kiểm tra revision và chỉ cập nhật cache sau khi ghi thành công. Khi ghép BE, HTTP adapter cần triển khai thao tác này và BE kiểm tra quyền/tham chiếu dữ liệu.

Đã đạt TypeScript/lint toàn dự án và 18 tests Admin, bao gồm ba test mới cho xóa. UI web đã kiểm tra nút/hộp xác nhận và bấm Hủy; không thực hiện xóa dữ liệu người dùng. Mobile mới kiểm tra kiểu, chưa thử thao tác trên thiết bị thật trong lượt này.
