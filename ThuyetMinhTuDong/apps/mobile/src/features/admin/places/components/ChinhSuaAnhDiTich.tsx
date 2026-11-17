/**
 * FILE: apps/mobile/src/features/admin/places/components/ChinhSuaAnhDiTich.tsx
 * FILE NÀY LÀM GÌ: Chọn/xóa ảnh và đặt ảnh đại diện của form quản trị native. PlaceEditor gọi cho cả thêm và biên tập; dùng cùng thao tác ảnh với web qua admin-core. TẠI SAO: Hiện từng ảnh có vùng chạm rõ, không buộc người dùng xóa chuỗi data URI dài.
 * VAI TRÒ: Giao diện Mobile; gọi hook/service để xử lý nghiệp vụ.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC10: Quản lý di tích.
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * - UC12: Kiểm duyệt nội dung và âm thanh.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
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
// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider PlaceImagesEditor.
// [UC10 / UC11 / UC12] PlaceImagesEditor — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider PlaceImagesEditor.
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
