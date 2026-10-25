# Thanh nghe thử Admin mobile

File chính: `apps/mobile/src/components/admin/AudioPreview.tsx` (TẠO MỚI).
File này được `AdminUI.tsx` xuất lại; màn biên tập và kiểm duyệt vẫn dùng import cũ.

| Folder/file từ gốc dự án | Chức năng |
|---|---|
| apps/mobile/src/components/admin/AudioPreview.tsx | Thanh play/pause, thời gian, tua MP3, loa/âm lượng, menu tốc độ. |
| apps/mobile/src/components/admin/AdminUI.tsx | Xuất lại AudioPreview để hai màn Admin dùng cùng player. |
| packages/visitor-core/src/audio/preview.ts | Giữ nguồn khi pause, nạp metadata không tự phát, tua thật, tốc độ và âm lượng. |
| apps/mobile/src/services/journeyAdapters.ts | Nối điều khiển vào expo-audio; volume thay âm lượng player. |
| packages/admin-core/src/i18n/messages.ts | Nhãn nút mới bằng VI/EN/CN/PT/JA. |
| packages/visitor-core/tests/audio.test.cjs | Kiểm tra giữ tiến độ, tua khi pause, âm lượng/tốc độ và cleanup metadata. |

Gốc dự án: `D:/3.HTML/Đồ án CNPM/ThuyetMinhTuDong`.

Mở màn → nạp metadata → hiện tổng thời gian, chưa phát. Bấm play → dùng nguồn hiện có.
Pause giữ nguồn và giây nghe; play tiếp tục từ giây đó. Kéo thanh tua → thả để tua MP3;
đang pause vẫn giữ pause. Nút loa mở thanh âm lượng; dấu ba chấm mở các tốc độ
0.75×, 1×, 1.25×, 1.5×, 2×. Rời màn đóng nguồn, nguồn tải muộn bị bỏ.

Chạy lại bản Admin bằng `npm run start:admin --workspace=mobile -- --clear` từ gốc dự án
trong terminal dùng Node 24; tải lại Expo Go để nhận module mới. Không phải HTML audio
trong native: các điều khiển tương đương được dựng bằng component React Native.

Cách kiểm tra: mở biên tập và kiểm duyệt; tổng thời gian phải hiện trước khi nghe;
pause ở giây 12, tua đến 18, tiếp tục từ 18; loa thay âm lượng, menu thay tốc độ;
bật bài khác không chồng âm thanh.
