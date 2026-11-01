/* FILE NÀY LÀM GÌ: Tạo đúng 11 bảng nghiệp vụ tiếng Việt và các ràng buộc.
   Migration chạy trong database kiểm tra trước. Không thêm bảng ánh xạ tài nguyên.
   Các sequence là bộ cấp số, không phải bảng; mã đã cấp không được tái sử dụng. */
SET XACT_ABORT ON;
SET QUOTED_IDENTIFIER ON;
GO
IF OBJECT_ID(N'dbo.NgonNgu',N'U') IS NOT NULL RETURN;
CREATE SEQUENCE dbo.SeqDiTich AS bigint START WITH 1;
CREATE SEQUENCE dbo.SeqBanDiTich AS bigint START WITH 1;
CREATE SEQUENCE dbo.SeqNoiDung AS bigint START WITH 1;
CREATE SEQUENCE dbo.SeqHinhAnh AS bigint START WITH 1;
CREATE SEQUENCE dbo.SeqBanThu AS bigint START WITH 1;
CREATE SEQUENCE dbo.SeqLichSu AS bigint START WITH 1;
CREATE SEQUENCE dbo.SeqQR AS bigint START WITH 1;
CREATE SEQUENCE dbo.SeqTep AS bigint START WITH 1;
CREATE SEQUENCE dbo.SeqNguon AS bigint START WITH 1;

CREATE TABLE dbo.NgonNgu(
 MaNgonNgu nvarchar(10) NOT NULL PRIMARY KEY,
 TenNgonNgu nvarchar(100) NOT NULL CHECK(LEN(TRIM(TenNgonNgu))>0),
 TenBanDia nvarchar(100) NOT NULL CHECK(LEN(TRIM(TenBanDia))>0),
 MaGiongDoc nvarchar(20) NOT NULL CHECK(LEN(TRIM(MaGiongDoc))>0),
 DangSuDung bit NOT NULL DEFAULT 1,
 ThuTuHienThi int NOT NULL UNIQUE CHECK(ThuTuHienThi>=0),
 CONSTRAINT CK_NgonNgu_Ma CHECK(MaNgonNgu IN(N'vi',N'en',N'cn',N'pt',N'ja'))
);
INSERT dbo.NgonNgu VALUES
 (N'vi',N'Tiếng Việt',N'Tiếng Việt',N'vi-VN',1,0),
 (N'en',N'Tiếng Anh',N'English',N'en-US',1,1),
 (N'cn',N'Tiếng Trung',N'中文',N'zh-CN',1,2),
 (N'pt',N'Tiếng Bồ Đào Nha',N'Português',N'pt-PT',1,3),
 (N'ja',N'Tiếng Nhật',N'日本語',N'ja-JP',1,4);

CREATE TABLE dbo.DiTich(
 MaDiTich varchar(30) NOT NULL DEFAULT ('DT'+FORMAT(NEXT VALUE FOR dbo.SeqDiTich,'000','en-US')) PRIMARY KEY,
 ThuTuHienThi int NOT NULL UNIQUE CHECK(ThuTuHienThi>=0),
 PhienBanChinhSua int NOT NULL CHECK(PhienBanChinhSua>=1),
 TrangThaiXuLy varchar(20) NOT NULL CHECK(TrangThaiXuLy IN('draft','submitted','changes','approved','published','archived')),
 GhiChuKiemDuyet nvarchar(max) NOT NULL DEFAULT N'',
 PhienBanDaDuyet int NULL,
 ThoiDiemTao datetime2(3) NOT NULL DEFAULT SYSUTCDATETIME(),
 ThoiDiemCapNhat datetime2(3) NOT NULL DEFAULT SYSUTCDATETIME(),
 CONSTRAINT CK_DiTich_Ma CHECK(MaDiTich LIKE 'DT[0-9][0-9][0-9]%' AND SUBSTRING(MaDiTich,3,30) NOT LIKE '%[^0-9]%'),
 CONSTRAINT CK_DiTich_Duyet CHECK(PhienBanDaDuyet IS NULL OR PhienBanDaDuyet BETWEEN 1 AND PhienBanChinhSua),
 CONSTRAINT CK_DiTich_CongBo CHECK(TrangThaiXuLy NOT IN('approved','published') OR (PhienBanDaDuyet IS NOT NULL AND PhienBanDaDuyet=PhienBanChinhSua))
);

