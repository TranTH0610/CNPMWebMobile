/**
 * FILE NÀY LÀM GÌ
 * Điểm export công khai của package; nơi dùng import tên package thay vì truy cập sâu vào file nội
 * bộ.
 *
 * VỊ TRÍ: packages/admin-core/src/index.ts
 * DÙNG BỞI: apps/mobile/src/components/admin/AdminUI.tsx; apps/mobile/src/hooks/useGateEntry.ts;
 * apps/mobile/src/screens/admin/ContentEditorScreen.tsx; và các nơi import khác.
 * PHỤ THUỘC: ./domain/models; ./domain/contracts; ./domain/validation; ./services/mockService;
 * ./services/httpService
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán
 * và dễ bảo trì.
 */
// Xuất lại thành phần từ './domain/models'.
export * from './domain/models'
// Xuất lại thành phần từ './domain/contracts'.
export * from './domain/contracts'
// Xuất lại thành phần từ './domain/validation'.
export * from './domain/validation'
// Xuất lại thành phần từ './services/mockService'.
export * from './services/mockService'
/* CÁCH KIỂM TRA: Import entry này trong test Node không được kéo React/DOM vào. */

// Xuất lại thành phần từ './services/httpService'.
export * from './services/httpService'
