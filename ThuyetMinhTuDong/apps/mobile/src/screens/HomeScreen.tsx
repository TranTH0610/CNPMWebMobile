/**
 * FILE NÀY LÀM GÌ: Hiển thị Khám phá, carousel và danh sách có tìm kiếm/lọc/kéo làm mới.
 * Vị trí: apps/mobile/src/screens/HomeScreen.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { useRef, useState } from 'react'
import { Alert, FlatList, Linking, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Ionicons } from '@expo/vector-icons'
import { HERO_IMAGE, PHOTO_CREDITS } from '@travelguide/visitor-core'
import type { Category, SortOrder } from '@travelguide/visitor-core'
import { useExplore, usePublishedCatalog, useVisitorPosition } from '../hooks/usePlaces'
import { useText } from '../i18n/index'
import { Action, DemoNotice, State, colors, spacing, CategoryChips, Cover, PlaceCard, SearchBar, SortDropdown, explore } from '../components/index'
import { getPosition } from '../services/platform'
import type { VisitorStack } from '../navigation/types'

// CHỨC NĂNG: Ghép dữ liệu và điều kiện vào danh sách.
// XỬ LÝ: Dùng một FlatList dọc; carousel cuộn ngang bên trong header.
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
  const navigation =
    useNavigation<NativeStackNavigationProp<VisitorStack>>()

  const data = usePublishedCatalog()
  const position = useVisitorPosition(getPosition)
  const filters = useExplore(data.places, position.origin, initial)
  const t = useText()

  const { width } = useWindowDimensions()

  const cardWidth = Math.max(
    240,
    width - spacing.lg * 2 - spacing.sm,
  )

  const [slide, setSlide] = useState(0)
  const list = useRef<FlatList>(null)

  const featured = data.places.filter(
    (place) => place.featured,
  )

  // CHỨC NĂNG: Đổi thứ tự và xin vị trí khi người dùng yêu cầu.
  // XỬ LÝ: Chọn theo tên không xin quyền GPS.
  const onSort = (order: SortOrder) => {
    filters.setOrder(order)

    if (order === 'nearest' && !position.origin) {
      void position.request()
    }
  }

  const openSearch = () => navigation.navigate('Search', {
    query: filters.query,
  })

  return (
    <SafeAreaView
      style={explore.page}
      edges={['top', 'left', 'right']}
    >
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
              onOpen={() => navigation.navigate('Detail', {
                placeId: item.id,
              })}
            />
          </View>
        )}

        ListHeaderComponent={
          <View>
            {!search ? (
              <View
                style={{
                  minHeight: 285,
                  justifyContent: 'flex-end',
                }}
              >
                <Cover
                  uri={HERO_IMAGE}
                  style={StyleSheet.absoluteFill}
                />

                <View
                  style={{
                    padding: spacing.lg,
                    gap: spacing.sm,
                    backgroundColor: colors.overlay,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: spacing.xl,
                    }}
                  >
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={t('scan')}
                      onPress={() => navigation.navigate('Scan')}
                    >
                      <Ionicons
                        name="qr-code-outline"
                        size={24}
                        color={colors.white}
                      />
                    </Pressable>

                    <View accessibilityLabel={t('notification')}>
                      <Ionicons
                        name="notifications-outline"
                        size={24}
                        color={colors.white}
                      />
                    </View>
                  </View>

                  <Text style={{ color: colors.white, fontSize: 17 }}>
                    {t('explore')}
                  </Text>

                  <Text
                    style={{
                      color: colors.white,
                      fontSize: 30,
                      fontWeight: '700',
                    }}
                  >
                    {t('site')}
                  </Text>

                  <Text
                    style={{
                      color: colors.white,
                      lineHeight: 20,
                      fontSize: 13,
                    }}
                  >
                    {t('heroSubtitle')}
                  </Text>

                  <SearchBar
                    value={filters.query}
                    onChange={filters.setQuery}
                    onFocus={openSearch}
                  />
                </View>
              </View>
            ) : (
              <View style={explore.body}>
                <SearchBar
                  value={filters.query}
                  onChange={filters.setQuery}
                  autoFocus
                  onBack={() => navigation.goBack()}
                  onFilter={() => Alert.alert(
                    t('sort'),
                    undefined,
                    [
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
                    ],
                  )}
                />
              </View>
            )}

            <View style={explore.body}>
              <CategoryChips
                categories={filters.availableCategories}
                selected={filters.categories}
                onSelect={filters.setCategories}
              />

              {!search && (
                <>
                  <View
                    style={[
                      explore.row,
                      { marginBottom: spacing.md },
                    ]}
                  >
                    <Text style={explore.title}>
                      {t('featured')}
                    </Text>

                    <Pressable
                      accessibilityRole="button"
                      onPress={() => navigation.navigate('Search', {})}
                    >
                      <Text style={{ color: colors.primary }}>
                        {t('viewAll')} ›
                      </Text>
                    </Pressable>
                  </View>

                  {/* CHỨC NĂNG: Carousel ngang có snap.
                      XỬ LÝ: Chiều rộng card theo màn hình;
                      tính chấm hiện tại từ độ cuộn khi dừng. */}
                  <FlatList
                    horizontal
                    data={featured}
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={cardWidth + spacing.sm}
                    decelerationRate="fast"
                    contentContainerStyle={{
                      gap: spacing.sm,
                    }}
                    onMomentumScrollEnd={(event) => setSlide(
                      Math.round(
                        event.nativeEvent.contentOffset.x
                        / (cardWidth + spacing.sm),
                      ),
                    )}
                    renderItem={({ item }) => (
                      <PlaceCard
                        place={item}
                        featured
                        width={cardWidth}
                        onOpen={() => navigation.navigate('Detail', {
                          placeId: item.id,
                        })}
                      />
                    )}
                  />

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
                          backgroundColor:
                            index === slide
                              ? colors.primary
                              : colors.border,
                        }}
                      />
                    ))}
                  </View>
                </>
              )}

              <View style={explore.row}>
                <Text style={explore.title}>
                  {t(search ? 'results' : 'allPlaces')}
                  {' '}({filters.results.length})
                </Text>

                <SortDropdown
                  effectiveOrder={filters.effectiveOrder}
                  onSelect={onSort}
                />
              </View>

              {filters.order === 'nearest'
                && filters.effectiveOrder === 'name' && (
                <Text style={explore.muted}>
                  {t('orderFallback')}
                </Text>
              )}

              {position.failed && (
                <Text style={explore.muted}>
                  {t('locationDenied')}
                </Text>
              )}
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
              <Text style={explore.muted}>
                {t('emptyHint')}
              </Text>
              <Action
                title={t('clearAll')}
                onPress={filters.reset}
              />
            </View>
          )
        }

        ListFooterComponent={
          <View style={explore.body}>
            <DemoNotice />
            <Text style={explore.muted}>
              {t('photoCredits')}
            </Text>

            {PHOTO_CREDITS.map((credit) => (
              <Pressable
                key={credit.url}
                accessibilityRole="link"
                onPress={() => {
                  void Linking.openURL(credit.url)
                }}
              >
                <Text style={explore.muted}>
                  {credit.title} · {credit.license}
                </Text>
              </Pressable>
            ))}
          </View>
        }
      />
    </SafeAreaView>
  )
}
