# Code giao diện trình nghe và gỡ QR du khách

Hướng dẫn và bảng file: PLAYER_QR_NHAN_VIEN.md.

## 1. SỬA — apps/web/src/components/JourneyPlayer.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\components\JourneyPlayer.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Trình phát web có ảnh, thanh tua thật và điều khiển dễ bấm.
 * AppLayout dùng; phụ thuộc useJourney, i18n, Icon và PlaceImage.
 * UC07–UC11: chỉ đổi giao diện, tiếp tục dùng một nguồn audio của controller.
 */
import { Link } from 'react-router-dom'
import { LANGUAGES } from '@travelguide/visitor-core'
import { useText } from '../i18n'
import { useJourney } from '../hooks/useJourney'
import { Icon } from './Icon'
import { PlaceImage } from './PlaceImage'

const clock = (value: number) => Math.floor(value / 60) + ':' + String(Math.floor(value % 60)).padStart(2, '0')

export function JourneyPlayer() {
  const { engine, state, resumeSaved } = useJourney()
  const t = useText()
  const session = state.session
  // CHỨC NĂNG: Lỗi GPS hiển thị ở màn bản đồ, không tự mở lại player đã đóng.
  const playbackError = state.error === 'gpsFailed' || state.error === 'gpsWeak' ? undefined : state.error
  if (!session && !state.restore && !playbackError && state.status !== 'loading') return null
  const place = state.places.find(item => item.id === session?.placeId)
  const busy = state.status === 'loading'
  const disabled = busy || state.status === 'error'
  const playing = state.status === 'playing'
  const ended = state.status === 'ended'
  const primaryLabel = t(playing ? 'jPause' : ended ? 'jReplay' : 'jResume')

  // CHỨC NĂNG: Thao tác đều gọi audio thật, không tăng thời gian bằng timer UI.
  const toggle = () => {
    if (!session) return
    if (playing) engine.pause()
    else if (ended || state.status === 'error') void engine.play(session.placeId, session.language)
    else void engine.resume()
  }

  return (
    <aside className="audio-shell" aria-label={t('jTitle')}>
      <section className="audio-player">
        {/* CHỨC NĂNG: Ảnh, tên và nút đóng nằm cùng hàng, không còn vùng trống phía trên.
            XỬ LÝ: Tên dài được xuống dòng; nút đóng có vùng bấm riêng không che nội dung. */}
        <header className="audio-header">
          {session && <div className="audio-artwork"><PlaceImage uri={place?.images[0]} title={session.title} /></div>}
          <div className="audio-content">
            <span className="audio-eyebrow"><Icon name="headphones" />{t('read')}</span>
            {session ? <Link className="audio-title" to={'/places/' + session.placeId}>{session.title}</Link>
              : <strong className="audio-title">{t(busy ? 'jPreparing' : state.restore ? 'jContinue' : 'jTitle')}</strong>}
            {session && <div className="audio-subtitle">
              <span className="audio-language">{LANGUAGES.find(item => item.code === session.language)?.label}</span>
              <span className={'audio-status ' + (playing ? 'is-playing' : '')}><span />{t(ended ? 'jEnded' : playing ? 'jPlaying' : 'jPaused')}</span>
            </div>}
          </div>
          <button type="button" className="audio-close" aria-label={t('closePlayer')}
            title={t('closePlayer')} onClick={() => engine.close()}><span aria-hidden="true">×</span></button>
        </header>
        {state.restore && <div className="audio-notice">
          {state.changed && <p>{t('jVersionChanged')}</p>}
          <div className="resume-actions">
            <button type="button" onClick={() => { void resumeSaved() }}><Icon name="play" />{t('jContinue')}</button>
            <button type="button" className="secondary" onClick={() => engine.dismissRestore()}>{t('jDiscard')}</button>
          </div>
        </div>}
        {playbackError && <div className="audio-error" role="alert"><span>{t(playbackError)}</span>
          {(state.status === 'error' || playbackError === 'loadError') && <button type="button" className="secondary" onClick={() => engine.retry()}>{t('jRetry')}</button>}
        </div>}
        {busy && <p className="audio-loading" role="status"><span className="loading-dot" />{t('jPreparing')}</p>}
        {session && <>
          <div className="audio-timeline">
            <input type="range" min={0} max={session.duration} step={0.1} value={session.position}
              aria-label={t('jSeek')} disabled={disabled}
              style={{ background: `linear-gradient(to right, var(--playerAccent) ${session.position / session.duration * 100}%, var(--playerControl) 0%)` }}
              onChange={event => { void engine.seek(Number(event.target.value)) }} />
            <div className="audio-times"><span>{clock(session.position)}</span><span>{clock(session.duration)}</span></div>
          </div>
          {/* CHỨC NĂNG: Nhóm phát/tua luôn ở chính giữa; tốc độ là một hàng riêng cân đối. */}
          <div className="audio-transport">
            <button type="button" className="audio-skip" aria-label={t('jBack')} title={t('jBack')} disabled={disabled}
              onClick={() => { void engine.seek(session.position - 10) }}><Icon name="backward" /></button>
            <button type="button" className="audio-play" aria-label={primaryLabel} title={primaryLabel} disabled={busy} onClick={toggle}>
              <Icon name={playing ? 'pause' : ended ? 'replay' : 'play'} /></button>
            <button type="button" className="audio-skip" aria-label={t('jForward')} title={t('jForward')} disabled={disabled}
              onClick={() => { void engine.seek(session.position + 10) }}><Icon name="forward" /></button>
          </div>
          <div className="audio-rates" role="group" aria-label={t('jSpeed')}>
            <span>{t('jSpeed')}</span>
            {[0.75, 1, 1.25, 1.5, 2].map(rate => <button key={rate} type="button"
              aria-label={t('jSpeed') + ' ' + rate + '×'} aria-pressed={rate === session.rate}
              disabled={disabled} onClick={() => engine.rate(rate)}>{rate}×</button>)}
          </div>
        </>}
      </section>
    </aside>
  )
}
```

## 2. SỬA — apps/web/src/styles/player.css

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\styles\player.css

```css
/* FILE NÀY LÀM GÌ: Trình nghe web cùng cấu trúc và token màu với native.
 * JourneyPlayer dùng; giữ phần style của nút nghe/chi tiết/bản đồ ở cuối file.
 * CHỨC NĂNG: Header gọn, điều khiển giữa, tốc độ dạng nút và focus rõ cho bàn phím. */
