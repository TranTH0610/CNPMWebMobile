# Báo cáo redesign Hue Imperial Heritage

Thiết kế: 04/11/2026. Hoàn tất xác minh: 05/11/2026. Thư mục dự án: `D:/3.HTML/Đồ án CNPM/ThuyetMinhTuDong`.
Đây là chỉnh sửa trực tiếp dự án hiện có; không tạo app mới, không thêm thư viện.

## 1. Audit kiến trúc thực tế

| Phần | Công nghệ / vai trò |
|---|---|
| Web | React 18, Vite 5, React Router 6, CSS thường, Leaflet |
| Mobile | Expo SDK 58, React Native 0.88, React 19.3; stack/tab Navigation 6; SafeArea |
| Âm thanh / vị trí | expo-audio, expo-speech, expo-location, react-native-maps; adapter web tương ứng |
| State và i18n | React context/hooks trong visitor-core/admin-core; i18next/react-i18next; vi/en/cn/pt/ja |
| Workspace | apps/mobile, apps/web; packages/visitor-core, admin-core, place-core, api-client, shared-types, ui-tokens |
| Dữ liệu đang có | API danh mục/media 8788; presence 8787; SQL Server. UI tiếp tục đọc qua service cũ |

Vấn đề trước thay đổi: màu xanh chung chưa thể hiện di sản; Unicode icon không thống nhất;
chữ/target native nhỏ; player luôn mở lớn làm giảm diện tích đọc; trạng thái GPS thiếu khối phân cấp rõ;
web thiếu nhịp giới thiệu và đường dẫn khám phá rõ; form/menu quản trị cần thống nhất nhận diện.

## 2. Màn hình và phạm vi cải tiến

| Nền tảng | Màn hình / route | Cách cải tiến |
|---|---|---|
| Web du khách | `/` | Hero ảnh thật, CTA khám phá/map, giới thiệu, card/featured/catalog đồng bộ |
| Web du khách | `/places` | Grid/list, filter, search, phân trang giữ nguyên; typography/card/state mới |
| Web du khách | `/places/:id` | Layout ảnh/thông tin, nội dung đọc thoáng, ngôn ngữ và thao tác nghe rõ |
| Web du khách | `/journey` | GPS status, marker44px, danh sách/routes, nút hiện có; giữ thuật toán |
| Web du khách | NotFound | Kế thừa state/button/tokens mới; không đổi wildcard |
| Web admin | Dashboard; Places; PlaceForm(new/edit); ContentEditor; Reviews; ReviewDetail | Khung teal, form/card/nhãn trạng thái ivory/red; CSS chung áp dụng cả các trang hiện có |
| Native du khách | Home/Explore và SearchResult | Hero/CTA, FlatList/chips/card, vùng chạm và thang chữ |
| Native du khách | Detail | Tiêu đề serif, bài đọc dễ nhìn; giữ LanguageBar và vùng cuộn hiện có |
| Native du khách | Journey/Map | GPS card và PlaceCard; marker/token/map radius mới |
| Native du khách | Settings | Hero ngôn ngữ và LanguageBar; không tạo tùy chọn giả |
| Native admin | Dashboard, Places, PlaceForm, ContentEditor, Reviews, ReviewDetail | Kế thừa AdminUI/theme mới; nghe thử đủ vùng chạm; không thay form/service |
| Hai nền tảng | Player toàn cục | Mặc định thu gọn, mở rộng đầy đủ tua/rate; trạng thái/lỗi/retry/restore được giữ |

Chức năng thực tế đã giữ: search không dấu, debounce, lọc, sort fallback, refresh native,
phân trang web, chọn ngôn ngữ, chi tiết/bản công bố, GPS/map/gợi ý, bài nghe/restore,
CRUD/nháp/dịch/audio/duyệt ở admin, thống kê phiên/QR. Không thêm lại About, yêu thích hay QR du khách.

## 3. Danh sách file chỉnh sửa trong đợt này

Đối chiếu byte với bản sao trước redesign; không lấy toàn bộ working tree vốn đã có thay đổi trước đó.

