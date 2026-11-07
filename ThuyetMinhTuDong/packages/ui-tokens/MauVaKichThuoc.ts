/**
 * CHỨC NĂNG: [GIAO-DIEN]
 * VAI TRÒ: LOGIC / DỮ LIỆU DÙNG CHUNG
 *
 * FILE NÀY LÀM GÌ:
 * Token nhận diện Hue Imperial Heritage dùng chung web và mobile.
 *
 * VỊ TRÍ: packages/ui-tokens/MauVaKichThuoc.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/features/explore/GiaoDienKhamPha.ts
 * - apps/mobile/src/shared/GiaoDienChung.ts
 * - apps/web/src/main-admin.tsx
 * - apps/web/src/main.tsx
 *
 * PHỤ THUỘC:
 * - Không import module khác.
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
export const colors = {
  primary: '#8B2635',
  primaryPressed: '#6E1B29',
  secondary: '#234B4B',
  gold: '#C6A667',
  goldInk: '#806029',
  playerBackground: '#183C3C',
  playerMuted: '#E2E8DE',
  playerControl: '#345B57',
  playerAccent: '#E9CD96',
  background: '#FFFDFA',
  text: '#242424',
  muted: '#68635C',
  border: '#DED6C8',
  page: '#F8F5EE',
  soft: '#F5E9E9',
  tealSoft: '#EAF0EA',
  danger: '#A82B25',
  dangerSoft: '#FCEEEA',
  success: '#285C42',
  successSoft: '#EDF5EE',
  overlay: 'rgba(20, 34, 31, 0.76)',
  white: '#FFFFFF',
  transparent: 'transparent',
}
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, section: 48 }
export const radii = { sm: 10, md: 18, lg: 26, pill: 999 }
// CHỨC NĂNG: Thang chữ không ép font native; hệ điều hành tự chọn glyph Việt/Nhật/Trung phù hợp.
export const typography = { caption: 12, label: 14, body: 16, heading: 22, title: 30, hero: 38 }
export const motion = { fast: 140, standard: 220 }
export const elevation = {
  card: {
    shadowColor: '#242424',
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
}
