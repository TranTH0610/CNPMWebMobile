/**
 * CHỨC NĂNG: [QUAN-LY-DI-TICH] [LUU-NHAP]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Nối route thêm/sửa di tích vào form native dùng chung. AdminNavigator gọi; PlaceEditor giữ UI, usePlaceEditor giữ nghiệp vụ giống web. TẠI SAO: Sau khi thêm, thay route bằng mã DT đã lưu để mở tiếp đúng bản nháp.
 *
 * VỊ TRÍ: apps/mobile/src/features/admin/places/ManThemSuaDiTich.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/navigation/DieuHuongQuanTri.tsx
 *
 * PHỤ THUỘC:
 * - @react-navigation/native-stack
 * - ../../../navigation/KieuDieuHuongQuanTri
 * - ./components/BieuMauDiTich
 *
 * CÁC KHỐI CHÍNH:
 * 1. PlaceFormScreen
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { AdminStack } from '../../../navigation/KieuDieuHuongQuanTri'
import { PlaceEditor } from './components/BieuMauDiTich'
// ==================== [QUAN-LY-DI-TICH] [LUU-NHAP] PlaceFormScreen ====================
// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider PlaceFormScreen.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function PlaceFormScreen({
  route,
  navigation,
}: NativeStackScreenProps<AdminStack, 'PlaceForm'>) {
  return (
    <PlaceEditor
      id={route.params?.id}
      onCreated={(id) => navigation.replace('PlaceForm', { id })}
      onLeave={() => navigation.goBack()}
      onSubmitted={() => navigation.replace('PlaceForm', { submitted: true })}
      submittedNotice={route.params?.submitted}
    />
  )
}
