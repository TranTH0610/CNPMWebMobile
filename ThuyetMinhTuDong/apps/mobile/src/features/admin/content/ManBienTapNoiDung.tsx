/**
 * FILE: apps/mobile/src/features/admin/content/ManBienTapNoiDung.tsx
 * FILE NÀY LÀM GÌ: Mở cùng form đầy đủ từ nút Biên tập, không giữ một form riêng thiếu metadata. AdminNavigator gọi; PlaceEditor dùng chung logic lưu nháp/dịch/audio/gửi duyệt với web.
 * VAI TRÒ: Khởi tạo, điều hướng hoặc thành phần hỗ trợ ứng dụng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * - UC12: Kiểm duyệt nội dung và âm thanh.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { AdminStack } from '../../../navigation/KieuDieuHuongQuanTri'
import { PlaceEditor } from '../places/components/BieuMauDiTich'
// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider ContentEditorScreen.
// [UC11 / UC12] ContentEditorScreen — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider ContentEditorScreen.
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
