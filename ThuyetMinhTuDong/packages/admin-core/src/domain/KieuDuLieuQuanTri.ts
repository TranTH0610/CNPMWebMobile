/**
 * FILE: packages/admin-core/src/domain/KieuDuLieuQuanTri.ts
 * FILE NÀY LÀM GÌ: Kiểu bản ghi quản trị, phiên bản, quy trình, danh tính mô phỏng và mã lỗi dùng chung.
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
import type { PlaceRecord, Language, Category, PublishedText } from '@travelguide/visitor-core'
export type Workflow = 'draft' | 'submitted' | 'changes' | 'approved' | 'published' | 'archived'
export type AdminIdentity = {
  id: string
  displayName: string
  mode: 'demo' | 'api'
  permissions: readonly ['manage-content', 'review', 'publish']
}
export type ManagedPlace = {
  id: string
  record: PlaceRecord
  period: string
  revision: number
  workflow: Workflow
  reviewNote: string
  approvedRevision?: number
  published?: PlaceRecord
  updatedAt: string
}
export type PlaceInput = {
  id?: string
  expectedRevision?: number
  title: string
  category: Category
  period: string
  lat: string
  lng: string
  verified: boolean
  images: string[]
  content?: Partial<Record<Language, DraftText>>
}

/** Nội dung đang biên tập; trạng thái, phiên bản và audio do service quyết định. */
export type DraftText = {
  title: string
  summary: string
  address: string
  body: string
  audioUrl?: string
}
export type ContentInput = {
  id: string
  language: Language
  expectedRevision: number
  title: string
  summary: string
  address: string
  body: string
  audioUrl?: string
}
export type DemoSession = {
  id: string
  platform: 'web' | 'mobile-app'
  lastSeen: number
  startedAt: number
  playing: boolean
}
export type AdminDocument = {
  schema: 1
  places: ManagedPlace[]
  sessions: DemoSession[]
  audit: { at: string; action: string; placeId: string; revision: number }[]
}
export type Dashboard = {
  active: number
  web: number
  mobile: number
  listening: number
  gateToday: number
  places: number
  pending: number
  published: number
}
export type AdminErrorCode =
  | 'loadError'
  | 'saveError'
  | 'invalid'
  | 'conflict'
  | 'notFound'
  | 'notApproved'
  | 'incomplete'
  | 'staleJob'
  | 'translationError'

export class AdminError extends Error {
  constructor(public readonly code: AdminErrorCode) {
    super(code)
    this.name = 'AdminError'
  }
}
export type PreparedText = PublishedText
/* CÁCH KIỂM TRA: TypeScript phải chặn workflow/ngôn ngữ lạ; published và record là hai bản riêng. */