CREATE TABLE dbo.BanDiTich(
 MaBanDiTich varchar(30) NOT NULL DEFAULT ('BDT'+FORMAT(NEXT VALUE FOR dbo.SeqBanDiTich,'000','en-US')) PRIMARY KEY,
 MaDiTich varchar(30) NOT NULL REFERENCES dbo.DiTich(MaDiTich),
 LoaiBan varchar(10) NOT NULL CHECK(LoaiBan IN('draft','published')),
 TenChuan nvarchar(500) NOT NULL CHECK(LEN(TRIM(TenChuan))>0),
 MaKhuVuc varchar(10) NOT NULL CHECK(MaKhuVuc IN('KV001','KV002')),
 MaDanhMuc varchar(10) NOT NULL CHECK(MaDanhMuc IN('DM001','DM002','DM003','DM004','DM005','DM006')),
 NienDai nvarchar(500) NULL,
 LaDiemNoiBat bit NOT NULL DEFAULT 0,
 ViDo decimal(10,7) NULL,
 KinhDo decimal(10,7) NULL,
 DaXacNhanViTri bit NOT NULL DEFAULT 0,
 NguonToaDo nvarchar(max) NULL,
 ThoiDiemDoiChieuViTri datetime2(3) NULL,
 CONSTRAINT UQ_BanDiTich UNIQUE(MaDiTich,LoaiBan),
 CONSTRAINT CK_BanDiTich_ToaDo CHECK(
   (ViDo IS NULL AND KinhDo IS NULL AND DaXacNhanViTri=0 AND NguonToaDo IS NULL AND ThoiDiemDoiChieuViTri IS NULL)
   OR (ViDo IS NOT NULL AND KinhDo IS NOT NULL AND ViDo BETWEEN -90 AND 90 AND KinhDo BETWEEN -180 AND 180
       AND (DaXacNhanViTri=0 OR (NguonToaDo IS NOT NULL AND LEN(TRIM(NguonToaDo))>0 AND ThoiDiemDoiChieuViTri IS NOT NULL))))
);

CREATE TABLE dbo.NoiDungDiTich(
 MaNoiDung varchar(30) NOT NULL DEFAULT ('ND'+FORMAT(NEXT VALUE FOR dbo.SeqNoiDung,'000','en-US')) PRIMARY KEY,
 MaBanDiTich varchar(30) NOT NULL REFERENCES dbo.BanDiTich(MaBanDiTich),
 MaNgonNgu nvarchar(10) NOT NULL REFERENCES dbo.NgonNgu(MaNgonNgu),
 PhienBanNoiDung int NOT NULL CHECK(PhienBanNoiDung>=1),
 TenDiTich nvarchar(500) NOT NULL CHECK(LEN(TRIM(TenDiTich))>0),
 TomTat nvarchar(max) NOT NULL,
 BaiThuyetMinh nvarchar(max) NOT NULL,
 DiaChi nvarchar(max) NOT NULL,
 TrangThaiNoiDung varchar(20) NOT NULL CHECK(TrangThaiNoiDung IN('draft','approved','published')),
 ThoiDiemDuyet datetime2(3) NULL,
 ThoiDiemCongBo datetime2(3) NULL,
 HinhThucBienSoan nvarchar(50) NULL CHECK(HinhThucBienSoan IS NULL OR HinhThucBienSoan=N'rewritten-and-translated'),
 CONSTRAINT UQ_NoiDung_NgonNgu UNIQUE(MaBanDiTich,MaNgonNgu),
 CONSTRAINT UQ_NoiDung_PhienBan UNIQUE(MaNoiDung,PhienBanNoiDung),
 CONSTRAINT CK_NoiDung_Duyet CHECK(TrangThaiNoiDung='draft' OR (ThoiDiemDuyet IS NOT NULL AND LEN(TRIM(BaiThuyetMinh))>0 AND LEN(TRIM(DiaChi))>0)),
 CONSTRAINT CK_NoiDung_CongBo CHECK((TrangThaiNoiDung='published' AND ThoiDiemCongBo IS NOT NULL AND ThoiDiemCongBo>=ThoiDiemDuyet) OR (TrangThaiNoiDung<>'published' AND ThoiDiemCongBo IS NULL))
);

