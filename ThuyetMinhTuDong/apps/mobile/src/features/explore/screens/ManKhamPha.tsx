/**
 * CHỨC NĂNG: [KHAM-PHA]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Màn khám phá mobile: ảnh bìa, tìm kiếm, chip danh mục, điểm nổi bật và danh sách điểm tham quan.
 *
 * VỊ TRÍ: apps/mobile/src/features/explore/screens/ManKhamPha.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/features/explore/screens/ManKetQuaTimKiem.tsx
 * - apps/mobile/src/navigation/ThanhDieuHuongDuKhach.tsx
 *
 * PHỤ THUỘC:
 * - ../components/KhoiChaoMung
 * - react
 * - react-native
 * - react-native-safe-area-context
 * - @react-navigation/native
 * - @react-navigation/native-stack
 * - @travelguide/visitor-core
 * - ../hooks/useDanhSachDiTich
 * - ../../language/i18n/CauHinhNgonNgu
 * - ../../../shared/components/NutThaoTac
 * - ../../../shared/components/TrangThaiDuLieu
 * - ../../../shared/GiaoDienChung
 * - ../components/NutLocDanhMuc
 * - ../components/TheDiTich
 * - ../components/OTimKiem
 * - ../components/ChonSapXep
 * - ../GiaoDienKhamPha
 * - ../../../shared/services/KetNoiNenTang
 * - ../../../navigation/KieuDieuHuongDuKhach
 *
 * CÁC KHỐI CHÍNH:
 * 1. HomeScreen
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { ExploreHero } from '../components/KhoiChaoMung'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Alert, FlatList, Pressable, Text, View, useWindowDimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { categoryOf } from '@travelguide/visitor-core'
import type { Category, PlaceRecord, SortOrder } from '@travelguide/visitor-core'
import { useExplore, usePublishedCatalog, useVisitorPosition } from '../hooks/useDanhSachDiTich'
import { useText } from '../../language/i18n/CauHinhNgonNgu'
import { Action } from '../../../shared/components/NutThaoTac'
import { State } from '../../../shared/components/TrangThaiDuLieu'
import { colors, spacing } from '../../../shared/GiaoDienChung'
import { CategoryChips } from '../components/NutLocDanhMuc'
import { PlaceCard } from '../components/TheDiTich'
import { SearchBar } from '../components/OTimKiem'
import { SortDropdown } from '../components/ChonSapXep'
import { explore } from '../GiaoDienKhamPha'
import { getPosition } from '../../../shared/services/KetNoiNenTang'
import type { VisitorStack } from '../../../navigation/KieuDieuHuongDuKhach'

// CHỨC NĂNG: Ghép dữ liệu và điều kiện vào danh sách.
// XỬ LÝ: Dùng một FlatList dọc; carousel cuộn ngang bên trong header.

// ==================== [KHAM-PHA] HomeScreen ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export default function HomeScreen({
  search = false,
  initial,
}: {
  search?: boolean

  initial?: {
    query?: string

    category?: Category
  }
}) {
  const navigation = useNavigation<NativeStackNavigationProp<VisitorStack>>()

  const data = usePublishedCatalog()

  const position = useVisitorPosition(getPosition)

  const filters = useExplore(data.places, position.origin, initial)

  const t = useText()

  const { width } = useWindowDimensions()

  const cardWidth = Math.max(240, width - spacing.lg * 2 - spacing.sm)

  const [slide, setSlide] = useState(0)
  // CHỨC NĂNG: Đánh dấu ô tìm kiếm còn trống khi gửi để hiển thị gợi ý nhập.

  const [searchRequired, setSearchRequired] = useState(false)

  const [draftQuery, setDraftQuery] = useState(initial?.query ?? '')

  const query = search ? filters.query : draftQuery

  const list = useRef<FlatList>(null)

  const featuredList = useRef<FlatList<PlaceRecord>>(null)

  // CHỨC NĂNG: Tính lại địa điểm nổi bật khi dữ liệu hoặc danh mục chọn thay đổi.

  const featured = useMemo(
    () =>
      data.places.filter(
        (place) =>
          place.featured &&
          (!filters.categories.length || filters.categories.includes(categoryOf(place))),
      ),
    [data.places, filters.categories],
  )

  // CHỨC NĂNG: Đổi danh mục hoặc xoay màn hình thì về thẻ đầu, tránh chấm nằm ngoài danh sách mới.
  // XỬ LÝ: Ref chỉ cuộn khi carousel có dữ liệu và đang được gắn vào màn.
  // CHỨC NĂNG: Đưa chỉ số carousel về 0; nếu có thẻ thì cuộn danh sách về đầu.
  // XỬ LÝ: featured hoặc cardWidth đổi sẽ làm effect đặt lại vị trí, không dùng animation
  // khi reset.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: featured,
  // cardWidth.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => {
    // Cập nhật trạng thái qua setSlide(0).
    setSlide(0)

    if (featured.length) featuredList.current?.scrollToOffset({ offset: 0, animated: false })
  }, [featured, cardWidth])
  // TẠI SAO: Đổi danh mục hoặc kích thước thẻ có thể làm chỉ số slide cũ không còn đúng với dữ
  // liệu mới.

  // CHỨC NĂNG: Đổi thứ tự và xin vị trí khi người dùng yêu cầu.
  // XỬ LÝ: Chọn theo tên không xin quyền GPS.

  const onSort = (order: SortOrder) => {
    filters.setOrder(order)

    if (order === 'nearest' && !position.origin) {
      void position.request()
    }
  }
  // TẠI SAO (onSort): Tách request giúp các nơi gọi dùng cùng địa chỉ, định dạng và cách xử lý
  // lỗi.

  // CHỨC NĂNG: Đồng nhất web: gửi rỗng báo lỗi, gửi có chữ mở kết quả cùng danh mục.
  // XỬ LÝ: Không chuyển màn ngay lúc chạm ô nhập; trim loại từ khóa chỉ có khoảng trắng.

  const openSearch = () => {
    if (!query.trim()) {
      setSearchRequired(true)
      return
    }
    // Cập nhật trạng thái qua setSearchRequired(false).
    setSearchRequired(false)

    if (!search)
      navigation.navigate('Search', { query: query.trim(), category: filters.categories[0] })
  }
  // TẠI SAO (openSearch): Chặn từ khóa chỉ có khoảng trắng trước khi chuyển route để người dùng
  // biết cần nhập gì và giữ được điều kiện tìm hợp lệ.

  const changeQuery = (value: string) => {
    if (search) filters.setQuery(value)
    else setDraftQuery(value)

    if (value.trim()) setSearchRequired(false)
  }
  // TẠI SAO (changeQuery): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua
  // lớp dùng chung.

  const changeCategories = (value: Category[]) => {
    filters.setCategories(value)

    setSlide(0)
  }
  // TẠI SAO (changeCategories): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi
  // qua lớp dùng chung.

  return (
    <SafeAreaView style={explore.page} edges={['top', 'left', 'right']}>
      <FlatList
        ref={list}
        data={data.error ? [] : filters.results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom: spacing.xl,
        }}
        keyboardShouldPersistTaps="handled"
        refreshing={data.loading && data.places.length > 0}
        onRefresh={() => {
          void data.reload()
        }}

        // CHỨC NĂNG: Dựng từng card khi cần.
        // XỬ LÝ: key theo ID ổn định, không dùng index.
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: spacing.lg }}>
            <PlaceCard
              place={item}
              origin={position.origin}
              onOpen={() =>
                navigation.navigate('Detail', {
                  placeId: item.id,
                })
              }
            />
          </View>
        )}

        ListHeaderComponent={
          <View>
            {!search ? (
              <ExploreHero
                query={query}
                onChange={changeQuery}
                onSubmit={openSearch}
                onExplore={() => navigation.navigate('Search', {})}
                onMap={() => navigation.navigate('Journey', {})}
                searchRequired={searchRequired}
              />
            ) : (
              <View style={explore.body}>
                <SearchBar
                  value={query}
                  onChange={changeQuery}
                  onSubmit={openSearch}
                  autoFocus
                  onBack={() => navigation.goBack()}
                  onFilter={() =>
                    Alert.alert(t('sort'), undefined, [
                      {
                        text: t('nearest'),
                        onPress: () => onSort('nearest'),
                      },
                      {
                        text: t('name'),
                        onPress: () => onSort('name'),
                      },
                      {
                        text: t('close'),
                        style: 'cancel',
                      },
                    ])
                  }
                />
              </View>
            )}

            <View style={explore.body}>
              {search && searchRequired && (
                <Text accessibilityRole="alert" style={explore.muted}>
                  {t('searchRequired')}
                </Text>
              )}
              <CategoryChips
                categories={filters.availableCategories}
                selected={filters.categories}
                onSelect={changeCategories}
              />

              {/* CHỨC NĂNG: Mobile có cùng lọc khu vực và xóa lọc như sidebar web.
                  XỬ LÝ: Bấm đổi điều kiện ngay; không đợi nút tìm kiếm. */}
              <View style={{ gap: spacing.sm, marginBottom: spacing.md }}>
                <Text style={explore.cardTitle}>{t('region')}</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
                  {filters.availableZones.map((zone) => (
                    <Action
                      key={zone}
                      title={t(
                        zone === 'fortifications' ? 'zone_fortifications' : 'zone_ceremonial',
                      )}
                      selected={filters.zones.includes(zone)}
                      onPress={() =>
                        filters.setZones(
                          filters.zones.includes(zone)
                            ? filters.zones.filter((item) => item !== zone)
                            : [...filters.zones, zone],
                        )
                      }
                    />
                  ))}
                  <Action
                    title={t('clearAll')}
                    variant="ghost"
                    onPress={() => {
                      filters.reset()
                      setDraftQuery('')
                      setSearchRequired(false)
                      setSlide(0)
                    }}
                  />
                </View>
              </View>

              {!search && (
                <>
                  <View style={[explore.row, { marginBottom: spacing.md }]}>
                    <Text style={explore.title}>{t('featured')}</Text>

                    <Pressable
                      accessibilityRole="button"
                      onPress={() => navigation.navigate('Search', {})}
                    >
                      <Text style={{ color: colors.primary }}>{t('viewAll')} ›</Text>
                    </Pressable>
                  </View>

                  {data.loading && !data.places.length ? (
                    <State message="loading" busy />
                  ) : data.error ? (
                    <State
                      message="loadError"
                      retry={() => {
                        void data.reload()
                      }}
                    />
                  ) : !featured.length ? (
                    // CHỨC NĂNG: Cùng empty state với web khi không có điểm nổi bật phù hợp.
                    <View
                      style={{
                        padding: spacing.md,
                        gap: spacing.sm,
                        backgroundColor: colors.page,
                        borderRadius: 12,
                      }}
                      accessibilityRole="summary"
                    >
                      <Text style={explore.cardTitle}>{t('featuredEmpty')}</Text>
                      <Text style={explore.muted}>{t('featuredEmptyHint')}</Text>
                      {!!filters.categories.length && (
                        <Action title={t('clearAll')} onPress={() => changeCategories([])} />
                      )}
                    </View>
                  ) : (
                    <>
                      {/* CHỨC NĂNG: Carousel ngang có snap.
                      XỬ LÝ: Chiều rộng card theo màn hình;
                      tính chấm hiện tại từ độ cuộn khi dừng. */}
                      <FlatList
                        ref={featuredList}
                        horizontal
                        data={featured}
                        keyExtractor={(item) => item.id}
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={cardWidth + spacing.sm}
                        decelerationRate="fast"
                        contentContainerStyle={{
                          gap: spacing.sm,
                        }}
                        onMomentumScrollEnd={(event) =>
                          setSlide(
                            Math.round(
                              event.nativeEvent.contentOffset.x / (cardWidth + spacing.sm),
                            ),
                          )
                        }
                        renderItem={({ item }) => (
                          <PlaceCard
                            place={item}
                            featured
                            width={cardWidth}
                            onOpen={() =>
                              navigation.navigate('Detail', {
                                placeId: item.id,
                              })
                            }
                          />
                        )}
                      />

                      {featured.length > 1 && (
                        <View
                          style={[
                            explore.row,
                            {
                              justifyContent: 'center',
                              padding: spacing.md,
                            },
                          ]}
                        >
                          {featured.map((place, index) => (
                            <View
                              key={place.id}
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: index === slide ? colors.primary : colors.border,
                              }}
                            />
                          ))}
                        </View>
                      )}
                    </>
                  )}
                </>
              )}

              <View style={explore.row}>
                <Text style={[explore.title, { minWidth: 0 }]}>
                  {t(search ? 'results' : 'allPlaces')} ({filters.results.length})
                </Text>

                <SortDropdown effectiveOrder={filters.effectiveOrder} onSelect={onSort} />
              </View>

              {filters.order === 'nearest' && filters.effectiveOrder === 'name' && (
                <Text style={explore.muted}>{t('orderFallback')}</Text>
              )}

              {position.failed && <Text style={explore.muted}>{t('locationDenied')}</Text>}
            </View>
          </View>
        }

        // CHỨC NĂNG: Phân biệt tải, lỗi và không có kết quả.
        // XỬ LÝ: Mỗi trường hợp có thông báo và đường khôi phục phù hợp.
        ListEmptyComponent={
          data.loading ? (
            <State message="loading" busy />
          ) : data.error ? (
            <State
              message="loadError"
              retry={() => {
                void data.reload()
              }}
            />
          ) : (
            <View style={explore.body}>
              <State message="empty" />
              <Text style={explore.muted}>{t('emptyHint')}</Text>
              <Action title={t('clearAll')} onPress={filters.reset} />
            </View>
          )
        }
      />
    </SafeAreaView>
  )
}
// TẠI SAO (HomeScreen): Chặn từ khóa chỉ có khoảng trắng trước khi chuyển route để người dùng
// biết cần nhập gì và giữ được điều kiện tìm hợp lệ.
