/**
 * FILE NÀY LÀM GÌ:
 * Hiển thị danh sách, tìm kiếm, lọc, sắp xếp và lối vào quét QR.
 * Navigator gọi màn này; liên quan UC02, UC03 và UC05.
 * Phụ thuộc hook chung, component UI và adapter vị trí.
 */

import { useMemo } from 'react'
import { FlatList, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import {
  distanceTo,
  publishedText,
} from '@travelguide/visitor-core'

import {
  usePlaceFilters,
  usePublishedCatalog,
  useText,
  useVisitor,
  useVisitorPosition,
} from '@travelguide/visitor-core/react'

import {
  Action,
  DemoNotice,
  LanguageBar,
  PlaceImage,
  State,
  ui,
  spacing,
} from './ui'

import { getPosition } from './platform'
import type { VisitorStack } from './types'

// CHỨC NĂNG: Ghép dữ liệu và bộ lọc vào danh sách.
// XỬ LÝ: FlatList chỉ dựng những hàng cần thiết;
// key dùng ID ổn định, không dùng vị trí phần tử.
export default function PlacesScreen({
  navigation,
}: NativeStackScreenProps<VisitorStack, 'Places'>) {
  const data = usePublishedCatalog()
  const position = useVisitorPosition(getPosition)
  const filters = usePlaceFilters(data.places, position.origin)
  const { language } = useVisitor()
  const t = useText()

  // CHỨC NĂNG: Nhận biết có điểm thiếu bản ngôn ngữ đang chọn.
  // XỬ LÝ: Chỉ kiểm tra lại khi danh sách hoặc ngôn ngữ thay đổi.
  const missing = useMemo(
    () => data.places.some(
      (place) => !publishedText(place, language),
    ),
    [data.places, language],
  )

  return (
    <SafeAreaView
      style={ui.page}
      edges={['bottom', 'left', 'right']}
    >
      <FlatList
        data={data.error ? [] : filters.results}
        keyExtractor={(place) => place.id}
        contentContainerStyle={ui.content}
        refreshing={data.loading && data.places.length > 0}
        onRefresh={() => {
          void data.reload()
        }}
        keyboardShouldPersistTaps="handled"

        // CHỨC NĂNG: Đặt điều khiển trong đầu danh sách.
        // XỬ LÝ: Không lồng FlatList dọc bên trong ScrollView dọc.
        ListHeaderComponent={
          <View style={{ gap: spacing.md }}>
            <Text style={ui.title}>{t('explore')}</Text>
            <Text style={ui.muted}>{t('intro')}</Text>

            <LanguageBar />
            <DemoNotice />

            <Action
              title={t('scan')}
              onPress={() => navigation.navigate('Scan')}
            />

            <TextInput
              value={filters.query}
              onChangeText={filters.setQuery}
              style={ui.input}
              placeholder={t('search')}
              accessibilityLabel={t('search')}
              autoCorrect={false}
            />

            {filters.zones.length >= 2 && (
              <View style={ui.row}>
                <Action
                  title={t('all')}
                  selected={filters.zone === null}
                  onPress={() => filters.setZone(null)}
                />

                {filters.zones.map((zone) => (
                  <Action
                    key={zone}
                    title={t(
                      zone === 'fortifications'
                        ? 'zone_fortifications'
                        : 'zone_ceremonial',
                    )}
                    selected={filters.zone === zone}
                    onPress={() => filters.setZone(zone)}
                  />
                ))}
              </View>
            )}

            <Text style={ui.muted}>
              {t('sort')}: {t(filters.effectiveOrder)}
            </Text>

            <View style={ui.row}>
              <Action
                title={t('name')}
                selected={filters.order === 'name'}
                onPress={() => filters.setOrder('name')}
              />

              <Action
                title={t('nearest')}
                selected={filters.order === 'nearest'}
                onPress={() => {
                  filters.setOrder('nearest')

                  if (!position.origin) {
                    void position.request()
                  }
                }}
              />

              <Action
                title={t(
                  position.loading ? 'locationBusy' : 'location',
                )}
                disabled={position.loading}
                onPress={() => {
                  void position.request()
                }}
              />
            </View>

            {filters.order === 'nearest'
              && filters.effectiveOrder === 'name' && (
              <Text style={ui.muted}>
                {t('orderFallback')}
              </Text>
            )}

            {position.failed && (
              <Text style={ui.muted}>
                {t('locationDenied')}
              </Text>
            )}

            {missing && (
              <Text style={ui.muted}>
                {t('missingList')}
              </Text>
            )}

            <Text style={ui.heading}>
              {t('results')} ({filters.results.length})
            </Text>
          </View>
        }

        // CHỨC NĂNG: Hiển thị từng địa điểm.
        // XỬ LÝ: Thiếu ngôn ngữ thì thông báo rõ;
        // thiếu tọa độ thì không hiện khoảng cách giả.
        renderItem={({ item }) => {
          const content = publishedText(item, language)
          const title = content?.title ?? item.canonicalTitle
          const meters = distanceTo(item, position.origin)

          return (
            <View style={ui.card}>
              <PlaceImage
                uri={item.images[0]}
                title={title}
              />

              <Text style={ui.heading}>{title}</Text>

              <Text style={ui.muted}>
                {content?.summary ?? t('missing')}
              </Text>

              {meters !== undefined && (
                <Text style={ui.muted}>
                  {t('distance')}: {(meters / 1000).toFixed(2)} km
                </Text>
              )}

              <Action
                title={t('details')}
                onPress={() => navigation.navigate('Detail', {
                  placeId: item.id,
                })}
              />
            </View>
          )
        }}

        // CHỨC NĂNG: Phân biệt đang tải, lỗi và rỗng.
        // XỬ LÝ: Lỗi có thử lại; không có kết quả có nút xóa điều kiện.
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
            <View>
              <State message="emptyHint" />
              <Action
                title={t('reset')}
                onPress={filters.reset}
              />
            </View>
          )
        }
      />
    </SafeAreaView>
  )
}