| File (tính từ thư mục dự án) | Thay đổi | Chức năng |
|---|---|---|
| `apps/web/src/features/explore/components/NutLocDanhMuc.tsx` | Sửa | Chip danh mục và icon đồng bộ; giữ callback lọc hiện có. |
| `apps/web/src/features/journey/components/TrangThaiDinhVi.tsx` | Tạo mới | Hiển thị trạng thái GPS, địa điểm gợi ý và bài đang phát từ engine. |
| `apps/web/src/shared/components/BieuTrungDiSan.tsx` | Tạo mới | Logo SVG lấy nét cổng cung đình, không phụ thuộc font emoji. |
| `apps/web/src/shared/components/BieuTuong.tsx` | Sửa | Icon SVG dùng chung trên web. |
| `apps/web/src/features/journey/components/TrinhNgheThuyetMinh.tsx` | Sửa | Player gọn/mở rộng; giữ play/pause/seek/rate/close của engine. |
| `apps/web/src/features/language/components/ChonNgonNgu.tsx` | Sửa | Bộ chọn năm ngôn ngữ có nhãn dễ đọc. |
| `apps/web/src/shared/layouts/ThanhDieuHuong.tsx` | Sửa | Logo, menu và lựa chọn ngôn ngữ hiện có. |
| `apps/web/src/shared/components/TrangThaiDuLieu.tsx` | Sửa | Loading/empty/error, skeleton web và nút thử lại. |
| `apps/web/src/features/journey/components/BanDoThamQuan.tsx` | Sửa | Trình bày marker/map; không sửa tọa độ hay thuật toán. |
| `apps/web/src/features/admin/shared/layouts/BoCucQuanTri.tsx` | Sửa | Khung quản trị, logo và điều hướng. |
| `apps/web/src/shared/layouts/BoCucDuKhach.tsx` | Sửa | Khung du khách và skip-link đến nội dung chính. |
| `apps/web/src/main-admin.tsx` | Sửa | Nạp token/style cho entry quản trị. |
| `apps/web/src/main.tsx` | Sửa | Nạp token/style cho entry du khách. |
| `apps/web/src/features/explore/pages/TrangChu.tsx` | Sửa | Hero, đường dẫn khám phá và giới thiệu ngắn; giữ catalog. |
| `apps/web/src/features/journey/pages/TrangHanhTrinh.tsx` | Sửa | Ghép trạng thái GPS mới với trang hành trình hiện có. |
| `apps/web/src/features/admin/styles/GiaoDienQuanTri.css` | Sửa | Nhận diện quản trị và màu trạng thái. |
| `apps/web/src/shared/styles/DiSanHue.css` | Tạo mới | Tương tác/focus/player/GPS và override quản trị responsive. |
| `apps/web/src/features/explore/styles/GiaoDienDuKhach.css` | Sửa | Layout du khách: hero, catalog, chi tiết, responsive. |
| `apps/mobile/src/shared/components/NutThaoTac.tsx` | Sửa | Nút native đủ vùng chạm và phản hồi nhấn. |
| `apps/mobile/src/features/admin/shared/components/ThanhPhanQuanTri.tsx` | Sửa | Style/component dùng chung mọi màn quản trị native. |
| `apps/mobile/src/features/admin/content/components/NgheThuBanThu.tsx` | Sửa | Điều khiển nghe thử admin dễ chạm; không đổi audio controller. |
| `apps/mobile/src/features/explore/components/NutLocDanhMuc.tsx` | Sửa | Chip danh mục và icon đồng bộ; giữ callback lọc hiện có. |
| `apps/mobile/src/features/journey/components/TrangThaiDinhVi.tsx` | Tạo mới | Hiển thị trạng thái GPS, địa điểm gợi ý và bài đang phát từ engine. |
| `apps/mobile/src/features/journey/components/TrinhNgheThuyetMinh.tsx` | Sửa | Player gọn/mở rộng; giữ play/pause/seek/rate/close của engine. |
| `apps/mobile/src/shared/components/TrangThaiDuLieu.tsx` | Sửa | Loading/empty/error, skeleton web và nút thử lại. |
| `apps/mobile/src/features/journey/components/BanDoThamQuan.tsx` | Sửa | Trình bày marker/map; không sửa tọa độ hay thuật toán. |
| `apps/mobile/src/navigation/ThanhDieuHuongDuKhach.tsx` | Sửa | Nhãn/tab đang chọn và safe area. |
| `apps/mobile/src/navigation/DieuHuongGoc.tsx` | Sửa | Màu header và canvas; giữ stack/routes. |
| `apps/mobile/src/features/place-detail/screens/ManChiTietDiTich.tsx` | Sửa | Typography nội dung đọc và tiêu đề di tích. |
| `apps/mobile/src/features/explore/screens/ManKhamPha.tsx` | Sửa | Hero, CTA, giới thiệu và danh sách native hiện có. |
| `apps/mobile/src/features/journey/screens/ManHanhTrinh.tsx` | Sửa | GPS status và card di tích dễ chọn trên native. |
| `apps/mobile/src/features/settings/screens/ManCaiDat.tsx` | Sửa | Khung ngôn ngữ và bố cục cài đặt. |
| `apps/mobile/src/features/explore/GiaoDienKhamPha.ts` | Sửa | Style tìm kiếm/danh sách/hero native. |
| `apps/mobile/src/shared/GiaoDienChung.ts` | Sửa | Nối token shared với style native. |
| `packages/ui-tokens/MauVaKichThuoc.ts` | Sửa | Token màu/spacing/radius/type/motion/elevation. |
| `packages/ui-tokens/HienThiDinhVi.ts` | Tạo mới | Ánh xạ trạng thái thành nhãn UI, không xử lý GPS. |
| `packages/visitor-core/src/i18n/BanDichTraiNghiem.ts` | Tạo mới | Nhãn UI Heritage đủ năm ngôn ngữ. |
| `packages/visitor-core/src/i18n/BanDichGiaoDien.ts` | Sửa | Ghép nhãn mới vào i18n hiện tại. |

