/* File cũ chỉ giữ thông báo để không vô tình tạo lại MediaFiles/MediaAliases.
   Toàn bộ 11 bảng nằm trong schema.sql. Chạy npm run db:init. */
THROW 51000,'Use npm run db:init; all media tables are already defined in schema.sql',1;
