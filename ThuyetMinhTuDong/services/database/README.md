# Quản lý dữ liệu bằng các bảng SQL Server

Database hiện tại: `HueGuideDemo`; server `localhost`, Windows Authentication.
Web/mobile → API hiện có → các bảng SQL. Không đưa mật khẩu SQL vào ứng dụng.

## Chạy

```powershell
cd "D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong"
npm install
npm run db:init
npm run dev
# Terminal riêng cho admin web:
npm run dev:admin
```

`db:init` tạo thứ còn thiếu và chuyển schema v1 sang v2. Chạy lại không reset dữ liệu.
Migration cần thực hiện trong thời gian không có API cũ ghi dữ liệu. Bản đang chạy đã được chuyển và khởi động lại.
Máy khác cấu hình `.env.sqlserver` theo `.env.sqlserver.example`, rồi chạy `db:init` trước khi mở API.

## Xem trong SSMS

Chọn localhost / Windows Authentication → Databases → HueGuideDemo → Refresh.
Mở file `show-data.sql`, chạy trong New Query. Các bảng nghiệp vụ ở schema `dbo`.

| Bảng | Nội dung và ràng buộc chính |
| --- | --- |
| `Categories` | Mã/tên danh mục; mã là khóa chính. UI vẫn dịch tên bằng i18n. |
| `Languages` | Mã/tên 5 ngôn ngữ; `cn` giữ mã cũ để tương thích app. |
| `Places` | Mã di tích, revision, workflow, ghi chú duyệt, niên đại và thứ tự. FK về scope; trạng thái và revision có CHECK. |
| `PlaceVersions` | Hai bản `draft`/`published` của thông tin chung: tên, danh mục, vị trí, ảnh… FK về di tích và danh mục; tọa độ có CHECK. |
| `PlaceContents` | Bài theo di tích/bản/ngôn ngữ/phiên bản; nội dung dài dùng NVARCHAR(MAX). FK về bản di tích và ngôn ngữ, UNIQUE chặn trùng bản hiện hành của một ngôn ngữ. |
| `PlaceImages` | Mỗi ảnh một hàng, có thứ tự và FK về đúng bản di tích. |
| `AudioTracks` | Âm thanh gắn đúng bản nội dung/ngôn ngữ/version; FK chặn audio không thuộc bài nào. MediaId trỏ tới byte MP3 thật trong MediaFiles; cùng file có thể được bản nháp và bản công bố dùng chung. |
| `ReviewHistory` | Nhật ký nghiệp vụ hiện có, tối đa 100 mục như API cũ. Giữ mã của di tích đã xóa; FK tùy chọn chỉ trỏ di tích còn tồn tại. |
| `ContentSources` | Nguồn tư liệu theo từng bản nội dung; giữ dữ liệu đối chiếu, không bật lại phần hiển thị nguồn đã bỏ khỏi UI. |
| `CatalogScopes` | Bảng kỹ thuật tách `main` và `test_...`; revision danh mục và đánh dấu đã lưu kể cả khi danh mục rỗng. |
| `GateEntries` | Từng lượt QR mới; khóa Scope + VisitDay + VisitId chống trùng. |
| `GateCarry` | Tổng lượt chuyển từ RAM cũ. Lượt trong ngày = Carry + số Entries cùng ngày; không tạo giả chi tiết của lượt cũ. |
| `ActiveSessions` | Phiên và LastSeen; thống kê lọc TTL 90 giây, tự dọn phiên hết hạn. Không phải bảng lịch sử người dùng/vé. |

**Có 15 bảng hoạt động trong dbo**, gồm 13 bảng quan hệ và 2 bảng tài nguyên mới. `archive.CatalogDocuments` là bản JSON v1 được giữ để đối chiếu, không phải nguồn mà API mới đọc/ghi. Khi nâng từ v1 sẽ có thêm bảng lưu trữ này; cài mới v2 không cần bảng JSON.

SSMS trên máy hiện còn có `dbo.sysdiagrams`, là bảng hỗ trợ Database Diagrams do SSMS quản lý. Bảng này không thuộc 15 bảng ứng dụng và được giữ nguyên.

