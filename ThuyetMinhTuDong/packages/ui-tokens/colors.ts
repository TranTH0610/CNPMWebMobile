/**
 * FILE NÀY LÀM GÌ
 * Các giá trị màu dùng chung để giao diện web/mobile có cùng bảng màu.
 *
 * VỊ TRÍ: packages/ui-tokens/colors.ts
 * DÙNG BỞI: apps/mobile/src/styles/explore.ts; apps/mobile/src/theme.ts;
 * apps/web/src/main-admin.tsx; và các nơi import khác.
 * TẠI SAO TÁCH FILE: Tách phần trình bày giúp đổi màu/bố cục đồng bộ mà không chạm vào nghiệp
 * vụ.
 */
// CHỨC NĂNG: Tập trung màu để các màn hiển thị thống nhất.
// XỬ LÝ: Giữ tên token cũ, bổ sung màu cho hero và nền.
// Khai báo colors: tạo object gồm primary, playerBackground, playerMuted, playerControl, playerAccent, background, text, muted, border.
export const colors = {
  // Gán thuộc tính primary: chuỗi '#1667E8'.
  primary: '#1667E8',
  // Gán thuộc tính playerBackground: chuỗi '#102950'.
  playerBackground: '#102950',
  // Gán thuộc tính playerMuted: chuỗi '#BED0E9'.
  playerMuted: '#BED0E9',
  // Gán thuộc tính playerControl: chuỗi '#294264'.
  playerControl: '#294264',
  // Gán thuộc tính playerAccent: chuỗi '#8FC8FF'.
  playerAccent: '#8FC8FF',
  // Gán thuộc tính background: chuỗi '#FFFFFF'.
  background: '#FFFFFF',
  // Gán thuộc tính text: chuỗi '#101D50'.
  text: '#101D50',
  // Gán thuộc tính muted: chuỗi '#637194'.
  muted: '#637194',
  // Gán thuộc tính border: chuỗi '#E4EAF5'.
  border: '#E4EAF5',
  // Gán thuộc tính page: chuỗi '#F3F6FC'.
  page: '#F3F6FC',
  // Gán thuộc tính danger: chuỗi '#B42318'.
  danger: '#B42318',
  // Gán thuộc tính soft: chuỗi '#EAF2FF'.
  soft: '#EAF2FF',
  // Gán thuộc tính overlay: chuỗi 'rgba(8, 22, 34, 0.68)'.
  overlay: 'rgba(8, 22, 34, 0.68)',
  // Gán thuộc tính white: chuỗi '#FFFFFF'.
  white: '#FFFFFF',
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `transparent: 'transparent',`: Gán thuộc tính transparent: chuỗi 'transparent'.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  transparent: 'transparent',
}

// Khai báo spacing: tạo object gồm xs, sm, md, lg, xl, xxl.
export const spacing = {
  // Gán thuộc tính xs: giá trị số 4.
  xs: 4,
  // Gán thuộc tính sm: giá trị số 8.
  sm: 8,
  // Gán thuộc tính md: giá trị số 12.
  md: 12,
  // Gán thuộc tính lg: giá trị số 16.
  lg: 16,
  // Gán thuộc tính xl: giá trị số 24.
  xl: 24,
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `xxl: 32,`: Gán thuộc tính xxl: giá trị số 32.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  xxl: 32,
}

// Khai báo radii: tạo object gồm sm, md, lg.
export const radii = {
  // Gán thuộc tính sm: giá trị số 10.
  sm: 10,
  // Gán thuộc tính md: giá trị số 16.
  md: 16,
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `lg: 24,`: Gán thuộc tính lg: giá trị số 24.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  lg: 24,
}