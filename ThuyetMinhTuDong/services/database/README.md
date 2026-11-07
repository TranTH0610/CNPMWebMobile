# Đọc thư mục database theo chức năng

Thư mục giữ nguyên vị trí. Các file đã được đặt tên tiếng Việt không dấu; **database đang chạy vẫn giữ nguyên 11 bảng, tên cột và dữ liệu**. Đổi tên file SQL không có nghĩa là đã chạy file đó lên SQL Server.

## Bắt đầu từ đâu?

| Bạn muốn tìm gì? | Mở file nào? | Tìm hàm/khối nào? |
|---|---|---|
| Cấu hình máy chủ và database | `CauHinhSqlServer.cjs` | `databaseName`, `driverConfig` |
| Pool kết nối SQL | `KetNoiSqlServer.cjs` | `connect`, `close` |
| Bộ thao tác API gọi để dùng SQL | `KhoDuLieuSql.cjs` | `createSqlRepository` |
| Ghi nhận và chống trùng lượt QR | `KhoDuLieuSql.cjs` | `gateEntry` |
| Tổng lượt QR hôm nay | `KhoDuLieuSql.cjs` | `gateStatistics` |
| Gia hạn phiên đang hoạt động | `KhoDuLieuSql.cjs` | `heartbeat` |
| Đếm phiên web/mobile còn hoạt động | `KhoDuLieuSql.cjs` | `snapshot` |
| Kết thúc/dọn phiên | `KhoDuLieuSql.cjs` | `end`, `prune` |
| Đọc các hàng SQL thành hồ sơ di tích | `catalog/DocDiTichTuSql.cjs` | `readDocument` |
| Lưu hồ sơ di tích xuống SQL | `catalog/GhiDiTichVaoSql.cjs` | `writeDocument` |
| So sánh hàng cũ/mới rồi thêm/sửa/xóa | `catalog/ChuanBiThayDoiDuLieu.cjs` | `putRow`, `deleteRow`, `applyChanges` |
| Truy vấn có tham số và cấp mã | `catalog/TruyVanVaCapMa.cjs` | `rows`, `nextCode` |
| Lưu byte ảnh/audio, đọc để nghe/xem/tua | `LuuVaDocTepSql.cjs` | `resolveMedia`, `metadata`, `bytes`, `allowed` |
| Định nghĩa 11 bảng và ràng buộc | `CauTrucMuoiMotBang.sql` | `CREATE TABLE`, `CREATE TRIGGER` |
| Xem dữ liệu bằng SSMS | `XemDuLieuVaThongKe.sql` | Các câu `SELECT` theo bảng |

## Sơ đồ luồng dữ liệu

```text
Web / Mobile
    ↓ gọi HTTP
services/catalog/MayChuApi.cjs hoặc services/presence/MayChuApi.cjs
    ↓ gọi các thao tác repository
KhoDuLieuSql.cjs
    ├── QR / phiên: truy vấn bảng LuotTruyCapQR / PhienHoatDong
    └── Di tích: AnhXaMuoiMotBang.cjs
            ├── catalog/DocDiTichTuSql.cjs
            └── catalog/GhiDiTichVaoSql.cjs
                    ├── catalog/ChuanBiThayDoiDuLieu.cjs
                    └── LuuVaDocTepSql.cjs
    ↓ cùng dùng pool
KetNoiSqlServer.cjs ← CauHinhSqlServer.cjs
    ↓
SQL Server
```

## Cây thư mục có chú thích

