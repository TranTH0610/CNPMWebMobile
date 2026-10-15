/**
 * FILE NÀY LÀM GÌ:
 * Cung cấp màu, khoảng cách và kích thước dùng chung.
 * Mobile sử dụng qua src/theme.ts; web có thể dùng ở Giai đoạn 3.
 * Không phụ thuộc React Native. Liên quan giao diện UC03.
 */

// CHỨC NĂNG: tập trung màu sắc.
// XỬ LÝ: giữ các tên màu cũ để code đang dùng không lỗi.
export const colors = {
  primary: '#4F46E5',
  background: '#FFFFFF',
  text: '#111111',

  page: '#F5F7FB',
  muted: '#596579',
  border: '#DCE2EC',
  softPrimary: '#ECEBFF',
  danger: '#B42318',
  favorite: '#BE185D',
  placeholder: '#E8EDF5',
}

// CHỨC NĂNG: dùng một thang khoảng cách thống nhất.
// XỬ LÝ: sửa spacing ở đây thay vì sửa từng component.
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
}

// CHỨC NĂNG: các mức bo góc và cỡ chữ.
export const radii = {
  sm: 8,
  md: 16,
  round: 999,
}

export const fonts = {
  caption: 12,
  small: 14,
  body: 16,
  section: 20,
  title: 26,
}

// CHỨC NĂNG: kích thước dùng lại trong giao diện.
// XỬ LÝ: touch tối thiểu 44 giúp nút dễ bấm.
export const sizes = {
  icon: 22,
  touch: 44,
  avatar: 48,
  thumbnail: 96,
  heroImage: 176,
  maxFeaturedWidth: 360,
}