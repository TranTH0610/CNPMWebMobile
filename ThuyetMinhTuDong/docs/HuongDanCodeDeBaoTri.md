# Clean code và bảo trì

Đợt refactor này giữ nguyên quy tắc nghiệp vụ, URL API, dữ liệu di tích và cấu trúc 11 bảng SQL. Các file SQL không được sửa.

## Cấu trúc chính

```text
packages/admin-core/src/
├── domain/                      Kiểu dữ liệu, hợp đồng và kiểm tra nghiệp vụ
├── services/
│   ├── XuLyNghiepVuQuanTri.ts           Quy trình tạo/sửa, gửi duyệt, kiểm duyệt, công bố
│   └── GoiApiQuanTri.ts            Gọi API; không chứa JSX
└── react/
    └── useBienTapDiTich.ts         Trạng thái form, dịch, audio và reset form sau gửi duyệt

services/
├── catalog/
│   ├── MayChuApi.cjs               HTTP, giao dịch và điều phối lệnh
│   ├── KiemTraLenhQuanTri.cjs   Kiểm tra hình dạng và danh sách lệnh được phép
│   ├── TuDongDich.cjs          Adapter dịch
│   ├── ThuatNguDich.cjs    Giữ đúng tên riêng/năm/thuật ngữ
│   └── TaoAmThanhThuyetMinh.cjs            Tạo bản thu; không phục vụ endpoint MP3 cũ
└── database/
    ├── AnhXaMuoiMotBang.cjs            Điểm import ổn định cho repository/migration
    └── catalog/
        ├── TruyVanVaCapMa.cjs            Truy vấn có tham số và cấp mã từ sequence
        ├── DocDiTichTuSql.cjs             Ghép các hàng SQL thành dữ liệu ứng dụng
        ├── GhiDiTichVaoSql.cjs            Chuẩn bị hàng cần lưu và lịch sử kiểm duyệt
        └── ChuanBiThayDoiDuLieu.cjs          So sánh/ghi thay đổi theo thứ tự khóa ngoại
```

## Phần đã dọn

- Đổi `mockService.ts` / `createMockAdminService` thành `XuLyNghiepVuQuanTri.ts` / `createAdminService`. Kho lưu do StoragePort quyết định; tên mới không gây hiểu nhầm SQL là dữ liệu giả.
- Bỏ chú thích tự sinh mô tả lại cú pháp; giữ mục đích file, lý do nghiệp vụ và trường hợp biên.
- Dùng Prettier phiên bản cố định, một cấu hình chung cho nhóm.
- Xóa các component không còn import: DemoNotice mobile, ContentSources mobile/web.
- Bỏ sendAudio filesystem; media SQL vẫn được phục vụ qua XuLyTepTaiNguyen.cjs, có Range.
- Xóa registry narrationAssets.ts không được import; công cụ sinh bản thu không tạo lại registry đó. Giữ MP3/ảnh nguồn vì còn dùng cho nạp SQL và kiểm thử.
- Giữ entry web main.tsx/main-admin.tsx, migration, dữ liệu seed, tài nguyên và test. Không xóa chỉ vì chúng không có import thông thường.

## Quy tắc khi sửa tiếp

1. Đặt tên theo nhiệm vụ, không theo công nghệ đã bỏ.
2. Mỗi màn gọi hook/service; không đưa truy vấn SQL vào component.
3. Chú thích giải thích lý do, quy tắc và trường hợp biên; không lặp lại từng dấu ngoặc/lệnh import.
4. Chạy `npm run format`, `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test` trước khi chia sẻ.
5. Không sửa migration/ràng buộc để chữa lỗi giao diện.

Các tài liệu chép code đầy đủ của phiên bản RAM/cũ chỉ dùng để tham khảo lịch sử; nguồn hiện hành là các file trong cây trên.
