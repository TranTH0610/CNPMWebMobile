/* FILE NÀY LÀM GÌ: Xem 11 bảng và ràng buộc trong SSMS. Chỉ đọc, không sửa dữ liệu. */
USE HueGuideDemo;
GO
SELECT COUNT(*) AS SoBangNghiepVu FROM sys.tables WHERE schema_id=SCHEMA_ID(N'dbo') AND name<>N'sysdiagrams';
SELECT * FROM dbo.NgonNgu ORDER BY ThuTuHienThi;
SELECT * FROM dbo.DiTich ORDER BY ThuTuHienThi;
SELECT * FROM dbo.BanDiTich ORDER BY MaDiTich,LoaiBan;
SELECT * FROM dbo.NoiDungDiTich ORDER BY MaBanDiTich,MaNgonNgu;
SELECT * FROM dbo.HinhAnhDiTich ORDER BY MaBanDiTich,ThuTuHienThi;
SELECT * FROM dbo.BanThuThuyetMinh ORDER BY MaNoiDung;
SELECT * FROM dbo.LichSuKiemDuyet ORDER BY ThoiDiemThaoTac DESC;
SELECT * FROM dbo.NguonThamKhao ORDER BY MaNoiDung,ThuTuHienThi;
SELECT * FROM dbo.LuotTruyCapQR ORDER BY NgayTruyCap DESC,ThoiDiemTruyCap DESC;
SELECT * FROM dbo.PhienHoatDong ORDER BY ThoiDiemHoatDongCuoi DESC;
/* Không xuất toàn bộ byte tệp vào Results: metadata đủ để kiểm tra, tải qua API để nghe/xem. */
SELECT MaTep,MaBamTep,LoaiTep,DinhDangTep,DungLuongByte,ThoiDiemTao FROM dbo.TepTaiNguyen ORDER BY MaTep;

SELECT NgayTruyCap,SUM(SoLuot) AS TongLuot FROM dbo.LuotTruyCapQR GROUP BY NgayTruyCap ORDER BY NgayTruyCap DESC;
SELECT * FROM dbo.PhienHoatDong WHERE ThoiDiemHoatDongCuoi>DATEADD(SECOND,-90,SYSUTCDATETIME());

SELECT fk.name AS TenKhoaNgoai,OBJECT_NAME(fk.parent_object_id) AS BangCon,
 OBJECT_NAME(fk.referenced_object_id) AS BangCha,fk.is_disabled,fk.is_not_trusted
FROM sys.foreign_keys fk ORDER BY BangCon;
SELECT OBJECT_NAME(parent_object_id) AS TenBang,name,definition,is_disabled,is_not_trusted FROM sys.check_constraints ORDER BY TenBang,name;
SELECT OBJECT_NAME(parent_object_id) AS TenBang,name,type_desc FROM sys.key_constraints ORDER BY TenBang,name;
SELECT OBJECT_NAME(parent_object_id) AS TenBang,name,is_disabled FROM sys.triggers WHERE parent_class=1 ORDER BY TenBang,name;
