/**
 * CHỨC NĂNG: [QUAN-LY-DI-TICH] [LUU-NHAP]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Danh sách di tích trong admin mobile; mở biểu mẫu hoặc nội dung và thực hiện các thao tác quản lý được cung cấp.
 *
 * VỊ TRÍ: apps/mobile/src/features/admin/places/ManDanhSachDiTich.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/navigation/DieuHuongQuanTri.tsx
 *
 * PHỤ THUỘC:
 * - react
 * - react-native
 * - @expo/vector-icons
 * - react-native-safe-area-context
 * - @react-navigation/native-stack
 * - @travelguide/visitor-core
 * - @travelguide/visitor-core/react
 * - @travelguide/admin-core/react
 * - ../../../navigation/KieuDieuHuongQuanTri
 * - ../../../shared/components/NutThaoTac
 * - ../../../shared/components/AnhBia
 * - ../shared/components/ThanhPhanQuanTri
 * - ../../../shared/GiaoDienChung
 *
 * CÁC KHỐI CHÍNH:
 * 1. AdminPlacesScreen
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { useMemo, useState } from 'react'
import { FlatList, ScrollView, Pressable, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { normalize } from '@travelguide/visitor-core'
import { useDebounce } from '@travelguide/visitor-core/react'
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
import type { AdminStack } from '../../../navigation/KieuDieuHuongQuanTri'
import { Action } from '../../../shared/components/NutThaoTac'
import { Cover } from '../../../shared/components/AnhBia'
import { Feedback, PageHeader, StatusBadge, styles } from '../shared/components/ThanhPhanQuanTri'
import { colors } from '../../../shared/GiaoDienChung'
// CHỨC NĂNG: Danh sách di tích trong admin mobile; mở biểu mẫu hoặc nội dung và thực hiện các thao
// tác quản lý được cung cấp.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.

// ==================== [QUAN-LY-DI-TICH] [LUU-NHAP] AdminPlacesScreen ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function AdminPlacesScreen({
  navigation,
}: NativeStackScreenProps<AdminStack, 'AdminPlaces'>) {
  // CHỨC NĂNG: Từ khóa người dùng đang gõ; giá trị lọc có thể được trì hoãn bằng debounce.

  const state = useAdmin(),
    t = useAdminText(),
    [query, setQuery] = useState(''),
    debounced = useDebounce(query)

  const [workflow, setWorkflow] = useState('all')
  const places = useMemo(
    () =>
      state.data?.places.filter(
        (p) =>
          (workflow === 'all' || p.workflow === workflow) &&
          normalize(p.record.canonicalTitle).includes(normalize(debounced)),
      ) ?? [],
    [state.data, debounced, workflow],
  )

  return (
    <SafeAreaView style={styles.page} edges={['left', 'right', 'bottom']}>
      <FlatList
        style={{ flex: 1 }}
        contentInsetAdjustmentBehavior="automatic"
        automaticallyAdjustsScrollIndicatorInsets
        keyboardShouldPersistTaps="handled"
        data={places}
        keyExtractor={(place) => place.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={{ gap: 16 }}>
            <PageHeader title={t('places')} description={t('catalogHint')} />
            <Feedback state={state} />
            <Action
              title={t('new')}
              icon="add-outline"
              variant="primary"
              onPress={() => navigation.navigate('PlaceForm')}
            />
            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={20} color={colors.muted} />
              <TextInput
                style={styles.searchInput}
                accessibilityLabel={t('search')}
                placeholder={t('search')}
                placeholderTextColor={colors.muted}
                value={query}
                onChangeText={setQuery}
                autoCorrect={false}
              />
              {!!query && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t('clearSearch')}
                  onPress={() => setQuery('')}
                  style={{ padding: 8 }}
                >
                  <Ionicons name="close-circle" size={20} color={colors.muted} />
                </Pressable>
              )}
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {(
                [
                  'all',
                  'draft',
                  'submitted',
                  'changes',
                  'approved',
                  'published',
                  'archived',
                ] as const
              ).map((value) => (
                <Pressable
                  key={value}
                  accessibilityRole="button"
                  accessibilityState={{ selected: workflow === value }}
                  onPress={() => setWorkflow(value)}
                  style={[
                    styles.languageChip,
                    workflow === value && {
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: workflow === value ? colors.white : colors.muted,
                    }}
                  >
                    {value === 'all' ? t('places') : t(`status_${value}`)}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <Text style={styles.muted}>
              {places.length} {t('places')}
            </Text>
          </View>
        }
        ListEmptyComponent={
          !state.loading && !state.error ? (
            <View style={[styles.card, { alignItems: 'center', paddingVertical: 28 }]}>
              <Ionicons name="search-outline" size={32} color={colors.muted} />
              <Text style={styles.muted}>{t('empty')}</Text>
            </View>
          ) : undefined
        }
        // CHỨC NĂNG: FlatList chỉ dựng các thẻ cần thiết; ảnh cố định, nội dung tự xuống dòng.
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <Cover uri={item.record.images[0]} style={styles.listImage} />
              <View style={{ flex: 1, minWidth: 0, gap: 8 }}>
                <StatusBadge workflow={item.workflow} />
                <Text numberOfLines={2} style={styles.heading}>
                  {item.record.canonicalTitle}
                </Text>
                {!!item.period && (
                  <Text numberOfLines={1} style={styles.muted}>
                    {item.period}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.divider} />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Action
                  title={t('edit')}
                  icon="create-outline"
                  onPress={() => navigation.navigate('PlaceForm', { id: item.id })}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Action
                  title={t('content')}
                  icon="document-text-outline"
                  variant="primary"
                  onPress={() => navigation.navigate('Content', { id: item.id })}
                />
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  )
}
// TẠI SAO (AdminPlacesScreen): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi
// qua lớp dùng chung.
/* CÁCH KIỂM TRA: 'ky dai' tìm đúng; xóa tìm khôi phục danh sách; hai nút truyền đúng place ID. */
