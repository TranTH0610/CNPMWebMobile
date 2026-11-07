/**
 * CHỨC NĂNG: [NGON-NGU]
 * VAI TRÒ: LOGIC / DỮ LIỆU DÙNG CHUNG
 *
 * FILE NÀY LÀM GÌ:
 * Bộ chuỗi giao diện quản trị theo năm ngôn ngữ, dùng qua useAdminText để web/mobile cùng nghĩa và
 *
 * VỊ TRÍ: packages/admin-core/src/i18n/BanDichGiaoDien.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - packages/admin-core/src/react/TrangThaiReact.tsx
 * - packages/admin-core/src/react/useBienTapDiTich.ts
 *
 * PHỤ THUỘC:
 * - @travelguide/visitor-core
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
import type { Language } from '@travelguide/visitor-core'

const vi = {
  // CHỨC NĂNG: Nhãn chọn/xóa ảnh và ảnh đại diện, chung web/mobile.
  coverImage: 'Ảnh đại diện',
  makeCover: 'Đặt làm ảnh đại diện',
  removeImage: 'Xóa ảnh',
  imageNumber: 'Ảnh',

  allReviews: 'Tất cả',
  // CHỨC NĂNG: Phản hồi gửi duyệt và điều hướng xem chi tiết hồ sơ.
  submittedSuccess: 'Đã gửi phê duyệt thành công. Bạn có thể nhập di tích mới.',
  viewReview: 'Xem chi tiết',
  backReviews: 'Quay lại danh sách phê duyệt',

  // CHỨC NĂNG: Nhãn form đầy đủ và phản hồi dịch, dùng chung cho web/mobile.
  draftStorageHint:
    'Bản nháp lưu trong SQL Server, hiển thị trong Di tích với nhãn Bản nháp. Gửi phê duyệt chưa công bố nội dung cho du khách.',
  autoTranslate: 'Tự dịch khi lưu bản Việt',
  translationNotice:
    'Dịch bằng MyMemory: văn bản được gửi tới dịch vụ bên thứ ba, hạn mức miễn phí 5.000 ký tự/ngày. Cần kiểm tra bản dịch trước khi duyệt. Khi sửa bài, hãy tạo lại audio.',
  translating: 'Đang dịch',
  translateAll: 'Dịch 4 ngôn ngữ',
  audioAll: 'Tạo audio còn thiếu',
  confirmTranslate:
    'Dịch lại sẽ thay thế nội dung và bỏ audio cũ của bốn bản dịch. Bạn muốn tiếp tục?',
  error_translationError:
    'Chưa có bản dịch hợp lệ. Hãy thử lại hoặc kiểm tra dịch vụ dịch; bản nháp đã lưu vẫn còn.',

  previewSeek: 'Tua bài nghe thử',

  previewVolume: 'Âm lượng',

  previewMore: 'Tùy chọn nghe thử',

  previewRate: 'Tốc độ',

  previewPause: 'Tạm dừng',

  previewResume: 'Tiếp tục',

  gateHint:
    'Lượt mở liên kết QR vào cổng, mỗi phiên/ngày tính một lần; không phải số vé hay số người.',

  gateError: 'Chưa tải được lượt QR.',

  // Nội dung mô tả SQL Server dùng chung, giữ cùng khóa dịch cho web/mobile.
  confirmDelete:
    'Xóa vĩnh viễn di tích này khỏi Admin và trang du khách trong SQL Server? Bản nháp và bản công khai sẽ bị xóa. Không có nút hoàn tác.',

  delete: 'Xóa vĩnh viễn',

  clearFile: 'Bỏ tệp đã chọn',

  localFile: 'Đã chọn tệp cục bộ',

  mediaError: 'Tệp không hợp lệ hoặc lớn hơn 1 MB. Chọn JPEG/PNG/WebP hoặc MP3/WAV/OGG.',
  // File được lưu thành byte SQL sau khi người dùng xác nhận Lưu.
  fileHint: 'Tối đa 1 MB/tệp.',

  pickAudio: 'Chọn bản thu từ thiết bị',

  pickImage: 'Chọn ảnh từ thiết bị',

  confirm: 'Xác nhận',

  previewError: 'Không phát được bản nghe thử. Kiểm tra nguồn và thử lại.',

  simListening: 'Mô phỏng khách đang nghe',

  overviewHint: 'Theo dõi hoạt động và quản lý nội dung di tích.',

  quickActions: 'Thao tác nhanh',

  managePlacesHint: 'Cập nhật thông tin, hình ảnh và bài thuyết minh.',

  reviewQueueHint: 'Kiểm tra và công bố nội dung đã duyệt.',

  catalogHint: 'Quản lý danh mục và nội dung thuyết minh.',

  basicInfo: 'Thông tin di tích',

  locationSection: 'Vị trí và tọa độ',

  mediaSection: 'Hình ảnh và tư liệu',

  workflowSection: 'Lưu và quản lý phiên bản',

  resetHint: 'Khôi phục dữ liệu mẫu khi cần bắt đầu lại.',

  editorHint: 'Biên tập nội dung theo từng ngôn ngữ.',

  clearSearch: 'Xóa từ khóa',

  admin: 'Quản lý',

  dashboard: 'Tổng quan',

  places: 'Di tích',

  reviews: 'Kiểm duyệt',

  qr: 'QR tại cổng',

  visitor: 'Về trang du khách',

  // Nội dung mô tả SQL Server dùng chung, giữ cùng khóa dịch cho web/mobile.
  demo: 'Dữ liệu được lưu dùng chung trong SQL Server; khởi động lại API không làm mất nội dung đã lưu.',

  mockMedia: 'Audio được tạo từ bài đã lưu. Kiểm tra bản dịch trước khi gửi phê duyệt.',

  loading: 'Đang tải…',

  save: 'Lưu bản nháp',

  saved: 'Thao tác thành công',

  new: 'Thêm di tích',

  edit: 'Thông tin',

  content: 'Biên tập',

  search: 'Tìm di tích…',

  title: 'Tên chính thức',

  period: 'Giai đoạn lịch sử',

  category: 'Danh mục',

  lat: 'Vĩ độ',

  lng: 'Kinh độ',

  verified: 'Tọa độ đã kiểm tra',

  images: 'Ảnh: mỗi dòng một URL hoặc mã photo:ID',

  summary: 'Mô tả ngắn',

  address: 'Địa chỉ',

  body: 'Bài thuyết minh',

  audio: 'URL bản thu MP3 đã lưu trên máy chủ',

  preview: 'Nghe thử',

  prepare: 'Tạo giọng đọc từ bài đã lưu',

  translate: 'Dịch từ bản Việt đã lưu',

  submit: 'Gửi phê duyệt',

  approve: 'Duyệt phiên bản',

  reject: 'Yêu cầu sửa',

  note: 'Ghi chú kiểm duyệt',

  publish: 'Công bố phiên bản',

  confirmPublish: 'Công bố bản này cho giao diện du khách trên thiết bị hiện tại?',

  archive: 'Lưu trữ di tích',

  confirmArchive: 'Lưu trữ sẽ bỏ điểm khỏi danh mục công khai . Tiếp tục?',

  reset: 'Đặt lại dữ liệu mẫu',

  confirmReset: 'Xóa các thay đổi cục bộ và nạp lại dữ liệu mẫu?',

  cancel: 'Hủy',

  unsaved: 'Có thay đổi chưa lưu. Bạn muốn rời biểu mẫu?',

  active: 'Phiên đang hoạt động',

  web: 'Web',

  mobile: 'App Mobile',

  listening: 'Đang nghe',

  gateToday: 'Lượt QR hôm nay',

  simWeb: 'Mô phỏng khách Web',

  simMobile: 'Mô phỏng khách App',

  endSessions: 'Kết thúc phiên mô phỏng',

  // Nội dung mô tả SQL Server dùng chung, giữ cùng khóa dịch cho web/mobile.
  analyticsHint:
    'Phiên ẩn danh được lưu trong SQL Server; hết hoạt động sau 90 giây không gửi tín hiệu. Đây là số phiên, không phải số người/vé.',

  // Nội dung mô tả SQL Server dùng chung, giữ cùng khóa dịch cho web/mobile.
  presenceError: 'Chưa lấy được thống kê. Kiểm tra API và kết nối SQL Server.',

  empty: 'Chưa có dữ liệu phù hợp',

  revision: 'Bản sửa',

  current: 'Bản công khai hiện hành',

  none: 'Chưa có',

  status_draft: 'Bản nháp',

  status_submitted: 'Chờ duyệt',

  status_changes: 'Cần sửa',

  status_approved: 'Đã duyệt',

  status_published: 'Đã công bố',

  status_archived: 'Đã lưu trữ',

  error_loadError: 'Không kết nối được dữ liệu quản lý. Kiểm tra kết nối và thử lại.',

  error_saveError: 'Không lưu được. Bản công khai cũ được giữ nguyên.',

  error_invalid: 'Kiểm tra trường bắt buộc, tọa độ Huế và URL HTTP(S).',

  error_conflict: 'Bản đã thay đổi. Tải lại trước khi tiếp tục.',

  error_notFound: 'Không tìm thấy di tích',

  error_notApproved: 'Chỉ công bố đúng phiên bản đã duyệt, chưa sửa tiếp.',

  error_incomplete: 'Cần ảnh, bài Việt và audio cho các bản nội dung đã nhập.',

  error_staleJob: 'Kết quả tác vụ thuộc bản cũ. Hãy thử lại.',

  retry: 'Thử lại',

  stop: 'Dừng nghe thử',
} as const

const en = {
  // CHỨC NĂNG: Nhãn chọn/xóa ảnh và ảnh đại diện, chung web/mobile.
  coverImage: 'Cover image',
  makeCover: 'Use as cover',
  removeImage: 'Remove image',
  imageNumber: 'Image',

  allReviews: 'All',
  // CHỨC NĂNG: Phản hồi gửi duyệt và điều hướng xem chi tiết hồ sơ.
  submittedSuccess: 'Submitted for review successfully. You can add another place.',
  viewReview: 'View details',
  backReviews: 'Back to review queue',

  // CHỨC NĂNG: Nhãn form đầy đủ và phản hồi dịch, dùng chung cho web/mobile.
  draftStorageHint:
    'Drafts are stored in SQL Server and listed under Places. Submitting for review does not publish them.',
  autoTranslate: 'Translate when saving Vietnamese',
  translationNotice:
    'MyMemory receives the text; the anonymous free limit is 5,000 characters/day. Review translations before approval. Regenerate audio after editing.',
  translating: 'Translating',
  translateAll: 'Translate four languages',
  audioAll: 'Generate missing audio',
  confirmTranslate:
    'Retranslation replaces the four translations and removes their old audio. Continue?',
  error_translationError:
    'Translation failed validation or the service is unavailable. Your saved draft remains intact.',

  previewSeek: 'Seek preview',

  previewVolume: 'Volume',

  previewMore: 'Preview options',

  previewRate: 'Speed',

  previewPause: 'Pause',

  previewResume: 'Resume',

  gateHint: 'Gate QR link opens, counted once per session/day; not tickets or people.',

  gateError: 'QR statistics are unavailable.',

  confirmDelete:
    'Permanently delete this place from shared Admin and visitor data? Draft and published content will be removed. There is no undo button.',

  delete: 'Delete permanently',

  clearFile: 'Remove selected file',

  localFile: 'Local file selected',

  mediaError: 'Invalid file or larger than 1 MB. Choose JPEG/PNG/WebP or MP3/WAV/OGG.',
  // File được lưu thành byte SQL sau khi người dùng xác nhận Lưu.
  fileHint: 'Up to 1 MB per file.',

  pickAudio: 'Choose local recording',

  pickImage: 'Choose local image',

  confirm: 'Confirm',

  previewError: 'Preview unavailable. Check the source and retry.',

  simListening: 'Simulate listening visitor',

  overviewHint: 'Monitor activity and manage heritage content.',

  quickActions: 'Quick actions',

  managePlacesHint: 'Update information, photos and narration.',

  reviewQueueHint: 'Review and publish approved content.',

  catalogHint: 'Manage places and narration content.',

  basicInfo: 'Place information',

  locationSection: 'Location and coordinates',

  mediaSection: 'Photos and media',

  workflowSection: 'Save and manage versions',

  resetHint: 'Restore sample data when you need a fresh start.',

  editorHint: 'Edit content in each language.',

  clearSearch: 'Clear search',

  admin: 'Management',

  dashboard: 'Dashboard',

  places: 'Places',

  reviews: 'Reviews',

  qr: 'Gate QR',

  visitor: 'Visitor view',

  // Nội dung mô tả SQL Server dùng chung, giữ cùng khóa dịch cho web/mobile.
  demo: 'Shared data is stored in SQL Server; restarting the API preserves saved content.',

  mockMedia: 'Audio is generated from saved text. Check translations before review.',

  loading: 'Loading…',

  save: 'Save draft',

  saved: 'Operation completed',

  new: 'Add place',

  edit: 'Information',

  content: 'Edit content',

  search: 'Search places…',

  title: 'Official title',

  period: 'Historical period',

  category: 'Category',

  lat: 'Latitude',

  lng: 'Longitude',

  verified: 'Coordinates verified',

  images: 'Images: one URL or photo:ID per line',

  summary: 'Summary',

  address: 'Address',

  body: 'Narration text',

  audio: 'Hosted recording MP3 URL',

  preview: 'Preview audio',

  prepare: 'Create speech from saved text',

  translate: 'Translate from saved Vietnamese',

  submit: 'Submit for review',

  approve: 'Approve revision',

  reject: 'Request changes',

  note: 'Review note',

  publish: 'Publish revision',

  confirmPublish: 'Publish this revision to the visitor view on this device?',

  archive: 'Archive place',

  confirmArchive: 'Archive removes this place from the public catalogue. Continue?',

  reset: 'Reset sample data',

  confirmReset: 'Discard local changes and restore sample data?',

  cancel: 'Cancel',

  unsaved: 'Unsaved changes. Leave this form?',

  active: 'Active sessions',

  web: 'Web',

  mobile: 'Mobile app',

  listening: 'Listening',

  gateToday: 'Gate entries today',

  simWeb: 'Simulate web visitor',

  simMobile: 'Simulate app visitor',

  endSessions: 'End simulated sessions',

  // Nội dung mô tả SQL Server dùng chung, giữ cùng khóa dịch cho web/mobile.
  analyticsHint:
    'Anonymous sessions are stored in SQL Server and expire after 90 seconds without a heartbeat. Sessions are not people or tickets.',

  // Nội dung mô tả SQL Server dùng chung, giữ cùng khóa dịch cho web/mobile.
  presenceError: 'Statistics are unavailable. Check the API and SQL Server connection.',

  empty: 'No matching data',

  revision: 'Revision',

  current: 'Current published version',

  none: 'None',

  status_draft: 'Draft',

  status_submitted: 'In review',

  status_changes: 'Changes requested',

  status_approved: 'Approved',

  status_published: 'Published',

  status_archived: 'Archived',

  error_loadError: 'Could not connect to management data. Check the connection and retry.',

  error_saveError: 'Save failed. The published version is unchanged.',

  error_invalid: 'Check required fields, Hue coordinates and HTTP(S) URLs.',

  error_conflict: 'Revision changed. Reload before continuing.',

  error_notFound: 'Place not found',

  error_notApproved: 'Publish only the unchanged approved revision.',

  error_incomplete: 'Require an image, Vietnamese text and audio for entered languages.',

  error_staleJob: 'Task result is stale. Retry.',

  retry: 'Retry',

  stop: 'Stop preview',
} as const

const cn = {
  // CHỨC NĂNG: Nhãn chọn/xóa ảnh và ảnh đại diện, chung web/mobile.
  coverImage: '封面图片',
  makeCover: '设为封面',
  removeImage: '移除图片',
  imageNumber: '图片',

  allReviews: '全部',
  // CHỨC NĂNG: Phản hồi gửi duyệt và điều hướng xem chi tiết hồ sơ.
  submittedSuccess: '已成功提交审核。现在可以添加新景点。',
  viewReview: '查看详情',
  backReviews: '返回审核列表',

  // CHỨC NĂNG: Nhãn form đầy đủ và phản hồi dịch, dùng chung cho web/mobile.
  draftStorageHint: '草稿保存在 SQL Server 中，在景点列表显示。提交审核不会自动发布。',
  autoTranslate: '保存越南语时自动翻译',
  translationNotice:
    '文本将发送至MyMemory，匿名免费额度为每天5,000字符。审核前请检查译文，修改后重新生成音频。',
  translating: '正在翻译',
  translateAll: '翻译四种语言',
  audioAll: '生成缺少的音频',
  confirmTranslate: '重新翻译将替换四种译文并移除旧音频。继续？',
  error_translationError: '翻译未通过检查或服务暂不可用。已保存的草稿仍保留。',

  previewSeek: '拖动试听进度',

  previewVolume: '音量',

  previewMore: '试听选项',

  previewRate: '播放速度',

  previewPause: '暂停',

  previewResume: '继续播放',

  gateHint: '入口二维码链接打开次数，每个会话每天计一次；不代表票数或人数。',

  gateError: '无法加载二维码统计。',

  confirmDelete: '从共享管理和游客数据中永久删除此景点？草稿和公开内容将被删除，无法撤销。',

  delete: '永久删除',

  clearFile: '移除文件',

  localFile: '已选本地文件',

  mediaError: '文件无效或超过1MB。选择图片或音频支持格式。',
  // File được lưu thành byte SQL sau khi người dùng xác nhận Lưu.
  fileHint: '每个文件最大1MB。',

  pickAudio: '选择本地录音',

  pickImage: '选择本地图片',

  confirm: '确认',

  previewError: '无法试听，请检查来源后重试。',

  simListening: '模拟收听游客',

  overviewHint: '查看使用情况并管理景点内容。',

  quickActions: '快捷操作',

  managePlacesHint: '更新信息、图片和讲解。',

  reviewQueueHint: '审核并发布已批准的内容。',

  catalogHint: '管理景点目录和讲解内容。',

  basicInfo: '景点信息',

  locationSection: '位置与坐标',

  mediaSection: '图片与资料',

  workflowSection: '保存与版本管理',

  resetHint: '需要重新开始时恢复示例数据。',

  editorHint: '按语言编辑内容。',

  clearSearch: '清除关键词',

  admin: '管理',

  dashboard: '概览',

  places: '景点',

  reviews: '审核',

  qr: '入口二维码',

  visitor: '游客页面',

  // Nội dung mô tả SQL Server dùng chung, giữ cùng khóa dịch cho web/mobile.
  demo: '共享数据保存在 SQL Server 中；重启 API 不会丢失已保存内容。',

  mockMedia: '音频根据已保存的文章生成，提交审核前请检查译文。',

  loading: '加载中…',

  save: '保存草稿',

  saved: '操作成功',

  new: '添加景点',

  edit: '信息',

  content: '编辑内容',

  search: '搜索景点…',

  title: '正式名称',

  period: '历史时期',

  category: '类别',

  lat: '纬度',

  lng: '经度',

  verified: '坐标已核实',

  images: '图片：每行一个URL或photo:ID',

  summary: '简介',

  address: '地址',

  body: '讲解文稿',

  audio: '已托管MP3录音URL',

  preview: '试听',

  prepare: '根据已保存正文生成语音',

  translate: '从已保存越南语翻译',

  submit: '提交审核',

  approve: '批准版本',

  reject: '要求修改',

  note: '审核备注',

  publish: '发布版本',

  confirmPublish: '向当前设备游客视图发布此版本？',

  archive: '归档景点',

  confirmArchive: '归档会从示例公开目录移除景点。继续？',

  reset: '重置示例数据',

  confirmReset: '清除本地修改并恢复示例数据？',

  cancel: '取消',

  unsaved: '有未保存修改，离开？',

  active: '活跃会话',

  web: '网页',

  mobile: '移动应用',

  listening: '正在收听',

  gateToday: '今日入口次数',

  simWeb: '模拟网页游客',

  simMobile: '模拟应用游客',

  endSessions: '结束示例会话',

  // Nội dung mô tả SQL Server dùng chung, giữ cùng khóa dịch cho web/mobile.
  analyticsHint: '匿名会话保存在 SQL Server 中，90 秒未发送心跳即过期。会话数不等于人数或票数。',

  // Nội dung mô tả SQL Server dùng chung, giữ cùng khóa dịch cho web/mobile.
  presenceError: '无法读取统计，请检查 API 和 SQL Server 连接。',

  empty: '暂无匹配数据',

  revision: '修订',

  current: '当前公开版本',

  none: '暂无',

  status_draft: '草稿',

  status_submitted: '待审核',

  status_changes: '需修改',

  status_approved: '已批准',

  status_published: '已发布',

  status_archived: '已归档',

  error_loadError: '无法连接管理数据。请检查连接后重试。',

  error_saveError: '保存失败，公开版本未改变。',

  error_invalid: '请检查必填项、顺化坐标和HTTP(S)链接。',

  error_conflict: '版本已变，请刷新后继续。',

  error_notFound: '未找到景点',

  error_notApproved: '只能发布未再修改的已批准版本。',

  error_incomplete: '需要图片、越南语内容及已输入语言的音频。',

  error_staleJob: '任务结果已过期，请重试。',

  retry: '重试',

  stop: '停止试听',
} as const

const pt = {
  // CHỨC NĂNG: Nhãn chọn/xóa ảnh và ảnh đại diện, chung web/mobile.
  coverImage: 'Imagem de capa',
  makeCover: 'Usar como capa',
  removeImage: 'Remover imagem',
  imageNumber: 'Imagem',

  allReviews: 'Todos',
  // CHỨC NĂNG: Phản hồi gửi duyệt và điều hướng xem chi tiết hồ sơ.
  submittedSuccess: 'Enviado para revisão com sucesso. Pode adicionar outro local.',
  viewReview: 'Ver detalhes',
  backReviews: 'Voltar à lista de revisão',

  // CHỨC NĂNG: Nhãn form đầy đủ và phản hồi dịch, dùng chung cho web/mobile.
  draftStorageHint:
    'Os rascunhos são guardados no SQL Server e apresentados em Locais. Enviar para revisão não publica o conteúdo.',
  autoTranslate: 'Traduzir ao guardar o vietnamita',
  translationNotice:
    'O texto é enviado ao MyMemory: limite gratuito anónimo de 5.000 caracteres/dia. Reveja a tradução e gere novamente o áudio após editar.',
  translating: 'A traduzir',
  translateAll: 'Traduzir quatro idiomas',
  audioAll: 'Gerar áudios em falta',
  confirmTranslate:
    'A retradução substitui os quatro textos e remove os áudios antigos. Continuar?',
  error_translationError:
    'A tradução não passou a validação ou o serviço está indisponível. O rascunho guardado mantém-se.',

  previewSeek: 'Avançar na pré-escuta',

  previewVolume: 'Volume',

  previewMore: 'Opções de pré-escuta',

  previewRate: 'Velocidade',

  previewPause: 'Pausar',

  previewResume: 'Continuar',

  gateHint: 'Aberturas do link QR de entrada, uma por sessão/dia; não são bilhetes nem pessoas.',

  gateError: 'Estatísticas QR indisponíveis.',

  confirmDelete:
    'Eliminar este local dos dados partilhados de gestão e visitantes? O rascunho e a versão pública serão removidos. Não há botão para desfazer.',

  delete: 'Eliminar permanentemente',

  clearFile: 'Remover ficheiro',

  localFile: 'Ficheiro local escolhido',

  mediaError: 'Ficheiro inválido ou superior a 1 MB. Use imagem/áudio suportado.',
  // File được lưu thành byte SQL sau khi người dùng xác nhận Lưu.
  fileHint: 'Até 1 MB por ficheiro.',

  pickAudio: 'Escolher gravação local',

  pickImage: 'Escolher imagem local',

  confirm: 'Confirmar',

  previewError: 'Prévia indisponível. Verifique a origem e repita.',

  simListening: 'Simular visitante a ouvir',

  overviewHint: 'Acompanhe a atividade e gira conteúdos do património.',

  quickActions: 'Ações rápidas',

  managePlacesHint: 'Atualize informações, fotografias e narrações.',

  reviewQueueHint: 'Reveja e publique conteúdos aprovados.',

  catalogHint: 'Gira locais e conteúdos de narração.',

  basicInfo: 'Informação do local',

  locationSection: 'Localização e coordenadas',

  mediaSection: 'Fotografias e materiais',

  workflowSection: 'Guardar e gerir versões',

  resetHint: 'Reponha os dados de exemplo para recomeçar.',

  editorHint: 'Edite conteúdos em cada idioma.',

  clearSearch: 'Limpar pesquisa',

  admin: 'Gestão',

  dashboard: 'Visão geral',

  places: 'Locais',

  reviews: 'Revisão',

  qr: 'QR da entrada',

  visitor: 'Vista visitante',

  // Nội dung mô tả SQL Server dùng chung, giữ cùng khóa dịch cho web/mobile.
  demo: 'Os dados partilhados são guardados no SQL Server; reiniciar a API mantém o conteúdo guardado.',

  mockMedia: 'O áudio é gerado do texto guardado. Reveja as traduções antes de enviar.',

  loading: 'A carregar…',

  save: 'Guardar rascunho',

  saved: 'Operação concluída',

  new: 'Adicionar local',

  edit: 'Informação',

  content: 'Editar conteúdo',

  search: 'Pesquisar locais…',

  title: 'Nome oficial',

  period: 'Período histórico',

  category: 'Categoria',

  lat: 'Latitude',

  lng: 'Longitude',

  verified: 'Coordenadas verificadas',

  images: 'Imagens: um URL ou photo:ID por linha',

  summary: 'Resumo',

  address: 'Morada',

  body: 'Texto da narração',

  audio: 'URL MP3 alojado',

  preview: 'Ouvir prévia',

  prepare: 'Gerar voz do texto guardado',

  translate: 'Traduzir do vietnamita guardado',

  submit: 'Enviar para revisão',

  approve: 'Aprovar versão',

  reject: 'Pedir alterações',

  note: 'Nota de revisão',

  publish: 'Publicar versão',

  confirmPublish: 'Publicar esta versão para visitantes neste dispositivo?',

  archive: 'Arquivar local',

  confirmArchive: 'Arquivar remove o local do catálogo. Continuar?',

  reset: 'Repor exemplo',

  confirmReset: 'Eliminar alterações locais e repor dados de exemplo?',

  cancel: 'Cancelar',

  unsaved: 'Alterações por guardar. Sair?',

  active: 'Sessões ativas',

  web: 'Web',

  mobile: 'Aplicação móvel',

  listening: 'A ouvir',

  gateToday: 'Entradas QR hoje',

  simWeb: 'Simular visitante Web',

  simMobile: 'Simular visitante App',

  endSessions: 'Terminar sessões simuladas',

  // Nội dung mô tả SQL Server dùng chung, giữ cùng khóa dịch cho web/mobile.
  analyticsHint:
    'As sessões anónimas são guardadas no SQL Server e expiram após 90 segundos sem sinal. Sessões não são pessoas nem bilhetes.',

  // Nội dung mô tả SQL Server dùng chung, giữ cùng khóa dịch cho web/mobile.
  presenceError: 'Estatísticas indisponíveis. Verifique a API e a ligação ao SQL Server.',

  empty: 'Sem dados correspondentes',

  revision: 'Revisão',

  current: 'Versão publicada atual',

  none: 'Nenhum',

  status_draft: 'Rascunho',

  status_submitted: 'Em revisão',

  status_changes: 'Alterações pedidas',

  status_approved: 'Aprovado',

  status_published: 'Publicado',

  status_archived: 'Arquivado',

  error_loadError:
    'Não foi possível ligar aos dados de gestão. Verifique a ligação e tente novamente.',

  error_saveError: 'Falha ao guardar. Versão pública mantida.',

  error_invalid: 'Verifique campos, coordenadas e URL HTTP(S).',

  error_conflict: 'Versão alterada. Recarregue antes de continuar.',

  error_notFound: 'Local não encontrado',

  error_notApproved: 'Publique apenas a revisão aprovada sem alterações.',

  error_incomplete: 'É necessária imagem, texto vietnamita e áudio nos idiomas preenchidos.',

  error_staleJob: 'Resultado desatualizado. Repita.',

  retry: 'Repetir',

  stop: 'Parar prévia',
} as const

const ja = {
  // CHỨC NĂNG: Nhãn chọn/xóa ảnh và ảnh đại diện, chung web/mobile.
  coverImage: 'カバー画像',
  makeCover: 'カバーに設定',
  removeImage: '画像を削除',
  imageNumber: '画像',

  allReviews: 'すべて',
  // CHỨC NĂNG: Phản hồi gửi duyệt và điều hướng xem chi tiết hồ sơ.
  submittedSuccess: '審査への送信が完了しました。新しいスポットを入力できます。',
  viewReview: '詳細を見る',
  backReviews: '審査一覧に戻る',

  // CHỨC NĂNG: Nhãn form đầy đủ và phản hồi dịch, dùng chung cho web/mobile.
  draftStorageHint:
    '下書きはSQL Serverに保存され、スポット一覧に表示されます。審査への送信では公開されません。',
  autoTranslate: 'ベトナム語の保存時に翻訳',
  translationNotice:
    '文章はMyMemoryに送信されます。匿名無料枠は1日5,000文字です。承認前に訳文を確認し、編集後は音声を再生成してください。',
  translating: '翻訳中',
  translateAll: '4言語に翻訳',
  audioAll: '未作成の音声を生成',
  confirmTranslate: '再翻訳すると4言語の本文を置き換え、古い音声を解除します。続行しますか？',
  error_translationError:
    '翻訳の検証に失敗したか、サービスを利用できません。保存済みの下書きは残っています。',

  previewSeek: '試聴位置を移動',

  previewVolume: '音量',

  previewMore: '試聴オプション',

  previewRate: '再生速度',

  previewPause: '一時停止',

  previewResume: '再開',

  gateHint: '入口QRリンクを開いた回数。同じセッションは1日1回で、人数や入場券数ではありません。',

  gateError: 'QR統計を取得できません。',

  confirmDelete:
    'この史跡を共有された管理・来訪者データから完全に削除しますか？下書きと公開版が削除され、元に戻すボタンはありません。',

  delete: '完全に削除',

  clearFile: '選択ファイルを外す',

  localFile: 'ローカルファイル選択済み',

  mediaError: '無効または1MB超過。対応する画像・音声を選んでください。',
  // File được lưu thành byte SQL sau khi người dùng xác nhận Lưu.
  fileHint: '1ファイル1MBまで。',

  pickAudio: '端末の録音を選択',

  pickImage: '端末の画像を選択',

  confirm: '確認',

  previewError: '試聴できません。音源を確認して再試行してください。',

  simListening: '再生中の利用者を追加',

  overviewHint: '利用状況を確認し、史跡のコンテンツを管理します。',

  quickActions: 'クイック操作',

  managePlacesHint: '情報、写真、音声ガイドを更新します。',

  reviewQueueHint: '内容を確認して承認済みの版を公開します。',

  catalogHint: 'スポットと音声ガイドを管理します。',

  basicInfo: 'スポット情報',

  locationSection: '場所と座標',

  mediaSection: '写真と資料',

  workflowSection: '保存とバージョン管理',

  resetHint: '最初から始める場合にサンプルデータを復元します。',

  editorHint: '言語ごとにコンテンツを編集します。',

  clearSearch: '検索語を消去',

  admin: '管理',

  dashboard: '概要',

  places: '史跡',

  reviews: '審査',

  qr: '入口QR',

  visitor: '来訪者画面',

  // Nội dung mô tả SQL Server dùng chung, giữ cùng khóa dịch cho web/mobile.
  demo: '共有データは SQL Server に保存されます。API を再起動しても保存済みの内容は失われません。',

  mockMedia: '保存済み本文から音声を生成します。審査前に訳文を確認してください。',

  loading: '読込中…',

  save: '下書き保存',

  saved: '処理完了',

  new: '史跡を追加',

  edit: '情報',

  content: '内容編集',

  search: '史跡を検索…',

  title: '正式名称',

  period: '歴史的時代',

  category: '分類',

  lat: '緯度',

  lng: '経度',

  verified: '座標確認済み',

  images: '画像：1行にURLまたはphoto:ID',

  summary: '概要文',

  address: '住所',

  body: '解説文',

  audio: 'サーバー上のMP3 URL',

  preview: '試聴',

  prepare: '保存済み本文から音声を生成',

  translate: '保存済みのベトナム語から翻訳',

  submit: '審査に送信',

  approve: '版を承認',

  reject: '修正依頼',

  note: '審査メモ',

  publish: '版を公開',

  confirmPublish: 'この端末の来訪者画面に公開しますか？',

  archive: '史跡をアーカイブ',

  confirmArchive: 'サンプル公開一覧から除きます。続けますか？',

  reset: 'サンプルデータをリセット',

  confirmReset: 'ローカル変更を破棄しサンプルに戻しますか？',

  cancel: '取消',

  unsaved: '未保存の変更があります。移動しますか？',

  active: 'アクティブセッション',

  web: 'Web',

  mobile: 'モバイルアプリ',

  listening: '再生中',

  gateToday: '本日のQR入場',

  simWeb: 'Web利用者を追加',

  simMobile: 'アプリ利用者を追加',

  endSessions: 'サンプルセッション終了',

  // Nội dung mô tả SQL Server dùng chung, giữ cùng khóa dịch cho web/mobile.
  analyticsHint:
    '匿名セッションは SQL Server に保存され、90秒間通知がないと期限切れになります。人数やチケット数ではありません。',

  // Nội dung mô tả SQL Server dùng chung, giữ cùng khóa dịch cho web/mobile.
  presenceError: '統計を取得できません。API と SQL Server の接続を確認してください。',

  empty: '該当データなし',

  revision: '改訂',

  current: '現在の公開版',

  none: 'なし',

  status_draft: '下書き',

  status_submitted: '審査待ち',

  status_changes: '要修正',

  status_approved: '承認済み',

  status_published: '公開済み',

  status_archived: 'アーカイブ済み',

  error_loadError: '管理データに接続できません。接続を確認して再試行してください。',

  error_saveError: '保存失敗。公開版は変更されません。',

  error_invalid: '必須項目・フエの座標・HTTP(S) URLを確認してください。',

  error_conflict: '版が変更されました。再読込してください。',

  error_notFound: '史跡が見つかりません',

  error_notApproved: '承認後未変更の版だけ公開できます。',

  error_incomplete: '画像・ベトナム語文・入力した言語の音声が必要です。',

  error_staleJob: '古い処理結果です。再試行してください。',

  retry: '再試行',

  stop: '試聴停止',
} as const
// Đặt tên kiểu AdminTextKey.
export type AdminTextKey = keyof typeof vi

export const adminMessages: Record<Language, Record<AdminTextKey, string>> = { vi, en, cn, pt, ja }
/* CÁCH KIỂM TRA: Đổi đủ năm ngôn ngữ, mọi nhãn Admin đổi cùng lựa chọn du khách. */
