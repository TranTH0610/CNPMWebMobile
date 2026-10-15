/**
 * FILE NÀY LÀM GÌ:
 * Hiển thị tìm kiếm trực tiếp với debounce, danh mục và sắp xếp.
 * ExploreNavigator mở; dùng components và usePlaceSearch.
 * Liên quan UC03, FR-38/39/41.
 */

import { useCallback, useState } from 'react'

import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
} from 'react-native'

import {
  SafeAreaView,
} from 'react-native-safe-area-context'

import { useTranslation } from 'react-i18next'
import type { ExploreScreenProps } from '../navigation/types'

import { usePlaceSearch } from '../hooks/usePlaceSearch'

import SearchBar from '../components/SearchBar'
import CategoryChips from '../components/CategoryChips'
import PlaceCard from '../components/PlaceCard'
import SortDropdown from '../components/SortDropdown'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'

import { colors, spacing, ui } from '../theme'

type Props = ExploreScreenProps<'SearchResults'>

export default function SearchResultScreen({
  route,
  navigation,
}: Props) {
  const { t } = useTranslation()

  const search = usePlaceSearch(
    route.params.query,
    route.params.category ?? null,
  )

  const [sortOpen, setSortOpen] = useState(false)

  // CHỨC NĂNG: chỉ tìm khi dữ liệu ngôn ngữ đã chuẩn bị xong.
  // XỬ LÝ: không hiển thị kết quả thiếu bản dịch rồi báo sai "không có".
  const busy =
    search.loading || search.translating

  const visibleResults =
    busy || search.error ? [] : search.results

  const openPlace = useCallback((id: string) => {
    navigation.navigate('Detail', {
      placeId: id,
    })
  }, [navigation])

  return (
    <SafeAreaView
      style={ui.page}
      edges={['top', 'left', 'right']}
    >
      {/* Đặt TextInput ngoài FlatList để thay đổi kết quả
          không làm mất focus hoặc đóng bàn phím. */}
      <View style={ui.content}>
        <SearchBar
          value={search.query}
          onChangeText={search.setQuery}
          onBack={() => navigation.goBack()}
          onFilter={() => setSortOpen(true)}
          autoFocus
        />

        <CategoryChips
          categories={search.categories}
          selected={search.category}
          onChange={search.setCategory}
        />

        <View style={ui.between}>
          <Text style={ui.section}>
            {t('explore.results', {
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

      <FlatList
        data={visibleResults}
        keyExtractor={(place) => place.id}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.lg,
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        refreshing={search.refreshing}
        onRefresh={() => {
          void search.refresh()
        }}
        extraData={search.favorites}
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
          busy ? (
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
      />
    </SafeAreaView>
  )
}