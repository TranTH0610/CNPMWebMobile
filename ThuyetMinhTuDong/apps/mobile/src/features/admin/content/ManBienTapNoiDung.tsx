/**
 * CHỨC NĂNG: [BIEN-TAP] [THUYET-MINH]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Mở cùng form đầy đủ từ nút Biên tập, không giữ một form riêng thiếu metadata. AdminNavigator gọi; PlaceEditor dùng chung logic lưu nháp/dịch/audio/gửi duyệt với web.
 *
 * VỊ TRÍ: apps/mobile/src/features/admin/content/ManBienTapNoiDung.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/navigation/DieuHuongQuanTri.tsx
 *
 * PHỤ THUỘC:
 * - @react-navigation/native-stack
 * - ../../../navigation/KieuDieuHuongQuanTri
 * - ../places/components/BieuMauDiTich
 *
 * CÁC KHỐI CHÍNH:
 * 1. ContentEditorScreen
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { AdminStack } from '../../../navigation/KieuDieuHuongQuanTri'
import { PlaceEditor } from '../places/components/BieuMauDiTich'
// ==================== [BIEN-TAP] [THUYET-MINH] ContentEditorScreen ====================
// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider ContentEditorScreen.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function ContentEditorScreen({
  route,
  navigation,
}: NativeStackScreenProps<AdminStack, 'Content'>) {
  return (
    <PlaceEditor
      id={route.params.id}
      onCreated={(id) => navigation.replace('Content', { id })}
      onLeave={() => navigation.goBack()}
      onSubmitted={() => navigation.replace('PlaceForm', { submitted: true })}
    />
  )
}
