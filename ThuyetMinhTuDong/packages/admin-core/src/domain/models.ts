/**
 * FILE NÀY LÀM GÌ: Kiểu dữ liệu Admin UC12–UC17 và danh tính được cấp sẵn.
 * Service, hooks, web/mobile dùng; phụ thuộc kiểu visitor-core, không có UI.
 * Bản đang sửa và bản công khai tách nhau để lưu nháp không ảnh hưởng khách.
 */
import type { PlaceRecord, Language, Category, PublishedText } from '@travelguide/visitor-core'
export type Workflow = 'draft' | 'submitted' | 'changes' | 'approved' | 'published' | 'archived'
export type AdminIdentity = { id: string; displayName: string; mode: 'demo' | 'api'; permissions: readonly ['manage-content', 'review', 'publish'] }
export type ManagedPlace = { id: string; record: PlaceRecord; period: string; revision: number; workflow: Workflow; reviewNote: string; approvedRevision?: number; published?: PlaceRecord; updatedAt: string }
export type PlaceInput = { id?: string; expectedRevision?: number; title: string; category: Category; period: string; lat: string; lng: string; verified: boolean; images: string[] }
export type ContentInput = { id: string; language: Language; expectedRevision: number; title: string; summary: string; address: string; body: string; audioUrl?: string }
export type DemoSession = { id: string; platform: 'web' | 'mobile-app'; lastSeen: number; startedAt: number; playing: boolean }
export type AdminDocument = { schema: 1; places: ManagedPlace[]; sessions: DemoSession[]; audit: { at: string; action: string; placeId: string; revision: number }[] }
export type Dashboard = { active: number; web: number; mobile: number; listening: number; gateToday: number; places: number; pending: number; published: number }
export type AdminErrorCode = 'loadError' | 'saveError' | 'invalid' | 'conflict' | 'notFound' | 'notApproved' | 'incomplete' | 'staleJob'
export class AdminError extends Error { constructor(public readonly code: AdminErrorCode) { super(code); this.name = 'AdminError' } }
export type PreparedText = PublishedText
/* CÁCH KIỂM TRA: TypeScript phải chặn workflow/ngôn ngữ lạ; published và record là hai bản riêng. */