CREATE TABLE dbo.TepTaiNguyen(
 MaTep varchar(30) NOT NULL DEFAULT ('TEP'+FORMAT(NEXT VALUE FOR dbo.SeqTep,'000','en-US')) PRIMARY KEY,
 MaBamTep char(64) COLLATE Latin1_General_100_BIN2 NOT NULL UNIQUE,
 LoaiTep AS CONVERT(varchar(10),CASE WHEN DinhDangTep LIKE 'image/%' THEN 'image' ELSE 'audio' END) PERSISTED,
 DinhDangTep varchar(40) NOT NULL CHECK(DinhDangTep IN('image/jpeg','image/png','image/webp','audio/mpeg','audio/wav','audio/ogg')),
 DuLieuTep varbinary(max) NOT NULL,
 DungLuongByte AS DATALENGTH(DuLieuTep) PERSISTED,
 ThoiDiemTao datetime2(3) NOT NULL DEFAULT SYSUTCDATETIME(),
 CONSTRAINT CK_Tep_KichThuoc CHECK(DATALENGTH(DuLieuTep)>0 AND DATALENGTH(DuLieuTep)<=15728640),
 CONSTRAINT CK_Tep_MaBam CHECK(MaBamTep=LOWER(CONVERT(char(64),HASHBYTES('SHA2_256',DuLieuTep),2)))
);

CREATE TABLE dbo.HinhAnhDiTich(
 MaHinhAnh varchar(30) NOT NULL DEFAULT ('HA'+FORMAT(NEXT VALUE FOR dbo.SeqHinhAnh,'000','en-US')) PRIMARY KEY,
 MaBanDiTich varchar(30) NOT NULL REFERENCES dbo.BanDiTich(MaBanDiTich),
 MaTep varchar(30) NOT NULL REFERENCES dbo.TepTaiNguyen(MaTep),
 ThuTuHienThi int NOT NULL CHECK(ThuTuHienThi>=0),
 MoTaAnh nvarchar(500) NULL,
 CONSTRAINT UQ_HinhAnh_ThuTu UNIQUE(MaBanDiTich,ThuTuHienThi)
);

CREATE TABLE dbo.BanThuThuyetMinh(
 MaBanThu varchar(30) NOT NULL DEFAULT ('BT'+FORMAT(NEXT VALUE FOR dbo.SeqBanThu,'000','en-US')) PRIMARY KEY,
 MaNoiDung varchar(30) NOT NULL UNIQUE,
 PhienBanNoiDung int NOT NULL CHECK(PhienBanNoiDung>=1),
 PhienBanBanThu int NOT NULL CHECK(PhienBanBanThu>=1),
 TrangThaiBanThu varchar(20) NOT NULL CHECK(TrangThaiBanThu IN('draft','published')),
 MaTep varchar(30) NOT NULL REFERENCES dbo.TepTaiNguyen(MaTep),
 ThoiDiemDuyet datetime2(3) NULL,
 ThoiDiemCongBo datetime2(3) NULL,
 CONSTRAINT FK_BanThu_NoiDung FOREIGN KEY(MaNoiDung,PhienBanNoiDung) REFERENCES dbo.NoiDungDiTich(MaNoiDung,PhienBanNoiDung),
 CONSTRAINT CK_BanThu_Duyet CHECK((TrangThaiBanThu='published' AND ThoiDiemDuyet IS NOT NULL AND ThoiDiemCongBo IS NOT NULL AND ThoiDiemCongBo>=ThoiDiemDuyet) OR (TrangThaiBanThu='draft' AND ThoiDiemCongBo IS NULL))
);

