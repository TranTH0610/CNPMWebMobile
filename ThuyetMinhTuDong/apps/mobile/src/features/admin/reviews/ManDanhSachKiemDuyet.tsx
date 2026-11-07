/**
 * CHỨC NĂNG: [KIEM-DUYET]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Hàng chờ kiểm duyệt native chỉ hiển thị ảnh/tên/trạng thái. AdminNavigator gọi; bấm thẻ mở ReviewDetailScreen để xem bài và thao tác duyệt. TẠI SAO: FlatList nhẹ hơn việc mở sẵn mọi bài và trình nghe cùng lúc.
 *
 * VỊ TRÍ: apps/mobile/src/features/admin/reviews/ManDanhSachKiemDuyet.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/navigation/DieuHuongQuanTri.tsx
 *
 * PHỤ THUỘC:
 * - react
 * - react-native
 * - react-native-safe-area-context
 * - @expo/vector-icons
 * - @react-navigation/native-stack
 * - @travelguide/admin-core/react
 * - ../../../navigation/KieuDieuHuongQuanTri
 * - ../../../shared/components/AnhBia
 * - ../shared/components/ThanhPhanQuanTri
 * - ../../../shared/GiaoDienChung
 *
 * CÁC KHỐI CHÍNH:
 * 1. ReviewsScreen
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { useState } from 'react'
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
import type { AdminStack } from '../../../navigation/KieuDieuHuongQuanTri'
import { Cover } from '../../../shared/components/AnhBia'
import { Feedback, PageHeader, StatusBadge, styles } from '../shared/components/ThanhPhanQuanTri'
import { colors } from '../../../shared/GiaoDienChung'

// ==================== [KIEM-DUYET] ReviewsScreen ====================
// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider ReviewsScreen.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function ReviewsScreen({ navigation }: NativeStackScreenProps<AdminStack, 'Reviews'>) {
  const state = useAdmin(),
    t = useAdminText(),
    [filter, setFilter] = useState('all')
  const places =
    state.data?.places.filter(
      (p) =>
        ['submitted', 'approved', 'changes'].includes(p.workflow) &&
        (filter === 'all' || filter === p.workflow),
    ) ?? []
  return (
    <SafeAreaView style={styles.page} edges={['left', 'right', 'bottom']}>
      <FlatList
        data={places}
        keyExtractor={(p) => p.id}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={{ gap: 16 }}>
            <PageHeader title={t('reviews')} />
            <Feedback state={state} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {(['all', 'submitted', 'approved', 'changes'] as const).map((value) => (
                <Pressable
                  key={value}
                  accessibilityRole="button"
                  accessibilityState={{ selected: filter === value }}
                  onPress={() => setFilter(value)}
                  style={[
                    styles.languageChip,
                    filter === value && {
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                    },
                  ]}
                >
                  <Text style={{ color: filter === value ? colors.white : colors.text }}>
                    {value === 'all' ? t('allReviews') : t(`status_${value}`)}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        }
        ListEmptyComponent={
          !state.loading && !state.error ? (
            <View style={styles.card}>
              <Text style={styles.muted}>{t('empty')}</Text>
            </View>
          ) : undefined
        }
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('viewReview') + ': ' + item.record.canonicalTitle}
            onPress={() => navigation.navigate('ReviewDetail', { id: item.id })}
            style={({ pressed }) => [
              styles.card,
              { padding: 0, overflow: 'hidden' },
              pressed && styles.pressed,
            ]}
          >
            <Cover uri={item.record.images[0]} style={{ height: 180 }} />
            <View style={{ padding: 18, gap: 10 }}>
              <StatusBadge workflow={item.workflow} />
              <Text style={styles.heading}>{item.record.canonicalTitle}</Text>
              <Text style={styles.muted} numberOfLines={2}>
                {item.record.content.vi?.summary}
              </Text>
              <View style={[styles.row, { justifyContent: 'space-between' }]}>
                <Text style={styles.muted}>
                  {t('revision')}: {item.revision}
                </Text>
                <View style={styles.row}>
                  <Text style={[styles.label, { color: colors.primary }]}>{t('viewReview')}</Text>
                  <Ionicons name="chevron-forward" size={18} color={colors.primary} />
                </View>
              </View>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  )
}
