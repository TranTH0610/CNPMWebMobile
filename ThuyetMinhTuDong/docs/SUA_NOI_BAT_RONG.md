# Sửa mục địa điểm nổi bật rỗng trên web và mobile

Nguyên nhân: bộ lọc chọn Công trình di tích tìm thấy Kỳ Đài nhưng điểm đó chưa có cờ featured. Trước đây carousel vẫn vẽ khung và nút cuộn dù không có thẻ.

## Hành vi sau sửa

- Không có điểm nổi bật phù hợp: thông báo ngắn, gợi ý xem danh sách dưới, nút Xóa tất cả khi có lọc.
- Danh sách chính vẫn giữ điều kiện lọc, vẫn hiển thị Kỳ Đài. Không tự sửa dữ liệu hoặc đánh dấu điểm thường thành nổi bật.
- Web: chỉ hiện mũi tên khi scrollWidth vượt clientWidth; khóa nút ở đầu/cuối và đo lại khi resize. Dọn scroll listener/ResizeObserver khi rời màn.
- Native: không dựng carousel rỗng; không vẽ chấm khi chỉ có một thẻ; đổi danh mục hoặc xoay màn hình thì về slide đầu.
- useMemo giữ danh sách nổi bật ổn định khi dữ liệu/danh mục không đổi. Thông báo có đủ vi/en/cn/pt/ja.

## File và vai trò

| File | Vai trò |
|---|---|
| apps/web/src/pages/HomePage.tsx | Empty state, đo overflow và trạng thái nút cuộn |
| apps/mobile/src/screens/HomeScreen.tsx | Empty state, loading/error và reset slide khi đổi lọc |
| packages/visitor-core/src/uiMessages.ts | Hai key featuredEmpty/featuredEmptyHint đủ 5 ngôn ngữ |
| apps/web/src/styles/index.css | Khối thông báo gọn, responsive, không giữ khung carousel trắng |

## Chạy và kiểm tra

Web nhấn Ctrl+F5. Mobile chạy npm run start --workspace=mobile -- --clear tại gốc monorepo.
Chọn Công trình di tích: có thông báo nổi bật rỗng, không có mũi tên/chấm, danh sách chính vẫn có Kỳ Đài.
Chọn Tất cả hoặc Xóa tất cả: các điểm nổi bật xuất hiện trở lại.
Chọn Cổng thành: một thẻ Ngọ Môn, không có điều khiển thừa. Chuyển từ slide cuối về danh mục ít thẻ: không giữ chấm ngoài giới hạn.

Đã đạt typecheck/lint toàn workspace, build web và Expo export Android. Đã kiểm tra case Công trình di tích trong browser, chưa kiểm tra tương tác trực tiếp trên điện thoại vật lý.

Commit gợi ý: fix(explore): handle empty featured categories on web and mobile
