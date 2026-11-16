# Chạy đồ án bằng Docker

Docker chạy SQL Server 2022 Developer, API di tích, API phiên, web du khách và web quản lý. App Expo vẫn chạy trên điện thoại, dùng chung API và database Docker. Không đổi 11 bảng nghiệp vụ, thuật toán GPS, API hoặc luồng duyệt/công bố.

## 1. Chạy trên máy hiện tại

Mở Docker Desktop ở chế độ Linux containers. Tại thư mục `ThuyetMinhTuDong`, chạy bằng Node >=22.13:

```powershell
npm run docker:up
```

Lần đầu lệnh tạo mật khẩu riêng, sao lưu SQL Windows bằng `COPY_ONLY, CHECKSUM`, kiểm tra backup rồi build image. SQL container phục hồi backup chỉ khi database Docker chưa tồn tại. Bản SQL Windows vẫn giữ nguyên. Lần đầu cần Internet để tải image, npm và thư viện Python.

| Thành phần | Địa chỉ mặc định | Mục đích |
|---|---|---|
| Web du khách | http://localhost:18080 | Khám phá, bản đồ, nghe thuyết minh |
| Web quản lý | http://localhost:18081/admin | Quản trị trên chính máy này |
| SQL trong SSMS | `localhost,14330` | Xem database `HueGuideDemo` |
| API di tích | http://127.0.0.1:18888/version | Kiểm tra kết nối; Metro chuyển tiếp |
| API phiên | http://127.0.0.1:18887/statistics/active | Kiểm tra phiên; Metro chuyển tiếp |

Đây là các cổng riêng, không chiếm cổng web/API/SQL Windows hiện có. Muốn đổi, sao chép `.env.docker.example` thành `.env.docker.local`, sửa cổng rồi chạy lại. File này chỉ cấu hình cổng/tên, không chứa mật khẩu.

## 2. Các lệnh quản lý

```powershell
npm run docker:status   # Xem container và healthcheck
npm run docker:check    # Kiểm tra HTTP/API và chặn API quản lý trên web khách
npm run docker:test     # Kiểm thử cấu hình, kiểm tra đầu vào SQL
npm run docker:logs     # Xem 80 dòng log gần nhất
npm run docker:stop     # Dừng các container của đồ án
npm run docker:up       # Chạy lại, giữ dữ liệu trong volume
npm run docker:down     # Gỡ container/mạng; vẫn giữ volume SQL
```

Không chạy `docker compose down -v` hoặc xóa volume `hueguide_sql_data` nếu muốn giữ dữ liệu. Volume là nơi SQL đang lưu dữ liệu; file `.bak` ban đầu chỉ là ảnh chụp dữ liệu lúc chuyển, không tự cập nhật sau mỗi lần sửa.

## 3. Mobile và QR

Máy tính và điện thoại cùng Wi-Fi. Cài dependencies của dự án như bình thường rồi chạy:

```powershell
npm run docker:mobile        # Expo du khách, cổng 8081
npm run docker:mobile:admin  # Expo quản lý, cổng 8082
```

Hai lệnh dùng proxy Metro hiện có để chuyển tới API Docker; không khởi động thêm API Windows và không ghi IP vào `.env`. Đổi Wi-Fi thì chạy lại Expo để lấy IP mới.

Với **web trên điện thoại**, dùng `http://IP_LAN_MAY_TINH:18080`. Windows Firewall phải cho phép mạng riêng truy cập cổng 18080. `localhost` trên điện thoại là chính điện thoại, không phải máy tính. GPS trên trình duyệt cần HTTPS (ngoại trừ localhost); nếu dùng tunnel/QR công khai, tunnel phải trỏ tới **18080**, tạo QR bằng URL HTTPS mới. Docker không tự tạo tên miền HTTPS và không làm QR cũ có hiệu lực lại. Không mở cổng SQL ra Internet.

Web quản lý mặc định chỉ bind `127.0.0.1`, vì dự án đang dùng danh tính quản lý mô phỏng, chưa có xác thực thật. Không công khai cổng quản lý/API quản lý. App quản lý qua Metro cũng chỉ dùng trong mạng demo tin cậy.

## 4. Xem SQL Server bằng SSMS

Chọn SQL Server Authentication, server `localhost,14330`, database `HueGuideDemo`, user `hueguide_app`. Mật khẩu nằm trong `.docker/secrets/sql-app-password`, mở cục bộ khi cần, không chụp/đăng lên GitHub. Chọn Trust server certificate cho chứng thư tự ký của môi trường demo. Tài khoản này được đọc/ghi dữ liệu trong database, không có quyền quản trị máy chủ hoặc tạo database.

`sa` chỉ dùng trong bước restore/cấp quyền và healthcheck SQL; API không nhận secret `sa`. Chứng thư tự ký tin cậy chỉ áp dụng môi trường Docker demo này, không phải cấu hình triển khai Internet.

## 5. Thư mục và chức năng từng file

