/* FILE NÀY LÀM GÌ: Lưu file thật trong SQL và liên kết với ảnh/bản thu.
   migrate.cjs chạy trước bước nhập file; cột MediaId được đặt NOT NULL sau khi nhập xong. */
SET XACT_ABORT ON;
BEGIN TRANSACTION;
IF OBJECT_ID(N'dbo.MediaFiles',N'U') IS NULL
CREATE TABLE dbo.MediaFiles (
  Id char(64) COLLATE Latin1_General_100_BIN2 NOT NULL PRIMARY KEY,
  Kind varchar(10) NOT NULL CHECK(Kind IN('image','audio')),
  MimeType varchar(40) NOT NULL,
  Data varbinary(max) NOT NULL,
  ByteLength AS DATALENGTH(Data) PERSISTED,
  SourceScope nvarchar(100) NOT NULL,
  CreatedAt datetime2(3) NOT NULL DEFAULT SYSUTCDATETIME(),
  CONSTRAINT CK_MediaFiles_Size CHECK(DATALENGTH(Data)>0 AND DATALENGTH(Data)<=15728640),
  CONSTRAINT CK_MediaFiles_Type CHECK(
    (Kind='image' AND MimeType IN('image/jpeg','image/png','image/webp'))
    OR (Kind='audio' AND MimeType IN('audio/mpeg','audio/wav','audio/ogg')))
);
/* Alias giúp nhận lại photo:/narration: cũ mà không cần giữ app đọc file static. */
IF OBJECT_ID(N'dbo.MediaAliases',N'U') IS NULL
CREATE TABLE dbo.MediaAliases (
  SourceHash char(64) COLLATE Latin1_General_100_BIN2 NOT NULL PRIMARY KEY,
  SourceUri nvarchar(2048) NULL,
  MediaId char(64) COLLATE Latin1_General_100_BIN2 NOT NULL,
  CONSTRAINT FK_MediaAliases_File FOREIGN KEY(MediaId) REFERENCES dbo.MediaFiles(Id)
);
IF COL_LENGTH(N'dbo.PlaceImages',N'MediaId') IS NULL
 ALTER TABLE dbo.PlaceImages ADD MediaId char(64) COLLATE Latin1_General_100_BIN2 NULL;
IF COL_LENGTH(N'dbo.AudioTracks',N'MediaId') IS NULL
 ALTER TABLE dbo.AudioTracks ADD MediaId char(64) COLLATE Latin1_General_100_BIN2 NULL;
IF NOT EXISTS(SELECT 1 FROM sys.foreign_keys WHERE name=N'FK_PlaceImages_Media')
 ALTER TABLE dbo.PlaceImages WITH CHECK ADD CONSTRAINT FK_PlaceImages_Media FOREIGN KEY(MediaId) REFERENCES dbo.MediaFiles(Id);
IF NOT EXISTS(SELECT 1 FROM sys.foreign_keys WHERE name=N'FK_AudioTracks_Media')
 ALTER TABLE dbo.AudioTracks WITH CHECK ADD CONSTRAINT FK_AudioTracks_Media FOREIGN KEY(MediaId) REFERENCES dbo.MediaFiles(Id);
COMMIT;
