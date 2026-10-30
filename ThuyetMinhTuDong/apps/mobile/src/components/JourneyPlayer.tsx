/**
 * FILE NÀY LÀM GÌ
 * Trình nghe thuyết minh: trạng thái phát, tạm dừng, tua, tốc độ và nút đóng; thao tác được chuyển
 * đến controller chung.
 *
 * VỊ TRÍ: apps/mobile/src/components/JourneyPlayer.tsx
 * DÙNG BỞI: apps/mobile/src/components/index.ts; apps/mobile/src/navigation/RootNavigator.tsx.
 * PHỤ THUỘC: react; react-native; @expo/vector-icons; @react-native-community/slider;
 * react-native-safe-area-context; @travelguide/visitor-core; ../i18n; ../hooks/useJourney;
 * ./Action; ./Cover; ../theme
 * TẠI SAO TÁCH FILE: Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
 * tại một nơi.
 */
// Nhập các thành phần từ 'react'.
import { useEffect, useState } from 'react'
// Nhập các thành phần từ 'react-native'.
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
// Nhập các thành phần từ '@expo/vector-icons'.
import { Ionicons } from '@expo/vector-icons'
// Nhập các thành phần từ '@react-native-community/slider'.
import Slider from '@react-native-community/slider'
// Nhập các thành phần từ 'react-native-safe-area-context'.
import { useSafeAreaInsets } from 'react-native-safe-area-context'
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { LANGUAGES } from '@travelguide/visitor-core'
// Nhập các thành phần từ '../i18n'.
import { useText } from '../i18n'
// Nhập các thành phần từ '../hooks/useJourney'.
import { useJourney } from '../hooks/useJourney'
// Nhập các thành phần từ './Action'.
import { Action } from './Action'
// Nhập các thành phần từ './Cover'.
import { Cover } from './Cover'
// Nhập các thành phần từ '../theme'.
import { colors, spacing } from '../theme'

