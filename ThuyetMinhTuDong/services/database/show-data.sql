/* FILE NÀY LÀM GÌ: Các lệnh chỉ đọc để xem cấu trúc mới trong SSMS.
   Chọn HueGuideDemo ở thanh database trước khi chạy nếu database máy bạn có tên khác. */
USE HueGuideDemo;
GO
-- Danh mục/ngôn ngữ hỗ trợ.
SELECT * FROM dbo.Categories;
SELECT * FROM dbo.Languages;
-- Mỗi dòng view tương ứng một di tích; tên/địa chỉ nằm trong bản thông tin và bài ngôn ngữ.
SELECT * FROM dbo.vw_Places WHERE Scope=N'main';
SELECT * FROM dbo.Places WHERE Scope=N'main' ORDER BY SortOrder;
SELECT * FROM dbo.PlaceVersions WHERE Scope=N'main' ORDER BY PlaceId,SnapshotKind;
-- Bản admin đang sửa và bản khách đang xem được xem riêng.
SELECT * FROM dbo.vw_PlaceContent WHERE Scope=N'main' AND SnapshotKind=N'draft' ORDER BY PlaceId,Language;
SELECT * FROM dbo.vw_PlaceContent WHERE Scope=N'main' AND SnapshotKind=N'published' ORDER BY PlaceId,Language;
SELECT * FROM dbo.PlaceImages WHERE Scope=N'main' ORDER BY PlaceId,SnapshotKind,SortOrder;
SELECT * FROM dbo.AudioTracks WHERE Scope=N'main';
SELECT * FROM dbo.ContentSources WHERE Scope=N'main';
SELECT * FROM dbo.ReviewHistory WHERE Scope=N'main' ORDER BY SortOrder;
SELECT * FROM dbo.CatalogScopes WHERE Scope=N'main';
SELECT * FROM dbo.GateEntries WHERE Scope=N'main' ORDER BY OpenedAt DESC;
SELECT * FROM dbo.GateCarry WHERE Scope=N'main';
SELECT * FROM dbo.ActiveSessions WHERE Scope=N'main';
-- Xem các khóa ngoại: bảng nào tham chiếu bảng nào.
SELECT fk.name AS ForeignKey,OBJECT_SCHEMA_NAME(fk.parent_object_id) AS SchemaName,
 OBJECT_NAME(fk.parent_object_id) AS ChildTable,OBJECT_NAME(fk.referenced_object_id) AS ParentTable
FROM sys.foreign_keys fk WHERE OBJECT_SCHEMA_NAME(fk.parent_object_id)=N'dbo'
ORDER BY ChildTable,ForeignKey;

-- File thật nằm ở MediaFiles.Data (VARBINARY). Chỉ xem metadata để không in hàng MB mã hex.
SELECT Id,Kind,MimeType,ByteLength,SourceScope,CreatedAt FROM dbo.MediaFiles WHERE SourceScope=N'main';
SELECT p.PlaceId,v.CanonicalTitle,p.SnapshotKind,m.Id,m.MimeType,m.ByteLength
FROM dbo.PlaceImages p JOIN dbo.MediaFiles m ON m.Id=p.MediaId
JOIN dbo.PlaceVersions v ON v.Scope=p.Scope AND v.PlaceId=p.PlaceId AND v.SnapshotKind=p.SnapshotKind
WHERE p.Scope=N'main';
SELECT a.PlaceId,a.LanguageCode,a.SnapshotKind,a.ContentVersion,m.Id,m.MimeType,m.ByteLength
FROM dbo.AudioTracks a JOIN dbo.MediaFiles m ON m.Id=a.MediaId WHERE a.Scope=N'main';
SELECT SourceUri,MediaId FROM dbo.MediaAliases WHERE SourceUri IS NOT NULL;
