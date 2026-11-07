/**
 * CHỨC NĂNG: [DINH-VI] [THUYET-MINH]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Trình nghe thuyết minh: trạng thái phát, tạm dừng, tua, tốc độ và nút đóng; thao tác được chuyển đến controller chung.
 *
 * VỊ TRÍ: apps/mobile/src/features/journey/components/TrinhNgheThuyetMinh.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/navigation/DieuHuongGoc.tsx
 *
 * PHỤ THUỘC:
 * - react
 * - react-native
 * - @expo/vector-icons
 * - @react-native-community/slider
 * - react-native-safe-area-context
 * - @travelguide/visitor-core
 * - ../../language/i18n/CauHinhNgonNgu
 * - ../hooks/useHanhTrinh
 * - ../../../shared/components/NutThaoTac
 * - ../../../shared/components/AnhBia
 * - ../../../shared/GiaoDienChung
 *
 * CÁC KHỐI CHÍNH:
 * 1. clock
 * 2. JourneyPlayer
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { useEffect, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Slider from '@react-native-community/slider'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LANGUAGES } from '@travelguide/visitor-core'
import { useText } from '../../language/i18n/CauHinhNgonNgu'
import { useJourney } from '../hooks/useHanhTrinh'
import { Action } from '../../../shared/components/NutThaoTac'
import { Cover } from '../../../shared/components/AnhBia'
import { colors, spacing } from '../../../shared/GiaoDienChung'

const clock = (value: number) =>
  Math.floor(value / 60) + ':' + String(Math.floor(value % 60)).padStart(2, '0')
// TẠI SAO (clock): Thời gian audio là số giây, nhưng người dùng cần cách đọc phút và giây; dữ
// liệu lỗi không được tạo nhãn NaN.
// CHỨC NĂNG: Trình nghe thuyết minh: trạng thái phát, tạm dừng, tua, tốc độ và nút đóng; thao tác
// được chuyển đến controller chung.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.

// ==================== [DINH-VI] [THUYET-MINH] JourneyPlayer ====================
export function JourneyPlayer() {
  const { engine, state, resumeSaved } = useJourney()

  const t = useText()

  const insets = useSafeAreaInsets()
  // CHỨC NĂNG: Giá trị đang kéo/đang sửa, chưa áp dụng vào dữ liệu chính.

  const [expanded, setExpanded] = useState(false)
  const [draft, setDraft] = useState<number>()

  const session = state.session
  // CHỨC NĂNG: Lỗi GPS hiển thị ở màn bản đồ, không tự mở lại player đã đóng.

  const playbackError =
    state.error === 'gpsFailed' || state.error === 'gpsWeak' ? undefined : state.error
  // CHỨC NĂNG: Xóa giá trị kéo thanh tua tạm thời khi bài hoặc ngôn ngữ được thay.
  // XỬ LÝ: Sau khi xóa draft, thanh tua hiển thị vị trí thật của session mới.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: session?.audioId,
  // session?.placeId, session?.language.
  // Đăng ký useEffect để thực hiện tác vụ sau render. | Cập nhật trạng thái qua setDraft(undefined).
  useEffect(() => {
    setDraft(undefined)
  }, [session?.audioId, session?.placeId, session?.language])
  // TẠI SAO: Không để thời điểm đang kéo của bài trước xuất hiện trên bài mới.

  if (!session && !state.restore && !playbackError && state.status !== 'loading') return null

  const place = state.places.find((item) => item.id === session?.placeId)

  const playing = state.status === 'playing',
    ended = state.status === 'ended'

  const busy = state.status === 'loading',
    disabled = busy || state.status === 'error'

  const primaryLabel = t(playing ? 'jPause' : ended ? 'jReplay' : 'jResume')

  const toggle = () => {
    if (!session) return

    if (playing) engine.pause()
    else if (ended || state.status === 'error') void engine.play(session.placeId, session.language)
    else void engine.resume()
  }
  // TẠI SAO (toggle): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện tại
  // một nơi.

  return (
    <View style={[styles.shell, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      <View style={styles.player}>
        {/* CHỨC NĂNG: Header giống web: ảnh, nội dung và × trên cùng hàng.
            XỬ LÝ: Không dùng absolute cho nút đóng nên không che tên hoặc tạo khoảng trắng. */}
        <View style={styles.header}>
          {session && <Cover uri={place?.images[0]} style={styles.artwork} />}
          <View style={styles.metadata}>
            <View style={styles.topline}>
              <Ionicons name="headset-outline" size={13} color={colors.playerMuted} />
              <Text style={styles.eyebrow}>{t('read')}</Text>
            </View>
            <Text numberOfLines={2} style={styles.title}>
              {session?.title ?? t(busy ? 'jPreparing' : state.restore ? 'jContinue' : 'jTitle')}
            </Text>
            {session && (
              <View style={styles.subtitle}>
                <Text style={styles.language}>
                  {LANGUAGES.find((item) => item.code === session.language)?.label}
                </Text>
                <View style={[styles.dot, playing && { backgroundColor: colors.playerAccent }]} />
                <Text style={styles.status}>
                  {t(ended ? 'jEnded' : playing ? 'jPlaying' : 'jPaused')}
                </Text>
              </View>
            )}
          </View>
          {session && !expanded && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={primaryLabel}
              disabled={busy}
              onPress={toggle}
              style={styles.miniPlay}
            >
              <Ionicons
                name={playing ? 'pause' : ended ? 'refresh' : 'play'}
                size={22}
                color={colors.playerBackground}
              />
            </Pressable>
          )}
          {session && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t(expanded ? 'collapsePlayer' : 'expandPlayer')}
              accessibilityState={{ expanded }}
              onPress={() => setExpanded((value) => !value)}
              style={styles.expand}
            >
              <Ionicons
                name={expanded ? 'chevron-down' : 'chevron-up'}
                size={22}
                color={colors.white}
              />
            </Pressable>
          )}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('closePlayer')}
            hitSlop={2}
            onPress={() => {
              setDraft(undefined)
              engine.close()
            }}
            style={({ pressed }) => [styles.close, pressed && styles.pressed]}
          >
            {/* CHỨC NĂNG: Dấu X vẽ bằng hai nét, luôn ở tâm nút và không lệch theo font. */}
            <View pointerEvents="none" accessible={false} style={styles.closeIcon}>
              <View style={[styles.closeStroke, styles.closeForward]} />
              <View style={[styles.closeStroke, styles.closeBackward]} />
            </View>
          </Pressable>
        </View>
        {state.restore && (
          <View style={styles.notice}>
            {state.changed && <Text style={styles.noticeText}>{t('jVersionChanged')}</Text>}
            <View style={styles.noticeActions}>
              <Action
                title={t('jContinue')}
                icon="play"
                variant="primary"
                onPress={() => {
                  void resumeSaved()
                }}
              />
              <Action title={t('jDiscard')} onPress={() => engine.dismissRestore()} />
            </View>
          </View>
        )}
        {playbackError && (
          <View style={styles.notice}>
            <Text accessibilityRole="alert" style={styles.noticeText}>
              {t(playbackError)}
            </Text>
            {(state.status === 'error' || playbackError === 'loadError') && (
              <Action title={t('jRetry')} onPress={() => engine.retry()} />
            )}
          </View>
        )}
        {busy && <Text style={styles.noticeText}>{t('jPreparing')}</Text>}
        {session && (
          <>
            {/* CHỨC NĂNG: Vẫn tua nguồn audio thật khi thả; không đổi cơ chế giữ tay kéo. */}
            <View>
              <Slider
                accessibilityLabel={t('jSeek')}
                minimumValue={0}
                maximumValue={session.duration}
                minimumTrackTintColor={colors.playerAccent}
                maximumTrackTintColor={colors.playerControl}
                thumbTintColor={colors.white}
                value={draft ?? session.position}
                disabled={disabled}
                onSlidingStart={() => setDraft(session.position)}
                onValueChange={setDraft}
                onSlidingComplete={(value) => {
                  void engine.seek(value).finally(() => setDraft(undefined))
                }}
              />
              <View style={styles.times}>
                <Text style={styles.time}>{clock(draft ?? session.position)}</Text>
                <Text style={styles.time}>{clock(session.duration)}</Text>
              </View>
            </View>
            {expanded && (
              <>
                <View style={styles.controls}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={t('jBack')}
                    disabled={disabled}
                    onPress={() => {
                      void engine.seek(session.position - 10)
                    }}
                    style={({ pressed }) => [
                      styles.skip,
                      disabled && styles.disabled,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Ionicons name="play-back" size={20} color={colors.white} />
                    <Text style={styles.skipText}>10</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={primaryLabel}
                    disabled={busy}
                    onPress={toggle}
                    style={({ pressed }) => [
                      styles.play,
                      busy && styles.disabled,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Ionicons
                      name={playing ? 'pause' : ended ? 'refresh' : 'play'}
                      size={27}
                      color={colors.playerBackground}
                    />
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={t('jForward')}
                    disabled={disabled}
                    onPress={() => {
                      void engine.seek(session.position + 10)
                    }}
                    style={({ pressed }) => [
                      styles.skip,
                      disabled && styles.disabled,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Ionicons name="play-forward" size={20} color={colors.white} />
                    <Text style={styles.skipText}>10</Text>
                  </Pressable>
                </View>
                <View style={styles.rateRow}>
                  <Text style={styles.rateLabel}>{t('jSpeed')}</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.rates}
                  >
                    {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
                      <Pressable
                        key={rate}
                        accessibilityRole="button"
                        accessibilityLabel={t('jSpeed') + ' ' + rate + '×'}
                        accessibilityState={{ selected: rate === session.rate, disabled }}
                        disabled={disabled}
                        onPress={() => engine.rate(rate)}
                        style={[styles.rate, rate === session.rate && styles.selectedRate]}
                      >
                        <Text
                          style={[
                            styles.rateText,
                            rate === session.rate && styles.selectedRateText,
                          ]}
                        >
                          {rate}×
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              </>
            )}
          </>
        )}
      </View>
    </View>
  )
}
// TẠI SAO (JourneyPlayer): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao
// diện tại một nơi.
// CHỨC NĂNG: Dùng token chung; bố cục mềm để chữ đa ngôn ngữ không đè nút đóng.

const styles = StyleSheet.create({
  shell: {
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  player: {
    padding: spacing.md,
    borderRadius: 22,
    backgroundColor: colors.playerBackground,
    gap: spacing.md,
  },

  miniPlay: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.playerAccent,
  },
  expand: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.playerControl,
  },
  header: { flexDirection: 'row', gap: 10, alignItems: 'center' },

  artwork: { width: 44, height: 50, borderRadius: 12, overflow: 'hidden', flexShrink: 0 },

  metadata: { flex: 1, minWidth: 0, gap: 3 },

  topline: { flexDirection: 'row', alignItems: 'center', gap: 5 },

  eyebrow: { color: colors.playerMuted, fontSize: 12, lineHeight: 14 },

  title: { fontSize: 17, lineHeight: 22, color: colors.white, fontWeight: '700' },

  subtitle: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },

  language: {
    color: colors.playerMuted,
    backgroundColor: colors.playerControl,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    fontSize: 12,
  },

  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.playerMuted },

  status: { fontSize: 12, lineHeight: 15, color: colors.playerMuted },

  close: {
    width: 44,
    height: 44,
    borderRadius: 22,
    // Căn nút đóng giữa hàng điều khiển khi tên/ngôn ngữ xuống nhiều dòng.
    alignSelf: 'center',
    flexShrink: 0,
    backgroundColor: colors.playerControl,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // XỬ LÝ: Khung 22px có tâm tại (11, 11); cả hai nét quay quanh cùng một tâm.
  closeIcon: { width: 22, height: 22 },
  closeStroke: {
    position: 'absolute',
    left: 1,
    top: 10,
    width: 20,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.white,
  },
  closeForward: { transform: [{ rotate: '45deg' }] },
  closeBackward: { transform: [{ rotate: '-45deg' }] },

  times: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -4 },

  time: { fontSize: 12, color: colors.playerMuted, fontVariant: ['tabular-nums'] },

  controls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 24 },

  skip: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: colors.playerControl,
  },

  skipText: { fontSize: 9, lineHeight: 10, color: colors.white, fontWeight: '600' },

  play: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },

  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.playerControl,
  },

  rateLabel: { color: colors.playerMuted, fontSize: 12, maxWidth: 70 },

  rates: { flexDirection: 'row', gap: 6, flexGrow: 1, justifyContent: 'center' },

  rate: {
    minWidth: 44,
    minHeight: 44,
    paddingHorizontal: 8,
    borderRadius: 9,
    backgroundColor: colors.playerControl,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rateText: { color: colors.playerMuted, fontSize: 12, fontWeight: '600' },

  selectedRate: { backgroundColor: colors.playerAccent },

  selectedRateText: { color: colors.playerBackground },

  disabled: { opacity: 0.4 },
  pressed: { opacity: 0.75 },

  notice: { gap: spacing.sm },

  noticeText: { color: colors.playerMuted, fontSize: 12, lineHeight: 19 },

  noticeActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
})
