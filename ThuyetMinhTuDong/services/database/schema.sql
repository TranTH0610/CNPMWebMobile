/* FILE NÀY LÀM GÌ: Tạo cấu trúc quan hệ v2, khóa ngoại và điều kiện dữ liệu.
   migrate.cjs chạy trước khi đổi API. Không xóa tài liệu JSON cũ trong migration này. */
SET XACT_ABORT ON;
BEGIN TRANSACTION;
DECLARE @lock int;
EXEC @lock=sys.sp_getapplock @Resource=N'HueGuide:schema:v2',@LockMode='Exclusive',@LockOwner='Transaction',@LockTimeout=10000;
IF @lock<0 THROW 51000,'schema_lock_timeout',1;

/* Bảng danh mục và ngôn ngữ là dữ liệu gốc cho khóa ngoại. */
IF OBJECT_ID(N'dbo.Categories',N'U') IS NULL
CREATE TABLE dbo.Categories (
  Code nvarchar(30) NOT NULL PRIMARY KEY,
  Name nvarchar(100) NOT NULL CHECK(LEN(LTRIM(RTRIM(Name)))>0)
);
INSERT dbo.Categories(Code,Name)
SELECT v.Code,v.Name FROM (VALUES
 (N'palace',N'Cung điện'),(N'gate',N'Cổng thành'),(N'temple',N'Điện thờ'),
 (N'tomb',N'Lăng tẩm'),(N'museum',N'Bảo tàng'),(N'monument',N'Công trình di tích')
) v(Code,Name) WHERE NOT EXISTS(SELECT 1 FROM dbo.Categories c WHERE c.Code=v.Code);

IF OBJECT_ID(N'dbo.Languages',N'U') IS NULL
CREATE TABLE dbo.Languages (
  Code nvarchar(10) NOT NULL PRIMARY KEY,
  Name nvarchar(100) NOT NULL CHECK(LEN(LTRIM(RTRIM(Name)))>0)
);
INSERT dbo.Languages(Code,Name)
SELECT v.Code,v.Name FROM (VALUES
 (N'vi',N'Tiếng Việt'),(N'en',N'English'),(N'cn',N'中文'),(N'pt',N'Português'),(N'ja',N'日本語')
) v(Code,Name) WHERE NOT EXISTS(SELECT 1 FROM dbo.Languages l WHERE l.Code=v.Code);

/* Scope main tách khỏi test; có dòng scope kể cả khi admin xóa hết di tích.
   Revision ở đây là phiên bản danh mục, không phải phiên bản riêng của di tích. */
IF OBJECT_ID(N'dbo.CatalogScopes',N'U') IS NULL
CREATE TABLE dbo.CatalogScopes (
  Scope nvarchar(100) NOT NULL PRIMARY KEY,
  Revision bigint NOT NULL CHECK(Revision>=1),
  UpdatedAt datetime2(3) NOT NULL DEFAULT SYSUTCDATETIME()
);

IF OBJECT_ID(N'dbo.Places',N'U') IS NULL
CREATE TABLE dbo.Places (
  Scope nvarchar(100) NOT NULL,
  PlaceId nvarchar(100) NOT NULL CHECK(LEN(LTRIM(RTRIM(PlaceId)))>0),
  SortOrder int NOT NULL CHECK(SortOrder>=0),
  Revision int NOT NULL CHECK(Revision>=1),
  Workflow nvarchar(20) NOT NULL CHECK(Workflow IN (N'draft',N'submitted',N'changes',N'approved',N'published',N'archived')),
  Period nvarchar(500) NOT NULL,
  ReviewNote nvarchar(max) NOT NULL,
  ApprovedRevision int NULL,
  UpdatedAt nvarchar(40) NOT NULL CHECK(TRY_CONVERT(datetimeoffset,UpdatedAt) IS NOT NULL),
  CONSTRAINT PK_Places PRIMARY KEY(Scope,PlaceId),
  CONSTRAINT UQ_Places_Order UNIQUE(Scope,SortOrder),
  CONSTRAINT FK_Places_Scope FOREIGN KEY(Scope) REFERENCES dbo.CatalogScopes(Scope),
  CONSTRAINT CK_Places_Approval CHECK(ApprovedRevision IS NULL OR (ApprovedRevision>=1 AND ApprovedRevision<=Revision))
);

