/**
 * FILE NÀY LÀM GÌ:
 * Màn Khám phá: header, tìm kiếm, danh mục, carousel và danh sách.
 * ExploreNavigator mở màn này; phụ thuộc components và hooks M3.
 * Giữ geofencing, nút thêm và Detail. Liên quan UC03, FR-41.
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Switch,
  Text,
  View,
  useWindowDimensions,
} from 'react-native'

import {
  SafeAreaView,
} from 'react-native-safe-area-context'

import {
  useFocusEffect,
  useIsFocused,
} from '@react-navigation/native'

import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { sortPlaces } from '@travelguide/place-core'

import type { LangCode } from '../i18n'
import type { ExploreScreenProps } from '../navigation/types'

import { usePlaceSearch } from '../hooks/usePlaceSearch'
import { useNearbyPlace } from '../hooks/useNearbyPlace'

import SearchBar from '../components/SearchBar'
import CategoryChips from '../components/CategoryChips'
import PlaceCard from '../components/PlaceCard'
import SortDropdown from '../components/SortDropdown'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'

import {
  colors,
  spacing,
  radii,
  sizes,
  ui,
} from '../theme'

type Props = ExploreScreenProps<'ExploreHome'>

export default function HomeScreen({
  navigation,
}: Props) {
  const { t } = useTranslation()

  const search = usePlaceSearch()
  const { width } = useWindowDimensions()

  const [sortOpen, setSortOpen] = useState(false)
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const [autoLocation, setAutoLocation] = useState(false)

  const isFocused = useIsFocused()

  // CHỨC NĂNG: giữ hook geofencing đang có.
  // XỬ LÝ: truyền toàn bộ địa điểm, không truyền kết quả đã lọc;
  // nếu không, chip danh mục có thể làm mất địa điểm gần người dùng.
  const {
    nearby,
    denied,
    simulate,
  } = useNearbyPlace(search.places, autoLocation)

  const visited = useRef(new Set<string>())
  const lastFocusLanguage = useRef<LangCode | null>(null)

  // CHỨC NĂNG: đọc lại dữ liệu khi quay về từ AddPlace/Detail.
  // XỬ LÝ: lần focus đầu và đổi ngôn ngữ để provider tự tải,
  // tránh gọi tải hai lần lúc mới mở.
  useFocusEffect(
    useCallback(() => {
      if (
        lastFocusLanguage.current === search.language
      ) {
        void search.refresh()
      }

      lastFocusLanguage.current = search.language
    }, [search.language, search.refresh]),
  )

  // CHỨC NĂNG: tự mở địa điểm gần trong bán kính của hook cũ.
  // XỬ LÝ: chỉ mở khi Home đang focus; cùng địa điểm chỉ mở một lần
  // cho đến khi đi ra khỏi vùng gần.
  useEffect(() => {
    if (!autoLocation) return

    if (!nearby) {
      visited.current.clear()
      return
    }

    if (
      !isFocused ||
      visited.current.has(nearby.id)
    ) {
      return
    }

    visited.current.add(nearby.id)

    navigation.navigate('Detail', {
      placeId: nearby.id,
    })
  }, [
    nearby,
    autoLocation,
    isFocused,
    navigation,
  ])

  const openPlace = useCallback((id: string) => {
    visited.current.add(id)

    navigation.navigate('Detail', {
      placeId: id,
    })
  }, [navigation])

  const featured = useMemo(
    () => sortPlaces(search.results, {
      language: search.language,
      order: 'rating',
    }).slice(0, 5),
    [search.results, search.language],
  )

  useEffect(() => {
    setFeaturedIndex(0)
  }, [featured])

  const cardWidth = Math.min(
    width - spacing.lg * 2,
    sizes.maxFeaturedWidth,
  )

  const firstWithLocation =
    search.places.find((place) => place.location)

  const visibleResults =
    search.error ? [] : search.results

  const openSearch = (): void => {
    navigation.navigate('SearchResults', {
      query: '',
      category: search.category,
    })
  }

  return (
    <SafeAreaView
      style={ui.page}
      edges={['top', 'left', 'right']}
    >
      {/* CHỨC NĂNG: FlatList dọc quản lý danh sách chính.
          XỬ LÝ: phần giới thiệu/carousel đặt trong ListHeaderComponent,
          không bọc danh sách bằng ScrollView dọc. */}
      <FlatList
        data={visibleResults}
        keyExtractor={(place) => place.id}
        contentContainerStyle={ui.content}
        refreshing={search.refreshing}
        onRefresh={() => {
          void search.refresh()
        }}
        extraData={search.favorites}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View>
            <View
              style={[
                ui.between,
                { marginBottom: spacing.xl },
              ]}
            >
              <View style={ui.row}>
                <View
                  style={{
                    width: sizes.avatar,
                    height: sizes.avatar,
                    borderRadius: radii.round,
                    backgroundColor: colors.softPrimary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: spacing.md,
                  }}
                >
                  <Ionicons
                    name="person-outline"
                    size={sizes.icon}
                    color={colors.primary}
                  />
                </View>

                <View>
                  <Text style={ui.title}>
                    {t('explore.title')}
                  </Text>
                  <Text style={ui.muted}>
                    {t('explore.subtitle')}
                  </Text>
                </View>
              </View>

              {/* Chuông chỉ là giao diện trong phạm vi M3. */}
              <View
                style={ui.iconButton}
                accessibilityLabel={t('explore.notifications')}
              >
                <Ionicons
                  name="notifications-outline"
                  size={sizes.icon}
                  color={colors.text}
                />
              </View>
            </View>

            <SearchBar
              value=""
              onActivate={openSearch}
              onFilter={() => setSortOpen(true)}
            />

            <CategoryChips
              categories={search.categories}
              selected={search.category}
              onChange={search.setCategory}
            />

            <View
              style={[
                ui.row,
                { marginBottom: spacing.sm },
              ]}
            >
              <Switch
                value={autoLocation}
                onValueChange={setAutoLocation}
                accessibilityLabel={t('home.autoLocation')}
              />

              <Text
                style={[
                  ui.muted,
                  { flex: 1, marginLeft: spacing.sm },
                ]}
              >
                {t('home.autoLocation')}
              </Text>
            </View>

            {denied && (
              <Text
                style={[
                  ui.muted,
                  { color: colors.danger },
                ]}
              >
                {t('home.denied')}
              </Text>
            )}

            {__DEV__ &&
              autoLocation &&
              firstWithLocation?.location && (
                <Pressable
                  style={ui.button}
                  onPress={() => {
                    const location =
                      firstWithLocation.location

                    if (location) simulate(location)
                  }}
                >
                  <Text style={ui.buttonText}>
                    {t('home.simulate')}
                  </Text>
                </Pressable>
              )}

            {!search.origin && (
              <View
                style={{
                  marginVertical: spacing.md,
                  gap: spacing.sm,
                }}
              >
                <Text style={ui.muted}>
                  {t(
                    search.locationFailed
                      ? 'explore.locationFailed'
                      : 'explore.locationHint',
                  )}
                </Text>

                <Pressable
                  style={ui.button}
                  disabled={search.locationLoading}
                  onPress={() => {
                    void search.requestLocation()
                  }}
                >
                  <Text style={ui.buttonText}>
                    {t(
                      search.locationLoading
                        ? 'explore.locating'
                        : 'explore.enableLocation',
                    )}
                  </Text>
                </Pressable>
              </View>
            )}

            {search.translating && (
              <Text
                style={[
                  ui.muted,
                  { marginVertical: spacing.sm },
                ]}
              >
                {t('explore.preparingLanguage')}
              </Text>
            )}

            {!search.error && featured.length > 0 && (
              <View
                style={{ marginTop: spacing.lg }}
              >
                <Text
                  style={[
                    ui.section,
                    { marginBottom: spacing.md },
                  ]}
                >
                  {t('explore.featured')}
                </Text>

                {/* CHỨC NĂNG: carousel ngang trong header.
                    XỬ LÝ: key là ID; snap theo chiều rộng thẻ + khoảng cách.
                    Danh sách ngang không xung đột cuộn dọc của cha. */}
                <FlatList
                  horizontal
                  data={featured}
                  keyExtractor={(place) => place.id}
                  showsHorizontalScrollIndicator={false}
                  snapToInterval={
                    cardWidth + spacing.md
                  }
                  decelerationRate="fast"
                  extraData={search.favorites}
                  ItemSeparatorComponent={() => (
                    <View style={{ width: spacing.md }} />
                  )}
                  onMomentumScrollEnd={(event) => {
                    const index = Math.round(
                      event.nativeEvent.contentOffset.x /
                      (cardWidth + spacing.md),
                    )

                    setFeaturedIndex(
                      Math.max(
                        0,
                        Math.min(index, featured.length - 1),
                      ),
                    )
                  }}
                  renderItem={({ item }) => (
                    <PlaceCard
                      place={item}
                      large
                      width={cardWidth}
                      favorite={search.favorites.has(item.id)}
                      onFavorite={search.toggleFavorite}
                      onOpen={openPlace}
                    />
                  )}
                />

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: spacing.xs,
                    marginBottom: spacing.lg,
                  }}
                >
                  {featured.map((place, index) => (
                    <View
                      key={place.id}
                      style={{
                        width: spacing.sm,
                        height: spacing.sm,
                        borderRadius: radii.round,
                        backgroundColor:
                          index === featuredIndex
                            ? colors.primary
                            : colors.border,
                      }}
                    />
                  ))}
                </View>
              </View>
            )}

            <View
              style={[
                ui.between,
                { marginVertical: spacing.md },
              ]}
            >
              <Text
                style={[ui.section, { flex: 1 }]}
              >
                {t('explore.allPlaces', {
                  count: visibleResults.length,
                })}
              </Text>

              <SortDropdown
                value={search.effectiveOrder}
                open={sortOpen}
                onOpen={() => setSortOpen(true)}
                onClose={() => setSortOpen(false)}
                onChange={search.changeOrder}
              />
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <PlaceCard
            place={item}
            favorite={search.favorites.has(item.id)}
            distance={search.distances.get(item.id)}
            onFavorite={search.toggleFavorite}
            onOpen={openPlace}
          />
        )}
        ListEmptyComponent={
          search.loading ? (
            <View style={ui.state}>
              <ActivityIndicator color={colors.primary} />
              <Text style={ui.muted}>
                {t('explore.loading')}
              </Text>
            </View>
          ) : search.error ? (
            <ErrorState
              onRetry={() => {
                void search.refresh()
              }}
            />
          ) : (
            <EmptyState onReset={search.reset} />
          )
        }
        ListFooterComponent={
          <Pressable
            style={[
              ui.button,
              { marginVertical: spacing.lg },
            ]}
            onPress={() => navigation.navigate('AddPlace')}
          >
            <Text style={ui.buttonText}>
              {t('home.addPlace')}
            </Text>
          </Pressable>
        }
      />
    </SafeAreaView>
  )
}