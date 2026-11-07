/**
 * CHỨC NĂNG: [DINH-VI] [THUYET-MINH]
 * VAI TRÒ: LOGIC / DỮ LIỆU DÙNG CHUNG
 *
 * FILE NÀY LÀM GÌ:
 * Chọn nhãn/kiểu trình bày GPS từ trạng thái engine đã có.
 *
 * VỊ TRÍ: packages/ui-tokens/HienThiDinhVi.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/features/journey/components/TrangThaiDinhVi.tsx
 * - apps/web/src/features/journey/components/TrangThaiDinhVi.tsx
 *
 * PHỤ THUỘC:
 * - Không import module khác.
 *
 * CÁC KHỐI CHÍNH:
 * 1. gpsVisual
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
// ==================== [DINH-VI] [THUYET-MINH] gpsVisual ====================
export function gpsVisual(state: {
  gps: boolean
  fix?: object
  suggestedId?: string
  error?: string
}) {
  if (state.error === 'gpsFailed' || state.error === 'gpsWeak')
    return { key: state.error, error: true } as const
  if (!state.gps) return { key: 'gpsInactive', error: false } as const
  if (!state.fix) return { key: 'gpsWaiting', error: false } as const
  if (state.suggestedId) return { key: 'gpsNearby', error: false } as const
  return { key: 'gpsLocated', error: false } as const
}
