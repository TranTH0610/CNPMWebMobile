/**
 * FILE: apps/mobile/src/features/journey/components/BanDoThamQuan.tsx
 * FILE NÀY LÀM GÌ: Trình bày các điểm tham quan trên bản đồ và nối thao tác chọn điểm với luồng hành trình của nền tảng.
 * VAI TRÒ: Giao diện Mobile; gọi hook/service để xử lý nghiệp vụ.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC08: Xem bản đồ, tuyến tham quan và tìm đường.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { Action } from '../../../shared/components/NutThaoTac'
import { colors, spacing } from '../../../shared/GiaoDienChung'
import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Linking, Platform, StyleSheet, Text, View } from 'react-native'
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

// [UC08] VisitorMap — Hiển thị marker, vị trí và các thao tác chọn di tích/mở bản đồ ngoài.
export function VisitorMap({
  selected,
  onOpen,
}: {
  selected?: string
  onOpen: (id: string) => void
}) {
  const { state } = useJourney(),
    t = useText()

  const selectedPlace = state.places.find((place) => place.id === selected)

  const point = selectedPlace ? mapPointFor(selectedPlace) : undefined

  const [attempt, setAttempt] = useState(0)
  const [externalFailed, setExternalFailed] = useState(false)

  // CHỨC NĂNG: Mở đúng vị trí trong ứng dụng/trình duyệt bản đồ bên ngoài.
  // XỬ LÝ: Lỗi mở liên kết được hiển thị, không để Promise bị từ chối mà không xử lý.
  // [UC08] openExternal — Mở tọa độ di tích bằng ứng dụng/trình duyệt bản đồ ngoài và báo lỗi nếu không mở được.
  const openExternal = async () => {
    setExternalFailed(false)
    try {
      await Linking.openURL(
        'https://www.openstreetmap.org/#map=17/' +
          (point?.lat ?? 16.468) + '/' + (point?.lng ?? 107.578),
      )
    } catch { setExternalFailed(true) }
  }
  const nativeAvailable = __DEV__ || Platform.OS === 'ios' || Boolean(process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY)

  return (
    <View style={styles.section}>
      {nativeAvailable && (
        <NativeMap
          key={(selected ?? 'all') + ':' + attempt}
          selected={selected}
          onOpen={onOpen}
        />
      )}
      {/* CHỨC NĂNG: Luôn có lối phục hồi nếu SDK đã sẵn sàng nhưng nền bản đồ vẫn trống.
          TẠI SAO: Apple Maps không phát sự kiện hoàn tất/lỗi tải tile qua phiên bản thư viện này. */}
      {nativeAvailable && <Text style={styles.hint}>{t('jMapHelp')}</Text>}
      {externalFailed && <Text accessibilityRole="alert" style={styles.error}>{t('jMapFailed')}</Text>}
      <View style={styles.actions}>
        {nativeAvailable && (
          <Action title={t('jRetry')} onPress={() => setAttempt(value => value + 1)} />
        )}
        <Action title={t('jExternalMap')} onPress={() => { void openExternal() }} />
      </View>
    </View>
  )
}

// CHỨC NĂNG: Theo dõi thời hạn khởi tạo bản đồ; component được tạo lại khi đổi điểm hoặc thử lại.
// XỬ LÝ: Android chờ onMapLoaded; iOS chỉ xác nhận SDK sẵn sàng bằng onMapReady.
// TẠI SAO: Không dùng sự kiện sẵn sàng trên iOS để cam kết mọi ảnh nền đã tải thành công.
// [UC08] NativeMap — Theo dõi thời hạn khởi tạo bản đồ; component được tạo lại khi đổi điểm hoặc thử lại.
function NativeMap({ selected, onOpen }: { selected?: string; onOpen: (id: string) => void }) {
  const { state } = useJourney(), { language } = useVisitor(), t = useText()
  const place = state.places.find(item => item.id === selected)
  const point = place ? mapPointFor(place) : undefined
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const finished = useRef(false)

  // CHỨC NĂNG: Không để vùng bản đồ chờ vô hạn khi thiếu mạng hoặc cấu hình SDK.
  // XỬ LÝ: Sau 15 giây chưa có tín hiệu phù hợp thì báo chưa tải được; cleanup hủy timer.
  useEffect(() => {
    if (!finished.current) timer.current = setTimeout(() => setStatus('failed'), 15000)
    return () => clearTimeout(timer.current)
  }, [])

  const finish = () => {
    finished.current = true
    clearTimeout(timer.current)
    setStatus('ready')
  }

  return (
    <View style={styles.frame}>
      <MapView
        style={styles.map}
        loadingEnabled
        loadingIndicatorColor={colors.primary}
        initialRegion={{
          latitude: point?.lat ?? 16.468,
          longitude: point?.lng ?? 107.578,
          latitudeDelta: point ? 0.003 : 0.012,
          longitudeDelta: point ? 0.003 : 0.012,
        }}
        onMapReady={Platform.OS === 'ios' ? finish : undefined}
        onMapLoaded={Platform.OS === 'android' ? finish : undefined}
      >
        {state.places.map(item => {
          const position = mapPointFor(item)
          return position ? (
            <Marker
              key={item.id}
              pinColor={selected === item.id ? colors.primary : colors.secondary}
              coordinate={{ latitude: position.lat, longitude: position.lng }}
              title={publishedText(item, language)?.title ?? item.canonicalTitle}
              onPress={() => onOpen(item.id)}
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
      {status !== 'ready' && (
        <View style={styles.status} accessibilityLiveRegion="polite">
          {status === 'loading' && <ActivityIndicator color={colors.primary} />}
          <Text style={status === 'failed' ? styles.error : styles.hint}>
            {t(status === 'failed' ? 'jMapFailed' : 'jMapLoading')}
          </Text>
        </View>
      )}
    </View>
  )
}
// TẠI SAO (VisitorMap): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
// tại một nơi.

const styles = StyleSheet.create({
  section: { gap: spacing.sm, marginVertical: spacing.md },
  frame: { height: 340, overflow: 'hidden', borderRadius: 18 },
  map: { flex: 1 },
  status: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, justifyContent: 'center', alignItems: 'center',
    padding: spacing.lg, gap: spacing.sm, backgroundColor: colors.background },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  hint: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  error: { color: colors.danger, fontSize: 14, lineHeight: 21 },
})
