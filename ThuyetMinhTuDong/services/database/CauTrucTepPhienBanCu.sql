/*
 * CHỨC NĂNG: [DATABASE] [TAI-NGUYEN]
 * VAI TRÒ: SCRIPT SQL SERVER
 * FILE NÀY LÀM GÌ: Cấu trúc tệp của phiên bản cũ, giữ để tham khảo quy trình migration.
 * VỊ TRÍ: services/database/CauTrucTepPhienBanCu.sql
 * TẠI SAO: Tách định nghĩa cấu trúc, truy vấn kiểm tra và code API để dễ quản lý.
 */
/* File cũ chỉ giữ thông báo để không vô tình tạo lại MediaFiles/MediaAliases.
   Toàn bộ 11 bảng nằm trong CauTrucMuoiMotBang.sql. Chạy npm run db:init. */
THROW 51000,'Use npm run db:init; all media tables are already defined in CauTrucMuoiMotBang.sql',1;