Ngoài các file trên: `design-system/hue-imperial-heritage/MASTER.md` mô tả quy tắc thiết kế;
`docs/ThietKeGiaoDienDiSan.md` là báo cáo này. Không xóa nguồn, không commit/push.

## 4. Luồng trải nghiệm

Người dùng chọn ngôn ngữ → provider/i18n cũ cập nhật → navbar/card/bài đọc nhận cùng lựa chọn.
Chọn di tích → route/stack cũ → nhấn nghe gọi engine cũ → mini-player phản ánh session thật.
Mở rộng chỉ đổi state trình bày; phát/tạm dừng/tua/tốc độ vẫn gọi đúng controller.
Bật GPS qua thao tác hiện có → adapter và engine cũ cấp trạng thái → GpsStatus ánh xạ thành nhãn.
Không xin vị trí hoặc tự phát audio từ component GpsStatus. Bán kính và haversine không đổi.

## 5. QA đã chạy

- Typecheck toàn bộ workspaces: đạt.
- Lint toàn bộ app/core/service: đạt.
- Format check: đạt sau định dạng các file CSS mới.
- Production build web visitor và admin: đạt.
- Expo export iOS và Android (`--no-bytecode` để kiểm tra bundle trên Windows): đạt, mỗi bundle khoảng 2.2 MB.
- Unit admin-core 26/26; visitor-core 50/50; place-core 5/5; app-links/QR 11/11; presence SQL 8/8: đạt.
- Lượt catalog đầu: 22/26; 4 lỗi timeout HTTP/ODBC. Chạy lại riêng 4 ca: 4/4 đạt (`catalog-retry.log`).
  Kết quả này là tổng hợp nhiều lượt, không báo `npm test` đạt ngay từ lượt đầu.
- Nhóm kiểm tra riêng translation/command validation/narration/startup/mobile/env: 34/34, log `non-sql.log`.
- Database/ràng buộc SQL: 26/26; media SQL/HEAD/Range/quyền công bố: 5/5 đạt.
- Tổng 176 ca riêng biệt có kết quả đạt qua các lượt; các ca translation/validation chạy lặp không đếm hai lần.
- Browser thực tế: desktop 1280/1440 px và mobile browser 375 px; kiểm tra overflow bằng DOM.
- Lọc Cổng thành cập nhật ngay; tìm rỗng có yêu cầu nhập; `ngo mon` tìm được dữ liệu không dấu
  (có thể nhiều kết quả vì tìm cả mô tả). Marker Ngọ Môn mở đúng `/places/ngo-mon`.
- Đổi en/cn/pt/ja và trở lại vi: header/nội dung cập nhật; viewport 375 px không tràn ngang.
- Audio Nhật thực tế 0:36: play, pause, resume từ 11.8 s, seek 11.9 s, rate 1.25 và đóng đều phản ánh đúng UI.
- Admin: đọc danh sách 9 di tích từ nguồn thật, mở form mới đủ năm ngôn ngữ, review rỗng đúng trạng thái;
  không thêm/sửa/xóa/công bố bản ghi thật để thử giao diện.
- Ảnh QA ở `C:/Users/gauba/OneDrive/Documents/ChatGPT/CNPM 6/outputs/heritage-redesign`.

## 6. Giới hạn kiểm chứng và bảo toàn

- Không có thiết bị iOS/Android kết nối; export/typecheck không thay thế thao tác trên máy thật.
- Chưa kiểm tra đi bộ thực địa, tín hiệu GPS yếu thực tế, quyền vị trí hệ điều hành hay font trợ năng rất lớn.
- Công cụ resize chưa phản ánh ổn định breakpoint tablet trong DOM; CSS đã có responsive nhưng không
  báo tablet/landscape là đã kiểm thử đầy đủ.
- Đã tính 5 cặp tương phản token chính (xem MASTER), chưa kiểm toán WCAG toàn bộ bằng công cụ chuyên dụng.
- SQL/API có lúc chậm 9–13 giây trong lượt đầu; source backend được giữ nguyên. Chưa khẳng định thời gian tải < 2 giây.
- Cổng 5173/5174 bị Windows từ chối bind trong môi trường này; QA dùng 4173/4174, không đổi config mặc định/firewall.
- Không thay schema/API contract/nội dung lịch sử/bản dịch dữ liệu; không thêm dependency/theme giả.

Đối chiếu SHA256: 89 file domain/service/adapter/GPS được bảo vệ; số file khác: 0.
