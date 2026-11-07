/**
 * CHỨC NĂNG: [QUAN-LY-DI-TICH] [LUU-NHAP]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Chọn/xóa ảnh và đặt ảnh đại diện của form quản trị native. PlaceEditor gọi cho cả thêm và biên tập; dùng cùng thao tác ảnh với web qua admin-core. TẠI SAO: Hiện từng ảnh có vùng chạm rõ, không buộc người dùng xóa chuỗi data URI dài.
 *
 * VỊ TRÍ: apps/mobile/src/features/admin/places/components/ChinhSuaAnhDiTich.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/features/admin/places/components/BieuMauDiTich.tsx
 *
 * PHỤ THUỘC:
 * - react-native
 * - @travelguide/admin-core
 * - @travelguide/admin-core/react
 * - ../../../../shared/components/AnhBia
 * - ../../../../shared/components/NutThaoTac
 * - ../../shared/components/ThanhPhanQuanTri
 * - ../../shared/components/ChonTepTuThietBi
 * - ../../../../shared/GiaoDienChung
 *
 * CÁC KHỐI CHÍNH:
 * 1. PlaceImagesEditor
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { StyleSheet, Text, View } from 'react-native'
import {
  editImageLinks,
  imageList,
  removePlaceImage,
  selectCoverImage,
} from '@travelguide/admin-core'
import { useAdminText } from '@travelguide/admin-core/react'
import { Cover } from '../../../../shared/components/AnhBia'
import { Action } from '../../../../shared/components/NutThaoTac'
import { Field } from '../../shared/components/ThanhPhanQuanTri'
import { LocalMediaPicker } from '../../shared/components/ChonTepTuThietBi'
import { colors, spacing } from '../../../../shared/GiaoDienChung'
// ==================== [QUAN-LY-DI-TICH] [LUU-NHAP] PlaceImagesEditor ====================
// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider PlaceImagesEditor.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function PlaceImagesEditor({
  value,
  disabled,
  onChange,
}: {
  value: string
  disabled: boolean
  onChange: (value: string) => void
}) {
  const t = useAdminText(),
    images = imageList(value)
  return (
    <View style={styles.editor}>
      {images[0] && <Cover uri={images[0]} style={styles.cover} />}
      {images.map((image, index) => (
        <View key={image} style={styles.option}>
          <Cover uri={image} style={styles.thumbnail} />
          <View style={styles.info}>
            <Text style={styles.label}>
              {t('imageNumber')} {index + 1}
              {index === 0 ? ' · ' + t('coverImage') : ''}
            </Text>
            <View style={styles.actions}>
              <Action
                title={t('makeCover')}
                disabled={disabled || index === 0}
                onPress={() => onChange(selectCoverImage(value, image))}
              />
              <Action
                title={t('removeImage')}
                disabled={disabled}
                onPress={() => onChange(removePlaceImage(value, image))}
              />
            </View>
          </View>
        </View>
      ))}
      <Field
        label={t('images')}
        multiline
        editable={!disabled}
        value={value
          .split('\n')
          .filter((item) => !item.startsWith('data:'))
          .join('\n')}
        onChange={(links) => onChange(editImageLinks(value, links))}
      />
      {/* CHỨC NĂNG: Ảnh mới trở thành ảnh đại diện ngay; vẫn giữ các ảnh khác để chọn lại. */}
      <LocalMediaPicker
        kind="image"
        disabled={disabled}
        onPick={(image) => onChange(selectCoverImage(value, image))}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  editor: { gap: spacing.md },
  cover: { height: 190, borderRadius: 16 },
  option: {
    flexDirection: 'row',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    borderRadius: 12,
  },
  thumbnail: { width: 64, height: 70, borderRadius: 8 },
  info: { flex: 1, gap: spacing.sm },
  label: { color: colors.text, fontSize: 14, lineHeight: 22, fontWeight: '600' },
  actions: { gap: spacing.sm },
})
