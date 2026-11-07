/**
 * CHỨC NĂNG: [DINH-VI] [THUYET-MINH]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Màn bản đồ/hành trình mobile, chọn điểm và tuyến tham khảo, liên kết đến nội dung thuyết minh.
 *
 * VỊ TRÍ: apps/mobile/src/features/journey/screens/ManHanhTrinh.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/navigation/DieuHuongGoc.tsx
 * - apps/mobile/src/navigation/ThanhDieuHuongDuKhach.tsx
 *
 * PHỤ THUỘC:
 * - ../components/TrangThaiDinhVi
 * - ../components/BanDoThamQuan
 * - react-native
 * - react-native-safe-area-context
 * - @react-navigation/native
 * - @react-navigation/native-stack
 * - @travelguide/visitor-core
 * - ../../language/i18n/CauHinhNgonNgu
 * - ../../language/hooks/useDuKhach
 * - ../hooks/useHanhTrinh
 * - @travelguide/visitor-core/journey/data
 * - @travelguide/visitor-core/journey
 * - ../../../shared/components/NutThaoTac
 * - ../../../shared/GiaoDienChung
 * - ../../explore/components/TheDiTich
 * - ../../../navigation/KieuDieuHuongDuKhach
 *
 * CÁC KHỐI CHÍNH:
 * 1. JourneyScreen
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { GpsStatus } from '../components/TrangThaiDinhVi'

import { VisitorMap } from '../components/BanDoThamQuan'
import { FlatList, Linking, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { publishedText } from '@travelguide/visitor-core'
import { useText } from '../../language/i18n/CauHinhNgonNgu'
import { useVisitor } from '../../language/hooks/useDuKhach'
import { useJourney } from '../hooks/useHanhTrinh'
import { mapPointFor } from '@travelguide/visitor-core/journey/data'
import { routeAvailable } from '@travelguide/visitor-core/journey'
import { Action } from '../../../shared/components/NutThaoTac'
import { ui } from '../../../shared/GiaoDienChung'
import { PlaceCard } from '../../explore/components/TheDiTich'
import type { VisitorStack } from '../../../navigation/KieuDieuHuongDuKhach'

// CHỨC NĂNG: Màn bản đồ/hành trình mobile, chọn điểm và tuyến tham khảo, liên kết đến nội dung
// thuyết minh.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.

// ==================== [DINH-VI] [THUYET-MINH] JourneyScreen ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function JourneyScreen() {
  const { engine, state } = useJourney(),
    { language } = useVisitor(),
    t = useText()

  const navigation = useNavigation<NativeStackNavigationProp<VisitorStack>>()

  const route = useRoute<RouteProp<VisitorStack, 'Journey'>>()

  const selected = route.params?.placeId

  const open = (id: string) => navigation.navigate('Detail', { placeId: id })
  // TẠI SAO (open): Controller cần thời lượng và các thao tác thật từ nền tảng; tách adapter giúp
  // giữ chung nghiệp vụ web/native.

  return (
    <SafeAreaView style={ui.page} edges={['left', 'right']}>
      <FlatList
        data={state.places}
        keyExtractor={(place) => place.id}
        contentContainerStyle={ui.content}
        ListHeaderComponent={
          <>
            <Text style={ui.title}>{t('jTitle')}</Text>
            <Text style={ui.muted}>{t('jReference')}</Text>
            <Action
              title={t(state.gps ? 'jGpsOff' : 'jGpsOn')}
              onPress={() => {
                void engine.gps(!state.gps)
              }}
            />
            <GpsStatus />
            {state.error && !['gpsFailed', 'gpsWeak'].includes(state.error) && (
              <Text style={ui.muted}>{t(state.error)}</Text>
            )}
            {state.gps && !state.suggestedId && <Text style={ui.muted}>{t('jNoNearby')}</Text>}
            {/* CHỨC NĂNG: Marker lấy từ OSM; bấm marker mở chi tiết native.
            XỬ LÝ: Không vẽ đường thẳng giả thành lối đi qua tường thành. */}
            <VisitorMap selected={selected} onOpen={open} />
            <Text style={ui.heading}>{t('jRoutes')}</Text>
            {engine.ports.routes.map((r) => (
              <View key={r.id} style={ui.card}>
                <Text style={ui.heading}>{r.title[language]}</Text>
                {!r.verified && <Text style={ui.muted}>{t('jPreview')}</Text>}
                <Action
                  title={t('jUseRoute')}
                  disabled={!routeAvailable(r, state.places)}
                  onPress={() => engine.selectRoute(r.id)}
                />
                {!routeAvailable(r, state.places) && (
                  <Text style={ui.muted}>{t('jRouteInvalid')}</Text>
                )}
                {state.routeId === r.id &&
                  r.stops.map((id, index) => (
                    <Action
                      key={id}
                      title={
                        index +
                        1 +
                        '. ' +
                        (publishedText(
                          state.places.find((p) => p.id === id)!,
                          language,
                        )?.title ?? id)
                      }
                      onPress={() => open(id)}
                    />
                  ))}
              </View>
            ))}
            <Action title={t('jSkipRoute')} onPress={() => engine.selectRoute()} />
            <Text style={ui.muted}>{t('jWalkingPending')}</Text>
            <Text style={ui.heading}>{t('allPlaces')}</Text>
          </>
        }
        renderItem={({ item }) => (
          <View>
            <PlaceCard place={item} onOpen={() => open(item.id)} origin={state.fix} />
            {mapPointFor(item)?.source && (
              <Action
                title={t('jSource')}
                onPress={() => {
                  void Linking.openURL(mapPointFor(item)!.source)
                }}
              />
            )}
          </View>
        )}
      />
    </SafeAreaView>
  )
}
// TẠI SAO (JourneyScreen): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua
// lớp dùng chung.