Hai view `vw_Places` và `vw_PlaceContent` đọc trực tiếp bảng quan hệ, không còn tách JSON. View nội dung có cả hai loại bản; lọc `SnapshotKind=N'draft'` nếu chỉ muốn xem bản đang quản trị.

## Quan hệ

```text
CatalogScopes ── Places ── PlaceVersions ── PlaceContents ── AudioTracks
                             │                  ├── ContentSources
Categories ──────────────────┤                  └── Languages (mỗi bài thuộc một ngôn ngữ)
                             └── PlaceImages
Places / CatalogScopes ── ReviewHistory

GateEntries + GateCarry → tổng lượt QR từng ngày
ActiveSessions → số phiên còn heartbeat trong 90 giây
```

`Scope=main` là vùng dữ liệu ứng dụng. `PlaceVersions.RecordScope` là phạm vi di tích gốc (ví dụ `hue-citadel`), không phải scope kiểm thử.

## Bản nháp và bản công bố

Ví dụ một Ngọ Môn có một hàng Places và hai hàng PlaceVersions:

- `draft`: thông tin admin đang sửa; FK ảnh/nội dung/âm thanh đều trỏ bản này.
- `published`: bản khách đang xem. Sửa nháp không làm đổi bản này.

Mỗi bản có thể có 5 bài ngôn ngữ. Vì vậy 8 di tích đủ 5 ngôn ngữ và đủ hai bản thường có 80 hàng PlaceContents; đây không phải 80 di tích.
`Version` là phiên bản nội dung hiện hành của từng bản; thiết kế này **không lưu mọi lần sửa trước đó**. Giữ hành vi API hiện có, chưa thêm tính năng khôi phục phiên bản tùy ý.
Nhật ký cũ chưa lưu danh tính người duyệt/note cho từng sự kiện, nên migration không bịa thêm thông tin này. Ghi chú hiện tại vẫn ở Places.ReviewNote.

## Ghi và đọc

`catalog-relational.cjs` ghép dữ liệu quan hệ thành AdminDocument tạm cho nghiệp vụ hiện có. Khi ghi, nó phân tách thành hàng/cột trong cùng transaction; không lưu tài liệu JSON mới.
JSON dùng trong tham số OPENJSON chỉ là gói truyền INSERT hàng loạt, không phải cột dữ liệu chính.
Map/Set trong codec chỉ ghép kết quả của một request; nguồn bền vững vẫn là SQL Server.
Với dữ liệu demo hiện tại, thao tác ghi thay các hàng nội dung của scope trong một transaction. Đây chưa phải mô hình ghi delta từng bảng cho hệ thống quy mô lớn.
FK/CHECK bảo vệ dữ liệu cơ bản; các quy tắc gửi duyệt/công bố, URL và giới hạn tọa độ riêng khu Huế vẫn được kiểm tra thêm trong API.

Khi sử dụng bình thường nên thêm/sửa/công bố trên UI admin. Sửa trực tiếp trong SSMS bỏ qua workflow/revision của API; các view chủ yếu để xem và kiểm thử.

## Sao lưu và migration

Trước lần chuyển đã tạo bản `.bak` riêng bằng SQL Server và giữ bản source v1 ngoài dự án.
Migration đọc từng document v1, ghi bảng quan hệ, ghép ngược và so sánh đầy đủ. Chỉ khi khớp mới chuyển bảng cũ sang schema `archive`, trong cùng transaction.
Nếu đối chiếu lỗi thì rollback; không tự thay bằng dữ liệu mẫu.
Các bảng QR/phiên không bị reset khi chuyển cấu trúc nội dung.

## File phụ trách

