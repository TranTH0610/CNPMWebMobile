/**
 * FILE: apps/mobile/src/features/journey/screens/ManHanhTrinh.tsx
 * FILE NÀY LÀM GÌ: Màn bản đồ/hành trình mobile, chọn điểm và tuyến tham khảo, liên kết đến nội dung thuyết minh.
 * VAI TRÒ: Giao diện Mobile; gọi hook/service để xử lý nghiệp vụ.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC06: Nhận diện di tích gần nhất bằng GPS.
 * - UC07: Nghe, điều khiển và tiếp tục phiên nghe.
 * - UC08: Xem bản đồ, tuyến tham quan và tìm đường.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
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

// [UC06 / UC07 / UC08] JourneyScreen — Màn bản đồ/hành trình mobile, chọn điểm và tuyến tham khảo, liên kết đến nội dung
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