```text
database/
├── CauHinhSqlServer.cjs             Đọc cấu hình SQL ở phía API
├── KetNoiSqlServer.cjs              Tạo/dùng lại/đóng pool kết nối
├── KhoDuLieuSql.cjs                 Thao tác di tích, QR và phiên hoạt động
├── AnhXaMuoiMotBang.cjs             Điểm xuất chung của lớp đọc/ghi di tích
├── ChuyenDoiMaDuLieu.cjs            Chuyển mã SQL/API và mã danh mục/khu vực
├── LuuVaDocTepSql.cjs               Lưu/đọc byte ảnh và audio trong SQL
├── CauTrucMuoiMotBang.sql           11 bảng, sequence, khóa và ràng buộc
├── XemDuLieuVaThongKe.sql           SELECT xem dữ liệu và thống kê
├── ChayNangCapDatabase.cjs          Điểm chạy lệnh db:init
├── ChuyenSangMuoiMotBang.cjs        Migration và đối chiếu dữ liệu cũ/mới
├── DocDuLieuPhienBanCu.cjs          Đọc cấu trúc cũ để chuyển đổi
├── NhapDuLieuKhoiTao.cjs            Công cụ nhập dữ liệu ban đầu
├── DauMoiTuongThichDuLieu.cjs       Lớp xuất tương thích còn được mã nguồn dùng
├── CanhBaoNangCapTepCu.cjs          Chặn chạy nhầm migration tệp cũ
├── CauTrucTepPhienBanCu.sql         Thông báo hướng dẫn thay cho schema tệp cũ
├── HoTroKiemThuDatabase.cjs         Tạo/dọn database kiểm thử riêng
├── KiemThuRangBuocDatabase.test.cjs  Kiểm thử dữ liệu và các ràng buộc
├── KiemThuTepTaiNguyen.test.cjs     Kiểm thử byte ảnh/audio và quyền tải
├── catalog/
│   ├── DocDiTichTuSql.cjs           Đọc hồ sơ di tích
│   ├── GhiDiTichVaoSql.cjs          Ghi hồ sơ di tích
│   ├── ChuanBiThayDoiDuLieu.cjs     Áp dụng khác biệt giữa hàng cũ/mới
│   └── TruyVanVaCapMa.cjs          Truy vấn và lấy số sequence
└── README.md                       Hướng dẫn bạn đang đọc
```

Các file có chữ “cũ” vẫn giữ để migration hoặc chặn chạy nhầm; chúng không phải một database thứ hai. Không chạy `db:init` chỉ vì đổi tên file. File `.env.local` vẫn ở `services/`, không chuyển vào giao diện và không đưa mật khẩu lên GitHub.

## Cách tra bằng mã chức năng

- `Ctrl+Shift+F` → `[DATABASE]`: code SQL/kết nối/lưu trữ.
- `[TRUY-CAP-QR]`: ghi nhận QR.
- `[PHIEN-HOAT-DONG]`: heartbeat và kết thúc phiên.
- `[THONG-KE]`: tính số liệu hiển thị trên quản trị.

Phần chi tiết 11 bảng và ràng buộc hiện có được giữ ở dưới.

---

# SQL Server: cấu trúc cuối 11 bảng nghiệp vụ

Database ứng dụng: `HueGuideDemo`. Dữ liệu kiểm thử nằm trong database riêng
`HueGuideTest11_<mã>`, không nằm trong cùng các bảng nghiệp vụ.

## Các bảng và thuộc tính

| Bảng | Thuộc tính |
| --- | --- |
| NgonNgu | MaNgonNgu (PK), TenNgonNgu, TenBanDia, MaGiongDoc, DangSuDung, ThuTuHienThi |
| DiTich | MaDiTich (PK), ThuTuHienThi, PhienBanChinhSua, TrangThaiXuLy, GhiChuKiemDuyet, PhienBanDaDuyet, ThoiDiemTao, ThoiDiemCapNhat |
| BanDiTich | MaBanDiTich (PK), MaDiTich (FK), LoaiBan, TenChuan, MaKhuVuc, MaDanhMuc, NienDai, LaDiemNoiBat, ViDo, KinhDo, DaXacNhanViTri, NguonToaDo, ThoiDiemDoiChieuViTri |
| NoiDungDiTich | MaNoiDung (PK), MaBanDiTich (FK), MaNgonNgu (FK), PhienBanNoiDung, TenDiTich, TomTat, BaiThuyetMinh, DiaChi, TrangThaiNoiDung, ThoiDiemDuyet, ThoiDiemCongBo, HinhThucBienSoan |
| HinhAnhDiTich | MaHinhAnh (PK), MaBanDiTich (FK), MaTep (FK), ThuTuHienThi, MoTaAnh |
| BanThuThuyetMinh | MaBanThu (PK), MaNoiDung (FK, UNIQUE), PhienBanNoiDung, PhienBanBanThu, TrangThaiBanThu, MaTep (FK), ThoiDiemDuyet, ThoiDiemCongBo |
| LichSuKiemDuyet | MaLichSu (PK), MaDiTichGoc, MaDiTichLienKet (FK, có thể NULL), HanhDong, PhienBanDiTich, GhiChu, ThoiDiemThaoTac |
| NguonThamKhao | MaNguon (PK), MaNoiDung (FK), ThuTuHienThi, TenTaiLieu, DuongDan, NgayTruyCap, GiayPhep, DuongDanGiayPhep |
| LuotTruyCapQR | MaGhiNhanQR (PK), NgayTruyCap, MaLuotTruyCap, NenTang, ThoiDiemTruyCap, LoaiGhiNhan, SoLuot |
| PhienHoatDong | MaPhien (PK), NenTang, ThoiDiemHoatDongCuoi |
| TepTaiNguyen | MaTep (PK), MaBamTep (UNIQUE), LoaiTep (tính tự động), DinhDangTep, DuLieuTep, DungLuongByte (tính tự động), ThoiDiemTao |

