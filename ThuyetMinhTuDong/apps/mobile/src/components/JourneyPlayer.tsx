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
  useEffect(() => { setDraft(undefined) }, [session?.audioId, session?.placeId, session?.language])
  if (!session && !state.restore && !state.error && state.status !== 'loading') return null
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
      {state.restore && <View style={styles.notice}>
        <Text style={styles.noticeTitle}>{t('jContinue')}</Text>
        {state.changed && <Text style={styles.noticeText}>{t('jVersionChanged')}</Text>}
        <View style={styles.noticeActions}>
          <Action title={t('jContinue')} icon="play" variant="primary" onPress={() => { void resumeSaved() }} />
          <Action title={t('jDiscard')} onPress={() => engine.dismissRestore()} />
        </View>
      </View>}
      {state.error && <View style={styles.notice}>
        <Text accessibilityRole="alert" style={styles.noticeText}>{t(state.error)}</Text>
        {(state.status === 'error' || state.error === 'loadError') && <Action title={t('jRetry')} onPress={() => engine.retry()} />}
      </View>}
      {busy && <Text style={styles.noticeText}>{t('jPreparing')}</Text>}
      {session && <View style={styles.player}>
        <View style={styles.header}>
          <Cover uri={place?.images[0]} style={styles.artwork} />
          <View style={styles.metadata}>
            <View style={styles.topline}>
              <Ionicons name="headset-outline" size={14} color={colors.playerMuted} />
              <Text style={styles.eyebrow}>{t('read')}</Text>
            </View>
            <Text numberOfLines={1} style={styles.title}>{session.title}</Text>
            <Text numberOfLines={1} style={styles.status}>{LANGUAGES.find(item => item.code === session.language)?.label} · {t(ended ? 'jEnded' : playing ? 'jPlaying' : 'jPaused')}</Text>
          </View>
        </View>
        {/* CHỨC NĂNG: Giữ tay kéo ổn định; chỉ tua nguồn thật khi thả tay. */}
        <Slider accessibilityLabel={t('jSeek')} minimumValue={0} maximumValue={session.duration}
          minimumTrackTintColor={colors.playerAccent} maximumTrackTintColor={colors.playerControl} thumbTintColor={colors.white}
          value={draft ?? session.position} disabled={disabled}
          onSlidingStart={() => setDraft(session.position)} onValueChange={setDraft}
          onSlidingComplete={value => { void engine.seek(value).finally(() => setDraft(undefined)) }} />
        <View style={styles.times}><Text style={styles.time}>{clock(draft ?? session.position)}</Text><Text style={styles.time}>{clock(session.duration)}</Text></View>
        <View style={styles.controls}>
          <Pressable accessibilityRole="button" accessibilityLabel={t('jBack')} disabled={disabled}
            onPress={() => { void engine.seek(session.position - 10) }} style={({ pressed }) => [styles.skip, disabled && styles.disabled, pressed && styles.pressed]}>
            <Ionicons name="play-back" size={22} color={colors.white} /><Text style={styles.skipText}>10</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={primaryLabel} disabled={busy} onPress={toggle}
            style={({ pressed }) => [styles.play, busy && styles.disabled, pressed && styles.pressed]}>
            <Ionicons name={playing ? 'pause' : ended ? 'refresh' : 'play'} size={27} color={colors.playerBackground} />
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={t('jForward')} disabled={disabled}
            onPress={() => { void engine.seek(session.position + 10) }} style={({ pressed }) => [styles.skip, disabled && styles.disabled, pressed && styles.pressed]}>
            <Ionicons name="play-forward" size={22} color={colors.white} /><Text style={styles.skipText}>10</Text>
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
      </View>}
    </View>
  )
}
const styles = StyleSheet.create({
  shell: { padding: spacing.sm, backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.sm },
  player: { padding: spacing.md, borderRadius: 20, backgroundColor: colors.playerBackground },
  header: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  artwork: { width: 56, height: 56, borderRadius: 13, overflow: 'hidden' },
  metadata: { flex: 1, gap: 3 },
  topline: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  eyebrow: { color: colors.playerMuted, fontSize: 11, lineHeight: 16 },
  title: { fontSize: 17, lineHeight: 25, color: colors.white, fontWeight: '700' },
  status: { fontSize: 11, lineHeight: 17, color: colors.playerMuted },
  times: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -6 },
  time: { fontSize: 11, color: colors.playerMuted, fontVariant: ['tabular-nums'] },
  controls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 24, marginVertical: spacing.sm },
  skip: { minHeight: 44, minWidth: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 24, backgroundColor: colors.playerControl },
  skipText: { fontSize: 10, lineHeight: 12, color: colors.white, fontWeight: '600' },
  play: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
  rateRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rateLabel: { color: colors.playerMuted, fontSize: 11, maxWidth: 70 },
  rates: { flexDirection: 'row', gap: 6 },
  rate: { minWidth: 40, minHeight: 32, paddingHorizontal: 9, borderRadius: 10, backgroundColor: colors.playerControl, alignItems: 'center', justifyContent: 'center' },
  rateText: { color: colors.playerMuted, fontSize: 11, fontWeight: '600' },
  selectedRate: { backgroundColor: colors.playerAccent },
  selectedRateText: { color: colors.playerBackground },
  disabled: { opacity: 0.4 }, pressed: { opacity: 0.75 },
  notice: { padding: spacing.sm, gap: spacing.sm },
  noticeTitle: { fontSize: 15, lineHeight: 22, color: colors.text, fontWeight: '700' },
  noticeText: { color: colors.muted, fontSize: 12, lineHeight: 19 },
  noticeActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
})