.audio-shell { max-width: 800px; margin: 0 auto 24px; }
.audio-player { display: grid; gap: 16px; padding: 22px; color: var(--white); background: linear-gradient(125deg, var(--playerBackground), #173e70); border: 1px solid #ffffff12; border-radius: 24px; box-shadow: 0 12px 32px #10295018; }
.audio-header { display: flex; gap: 14px; align-items: center; min-width: 0; }
.audio-artwork { flex: 0 0 64px; width: 64px; height: 64px; overflow: hidden; border-radius: 14px; background: var(--playerControl); }
.audio-artwork .place-image { display: block; width: 100%; height: 100%; object-fit: cover; }
.audio-artwork .placeholder { font-size: 9px; padding: 5px; color: var(--playerMuted); }
.audio-content { min-width: 0; flex: 1; }
.audio-eyebrow { display: inline-flex; align-items: center; gap: 6px; color: var(--playerMuted); font-size: 11px; }
.audio-eyebrow svg { width: 14px; height: 14px; }
.audio-title { display: block; margin: 2px 0 5px; font-size: 20px; line-height: 1.3; font-weight: 700; color: var(--white); overflow-wrap: anywhere; }
.audio-title:hover { color: var(--playerAccent); }
.audio-subtitle { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.audio-language { background: #ffffff12; color: var(--playerMuted); padding: 2px 7px; border-radius: 6px; font-size: 10px; }
.audio-status { display: inline-flex; gap: 6px; align-items: center; color: var(--playerMuted); font-size: 11px; }
.audio-status > span { width: 5px; height: 5px; border-radius: 50%; background: var(--playerMuted); }
.audio-status.is-playing > span { background: var(--playerAccent); }
.audio-player .audio-close { position: static; flex: 0 0 44px; width: 44px; height: 44px; min-height: 44px; align-self: flex-start; border: 1px solid #ffffff22; border-radius: 50%; padding: 0; color: var(--white); background: #ffffff0d; font-size: 27px; line-height: 1; }
.audio-timeline input[type="range"] { display: block; appearance: none; width: 100%; height: 5px; margin: 9px 0 10px; padding: 0; border: 0; border-radius: 10px; cursor: pointer; }
.audio-timeline input::-webkit-slider-thumb { appearance: none; width: 14px; height: 14px; border: 2px solid var(--white); border-radius: 50%; background: var(--white); box-shadow: 0 0 0 4px #ffffff14; }
.audio-timeline input::-moz-range-thumb { width: 12px; height: 12px; border: 2px solid var(--white); border-radius: 50%; background: var(--white); }
.audio-times { display: flex; justify-content: space-between; color: var(--playerMuted); font-size: 11px; font-variant-numeric: tabular-nums; }
.audio-transport { display: flex; justify-content: center; align-items: center; gap: 24px; }
.audio-transport button { padding: 0; border: 0; border-radius: 50%; }
.audio-transport .audio-skip { width: 44px; height: 44px; min-height: 44px; color: var(--white); background: var(--playerControl); }
.audio-skip svg { width: 25px; height: 25px; }
.audio-transport .audio-play { width: 58px; height: 58px; min-height: 58px; color: var(--playerBackground); background: var(--white); box-shadow: 0 5px 16px #0002; }
.audio-play svg { width: 26px; height: 26px; }
.audio-rates { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 6px; border-top: 1px solid #ffffff12; padding-top: 12px; }
.audio-rates > span { color: var(--playerMuted); font-size: 11px; margin-right: 4px; }
.audio-rates button { min-width: 44px; min-height: 36px; padding: 5px 9px; border: 1px solid transparent; border-radius: 9px; color: var(--playerMuted); background: #ffffff0b; font-size: 12px; }
.audio-rates button[aria-pressed="true"] { color: var(--playerBackground); background: var(--playerAccent); }
.audio-notice { display: grid; gap: 10px; color: var(--playerMuted); font-size: 12px; }
.resume-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.resume-actions svg { width: 16px; height: 16px; }
.audio-error { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; border: 1px solid #f0bdb5; background: #fff1ef; color: #922d22; border-radius: 12px; padding: 12px; font-size: 12px; }
.audio-loading { display: flex; gap: 8px; align-items: center; color: var(--playerMuted); font-size: 12px; }
.loading-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--playerAccent); animation: audio-pulse 1s ease-in-out infinite alternate; }
.audio-player :focus-visible { outline-color: var(--playerAccent); }
@keyframes audio-pulse { to { opacity: .35; } }
@media (max-width: 480px) {
  .audio-player { gap: 13px; padding: 16px; border-radius: 20px; }
  .audio-header { gap: 10px; }
  .audio-artwork { flex-basis: 54px; width: 54px; height: 58px; border-radius: 11px; }
  .audio-title { font-size: 17px; }
  .audio-subtitle { gap: 6px; }
  .audio-rates { gap: 5px; }
  .audio-rates button { min-width: 40px; padding: 5px 7px; }
}
@media (prefers-reduced-motion: reduce) { .loading-dot { animation: none; } }

.listen-button { border-radius: 13px; padding: 12px 20px; min-height: 46px; box-shadow: 0 5px 14px #1667e822; font-weight: 600; }
.listen-button svg { width: 18px; height: 18px; }
.detail-actions { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin: 20px 0; }
.detail-actions .button svg { width: 18px; height: 18px; }
.photo-caption { font-size: 12px; color: var(--muted); font-style: italic; }
.leaflet-marker-icon button { min-height: 30px; box-shadow: none; }
```

## 3. SỬA — apps/mobile/src/components/JourneyPlayer.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\components\JourneyPlayer.tsx

```tsx
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
```

## 4. SỬA — apps/web/src/components/Navbar.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\components\Navbar.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Thanh điều hướng web, logo, chọn ngôn ngữ và liên kết QR chung.
 * Vị trí: apps/web/src/components/Navbar.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { Link, NavLink } from 'react-router-dom'
import { useText } from '../i18n/index'
import { LanguagePicker } from './index'

export function Navbar() { const t = useText(); return (<header className="navbar">
        <div className="nav-inner">
          <Link className="brand" to="/">
            <span className="brand-mark" aria-hidden="true">🏯</span>
            <span>
              <strong>{t('site')}</strong>
              <small>{t('tagline')}</small>
            </span>
          </Link>

          <nav aria-label={t('explore')}>
            <NavLink end to="/">{t('home')}</NavLink>
            <NavLink to="/places">{t('explore')}</NavLink>

            <NavLink to="/journey">{t('jMap')}</NavLink>

            <NavLink to="/about">{t('about')}</NavLink>
          </nav>

          <div className="nav-actions">
            <LanguagePicker />


          </div>
        </div>
      </header>) }
```

## 5. SỬA — apps/web/src/navigation/AppRoutes.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\navigation\AppRoutes.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Bảng route web; không chứa code UI của từng trang.
 * Vị trí: apps/web/src/navigation/AppRoutes.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

// CHỨC NĂNG: Bản du khách chỉ đăng ký các route công khai.
// XỬ LÝ: Không import hoặc tải cây màn hình Admin; /admin không tồn tại ở bản này.
import { Route, Routes } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import { HomePage } from '../pages/HomePage'
import { PlacesPage } from '../pages/PlacesPage'
import { DetailPage } from '../pages/DetailPage'
import { JourneyPage } from '../pages/JourneyPage'
import { AboutPage } from '../pages/AboutPage'
import { NotFoundPage } from '../pages/NotFoundPage'

// CHỨC NĂNG: Giữ nguyên mọi URL cũ, bao gồm QR chung và deep link chi tiết.
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/places" element={<PlacesPage />} />
        <Route path="/places/:id" element={<DetailPage />} />
        <Route path="/journey" element={<JourneyPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
```

## 6. SỬA — apps/web/vite.config.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\vite.config.ts

```typescript
﻿/**
 * FILE NÀY LÀM GÌ:
 * Cấu hình build web và giữ đúng runtime React18.
 * Vite đọc; phụ thuộc plugin React và module resolution của Node.
 * Tránh lấy nhầm React19 của mobile từ package dùng chung.
 */

import { createRequire } from 'node:module'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// CHỨC NĂNG: Tìm React theo package.json của web.
// XỬ LÝ: Không tìm theo vị trí file trong packages/visitor-core.
const webRequire = createRequire(
  new URL('./package.json', import.meta.url),
)

// CHỨC NĂNG: Tách entry và thư mục build ngay từ cấu hình Vite, không dựa vào URL để cấp quyền.
// XỬ LÝ: Bản visitor không chứa cây route admin. HTTP /admin bị từ chối ở dev/preview visitor.
// Hosting production cũng phải chặn /admin và bảo vệ tên miền admin bằng xác thực riêng.
function audiencePlugin(admin: boolean): Plugin {
  const blockAdmin: import('vite').Connect.NextHandleFunction = (req, res, next) => {
    const path = (req.url ?? '/').split('?')[0]
    if (/^\/qr(?:\/|$)/.test(path) || (!admin && /^\/admin(?:\/|$)/.test(path))) {
      res.statusCode = 404
      res.end('Not found')
      return
    }
    next()
  }
  return {
    name: 'separate-admin-entry',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return admin ? html.replace('/src/main.tsx', '/src/main-admin.tsx') : html
      },
    },
    configureServer(server) { server.middlewares.use(blockAdmin) },
    configurePreviewServer(server) { server.middlewares.use(blockAdmin) },
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), audiencePlugin(mode === 'admin')],
  // CHỨC NĂNG: Hai bản build riêng; admin dev chỉ nghe localhost theo mặc định.
  // XỬ LÝ: Không đưa cổng quản lý vào link QR/tunnel dành cho du khách.
  server: {
    host: mode === 'admin' ? '127.0.0.1' : '0.0.0.0',
    // CHỨC NĂNG: Hai site gọi chung server RAM, QR/tunnel visitor vẫn dùng cùng origin.
    // XỬ LÝ: Chỉ bản admin proxy API đọc thống kê; visitor chỉ gửi heartbeat/end.
    proxy: {
      [mode === 'admin' ? '/api/catalog' : '^/api/catalog/(published|version|gate/entry)$']: {
        target: process.env.CATALOG_TARGET || 'http://127.0.0.1:8788',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/catalog/, ''),
        configure(proxy) { proxy.on('proxyReq', request => request.removeHeader('origin')) },
      },
      [mode === 'admin' ? '/api/presence' : '^/api/presence/sessions/(heartbeat|end)$']: {
        target: process.env.PRESENCE_TARGET || 'http://127.0.0.1:8787',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/presence/, ''),
        configure(proxy) { proxy.on('proxyReq', request => request.removeHeader('origin')) },
      },
    },
  },
  build: { outDir: mode === 'admin' ? 'dist-admin' : 'dist' },

  // CHỨC NĂNG: Sao chép file xác minh App Links vào bản web triển khai.
  // XỬ LÝ: Dùng static riêng; tránh public/index.html cũ đè entry của Vite.
  publicDir: 'static',

  resolve: {
    alias: [
      {
        find: /^react$/,
        replacement: webRequire.resolve('react'),
      },
      {
        find: /^react\/jsx-runtime$/,
        replacement: webRequire.resolve('react/jsx-runtime'),
      },
      {
        find: /^react\/jsx-dev-runtime$/,
        replacement: webRequire.resolve('react/jsx-dev-runtime'),
      },
      {
        find: /^react-dom$/,
        replacement: webRequire.resolve('react-dom'),
      },
      {
        find: /^react-dom\/client$/,
        replacement: webRequire.resolve('react-dom/client'),
      },
    ],
  },
}))
```

## 7. SỬA — apps/web/vercel.json

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\vercel.json

```json
{
  "headers": [
    {
      "source": "/.well-known/apple-app-site-association",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/json"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/places",
      "destination": "/index.html"
    },
    {
      "source": "/places/:id",
      "destination": "/index.html"
    },
    {
      "source": "/about",
      "destination": "/index.html"
    }
  ]
}
```

## 8. SỬA — apps/mobile/src/screens/HomeScreen.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\screens\HomeScreen.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Hiển thị Khám phá, carousel và danh sách có tìm kiếm/lọc/kéo làm mới.
 * Vị trí: apps/mobile/src/screens/HomeScreen.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { Alert, FlatList, Linking, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Ionicons } from '@expo/vector-icons'
import { categoryOf, HERO_IMAGE, PHOTO_CREDITS } from '@travelguide/visitor-core'
import type { Category, PlaceRecord, SortOrder } from '@travelguide/visitor-core'
import { useExplore, usePublishedCatalog, useVisitorPosition } from '../hooks/usePlaces'
import { useText } from '../i18n/index'
import { Action, DemoNotice, State, colors, spacing, CategoryChips, Cover, PlaceCard, SearchBar, SortDropdown, explore } from '../components/index'
import { getPosition } from '../services/platform'
import type { VisitorStack } from '../navigation/types'

// CHỨC NĂNG: Ghép dữ liệu và điều kiện vào danh sách.
// XỬ LÝ: Dùng một FlatList dọc; carousel cuộn ngang bên trong header.
export default function HomeScreen({
  search = false,
  initial,
}: {
  search?: boolean
  initial?: {
    query?: string
    category?: Category
  }
}) {
  const navigation =
    useNavigation<NativeStackNavigationProp<VisitorStack>>()

  const data = usePublishedCatalog()
  const position = useVisitorPosition(getPosition)
  const filters = useExplore(data.places, position.origin, initial)
  const t = useText()

  const { width } = useWindowDimensions()

  const cardWidth = Math.max(
    240,
    width - spacing.lg * 2 - spacing.sm,
  )

  const [slide, setSlide] = useState(0)
  const [searchRequired, setSearchRequired] = useState(false)
  const [draftQuery, setDraftQuery] = useState(initial?.query ?? '')
  const query = search ? filters.query : draftQuery
  const list = useRef<FlatList>(null)
  const featuredList = useRef<FlatList<PlaceRecord>>(null)

  const featured = useMemo(() => data.places.filter(
    (place) => place.featured && (!filters.categories.length || filters.categories.includes(categoryOf(place))),
  ), [data.places, filters.categories])

  // CHỨC NĂNG: Đổi danh mục hoặc xoay màn hình thì về thẻ đầu, tránh chấm nằm ngoài danh sách mới.
  // XỬ LÝ: Ref chỉ cuộn khi carousel có dữ liệu và đang được gắn vào màn.
  useEffect(() => {
    setSlide(0)
    if (featured.length) featuredList.current?.scrollToOffset({ offset: 0, animated: false })
  }, [featured, cardWidth])

  // CHỨC NĂNG: Đổi thứ tự và xin vị trí khi người dùng yêu cầu.
  // XỬ LÝ: Chọn theo tên không xin quyền GPS.
  const onSort = (order: SortOrder) => {
    filters.setOrder(order)

    if (order === 'nearest' && !position.origin) {
      void position.request()
    }
  }

  // CHỨC NĂNG: Đồng nhất web: gửi rỗng báo lỗi, gửi có chữ mở kết quả cùng danh mục.
  // XỬ LÝ: Không chuyển màn ngay lúc chạm ô nhập; trim loại từ khóa chỉ có khoảng trắng.
  const openSearch = () => {
    if (!query.trim()) { setSearchRequired(true); return }
    setSearchRequired(false)
    if (!search) navigation.navigate('Search', { query: query.trim(), category: filters.categories[0] })
  }
  const changeQuery = (value: string) => {
    if (search) filters.setQuery(value)
    else setDraftQuery(value)
    if (value.trim()) setSearchRequired(false)
  }
  const changeCategories = (value: Category[]) => {
    filters.setCategories(value)
    setSlide(0)
  }


  return (
    <SafeAreaView
      style={explore.page}
      edges={['top', 'left', 'right']}
    >
      <FlatList
        ref={list}
        data={data.error ? [] : filters.results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom: spacing.xl,
        }}
        keyboardShouldPersistTaps="handled"
        refreshing={data.loading && data.places.length > 0}
        onRefresh={() => {
          void data.reload()
        }}

        // CHỨC NĂNG: Dựng từng card khi cần.
        // XỬ LÝ: key theo ID ổn định, không dùng index.
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: spacing.lg }}>
            <PlaceCard
              place={item}
              origin={position.origin}
              onOpen={() => navigation.navigate('Detail', {
                placeId: item.id,
              })}
            />
          </View>
        )}

        ListHeaderComponent={
          <View>
            {!search ? (
              <View
                style={{
                  minHeight: 285,
                  justifyContent: 'flex-end',
                }}
              >
                <Cover
                  uri={HERO_IMAGE}
                  style={StyleSheet.absoluteFill}
                />

                <View
                  style={{
                    padding: spacing.lg,
                    gap: spacing.sm,
                    backgroundColor: colors.overlay,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      marginBottom: spacing.xl,
                    }}
                  >


                    <View accessibilityLabel={t('notification')}>
                      <Ionicons
                        name="notifications-outline"
                        size={24}
                        color={colors.white}
                      />
                    </View>
                  </View>

                  <Text style={{ color: colors.white, fontSize: 17 }}>
                    {t('explore')}
                  </Text>

                  <Text
                    style={{
                      color: colors.white,
                      fontSize: 30,
                      fontWeight: '700',
                    }}
                  >
                    {t('site')}
                  </Text>

                  <Text
                    style={{
                      color: colors.white,
                      lineHeight: 20,
                      fontSize: 13,
                    }}
                  >
                    {t('heroSubtitle')}
                  </Text>

                  <SearchBar
                    value={query}
                    onChange={changeQuery}
                    onSubmit={openSearch}
                  />
                  <Action title={t('searchButton')} icon="search-outline" variant="primary" onPress={openSearch} />
                  {searchRequired && <Text accessibilityRole="alert" style={{ color: colors.text, backgroundColor: colors.background, padding: spacing.sm, borderRadius: 8 }}>{t('searchRequired')}</Text>}
                </View>
              </View>
            ) : (
              <View style={explore.body}>
                <SearchBar
                  value={query}
                  onChange={changeQuery}
                  onSubmit={openSearch}
                  autoFocus
                  onBack={() => navigation.goBack()}
                  onFilter={() => Alert.alert(
                    t('sort'),
                    undefined,
                    [
                      {
                        text: t('nearest'),
                        onPress: () => onSort('nearest'),
                      },
                      {
                        text: t('name'),
                        onPress: () => onSort('name'),
                      },
                      {
                        text: t('close'),
                        style: 'cancel',
                      },
                    ],
                  )}
                />
              </View>
            )}

            <View style={explore.body}>
              {search && searchRequired && <Text accessibilityRole="alert" style={explore.muted}>{t('searchRequired')}</Text>}
              <CategoryChips
                categories={filters.availableCategories}
                selected={filters.categories}
                onSelect={changeCategories}
              />

              {/* CHỨC NĂNG: Mobile có cùng lọc khu vực và xóa lọc như sidebar web.
                  XỬ LÝ: Bấm đổi điều kiện ngay; không đợi nút tìm kiếm. */}
              <View style={{ gap: spacing.sm, marginBottom: spacing.md }}>
                <Text style={explore.cardTitle}>{t('region')}</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
                  {filters.availableZones.map(zone => (
                    <Action key={zone}
                      title={t(zone === 'fortifications' ? 'zone_fortifications' : 'zone_ceremonial')}
                      selected={filters.zones.includes(zone)}
                      onPress={() => filters.setZones(filters.zones.includes(zone)
                        ? filters.zones.filter(item => item !== zone) : [...filters.zones, zone])} />
                  ))}
                  <Action title={t('clearAll')} variant="ghost" onPress={() => {
                    filters.reset(); setDraftQuery(''); setSearchRequired(false); setSlide(0)
                  }} />
                </View>
              </View>

              {!search && (
                <>
                  <View
                    style={[
                      explore.row,
                      { marginBottom: spacing.md },
                    ]}
                  >
                    <Text style={explore.title}>
                      {t('featured')}
                    </Text>

                    <Pressable
                      accessibilityRole="button"
                      onPress={() => navigation.navigate('Search', {})}
                    >
                      <Text style={{ color: colors.primary }}>
                        {t('viewAll')} ›
                      </Text>
                    </Pressable>
                  </View>

                  {data.loading && !data.places.length ? <State message="loading" busy />
                    : data.error ? <State message="loadError" retry={() => { void data.reload() }} />
                    : !featured.length ? (
                      // CHỨC NĂNG: Cùng empty state với web khi không có điểm nổi bật phù hợp.
                      <View style={{ padding: spacing.md, gap: spacing.sm, backgroundColor: colors.page, borderRadius: 12 }} accessibilityRole="summary">
                        <Text style={explore.cardTitle}>{t('featuredEmpty')}</Text>
                        <Text style={explore.muted}>{t('featuredEmptyHint')}</Text>
                        {!!filters.categories.length && <Action title={t('clearAll')} onPress={() => changeCategories([])} />}
                      </View>
                    ) : <>
                  {/* CHỨC NĂNG: Carousel ngang có snap.
                      XỬ LÝ: Chiều rộng card theo màn hình;
                      tính chấm hiện tại từ độ cuộn khi dừng. */}
                  <FlatList
                    ref={featuredList}
                    horizontal
                    data={featured}
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={cardWidth + spacing.sm}
                    decelerationRate="fast"
                    contentContainerStyle={{
                      gap: spacing.sm,
                    }}
                    onMomentumScrollEnd={(event) => setSlide(
                      Math.round(
                        event.nativeEvent.contentOffset.x
                        / (cardWidth + spacing.sm),
                      ),
                    )}
                    renderItem={({ item }) => (
                      <PlaceCard
                        place={item}
                        featured
                        width={cardWidth}
                        onOpen={() => navigation.navigate('Detail', {
                          placeId: item.id,
                        })}
                      />
                    )}
                  />

                  {featured.length > 1 && <View
                    style={[
                      explore.row,
                      {
                        justifyContent: 'center',
                        padding: spacing.md,
                      },
                    ]}
                  >
                    {featured.map((place, index) => (
                      <View
                        key={place.id}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor:
                            index === slide
                              ? colors.primary
                              : colors.border,
                        }}
                      />
                    ))}
                  </View>}
                    </>}

                </>
              )}

              <View style={explore.row}>
                <Text style={[explore.title, { minWidth: 0 }]}>
                  {t(search ? 'results' : 'allPlaces')}
                  {' '}({filters.results.length})
                </Text>

                <SortDropdown
                  effectiveOrder={filters.effectiveOrder}
                  onSelect={onSort}
                />
              </View>

              {filters.order === 'nearest'
                && filters.effectiveOrder === 'name' && (
                <Text style={explore.muted}>
                  {t('orderFallback')}
                </Text>
              )}

              {position.failed && (
                <Text style={explore.muted}>
                  {t('locationDenied')}
                </Text>
              )}
            </View>
          </View>
        }

        // CHỨC NĂNG: Phân biệt tải, lỗi và không có kết quả.
        // XỬ LÝ: Mỗi trường hợp có thông báo và đường khôi phục phù hợp.
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
            <View style={explore.body}>
              <State message="empty" />
              <Text style={explore.muted}>
                {t('emptyHint')}
              </Text>
              <Action
                title={t('clearAll')}
                onPress={filters.reset}
              />
            </View>
          )
        }

        ListFooterComponent={
          <View style={explore.body}>
            <DemoNotice />
            <Text style={explore.muted}>
              {t('photoCredits')}
            </Text>

            {PHOTO_CREDITS.map((credit) => (
              <Pressable
                key={credit.url}
                accessibilityRole="link"
                onPress={() => {
                  void Linking.openURL(credit.url)
                }}
              >
                <Text style={explore.muted}>
                  {credit.title} · {credit.license}
                </Text>
              </Pressable>
            ))}
          </View>
        }
      />
    </SafeAreaView>
  )
}
```

## 9. SỬA — apps/mobile/src/screens/SettingsScreen.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\screens\SettingsScreen.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Hiển thị chọn ngôn ngữ; không cung cấp QR hoặc chia sẻ liên kết cho du khách.
 * Vị trí: apps/mobile/src/screens/SettingsScreen.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, Text } from 'react-native'
import { useText } from '../i18n/index'
import { LanguageBar, ui } from '../components/index'

// CHỨC NĂNG: Cho đổi ngôn ngữ.
// XỬ LÝ: Cùng provider với tiêu đề, danh sách và bài đọc.
export default function SettingsScreen() {
  const t = useText()

  return (
    <SafeAreaView style={ui.page}>
      <ScrollView contentContainerStyle={ui.content}>
        <Text style={ui.title}>{t('settings')}</Text>
        <LanguageBar />
        <Text style={ui.muted}>{t('noAccount')}</Text>
      </ScrollView>
    </SafeAreaView>
  )
}
```

## 10. SỬA — apps/mobile/src/navigation/RootNavigator.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\navigation\RootNavigator.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Stack điều hướng mobile, giữ một NavigationContainer và một trình phát toàn app.
 * Vị trí: apps/mobile/src/navigation/RootNavigator.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { usePresenceHeartbeat } from '../hooks/usePresenceHeartbeat'
import { useJourneyNavigation } from '../hooks/useJourneyNavigation'
import SearchResultScreen from '../screens/SearchResultScreen'
import { JourneyPlayer } from '../components/JourneyPlayer'
import { JourneyScreen } from '../screens/JourneyScreen'
import MainTabs from './MainTabs'
import DetailScreen from '../screens/DetailScreen'
import { linking } from './linking'
import type { VisitorStack } from './types'
import { View } from 'react-native'
import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useText } from '../i18n/index'

// CHỨC NĂNG: Tạo bộ điều hướng có kiểm tra kiểu tham số.
// XỬ LÝ: TypeScript kiểm tra tên màn hình và dữ liệu truyền giữa các màn.
const Stack =
  createNativeStackNavigator<VisitorStack>()
// CHỨC NĂNG: Hiển thị màn danh sách ở chế độ tìm kiếm.
// XỬ LÝ: Khi tham số route thay đổi, key thay đổi để khởi tạo
// màn tìm kiếm với đúng từ khóa và danh mục mới.
const navigationRef = createNavigationContainerRef<VisitorStack>()
const openSuggested = (id: string) => { if (navigationRef.isReady()) navigationRef.navigate('Detail', { placeId: id }) }
// CHỨC NĂNG: Đăng ký các màn hình của ứng dụng.
// XỬ LÝ:
// - Chỉ có một NavigationContainer.
// - linking xử lý liên kết mở app từ QR.
// - Tiêu đề lấy qua i18n để cập nhật khi đổi ngôn ngữ.
export default function RootNavigator() {
  const t = useText()
  usePresenceHeartbeat(true)
  useJourneyNavigation({ open: openSuggested })

  return (
    <NavigationContainer linking={linking} ref={navigationRef}>
      <View style={{ flex: 1 }}>
      <Stack.Navigator
        screenOptions={{
          headerBackTitle: t('explore'),
        }}
      >
        <Stack.Screen
          name="Places"
          component={MainTabs}
          options={{
            title: t('explore'),
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Search"
          component={SearchResultScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{
            title: t('details'),
          }}
        />


        <Stack.Screen name="Journey" component={JourneyScreen} options={{ title: t('jMap') }} />
      </Stack.Navigator>
      <JourneyPlayer />
      </View>
    </NavigationContainer>
  )
}
```

## 11. SỬA — apps/mobile/src/navigation/types.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\navigation\types.ts

```typescript
/**
 * FILE NÀY LÀM GÌ: Tách riêng một phần giao diện để dễ tìm và bảo trì.
 * Vị trí: apps/mobile/src/navigation/types.ts. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import type { Category } from '@travelguide/visitor-core'

// CHỨC NĂNG: Kiểm tra tham số điều hướng.
// XỬ LÝ: Detail bắt buộc placeId; Search nhận điều kiện ban đầu.
export type VisitorStack = {
  Places: undefined
  Search: {
    query?: string
    category?: Category
  }
  Detail: {
    placeId: string
  }
  Journey: { placeId?: string } | undefined
}
```

## File đã xóa

- apps/web/src/pages/QrPage.tsx
- apps/web/src/components/QrImage.tsx
- apps/web/src/components/qr.css
- apps/mobile/src/components/WebAccessCard.tsx
- apps/mobile/src/screens/ScanScreen.tsx
