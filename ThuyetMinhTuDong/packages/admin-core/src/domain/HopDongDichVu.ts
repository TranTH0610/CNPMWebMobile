/**
 * CHỨC NĂNG: [KIEU-DU-LIEU]
 * VAI TRÒ: LOGIC / DỮ LIỆU DÙNG CHUNG
 *
 * FILE NÀY LÀM GÌ:
 * Hợp đồng AdminService và StoragePort; cho phép thay mock/API lưu trữ mà không viết lại màn hình.
 *
 * VỊ TRÍ: packages/admin-core/src/domain/HopDongDichVu.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - packages/admin-core/src/react/TrangThaiReact.tsx
 * - packages/admin-core/src/services/GoiApiQuanTri.ts
 * - packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts
 * - packages/admin-core/src/XuatCongKhai.ts
 *
 * PHỤ THUỘC:
 * - @travelguide/visitor-core
 * - ./KieuDuLieuQuanTri
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
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