Không có bảng phạm vi, danh mục hoặc ánh xạ tệp. Danh mục/khu vực dùng mã cố định
và CHECK. Nguồn tham khảo là các hàng SQL thật, không nhét danh sách vào JSON.
Nếu SSMS có `sysdiagrams`, đó là bảng hệ thống hỗ trợ sơ đồ, không phải bảng nghiệp vụ thứ 12.

## Mã và quan hệ

- SQL Server cấp mã bằng SEQUENCE: DT001, BDT001, ND001, HA001, BT001,
  LS001, QR001, TEP001, NTK001. Mã vượt 999 tiếp tục 1000, không cắt mất chữ số.
- Không lấy COUNT+1, không đánh lại mã sau khi xóa. Khoảng trống mã do rollback là bình thường.
- Ngôn ngữ giữ vi/en/cn/pt/ja. Phiên và mã chống trùng QR do ứng dụng tạo.
- DM001=palace, DM002=gate, DM003=temple, DM004=tomb, DM005=museum, DM006=monument.
- KV001=fortifications, KV002=ceremonial.
- SQL dùng DT001..DT008 cho 8 di tích ban đầu. Adapter giữ URL/API id cũ
  ky-dai, ngo-mon... để không phá các liên kết và tuyến đã phát hành.
  Di tích mới đọc ra mã DT...; không thêm cột/bảng lưu alias cho di tích.
- Ảnh/audio trong API tiếp tục dùng mã băm media:<SHA256>; trong SQL liên kết
  bằng MaTep=TEP... và MaBamTep UNIQUE. Không phải bản sao tệp.

```text
DiTich -> BanDiTich -> NoiDungDiTich -> BanThuThuyetMinh -> TepTaiNguyen
              |              |
              |              +-> NguonThamKhao
              |              +-> NgonNgu
              +-> HinhAnhDiTich -> TepTaiNguyen
DiTich <- LichSuKiemDuyet.MaDiTichLienKet (có thể NULL sau khi xóa)
LuotTruyCapQR và PhienHoatDong là thống kê độc lập.
```

## Ràng buộc và giao dịch

- PK/UNIQUE chống mã trùng, trùng bản nháp/công bố, trùng ngôn ngữ trong một bản,
  trùng thứ tự ảnh/nguồn và trùng ngày+mã lượt QR.
- FK chặn hàng con không có cha. Audio dùng FK ghép (MaNoiDung,PhienBanNoiDung)
  để không gắn bản thu vào phiên bản bài viết sai.
- CHECK chặn tên trắng, trạng thái sai, phiên bản âm, thiếu một chiều tọa độ,
  tọa độ vượt giới hạn, công bố thiếu ngày duyệt/công bố, mã sai dạng.
- Trigger chặn ảnh dùng tệp âm thanh và ngược lại; hồ sơ công bố phải có nội dung
  công bố và phải được duyệt đúng phiên bản.
- LoaiTep suy từ DinhDangTep; không nhập hoặc sửa riêng. DungLuongByte cũng tự tính.
  SHA-256 phải khớp byte, chữ ký tệp phải khớp định dạng; giới hạn tối đa 15 MiB.
  Tệp đã lưu bất biến: nội dung mới tạo tệp mới, không đổi byte dưới cùng một mã.
- API ghi trong transaction có sp_getapplock, kiểm tra revision. Nếu có lỗi thì
  rollback cả hồ sơ, bản nháp/công bố, nội dung, ảnh và âm thanh.
