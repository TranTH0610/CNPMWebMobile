# Quản lý cấu hình môi trường

## Mỗi phần có một mẫu và một file riêng

```text
ThuyetMinhTuDong/
├── services/
│   ├── .env.example          Mẫu API/SQL, được đưa lên GitHub
│   ├── .env.local            Cấu hình SQL thật, chỉ giữ trên máy
│   ├── config/DocCauHinhMoiTruong.cjs        Loader BE: chỉ nhận biến SQL, không in giá trị
│   └── database/CauHinhSqlServer.cjs   Dùng cấu hình đã nạp để kết nối SQL
├── apps/web/
│   ├── .env.example          Mẫu cấu hình CÔNG KHAI của web
│   └── .env.local            Cấu hình web riêng của máy, Git bỏ qua
├── apps/mobile/
│   ├── .env.example          Mẫu cấu hình CÔNG KHAI của Expo
│   └── .env.local            URL/định danh mobile, Git bỏ qua
└── scripts/
    ├── KiemTraCauHinhMoiTruong.cjs         Kiểm tra vị trí, Git index và tên biến FE
    └── KiemThuCauHinhMoiTruong.test.cjs   Test loader và quy tắc tách BE/FE
```

Không dùng .env.sqlserver ở gốc hoặc .env của mobile nữa. Các mẫu catalog/presence
đã được gộp vào .env.example của từng app. Không lưu thêm bản sao cấu hình thật
ở thư mục được đưa lên Git. Dữ liệu/ảnh/MP3 trong SQL không thay đổi.

## Tạo cấu hình trên máy mới

Mở PowerShell tại ThuyetMinhTuDong, chỉ tạo file nếu chưa có để tránh ghi đè:

```powershell
if (!(Test-Path -LiteralPath 'services/.env.local')) {
  Copy-Item -LiteralPath 'services/.env.example' -Destination 'services/.env.local'
}
```

Sửa services/.env.local theo SQL Server trên máy. Với SQL Authentication,
đặt SQL_AUTH=sql, SQL_USER và SQL_PASSWORD. Không dùng tài khoản sa cho API.
Mật khẩu có dấu # nên đặt trong dấu nháy kép theo cú pháp dotenv.
Không gửi ảnh chụp/nội dung file thật qua chat hoặc issue GitHub.
API vẫn hỗ trợ biến môi trường do terminal/hosting cấp sẵn; chúng được ưu tiên
hơn file. Không có file thì dùng giá trị mặc định và biến môi trường hiện có.

Nếu cần tùy chỉnh FE, sao chép mẫu tương ứng thành .env.local tại app đó.
Không đặt biến SQL hoặc token quản trị trong file FE. VITE_* và EXPO_PUBLIC_*
có thể được đóng gói trong ứng dụng, kể cả khi file không có trên GitHub.
Khóa Google Maps phía client cần giới hạn theo app/tên miền tại nhà cung cấp.
Các biến định danh trong mẫu phục vụ xác minh app là thông tin công khai.
links:generate đọc process.env; đặt biến định danh trong terminal/CI khi chạy.

## Chạy và kiểm tra

```powershell
npm ci
npm run env:check
npm run test:env
npm run db:init
npm run dev
# Terminal khác:
npm run dev:admin
# Mobile du khách hoặc quản trị, chọn lệnh cần chạy:
npm run start --workspace=mobile
npm run start:admin --workspace=mobile
```

Sau khi đổi cấu hình BE, khởi động lại API; các script có thể dùng lại API đang chạy.
Sau khi đổi file FE, khởi động lại Vite/Expo. Mobile vẫn dùng script chọn proxy theo
Wi-Fi; script QR và start-catalog đã đổi sang ghi apps/mobile/.env.local.

## Trước khi đưa lên GitHub

Chạy npm run env:check. Lệnh chỉ in tên file/tên biến có vấn đề, không in giá trị.
Đây là kiểm tra phòng lỗi thường gặp, không phải công cụ phát hiện mọi bí mật:
không phát hiện bí mật có tên vô hại, lịch sử commit hoặc bí mật trong code khác.
.gitignore không tự bỏ theo dõi file đã commit. Nếu bí mật từng lên GitHub,
phải đổi bí mật đó và xử lý lịch sử chia sẻ; xóa file ở commit mới chưa đủ.
Chỉ commit .env.example; không commit .env.local, backup SQL, log và khóa riêng.

## Giới hạn bảo mật cần phân biệt

Sắp xếp file không xác thực người gọi API. Trước khi công khai admin, cần kiểm tra
quyền ở /document, /commands, /identity, thống kê quản trị và tài nguyên preview.
Không nhúng khóa quản trị dùng chung trong FE. Không mở SQL Server ra Internet.
Không dùng tài khoản chủ database cho API; ưu tiên quyền tối thiểu và TLS với
chứng thư hợp lệ khi kết nối qua mạng. File mẫu hiện dành cho SQL trên máy local.
Không thể bảo đảm tránh mọi cuộc tấn công chỉ bằng .env/.gitignore.
