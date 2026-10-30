/**
 * FILE NÀY LÀM GÌ
 * Kiểu bản ghi quản trị, phiên bản, quy trình, danh tính mô phỏng và mã lỗi dùng chung.
 *
 * VỊ TRÍ: packages/admin-core/src/domain/models.ts
 * DÙNG BỞI: packages/admin-core/src/domain/contracts.ts;
 * packages/admin-core/src/domain/validation.ts; packages/admin-core/src/index.ts; và các nơi
 * import khác.
 * PHỤ THUỘC: @travelguide/visitor-core
 * TẠI SAO TÁCH FILE: Các nơi dùng cần cùng hợp đồng dữ liệu để TypeScript phát hiện truyền thiếu
 * hoặc sai kiểu.
 */
// Nhập kiểu dữ liệu từ '@travelguide/visitor-core'.
import type { PlaceRecord, Language, Category, PublishedText } from '@travelguide/visitor-core'
// Đặt tên kiểu Workflow.
export type Workflow = 'draft' | 'submitted' | 'changes' | 'approved' | 'published' | 'archived'
// Đặt tên kiểu AdminIdentity. | Khai báo id, kiểu string. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi. | Khai báo displayName, kiểu string. | Khai báo mode, kiểu 'demo' | 'api'. | Khai báo permissions, kiểu readonly ['manage-content', 'review', 'publish'].
export type AdminIdentity = { id: string; displayName: string; mode: 'demo' | 'api'; permissions: readonly ['manage-content', 'review', 'publish'] }
// Đặt tên kiểu ManagedPlace. | Khai báo id, kiểu string. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi. | Khai báo record, kiểu PlaceRecord. | Khai báo period, kiểu string. | Khai báo revision, kiểu number. Phiên bản phục vụ kiểm tra xung đột khi nhiều giao diện sửa cùng bản ghi. | Khai báo workflow, kiểu Workflow. Giữ bước nháp/gửi duyệt/công bố của bản quản trị tách khỏi nội dung đang công khai. | Khai báo reviewNote, kiểu string. | Khai báo approvedRevision không bắt buộc, kiểu number. Ghi phiên bản đã duyệt để nội dung sửa mới không được công bố theo lần duyệt cũ. | Khai báo published không bắt buộc, kiểu PlaceRecord. Giữ ảnh chụp nội dung công bố để sửa bản nháp không làm đổi ngay trang du khách. | Khai báo updatedAt, kiểu string.
export type ManagedPlace = { id: string; record: PlaceRecord; period: string; revision: number; workflow: Workflow; reviewNote: string; approvedRevision?: number; published?: PlaceRecord; updatedAt: string }
// Đặt tên kiểu PlaceInput. | Khai báo id không bắt buộc, kiểu string. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi. | Khai báo expectedRevision không bắt buộc, kiểu number. Gửi phiên bản đã đọc để service phát hiện bản ghi bị nơi khác sửa trước đó. | Khai báo title, kiểu string. | Khai báo category, kiểu Category. | Khai báo period, kiểu string. | Khai báo lat, kiểu string. | Khai báo lng, kiểu string. | Khai báo verified, kiểu boolean. Tách tọa độ tham khảo với tọa độ đã xác nhận; không biến dữ liệu mẫu thành kết quả khảo sát. | Khai báo images, kiểu string[]. Giữ danh sách nguồn ảnh để UI có thể xử lý từng nguồn và ảnh lỗi.
export type PlaceInput = { id?: string; expectedRevision?: number; title: string; category: Category; period: string; lat: string; lng: string; verified: boolean; images: string[] }
// Đặt tên kiểu ContentInput. | Khai báo id, kiểu string. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi. | Khai báo language, kiểu Language. Chọn đúng bản nội dung/âm thanh, tránh đọc văn bản một thứ tiếng bằng giọng thứ tiếng khác. | Khai báo expectedRevision, kiểu number. Gửi phiên bản đã đọc để service phát hiện bản ghi bị nơi khác sửa trước đó. | Khai báo title, kiểu string. | Khai báo summary, kiểu string. | Khai báo address, kiểu string. | Khai báo body, kiểu string. | Khai báo audioUrl không bắt buộc, kiểu string.
export type ContentInput = { id: string; language: Language; expectedRevision: number; title: string; summary: string; address: string; body: string; audioUrl?: string }
// Đặt tên kiểu DemoSession. | Khai báo id, kiểu string. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi. | Khai báo platform, kiểu 'web' | 'mobile-app'. Phân nhóm web và mobile-app trong cùng kho thống kê. | Khai báo lastSeen, kiểu number. Dùng thời gian của server để tính phiên hết hạn, không tin đồng hồ client. | Khai báo startedAt, kiểu number. | Khai báo playing, kiểu boolean.
export type DemoSession = { id: string; platform: 'web' | 'mobile-app'; lastSeen: number; startedAt: number; playing: boolean }
// Đặt tên kiểu AdminDocument. | Khai báo schema, kiểu 1. | Khai báo places, kiểu ManagedPlace[]. | Khai báo sessions, kiểu DemoSession[]. | Khai báo audit, kiểu { at: string; action: string; placeId: string; revision: number }[]. | Khai báo at, kiểu string. | Khai báo action, kiểu string. | Khai báo placeId, kiểu string. | Khai báo revision, kiểu number. Phiên bản phục vụ kiểm tra xung đột khi nhiều giao diện sửa cùng bản ghi.
export type AdminDocument = { schema: 1; places: ManagedPlace[]; sessions: DemoSession[]; audit: { at: string; action: string; placeId: string; revision: number }[] }
// Đặt tên kiểu Dashboard. | Khai báo active, kiểu number. Biểu diễn số phiên hoạt động; không suy ra số người hoặc số vé từ số này. | Khai báo web, kiểu number. | Khai báo mobile, kiểu number. | Khai báo listening, kiểu number. | Khai báo gateToday, kiểu number. | Khai báo places, kiểu number. | Khai báo pending, kiểu number. | Khai báo published, kiểu number. Giữ ảnh chụp nội dung công bố để sửa bản nháp không làm đổi ngay trang du khách.
export type Dashboard = { active: number; web: number; mobile: number; listening: number; gateToday: number; places: number; pending: number; published: number }
// Đặt tên kiểu AdminErrorCode.
export type AdminErrorCode = 'loadError' | 'saveError' | 'invalid' | 'conflict' | 'notFound' | 'notApproved' | 'incomplete' | 'staleJob'
// Khai báo lớp AdminError. | Thực hiện Gọi super(code). | Thực hiện tính biểu thức this.name = 'AdminError'.
export class AdminError extends Error { constructor(public readonly code: AdminErrorCode) { super(code); this.name = 'AdminError' } }
// Đặt tên kiểu PreparedText.
export type PreparedText = PublishedText
/* CÁCH KIỂM TRA: TypeScript phải chặn workflow/ngôn ngữ lạ; published và record là hai bản riêng. */