CREATE TABLE dbo.LichSuKiemDuyet(
 MaLichSu varchar(30) NOT NULL DEFAULT ('LS'+FORMAT(NEXT VALUE FOR dbo.SeqLichSu,'000','en-US')) PRIMARY KEY,
 MaDiTichGoc varchar(30) NOT NULL,
 MaDiTichLienKet varchar(30) NULL REFERENCES dbo.DiTich(MaDiTich),
 HanhDong varchar(50) NOT NULL CHECK(HanhDong IN('savePlace','saveContent','translate','generateAudio','submit','review','approve','reject','requestChanges','publish','archive','deletePlace')),
 PhienBanDiTich int NOT NULL CHECK(PhienBanDiTich>=1),
 GhiChu nvarchar(max) NULL,
 ThoiDiemThaoTac datetime2(3) NOT NULL,
 CONSTRAINT CK_LichSu_Ma CHECK(MaDiTichLienKet IS NULL OR MaDiTichLienKet=MaDiTichGoc)
);

CREATE TABLE dbo.NguonThamKhao(
 MaNguon varchar(30) NOT NULL DEFAULT ('NTK'+FORMAT(NEXT VALUE FOR dbo.SeqNguon,'000','en-US')) PRIMARY KEY,
 MaNoiDung varchar(30) NOT NULL REFERENCES dbo.NoiDungDiTich(MaNoiDung),
 ThuTuHienThi int NOT NULL CHECK(ThuTuHienThi>=0),
 TenTaiLieu nvarchar(1000) NOT NULL CHECK(LEN(TRIM(TenTaiLieu))>0),
 DuongDan nvarchar(2048) NOT NULL CHECK(DuongDan LIKE N'https://%' OR DuongDan LIKE N'http://%'),
 NgayTruyCap date NOT NULL,
 GiayPhep nvarchar(200) NULL,
 DuongDanGiayPhep nvarchar(2048) NULL CHECK(DuongDanGiayPhep IS NULL OR DuongDanGiayPhep LIKE N'https://%' OR DuongDanGiayPhep LIKE N'http://%'),
 CONSTRAINT UQ_Nguon_ThuTu UNIQUE(MaNoiDung,ThuTuHienThi)
);

CREATE TABLE dbo.LuotTruyCapQR(
 MaGhiNhanQR varchar(30) NOT NULL DEFAULT ('QR'+FORMAT(NEXT VALUE FOR dbo.SeqQR,'000','en-US')) PRIMARY KEY,
 NgayTruyCap date NOT NULL,
 MaLuotTruyCap varchar(100) COLLATE Latin1_General_100_BIN2 NOT NULL,
 NenTang varchar(20) NULL,
 ThoiDiemTruyCap datetime2(3) NULL,
 LoaiGhiNhan varchar(20) NOT NULL,
 SoLuot int NOT NULL,
 CONSTRAINT UQ_QR_ChongTrung UNIQUE(NgayTruyCap,MaLuotTruyCap),
 CONSTRAINT CK_QR_GiaTri CHECK(
   (LoaiGhiNhan='luot_moi' AND SoLuot=1 AND NenTang IS NOT NULL AND NenTang IN('web','mobile-app') AND ThoiDiemTruyCap IS NOT NULL AND LEN(MaLuotTruyCap) BETWEEN 20 AND 100)
   OR (LoaiGhiNhan='tong_chuyen_cu' AND SoLuot>=0 AND NenTang IS NULL AND ThoiDiemTruyCap IS NULL))
);

