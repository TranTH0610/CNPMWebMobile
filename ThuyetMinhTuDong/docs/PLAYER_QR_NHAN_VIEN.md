# Giao diện trình nghe và QR do nhân viên cung cấp

## Thiết kế

Web và mobile có cùng thứ tự: ảnh và thông tin bài nghe ở header, nút × ở bên phải; thanh tua bên dưới; lùi/phát/tiến nằm giữa; tốc độ ở hàng riêng.
Web giới hạn chiều rộng 800px để không kéo nút điều khiển ra hai phía quá xa. Màn nhỏ dùng khoảng cách/ảnh/chữ nhỏ hơn.
Native dùng cùng token màu và cấu trúc; giữ nguyên Cover đã sửa kích thước, Slider và controller audio chung.
Nút × vẫn gọi close(): dừng/giải phóng nguồn và hủy hiệu lực bài tải chậm. Không thay đổi cơ chế audio/GPS/lưu tiến độ trong bước thiết kế này.

## QR

Du khách không còn icon QR trên navbar web, không có trang /qr, không có hiển thị/tải/chia sẻ QR trên mobile Settings.
Màn scan nội bộ và nút scan trên hero mobile được gỡ; khách quét QR nhân viên cung cấp bằng camera hệ thống để vào URL gốc/deep link như trước.
Dev server trả HTTP 404 cho /qr. Bản build không đăng ký route QR; cấu hình hosting visitor cũng bỏ rewrite /qr.
Các script tạo QR vẫn giữ nguyên. Nhân viên dùng .qr-output/shared-qr.png hoặc .qr-output/index.html trên máy nội bộ; không đưa folder này vào public/static hoặc deploy cho khách.

```powershell
cd "D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong"
npm run demo:public
```

Tắt máy/tunnel có thể làm link QR tạm hết hoạt động, khi đó nhân viên chạy lại và dùng ảnh mới. Domain cố định cần hosting cố định.
Giới hạn: gỡ thao tác QR/chia sẻ trong FE không ngăn người dùng tự sao chép URL, chụp màn hình hoặc tạo QR từ URL công khai bằng ứng dụng khác.
Nếu phải kiểm soát quyền vào theo vé, cần server phát mã/vé có hạn và kiểm tra quyền trước khi trả dữ liệu. Không dùng biến FE hoặc giấu nút để tuyên bố đã ngăn chia sẻ tuyệt đối.

## File và vai trò

| File | Thay đổi |
|---|---|
| apps/web/src/components/JourneyPlayer.tsx | Header gọn, nút điều khiển giữa, tốc độ dạng chip |
| apps/web/src/styles/player.css | Bố cục responsive, dùng token và bỏ override khoảng trống cũ |
| apps/mobile/src/components/JourneyPlayer.tsx | Cùng cấu trúc header/điều khiển/tốc độ với web |
| apps/web/src/components/Navbar.tsx | Bỏ icon và liên kết QR |
| apps/web/src/navigation/AppRoutes.tsx | Không đăng ký /qr |
| apps/web/vite.config.ts | Trả 404 route QR cũ ở dev/preview |
| apps/web/vercel.json | Bỏ rewrite /qr |
| apps/mobile/src/screens/HomeScreen.tsx | Bỏ nút scan QR trong hero |
| apps/mobile/src/screens/SettingsScreen.tsx | Bỏ thẻ mở/chia sẻ QR |
| apps/mobile/src/navigation/RootNavigator.tsx, types.ts | Bỏ route Scan |
| QrPage.tsx, QrImage.tsx, qr.css | Đã xóa UI phát QR trên web du khách |
| WebAccessCard.tsx, ScanScreen.tsx | Đã xóa UI phát/chia sẻ/scan trên mobile du khách |
| scripts/create-public-qr.cjs, start-public-demo.cjs | Giữ nguyên, chỉ nhân viên vận hành |
| .qr-output/ | Giữ ảnh QR/URL để nhân viên cung cấp tại cổng |

## Chạy thử

Web: Ctrl+F5 trên http://127.0.0.1:5173/places/ky-dai.
Mobile: chạy lại npm run start --workspace=mobile -- --clear rồi mở dự án du khách trong Expo Go.
Không cần reset dữ liệu cục bộ hoặc đổi ảnh/audio.

TypeScript/lint toàn workspace, bộ test, build web visitor/admin và Expo export Android: đạt.
Đã kiểm tra trong browser: ảnh/audio còn tải đúng; không có QR trên navbar; chọn 1.25× hoạt động; phát/tạm dừng được; thẻ player cân giữa.
HTTP /qr local trả 404. Chưa kiểm tra trực tiếp UI trên điện thoại vật lý sau thiết kế lại.

Commit gợi ý: feat(visitor): refine narration player and reserve QR distribution for staff
