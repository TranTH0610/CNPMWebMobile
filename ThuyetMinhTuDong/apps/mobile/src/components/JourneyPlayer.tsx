/**
 * FILE NÀY LÀM GÌ: Player native có ảnh, nút tròn, thanh tua và chọn tốc độ.
 * RootNavigator đặt ngoài Stack; phụ thuộc Slider, Ionicons và useJourney.
 * UC07–UC11: giữ audio thật, dọn bản nháp thanh tua khi đổi bài/ngôn ngữ.
 */
import { useEffect, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Slider from '@react-native-community/slider'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LANGUAGES } from '@travelguide/visitor-core'
import { useText } from '../i18n'
import { useJourney } from '../hooks/useJourney'
import { Action } from './Action'
import { Cover } from './Cover'
import { colors, spacing } from '../theme'

const clock = (value: number) => Math.floor(value / 60) + ':' + String(Math.floor(value % 60)).padStart(2, '0')
export function JourneyPlayer() {
  const { engine, state, resumeSaved } = useJourney()
  const t = useText()
  const insets = useSafeAreaInsets()
  const [draft, setDraft] = useState<number>()
  const session = state.session
  // CHỨC NĂNG: Lỗi GPS hiển thị ở màn bản đồ, không tự mở lại player đã đóng.
  const playbackError = state.error === 'gpsFailed' || state.error === 'gpsWeak' ? undefined : state.error
  useEffect(() => { setDraft(undefined) }, [session?.audioId, session?.placeId, session?.language])
  if (!session && !state.restore && !playbackError && state.status !== 'loading') return null
  const place = state.places.find(item => item.id === session?.placeId)
  const playing = state.status === 'playing', ended = state.status === 'ended'
  const busy = state.status === 'loading', disabled = busy || state.status === 'error'
  const primaryLabel = t(playing ? 'jPause' : ended ? 'jReplay' : 'jResume')
  const toggle = () => {
    if (!session) return
    if (playing) engine.pause()
    else if (ended || state.status === 'error') void engine.play(session.placeId, session.language)
    else void engine.resume()
  }
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
// CHỨC NĂNG: Dùng token chung; bố cục mềm để chữ đa ngôn ngữ không đè nút đóng.
const styles = StyleSheet.create({
  shell: { padding: spacing.sm, backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.border },
  player: { padding: spacing.md, borderRadius: 22, backgroundColor: colors.playerBackground, gap: spacing.md },
  header: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  artwork: { width: 56, height: 60, borderRadius: 12, overflow: 'hidden', flexShrink: 0 },
  metadata: { flex: 1, minWidth: 0, gap: 3 },
  topline: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  eyebrow: { color: colors.playerMuted, fontSize: 10, lineHeight: 14 },
  title: { fontSize: 17, lineHeight: 22, color: colors.white, fontWeight: '700' },
  subtitle: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  language: { color: colors.playerMuted, backgroundColor: colors.playerControl, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5, fontSize: 10 },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.playerMuted },
  status: { fontSize: 10, lineHeight: 15, color: colors.playerMuted },
  close: { width: 44, height: 44, borderRadius: 22, alignSelf: 'flex-start', backgroundColor: colors.playerControl, alignItems: 'center', justifyContent: 'center' },
  times: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -4 },
  time: { fontSize: 11, color: colors.playerMuted, fontVariant: ['tabular-nums'] },
  controls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 24 },
  skip: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22, backgroundColor: colors.playerControl },
  skipText: { fontSize: 9, lineHeight: 10, color: colors.white, fontWeight: '600' },
  play: { width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
  rateRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.playerControl },
  rateLabel: { color: colors.playerMuted, fontSize: 11, maxWidth: 70 },
  rates: { flexDirection: 'row', gap: 6, flexGrow: 1, justifyContent: 'center' },
  rate: { minWidth: 40, minHeight: 36, paddingHorizontal: 8, borderRadius: 9, backgroundColor: colors.playerControl, alignItems: 'center', justifyContent: 'center' },
  rateText: { color: colors.playerMuted, fontSize: 11, fontWeight: '600' },
  selectedRate: { backgroundColor: colors.playerAccent },
  selectedRateText: { color: colors.playerBackground },
  disabled: { opacity: 0.4 }, pressed: { opacity: 0.75 },
  notice: { gap: spacing.sm },
  noticeText: { color: colors.playerMuted, fontSize: 12, lineHeight: 19 },
  noticeActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
})