| File | Chức năng |
| --- | --- |
| `config.cjs` | Cấu hình SQL phía server; Windows/SQL Authentication. |
| `connection.cjs` | Pool kết nối, không lưu kho nghiệp vụ. |
| `schema.sql` | Tạo các bảng quan hệ, PK/FK/UNIQUE/CHECK, index và view; media-schema.sql bổ sung file nhị phân. |
| `migrate.cjs` | Migration v1 → v2 có đối chiếu và lưu trữ bảng cũ. |
| `catalog-relational.cjs` | Phân tách/ghép nội dung giữa hợp đồng API và bảng quan hệ. |
| `repository.cjs` | Transaction, khóa và các truy vấn catalog/QR/phiên. |
| `import-demo.cjs` | Nhập bản JSON demo lần đầu nếu scope còn trống; không ghi đè scope đang có. |
| `show-data.sql` | Câu truy vấn đọc dữ liệu và quan hệ trong SSMS. |
| `database.test.cjs` | Test SQL thật về quan hệ, draft/published, rollback, nội dung dài và persistence. |
| `test-support.cjs` | Scope test riêng và cleanup theo thứ tự FK; không xóa main. |

```powershell
npm run db:test
npm test
npm run typecheck
npm run lint
```

Không fallback sang RAM khi SQL lỗi. Nội dung/QR tồn tại qua restart; phiên chỉ hoạt động khi còn trong TTL. SQL Server cần chạy để API hoạt động.

## Ảnh và âm thanh được lưu trực tiếp trong SQL

| Bảng mới | Chức năng |
| --- | --- |
| MediaFiles | Data là VARBINARY(MAX) chứa file thật; Id SHA-256 chống lưu trùng; Kind, MimeType, ByteLength và SourceScope giúp xem loại/kích thước/nguồn tạo. |
| MediaAliases | Ánh xạ photo:/narration: cũ hoặc URL nguồn sang MediaId, không cần sửa mã hero/seed cũ. Với data URI chỉ lưu hash nguồn, không nhân đôi chuỗi base64. |

PlaceImages.MediaId và AudioTracks.MediaId là NOT NULL, có FK về MediaFiles. Url hiện là media:SHA256 để giữ hợp đồng API; file không còn chỉ là một đường dẫn bên ngoài.
8 ảnh và 40 MP3 đã nhập vào SQL; hai bản nháp/công bố tham chiếu chung byte khi cùng nội dung. Các file đóng gói cũ được giữ làm nguồn migration/backup; app không ưu tiên chúng khi xem/nghe nữa.
SQL là nguồn lưu bền vững. Web/mobile chỉ dùng API, không kết nối trực tiếp SQL.

- GET/HEAD /media/published/:id: tài nguyên đã được di tích công bố tham chiếu.
- GET/HEAD /media/preview/:id: tài nguyên được nội dung quản trị tham chiếu, dùng trên kênh admin hiện có.
- /images/published/:photoId.jpg và /audio/published/:narrationKey.mp3: tương thích mã nguồn cũ nhưng byte vẫn lấy từ SQL.
- HTTP Range dùng SUBSTRING(Data, ...) để tua, HEAD chỉ trả metadata. Không có file SQL thì báo lỗi, không fallback sang static.

Ảnh/MP3 mới chọn vẫn được xem thử trên thiết bị trước khi Lưu. Khi Lưu, API kiểm tra loại file bằng byte đầu, nhập vào SQL rồi lưu FK. Bản nháp không được truy cập qua route published cho tới khi công bố. Giới hạn chọn file UI giữ 1 MB/tệp; giới hạn kho nhập 15 MB/file.
Tạo giọng mới vẫn cần dịch vụ TTS như trước. MP3 được tạo tạm để đưa vào SQL; khi nghe chỉ đọc SQL. Dịch vụ SQL không thay chức năng tạo giọng.

File phụ trách thêm: media-store.cjs (nhập/đọc byte), media-schema.sql (bảng/FK), migrate-media.cjs (đối chiếu migration), services/catalog/media.cjs (HTTP Range), media.test.cjs (file SQL và upload/công bố).
Hai app có services/mediaSource.ts để phân giải mã file thành URL đúng API và đúng kênh admin/visitor. Các proxy Vite/Metro đã cho phép route media công bố; visitor không được proxy route preview.

Sau cập nhật, khởi động lại Expo nếu nó đang chạy để middleware Metro nạp whitelist mới. Web dev/preview cũng cần nạp lại Vite config; API đã được mở lại trên cổng cũ.
Kiểm tra riêng: npm run test:media. Không xóa MediaFiles bằng tay khi còn PlaceImages/AudioTracks tham chiếu; FK sẽ chặn.
