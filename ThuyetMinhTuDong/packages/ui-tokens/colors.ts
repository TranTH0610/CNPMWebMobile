/**
 * FILE NÀY LÀM GÌ:
 * Khai báo màu, khoảng cách và bo góc dùng lại cho giao diện.
 * apps/mobile/src/visitor/ui.tsx sử dụng.
 * Không phụ thuộc nền tảng; phục vụ UI UC01–UC05.
 */

// CHỨC NĂNG: Gom màu để các component dùng thống nhất.
// XỬ LÝ: Đổi màu tại đây thay vì sửa từng màn hình.
export const colors = {
  primary: '#4F46E5',
  background: '#FFFFFF',
  text: '#182235',
  muted: '#556174',
  border: '#D8DFEB',
  page: '#F5F7FB',
  danger: '#B42318',
  soft: '#ECEBFF',
}

// CHỨC NĂNG: Chuẩn hóa khoảng cách.
// XỬ LÝ: Component dùng tên mức thay vì rải số khắp nơi.
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
}

export const radii = {
  sm: 8,
  md: 16,
}