// Khai báo clock: khai báo callback (value: number) => Math.floor(value / 60) + ':' + String(Math.floor(value %.
const clock = (value: number) => Math.floor(value / 60) + ':' + String(Math.floor(value % 60)).padStart(2, '0')
// TẠI SAO (clock): Thời gian audio là số giây, nhưng người dùng cần cách đọc phút và giây; dữ
// liệu lỗi không được tạo nhãn NaN.
// CHỨC NĂNG: Trình nghe thuyết minh: trạng thái phát, tạm dừng, tua, tốc độ và nút đóng; thao tác
// được chuyển đến controller chung.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo JourneyPlayer(). Component hàm nhận props và dựng phần giao diện JourneyPlayer.
export function JourneyPlayer() {
  // Khai báo { engine, state, resumeSaved }: useJourney() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
  const { engine, state, resumeSaved } = useJourney()
  // Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
  const t = useText()
  // Khai báo insets: Gọi useSafeAreaInsets().
  const insets = useSafeAreaInsets()
  // CHỨC NĂNG: Giá trị đang kéo/đang sửa, chưa áp dụng vào dữ liệu chính.
  // Khai báo [draft, setDraft]: useState() giữ trạng thái qua các lần render.
  const [draft, setDraft] = useState<number>()
  // Khai báo session: đọc state.session từ đối tượng/mảng để dùng tại bước hiện tại.
  const session = state.session
  // CHỨC NĂNG: Lỗi GPS hiển thị ở màn bản đồ, không tự mở lại player đã đóng.
  // Khai báo playbackError: chọn giữa hai giá trị theo điều kiện state.error === 'gpsFailed' || state.error === 'gpsWeak'.
  const playbackError = state.error === 'gpsFailed' || state.error === 'gpsWeak' ? undefined : state.error
  // DÒNG NÀY LÀM GÌ: Xóa giá trị kéo thanh tua tạm thời khi bài hoặc ngôn ngữ được thay.
  // CÁCH HOẠT ĐỘNG: Sau khi xóa draft, thanh tua hiển thị vị trí thật của session mới.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: session?.audioId,
  // session?.placeId, session?.language.
  // Đăng ký useEffect để thực hiện tác vụ sau render. | Cập nhật trạng thái qua setDraft(undefined).
  useEffect(() => { setDraft(undefined) }, [session?.audioId, session?.placeId, session?.language])
  // TẠI SAO: Không để thời điểm đang kéo của bài trước xuất hiện trên bài mới.
  // Rẽ nhánh nếu !session && !state.restore && !playbackError && state.status !== 'loading'. | Trả kết quả: sử dụng null làm giá trị của bước hiện tại.
  if (!session && !state.restore && !playbackError && state.status !== 'loading') return null
  // Khai báo place: state.places.find lấy phần tử đầu tiên phù hợp.
  const place = state.places.find(item => item.id === session?.placeId)
  // Khai báo playing: tính biểu thức state.status === 'playing'.
  const playing = state.status === 'playing', ended = state.status === 'ended'
  // Khai báo busy: tính biểu thức state.status === 'loading'.
  const busy = state.status === 'loading', disabled = busy || state.status === 'error'
  // Khai báo primaryLabel: Gọi t(playing ? 'jPause' : ended ? 'jReplay' : 'jResume').
  const primaryLabel = t(playing ? 'jPause' : ended ? 'jReplay' : 'jResume')
  // Khai báo toggle: khai báo callback () => { if (!session) return if (playing) engine.pause() else if (ended ||.
  const toggle = () => {
    // Rẽ nhánh nếu !session. | Thoát hàm hiện tại ngay.
    if (!session) return
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `if (playing) engine.pause()`: Rẽ nhánh nếu playing. | Thực hiện engine.pause tạm dừng nguồn âm thanh hiện tại.
     * DÒNG `else if (ended || state.status === 'error') void engine.play(session.placeId, session`: Rẽ nhánh nếu playing. | Rẽ nhánh nếu ended || state.status === 'error'. | Thực hiện sử dụng void engine.play(session.placeId, session.language) làm giá trị của bước hiện tại.
     * DÒNG `else void engine.resume()`: Rẽ nhánh nếu ended || state.status === 'error'. | Thực hiện sử dụng void engine.resume() làm giá trị của bước hiện tại.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    if (playing) engine.pause()
    else if (ended || state.status === 'error') void engine.play(session.placeId, session.language)
    else void engine.resume()
  }
  // TẠI SAO (toggle): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện tại
  // một nơi.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<View style={[styles.shell, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính paddingBottom: Gọi Math.max(insets.bottom, spacing.sm).
   * DÒNG `<View style={styles.player}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<View style={styles.header}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `{session && <Cover uri={place?.images[0]} style={styles.artwork} />}`: Đưa biểu thức JavaScript session && <Cover uri={place?.images[0]} style={styles.artwork} /> vào JSX. | Truyền địa chỉ tài nguyên vào component. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<View style={styles.metadata}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<View style={styles.topline}><Ionicons name="headset-outline" size={13} color={colors`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính size: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính color: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<Text style={styles.eyebrow}>{t('read')}</Text></View>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Text numberOfLines={2} style={styles.title}>{session?.title ?? t(busy ? 'jPreparing'`: Dựng Text. | Thuộc tính numberOfLines: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `{session && <View style={styles.subtitle}>`: Đưa biểu thức JavaScript session && <View style={styles.subtitle}> <Text style={styles.language}>{LANGUAGES.find(item => item.code ===  vào JSX. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Text style={styles.language}>{LANGUAGES.find(item => item.code === session.language)`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<View style={[styles.dot, playing && { backgroundColor: colors.playerAccent }]} />`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính backgroundColor: đọc colors.playerAccent từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `<Text style={styles.status}>{t(ended ? 'jEnded' : playing ? 'jPlaying' : 'jPaused')}<`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `</View>}`: Đóng phần giao diện View.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `<Pressable accessibilityRole="button" accessibilityLabel={t('closePlayer')} hitSlop={`: Dựng Pressable. | Thuộc tính accessibilityRole: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính accessibilityLabel: cung cấp tên đọc cho trình đọc màn hình. | Thuộc tính hitSlop: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `onPress={() => { setDraft(undefined); engine.close() }}`: Thuộc tính onPress: nối thao tác nhấn với callback. | Cập nhật trạng thái qua setDraft(undefined). | Thực hiện Gọi engine.close().
   * DÒNG `style={({ pressed }) => [styles.close, pressed && styles.pressed]}>`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Ionicons name="close" size={22} color={colors.white} />`: Dựng Ionicons. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính size: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính color: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `</Pressable>`: Đóng phần giao diện Pressable.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `{state.restore && <View style={styles.notice}>`: Đưa biểu thức JavaScript state.restore && <View style={styles.notice}> {state.changed && <Text style={styles.noticeText}>{t('jVersionCh vào JSX. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `{state.changed && <Text style={styles.noticeText}>{t('jVersionChanged')}</Text>}`: Đưa biểu thức JavaScript state.changed && <Text style={styles.noticeText}>{t('jVersionChanged')}</Text> vào JSX. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<View style={styles.noticeActions}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Action title={t('jContinue')} icon="play" variant="primary" onPress={() => { void re`: Dựng Action. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính icon: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính variant: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onPress: nối thao tác nhấn với callback. | Thực hiện sử dụng void resumeSaved() làm giá trị của bước hiện tại.
   * DÒNG `<Action title={t('jDiscard')} onPress={() => engine.dismissRestore()} />`: Dựng Action. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính onPress: nối thao tác nhấn với callback.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `</View>}`: Đóng phần giao diện View.
   * DÒNG `{playbackError && <View style={styles.notice}>`: Đưa biểu thức JavaScript playbackError && <View style={styles.notice}> <Text accessibilityRole="alert" style={styles.noticeText}>{t(pla vào JSX. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Text accessibilityRole="alert" style={styles.noticeText}>{t(playbackError)}</Text>`: Dựng Text. | Thuộc tính accessibilityRole: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `{(state.status === 'error' || playbackError === 'loadError') && <Action title={t('jRe`: Đưa biểu thức JavaScript (state.status === 'error' || playbackError === 'loadError') && <Action title={t('jRetry')} onPress={() => engi vào JSX. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính onPress: nối thao tác nhấn với callback.
   * DÒNG `</View>}`: Đóng phần giao diện View.
   * DÒNG `{busy && <Text style={styles.noticeText}>{t('jPreparing')}</Text>}`: Đưa biểu thức JavaScript busy && <Text style={styles.noticeText}>{t('jPreparing')}</Text> vào JSX. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `{session && <>`: Đưa biểu thức JavaScript session && <> {/* CHỨC NĂNG: Vẫn tua nguồn audio thật khi thả.
   * DÒNG `<View>`: Dựng View.
   * DÒNG `<Slider accessibilityLabel={t('jSeek')} minimumValue={0} maximumValue={session.durati`: Dựng Slider. | Thuộc tính accessibilityLabel: cung cấp tên đọc cho trình đọc màn hình. | Thuộc tính minimumValue: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính maximumValue: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `minimumTrackTintColor={colors.playerAccent} maximumTrackTintColor={colors.playerContr`: Thuộc tính minimumTrackTintColor: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính maximumTrackTintColor: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính thumbTintColor: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `value={draft ?? session.position} disabled={disabled}`: Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái. | Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng.
   * DÒNG `onSlidingStart={() => setDraft(session.position)} onValueChange={setDraft}`: Thuộc tính onSlidingStart: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onValueChange: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `onSlidingComplete={value => { void engine.seek(value).finally(() => setDraft(undefine`: Thuộc tính onSlidingComplete: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thực hiện sử dụng void engine.seek(value).finally(() => setDraft(undefined)) làm giá trị của bước hiện tại.
   * DÒNG `<View style={styles.times}><Text style={styles.time}>{clock(draft ?? session.position`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `<View style={styles.controls}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Pressable accessibilityRole="button" accessibilityLabel={t('jBack')} disabled={disab`: Dựng Pressable. | Thuộc tính accessibilityRole: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính accessibilityLabel: cung cấp tên đọc cho trình đọc màn hình. | Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng.
   * DÒNG `onPress={() => { void engine.seek(session.position - 10) }} style={({ pressed }) => [`: Thuộc tính onPress: nối thao tác nhấn với callback. | Thực hiện sử dụng void engine.seek(session.position - 10) làm giá trị của bước hiện tại. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Ionicons name="play-back" size={20} color={colors.white} /><Text style={styles.skipT`: Dựng Ionicons. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính size: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính color: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `</Pressable>`: Đóng phần giao diện Pressable.
   * DÒNG `<Pressable accessibilityRole="button" accessibilityLabel={primaryLabel} disabled={bus`: Dựng Pressable. | Thuộc tính accessibilityRole: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính accessibilityLabel: cung cấp tên đọc cho trình đọc màn hình. | Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng. | Thuộc tính onPress: nối thao tác nhấn với callback.
   * DÒNG `style={({ pressed }) => [styles.play, busy && styles.disabled, pressed && styles.pres`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Ionicons name={playing ? 'pause' : ended ? 'refresh' : 'play'} size={27} color={colo`: Dựng Ionicons. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính size: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính color: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `</Pressable>`: Đóng phần giao diện Pressable.
   * DÒNG `<Pressable accessibilityRole="button" accessibilityLabel={t('jForward')} disabled={di`: Dựng Pressable. | Thuộc tính accessibilityRole: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính accessibilityLabel: cung cấp tên đọc cho trình đọc màn hình. | Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng.
   * DÒNG `onPress={() => { void engine.seek(session.position + 10) }} style={({ pressed }) => [`: Thuộc tính onPress: nối thao tác nhấn với callback. | Thực hiện sử dụng void engine.seek(session.position + 10) làm giá trị của bước hiện tại. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Ionicons name="play-forward" size={20} color={colors.white} /><Text style={styles.sk`: Dựng Ionicons. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính size: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính color: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `</Pressable>`: Đóng phần giao diện Pressable.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `<View style={styles.rateRow}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Text style={styles.rateLabel}>{t('jSpeed')}</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={`: Dựng ScrollView. | Thuộc tính horizontal: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính showsHorizontalScrollIndicator: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính contentContainerStyle: định dạng vùng nội dung cuộn để không khóa chiều cao nội dung.
   * DÒNG `{[0.75, 1, 1.25, 1.5, 2].map(rate => <Pressable key={rate} accessibilityRole="button"`: Đưa biểu thức JavaScript [0.75, 1, 1.25, 1.5, 2].map(rate => <Pressable key={rate} accessibilityRole="button" accessibilityLabel={t('jS vào JSX. | Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách. | Thuộc tính accessibilityRole: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `accessibilityLabel={t('jSpeed') + ' ' + rate + '×'} accessibilityState={{ selected: r`: Thuộc tính accessibilityLabel: cung cấp tên đọc cho trình đọc màn hình. | Thuộc tính accessibilityState: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Gán thuộc tính selected: tính biểu thức rate === session.rate. | Đặt trường disabled bằng giá trị của biến cùng tên.
   * DÒNG `disabled={disabled} onPress={() => engine.rate(rate)} style={[styles.rate, rate === s`: Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng. | Thuộc tính onPress: nối thao tác nhấn với callback. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Text style={[styles.rateText, rate === session.rate && styles.selectedRateText]}>{ra`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `</Pressable>)}`: Đóng phần giao diện Pressable.
   * DÒNG `</ScrollView>`: Đóng phần giao diện ScrollView.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `</>}`: Đưa biểu thức JavaScript session && <> {/* CHỨC NĂNG: Vẫn tua nguồn audio thật khi thả.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return (
    <View style={[styles.shell, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      <View style={styles.player}>
        {/* CHỨC NĂNG: Header giống web: ảnh, nội dung và × trên cùng hàng.
            XỬ LÝ: Không dùng absolute cho nút đóng nên không che tên hoặc tạo khoảng trắng. */}
        <View style={styles.header}>
          {session && <Cover uri={place?.images[0]} style={styles.artwork} />}
          <View style={styles.metadata}>
            <View style={styles.topline}><Ionicons name="headset-outline" size={13} color={colors.playerMuted} />
              <Text style={styles.eyebrow}>{t('read')}</Text></View>
            <Text numberOfLines={2} style={styles.title}>{session?.title ?? t(busy ? 'jPreparing' : state.restore ? 'jContinue' : 'jTitle')}</Text>
            {session && <View style={styles.subtitle}>
              <Text style={styles.language}>{LANGUAGES.find(item => item.code === session.language)?.label}</Text>
              <View style={[styles.dot, playing && { backgroundColor: colors.playerAccent }]} />
              <Text style={styles.status}>{t(ended ? 'jEnded' : playing ? 'jPlaying' : 'jPaused')}</Text>
            </View>}
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel={t('closePlayer')} hitSlop={2}
            onPress={() => { setDraft(undefined); engine.close() }}
            style={({ pressed }) => [styles.close, pressed && styles.pressed]}>
            <Ionicons name="close" size={22} color={colors.white} />
          </Pressable>
        </View>
        {state.restore && <View style={styles.notice}>
          {state.changed && <Text style={styles.noticeText}>{t('jVersionChanged')}</Text>}
          <View style={styles.noticeActions}>
            <Action title={t('jContinue')} icon="play" variant="primary" onPress={() => { void resumeSaved() }} />
            <Action title={t('jDiscard')} onPress={() => engine.dismissRestore()} />
          </View>
        </View>}
        {playbackError && <View style={styles.notice}>
          <Text accessibilityRole="alert" style={styles.noticeText}>{t(playbackError)}</Text>
          {(state.status === 'error' || playbackError === 'loadError') && <Action title={t('jRetry')} onPress={() => engine.retry()} />}
        </View>}
        {busy && <Text style={styles.noticeText}>{t('jPreparing')}</Text>}
        {session && <>
          {/* CHỨC NĂNG: Vẫn tua nguồn audio thật khi thả; không đổi cơ chế giữ tay kéo. */}
          <View>
            <Slider accessibilityLabel={t('jSeek')} minimumValue={0} maximumValue={session.duration}
              minimumTrackTintColor={colors.playerAccent} maximumTrackTintColor={colors.playerControl} thumbTintColor={colors.white}
              value={draft ?? session.position} disabled={disabled}
              onSlidingStart={() => setDraft(session.position)} onValueChange={setDraft}
              onSlidingComplete={value => { void engine.seek(value).finally(() => setDraft(undefined)) }} />
            <View style={styles.times}><Text style={styles.time}>{clock(draft ?? session.position)}</Text><Text style={styles.time}>{clock(session.duration)}</Text></View>
          </View>
          <View style={styles.controls}>
            <Pressable accessibilityRole="button" accessibilityLabel={t('jBack')} disabled={disabled}
              onPress={() => { void engine.seek(session.position - 10) }} style={({ pressed }) => [styles.skip, disabled && styles.disabled, pressed && styles.pressed]}>
              <Ionicons name="play-back" size={20} color={colors.white} /><Text style={styles.skipText}>10</Text>
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel={primaryLabel} disabled={busy} onPress={toggle}
              style={({ pressed }) => [styles.play, busy && styles.disabled, pressed && styles.pressed]}>
              <Ionicons name={playing ? 'pause' : ended ? 'refresh' : 'play'} size={27} color={colors.playerBackground} />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel={t('jForward')} disabled={disabled}
              onPress={() => { void engine.seek(session.position + 10) }} style={({ pressed }) => [styles.skip, disabled && styles.disabled, pressed && styles.pressed]}>
              <Ionicons name="play-forward" size={20} color={colors.white} /><Text style={styles.skipText}>10</Text>
            </Pressable>
          </View>
          <View style={styles.rateRow}>
            <Text style={styles.rateLabel}>{t('jSpeed')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rates}>
              {[0.75, 1, 1.25, 1.5, 2].map(rate => <Pressable key={rate} accessibilityRole="button"
                accessibilityLabel={t('jSpeed') + ' ' + rate + '×'} accessibilityState={{ selected: rate === session.rate, disabled }}
                disabled={disabled} onPress={() => engine.rate(rate)} style={[styles.rate, rate === session.rate && styles.selectedRate]}>
                <Text style={[styles.rateText, rate === session.rate && styles.selectedRateText]}>{rate}×</Text>
              </Pressable>)}
            </ScrollView>
          </View>
        </>}
      </View>
    </View>
  )
}
// TẠI SAO (JourneyPlayer): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao
// diện tại một nơi.
// CHỨC NĂNG: Dùng token chung; bố cục mềm để chữ đa ngôn ngữ không đè nút đóng.
// Khai báo styles: Gọi StyleSheet.create({ shell: { padding: spacing.sm, backgroundColor: colors.background, bord.
const styles = StyleSheet.create({
  // Gán thuộc tính shell: tạo object gồm padding, backgroundColor, borderTopWidth, borderTopColor. | Gán thuộc tính padding: đọc spacing.sm từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính backgroundColor: đọc colors.background từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính borderTopWidth: giá trị số 1. | Gán thuộc tính borderTopColor: đọc colors.border từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  shell: { padding: spacing.sm, backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.border },
  // Gán thuộc tính player: tạo object gồm padding, borderRadius, backgroundColor, gap. | Gán thuộc tính padding: đọc spacing.md từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính borderRadius: giá trị số 22. | Gán thuộc tính backgroundColor: đọc colors.playerBackground từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính gap: đọc spacing.md từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  player: { padding: spacing.md, borderRadius: 22, backgroundColor: colors.playerBackground, gap: spacing.md },
  // Gán thuộc tính header: tạo object gồm flexDirection, gap, alignItems. | Gán thuộc tính flexDirection: chuỗi 'row'. | Gán thuộc tính gap: giá trị số 10. | Gán thuộc tính alignItems: chuỗi 'center'.
  header: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  // Gán thuộc tính artwork: tạo object gồm width, height, borderRadius, overflow, flexShrink. | Gán thuộc tính width: giá trị số 56. | Gán thuộc tính height: giá trị số 60. | Gán thuộc tính borderRadius: giá trị số 12. | Gán thuộc tính overflow: chuỗi 'hidden'. | Gán thuộc tính flexShrink: giá trị số 0.
  artwork: { width: 56, height: 60, borderRadius: 12, overflow: 'hidden', flexShrink: 0 },
  // Gán thuộc tính metadata: tạo object gồm flex, minWidth, gap. | Gán thuộc tính flex: giá trị số 1. | Gán thuộc tính minWidth: giá trị số 0. | Gán thuộc tính gap: giá trị số 3.
  metadata: { flex: 1, minWidth: 0, gap: 3 },
  // Gán thuộc tính topline: tạo object gồm flexDirection, alignItems, gap. | Gán thuộc tính flexDirection: chuỗi 'row'. | Gán thuộc tính alignItems: chuỗi 'center'. | Gán thuộc tính gap: giá trị số 5.
  topline: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  // Gán thuộc tính eyebrow: tạo object gồm color, fontSize, lineHeight. | Gán thuộc tính color: đọc colors.playerMuted từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính fontSize: giá trị số 10. | Gán thuộc tính lineHeight: giá trị số 14.
  eyebrow: { color: colors.playerMuted, fontSize: 10, lineHeight: 14 },
  // Gán thuộc tính title: tạo object gồm fontSize, lineHeight, color, fontWeight. | Gán thuộc tính fontSize: giá trị số 17. | Gán thuộc tính lineHeight: giá trị số 22. | Gán thuộc tính color: đọc colors.white từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính fontWeight: chuỗi '700'.
  title: { fontSize: 17, lineHeight: 22, color: colors.white, fontWeight: '700' },
  // Gán thuộc tính subtitle: tạo object gồm flexDirection, alignItems, gap, flexWrap. | Gán thuộc tính flexDirection: chuỗi 'row'. | Gán thuộc tính alignItems: chuỗi 'center'. | Gán thuộc tính gap: giá trị số 6. | Gán thuộc tính flexWrap: chuỗi 'wrap'.
  subtitle: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  // Gán thuộc tính language: tạo object gồm color, backgroundColor, paddingHorizontal, paddingVertical, borderRadius, fontSize. | Gán thuộc tính color: đọc colors.playerMuted từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính backgroundColor: đọc colors.playerControl từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính paddingHorizontal: giá trị số 6. | Gán thuộc tính paddingVertical: giá trị số 2. | Gán thuộc tính borderRadius: giá trị số 5. | Gán thuộc tính fontSize: giá trị số 10.
  language: { color: colors.playerMuted, backgroundColor: colors.playerControl, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5, fontSize: 10 },
  // Gán thuộc tính dot: tạo object gồm width, height, borderRadius, backgroundColor. | Gán thuộc tính width: giá trị số 5. | Gán thuộc tính height: giá trị số 5. | Gán thuộc tính borderRadius: giá trị số 3. | Gán thuộc tính backgroundColor: đọc colors.playerMuted từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.playerMuted },
  // Gán thuộc tính status: tạo object gồm fontSize, lineHeight, color. | Gán thuộc tính fontSize: giá trị số 10. | Gán thuộc tính lineHeight: giá trị số 15. | Gán thuộc tính color: đọc colors.playerMuted từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  status: { fontSize: 10, lineHeight: 15, color: colors.playerMuted },
  // Gán thuộc tính close: tạo object gồm width, height, borderRadius, alignSelf, backgroundColor, alignItems, justifyContent. | Gán thuộc tính width: giá trị số 44. | Gán thuộc tính height: giá trị số 44. | Gán thuộc tính borderRadius: giá trị số 22. | Gán thuộc tính alignSelf: chuỗi 'flex-start'. | Gán thuộc tính backgroundColor: đọc colors.playerControl từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính alignItems: chuỗi 'center'. | Gán thuộc tính justifyContent: chuỗi 'center'.
  close: { width: 44, height: 44, borderRadius: 22, alignSelf: 'flex-start', backgroundColor: colors.playerControl, alignItems: 'center', justifyContent: 'center' },
  // Gán thuộc tính times: tạo object gồm flexDirection, justifyContent, marginTop. | Gán thuộc tính flexDirection: chuỗi 'row'. | Gán thuộc tính justifyContent: chuỗi 'space-between'. | Gán thuộc tính marginTop: sử dụng -4 làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  times: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -4 },
  // Gán thuộc tính time: tạo object gồm fontSize, color, fontVariant. | Gán thuộc tính fontSize: giá trị số 11. | Gán thuộc tính color: đọc colors.playerMuted từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính fontVariant: tạo mảng ['tabular-nums'].
  time: { fontSize: 11, color: colors.playerMuted, fontVariant: ['tabular-nums'] },
  // Gán thuộc tính controls: tạo object gồm flexDirection, justifyContent, alignItems, gap. | Gán thuộc tính flexDirection: chuỗi 'row'. | Gán thuộc tính justifyContent: chuỗi 'center'. | Gán thuộc tính alignItems: chuỗi 'center'. | Gán thuộc tính gap: giá trị số 24.
  controls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 24 },
  // Gán thuộc tính skip: tạo object gồm width, height, alignItems, justifyContent, borderRadius, backgroundColor. | Gán thuộc tính width: giá trị số 44. | Gán thuộc tính height: giá trị số 44. | Gán thuộc tính alignItems: chuỗi 'center'. | Gán thuộc tính justifyContent: chuỗi 'center'. | Gán thuộc tính borderRadius: giá trị số 22. | Gán thuộc tính backgroundColor: đọc colors.playerControl từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  skip: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22, backgroundColor: colors.playerControl },
  // Gán thuộc tính skipText: tạo object gồm fontSize, lineHeight, color, fontWeight. | Gán thuộc tính fontSize: giá trị số 9. | Gán thuộc tính lineHeight: giá trị số 10. | Gán thuộc tính color: đọc colors.white từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính fontWeight: chuỗi '600'.
  skipText: { fontSize: 9, lineHeight: 10, color: colors.white, fontWeight: '600' },
  // Gán thuộc tính play: tạo object gồm width, height, borderRadius, alignItems, justifyContent, backgroundColor. | Gán thuộc tính width: giá trị số 58. | Gán thuộc tính height: giá trị số 58. | Gán thuộc tính borderRadius: giá trị số 29. | Gán thuộc tính alignItems: chuỗi 'center'. | Gán thuộc tính justifyContent: chuỗi 'center'. | Gán thuộc tính backgroundColor: đọc colors.white từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  play: { width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
  // Gán thuộc tính rateRow: tạo object gồm flexDirection, alignItems, gap, paddingTop, borderTopWidth, borderTopColor. | Gán thuộc tính flexDirection: chuỗi 'row'. | Gán thuộc tính alignItems: chuỗi 'center'. | Gán thuộc tính gap: đọc spacing.sm từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính paddingTop: đọc spacing.sm từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính borderTopWidth: giá trị số 1. | Gán thuộc tính borderTopColor: đọc colors.playerControl từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  rateRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.playerControl },
  // Gán thuộc tính rateLabel: tạo object gồm color, fontSize, maxWidth. | Gán thuộc tính color: đọc colors.playerMuted từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính fontSize: giá trị số 11. | Gán thuộc tính maxWidth: giá trị số 70.
  rateLabel: { color: colors.playerMuted, fontSize: 11, maxWidth: 70 },
  // Gán thuộc tính rates: tạo object gồm flexDirection, gap, flexGrow, justifyContent. | Gán thuộc tính flexDirection: chuỗi 'row'. | Gán thuộc tính gap: giá trị số 6. | Gán thuộc tính flexGrow: giá trị số 1. | Gán thuộc tính justifyContent: chuỗi 'center'.
  rates: { flexDirection: 'row', gap: 6, flexGrow: 1, justifyContent: 'center' },
  // Gán thuộc tính rate: tạo object gồm minWidth, minHeight, paddingHorizontal, borderRadius, backgroundColor, alignItems, justifyContent. | Gán thuộc tính minWidth: giá trị số 40. | Gán thuộc tính minHeight: giá trị số 36. | Gán thuộc tính paddingHorizontal: giá trị số 8. | Gán thuộc tính borderRadius: giá trị số 9. | Gán thuộc tính backgroundColor: đọc colors.playerControl từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính alignItems: chuỗi 'center'. | Gán thuộc tính justifyContent: chuỗi 'center'.
  rate: { minWidth: 40, minHeight: 36, paddingHorizontal: 8, borderRadius: 9, backgroundColor: colors.playerControl, alignItems: 'center', justifyContent: 'center' },
  // Gán thuộc tính rateText: tạo object gồm color, fontSize, fontWeight. | Gán thuộc tính color: đọc colors.playerMuted từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính fontSize: giá trị số 11. | Gán thuộc tính fontWeight: chuỗi '600'.
  rateText: { color: colors.playerMuted, fontSize: 11, fontWeight: '600' },
  // Gán thuộc tính selectedRate: tạo object gồm backgroundColor. | Gán thuộc tính backgroundColor: đọc colors.playerAccent từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  selectedRate: { backgroundColor: colors.playerAccent },
  // Gán thuộc tính selectedRateText: tạo object gồm color. | Gán thuộc tính color: đọc colors.playerBackground từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  selectedRateText: { color: colors.playerBackground },
  // Gán thuộc tính disabled: tạo object gồm opacity. | Gán thuộc tính opacity: giá trị số 0.4. | Gán thuộc tính pressed: tạo object gồm opacity. | Gán thuộc tính opacity: giá trị số 0.75.
  disabled: { opacity: 0.4 }, pressed: { opacity: 0.75 },
  // Gán thuộc tính notice: tạo object gồm gap. | Gán thuộc tính gap: đọc spacing.sm từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  notice: { gap: spacing.sm },
  // Gán thuộc tính noticeText: tạo object gồm color, fontSize, lineHeight. | Gán thuộc tính color: đọc colors.playerMuted từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính fontSize: giá trị số 12. | Gán thuộc tính lineHeight: giá trị số 19.
  noticeText: { color: colors.playerMuted, fontSize: 12, lineHeight: 19 },
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `noticeActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },`: Gán thuộc tính noticeActions: tạo object gồm flexDirection, flexWrap, gap. | Gán thuộc tính flexDirection: chuỗi 'row'. | Gán thuộc tính flexWrap: chuỗi 'wrap'. | Gán thuộc tính gap: đọc spacing.sm từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  noticeActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
})
