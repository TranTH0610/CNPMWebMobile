/**
 * FILE NÀY LÀM GÌ
 * Hợp đồng AdminService và StoragePort; cho phép thay mock/API lưu trữ mà không viết lại màn hình.
 *
 * VỊ TRÍ: packages/admin-core/src/domain/contracts.ts
 * DÙNG BỞI: packages/admin-core/src/index.ts; packages/admin-core/src/react/react.tsx;
 * packages/admin-core/src/services/httpService.ts; và các nơi import khác.
 * PHỤ THUỘC: @travelguide/visitor-core; ./models
 * TẠI SAO TÁCH FILE: Các nơi dùng cần cùng hợp đồng dữ liệu để TypeScript phát hiện truyền thiếu
 * hoặc sai kiểu.
 */
// Nhập kiểu dữ liệu từ '@travelguide/visitor-core'.
import type { Language, PlaceRecord } from '@travelguide/visitor-core'
// Nhập kiểu dữ liệu từ './models'.
import type { AdminDocument, AdminIdentity, PlaceInput, ContentInput } from './models'
// Khai báo hợp đồng StoragePort.
export interface StoragePort { read(): Promise<string | null>; write(value: string): Promise<void> }
// Khai báo hợp đồng AdminService.
export interface AdminService {
  // Khai báo identity(). Mô tả cách gọi trong hợp đồng kiểu.
  identity(): Promise<AdminIdentity>
  // Khai báo load(). Mô tả cách gọi trong hợp đồng kiểu.
  load(): Promise<AdminDocument>
  // Khai báo savePlace(input). Mô tả cách gọi trong hợp đồng kiểu.
  savePlace(input: PlaceInput): Promise<void>
  // Khai báo saveContent(input). Mô tả cách gọi trong hợp đồng kiểu.
  saveContent(input: ContentInput): Promise<void>
  // Khai báo translate(id, language, expectedRevision). Mô tả cách gọi trong hợp đồng kiểu.
  translate(id: string, language: Language, expectedRevision: number): Promise<void>
  // Khai báo generateAudio(id, language, expectedRevision). Mô tả cách gọi trong hợp đồng kiểu.
  generateAudio(id: string, language: Language, expectedRevision: number): Promise<void>
  // Khai báo submit(id, revision). Mô tả cách gọi trong hợp đồng kiểu.
  submit(id: string, revision: number): Promise<void>
  // Khai báo review(id, revision, approved, note). Mô tả cách gọi trong hợp đồng kiểu.
  review(id: string, revision: number, approved: boolean, note: string): Promise<void>
  // Khai báo publish(id, revision). Mô tả cách gọi trong hợp đồng kiểu.
  publish(id: string, revision: number): Promise<void>
  // Khai báo archive(id, revision). Mô tả cách gọi trong hợp đồng kiểu.
  archive(id: string, revision: number): Promise<void>
  // Khai báo deletePlace(id, revision). Mô tả cách gọi trong hợp đồng kiểu.
  deletePlace(id: string, revision: number): Promise<void>
  // Khai báo simulate(platform, playing). Mô tả cách gọi trong hợp đồng kiểu.
  simulate(platform: 'web' | 'mobile-app', playing?: boolean): Promise<void>
  // Khai báo endSessions(). Mô tả cách gọi trong hợp đồng kiểu.
  endSessions(): Promise<void>
  // Khai báo reset(). Mô tả cách gọi trong hợp đồng kiểu.
  reset(): Promise<void>
  // Khai báo published(). Mô tả cách gọi trong hợp đồng kiểu.
  published(): Promise<PlaceRecord[]>
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `subscribe(listener: () => void): () => void`: Khai báo subscribe(listener). Mô tả cách gọi trong hợp đồng kiểu.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  subscribe(listener: () => void): () => void
}
/* CÁCH KIỂM TRA: HTTP adapter phải thực hiện cùng interface; màn hình không thay đổi khi đổi nguồn. */
