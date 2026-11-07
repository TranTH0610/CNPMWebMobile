/**
 * CHỨC NĂNG: [DINH-VI] [THUYET-MINH]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Trình bày các điểm tham quan trên bản đồ và nối thao tác chọn điểm với luồng hành trình của nền tảng.
 *
 * VỊ TRÍ: apps/mobile/src/features/journey/components/BanDoThamQuan.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/features/journey/screens/ManHanhTrinh.tsx
 *
 * PHỤ THUỘC:
 * - ../../../shared/components/NutThaoTac
 * - ../../../shared/GiaoDienChung
 * - react-native
 * - react-native-maps
 * - @travelguide/visitor-core
 * - ../../language/i18n/CauHinhNgonNgu
 * - ../../language/hooks/useDuKhach
 * - ../hooks/useHanhTrinh
 * - @travelguide/visitor-core/journey/data
 *
 * CÁC KHỐI CHÍNH:
 * 1. VisitorMap
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { Action } from '../../../shared/components/NutThaoTac'
import { colors, spacing } from '../../../shared/GiaoDienChung'
import { Linking, Platform, StyleSheet } from 'react-native'
import MapView from 'react-native-maps'
import { Marker } from 'react-native-maps'
import { publishedText } from '@travelguide/visitor-core'
import { useText } from '../../language/i18n/CauHinhNgonNgu'
import { useVisitor } from '../../language/hooks/useDuKhach'
import { useJourney } from '../hooks/useHanhTrinh'
import { mapPointFor } from '@travelguide/visitor-core/journey/data'

// CHỨC NĂNG: Trình bày các điểm tham quan trên bản đồ và nối thao tác chọn điểm với luồng hành
// trình của nền tảng.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.

// ==================== [DINH-VI] [THUYET-MINH] VisitorMap ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function VisitorMap({
  selected,
  onOpen,
}: {
  selected?: string
  onOpen: (id: string) => void
}) {
  const { state } = useJourney(),
    { language } = useVisitor(),
    t = useText()

  const selectedPlace = state.places.find((place) => place.id === selected)

  const point = selectedPlace ? mapPointFor(selectedPlace) : undefined

  const open = onOpen

  return __DEV__ || Platform.OS === 'ios' || process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ? (
    <MapView
      style={styles.map}
      key={selected ?? 'all'}
      initialRegion={{
        latitude: point?.lat ?? 16.468,
        longitude: point?.lng ?? 107.578,
        latitudeDelta: point ? 0.003 : 0.012,
        longitudeDelta: point ? 0.003 : 0.012,
      }}
    >
      {state.places.map((place) => {
        const p = mapPointFor(place)
        return p ? (
          <Marker
            key={place.id}
            pinColor={selected === place.id ? colors.primary : colors.secondary}
            coordinate={{ latitude: p.lat, longitude: p.lng }}
            title={publishedText(place, language)?.title ?? place.canonicalTitle}
            onPress={() => open(place.id)}
          />
        ) : null
      })}
      {state.fix && (
        <Marker
          pinColor={colors.primary}
          coordinate={{ latitude: state.fix.lat, longitude: state.fix.lng }}
          title={t('jMyLocation')}
        />
      )}
    </MapView>
  ) : (
    <Action
      title={t('jExternalMap')}
      onPress={() => {
        void Linking.openURL(
          'https://www.openstreetmap.org/#map=17/' +
            (point?.lat ?? 16.468) +
            '/' +
            (point?.lng ?? 107.578),
        )
      }}
    />
  )
}
// TẠI SAO (VisitorMap): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
// tại một nơi.

const styles = StyleSheet.create({
  map: { height: 340, marginVertical: spacing.md, borderRadius: 18 },
})
