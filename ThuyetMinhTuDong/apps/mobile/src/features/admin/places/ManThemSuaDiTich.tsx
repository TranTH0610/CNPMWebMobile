/**
 * FILE: apps/mobile/src/features/admin/places/ManThemSuaDiTich.tsx
 * FILE NÀY LÀM GÌ: Nối route thêm/sửa di tích vào form native dùng chung. AdminNavigator gọi; PlaceEditor giữ UI, usePlaceEditor giữ nghiệp vụ giống web. TẠI SAO: Sau khi thêm, thay route bằng mã DT đã lưu để mở tiếp đúng bản nháp.
 * VAI TRÒ: Khởi tạo, điều hướng hoặc thành phần hỗ trợ ứng dụng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC10: Quản lý di tích.
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * - UC12: Kiểm duyệt nội dung và âm thanh.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { AdminStack } from '../../../navigation/KieuDieuHuongQuanTri'
import { PlaceEditor } from './components/BieuMauDiTich'
// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider PlaceFormScreen.
// [UC10 / UC11 / UC12] PlaceFormScreen — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider PlaceFormScreen.
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
