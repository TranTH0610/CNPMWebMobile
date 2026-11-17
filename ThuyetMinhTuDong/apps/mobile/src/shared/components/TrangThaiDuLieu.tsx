/**
 * FILE: apps/mobile/src/shared/components/TrangThaiDuLieu.tsx
 * FILE NÀY LÀM GÌ: Thành phần hiển thị đang tải, thông báo lỗi hoặc rỗng và thao tác thử lại tùy props.
 * VAI TRÒ: Giao diện Mobile; gọi hook/service để xử lý nghiệp vụ.
 * UC: Hỗ trợ chung; không thực hiện một UC độc lập.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { ui, colors } from '../GiaoDienChung'
import { Action } from './NutThaoTac'
import { ActivityIndicator, Text, View } from 'react-native'
import type { MessageKey } from '@travelguide/visitor-core'
import { useText } from '../../features/language/i18n/CauHinhNgonNgu'

// CHỨC NĂNG: Hiển thị loading, thông báo và thao tác khôi phục.
// XỬ LÝ: Chỉ nhận key dịch; không hiện lỗi kỹ thuật từ API.

// [HỖ TRỢ CHUNG] State — Hiển thị loading, thông báo và thao tác khôi phục.
export function State({
  message,
  busy = false,
  retry,
  back,
}: {
  message: MessageKey

  busy?: boolean

  retry?: () => void

  back?: () => void
}) {
  const t = useText()

  return (
    <View style={ui.content}>
      {busy && (
        <>
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={{ gap: 12 }}
          >
            {[0, 1, 2].map((item) => (
              <View
                key={item}
                style={{
                  height: 90,
                  borderRadius: 16,
                  backgroundColor: colors.border,
                  opacity: 0.5,
                }}
              />
            ))}
          </View>
          <ActivityIndicator color={colors.primary} accessibilityLabel={t('loading')} />
        </>
      )}

      <Text accessibilityRole={busy ? 'text' : 'alert'} style={ui.text}>
        {t(message)}
      </Text>

      {retry && <Action title={t('retry')} onPress={retry} />}

      {back && <Action title={t('back')} onPress={back} />}
    </View>
  )
}
// TẠI SAO (State): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện tại
// một nơi.