/* Cả thông tin chung cũng phải tách draft/published để sửa tọa độ/ảnh ở nháp
   không làm đổi bản mà du khách đang xem. Đây không phải lịch sử mọi lần chỉnh sửa. */
IF OBJECT_ID(N'dbo.PlaceVersions',N'U') IS NULL
CREATE TABLE dbo.PlaceVersions (
  Scope nvarchar(100) NOT NULL,
  PlaceId nvarchar(100) NOT NULL,
  SnapshotKind nvarchar(10) NOT NULL CHECK(SnapshotKind IN(N'draft',N'published')),
  RecordScope nvarchar(100) NOT NULL,
  InLaunchCatalog bit NOT NULL,
  RecordStatus nvarchar(20) NOT NULL CHECK(RecordStatus IN(N'draft',N'published',N'withdrawn')),
  CanonicalTitle nvarchar(500) NOT NULL CHECK(LEN(LTRIM(RTRIM(CanonicalTitle)))>0),
  Zone nvarchar(30) NOT NULL CHECK(Zone IN(N'fortifications',N'ceremonial')),
  CategoryCode nvarchar(30) NOT NULL,
  HasCategory bit NOT NULL,
  Period nvarchar(500) NULL,
  Featured bit NULL,
  Latitude float NULL,
  Longitude float NULL,
  PositionVerified bit NULL,
  PositionSource nvarchar(max) NULL,
  PositionCheckedAt nvarchar(40) NULL,
  CONSTRAINT PK_PlaceVersions PRIMARY KEY(Scope,PlaceId,SnapshotKind),
  CONSTRAINT FK_PlaceVersions_Place FOREIGN KEY(Scope,PlaceId) REFERENCES dbo.Places(Scope,PlaceId),
  CONSTRAINT FK_PlaceVersions_Category FOREIGN KEY(CategoryCode) REFERENCES dbo.Categories(Code),
  CONSTRAINT CK_PlaceVersions_Coordinates CHECK(
    (Latitude IS NULL AND Longitude IS NULL AND PositionVerified IS NULL AND PositionSource IS NULL AND PositionCheckedAt IS NULL)
    OR (Latitude IS NOT NULL AND Longitude IS NOT NULL AND PositionVerified IS NOT NULL AND Latitude BETWEEN -90 AND 90 AND Longitude BETWEEN -180 AND 180))
);

IF OBJECT_ID(N'dbo.PlaceContents',N'U') IS NULL
CREATE TABLE dbo.PlaceContents (
  Scope nvarchar(100) NOT NULL,
  PlaceId nvarchar(100) NOT NULL,
  SnapshotKind nvarchar(10) NOT NULL,
  LanguageCode nvarchar(10) NOT NULL,
  Version int NOT NULL CHECK(Version>=1),
  Title nvarchar(500) NOT NULL CHECK(LEN(LTRIM(RTRIM(Title)))>0),
  Summary nvarchar(max) NOT NULL,
  Body nvarchar(max) NOT NULL,
  Address nvarchar(max) NOT NULL,
  Status nvarchar(20) NOT NULL CHECK(Status IN(N'draft',N'approved',N'published')),
  ApprovedAt nvarchar(40) NULL,
  PublishedAt nvarchar(40) NULL,
  Adaptation nvarchar(50) NULL CHECK(Adaptation IS NULL OR Adaptation=N'rewritten-and-translated'),
  HasSources bit NOT NULL,
  CONSTRAINT PK_PlaceContents PRIMARY KEY(Scope,PlaceId,SnapshotKind,LanguageCode,Version),
  CONSTRAINT UQ_PlaceContents_Current UNIQUE(Scope,PlaceId,SnapshotKind,LanguageCode),
  CONSTRAINT FK_PlaceContents_Record FOREIGN KEY(Scope,PlaceId,SnapshotKind) REFERENCES dbo.PlaceVersions(Scope,PlaceId,SnapshotKind),
  CONSTRAINT FK_PlaceContents_Language FOREIGN KEY(LanguageCode) REFERENCES dbo.Languages(Code)
);