```text
ThuyetMinhTuDong/
├── docker-compose.yml               Ghép SQL, hai API và hai website; cổng/volume/healthcheck
├── .dockerignore                    Bỏ secret, node_modules Windows, output khỏi image
├── .env.docker.example              Mẫu cấu hình không chứa bí mật
├── docker/
│   ├── Dockerfile                   Build Node/Python API và hai bản web qua nhiều stage
│   ├── nginx/
│   │   ├── DuKhach.conf             SPA khách; chỉ chuyển tiếp API công khai
│   │   └── QuanTri.conf             SPA quản lý; chuyển tiếp API quản lý nội bộ
│   └── scripts/
│       ├── DocCauHinhDocker.cjs      Đọc cổng/secret; kiểm tra đầu vào cấu hình
│       ├── ChuanBiDocker.cjs         Tạo secret riêng, kiểm tra có backup nguồn
│       ├── SaoLuuNguonSql.cjs        Backup SQL Windows không thay đổi dữ liệu nguồn
│       ├── KhoiTaoSql.cjs            Restore vào SQL mới, kiểm tra 11 bảng, cấp quyền API
│       ├── KhoiChayApi.cjs           Đọc secret rồi chạy API sẵn có; dừng kết nối an toàn
│       ├── DieuKhienDocker.cjs       Điều phối các lệnh npm docker:*
│       ├── KiemTraHeThongDocker.cjs  Smoke test HTTP và giới hạn API khách
│       ├── ChayMobile.cjs            Expo trên máy tính, proxy sang API Docker
│       └── KiemThuDocker.test.cjs    Kiểm thử cổng và đầu vào SQL
├── .docker/                         Dữ liệu riêng của máy; bị loại khỏi Git/image
│   ├── backups/HueGuideDemo.bak      Bản sao lưu ban đầu đã kiểm tra checksum
│   └── secrets/                     Mật khẩu sa và tài khoản API, tạo ngẫu nhiên
└── docs/ChayDuAnBangDocker.md        Hướng dẫn này
```

Mỗi file mới có chú thích tiếng Việt ở đầu và tại các khối xử lý. `package.json` không hỗ trợ comment nên chức năng các lệnh được giải thích tại đây.

## 6. Nộp bài, sao lưu và bảo trì

- GitHub chỉ chứa source/config mẫu; `.docker`, `.env.*.local`, `.bak` bị loại khỏi Git và build context.
- Thư mục secret trên Windows được bỏ quyền kế thừa rộng, chỉ chủ máy, SYSTEM và Administrators được truy cập. Trên Linux thư mục được tạo với quyền 0700; file gắn vào container chỉ dùng để dịch vụ đọc.
- Gửi backup riêng cho người nhận nếu cần dữ liệu thật. Chép vào `.docker/backups/HueGuideDemo.bak` trước `docker:up`; lệnh sẽ tạo mật khẩu mới trên máy nhận. Không gửi secret cũ kèm source công khai.
- Nếu máy nhận chưa có backup thì bước chuẩn bị cần SQL nguồn hoạt động và cấu hình nguồn hiện có. Không tự thay bằng dữ liệu mẫu.
- Sau khi cập nhật dữ liệu trong Docker, dùng SSMS kết nối cổng 14330 để tạo backup mới bằng tài khoản có quyền backup (sa trong secret quản trị). Giữ cả file backup và secret ở nơi riêng an toàn; volume không thay thế backup.
- Script không restore đè database đã tồn tại. Muốn thay dataset cần sao lưu bản đang chạy và quyết định phục hồi riêng, tránh mất dữ liệu do chạy lại lệnh.
- SQL Server Developer chỉ dùng phát triển/demo môn học. Tạo giọng đọc và dịch vẫn cần Internet tới dịch vụ đang có; Docker không thay đổi hạn mức dịch.
- Sau thay đổi code chạy lại `docker:up` để build image mới; giữ nguyên volume. Không tự áp dụng thay đổi schema vào database đang có.
- Nếu lỗi: mở Docker Desktop, kiểm tra `docker:status`, `docker:logs`, cổng bị chiếm, bộ nhớ Docker và backup. Không xóa volume để chữa lỗi kết nối.

## 7. Kiến trúc dữ liệu

Web/Expo → API di tích hoặc API phiên → SQL Server trong mạng Docker. File ảnh/audio đã lưu trong `TepTaiNguyen` đi cùng backup; tài nguyên tĩnh hiện có vẫn được đóng gói trong image. Có 11 bảng nghiệp vụ; `sysdiagrams` nếu có là bảng sơ đồ SSMS và được giữ nguyên khi restore.

## 8. Kết quả kiểm tra trên máy này — 14/11/2026

| Kiểm tra thực tế | Kết quả |
|---|---|
| Build Linux cho hai web và API Node/Python | Đạt |
| Lint các script Docker; cú pháp hai file Nginx | Đạt |
| Kiểm thử cấu hình Docker/đầu vào SQL | 3/3 đạt |
| Bộ kiểm thử SQL, tài nguyên, API di tích và phiên trên database test riêng | 50/50 đạt; không ghi thử vào database chính |
| Phục hồi và đối chiếu dữ liệu với SQL Windows | 11 bảng nghiệp vụ và bảng `sysdiagrams` giữ nguyên; 9 di tích |
| Đối chiếu tài nguyên bằng SHA-256 | 60 tệp, tổng 18.191.331 byte khớp nguồn |
| HEAD và Range qua web khách | 54 tài nguyên công bố trả đúng 200/206 |
| Restart SQL/API, Nginx tự cập nhật DNS và kết nối lại | Đạt; dữ liệu sau restart vẫn khớp nguồn |
| Tài khoản API, image và Git ignore | Không phải sa, không được tạo database; image không có .env/backup; Git bỏ secret/backup |
| Script Python tạo MP3 trong container | Đạt với văn bản thử, chỉ ghi /tmp, không lưu bài thử vào SQL |
| Hai lệnh mobile Docker | Đã xác minh API, cấu hình LAN và mở được Expo CLI |

Chưa kiểm thử trực tiếp trên thiết bị iOS/Android hoặc QR HTTPS công khai trong đợt đóng gói này. Không thay thế việc thử GPS và nghe audio trên điện thoại thật. Cấu hình này phục vụ phát triển/báo cáo, chưa bổ sung xác thực quản trị cho triển khai Internet.
