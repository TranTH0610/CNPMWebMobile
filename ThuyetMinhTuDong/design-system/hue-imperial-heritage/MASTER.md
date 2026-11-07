# Hue Imperial Heritage — Design system

Cập nhật: 05/11/2026. Áp dụng cho web du khách, web quản trị, Expo du khách và Expo quản trị.

## Căn cứ và quyết định

Đã đọc skill UI/UX Pro Max tại `C:/Users/gauba/.codex/skills/.agents/skills/ui-ux-pro-max/SKILL.md`.
Tìm design system với `heritage tourism elegant accessible`, sau đó thử lại `museum heritage minimal`.
Dùng hướng Minimalism & Swiss: phân cấp rõ, ít trang trí, khoảng trắng và thao tác rõ ràng.
Bảng màu đen trắng/Inter do công cụ gợi ý được thay bằng bảng màu cung đình theo yêu cầu người dùng.
Tra stack React cho focus/keyboard/responsive. Tra stack React Native hai lần không có kết quả;
phần native áp dụng Quick Reference của skill cùng cấu trúc Expo/navigation/safe-area thực tế.
Không tải font ngoài hoặc thêm thư viện mới.

## Token nguồn duy nhất

`packages/ui-tokens/MauVaKichThuoc.ts`: màu, khoảng cách, bo góc, thang chữ, thời gian chuyển trạng thái và bóng.
Web đưa màu vào CSS variables qua hai entry; native dùng qua `src/GiaoDienChung.ts` và `ThanhPhanQuanTri.tsx`.
`packages/ui-tokens/HienThiDinhVi.ts` chỉ ánh xạ trạng thái GPS thành nhãn, không quyết định định vị/phát tiếng.

| Vai trò | Token | Giá trị | Sử dụng |
|---|---|---|---|
| Hành động chính | primary | #8B2635 | CTA, tab đang chọn, focus |
| Nhấn/hover | primaryPressed | #6E1B29 | Phản hồi tương tác |
| Điểm nhấn trầm | secondary | #234B4B | Menu quản trị, trạng thái GPS |
| Trang trí cung đình | gold | #C6A667 | Viền logo, eyebrow trên nền tối |
| Chữ vàng trên nền sáng | goldInk | #806029 | Nhãn nhỏ cần tương phản |
| Nền trang | page | #F8F5EE | Canvas ivory |
| Bề mặt | background | #FFFDFA | Card, input, navbar |
| Chữ chính/phụ | text / muted | #242424 / #68635C | Nội dung, chú giải |
| Player | playerBackground | #183C3C | Nền bộ nghe |
| Chữ/player track | playerMuted / playerAccent | #E2E8DE / #E9CD96 | Thời gian, thanh tiến trình |
| Lỗi/thành công | danger / success | #A82B25 / #285C42 | Luôn kèm chữ/icon |

Không dùng vàng nhạt cho chữ nhỏ trên nền sáng. Không dùng màu làm tín hiệu trạng thái duy nhất.

## Typography

- Web: system UI cho cả tiêu đề và nội dung (Segoe UI/Noto Sans và font hệ thống CJK). Không yêu cầu tải Google Fonts.
- Native: font hệ thống cho cả tiêu đề và nội dung; hệ điều hành chọn glyph Việt/Nhật/Trung.
- Nội dung native 16, nhãn 14, chú thích ít nhất 12; tiêu đề 22–38, line-height nới theo nội dung.
- Nội dung đọc web 16–17, line-height 1.8–2; không viết hoa toàn bài hoặc giới hạn chiều cao bài đọc.
- Chuỗi dài được xuống dòng; tên bài có thể rút gọn trong mini-player, bản đầy đủ nằm ở trang chi tiết.
- Giữ đủ vi/en/cn/pt/ja. Chỉ bổ sung nhãn UI, không thay nội dung lịch sử hay dịch tự động dữ liệu.

## Khoảng cách, bề mặt và tương tác

- Spacing: 4 / 8 / 12 / 16 / 24 / 32 / 48.
- Radius: 10 / 18 / 26 / pill; player và hero dùng góc lớn, input và nút dùng góc nhỏ.
- Bóng nhẹ, ưu tiên viền ấm; không dùng glass blur làm giảm độ đọc của bài thuyết minh.
- Target chính 44–50 trở lên, icon có nhãn truy cập; nút audio thu gọn 44.
- Web focus-visible rõ, skip-link, button/link đúng vai trò, loading/status có live region phù hợp.
- Transition nhẹ 140–220 ms; web tôn trọng prefers-reduced-motion. Native không thêm animation mới.
- Không thêm dark mode vì dự án chưa có luồng chọn theme; không tăng phạm vi nghiệp vụ.

## Component và bố cục

- Logo cổng cung đình SVG, không dùng emoji khác nhau giữa máy.
- Card di tích: ảnh thật từ nguồn đang có, tên, category, summary/address; giữ placeholder lỗi ảnh cũ.
- Web: hero ảnh + CTA thật, giới thiệu ngắn, carousel, catalog/filter/pagination hiện có.
- Chi tiết: khối ảnh/thông tin và vùng đọc riêng; màn hẹp xếp một cột.
- Sửa lỗi font 05/11/2026: bỏ ép Georgia/serif và tracking âm để dấu không bị lệch khi fallback glyph.
- Admin: menu teal, canvas ivory, form theo nhóm, trạng thái duyệt và nút chính đỏ cung đình.
- Native: giữ FlatList, stack/tab và safe-area; không dựng danh sách chính bằng ScrollView + map.
- Mini-player mặc định gọn; mở rộng để tua ±10 giây và đổi tốc độ. Mọi nút gọi engine sẵn có.
- Player native nằm trong luồng flex sau navigator, không dùng absolute đè nội dung; web sticky có chỗ trong layout.
- GPS card: tắt / chờ fix / đã có fix / gần di tích / yếu hoặc lỗi; hiển thị thêm bài đang phát nếu có.
- Không đổi bán kính, distanceMeters, thời gian watch, điều kiện tự phát hoặc contract nguồn dữ liệu.

## Tương phản đã tính

Công thức luminance sRGB, kiểm tra cặp token chữ thực tế; không thay thế kiểm toán WCAG toàn sản phẩm.

| Cặp màu | Tỷ lệ |
|---|---:|
| text / page | 14.26:1 |
| muted / page | 5.47:1 |
| white / primary | 8.65:1 |
| playerMuted / playerBackground | 9.62:1 |
| goldInk / background | 5.71:1 |

## Quy tắc bảo trì

Đổi màu/thang nền tại token trước; chỉ đặt ngoại lệ layout trong CSS/StyleSheet nền tảng.
Không đưa GPS, SQL, quyền truy cập hoặc logic phát audio vào stylesheet hay component trang trí.
Component web/native riêng, chia sẻ token và nhãn; không ép một component chạy cả DOM và native.