CREATE TABLE dbo.PhienHoatDong(
 MaPhien varchar(100) COLLATE Latin1_General_100_BIN2 NOT NULL PRIMARY KEY CHECK(LEN(MaPhien) BETWEEN 20 AND 100),
 NenTang varchar(20) NOT NULL CHECK(NenTang IN('web','mobile-app')),
 ThoiDiemHoatDongCuoi datetime2(3) NOT NULL
);
CREATE INDEX IX_Phien_HoatDong ON dbo.PhienHoatDong(ThoiDiemHoatDongCuoi) INCLUDE(NenTang);
GO
/* CHECK chỉ kiểm tra một hàng. Trigger dưới đây kiểm tra quan hệ giữa bảng. */
CREATE OR ALTER TRIGGER dbo.TR_HinhAnh_Loai ON dbo.HinhAnhDiTich AFTER INSERT,UPDATE AS
BEGIN
 SET NOCOUNT ON;
 IF EXISTS(SELECT 1 FROM inserted i JOIN dbo.TepTaiNguyen t ON t.MaTep=i.MaTep WHERE t.LoaiTep<>'image')
 THROW 51011,'image_requires_image_file',1;
END;
GO
CREATE OR ALTER TRIGGER dbo.TR_BanThu_Loai ON dbo.BanThuThuyetMinh AFTER INSERT,UPDATE AS
BEGIN
 SET NOCOUNT ON;
 IF EXISTS(SELECT 1 FROM inserted i JOIN dbo.TepTaiNguyen t ON t.MaTep=i.MaTep WHERE t.LoaiTep<>'audio')
 THROW 51012,'audio_requires_audio_file',1;
 IF EXISTS(SELECT 1 FROM inserted i JOIN dbo.NoiDungDiTich n ON n.MaNoiDung=i.MaNoiDung WHERE i.TrangThaiBanThu='published' AND n.TrangThaiNoiDung<>'published')
 THROW 51013,'audio_requires_published_content',1;
END;
GO
CREATE OR ALTER TRIGGER dbo.TR_Tep_BatBien ON dbo.TepTaiNguyen AFTER UPDATE AS
BEGIN
 SET NOCOUNT ON;
 IF UPDATE(MaBamTep) OR UPDATE(DuLieuTep) OR UPDATE(DinhDangTep)
 THROW 51014,'media_is_immutable_create_new_file',1;
END;
GO
CREATE OR ALTER TRIGGER dbo.TR_DiTich_CongBo ON dbo.DiTich AFTER INSERT,UPDATE AS
BEGIN
 SET NOCOUNT ON;
 IF EXISTS(SELECT 1 FROM inserted i WHERE i.TrangThaiXuLy='published' AND NOT EXISTS(
   SELECT 1 FROM dbo.BanDiTich b JOIN dbo.NoiDungDiTich n ON n.MaBanDiTich=b.MaBanDiTich
   WHERE b.MaDiTich=i.MaDiTich AND b.LoaiBan='published' AND n.TrangThaiNoiDung='published'))
 THROW 51015,'published_place_requires_published_content',1;
END;
GO
/* Định dạng mã vẫn được kiểm tra cả khi ai đó nhập SQL thủ công. */
DECLARE @checks table(TenBang sysname,TenCot sysname,TienTo varchar(10));
INSERT @checks VALUES
 (N'BanDiTich',N'MaBanDiTich','BDT'),(N'NoiDungDiTich',N'MaNoiDung','ND'),
 (N'HinhAnhDiTich',N'MaHinhAnh','HA'),(N'BanThuThuyetMinh',N'MaBanThu','BT'),
 (N'LichSuKiemDuyet',N'MaLichSu','LS'),(N'LuotTruyCapQR',N'MaGhiNhanQR','QR'),
 (N'TepTaiNguyen',N'MaTep','TEP'),(N'NguonThamKhao',N'MaNguon','NTK');