- Sửa nội dung đưa audio đi kèm về nháp; không giữ trạng thái công bố cho bài chưa duyệt.

## Xóa hẳn theo cách 2 đã chốt

API ghi nhật ký xóa, chuyển MaDiTichLienKet thành NULL, giữ MaDiTichGoc,
xóa nguồn/bản thu/liên kết ảnh/nội dung/bản di tích rồi xóa hồ sơ trong cùng giao dịch.
Không xóa tệp dùng chung. File không còn tham chiếu vẫn được giữ trong kho;
không tự thêm chức năng dọn file hoặc khôi phục. SQL trực tiếp xóa cha còn con bị FK chặn.
Không thay xóa hẳn bằng lưu trữ. Trạng thái archived cũ vẫn được hỗ trợ như trước.

## Phụ thuộc hàm và giới hạn tuyên bố chuẩn hóa

Các phụ thuộc chính: khóa chính -> các thuộc tính còn lại của hàng.
Các khóa ứng viên bổ sung:

| Bảng | Khóa ứng viên bổ sung |
| --- | --- |
| NgonNgu | MaGiongDoc; ThuTuHienThi |
| DiTich | ThuTuHienThi |
| BanDiTich | (MaDiTich,LoaiBan) |
| NoiDungDiTich | (MaBanDiTich,MaNgonNgu) |
| HinhAnhDiTich | (MaBanDiTich,ThuTuHienThi) |
| BanThuThuyetMinh | MaNoiDung |
| NguonThamKhao | (MaNoiDung,ThuTuHienThi) |
| LuotTruyCapQR | (NgayTruyCap,MaLuotTruyCap) |
| TepTaiNguyen | MaBamTep |

UNIQUE(MaNoiDung,PhienBanNoiDung) là siêu khóa phục vụ FK, không phải khóa ứng viên
tối thiểu vì MaNoiDung đã là khóa. Trong BanThuThuyetMinh, MaNoiDung cũng UNIQUE:
phụ thuộc MaNoiDung -> PhienBanNoiDung có vế trái là một khóa.

Không tuyên bố toàn bộ thiết kế đạt BCNF vô điều kiện. Cách 2 được chọn giữ
MaDiTichGoc và MaDiTichLienKet để lưu dấu sau khi xóa: hai giá trị lặp nhau khi
di tích tồn tại. NgayTruyCap của lượt mới cũng là dữ liệu ngày được tách phục vụ
thống kê từ thời điểm mở; phải xét phụ thuộc hàm theo quy tắc ngày của hệ thống.
Các giá trị tính toán LoaiTep/DungLuongByte là biểu diễn suy ra, không nhập độc lập.
Không tự bỏ cột đã chốt để ép một kết luận BCNF. Muốn thay những ngoại lệ trên cần
người dùng chốt lại cấu trúc; số bảng hay số CHECK không phải bằng chứng BCNF.

## Chuyển đổi và kiểm tra

Sao lưu SQL COPY_ONLY + CHECKSUM; restore bản sao vào database kiểm tra, chạy
migrate11 và đối chiếu toàn bộ document, số hàng nguồn, SHA/byte từng tệp,
tổng QR, phiên. Chỉ khi đạt mới chuyển main trong thời gian API dừng.
Migration lỗi rollback; bảng cũ chỉ bị xóa sau khi đối chiếu thành công.
archive.CatalogDocuments và alias cũ còn trong .bak trước chuyển đổi, không còn
được giữ như bảng hoạt động. Không tự bịa chi tiết 9 lượt tổng cũ.
ThoiDiemTao của hồ sơ cũ là lúc nhập vào schema mới vì schema cũ không lưu ngày
tạo gốc; ThoiDiemCapNhat cũ và thời điểm tạo tệp thật được giữ nguyên.

```powershell
npm run db:init       # Chạy lại không reset hoặc tự chuyển schema cũ đang chứa dữ liệu
npm run db:test       # Database riêng cho mỗi test
npm run test:media
npm run lint
npm run typecheck
```

Mở XemDuLieuVaThongKe.sql trong SSMS để xem dữ liệu, FK, CHECK và các mã mới.
11 bảng không cung cấp xác thực người dùng. Việc bảo vệ API quản trị vẫn là
phần độc lập, không tự thêm bảng tài khoản hoặc cơ chế đăng nhập trong thay đổi này.