IF OBJECT_ID(N'dbo.PlaceImages',N'U') IS NULL
CREATE TABLE dbo.PlaceImages (
  Scope nvarchar(100) NOT NULL,
  PlaceId nvarchar(100) NOT NULL,
  SnapshotKind nvarchar(10) NOT NULL,
  SortOrder int NOT NULL CHECK(SortOrder>=0),
  Url nvarchar(max) NOT NULL CHECK(LEN(LTRIM(RTRIM(Url)))>0),
  CONSTRAINT PK_PlaceImages PRIMARY KEY(Scope,PlaceId,SnapshotKind,SortOrder),
  CONSTRAINT FK_PlaceImages_Record FOREIGN KEY(Scope,PlaceId,SnapshotKind) REFERENCES dbo.PlaceVersions(Scope,PlaceId,SnapshotKind)
);

IF OBJECT_ID(N'dbo.AudioTracks',N'U') IS NULL
CREATE TABLE dbo.AudioTracks (
  Scope nvarchar(100) NOT NULL,
  PlaceId nvarchar(100) NOT NULL,
  SnapshotKind nvarchar(10) NOT NULL,
  LanguageCode nvarchar(10) NOT NULL,
  ContentVersion int NOT NULL,
  AudioId nvarchar(200) NOT NULL,
  Url nvarchar(max) NOT NULL CHECK(LEN(LTRIM(RTRIM(Url)))>0),
  Version int NOT NULL CHECK(Version>=1),
  Status nvarchar(20) NOT NULL CHECK(Status IN(N'draft',N'published')),
  ApprovedAt nvarchar(40) NULL,
  PublishedAt nvarchar(40) NULL,
  CONSTRAINT PK_AudioTracks PRIMARY KEY(Scope,PlaceId,SnapshotKind,LanguageCode,ContentVersion),
  CONSTRAINT FK_AudioTracks_Content FOREIGN KEY(Scope,PlaceId,SnapshotKind,LanguageCode,ContentVersion)
    REFERENCES dbo.PlaceContents(Scope,PlaceId,SnapshotKind,LanguageCode,Version)
);

/* Nguồn được lưu để đối chiếu, không bắt buộc hiển thị lại trên UI. */
IF OBJECT_ID(N'dbo.ContentSources',N'U') IS NULL
CREATE TABLE dbo.ContentSources (
  Scope nvarchar(100) NOT NULL,
  PlaceId nvarchar(100) NOT NULL,
  SnapshotKind nvarchar(10) NOT NULL,
  LanguageCode nvarchar(10) NOT NULL,
  ContentVersion int NOT NULL,
  SortOrder int NOT NULL CHECK(SortOrder>=0),
  Title nvarchar(max) NOT NULL,
  Url nvarchar(max) NOT NULL,
  AccessedAt nvarchar(40) NOT NULL,
  License nvarchar(200) NOT NULL,
  LicenseUrl nvarchar(max) NOT NULL,
  CONSTRAINT PK_ContentSources PRIMARY KEY(Scope,PlaceId,SnapshotKind,LanguageCode,ContentVersion,SortOrder),
  CONSTRAINT FK_ContentSources_Content FOREIGN KEY(Scope,PlaceId,SnapshotKind,LanguageCode,ContentVersion)
    REFERENCES dbo.PlaceContents(Scope,PlaceId,SnapshotKind,LanguageCode,Version)
);

IF OBJECT_ID(N'dbo.ReviewHistory',N'U') IS NULL
CREATE TABLE dbo.ReviewHistory (
  Scope nvarchar(100) NOT NULL,
  SortOrder int NOT NULL CHECK(SortOrder>=0),
  At nvarchar(40) NOT NULL CHECK(TRY_CONVERT(datetimeoffset,At) IS NOT NULL),
  Action nvarchar(50) NOT NULL,
  PlaceId nvarchar(100) NOT NULL,
  RelatedPlaceId nvarchar(100) NULL,
  Revision int NOT NULL CHECK(Revision>=1),
  CONSTRAINT PK_ReviewHistory PRIMARY KEY(Scope,SortOrder),
  CONSTRAINT FK_ReviewHistory_Scope FOREIGN KEY(Scope) REFERENCES dbo.CatalogScopes(Scope),
  CONSTRAINT FK_ReviewHistory_Place FOREIGN KEY(Scope,RelatedPlaceId) REFERENCES dbo.Places(Scope,PlaceId),
  CONSTRAINT CK_ReviewHistory_Place CHECK(RelatedPlaceId IS NULL OR RelatedPlaceId=PlaceId)
);
/* PlaceId giữ mã gốc sau khi xóa di tích; RelatedPlaceId có thể NULL để không mất log xóa.
   Giữ tối đa 100 mục như hợp đồng quản trị hiện có; không bịa người duyệt của dữ liệu cũ. */

