/**
 * FILE: packages/admin-core/src/domain/HopDongDichVu.ts
 * FILE NÀY LÀM GÌ: Hợp đồng AdminService và StoragePort; cho phép thay mock/API lưu trữ mà không viết lại màn hình.
 * VAI TRÒ: Module dùng chung; được giao diện hoặc máy chủ gọi tùy chức năng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC09: Truy cập khu vực quản lý được cấp sẵn.
 * - UC10: Quản lý di tích.
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * - UC12: Kiểm duyệt nội dung và âm thanh.
 * - UC13: Công bố phiên bản đã duyệt.
 * - UC14: Theo dõi hoạt động và lượt vào từ QR.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import type { Language, PlaceRecord } from '@travelguide/visitor-core'
import type { AdminDocument, AdminIdentity, PlaceInput, ContentInput } from './KieuDuLieuQuanTri'

export interface StoragePort {
  read(): Promise<string | null>
  write(value: string): Promise<void>
}

export interface AdminService {
  identity(): Promise<AdminIdentity>

  load(): Promise<AdminDocument>

  savePlace(input: PlaceInput): Promise<string>

  saveContent(input: ContentInput): Promise<void>

  translate(id: string, language: Language, expectedRevision: number): Promise<void>

  generateAudio(id: string, language: Language, expectedRevision: number): Promise<void>

  submit(id: string, revision: number): Promise<void>

  review(id: string, revision: number, approved: boolean, note: string): Promise<void>

  publish(id: string, revision: number): Promise<void>

  archive(id: string, revision: number): Promise<void>

  deletePlace(id: string, revision: number): Promise<void>

  simulate(platform: 'web' | 'mobile-app', playing?: boolean): Promise<void>

  endSessions(): Promise<void>

  reset(): Promise<void>

  published(): Promise<PlaceRecord[]>

  subscribe(listener: () => void): () => void
}
/* CÁCH KIỂM TRA: HTTP adapter phải thực hiện cùng interface; màn hình không thay đổi khi đổi nguồn. */
