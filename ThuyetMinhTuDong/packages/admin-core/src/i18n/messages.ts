/**
 * FILE NÀY LÀM GÌ
 * Bộ chuỗi giao diện quản trị theo năm ngôn ngữ, dùng qua useAdminText để web/mobile cùng nghĩa và
 * cùng khóa.
 *
 * VỊ TRÍ: packages/admin-core/src/i18n/messages.ts
 * DÙNG BỞI: packages/admin-core/src/react/react.tsx.
 * PHỤ THUỘC: @travelguide/visitor-core
 * TẠI SAO TÁCH FILE: Tập trung ngôn ngữ tại đây giúp cùng một khóa luôn có cùng cách dịch trên
 * các màn.
 */
// Nhập kiểu dữ liệu từ '@travelguide/visitor-core'.
import type { Language } from '@travelguide/visitor-core'
// Khai báo vi: tạo object gồm "previewSeek", "previewVolume", "previewMore", "previewRate", "previewPause", "previewResume", "gateHint", "gateError", "confirmDelete".
const vi = {
  // Gán thuộc tính "previewSeek": chuỗi "Tua bài nghe thử".
  "previewSeek": "Tua bài nghe thử",
  // Gán thuộc tính "previewVolume": chuỗi "Âm lượng".
  "previewVolume": "Âm lượng",
  // Gán thuộc tính "previewMore": chuỗi "Tùy chọn nghe thử".
  "previewMore": "Tùy chọn nghe thử",
  // Gán thuộc tính "previewRate": chuỗi "Tốc độ".
  "previewRate": "Tốc độ",
  // Gán thuộc tính "previewPause": chuỗi "Tạm dừng".
  "previewPause": "Tạm dừng",
  // Gán thuộc tính "previewResume": chuỗi "Tiếp tục".
  "previewResume": "Tiếp tục",
  // Gán thuộc tính "gateHint": chuỗi "Lượt mở liên kết QR vào cổng, mỗi phiên/ngày tính một lần.
  "gateHint": "Lượt mở liên kết QR vào cổng, mỗi phiên/ngày tính một lần; không phải số vé hay số người.",
  // Gán thuộc tính "gateError": chuỗi "Chưa tải được lượt QR.".
  "gateError": "Chưa tải được lượt QR.",

  // Nội dung mô tả SQL Server dùng chung, giữ cùng khóa dịch cho web/mobile.
  "confirmDelete": "Xóa vĩnh viễn di tích này khỏi Admin và trang du khách trong SQL Server? Bản nháp và bản công khai sẽ bị xóa. Không có nút hoàn tác.",
  // Gán thuộc tính "delete": chuỗi "Xóa vĩnh viễn".
  "delete": "Xóa vĩnh viễn",
  // Gán thuộc tính "clearFile": chuỗi "Bỏ tệp đã chọn".
  "clearFile": "Bỏ tệp đã chọn",
  // Gán thuộc tính "localFile": chuỗi "Đã chọn tệp cục bộ".
  "localFile": "Đã chọn tệp cục bộ",
  // Gán thuộc tính "mediaError": chuỗi "Tệp không hợp lệ hoặc lớn hơn 1 MB. Chọn JPEG/PNG/WebP hoặc MP3/WAV/OGG.".
  "mediaError": "Tệp không hợp lệ hoặc lớn hơn 1 MB. Chọn JPEG/PNG/WebP hoặc MP3/WAV/OGG.",
  // File được lưu thành byte SQL sau khi người dùng xác nhận Lưu.
  "fileHint": "Tối đa 1 MB/tệp; bấm Lưu để đưa tệp vào SQL Server.",
  // Gán thuộc tính "pickAudio": chuỗi "Chọn bản thu từ thiết bị".
  "pickAudio": "Chọn bản thu từ thiết bị",
  // Gán thuộc tính "pickImage": chuỗi "Chọn ảnh từ thiết bị".
  "pickImage": "Chọn ảnh từ thiết bị",
  // Gán thuộc tính "confirm": chuỗi "Xác nhận".
  "confirm": "Xác nhận",
  // Gán thuộc tính "previewError": chuỗi "Không phát được bản nghe thử. Kiểm tra nguồn và thử lại.".
  "previewError": "Không phát được bản nghe thử. Kiểm tra nguồn và thử lại.",
  // Gán thuộc tính "simListening": chuỗi "Mô phỏng khách đang nghe".
  "simListening": "Mô phỏng khách đang nghe",
  // Gán thuộc tính "overviewHint": chuỗi "Theo dõi hoạt động và quản lý nội dung di tích.".
  "overviewHint": "Theo dõi hoạt động và quản lý nội dung di tích.",
  // Gán thuộc tính "quickActions": chuỗi "Thao tác nhanh".
  "quickActions": "Thao tác nhanh",
  // Gán thuộc tính "managePlacesHint": chuỗi "Cập nhật thông tin, hình ảnh và bài thuyết minh.".
  "managePlacesHint": "Cập nhật thông tin, hình ảnh và bài thuyết minh.",
  // Gán thuộc tính "reviewQueueHint": chuỗi "Kiểm tra và công bố nội dung đã duyệt.".
  "reviewQueueHint": "Kiểm tra và công bố nội dung đã duyệt.",
  // Gán thuộc tính "catalogHint": chuỗi "Quản lý danh mục và nội dung thuyết minh.".
  "catalogHint": "Quản lý danh mục và nội dung thuyết minh.",
  // Gán thuộc tính "basicInfo": chuỗi "Thông tin di tích".
  "basicInfo": "Thông tin di tích",
  // Gán thuộc tính "locationSection": chuỗi "Vị trí và tọa độ".
  "locationSection": "Vị trí và tọa độ",
  // Gán thuộc tính "mediaSection": chuỗi "Hình ảnh và tư liệu".
  "mediaSection": "Hình ảnh và tư liệu",
  // Gán thuộc tính "workflowSection": chuỗi "Lưu và quản lý phiên bản".
  "workflowSection": "Lưu và quản lý phiên bản",
  // Gán thuộc tính "resetHint": chuỗi "Khôi phục dữ liệu mẫu khi cần bắt đầu lại.".
  "resetHint": "Khôi phục dữ liệu mẫu khi cần bắt đầu lại.",
  // Gán thuộc tính "editorHint": chuỗi "Biên tập nội dung theo từng ngôn ngữ.".
  "editorHint": "Biên tập nội dung theo từng ngôn ngữ.",
  // Gán thuộc tính "clearSearch": chuỗi "Xóa từ khóa".
  "clearSearch": "Xóa từ khóa",
  // Gán thuộc tính "admin": chuỗi "Quản lý".
  "admin": "Quản lý",
  // Gán thuộc tính "dashboard": chuỗi "Tổng quan".
  "dashboard": "Tổng quan",
  // Gán thuộc tính "places": chuỗi "Di tích".
  "places": "Di tích",
  // Gán thuộc tính "reviews": chuỗi "Kiểm duyệt".
  "reviews": "Kiểm duyệt",
  // Gán thuộc tính "qr": chuỗi "QR tại cổng".
  "qr": "QR tại cổng",
  // Gán thuộc tính "visitor": chuỗi "Về trang du khách".
  "visitor": "Về trang du khách",

  // Nội dung mô tả SQL Server dùng chung, giữ cùng khóa dịch cho web/mobile.
  "demo": "Dữ liệu được lưu dùng chung trong SQL Server; khởi động lại API không làm mất nội dung đã lưu.",
  // Gán thuộc tính "mockMedia": chuỗi "MP3 được tạo từ đúng bài đã lưu. Dịch tự động còn mô phỏng.
  "mockMedia": "MP3 được tạo từ đúng bài đã lưu. Dịch tự động còn mô phỏng; nhập bản dịch đã kiểm tra trước khi công bố.",
  // Gán thuộc tính "loading": chuỗi "Đang tải…".
  "loading": "Đang tải…",
  // Gán thuộc tính "save": chuỗi "Lưu bản nháp".
  "save": "Lưu bản nháp",
  // Gán thuộc tính "saved": chuỗi "Thao tác thành công".
  "saved": "Thao tác thành công",
  // Gán thuộc tính "new": chuỗi "Thêm di tích".
  "new": "Thêm di tích",
  // Gán thuộc tính "edit": chuỗi "Thông tin".
  "edit": "Thông tin",
  // Gán thuộc tính "content": chuỗi "Biên tập".
  "content": "Biên tập",
  // Gán thuộc tính "search": chuỗi "Tìm di tích…".
  "search": "Tìm di tích…",
  // Gán thuộc tính "title": chuỗi "Tên chính thức".
  "title": "Tên chính thức",
  // Gán thuộc tính "period": chuỗi "Giai đoạn lịch sử".
  "period": "Giai đoạn lịch sử",
  // Gán thuộc tính "category": chuỗi "Danh mục".
  "category": "Danh mục",
  // Gán thuộc tính "lat": chuỗi "Vĩ độ".
  "lat": "Vĩ độ",
  // Gán thuộc tính "lng": chuỗi "Kinh độ".
  "lng": "Kinh độ",
  // Gán thuộc tính "verified": chuỗi "Tọa độ đã kiểm tra".
  "verified": "Tọa độ đã kiểm tra",
  // Gán thuộc tính "images": chuỗi "Ảnh: mỗi dòng một URL hoặc mã photo:ID".
  "images": "Ảnh: mỗi dòng một URL hoặc mã photo:ID",
  // Gán thuộc tính "summary": chuỗi "Mô tả ngắn".
  "summary": "Mô tả ngắn",
  // Gán thuộc tính "address": chuỗi "Địa chỉ".
  "address": "Địa chỉ",
  // Gán thuộc tính "body": chuỗi "Bài thuyết minh".
  "body": "Bài thuyết minh",
  // Gán thuộc tính "audio": chuỗi "URL bản thu MP3 đã lưu trên máy chủ".
  "audio": "URL bản thu MP3 đã lưu trên máy chủ",
  // Gán thuộc tính "preview": chuỗi "Nghe thử".
  "preview": "Nghe thử",
  // Gán thuộc tính "prepare": chuỗi "Tạo giọng đọc từ bài đã lưu".
  "prepare": "Tạo giọng đọc từ bài đã lưu",
  // Gán thuộc tính "translate": chuỗi "Dịch nháp mô phỏng từ tiếng Việt".
  "translate": "Dịch nháp mô phỏng từ tiếng Việt",
  // Gán thuộc tính "submit": chuỗi "Gửi duyệt".
  "submit": "Gửi duyệt",
  // Gán thuộc tính "approve": chuỗi "Duyệt phiên bản".
  "approve": "Duyệt phiên bản",
  // Gán thuộc tính "reject": chuỗi "Yêu cầu sửa".
  "reject": "Yêu cầu sửa",
  // Gán thuộc tính "note": chuỗi "Ghi chú kiểm duyệt".
  "note": "Ghi chú kiểm duyệt",
  // Gán thuộc tính "publish": chuỗi "Công bố phiên bản".
  "publish": "Công bố phiên bản",
  // Gán thuộc tính "confirmPublish": chuỗi "Công bố bản này cho giao diện du khách trên thiết bị hiện tại?".
  "confirmPublish": "Công bố bản này cho giao diện du khách trên thiết bị hiện tại?",
  // Gán thuộc tính "archive": chuỗi "Lưu trữ di tích".
  "archive": "Lưu trữ di tích",
  // Gán thuộc tính "confirmArchive": chuỗi "Lưu trữ sẽ bỏ điểm khỏi danh mục công khai . Tiếp tục?".
  "confirmArchive": "Lưu trữ sẽ bỏ điểm khỏi danh mục công khai . Tiếp tục?",
  // Gán thuộc tính "reset": chuỗi "Đặt lại dữ liệu mẫu".
  "reset": "Đặt lại dữ liệu mẫu",
  // Gán thuộc tính "confirmReset": chuỗi "Xóa các thay đổi cục bộ và nạp lại dữ liệu mẫu?".
  "confirmReset": "Xóa các thay đổi cục bộ và nạp lại dữ liệu mẫu?",
  // Gán thuộc tính "cancel": chuỗi "Hủy".
  "cancel": "Hủy",
  // Gán thuộc tính "unsaved": chuỗi "Có thay đổi chưa lưu. Bạn muốn rời biểu mẫu?".
  "unsaved": "Có thay đổi chưa lưu. Bạn muốn rời biểu mẫu?",
  // Gán thuộc tính "active": chuỗi "Phiên đang hoạt động".
  "active": "Phiên đang hoạt động",
  // Gán thuộc tính "web": chuỗi "Web".
  "web": "Web",
  // Gán thuộc tính "mobile": chuỗi "App Mobile".
  "mobile": "App Mobile",
  // Gán thuộc tính "listening": chuỗi "Đang nghe".
  "listening": "Đang nghe",
  // Gán thuộc tính "gateToday": chuỗi "Lượt QR hôm nay".
  "gateToday": "Lượt QR hôm nay",
  // Gán thuộc tính "simWeb": chuỗi "Mô phỏng khách Web".
  "simWeb": "Mô phỏng khách Web",
  // Gán thuộc tính "simMobile": chuỗi "Mô phỏng khách App".
  "simMobile": "Mô phỏng khách App",
  // Gán thuộc tính "endSessions": chuỗi "Kết thúc phiên mô phỏng".
  "endSessions": "Kết thúc phiên mô phỏng",

  // Nội dung mô tả SQL Server dùng chung, giữ cùng khóa dịch cho web/mobile.
  "analyticsHint": "Phiên ẩn danh được lưu trong SQL Server; hết hoạt động sau 90 giây không gửi tín hiệu. Đây là số phiên, không phải số người/vé.",

  // Nội dung mô tả SQL Server dùng chung, giữ cùng khóa dịch cho web/mobile.
  "presenceError": "Chưa lấy được thống kê. Kiểm tra API và kết nối SQL Server.",
  // Gán thuộc tính "empty": chuỗi "Chưa có dữ liệu phù hợp".
  "empty": "Chưa có dữ liệu phù hợp",
  // Gán thuộc tính "revision": chuỗi "Bản sửa".
  "revision": "Bản sửa",
  // Gán thuộc tính "current": chuỗi "Bản công khai hiện hành".
  "current": "Bản công khai hiện hành",
  // Gán thuộc tính "none": chuỗi "Chưa có".
  "none": "Chưa có",
  // Gán thuộc tính "status_draft": chuỗi "Bản nháp".
  "status_draft": "Bản nháp",
  // Gán thuộc tính "status_submitted": chuỗi "Chờ duyệt".
  "status_submitted": "Chờ duyệt",
  // Gán thuộc tính "status_changes": chuỗi "Cần sửa".
  "status_changes": "Cần sửa",
  // Gán thuộc tính "status_approved": chuỗi "Đã duyệt".
  "status_approved": "Đã duyệt",
  // Gán thuộc tính "status_published": chuỗi "Đã công bố".
  "status_published": "Đã công bố",
  // Gán thuộc tính "status_archived": chuỗi "Đã lưu trữ".
  "status_archived": "Đã lưu trữ",
  // Gán thuộc tính "error_loadError": chuỗi "Không kết nối được dữ liệu quản lý. Kiểm tra kết nối và thử lại.".
  "error_loadError": "Không kết nối được dữ liệu quản lý. Kiểm tra kết nối và thử lại.",
  // Gán thuộc tính "error_saveError": chuỗi "Không lưu được. Bản công khai cũ được giữ nguyên.".
  "error_saveError": "Không lưu được. Bản công khai cũ được giữ nguyên.",
  // Gán thuộc tính "error_invalid": chuỗi "Kiểm tra trường bắt buộc, tọa độ Huế và URL HTTP(S).".
  "error_invalid": "Kiểm tra trường bắt buộc, tọa độ Huế và URL HTTP(S).",
  // Gán thuộc tính "error_conflict": chuỗi "Bản đã thay đổi. Tải lại trước khi tiếp tục.".
  "error_conflict": "Bản đã thay đổi. Tải lại trước khi tiếp tục.",
  // Gán thuộc tính "error_notFound": chuỗi "Không tìm thấy di tích".
  "error_notFound": "Không tìm thấy di tích",
  // Gán thuộc tính "error_notApproved": chuỗi "Chỉ công bố đúng phiên bản đã duyệt, chưa sửa tiếp.".
  "error_notApproved": "Chỉ công bố đúng phiên bản đã duyệt, chưa sửa tiếp.",
  // Gán thuộc tính "error_incomplete": chuỗi "Cần ảnh, bài Việt và audio cho các bản nội dung đã nhập.".
  "error_incomplete": "Cần ảnh, bài Việt và audio cho các bản nội dung đã nhập.",
  // Gán thuộc tính "error_staleJob": chuỗi "Kết quả tác vụ thuộc bản cũ. Hãy thử lại.".
  "error_staleJob": "Kết quả tác vụ thuộc bản cũ. Hãy thử lại.",
  // Gán thuộc tính "retry": chuỗi "Thử lại".
  "retry": "Thử lại",
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `"stop": "Dừng nghe thử"`: Gán thuộc tính "stop": chuỗi "Dừng nghe thử".
   * DÒNG `} as const`: Khai báo vi: tạo object gồm "previewSeek", "previewVolume", "previewMore", "previewRate", "previewPause", "previewResume", "gateHint", "gateError", "confirmDelete".
   */
  "stop": "Dừng nghe thử"
} as const
// Khai báo en: tạo object gồm "previewSeek", "previewVolume", "previewMore", "previewRate", "previewPause", "previewResume", "gateHint", "gateError", "confirmDelete".
const en = {
  // Gán thuộc tính "previewSeek": chuỗi "Seek preview".
  "previewSeek": "Seek preview",
  // Gán thuộc tính "previewVolume": chuỗi "Volume".
  "previewVolume": "Volume",
  // Gán thuộc tính "previewMore": chuỗi "Preview options".
  "previewMore": "Preview options",
  // Gán thuộc tính "previewRate": chuỗi "Speed".
  "previewRate": "Speed",
  // Gán thuộc tính "previewPause": chuỗi "Pause".
  "previewPause": "Pause",
  // Gán thuộc tính "previewResume": chuỗi "Resume".
  "previewResume": "Resume",
  // Gán thuộc tính "gateHint": chuỗi "Gate QR link opens, counted once per session/day.
  "gateHint": "Gate QR link opens, counted once per session/day; not tickets or people.",
  // Gán thuộc tính "gateError": chuỗi "QR statistics are unavailable.".
  "gateError": "QR statistics are unavailable.",

  "confirmDelete": "Permanently delete this place from shared Admin and visitor data? Draft and published content will be removed. There is no undo button.",
  // Gán thuộc tính "delete": chuỗi "Delete permanently".
  "delete": "Delete permanently",
  // Gán thuộc tính "clearFile": chuỗi "Remove selected file".
  "clearFile": "Remove selected file",
  // Gán thuộc tính "localFile": chuỗi "Local file selected".
  "localFile": "Local file selected",
  // Gán thuộc tính "mediaError": chuỗi "Invalid file or larger than 1 MB. Choose JPEG/PNG/WebP or MP3/WAV/OGG.".
  "mediaError": "Invalid file or larger than 1 MB. Choose JPEG/PNG/WebP or MP3/WAV/OGG.",
  // File được lưu thành byte SQL sau khi người dùng xác nhận Lưu.
  "fileHint": "Up to 1 MB per file; Save stores the file in SQL Server.",
  // Gán thuộc tính "pickAudio": chuỗi "Choose local recording".
  "pickAudio": "Choose local recording",
  // Gán thuộc tính "pickImage": chuỗi "Choose local image".
  "pickImage": "Choose local image",
  // Gán thuộc tính "confirm": chuỗi "Confirm".
  "confirm": "Confirm",
  // Gán thuộc tính "previewError": chuỗi "Preview unavailable. Check the source and retry.".
  "previewError": "Preview unavailable. Check the source and retry.",
  // Gán thuộc tính "simListening": chuỗi "Simulate listening visitor".
  "simListening": "Simulate listening visitor",
  // Gán thuộc tính "overviewHint": chuỗi "Monitor activity and manage heritage content.".
  "overviewHint": "Monitor activity and manage heritage content.",
  // Gán thuộc tính "quickActions": chuỗi "Quick actions".
  "quickActions": "Quick actions",
  // Gán thuộc tính "managePlacesHint": chuỗi "Update information, photos and narration.".
  "managePlacesHint": "Update information, photos and narration.",
  // Gán thuộc tính "reviewQueueHint": chuỗi "Review and publish approved content.".
  "reviewQueueHint": "Review and publish approved content.",
  // Gán thuộc tính "catalogHint": chuỗi "Manage places and narration content.".
  "catalogHint": "Manage places and narration content.",
  // Gán thuộc tính "basicInfo": chuỗi "Place information".
  "basicInfo": "Place information",
  // Gán thuộc tính "locationSection": chuỗi "Location and coordinates".
  "locationSection": "Location and coordinates",
  // Gán thuộc tính "mediaSection": chuỗi "Photos and media".
  "mediaSection": "Photos and media",
  // Gán thuộc tính "workflowSection": chuỗi "Save and manage versions".
  "workflowSection": "Save and manage versions",
  // Gán thuộc tính "resetHint": chuỗi "Restore sample data when you need a fresh start.".
  "resetHint": "Restore sample data when you need a fresh start.",
  // Gán thuộc tính "editorHint": chuỗi "Edit content in each language.".
  "editorHint": "Edit content in each language.",
  // Gán thuộc tính "clearSearch": chuỗi "Clear search".
  "clearSearch": "Clear search",
  // Gán thuộc tính "admin": chuỗi "Management".
  "admin": "Management",
  // Gán thuộc tính "dashboard": chuỗi "Dashboard".
  "dashboard": "Dashboard",
  // Gán thuộc tính "places": chuỗi "Places".
  "places": "Places",
  // Gán thuộc tính "reviews": chuỗi "Reviews".
  "reviews": "Reviews",
  // Gán thuộc tính "qr": chuỗi "Gate QR".
  "qr": "Gate QR",
  // Gán thuộc tính "visitor": chuỗi "Visitor view".
  "visitor": "Visitor view",

  // Nội dung mô tả SQL Server dùng chung, giữ cùng khóa dịch cho web/mobile.
  "demo": "Shared data is stored in SQL Server; restarting the API preserves saved content.",
  // Gán thuộc tính "mockMedia": chuỗi "MP3 reads the saved text. Automatic translation remains simulated.
  "mockMedia": "MP3 reads the saved text. Automatic translation remains simulated; enter checked translations before publishing.",
  // Gán thuộc tính "loading": chuỗi "Loading…".
  "loading": "Loading…",
  // Gán thuộc tính "save": chuỗi "Save draft".
  "save": "Save draft",
  // Gán thuộc tính "saved": chuỗi "Operation completed".
  "saved": "Operation completed",
  // Gán thuộc tính "new": chuỗi "Add place".
  "new": "Add place",
  // Gán thuộc tính "edit": chuỗi "Information".
  "edit": "Information",
  // Gán thuộc tính "content": chuỗi "Edit content".
  "content": "Edit content",
  // Gán thuộc tính "search": chuỗi "Search places…".
  "search": "Search places…",
  // Gán thuộc tính "title": chuỗi "Official title".
  "title": "Official title",
  // Gán thuộc tính "period": chuỗi "Historical period".
  "period": "Historical period",
  // Gán thuộc tính "category": chuỗi "Category".
  "category": "Category",
  // Gán thuộc tính "lat": chuỗi "Latitude".
  "lat": "Latitude",
  // Gán thuộc tính "lng": chuỗi "Longitude".
  "lng": "Longitude",
  // Gán thuộc tính "verified": chuỗi "Coordinates verified".
  "verified": "Coordinates verified",
  // Gán thuộc tính "images": chuỗi "Images: one URL or photo:ID per line".
  "images": "Images: one URL or photo:ID per line",
  // Gán thuộc tính "summary": chuỗi "Summary".
  "summary": "Summary",
  // Gán thuộc tính "address": chuỗi "Address".
  "address": "Address",
  // Gán thuộc tính "body": chuỗi "Narration text".
  "body": "Narration text",
  // Gán thuộc tính "audio": chuỗi "Hosted recording MP3 URL".
  "audio": "Hosted recording MP3 URL",
  // Gán thuộc tính "preview": chuỗi "Preview audio".
  "preview": "Preview audio",
  // Gán thuộc tính "prepare": chuỗi "Create speech from saved text".
  "prepare": "Create speech from saved text",
  // Gán thuộc tính "translate": chuỗi "Simulated translation from Vietnamese".
  "translate": "Simulated translation from Vietnamese",
  // Gán thuộc tính "submit": chuỗi "Submit for review".
  "submit": "Submit for review",
  // Gán thuộc tính "approve": chuỗi "Approve revision".
  "approve": "Approve revision",
  // Gán thuộc tính "reject": chuỗi "Request changes".
  "reject": "Request changes",
  // Gán thuộc tính "note": chuỗi "Review note".
  "note": "Review note",
  // Gán thuộc tính "publish": chuỗi "Publish revision".
  "publish": "Publish revision",
  // Gán thuộc tính "confirmPublish": chuỗi "Publish this revision to the visitor view on this device?".
  "confirmPublish": "Publish this revision to the visitor view on this device?",
  // Gán thuộc tính "archive": chuỗi "Archive place".
  "archive": "Archive place",
  // Gán thuộc tính "confirmArchive": chuỗi "Archive removes this place from the public catalogue. Continue?".
  "confirmArchive": "Archive removes this place from the public catalogue. Continue?",
  // Gán thuộc tính "reset": chuỗi "Reset sample data".
  "reset": "Reset sample data",
  // Gán thuộc tính "confirmReset": chuỗi "Discard local changes and restore sample data?".
  "confirmReset": "Discard local changes and restore sample data?",
  // Gán thuộc tính "cancel": chuỗi "Cancel".
  "cancel": "Cancel",
  // Gán thuộc tính "unsaved": chuỗi "Unsaved changes. Leave this form?".
  "unsaved": "Unsaved changes. Leave this form?",
  // Gán thuộc tính "active": chuỗi "Active sessions".
  "active": "Active sessions",
  // Gán thuộc tính "web": chuỗi "Web".
  "web": "Web",
  // Gán thuộc tính "mobile": chuỗi "Mobile app".
  "mobile": "Mobile app",
  // Gán thuộc tính "listening": chuỗi "Listening".
  "listening": "Listening",
  // Gán thuộc tính "gateToday": chuỗi "Gate entries today".
  "gateToday": "Gate entries today",
  // Gán thuộc tính "simWeb": chuỗi "Simulate web visitor".
  "simWeb": "Simulate web visitor",
  // Gán thuộc tính "simMobile": chuỗi "Simulate app visitor".
  "simMobile": "Simulate app visitor",
  // Gán thuộc tính "endSessions": chuỗi "End simulated sessions".
  "endSessions": "End simulated sessions",

  // Nội dung mô tả SQL Server dùng chung, giữ cùng khóa dịch cho web/mobile.
  "analyticsHint": "Anonymous sessions are stored in SQL Server and expire after 90 seconds without a heartbeat. Sessions are not people or tickets.",

  // Nội dung mô tả SQL Server dùng chung, giữ cùng khóa dịch cho web/mobile.
  "presenceError": "Statistics are unavailable. Check the API and SQL Server connection.",
  // Gán thuộc tính "empty": chuỗi "No matching data".
  "empty": "No matching data",
  // Gán thuộc tính "revision": chuỗi "Revision".
  "revision": "Revision",
  // Gán thuộc tính "current": chuỗi "Current published version".
  "current": "Current published version",
  // Gán thuộc tính "none": chuỗi "None".
  "none": "None",
  // Gán thuộc tính "status_draft": chuỗi "Draft".
  "status_draft": "Draft",
  // Gán thuộc tính "status_submitted": chuỗi "In review".
  "status_submitted": "In review",
  // Gán thuộc tính "status_changes": chuỗi "Changes requested".
  "status_changes": "Changes requested",
  // Gán thuộc tính "status_approved": chuỗi "Approved".
  "status_approved": "Approved",
  // Gán thuộc tính "status_published": chuỗi "Published".
  "status_published": "Published",
  // Gán thuộc tính "status_archived": chuỗi "Archived".
  "status_archived": "Archived",
  // Gán thuộc tính "error_loadError": chuỗi "Could not connect to management data. Check the connection and retry.".
  "error_loadError": "Could not connect to management data. Check the connection and retry.",
  // Gán thuộc tính "error_saveError": chuỗi "Save failed. The published version is unchanged.".
  "error_saveError": "Save failed. The published version is unchanged.",
  // Gán thuộc tính "error_invalid": chuỗi "Check required fields, Hue coordinates and HTTP(S) URLs.".
  "error_invalid": "Check required fields, Hue coordinates and HTTP(S) URLs.",
  // Gán thuộc tính "error_conflict": chuỗi "Revision changed. Reload before continuing.".
  "error_conflict": "Revision changed. Reload before continuing.",
  // Gán thuộc tính "error_notFound": chuỗi "Place not found".
  "error_notFound": "Place not found",
  // Gán thuộc tính "error_notApproved": chuỗi "Publish only the unchanged approved revision.".
  "error_notApproved": "Publish only the unchanged approved revision.",
  // Gán thuộc tính "error_incomplete": chuỗi "Require an image, Vietnamese text and audio for entered languages.".
  "error_incomplete": "Require an image, Vietnamese text and audio for entered languages.",
  // Gán thuộc tính "error_staleJob": chuỗi "Task result is stale. Retry.".
  "error_staleJob": "Task result is stale. Retry.",
  // Gán thuộc tính "retry": chuỗi "Retry".
  "retry": "Retry",
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `"stop": "Stop preview"`: Gán thuộc tính "stop": chuỗi "Stop preview".
   * DÒNG `} as const`: Khai báo en: tạo object gồm "previewSeek", "previewVolume", "previewMore", "previewRate", "previewPause", "previewResume", "gateHint", "gateError", "confirmDelete".
   */
  "stop": "Stop preview"
} as const
// Khai báo cn: tạo object gồm "previewSeek", "previewVolume", "previewMore", "previewRate", "previewPause", "previewResume", "gateHint", "gateError", "confirmDelete".
const cn = {
  // Gán thuộc tính "previewSeek": chuỗi "拖动试听进度".
  "previewSeek": "拖动试听进度",
  // Gán thuộc tính "previewVolume": chuỗi "音量".
  "previewVolume": "音量",
  // Gán thuộc tính "previewMore": chuỗi "试听选项".
  "previewMore": "试听选项",
  // Gán thuộc tính "previewRate": chuỗi "播放速度".
  "previewRate": "播放速度",
  // Gán thuộc tính "previewPause": chuỗi "暂停".
  "previewPause": "暂停",
  // Gán thuộc tính "previewResume": chuỗi "继续播放".
  "previewResume": "继续播放",
  // Gán thuộc tính "gateHint": chuỗi "入口二维码链接打开次数，每个会话每天计一次；不代表票数或人数。".
  "gateHint": "入口二维码链接打开次数，每个会话每天计一次；不代表票数或人数。",
  // Gán thuộc tính "gateError": chuỗi "无法加载二维码统计。".
  "gateError": "无法加载二维码统计。",

  "confirmDelete": "从共享管理和游客数据中永久删除此景点？草稿和公开内容将被删除，无法撤销。",
  // Gán thuộc tính "delete": chuỗi "永久删除".
  "delete": "永久删除",
  // Gán thuộc tính "clearFile": chuỗi "移除文件".
  "clearFile": "移除文件",
  // Gán thuộc tính "localFile": chuỗi "已选本地文件".
  "localFile": "已选本地文件",
  // Gán thuộc tính "mediaError": chuỗi "文件无效或超过1MB。选择图片或音频支持格式。".
  "mediaError": "文件无效或超过1MB。选择图片或音频支持格式。",
  // File được lưu thành byte SQL sau khi người dùng xác nhận Lưu.
  "fileHint": "每个文件最大 1 MB；点击保存后存入 SQL Server。",
  // Gán thuộc tính "pickAudio": chuỗi "选择本地录音".
  "pickAudio": "选择本地录音",
  // Gán thuộc tính "pickImage": chuỗi "选择本地图片".
  "pickImage": "选择本地图片",
  // Gán thuộc tính "confirm": chuỗi "确认".
  "confirm": "确认",
  // Gán thuộc tính "previewError": chuỗi "无法试听，请检查来源后重试。".
  "previewError": "无法试听，请检查来源后重试。",
  // Gán thuộc tính "simListening": chuỗi "模拟收听游客".
  "simListening": "模拟收听游客",
  // Gán thuộc tính "overviewHint": chuỗi "查看使用情况并管理景点内容。".
  "overviewHint": "查看使用情况并管理景点内容。",
  // Gán thuộc tính "quickActions": chuỗi "快捷操作".
  "quickActions": "快捷操作",
  // Gán thuộc tính "managePlacesHint": chuỗi "更新信息、图片和讲解。".
  "managePlacesHint": "更新信息、图片和讲解。",
  // Gán thuộc tính "reviewQueueHint": chuỗi "审核并发布已批准的内容。".
  "reviewQueueHint": "审核并发布已批准的内容。",
  // Gán thuộc tính "catalogHint": chuỗi "管理景点目录和讲解内容。".
  "catalogHint": "管理景点目录和讲解内容。",
  // Gán thuộc tính "basicInfo": chuỗi "景点信息".
  "basicInfo": "景点信息",
  // Gán thuộc tính "locationSection": chuỗi "位置与坐标".
  "locationSection": "位置与坐标",
  // Gán thuộc tính "mediaSection": chuỗi "图片与资料".
  "mediaSection": "图片与资料",
  // Gán thuộc tính "workflowSection": chuỗi "保存与版本管理".
  "workflowSection": "保存与版本管理",
  // Gán thuộc tính "resetHint": chuỗi "需要重新开始时恢复示例数据。".
  "resetHint": "需要重新开始时恢复示例数据。",
  // Gán thuộc tính "editorHint": chuỗi "按语言编辑内容。".
  "editorHint": "按语言编辑内容。",
  // Gán thuộc tính "clearSearch": chuỗi "清除关键词".
  "clearSearch": "清除关键词",
  // Gán thuộc tính "admin": chuỗi "管理".
  "admin": "管理",
  // Gán thuộc tính "dashboard": chuỗi "概览".
  "dashboard": "概览",
  // Gán thuộc tính "places": chuỗi "景点".
  "places": "景点",
  // Gán thuộc tính "reviews": chuỗi "审核".
  "reviews": "审核",
  // Gán thuộc tính "qr": chuỗi "入口二维码".
  "qr": "入口二维码",
  // Gán thuộc tính "visitor": chuỗi "游客页面".
  "visitor": "游客页面",

  // Nội dung mô tả SQL Server dùng chung, giữ cùng khóa dịch cho web/mobile.
  "demo": "共享数据保存在 SQL Server 中；重启 API 不会丢失已保存内容。",
  // Gán thuộc tính "mockMedia": chuỗi "MP3朗读已保存的正文。自动翻译仍为模拟，请在发布前录入核对后的译文。".
  "mockMedia": "MP3朗读已保存的正文。自动翻译仍为模拟，请在发布前录入核对后的译文。",
  // Gán thuộc tính "loading": chuỗi "加载中…".
  "loading": "加载中…",
  // Gán thuộc tính "save": chuỗi "保存草稿".
  "save": "保存草稿",
  // Gán thuộc tính "saved": chuỗi "操作成功".
  "saved": "操作成功",
  // Gán thuộc tính "new": chuỗi "添加景点".
  "new": "添加景点",
  // Gán thuộc tính "edit": chuỗi "信息".
  "edit": "信息",
  // Gán thuộc tính "content": chuỗi "编辑内容".
  "content": "编辑内容",
  // Gán thuộc tính "search": chuỗi "搜索景点…".
  "search": "搜索景点…",
  // Gán thuộc tính "title": chuỗi "正式名称".
  "title": "正式名称",
  // Gán thuộc tính "period": chuỗi "历史时期".
  "period": "历史时期",
  // Gán thuộc tính "category": chuỗi "类别".
  "category": "类别",
  // Gán thuộc tính "lat": chuỗi "纬度".
  "lat": "纬度",
  // Gán thuộc tính "lng": chuỗi "经度".
  "lng": "经度",
  // Gán thuộc tính "verified": chuỗi "坐标已核实".
  "verified": "坐标已核实",
  // Gán thuộc tính "images": chuỗi "图片：每行一个URL或photo:ID".
  "images": "图片：每行一个URL或photo:ID",
  // Gán thuộc tính "summary": chuỗi "简介".
  "summary": "简介",
  // Gán thuộc tính "address": chuỗi "地址".
  "address": "地址",
  // Gán thuộc tính "body": chuỗi "讲解文稿".
  "body": "讲解文稿",
  // Gán thuộc tính "audio": chuỗi "已托管MP3录音URL".
  "audio": "已托管MP3录音URL",
  // Gán thuộc tính "preview": chuỗi "试听".
  "preview": "试听",
  // Gán thuộc tính "prepare": chuỗi "根据已保存正文生成语音".
  "prepare": "根据已保存正文生成语音",
  // Gán thuộc tính "translate": chuỗi "从越南语模拟翻译".
  "translate": "从越南语模拟翻译",
  // Gán thuộc tính "submit": chuỗi "提交审核".
  "submit": "提交审核",
  // Gán thuộc tính "approve": chuỗi "批准版本".
  "approve": "批准版本",
  // Gán thuộc tính "reject": chuỗi "要求修改".
  "reject": "要求修改",
  // Gán thuộc tính "note": chuỗi "审核备注".
  "note": "审核备注",
  // Gán thuộc tính "publish": chuỗi "发布版本".
  "publish": "发布版本",
  // Gán thuộc tính "confirmPublish": chuỗi "向当前设备游客视图发布此版本？".
  "confirmPublish": "向当前设备游客视图发布此版本？",
  // Gán thuộc tính "archive": chuỗi "归档景点".
  "archive": "归档景点",
  // Gán thuộc tính "confirmArchive": chuỗi "归档会从示例公开目录移除景点。继续？".
  "confirmArchive": "归档会从示例公开目录移除景点。继续？",
  // Gán thuộc tính "reset": chuỗi "重置示例数据".
  "reset": "重置示例数据",
  // Gán thuộc tính "confirmReset": chuỗi "清除本地修改并恢复示例数据？".
  "confirmReset": "清除本地修改并恢复示例数据？",
  // Gán thuộc tính "cancel": chuỗi "取消".
  "cancel": "取消",
  // Gán thuộc tính "unsaved": chuỗi "有未保存修改，离开？".
  "unsaved": "有未保存修改，离开？",
  // Gán thuộc tính "active": chuỗi "活跃会话".
  "active": "活跃会话",
  // Gán thuộc tính "web": chuỗi "网页".
  "web": "网页",
  // Gán thuộc tính "mobile": chuỗi "移动应用".
  "mobile": "移动应用",
  // Gán thuộc tính "listening": chuỗi "正在收听".
  "listening": "正在收听",
  // Gán thuộc tính "gateToday": chuỗi "今日入口次数".
  "gateToday": "今日入口次数",
  // Gán thuộc tính "simWeb": chuỗi "模拟网页游客".
  "simWeb": "模拟网页游客",
  // Gán thuộc tính "simMobile": chuỗi "模拟应用游客".
  "simMobile": "模拟应用游客",
  // Gán thuộc tính "endSessions": chuỗi "结束示例会话".
  "endSessions": "结束示例会话",

  // Nội dung mô tả SQL Server dùng chung, giữ cùng khóa dịch cho web/mobile.
  "analyticsHint": "匿名会话保存在 SQL Server 中，90 秒未发送心跳即过期。会话数不等于人数或票数。",

  // Nội dung mô tả SQL Server dùng chung, giữ cùng khóa dịch cho web/mobile.
  "presenceError": "无法读取统计，请检查 API 和 SQL Server 连接。",
  // Gán thuộc tính "empty": chuỗi "暂无匹配数据".
  "empty": "暂无匹配数据",
  // Gán thuộc tính "revision": chuỗi "修订".
  "revision": "修订",
  // Gán thuộc tính "current": chuỗi "当前公开版本".
  "current": "当前公开版本",
  // Gán thuộc tính "none": chuỗi "暂无".
  "none": "暂无",
  // Gán thuộc tính "status_draft": chuỗi "草稿".
  "status_draft": "草稿",
  // Gán thuộc tính "status_submitted": chuỗi "待审核".
  "status_submitted": "待审核",
  // Gán thuộc tính "status_changes": chuỗi "需修改".
  "status_changes": "需修改",
  // Gán thuộc tính "status_approved": chuỗi "已批准".
  "status_approved": "已批准",
  // Gán thuộc tính "status_published": chuỗi "已发布".
  "status_published": "已发布",
  // Gán thuộc tính "status_archived": chuỗi "已归档".
  "status_archived": "已归档",
  // Gán thuộc tính "error_loadError": chuỗi "无法连接管理数据。请检查连接后重试。".
  "error_loadError": "无法连接管理数据。请检查连接后重试。",
  // Gán thuộc tính "error_saveError": chuỗi "保存失败，公开版本未改变。".
  "error_saveError": "保存失败，公开版本未改变。",
  // Gán thuộc tính "error_invalid": chuỗi "请检查必填项、顺化坐标和HTTP(S)链接。".
  "error_invalid": "请检查必填项、顺化坐标和HTTP(S)链接。",
  // Gán thuộc tính "error_conflict": chuỗi "版本已变，请刷新后继续。".
  "error_conflict": "版本已变，请刷新后继续。",
  // Gán thuộc tính "error_notFound": chuỗi "未找到景点".
  "error_notFound": "未找到景点",
  // Gán thuộc tính "error_notApproved": chuỗi "只能发布未再修改的已批准版本。".
  "error_notApproved": "只能发布未再修改的已批准版本。",
  // Gán thuộc tính "error_incomplete": chuỗi "需要图片、越南语内容及已输入语言的音频。".
  "error_incomplete": "需要图片、越南语内容及已输入语言的音频。",
  // Gán thuộc tính "error_staleJob": chuỗi "任务结果已过期，请重试。".
  "error_staleJob": "任务结果已过期，请重试。",
  // Gán thuộc tính "retry": chuỗi "重试".
  "retry": "重试",
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `"stop": "停止试听"`: Gán thuộc tính "stop": chuỗi "停止试听".
   * DÒNG `} as const`: Khai báo cn: tạo object gồm "previewSeek", "previewVolume", "previewMore", "previewRate", "previewPause", "previewResume", "gateHint", "gateError", "confirmDelete".
   */
  "stop": "停止试听"
} as const
// Khai báo pt: tạo object gồm "previewSeek", "previewVolume", "previewMore", "previewRate", "previewPause", "previewResume", "gateHint", "gateError", "confirmDelete".
const pt = {
  // Gán thuộc tính "previewSeek": chuỗi "Avançar na pré-escuta".
  "previewSeek": "Avançar na pré-escuta",
  // Gán thuộc tính "previewVolume": chuỗi "Volume".
  "previewVolume": "Volume",
  // Gán thuộc tính "previewMore": chuỗi "Opções de pré-escuta".
  "previewMore": "Opções de pré-escuta",
  // Gán thuộc tính "previewRate": chuỗi "Velocidade".
  "previewRate": "Velocidade",
  // Gán thuộc tính "previewPause": chuỗi "Pausar".
  "previewPause": "Pausar",
  // Gán thuộc tính "previewResume": chuỗi "Continuar".
  "previewResume": "Continuar",
  // Gán thuộc tính "gateHint": chuỗi "Aberturas do link QR de entrada, uma por sessão/dia.
  "gateHint": "Aberturas do link QR de entrada, uma por sessão/dia; não são bilhetes nem pessoas.",
  // Gán thuộc tính "gateError": chuỗi "Estatísticas QR indisponíveis.".
  "gateError": "Estatísticas QR indisponíveis.",

  "confirmDelete": "Eliminar este local dos dados partilhados de gestão e visitantes? O rascunho e a versão pública serão removidos. Não há botão para desfazer.",
  // Gán thuộc tính "delete": chuỗi "Eliminar permanentemente".
  "delete": "Eliminar permanentemente",
  // Gán thuộc tính "clearFile": chuỗi "Remover ficheiro".
  "clearFile": "Remover ficheiro",
  // Gán thuộc tính "localFile": chuỗi "Ficheiro local escolhido".
  "localFile": "Ficheiro local escolhido",
  // Gán thuộc tính "mediaError": chuỗi "Ficheiro inválido ou superior a 1 MB. Use imagem/áudio suportado.".
  "mediaError": "Ficheiro inválido ou superior a 1 MB. Use imagem/áudio suportado.",
  // File được lưu thành byte SQL sau khi người dùng xác nhận Lưu.
  "fileHint": "Até 1 MB por ficheiro; Guardar grava o ficheiro no SQL Server.",
  // Gán thuộc tính "pickAudio": chuỗi "Escolher gravação local".
  "pickAudio": "Escolher gravação local",
  // Gán thuộc tính "pickImage": chuỗi "Escolher imagem local".
  "pickImage": "Escolher imagem local",
  // Gán thuộc tính "confirm": chuỗi "Confirmar".
  "confirm": "Confirmar",
  // Gán thuộc tính "previewError": chuỗi "Prévia indisponível. Verifique a origem e repita.".
  "previewError": "Prévia indisponível. Verifique a origem e repita.",
  // Gán thuộc tính "simListening": chuỗi "Simular visitante a ouvir".
  "simListening": "Simular visitante a ouvir",
  // Gán thuộc tính "overviewHint": chuỗi "Acompanhe a atividade e gira conteúdos do património.".
  "overviewHint": "Acompanhe a atividade e gira conteúdos do património.",
  // Gán thuộc tính "quickActions": chuỗi "Ações rápidas".
  "quickActions": "Ações rápidas",
  // Gán thuộc tính "managePlacesHint": chuỗi "Atualize informações, fotografias e narrações.".
  "managePlacesHint": "Atualize informações, fotografias e narrações.",
  // Gán thuộc tính "reviewQueueHint": chuỗi "Reveja e publique conteúdos aprovados.".
  "reviewQueueHint": "Reveja e publique conteúdos aprovados.",
  // Gán thuộc tính "catalogHint": chuỗi "Gira locais e conteúdos de narração.".
  "catalogHint": "Gira locais e conteúdos de narração.",
  // Gán thuộc tính "basicInfo": chuỗi "Informação do local".
  "basicInfo": "Informação do local",
  // Gán thuộc tính "locationSection": chuỗi "Localização e coordenadas".
  "locationSection": "Localização e coordenadas",
  // Gán thuộc tính "mediaSection": chuỗi "Fotografias e materiais".
  "mediaSection": "Fotografias e materiais",
  // Gán thuộc tính "workflowSection": chuỗi "Guardar e gerir versões".
  "workflowSection": "Guardar e gerir versões",
  // Gán thuộc tính "resetHint": chuỗi "Reponha os dados de exemplo para recomeçar.".
  "resetHint": "Reponha os dados de exemplo para recomeçar.",
  // Gán thuộc tính "editorHint": chuỗi "Edite conteúdos em cada idioma.".
  "editorHint": "Edite conteúdos em cada idioma.",
  // Gán thuộc tính "clearSearch": chuỗi "Limpar pesquisa".
  "clearSearch": "Limpar pesquisa",
  // Gán thuộc tính "admin": chuỗi "Gestão".
  "admin": "Gestão",
  // Gán thuộc tính "dashboard": chuỗi "Visão geral".
  "dashboard": "Visão geral",
  // Gán thuộc tính "places": chuỗi "Locais".
  "places": "Locais",
  // Gán thuộc tính "reviews": chuỗi "Revisão".
  "reviews": "Revisão",
  // Gán thuộc tính "qr": chuỗi "QR da entrada".
  "qr": "QR da entrada",
  // Gán thuộc tính "visitor": chuỗi "Vista visitante".
  "visitor": "Vista visitante",

  // Nội dung mô tả SQL Server dùng chung, giữ cùng khóa dịch cho web/mobile.
  "demo": "Os dados partilhados são guardados no SQL Server; reiniciar a API mantém o conteúdo guardado.",
  // Gán thuộc tính "mockMedia": chuỗi "O MP3 lê o texto guardado. A tradução automática continua simulada.
  "mockMedia": "O MP3 lê o texto guardado. A tradução automática continua simulada; introduza traduções verificadas antes de publicar.",
  // Gán thuộc tính "loading": chuỗi "A carregar…".
  "loading": "A carregar…",
  // Gán thuộc tính "save": chuỗi "Guardar rascunho".
  "save": "Guardar rascunho",
  // Gán thuộc tính "saved": chuỗi "Operação concluída".
  "saved": "Operação concluída",
  // Gán thuộc tính "new": chuỗi "Adicionar local".
  "new": "Adicionar local",
  // Gán thuộc tính "edit": chuỗi "Informação".
  "edit": "Informação",
  // Gán thuộc tính "content": chuỗi "Editar conteúdo".
  "content": "Editar conteúdo",
  // Gán thuộc tính "search": chuỗi "Pesquisar locais…".
  "search": "Pesquisar locais…",
  // Gán thuộc tính "title": chuỗi "Nome oficial".
  "title": "Nome oficial",
  // Gán thuộc tính "period": chuỗi "Período histórico".
  "period": "Período histórico",
  // Gán thuộc tính "category": chuỗi "Categoria".
  "category": "Categoria",
  // Gán thuộc tính "lat": chuỗi "Latitude".
  "lat": "Latitude",
  // Gán thuộc tính "lng": chuỗi "Longitude".
  "lng": "Longitude",
  // Gán thuộc tính "verified": chuỗi "Coordenadas verificadas".
  "verified": "Coordenadas verificadas",
  // Gán thuộc tính "images": chuỗi "Imagens: um URL ou photo:ID por linha".
  "images": "Imagens: um URL ou photo:ID por linha",
  // Gán thuộc tính "summary": chuỗi "Resumo".
  "summary": "Resumo",
  // Gán thuộc tính "address": chuỗi "Morada".
  "address": "Morada",
  // Gán thuộc tính "body": chuỗi "Texto da narração".
  "body": "Texto da narração",
  // Gán thuộc tính "audio": chuỗi "URL MP3 alojado".
  "audio": "URL MP3 alojado",
  // Gán thuộc tính "preview": chuỗi "Ouvir prévia".
  "preview": "Ouvir prévia",
  // Gán thuộc tính "prepare": chuỗi "Gerar voz do texto guardado".
  "prepare": "Gerar voz do texto guardado",
  // Gán thuộc tính "translate": chuỗi "Tradução simulada do vietnamita".
  "translate": "Tradução simulada do vietnamita",
  // Gán thuộc tính "submit": chuỗi "Enviar para revisão".
  "submit": "Enviar para revisão",
  // Gán thuộc tính "approve": chuỗi "Aprovar versão".
  "approve": "Aprovar versão",
  // Gán thuộc tính "reject": chuỗi "Pedir alterações".
  "reject": "Pedir alterações",
  // Gán thuộc tính "note": chuỗi "Nota de revisão".
  "note": "Nota de revisão",
  // Gán thuộc tính "publish": chuỗi "Publicar versão".
  "publish": "Publicar versão",
  // Gán thuộc tính "confirmPublish": chuỗi "Publicar esta versão para visitantes neste dispositivo?".
  "confirmPublish": "Publicar esta versão para visitantes neste dispositivo?",
  // Gán thuộc tính "archive": chuỗi "Arquivar local".
  "archive": "Arquivar local",
  // Gán thuộc tính "confirmArchive": chuỗi "Arquivar remove o local do catálogo. Continuar?".
  "confirmArchive": "Arquivar remove o local do catálogo. Continuar?",
  // Gán thuộc tính "reset": chuỗi "Repor exemplo".
  "reset": "Repor exemplo",
  // Gán thuộc tính "confirmReset": chuỗi "Eliminar alterações locais e repor dados de exemplo?".
  "confirmReset": "Eliminar alterações locais e repor dados de exemplo?",
  // Gán thuộc tính "cancel": chuỗi "Cancelar".
  "cancel": "Cancelar",
  // Gán thuộc tính "unsaved": chuỗi "Alterações por guardar. Sair?".
  "unsaved": "Alterações por guardar. Sair?",
  // Gán thuộc tính "active": chuỗi "Sessões ativas".
  "active": "Sessões ativas",
  // Gán thuộc tính "web": chuỗi "Web".
  "web": "Web",
  // Gán thuộc tính "mobile": chuỗi "Aplicação móvel".
  "mobile": "Aplicação móvel",
  // Gán thuộc tính "listening": chuỗi "A ouvir".
  "listening": "A ouvir",
  // Gán thuộc tính "gateToday": chuỗi "Entradas QR hoje".
  "gateToday": "Entradas QR hoje",
  // Gán thuộc tính "simWeb": chuỗi "Simular visitante Web".
  "simWeb": "Simular visitante Web",
  // Gán thuộc tính "simMobile": chuỗi "Simular visitante App".
  "simMobile": "Simular visitante App",
  // Gán thuộc tính "endSessions": chuỗi "Terminar sessões simuladas".
  "endSessions": "Terminar sessões simuladas",

  // Nội dung mô tả SQL Server dùng chung, giữ cùng khóa dịch cho web/mobile.
  "analyticsHint": "As sessões anónimas são guardadas no SQL Server e expiram após 90 segundos sem sinal. Sessões não são pessoas nem bilhetes.",

  // Nội dung mô tả SQL Server dùng chung, giữ cùng khóa dịch cho web/mobile.
  "presenceError": "Estatísticas indisponíveis. Verifique a API e a ligação ao SQL Server.",
  // Gán thuộc tính "empty": chuỗi "Sem dados correspondentes".
  "empty": "Sem dados correspondentes",
  // Gán thuộc tính "revision": chuỗi "Revisão".
  "revision": "Revisão",
  // Gán thuộc tính "current": chuỗi "Versão publicada atual".
  "current": "Versão publicada atual",
  // Gán thuộc tính "none": chuỗi "Nenhum".
  "none": "Nenhum",
  // Gán thuộc tính "status_draft": chuỗi "Rascunho".
  "status_draft": "Rascunho",
  // Gán thuộc tính "status_submitted": chuỗi "Em revisão".
  "status_submitted": "Em revisão",
  // Gán thuộc tính "status_changes": chuỗi "Alterações pedidas".
  "status_changes": "Alterações pedidas",
  // Gán thuộc tính "status_approved": chuỗi "Aprovado".
  "status_approved": "Aprovado",
  // Gán thuộc tính "status_published": chuỗi "Publicado".
  "status_published": "Publicado",
  // Gán thuộc tính "status_archived": chuỗi "Arquivado".
  "status_archived": "Arquivado",
  // Gán thuộc tính "error_loadError": chuỗi "Não foi possível ligar aos dados de gestão. Verifique a ligação e tente novamente.".
  "error_loadError": "Não foi possível ligar aos dados de gestão. Verifique a ligação e tente novamente.",
  // Gán thuộc tính "error_saveError": chuỗi "Falha ao guardar. Versão pública mantida.".
  "error_saveError": "Falha ao guardar. Versão pública mantida.",
  // Gán thuộc tính "error_invalid": chuỗi "Verifique campos, coordenadas e URL HTTP(S).".
  "error_invalid": "Verifique campos, coordenadas e URL HTTP(S).",
  // Gán thuộc tính "error_conflict": chuỗi "Versão alterada. Recarregue antes de continuar.".
  "error_conflict": "Versão alterada. Recarregue antes de continuar.",
  // Gán thuộc tính "error_notFound": chuỗi "Local não encontrado".
  "error_notFound": "Local não encontrado",
  // Gán thuộc tính "error_notApproved": chuỗi "Publique apenas a revisão aprovada sem alterações.".
  "error_notApproved": "Publique apenas a revisão aprovada sem alterações.",
  // Gán thuộc tính "error_incomplete": chuỗi "É necessária imagem, texto vietnamita e áudio nos idiomas preenchidos.".
  "error_incomplete": "É necessária imagem, texto vietnamita e áudio nos idiomas preenchidos.",
  // Gán thuộc tính "error_staleJob": chuỗi "Resultado desatualizado. Repita.".
  "error_staleJob": "Resultado desatualizado. Repita.",
  // Gán thuộc tính "retry": chuỗi "Repetir".
  "retry": "Repetir",
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `"stop": "Parar prévia"`: Gán thuộc tính "stop": chuỗi "Parar prévia".
   * DÒNG `} as const`: Khai báo pt: tạo object gồm "previewSeek", "previewVolume", "previewMore", "previewRate", "previewPause", "previewResume", "gateHint", "gateError", "confirmDelete".
   */
  "stop": "Parar prévia"
} as const
// Khai báo ja: tạo object gồm "previewSeek", "previewVolume", "previewMore", "previewRate", "previewPause", "previewResume", "gateHint", "gateError", "confirmDelete".
const ja = {
  // Gán thuộc tính "previewSeek": chuỗi "試聴位置を移動".
  "previewSeek": "試聴位置を移動",
  // Gán thuộc tính "previewVolume": chuỗi "音量".
  "previewVolume": "音量",
  // Gán thuộc tính "previewMore": chuỗi "試聴オプション".
  "previewMore": "試聴オプション",
  // Gán thuộc tính "previewRate": chuỗi "再生速度".
  "previewRate": "再生速度",
  // Gán thuộc tính "previewPause": chuỗi "一時停止".
  "previewPause": "一時停止",
  // Gán thuộc tính "previewResume": chuỗi "再開".
  "previewResume": "再開",
  // Gán thuộc tính "gateHint": chuỗi "入口QRリンクを開いた回数。同じセッションは1日1回で、人数や入場券数ではありません。".
  "gateHint": "入口QRリンクを開いた回数。同じセッションは1日1回で、人数や入場券数ではありません。",
  // Gán thuộc tính "gateError": chuỗi "QR統計を取得できません。".
  "gateError": "QR統計を取得できません。",

  "confirmDelete": "この史跡を共有された管理・来訪者データから完全に削除しますか？下書きと公開版が削除され、元に戻すボタンはありません。",
  // Gán thuộc tính "delete": chuỗi "完全に削除".
  "delete": "完全に削除",
  // Gán thuộc tính "clearFile": chuỗi "選択ファイルを外す".
  "clearFile": "選択ファイルを外す",
  // Gán thuộc tính "localFile": chuỗi "ローカルファイル選択済み".
  "localFile": "ローカルファイル選択済み",
  // Gán thuộc tính "mediaError": chuỗi "無効または1MB超過。対応する画像・音声を選んでください。".
  "mediaError": "無効または1MB超過。対応する画像・音声を選んでください。",
  // File được lưu thành byte SQL sau khi người dùng xác nhận Lưu.
  "fileHint": "1ファイル1MBまで。保存すると SQL Server に格納されます。",
  // Gán thuộc tính "pickAudio": chuỗi "端末の録音を選択".
  "pickAudio": "端末の録音を選択",
  // Gán thuộc tính "pickImage": chuỗi "端末の画像を選択".
  "pickImage": "端末の画像を選択",
  // Gán thuộc tính "confirm": chuỗi "確認".
  "confirm": "確認",
  // Gán thuộc tính "previewError": chuỗi "試聴できません。音源を確認して再試行してください。".
  "previewError": "試聴できません。音源を確認して再試行してください。",
  // Gán thuộc tính "simListening": chuỗi "再生中の利用者を追加".
  "simListening": "再生中の利用者を追加",
  // Gán thuộc tính "overviewHint": chuỗi "利用状況を確認し、史跡のコンテンツを管理します。".
  "overviewHint": "利用状況を確認し、史跡のコンテンツを管理します。",
  // Gán thuộc tính "quickActions": chuỗi "クイック操作".
  "quickActions": "クイック操作",
  // Gán thuộc tính "managePlacesHint": chuỗi "情報、写真、音声ガイドを更新します。".
  "managePlacesHint": "情報、写真、音声ガイドを更新します。",
  // Gán thuộc tính "reviewQueueHint": chuỗi "内容を確認して承認済みの版を公開します。".
  "reviewQueueHint": "内容を確認して承認済みの版を公開します。",
  // Gán thuộc tính "catalogHint": chuỗi "スポットと音声ガイドを管理します。".
  "catalogHint": "スポットと音声ガイドを管理します。",
  // Gán thuộc tính "basicInfo": chuỗi "スポット情報".
  "basicInfo": "スポット情報",
  // Gán thuộc tính "locationSection": chuỗi "場所と座標".
  "locationSection": "場所と座標",
  // Gán thuộc tính "mediaSection": chuỗi "写真と資料".
  "mediaSection": "写真と資料",
  // Gán thuộc tính "workflowSection": chuỗi "保存とバージョン管理".
  "workflowSection": "保存とバージョン管理",
  // Gán thuộc tính "resetHint": chuỗi "最初から始める場合にサンプルデータを復元します。".
  "resetHint": "最初から始める場合にサンプルデータを復元します。",
  // Gán thuộc tính "editorHint": chuỗi "言語ごとにコンテンツを編集します。".
  "editorHint": "言語ごとにコンテンツを編集します。",
  // Gán thuộc tính "clearSearch": chuỗi "検索語を消去".
  "clearSearch": "検索語を消去",
  // Gán thuộc tính "admin": chuỗi "管理".
  "admin": "管理",
  // Gán thuộc tính "dashboard": chuỗi "概要".
  "dashboard": "概要",
  // Gán thuộc tính "places": chuỗi "史跡".
  "places": "史跡",
  // Gán thuộc tính "reviews": chuỗi "審査".
  "reviews": "審査",
  // Gán thuộc tính "qr": chuỗi "入口QR".
  "qr": "入口QR",
  // Gán thuộc tính "visitor": chuỗi "来訪者画面".
  "visitor": "来訪者画面",

  // Nội dung mô tả SQL Server dùng chung, giữ cùng khóa dịch cho web/mobile.
  "demo": "共有データは SQL Server に保存されます。API を再起動しても保存済みの内容は失われません。",
  // Gán thuộc tính "mockMedia": chuỗi "MP3は保存済み本文を読み上げます。自動翻訳は模擬のため、公開前に確認済みの訳文を入力してください。".
  "mockMedia": "MP3は保存済み本文を読み上げます。自動翻訳は模擬のため、公開前に確認済みの訳文を入力してください。",
  // Gán thuộc tính "loading": chuỗi "読込中…".
  "loading": "読込中…",
  // Gán thuộc tính "save": chuỗi "下書き保存".
  "save": "下書き保存",
  // Gán thuộc tính "saved": chuỗi "処理完了".
  "saved": "処理完了",
  // Gán thuộc tính "new": chuỗi "史跡を追加".
  "new": "史跡を追加",
  // Gán thuộc tính "edit": chuỗi "情報".
  "edit": "情報",
  // Gán thuộc tính "content": chuỗi "内容編集".
  "content": "内容編集",
  // Gán thuộc tính "search": chuỗi "史跡を検索…".
  "search": "史跡を検索…",
  // Gán thuộc tính "title": chuỗi "正式名称".
  "title": "正式名称",
  // Gán thuộc tính "period": chuỗi "歴史的時代".
  "period": "歴史的時代",
  // Gán thuộc tính "category": chuỗi "分類".
  "category": "分類",
  // Gán thuộc tính "lat": chuỗi "緯度".
  "lat": "緯度",
  // Gán thuộc tính "lng": chuỗi "経度".
  "lng": "経度",
  // Gán thuộc tính "verified": chuỗi "座標確認済み".
  "verified": "座標確認済み",
  // Gán thuộc tính "images": chuỗi "画像：1行にURLまたはphoto:ID".
  "images": "画像：1行にURLまたはphoto:ID",
  // Gán thuộc tính "summary": chuỗi "概要文".
  "summary": "概要文",
  // Gán thuộc tính "address": chuỗi "住所".
  "address": "住所",
  // Gán thuộc tính "body": chuỗi "解説文".
  "body": "解説文",
  // Gán thuộc tính "audio": chuỗi "サーバー上のMP3 URL".
  "audio": "サーバー上のMP3 URL",
  // Gán thuộc tính "preview": chuỗi "試聴".
  "preview": "試聴",
  // Gán thuộc tính "prepare": chuỗi "保存済み本文から音声を生成".
  "prepare": "保存済み本文から音声を生成",
  // Gán thuộc tính "translate": chuỗi "ベトナム語から模擬翻訳".
  "translate": "ベトナム語から模擬翻訳",
  // Gán thuộc tính "submit": chuỗi "審査に送信".
  "submit": "審査に送信",
  // Gán thuộc tính "approve": chuỗi "版を承認".
  "approve": "版を承認",
  // Gán thuộc tính "reject": chuỗi "修正依頼".
  "reject": "修正依頼",
  // Gán thuộc tính "note": chuỗi "審査メモ".
  "note": "審査メモ",
  // Gán thuộc tính "publish": chuỗi "版を公開".
  "publish": "版を公開",
  // Gán thuộc tính "confirmPublish": chuỗi "この端末の来訪者画面に公開しますか？".
  "confirmPublish": "この端末の来訪者画面に公開しますか？",
  // Gán thuộc tính "archive": chuỗi "史跡をアーカイブ".
  "archive": "史跡をアーカイブ",
  // Gán thuộc tính "confirmArchive": chuỗi "サンプル公開一覧から除きます。続けますか？".
  "confirmArchive": "サンプル公開一覧から除きます。続けますか？",
  // Gán thuộc tính "reset": chuỗi "サンプルデータをリセット".
  "reset": "サンプルデータをリセット",
  // Gán thuộc tính "confirmReset": chuỗi "ローカル変更を破棄しサンプルに戻しますか？".
  "confirmReset": "ローカル変更を破棄しサンプルに戻しますか？",
  // Gán thuộc tính "cancel": chuỗi "取消".
  "cancel": "取消",
  // Gán thuộc tính "unsaved": chuỗi "未保存の変更があります。移動しますか？".
  "unsaved": "未保存の変更があります。移動しますか？",
  // Gán thuộc tính "active": chuỗi "アクティブセッション".
  "active": "アクティブセッション",
  // Gán thuộc tính "web": chuỗi "Web".
  "web": "Web",
  // Gán thuộc tính "mobile": chuỗi "モバイルアプリ".
  "mobile": "モバイルアプリ",
  // Gán thuộc tính "listening": chuỗi "再生中".
  "listening": "再生中",
  // Gán thuộc tính "gateToday": chuỗi "本日のQR入場".
  "gateToday": "本日のQR入場",
  // Gán thuộc tính "simWeb": chuỗi "Web利用者を追加".
  "simWeb": "Web利用者を追加",
  // Gán thuộc tính "simMobile": chuỗi "アプリ利用者を追加".
  "simMobile": "アプリ利用者を追加",
  // Gán thuộc tính "endSessions": chuỗi "サンプルセッション終了".
  "endSessions": "サンプルセッション終了",

  // Nội dung mô tả SQL Server dùng chung, giữ cùng khóa dịch cho web/mobile.
  "analyticsHint": "匿名セッションは SQL Server に保存され、90秒間通知がないと期限切れになります。人数やチケット数ではありません。",

  // Nội dung mô tả SQL Server dùng chung, giữ cùng khóa dịch cho web/mobile.
  "presenceError": "統計を取得できません。API と SQL Server の接続を確認してください。",
  // Gán thuộc tính "empty": chuỗi "該当データなし".
  "empty": "該当データなし",
  // Gán thuộc tính "revision": chuỗi "改訂".
  "revision": "改訂",
  // Gán thuộc tính "current": chuỗi "現在の公開版".
  "current": "現在の公開版",
  // Gán thuộc tính "none": chuỗi "なし".
  "none": "なし",
  // Gán thuộc tính "status_draft": chuỗi "下書き".
  "status_draft": "下書き",
  // Gán thuộc tính "status_submitted": chuỗi "審査待ち".
  "status_submitted": "審査待ち",
  // Gán thuộc tính "status_changes": chuỗi "要修正".
  "status_changes": "要修正",
  // Gán thuộc tính "status_approved": chuỗi "承認済み".
  "status_approved": "承認済み",
  // Gán thuộc tính "status_published": chuỗi "公開済み".
  "status_published": "公開済み",
  // Gán thuộc tính "status_archived": chuỗi "アーカイブ済み".
  "status_archived": "アーカイブ済み",
  // Gán thuộc tính "error_loadError": chuỗi "管理データに接続できません。接続を確認して再試行してください。".
  "error_loadError": "管理データに接続できません。接続を確認して再試行してください。",
  // Gán thuộc tính "error_saveError": chuỗi "保存失敗。公開版は変更されません。".
  "error_saveError": "保存失敗。公開版は変更されません。",
  // Gán thuộc tính "error_invalid": chuỗi "必須項目・フエの座標・HTTP(S) URLを確認してください。".
  "error_invalid": "必須項目・フエの座標・HTTP(S) URLを確認してください。",
  // Gán thuộc tính "error_conflict": chuỗi "版が変更されました。再読込してください。".
  "error_conflict": "版が変更されました。再読込してください。",
  // Gán thuộc tính "error_notFound": chuỗi "史跡が見つかりません".
  "error_notFound": "史跡が見つかりません",
  // Gán thuộc tính "error_notApproved": chuỗi "承認後未変更の版だけ公開できます。".
  "error_notApproved": "承認後未変更の版だけ公開できます。",
  // Gán thuộc tính "error_incomplete": chuỗi "画像・ベトナム語文・入力した言語の音声が必要です。".
  "error_incomplete": "画像・ベトナム語文・入力した言語の音声が必要です。",
  // Gán thuộc tính "error_staleJob": chuỗi "古い処理結果です。再試行してください。".
  "error_staleJob": "古い処理結果です。再試行してください。",
  // Gán thuộc tính "retry": chuỗi "再試行".
  "retry": "再試行",
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `"stop": "試聴停止"`: Gán thuộc tính "stop": chuỗi "試聴停止".
   * DÒNG `} as const`: Khai báo ja: tạo object gồm "previewSeek", "previewVolume", "previewMore", "previewRate", "previewPause", "previewResume", "gateHint", "gateError", "confirmDelete".
   */
  "stop": "試聴停止"
} as const
// Đặt tên kiểu AdminTextKey.
export type AdminTextKey = keyof typeof vi
// Khai báo adminMessages: tạo object gồm vi, en, cn, pt, ja. | Đặt trường vi bằng giá trị của biến cùng tên. | Đặt trường en bằng giá trị của biến cùng tên. | Đặt trường cn bằng giá trị của biến cùng tên. | Đặt trường pt bằng giá trị của biến cùng tên. | Đặt trường ja bằng giá trị của biến cùng tên.
export const adminMessages: Record<Language, Record<AdminTextKey, string>> = { vi, en, cn, pt, ja }
/* CÁCH KIỂM TRA: Đổi đủ năm ngôn ngữ, mọi nhãn Admin đổi cùng lựa chọn du khách. */
