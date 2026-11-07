/**
 * CHỨC NĂNG: [THONG-KE]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Tổng quan admin mobile với phiên hoạt động, lượt QR, di tích và chờ duyệt; có liên kết đến thao tác quản lý.
 *
 * VỊ TRÍ: apps/mobile/src/features/admin/dashboard/ManTongQuan.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/navigation/DieuHuongQuanTri.tsx
 *
 * PHỤ THUỘC:
 * - react
 * - react-native
 * - @expo/vector-icons
 * - @react-navigation/native-stack
 * - @travelguide/admin-core
 * - @travelguide/admin-core/react
 * - @travelguide/visitor-core/presence/react
 * - ../../../navigation/KieuDieuHuongQuanTri
 * - ../shared/services/KetNoiDichVuQuanTri
 * - ../../presence/services/PhienHoatDong
 * - ../../../shared/components/NutThaoTac
 * - ../shared/components/ThanhPhanQuanTri
 * - ../../../shared/GiaoDienChung
 *
 * CÁC KHỐI CHÍNH:
 * 1. DashboardScreen
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { useMemo, type ComponentProps } from 'react'
import { Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { dashboard } from '@travelguide/admin-core'
import { useAdmin, useAdminText, useGateStatistics } from '@travelguide/admin-core/react'
import { usePresenceStatistics } from '@travelguide/visitor-core/presence/react'
import type { AdminStack } from '../../../navigation/KieuDieuHuongQuanTri'
import { gateClient } from '../shared/services/KetNoiDichVuQuanTri'
import { adminPresenceClient } from '../../presence/services/PhienHoatDong'
import { Action } from '../../../shared/components/NutThaoTac'
import {
  Frame,
  Feedback,
  QuickAction,
  SectionHeading,
  styles,
} from '../shared/components/ThanhPhanQuanTri'
import { colors } from '../../../shared/GiaoDienChung'

// CHỨC NĂNG: Tổng quan admin mobile với phiên hoạt động, lượt QR, di tích và chờ duyệt; có liên
// kết đến thao tác quản lý.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.

// ==================== [THONG-KE] DashboardScreen ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function DashboardScreen({ navigation }: NativeStackScreenProps<AdminStack, 'Dashboard'>) {
  const state = useAdmin(),
    t = useAdminText(),
    presence = usePresenceStatistics(adminPresenceClient),
    gate = useGateStatistics(gateClient)
  // CHỨC NĂNG: Tính số liệu quản trị khi document thay đổi, không tính lại chỉ vì UI render.

  const metrics = useMemo(() => (state.data ? dashboard(state.data) : null), [state.data])

  const icons: Record<
    'active' | 'gateToday' | 'places' | 'pending',
    ComponentProps<typeof Ionicons>['name']
  > = {
    active: 'people-outline',
    gateToday: 'qr-code-outline',
    places: 'business-outline',
    pending: 'time-outline',
  }

  return (
    <Frame>
      <View style={styles.hero}>
        <Text style={styles.brand}>HUEGUIDE</Text>
        <Text style={styles.heroTitle}>{t('dashboard')}</Text>
        <Text style={styles.heroText}>{t('overviewHint')}</Text>
      </View>
      <Feedback state={state} />
      {/* CHỨC NĂNG: Active lấy API RAM, ba chỉ số khác lấy service cũ; không giả lập số. */}
      <View style={[styles.row, { alignItems: 'stretch', gap: 12 }]}>
        {metrics &&
          (['active', 'gateToday', 'places', 'pending'] as const).map((key) => (
            <View
              key={key}
              style={[
                styles.metric,
                key === 'active' && {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
              ]}
            >
              <View
                style={[
                  styles.metricIcon,
                  key === 'active' && { backgroundColor: colors.playerControl },
                ]}
              >
                <Ionicons
                  name={icons[key]}
                  size={19}
                  color={key === 'active' ? colors.white : colors.primary}
                />
              </View>
              <Text style={[styles.metricLabel, key === 'active' && { color: colors.white }]}>
                {t(key === 'pending' ? 'status_submitted' : key)}
              </Text>
              <Text style={[styles.number, key === 'active' && { color: colors.white }]}>
                {key === 'active'
                  ? (presence.stats?.active ?? '—')
                  : key === 'gateToday'
                    ? (gate.stats?.today ?? '—')
                    : metrics[key]}
              </Text>
            </View>
          ))}
      </View>
      {presence.error ? (
        <View style={styles.card}>
          <Text style={styles.error} accessibilityRole="alert">
            {t('presenceError')}
          </Text>
          <Action title={t('retry')} icon="refresh-outline" onPress={presence.retry} />
        </View>
      ) : !presence.stats ? (
        <Text style={styles.muted}>{t('loading')}</Text>
      ) : null}
      {gate.error && (
        <View style={styles.card}>
          <Text style={styles.error}>{t('gateError')}</Text>
          <Action title={t('retry')} onPress={gate.retry} />
        </View>
      )}
      <SectionHeading title={t('quickActions')} icon="grid-outline" />
      <QuickAction
        title={t('places')}
        description={t('managePlacesHint')}
        icon="business-outline"
        onPress={() => navigation.navigate('AdminPlaces')}
      />
      <QuickAction
        title={t('reviews')}
        description={t('reviewQueueHint')}
        icon="shield-checkmark-outline"
        onPress={() => navigation.navigate('Reviews')}
      />
      <Action
        title={t('new')}
        icon="add-outline"
        variant="primary"
        onPress={() => navigation.navigate('PlaceForm')}
      />
    </Frame>
  )
}
// TẠI SAO (DashboardScreen): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi
// qua lớp dùng chung.
/* CÁCH KIỂM TRA: Bốn ô không tràn; hai mục thao tác mở đúng màn; mất RAM server hiện —/thử lại. */