DECLARE @table sysname,@column sysname,@prefix varchar(10),@statement nvarchar(max),@constraint sysname;
DECLARE codeChecks CURSOR LOCAL FAST_FORWARD FOR SELECT TenBang,TenCot,TienTo FROM @checks;
OPEN codeChecks;
FETCH NEXT FROM codeChecks INTO @table,@column,@prefix;
WHILE @@FETCH_STATUS=0
BEGIN
 SET @constraint=N'CK_Ma_'+@table;
 IF NOT EXISTS(SELECT 1 FROM sys.check_constraints WHERE name=@constraint)
 BEGIN
  SET @statement=N'ALTER TABLE dbo.'+QUOTENAME(@table)+N' WITH CHECK ADD CONSTRAINT '+QUOTENAME(@constraint)
   +N' CHECK('+QUOTENAME(@column)+N' COLLATE Latin1_General_100_BIN2 LIKE '''+@prefix+N'[0-9][0-9][0-9]%'' AND SUBSTRING('
   +QUOTENAME(@column)+N','+CONVERT(nvarchar(10),LEN(@prefix)+1)+N',30) COLLATE Latin1_General_100_BIN2 NOT LIKE ''%[^0-9]%'');';
  EXEC sys.sp_executesql @statement;
 END;
 FETCH NEXT FROM codeChecks INTO @table,@column,@prefix;
END;
CLOSE codeChecks;DEALLOCATE codeChecks;
GO
IF NOT EXISTS(SELECT 1 FROM sys.key_constraints WHERE name=N'UQ_NgonNgu_GiongDoc')
 ALTER TABLE dbo.NgonNgu ADD CONSTRAINT UQ_NgonNgu_GiongDoc UNIQUE(MaGiongDoc);
IF NOT EXISTS(SELECT 1 FROM sys.check_constraints WHERE name=N'CK_Tep_ChuKy')
 ALTER TABLE dbo.TepTaiNguyen WITH CHECK ADD CONSTRAINT CK_Tep_ChuKy CHECK(
  (DinhDangTep='image/jpeg' AND SUBSTRING(DuLieuTep,1,3)=0xFFD8FF)
  OR (DinhDangTep='image/png' AND SUBSTRING(DuLieuTep,1,8)=0x89504E470D0A1A0A)
  OR (DinhDangTep='image/webp' AND SUBSTRING(DuLieuTep,1,4)=0x52494646 AND SUBSTRING(DuLieuTep,9,4)=0x57454250)
  OR (DinhDangTep='audio/wav' AND SUBSTRING(DuLieuTep,1,4)=0x52494646 AND SUBSTRING(DuLieuTep,9,4)=0x57415645)
  OR (DinhDangTep='audio/ogg' AND SUBSTRING(DuLieuTep,1,4)=0x4F676753)
  OR (DinhDangTep='audio/mpeg' AND (SUBSTRING(DuLieuTep,1,3)=0x494433 OR (SUBSTRING(DuLieuTep,1,1)=0xFF AND CONVERT(int,SUBSTRING(DuLieuTep,2,1)) & 224=224)))
 );
GO
CREATE OR ALTER TRIGGER dbo.TR_NoiDung_CongBo ON dbo.NoiDungDiTich AFTER INSERT,UPDATE,DELETE AS
BEGIN
 SET NOCOUNT ON;
 IF EXISTS(SELECT 1 FROM inserted n JOIN dbo.BanDiTich b ON b.MaBanDiTich=n.MaBanDiTich
   WHERE b.LoaiBan='published' AND n.TrangThaiNoiDung<>'published')
 THROW 51017,'published_snapshot_requires_published_content',1;
 IF EXISTS(SELECT 1 FROM inserted n JOIN dbo.BanThuThuyetMinh a ON a.MaNoiDung=n.MaNoiDung
   WHERE a.TrangThaiBanThu='published' AND n.TrangThaiNoiDung<>'published')
 THROW 51017,'published_audio_requires_published_content',1;
 IF EXISTS(SELECT 1 FROM deleted d JOIN dbo.BanDiTich b ON b.MaBanDiTich=d.MaBanDiTich
   JOIN dbo.DiTich p ON p.MaDiTich=b.MaDiTich
   WHERE p.TrangThaiXuLy='published' AND b.LoaiBan='published' AND NOT EXISTS(
    SELECT 1 FROM dbo.NoiDungDiTich n WHERE n.MaBanDiTich=b.MaBanDiTich AND n.TrangThaiNoiDung='published'))
 THROW 51018,'cannot_remove_last_published_content',1;
END;
GO
