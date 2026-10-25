/**
 * FILE NÀY LÀM GÌ: Hợp đồng service để sau thay mock bằng API mà giữ UI.
 * MockService, AdminProvider và HTTP adapter tương lai dùng. UC12–UC17.
 * UI không gọi localStorage/AsyncStorage/fetch; chỉ gọi hợp đồng này.
 */
import type { Language, PlaceRecord } from '@travelguide/visitor-core'
import type { AdminDocument, AdminIdentity, PlaceInput, ContentInput } from './models'
export interface StoragePort { read(): Promise<string | null>; write(value: string): Promise<void> }
export interface AdminService {
  identity(): Promise<AdminIdentity>
  load(): Promise<AdminDocument>
  savePlace(input: PlaceInput): Promise<void>
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