/* Giữ nguyên dữ liệu các bảng thống kê đã tồn tại từ v1. */
IF OBJECT_ID(N'dbo.GateEntries',N'U') IS NULL
CREATE TABLE dbo.GateEntries (
  Scope nvarchar(100) NOT NULL, VisitDay date NOT NULL,
  VisitId varchar(100) COLLATE Latin1_General_100_BIN2 NOT NULL,
  Platform varchar(20) NOT NULL CHECK(Platform IN('web','mobile-app')),
  OpenedAt datetime2(3) NOT NULL DEFAULT SYSUTCDATETIME(),
  CONSTRAINT PK_GateEntries PRIMARY KEY(Scope,VisitDay,VisitId)
);
IF OBJECT_ID(N'dbo.GateCarry',N'U') IS NULL
CREATE TABLE dbo.GateCarry (
  Scope nvarchar(100) NOT NULL, VisitDay date NOT NULL, Total int NOT NULL CHECK(Total>=0),
  CONSTRAINT PK_GateCarry PRIMARY KEY(Scope,VisitDay)
);
IF OBJECT_ID(N'dbo.ActiveSessions',N'U') IS NULL
CREATE TABLE dbo.ActiveSessions (
  Scope nvarchar(100) NOT NULL,
  SessionId varchar(100) COLLATE Latin1_General_100_BIN2 NOT NULL,
  Platform varchar(20) NOT NULL CHECK(Platform IN('web','mobile-app')),
  LastSeen bigint NOT NULL,
  CONSTRAINT PK_ActiveSessions PRIMARY KEY(Scope,SessionId)
);
IF NOT EXISTS(SELECT 1 FROM sys.indexes WHERE name=N'IX_ActiveSessions_LastSeen' AND object_id=OBJECT_ID(N'dbo.ActiveSessions'))
  CREATE INDEX IX_ActiveSessions_LastSeen ON dbo.ActiveSessions(Scope,LastSeen) INCLUDE(Platform);
IF NOT EXISTS(SELECT 1 FROM sys.check_constraints WHERE name=N'CK_ActiveSessions_LastSeen')
  ALTER TABLE dbo.ActiveSessions WITH CHECK ADD CONSTRAINT CK_ActiveSessions_LastSeen CHECK(LastSeen>=0);
COMMIT;
GO
/* View hiện đọc bảng quan hệ; không còn phân tích Payload JSON. */
CREATE OR ALTER VIEW dbo.vw_Places AS
SELECT p.Scope,p.PlaceId AS Id,v.CanonicalTitle AS Title,v.CategoryCode AS Category,
 p.Revision,p.Workflow,p.Period,p.ReviewNote,v.Latitude,v.Longitude,v.PositionVerified,
 CONVERT(bit,CASE WHEN EXISTS(SELECT 1 FROM dbo.PlaceVersions pub WHERE pub.Scope=p.Scope AND pub.PlaceId=p.PlaceId AND pub.SnapshotKind=N'published') THEN 1 ELSE 0 END) AS HasPublished
FROM dbo.Places p JOIN dbo.PlaceVersions v ON v.Scope=p.Scope AND v.PlaceId=p.PlaceId AND v.SnapshotKind=N'draft';
GO
CREATE OR ALTER VIEW dbo.vw_PlaceContent AS
SELECT c.Scope,c.PlaceId,c.SnapshotKind,c.LanguageCode AS Language,c.Version,
 c.Title,c.Summary,c.Address,c.Status,c.Body,a.Url AS AudioUrl
FROM dbo.PlaceContents c LEFT JOIN dbo.AudioTracks a
 ON a.Scope=c.Scope AND a.PlaceId=c.PlaceId AND a.SnapshotKind=c.SnapshotKind
 AND a.LanguageCode=c.LanguageCode AND a.ContentVersion=c.Version;
