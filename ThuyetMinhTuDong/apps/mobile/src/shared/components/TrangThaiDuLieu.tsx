/**
 * CHỨC NĂNG: [DUNG-CHUNG]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Thành phần hiển thị đang tải, thông báo lỗi hoặc rỗng và thao tác thử lại tùy props.
 *
 * VỊ TRÍ: apps/mobile/src/shared/components/TrangThaiDuLieu.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/features/explore/screens/ManKhamPha.tsx
 * - apps/mobile/src/features/place-detail/screens/ManChiTietDiTich.tsx
 *
 * PHỤ THUỘC:
 * - ../GiaoDienChung
 * - ./NutThaoTac
 * - react-native
 * - @travelguide/visitor-core
 * - ../../features/language/i18n/CauHinhNgonNgu
 *
 * CÁC KHỐI CHÍNH:
 * 1. State
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { ui, colors } from '../GiaoDienChung'
import { Action } from './NutThaoTac'
import { ActivityIndicator, Text, View } from 'react-native'
import type { MessageKey } from '@travelguide/visitor-core'
import { useText } from '../../features/language/i18n/CauHinhNgonNgu'

// CHỨC NĂNG: Hiển thị loading, thông báo và thao tác khôi phục.
// XỬ LÝ: Chỉ nhận key dịch; không hiện lỗi kỹ thuật từ API.

// ==================== [DUNG-CHUNG] State ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
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
