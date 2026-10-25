# Code sửa ảnh và đóng trình nghe

Đọc SUA_ANH_VA_DONG_TRINH_NGHE.md để biết cách chạy và cách kiểm tra.

## 1. SỬA — apps/mobile/src/components/Cover.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\components\Cover.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Ảnh bìa mobile có placeholder khi ảnh thiếu hoặc tải lỗi.
 * Vị trí: apps/mobile/src/components/Cover.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { explore } from '../styles/explore'
import { colors } from '../theme'
import { useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { resolvePlaceImage } from '../services/placeImages'
import { useText } from '../i18n/index'

// CHỨC NĂNG: Hiển thị ảnh co theo khung hoặc placeholder.
// XỬ LÝ: Lỗi gắn với URI để callback ảnh cũ không làm hỏng ảnh mới; thiếu asset cũng hiện placeholder.
export function Cover({
  uri,
  style,
}: {
  uri?: string
  style?: StyleProp<ViewStyle>
}) {
  const [failedUri, setFailedUri] = useState<string>()
  const source = resolvePlaceImage(uri)
  const failed = failedUri === uri
  const t = useText()


  return (
    <View
      style={[
        {
          backgroundColor: colors.soft,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {source && !failed ? (
        <Image
          key={uri}
          source={source}
          onError={() => setFailedUri(uri)}
          // CHỨC NĂNG: Ghi đè kích thước gốc mà RN tự thêm cho ảnh đóng gói.
          // XỬ LÝ: absoluteFill chỉ đặt vị trí; width/height 100% buộc ảnh co đúng khung
          // của thumbnail, ảnh hero và ảnh player. Nếu thiếu, chỉ thấy góc trời/tường của JPG.
          style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}
        >
          <Ionicons
            name="image-outline"
            size={28}
            color={colors.muted}
          />
          <Text style={explore.muted}>
            {t('noImage')}
          </Text>
        </View>
      )}
    </View>
  )
}
```

## 2. SỬA — apps/mobile/src/components/PlaceCard.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\components\PlaceCard.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Thẻ địa điểm, ảnh dự phòng, danh mục, khoảng cách nếu có đồng nhất nội dung mobile/web.
 * Vị trí: apps/mobile/src/components/PlaceCard.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { explore } from '../styles/explore'
import { colors, spacing } from '../theme'
import { Cover } from './Cover'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { categoryOf, distanceTo, publishedText } from '@travelguide/visitor-core'
import type { PlaceRecord, Point } from '@travelguide/visitor-core'
import { useText } from '../i18n/index'
import { useVisitor } from '../hooks/useVisitor'

// CHỨC NĂNG: Card lớn hoặc card ngang.
// XỬ LÝ: Thẻ chỉ mở chi tiết, ảnh lỗi dùng placeholder; không có nút yêu thích.
export function PlaceCard({
  place,
  onOpen,
  featured = false,
  width,
  origin,
}: {
  place: PlaceRecord
  onOpen: () => void
  featured?: boolean
  width?: number
  origin?: Point
}) {
  const { language } = useVisitor()

  const t = useText()
  const content = publishedText(place, language)
  const title = content?.title ?? place.canonicalTitle
  const meters = distanceTo(place, origin)

  if (featured) {
    return (
      <View style={[explore.featured, { width }]}>
        <Cover
          uri={place.images[0]}
          style={StyleSheet.absoluteFill}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={title}
          onPress={onOpen}
          style={explore.featuredText}
        >
          <Text style={explore.badge}>
            {t(`category_${categoryOf(place)}`)}
          </Text>

          <Text
            style={[
              explore.cardTitle,
              { color: colors.white, fontSize: 22 },
            ]}
          >
            {title}
          </Text>

          <Text style={{ color: colors.white, fontSize: 12 }}>
            {content ? content.address || t('city') : t('missing')}
          </Text>
        </Pressable>

      </View>
    )
  }

  return (
    <View style={explore.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        onPress={onOpen}
        style={{ width: explore.image.width, height: explore.image.height, flexShrink: 0 }}
      >
        <Cover uri={place.images[0]} style={explore.image} />
      </Pressable>

      <Pressable
        accessibilityRole="button"
        onPress={onOpen}
        style={{ flex: 1, gap: spacing.sm }}
      >
        <Text numberOfLines={2} style={explore.cardTitle}>{title}</Text>

        <Text style={explore.badge}>
          {t(`category_${categoryOf(place)}`)}
        </Text>

        <Text numberOfLines={2} ellipsizeMode="tail" style={explore.muted}>
          {content ? content.address || t('city') : t('missing')}
        </Text>

        {meters !== undefined && (
          <Text style={explore.muted}>
            {(meters / 1000).toFixed(2)} km
          </Text>
        )}
      </Pressable>

    </View>
  )
}
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

## 4. SỬA — apps/web/src/components/JourneyPlayer.tsx

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

## 5. SỬA — apps/web/src/styles/player.css

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

## 6. SỬA — packages/visitor-core/src/journey.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\visitor-core\src\journey.ts

```typescript
/**
 * FILE NÀY LÀM GÌ: Điều phối GPS, một nguồn audio và lưu tiến độ UC06–UC11.
 * JourneyProvider gọi; phụ thuộc model/catalog/search, không phụ thuộc React/thiết bị.
 * Adapter audio và bộ nhớ được truyền vào để test không cần GPS hoặc loa thật.
 */
import { LANGUAGES, type Language, type PlaceRecord, type Point } from './model'
import { publishedText, type Catalog } from './catalog'
import { distanceMeters, validPoint } from './search'

export type Fix = Point & { accuracy: number; timestamp: number }
export type MapPoint = Point & { source: string; fieldVerified: boolean }
export type VisitRoute = { id: string; title: Record<Language, string>; stops: string[]; verified: boolean; available: boolean }
export type MediaStatus = { position: number; duration: number; playing: boolean; ended: boolean; error?: boolean }
export type Track = {
  duration: number
  play(): Promise<void>
  pause(): void
  seek(seconds: number): Promise<void>
  rate(value: number): void
  listen(callback: (status: MediaStatus) => void): () => void
  dispose(): void
}
export type Saved = {
  placeId: string; language: Language; textVersion: number; audioId: string
  audioVersion: number; position: number; duration: number; rate: number
}
export type Session = Saved & { title: string }
export type JourneyPorts = {
  catalog: Catalog
  open(url: string, title: string): Promise<Track>
  watch(next: (fix: Fix) => void, fail: () => void): Promise<() => void>
  read(): Promise<string | null>
  write(value: string | null): Promise<void>
  positions: Readonly<Record<string, MapPoint>>
  routes: readonly VisitRoute[]
}
export type JourneyError = 'audioMissing' | 'audioFailed' | 'gpsFailed' | 'gpsWeak' | 'saveFailed' | 'savedInvalid' | 'loadError'
export type JourneyState = {
  places: readonly PlaceRecord[]; ready: boolean; status: 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error'
  session?: Session; restore?: Saved; changed: boolean; error?: JourneyError
  gps: boolean; fix?: Fix; suggestedId?: string; routeId?: string
}

// CHỨC NĂNG: Giới hạn thời điểm tua theo thời lượng thật.
// XỬ LÝ: Không dùng số giả để mô phỏng thanh thời gian.
export const clampTime = (value: number, duration: number) =>
  Number.isFinite(value) && Number.isFinite(duration) ? Math.max(0, Math.min(value, duration)) : 0

// CHỨC NĂNG: Kiểm tra dữ liệu localStorage/AsyncStorage không đáng tin cậy.
// XỬ LÝ: JSON lỗi, ngôn ngữ lạ, thời gian âm hoặc phiên bản sai đều bị loại.
export function parseSaved(raw: string | null): Saved | undefined {
  if (!raw) return undefined
  try {
    const x: unknown = JSON.parse(raw)
    if (!x || typeof x !== 'object') return undefined
    const s = x as Record<string, unknown>
    if (typeof s.placeId !== 'string' || !s.placeId || typeof s.audioId !== 'string'
      || !LANGUAGES.some(l => l.code === s.language)
      || !['textVersion', 'audioVersion', 'position', 'duration', 'rate'].every(k => typeof s[k] === 'number' && Number.isFinite(s[k]))) return undefined
    if (Number(s.position) < 0 || Number(s.duration) <= 0 || Number(s.textVersion) < 1
      || Number(s.audioVersion) < 1 || ![0.75, 1, 1.25, 1.5, 2].includes(Number(s.rate))) return undefined
    return { placeId: s.placeId, language: s.language as Language, audioId: s.audioId,
      textVersion: Number(s.textVersion), audioVersion: Number(s.audioVersion),
      position: clampTime(Number(s.position), Number(s.duration)), duration: Number(s.duration), rate: Number(s.rate) }
  } catch { return undefined }
}

// CHỨC NĂNG: Chỉ chọn điểm gần nhất trong 100 m, giữ ổn định khi bằng nhau.
// XỬ LÝ: Tọa độ lấy từ nguồn bản đồ được ghi rõ, không coi là đã khảo sát GPS.
export function nearest(places: readonly PlaceRecord[], points: JourneyPorts['positions'], fix: Fix, previous?: string, now = Date.now()) {
  if (!validPoint(fix) || !Number.isFinite(fix.accuracy) || fix.accuracy < 0 || fix.accuracy > 60
    || !Number.isFinite(fix.timestamp) || Math.abs(now - fix.timestamp) > 30000) return undefined
  const matches = places.flatMap(p => {
    const point = points[p.id]
    if (!point || !validPoint(point)) return []
    const meters = distanceMeters(fix, point)
    return meters <= 100 ? [{ id: p.id, meters }] : []
  }).sort((a, b) => a.meters - b.meters || a.id.localeCompare(b.id))
  const stable = matches.find(m => m.id === previous)
  return stable && matches[0] && Math.abs(stable.meters - matches[0].meters) < 0.01 ? stable.id : matches[0]?.id
}

export function routeAvailable(route: VisitRoute, places: readonly PlaceRecord[]) {
  return route.available && route.stops.length > 0 && route.stops.every(id => places.some(p => p.id === id))
}

export class JourneyController {
  private state: JourneyState = { places: [], ready: false, status: 'idle', changed: false, gps: false }
  private listeners = new Set<() => void>()
  private track?: Track
  private unlisten?: () => void
  private unwatch?: () => void
  private generation = 0
  private lifecycle = 0
  private gpsGeneration = 0
  private intent?: { id: string; language: Language; autoplay: boolean }
  private writes: Promise<void> = Promise.resolve()
  private lastPersist = 0
  constructor(public readonly ports: JourneyPorts) {}
  snapshot = () => this.state
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener) } }
  private set(next: Partial<JourneyState>) { this.state = { ...this.state, ...next }; this.listeners.forEach(l => l()) }

  // CHỨC NĂNG: Nạp danh mục và bản lưu độc lập.
  // XỬ LÝ: Bộ nhớ bị chặn vẫn giữ danh sách; bản ghi đổi phiên bản chỉ hiện lời nhắc.
  async start() {
    const life = ++this.lifecycle
    try {
      let readFailed = false
      const [places, raw] = await Promise.all([this.ports.catalog.list(), this.ports.read().catch(() => { readFailed = true; return null })])
      if (life !== this.lifecycle) return
      const saved = parseSaved(raw)
      let valid: Saved | undefined
      let changed = false
      if (saved) {
        const text = publishedText(places.find(p => p.id === saved.placeId) ?? { content: {} } as PlaceRecord, saved.language)
        const audio = text?.audio
        if (audio?.status === 'published' && audio.approvedAt && audio.publishedAt) {
          valid = saved
          changed = text?.version !== saved.textVersion || audio.id !== saved.audioId || audio.version !== saved.audioVersion
        }
      }
      this.set({ places, ready: true, restore: valid, changed,
        error: readFailed ? 'saveFailed' : raw && !valid ? 'savedInvalid' : undefined })
    } catch { if (life === this.lifecycle) this.set({ ready: true, error: 'loadError' }) }
  }

  // CHỨC NĂNG: Refresh danh mục sau công bố, không dừng nguồn audio đang nghe.
  async refreshCatalog() {
    const life = this.lifecycle
    try { const places = await this.ports.catalog.list(); if (life === this.lifecycle) this.set({ places }) }
    catch { if (life === this.lifecycle) this.set({ error: 'loadError' }) }
  }
  // CHỨC NĂNG: Ghi tuần tự để phản hồi ghi cũ không đè tiến độ mới.
  // XỬ LÝ: Lỗi lưu không dừng âm thanh; UI thông báo vẫn dùng được trong phiên.
  private persist(clear = false, quiet = false) {
    const s = this.state.session
    if (!s && !clear) return
    const value = clear ? null : JSON.stringify(s)
    const generation = this.generation
    this.writes = this.writes.then(() => this.ports.write(value)).catch(() => {
      // CHỨC NĂNG: Lỗi ghi của bài cũ không được mở lại player người dùng vừa đóng.
      // XỬ LÝ: Đối chiếu generation; close xóa checkpoint theo chế độ quiet.
      if (!quiet && generation === this.generation) this.set({ error: 'saveFailed' })
    })
  }
  private stopTrack() { this.unlisten?.(); this.unlisten = undefined; this.track?.pause(); this.track?.dispose(); this.track = undefined }

  // CHỨC NĂNG: Tải và phát một nguồn đã công bố.
  // XỬ LÝ: Mỗi lần gọi tăng generation; phản hồi cũ đến muộn chỉ được giải phóng.
  async play(id: string, language: Language, position = 0, autoplay = true, rate = 1) {
    const request = ++this.generation
    this.intent = { id, language, autoplay }
    this.persist()
    this.stopTrack()
    this.set({ status: 'loading', session: undefined, error: undefined, restore: undefined })
    let next: Track | undefined
    try {
      const place = await this.ports.catalog.get(id)
      if (request !== this.generation) return
      const text = publishedText(place, language)
      const audio = text?.audio
      if (!audio || audio.status !== 'published' || !audio.approvedAt || !audio.publishedAt) throw new Error('audioMissing')
      next = await this.ports.open(audio.url, text.title)
      if (request !== this.generation) { next.dispose(); return }
      if (!Number.isFinite(next.duration) || next.duration <= 0) throw new Error('audioFailed')
      this.track = next
      const session: Session = { placeId: id, language, title: text.title, textVersion: text.version,
        audioId: audio.id, audioVersion: audio.version, duration: next.duration,
        position: clampTime(position, next.duration), rate }
      await next.seek(session.position)
      if (request !== this.generation) return
      next.rate(rate)
      this.set({ session, status: 'paused' })
      this.unlisten = next.listen(status => {
        if (request !== this.generation || !this.state.session) return
        if (status.error) { this.persist(); this.stopTrack(); this.set({ status: 'error', error: 'audioFailed' }); return }
        this.set({ session: { ...this.state.session, position: clampTime(status.position, status.duration), duration: status.duration },
          status: status.ended ? 'ended' : status.playing ? 'playing' : 'paused' })
        if (status.ended) this.persist(true)
        else if (Date.now() - this.lastPersist > 5000) { this.lastPersist = Date.now(); this.persist() }
      })
      if (autoplay) { await next.play(); if (request === this.generation && this.intent?.autoplay) this.set({ status: 'playing' }) }
      this.persist()
    } catch (error) {
      if (request !== this.generation) { next?.dispose(); return }
      // CHỨC NĂNG: Pause ngay sau Play là thao tác bình thường, không phải lỗi nguồn.
      // XỬ LÝ: HTML Audio có thể hủy Promise play bằng AbortError khi pause đến trước.
      if (error instanceof Error && error.name === 'AbortError' && !this.intent?.autoplay && next === this.track) { this.persist(); return }
      if (next && next !== this.track) next.dispose()
      this.stopTrack()
      this.set({ status: 'error', error: error instanceof Error && error.message === 'audioMissing' ? 'audioMissing' : 'audioFailed' })
    }
  }

  // CHỨC NĂNG: Dừng và đóng hoàn toàn trình nghe khi nhấn × trên web/native.
  // XỬ LÝ: generation vô hiệu hóa tải/Promise cũ; gỡ listener trước khi pause/dispose.
  // Xóa phiên và checkpoint để đổi ngôn ngữ/retry không tự mở lại bài đã đóng.
  // Danh mục, tuyến và GPS giữ nguyên vì đóng trình nghe không phải thoát ứng dụng.
  close() {
    this.generation++
    this.intent = undefined
    this.stopTrack()
    this.set({ status: 'idle', session: undefined, restore: undefined, changed: false, error: undefined })
    this.persist(true, true)
  }

  // CHỨC NĂNG: Tạm dừng, tiếp tục, tua và tốc độ tác động trực tiếp lên Track thật.
  // XỬ LÝ: Chỉ cập nhật trạng thái khi nguồn hiện tại vẫn là nguồn đã thao tác.
  pause() { if (!this.track) return; if (this.intent) this.intent.autoplay = false; this.track.pause(); this.set({ status: 'paused' }); this.persist() }
  async resume() {
    const t = this.track
    if (!t) return
    if (this.intent) this.intent.autoplay = true
    try { await t.play(); if (t === this.track && this.intent?.autoplay) this.set({ status: 'playing', error: undefined }) }
    catch (error) { if (error instanceof Error && error.name === 'AbortError' && !this.intent?.autoplay) return; if (t === this.track) this.set({ status: 'error', error: 'audioFailed' }) }
  }
  async seek(value: number) {
    const t = this.track, s = this.state.session
    if (!t || !s || this.state.status === 'loading') return
    try { const position = clampTime(value, s.duration); await t.seek(position)
      if (t === this.track && this.state.session) { this.set({ session: { ...this.state.session, position } }); this.persist() }
    } catch { if (t === this.track) this.set({ error: 'audioFailed' }) }
  }
  rate(value: number) {
    if (!this.track || !this.state.session || ![0.75, 1, 1.25, 1.5, 2].includes(value)) return
    try { this.track.rate(value); this.set({ session: { ...this.state.session, rate: value } }); this.persist() }
    catch { this.set({ error: 'audioFailed' }) }
  }
  // CHỨC NĂNG: Đổi cả bài đọc và audio theo ngôn ngữ chung UC08.
  // XỬ LÝ: Đang nghe thì phát bản mới từ 0; đang tạm dừng vẫn tạm dừng từ 0.
  changeLanguage(language: Language) {
    const active = this.intent
    if (!active || active.language === language) return
    const autoplay = this.state.status === 'playing' || (this.state.status === 'loading' && active.autoplay)
    void this.play(active.id, language, 0, autoplay, this.state.session?.rate ?? 1)
  }
  dismissRestore() { this.set({ restore: undefined, changed: false }); this.persist(true) }
  async restorePlay() { const s = this.state.restore; if (s) await this.play(s.placeId, s.language, this.state.changed ? 0 : s.position, true, s.rate) }
  selectRoute(id?: string) {
    const route = this.ports.routes.find(r => r.id === id)
    this.set({ routeId: route && routeAvailable(route, this.state.places) ? id : undefined })
  }

  // CHỨC NĂNG: GPS chỉ đổi gợi ý, không gọi play.
  // XỬ LÝ: Đang phát/đang tải/đã kết thúc hoặc đang chờ khôi phục thì giữ màn.
  acceptFix(fix: Fix) {
    const weak = !Number.isFinite(fix.accuracy) || fix.accuracy < 0 || !Number.isFinite(fix.timestamp) || fix.accuracy > 60 || Math.abs(Date.now() - fix.timestamp) > 30000 || !validPoint(fix)
    const prior = this.state.error
    this.set({ fix: weak ? undefined : fix, error: weak ? 'gpsWeak' : prior === 'gpsWeak' || prior === 'gpsFailed' ? undefined : prior })
    if (weak || !['idle', 'paused', 'error'].includes(this.state.status) || this.state.restore) return
    this.set({ suggestedId: nearest(this.state.places, this.ports.positions, fix, this.state.suggestedId) })
  }
  async gps(enabled: boolean) {
    const request = ++this.gpsGeneration
    this.unwatch?.(); this.unwatch = undefined
    this.set({ gps: enabled, error: undefined })
    if (!enabled) return
    try {
      const stop = await this.ports.watch(fix => { if (request === this.gpsGeneration) this.acceptFix(fix) },
        () => { if (request === this.gpsGeneration) this.set({ gps: false, error: 'gpsFailed' }) })
      if (request !== this.gpsGeneration) stop(); else this.unwatch = stop
    } catch { if (request === this.gpsGeneration) this.set({ gps: false, error: 'gpsFailed' }) }
  }
  // CHỨC NĂNG: Chốt tiến độ khi web/app ra nền, không dừng bài đang nghe.
  checkpoint() { this.persist(this.state.status === 'ended') }
  retry() { if (this.state.error === 'loadError') { void this.start(); return } const i = this.intent; if (i) void this.play(i.id, i.language) }
  dispose() { this.lifecycle++; this.generation++; this.gpsGeneration++; this.persist(this.state.status === 'ended'); this.unwatch?.(); this.unwatch = undefined; this.stopTrack() }
}

/* CÁCH KIỂM TRA FILE NÀY CHẠY ĐÚNG:
 * - Chạy npm test; kiểm tra chỉ có một nguồn đang nghe.
 * - Đổi ngôn ngữ lúc tải chậm: nguồn cũ không được phát muộn.
 */
```

## 7. SỬA — packages/visitor-core/src/uiMessages.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\visitor-core\src\uiMessages.ts

```typescript
/**
 * FILE NÀY LÀM GÌ:
 * Bổ sung chữ giao diện theo mockup cho năm ngôn ngữ.
 * messages.ts ghép file này vào resource i18n.
 * Phụ thuộc Language; liên quan UC01–UC05.
 */

import type { Language } from './model'

// CHỨC NĂNG: Bản Việt xác định bộ khóa bổ sung.
// XỬ LÝ: Đây là chữ UI, không phải bài thuyết minh di tích.
const vi = {
  site: 'Kinh thành Huế',
  tagline: 'KẾT NỐI DI SẢN VIỆT',
  heroTitle: 'Khám phá\nKinh thành Huế',
  heroSubtitle: 'Hành trình di sản — Đọc, tìm hiểu, khám phá bằng ngôn ngữ của bạn',
  home: 'Trang chủ',
  about: 'Về chúng tôi',
  map: 'Bản đồ',
  settings: 'Cài đặt',
  featured: 'Địa điểm nổi bật',
  featuredHint: 'Những công trình trong danh mục minh họa',
  featuredEmpty: 'Chưa có địa điểm nổi bật phù hợp.',
  featuredEmptyHint: 'Bạn vẫn có thể khám phá các địa điểm trong danh sách bên dưới.',
  viewAll: 'Xem tất cả',
  allPlaces: 'Tất cả điểm tham quan',
  searchButton: 'Tìm kiếm',
  searchKeyword: 'Nhập từ khóa...',
  searchFieldsHint: 'Tìm theo tên, địa chỉ hoặc nội dung.',
  searchRequired: 'Vui lòng nhập tên, địa chỉ hoặc nội dung cần tìm.',
  searchWithin: 'Tìm trong kết quả...',
  filters: 'Bộ lọc',
  clearAll: 'Xóa tất cả',
  category_monument: 'Công trình di tích',
  category: 'Danh mục',
  category_palace: 'Cung điện',
  category_gate: 'Cổng thành',
  category_temple: 'Điện thờ',
  category_tomb: 'Lăng tẩm',
  category_museum: 'Bảo tàng',
  region: 'Khu vực',
  city: 'Thành phố Huế',
  grid: 'Dạng lưới',
  list: 'Dạng danh sách',
  comingSoon: 'Chức năng này sẽ được triển khai sau UC01–UC05.',
  notification: 'Thông báo',
  qrAccess: 'Truy cập bằng QR',
  generalQr: 'QR vào chung khu di tích',
  
  browserOnly: "Quét QR bằng camera thường để mở website. Không cần cài hay đăng nhập Expo Go.",
  openWebsite: "Mở website",
  shareWebsite: "Chia sẻ liên kết",
  websiteError: "Không mở được liên kết. Hãy thử lại.",
  qrSetup: 'Chưa có địa chỉ QR dùng chung. Hãy cấu hình URL website công khai hoặc mở web bằng địa chỉ IP LAN.',
  photoCredits: 'Nguồn ảnh',
  noAccount: 'Du khách sử dụng không cần tài khoản.',
  clearSearch: 'Xóa từ khóa',
  closePlayer: 'Dừng và đóng trình nghe',
  filterHint: 'Chọn nhiều mục để mở rộng kết quả trong cùng nhóm.',
  
} as const

type UiText = Record<keyof typeof vi, string>

// CHỨC NĂNG: Khai báo đầy đủ cùng bộ khóa ở năm ngôn ngữ.
// XỬ LÝ: satisfies giúp TypeScript phát hiện thiếu khóa.
export const uiMessages = {
  vi,

  en: {
    site: 'Hue Citadel',
    tagline: 'CONNECT WITH VIETNAMESE HERITAGE',
    heroTitle: 'Explore\nHue Citadel',
    heroSubtitle: 'A heritage journey — Read, learn and explore in your language',
    home: 'Home',
    about: 'About us',
    map: 'Map',
    settings: 'Settings',
    featured: 'Featured places',
    featuredHint: 'Buildings in the sample visitor catalogue',
    featuredEmpty: 'No featured places match this selection.',
    featuredEmptyHint: 'You can still explore the places listed below.',
    viewAll: 'View all',
    allPlaces: 'All places',
    searchButton: 'Search',
    searchKeyword: 'Enter a keyword...',
    searchFieldsHint: 'Search by name, address or content.',
    searchRequired: 'Please enter a name, address or content to search.',
    searchWithin: 'Search within results...',
    filters: 'Filters',
    clearAll: 'Clear all',
    category: 'Category',
    category_palace: 'Palaces',
    category_monument: 'Monuments',
    category_gate: 'Gates',
    category_temple: 'Temples',
    category_tomb: 'Tombs',
    category_museum: 'Museums',
    region: 'Area',
    city: 'Hue City',
    grid: 'Grid view',
    list: 'List view',
    comingSoon: 'This feature will be implemented after UC01–UC05.',
    notification: 'Notifications',
    qrAccess: 'QR access',
    generalQr: 'General heritage entry QR',

    browserOnly: "Scan the QR with your phone camera to open the website. No Expo Go installation or sign-in is required.",
    openWebsite: "Open website",
    shareWebsite: "Share link",
    websiteError: "Could not open the link. Please try again.",
    qrSetup: 'The shared QR address is unavailable. Configure a public website URL or open the site using its LAN IP address.',
    photoCredits: 'Photo credits',
    noAccount: 'Visitors do not need an account.',
    clearSearch: 'Clear search',
    closePlayer: 'Stop and close player',
    filterHint: 'Select multiple items to widen results within a group.',
  },

  cn: {
    site: '顺化京城',
    tagline: '连接越南文化遗产',
    heroTitle: '探索\n顺化京城',
    heroSubtitle: '遗产之旅 — 用您的语言阅读、了解和探索',
    home: '首页',
    about: '关于我们',
    map: '地图',
    settings: '设置',
    featured: '精选景点',
    featuredHint: '示例参观目录中的建筑',
    featuredEmpty: '没有符合条件的精选景点。',
    featuredEmptyHint: '您仍可浏览下方的景点列表。',
    viewAll: '查看全部',
    allPlaces: '全部景点',
    searchButton: '搜索',
    searchKeyword: '输入关键词…',
    searchFieldsHint: '按名称、地址或内容搜索。',
    searchRequired: '请输入要搜索的名称、地址或内容。',
    searchWithin: '在结果中搜索...',
    filters: '筛选',
    clearAll: '清除全部',
    category_monument: '遗迹建筑',
    category: '类别',
    category_palace: '宫殿',
    category_gate: '城门',
    category_temple: '庙宇',
    category_tomb: '陵墓',
    category_museum: '博物馆',
    region: '区域',
    city: '顺化市',
    grid: '网格视图',
    list: '列表视图',
    comingSoon: '此功能将在 UC01–UC05 之后实现。',
    notification: '通知',
    qrAccess: '二维码访问',
    generalQr: '遗迹通用入口二维码',

    browserOnly: "使用手机相机扫描二维码即可打开网站，无需安装或登录 Expo Go。",
    openWebsite: "打开网站",
    shareWebsite: "分享链接",
    websiteError: "无法打开链接，请重试。",
    qrSetup: '共用二维码地址不可用。请配置公开网站地址，或使用局域网 IP 地址打开网站。',
    photoCredits: '图片来源',
    noAccount: '游客无需账户。',
    clearSearch: '清除关键词',
    closePlayer: '停止并关闭播放器',
    filterHint: '同组可多选以扩大结果。',
  },

  pt: {
    site: 'Cidadela de Huế',
    tagline: 'LIGAR AO PATRIMÓNIO VIETNAMITA',
    heroTitle: 'Explorar\na Cidadela de Huế',
    heroSubtitle: 'Uma viagem pelo património — Leia, conheça e explore no seu idioma',
    home: 'Início',
    about: 'Sobre nós',
    map: 'Mapa',
    settings: 'Definições',
    featured: 'Locais em destaque',
    featuredHint: 'Edifícios no catálogo de demonstração',
    featuredEmpty: 'Não há locais em destaque nesta seleção.',
    featuredEmptyHint: 'Pode explorar os locais na lista abaixo.',
    viewAll: 'Ver todos',
    allPlaces: 'Todos os locais',
    searchButton: 'Pesquisar',
    searchKeyword: 'Introduza uma palavra...',
    searchFieldsHint: 'Pesquise por nome, endereço ou conteúdo.',
    searchRequired: 'Introduza um nome, endereço ou conteúdo para pesquisar.',
    searchWithin: 'Pesquisar nos resultados...',
    filters: 'Filtros',
    clearAll: 'Limpar tudo',
    category_monument: 'Monumentos',
    category: 'Categoria',
    category_palace: 'Palácios',
    category_gate: 'Portas',
    category_temple: 'Templos',
    category_tomb: 'Túmulos',
    category_museum: 'Museus',
    region: 'Área',
    city: 'Cidade de Huế',
    grid: 'Grelha',
    list: 'Lista',
    comingSoon: 'Esta função será implementada depois de UC01–UC05.',
    notification: 'Notificações',
    qrAccess: 'Acesso por QR',
    generalQr: 'QR de entrada geral',

    browserOnly: "Leia o QR com a câmara do telemóvel para abrir o website. Não é necessário instalar nem iniciar sessão no Expo Go.",
    openWebsite: "Abrir website",
    shareWebsite: "Partilhar ligação",
    websiteError: "Não foi possível abrir a ligação. Tente novamente.",
    qrSetup: 'O endereço do QR comum não está disponível. Configure o URL público ou abra o site pelo endereço IP da rede local.',
    photoCredits: 'Créditos das fotografias',
    noAccount: 'Os visitantes não precisam de conta.',
    clearSearch: 'Limpar pesquisa',
    closePlayer: 'Parar e fechar o leitor',
    filterHint: 'Selecione vários itens para ampliar os resultados no mesmo grupo.',
  },

  ja: {
    site: 'フエ京城',
    tagline: 'ベトナムの遺産とつながる',
    heroTitle: '探索\nフエ京城',
    heroSubtitle: '遺産の旅 — 自分の言語で読み、学び、探索する',
    home: 'ホーム',
    about: '私たちについて',
    map: '地図',
    settings: '設定',
    featured: '注目のスポット',
    featuredHint: 'サンプル参観リストの建物',
    featuredEmpty: '条件に合うおすすめスポットはありません。',
    featuredEmptyHint: '下の一覧からスポットを探すことができます。',
    viewAll: 'すべて見る',
    allPlaces: 'すべてのスポット',
    searchButton: '検索',
    searchKeyword: 'キーワードを入力…',
    searchFieldsHint: '名前、住所、内容で検索できます。',
    searchRequired: '検索する名前、住所、または内容を入力してください。',
    searchWithin: '結果内を検索...',
    category_monument: '遺跡建築',
    filters: '絞り込み',
    clearAll: 'すべて解除',
    category: 'カテゴリー',
    category_palace: '宮殿',
    category_gate: '城門',
    category_temple: '寺廟',
    category_tomb: '陵墓',
    category_museum: '博物館',
    region: 'エリア',
    city: 'フエ市',
    grid: 'グリッド表示',
    list: 'リスト表示',
    comingSoon: 'この機能は UC01–UC05 の後に実装予定です。',
    notification: '通知',
    qrAccess: 'QRでアクセス',
    generalQr: '遺跡の共通入口QR',

    browserOnly: "スマートフォンのカメラでQRを読み取るとサイトが開きます。Expo Goのインストールやログインは不要です。",
    openWebsite: "サイトを開く",
    shareWebsite: "リンクを共有",
    websiteError: "リンクを開けませんでした。もう一度お試しください。",
    qrSetup: '共通QRのURLがありません。公開サイトのURLを設定するか、LANのIPアドレスで開いてください。',
    photoCredits: '写真の出典',
    noAccount: '観光客のアカウントは不要です。',
    clearSearch: '検索語を消去',
    closePlayer: '再生を停止して閉じる',
    filterHint: '同じグループで複数選択して結果を広げられます。',
  },
} satisfies Record<Language, UiText>
```

## 8. SỬA — packages/visitor-core/tests/journey.test.cjs

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\visitor-core\tests\journey.test.cjs

```javascript
/**
 * FILE NÀY LÀM GÌ: Kiểm tra nghiệp vụ UC06–UC11 bằng adapter audio/GPS giả.
 * npm test gọi; không phát loa, không cần mạng. Kiểm tra race và quy tắc thật,
 * không dùng đồng hồ giả thay cho thời lượng audio ở giao diện sản phẩm.
 */
const { test } = require('node:test')
const assert = require('node:assert/strict')
const { JourneyController, nearest, parseSaved, clampTime, routeAvailable } = require('../.test-build/journey.js')
const { createCatalog } = require('../.test-build/catalog.js')
const { MOCK_PLACES } = require('../.test-build/mock.js')
const tick = () => new Promise(resolve => setImmediate(resolve))

function track() {
  const listeners = new Set()
  const t = { duration: 30, position: 0, playing: false, plays: 0, disposed: false,
    async play() { this.playing = true; this.plays++; this.emit() },
    pause() { this.playing = false; this.emit() },
    async seek(value) { this.position = value; this.emit() }, rate() {},
    listen(callback) { listeners.add(callback); return () => listeners.delete(callback) },
    dispose() { this.disposed = true; this.playing = false },
    emit(ended = false, error = false) { listeners.forEach(l => l({ position: this.position, duration: 30, playing: this.playing, ended, error })) },
  }
  return t
}
function fixture(extra = {}) {
  const writes = [], tracks = []
  const ports = {
    catalog: createCatalog(async () => MOCK_PLACES),
    positions: { 'ngo-mon': { lat: 0, lng: 0, source: 'test', fieldVerified: true } }, routes: [],
    open: async () => { const t = track(); tracks.push(t); return t },
    watch: async () => () => {}, read: async () => null, write: async value => { writes.push(value) },
    ...extra,
  }
  return { engine: new JourneyController(ports), writes, tracks }
}
const fix = (lng = 0) => ({ lat: 0, lng, accuracy: 5, timestamp: Date.now() })

test('UC06: chỉ chọn điểm trong 100m, dữ liệu GPS cũ/sai bị loại', () => {
  const { engine } = fixture(), places = [MOCK_PLACES[1]], points = engine.ports.positions
  assert.equal(nearest(places, points, fix()), 'ngo-mon')
  assert.equal(nearest(places, points, fix(0.00089)), 'ngo-mon')
  assert.equal(nearest(places, points, fix(0.00091)), undefined)
  assert.equal(nearest(places, points, { ...fix(), accuracy: 100 }), undefined)
  assert.equal(nearest(places, points, { ...fix(), timestamp: Date.now() - 31000 }), undefined)
  assert.equal(nearest(places, points, { ...fix(), lat: NaN }), undefined)
})
test('UC06: khoảng cách bằng nhau giữ điểm trước', () => {
  const points = { 'ngo-mon': { lat: 0, lng: 0 }, 'ky-dai': { lat: 0, lng: 0 } }
  assert.equal(nearest(MOCK_PLACES, points, fix(), 'ngo-mon'), 'ngo-mon')
})
test('UC06/07: đang nghe giữ bài và màn; tạm dừng được gợi ý nhưng không tự phát', async () => {
  const { engine, tracks } = fixture(); await engine.start()
  await engine.play('ky-dai', 'vi'); engine.acceptFix(fix())
  assert.equal(engine.snapshot().suggestedId, undefined)
  assert.equal(tracks[0].plays, 1)
  engine.pause(); engine.acceptFix(fix())
  assert.equal(engine.snapshot().suggestedId, 'ngo-mon')
  assert.equal(engine.snapshot().session.placeId, 'ky-dai')
  assert.equal(tracks[0].plays, 1); engine.dispose()
})
test('UC07: pause/seek giữ paused, tua clamp theo thời lượng thật', async () => {
  const { engine, tracks } = fixture(); await engine.start(); await engine.play('ngo-mon', 'vi')
  tracks[0].position = 8; tracks[0].emit(); engine.pause()
  await engine.seek(999); assert.equal(tracks[0].position, 30)
  assert.equal(engine.snapshot().status, 'paused')
  await engine.seek(-10); assert.equal(tracks[0].position, 0)
  await engine.resume(); assert.equal(engine.snapshot().status, 'playing')
  engine.dispose()
})
test('UC07: chỉ một bài phát và nguồn cũ được giải phóng', async () => {
  const { engine, tracks } = fixture(); await engine.start()
  await engine.play('ngo-mon', 'vi'); await engine.play('ky-dai', 'vi')
  assert.equal(tracks[0].disposed, true); assert.equal(tracks[0].playing, false)
  assert.equal(tracks[1].playing, true); engine.dispose()
})
test('UC07.3: lỗi tốc độ giữ tốc độ đang có hiệu lực', async () => {
  const { engine, tracks } = fixture(); await engine.start(); await engine.play('ngo-mon', 'vi')
  tracks[0].rate = () => { throw Error('unsupported') }; engine.rate(1.5)
  assert.equal(engine.snapshot().session.rate, 1)
  assert.equal(engine.snapshot().error, 'audioFailed'); engine.dispose()
})
test('UC08: đổi ngôn ngữ đang nghe phát bản mới từ 0; paused vẫn paused', async () => {
  const { engine, tracks } = fixture(); await engine.start(); await engine.play('ngo-mon', 'vi')
  tracks[0].position = 12; tracks[0].emit(); engine.changeLanguage('cn'); await tick()
  assert.equal(engine.snapshot().session.language, 'cn')
  assert.equal(engine.snapshot().session.position, 0); assert.equal(engine.snapshot().status, 'playing')
  engine.pause(); engine.changeLanguage('pt'); await tick()
  assert.equal(engine.snapshot().session.language, 'pt')
  assert.equal(engine.snapshot().status, 'paused'); engine.dispose()
})
test('UC07/08: phản hồi nguồn cũ đến muộn không phát đè bản mới', async () => {
  let release
  const late = track(), recent = track()
  const { engine } = fixture({ open: url => url === 'demo:vi' ? new Promise(resolve => { release = resolve }) : Promise.resolve(recent) })
  await engine.start(); const first = engine.play('ngo-mon', 'vi'); await tick()
  await engine.play('ngo-mon', 'en'); release(late); await first
  assert.equal(late.plays, 0); assert.equal(late.disposed, true)
  assert.equal(recent.plays, 1); assert.equal(engine.snapshot().session.language, 'en'); engine.dispose()
})
test('UC07: thiếu audio đã công bố không tự dùng bản nháp', async () => {
  const place = JSON.parse(JSON.stringify(MOCK_PLACES[1])); place.content.vi.audio.status = 'draft'
  const { engine, tracks } = fixture({ catalog: createCatalog(async () => [place]) })
  await engine.start(); await engine.play(place.id, 'vi')
  assert.equal(engine.snapshot().error, 'audioMissing'); assert.equal(tracks.length, 0); engine.dispose()
})
test('UC07: kết thúc không phát bài kế tiếp', async () => {
  const { engine, tracks } = fixture(); await engine.start(); await engine.play('ngo-mon', 'vi')
  tracks[0].position = 30; tracks[0].playing = false; tracks[0].emit(true)
  assert.equal(engine.snapshot().status, 'ended'); assert.equal(tracks.length, 1); engine.dispose()
})
test('UC10: tuyến có điểm bị rút không được sử dụng', () => {
  const route = { available: true, stops: ['ngo-mon', 'gone'] }
  assert.equal(routeAvailable(route, MOCK_PLACES), false)
  assert.equal(routeAvailable({ ...route, stops: ['ngo-mon'] }, MOCK_PLACES), true)
})
test('UC11: bản lưu hỏng bị loại; tiến độ vượt thời lượng được clamp', () => {
  assert.equal(parseSaved('{bad'), undefined)
  assert.equal(parseSaved(JSON.stringify({ placeId: 'ngo-mon', language: 'xx' })), undefined)
  assert.equal(clampTime(-10, 30), 0); assert.equal(clampTime(NaN, 30), 0)
})
test('UC11: mở lại chỉ đề nghị, đúng phiên bản mới tiếp tục tại thời điểm cũ', async () => {
  const saved = { placeId: 'ngo-mon', language: 'vi', textVersion: 1, audioId: 'demo-vi', audioVersion: 1, position: 9, duration: 30, rate: 1.25 }
  const { engine, tracks } = fixture({ read: async () => JSON.stringify(saved) })
  await engine.start(); assert.equal(tracks.length, 0); assert.equal(engine.snapshot().changed, false)
  await engine.restorePlay(); assert.equal(tracks[0].position, 9); assert.equal(engine.snapshot().session.rate, 1.25)
  engine.dispose()
})
test('UC11: phiên bản thay đổi thì đề nghị nghe mới từ đầu', async () => {
  const saved = { placeId: 'ngo-mon', language: 'vi', textVersion: 99, audioId: 'old', audioVersion: 1, position: 9, duration: 30, rate: 1 }
  const { engine, tracks } = fixture({ read: async () => JSON.stringify(saved) })
  await engine.start(); assert.equal(engine.snapshot().changed, true); assert.equal(tracks.length, 0)
  await engine.restorePlay(); assert.equal(tracks[0].position, 0); engine.dispose()
})
test('UC11: lỗi ghi không dừng âm thanh', async () => {
  const { engine, tracks } = fixture({ write: async () => { throw Error('full') } })
  await engine.start(); await engine.play('ngo-mon', 'vi'); await tick()
  assert.equal(engine.snapshot().error, 'saveFailed'); assert.equal(tracks[0].playing, true); engine.dispose()
})

// CHỨC NĂNG: Lỗi bộ nhớ không được làm mất danh sách UC06/UC09.
test('UC11: lỗi đọc bộ nhớ vẫn hiển thị địa điểm', async () => {
  const { engine } = fixture({ read: async () => { throw Error('blocked') } })
  await engine.start(); assert.equal(engine.snapshot().places.length, 8)
  assert.equal(engine.snapshot().error, 'saveFailed'); engine.dispose()
})
// CHỨC NĂNG: Đã nghe hết thì không đề nghị tiếp tục khi khởi động lại.
test('UC11: dispose không ghi lại bài đã kết thúc', async () => {
  const { engine, tracks, writes } = fixture(); await engine.start(); await engine.play('ngo-mon', 'vi')
  tracks[0].position = 30; tracks[0].playing = false; tracks[0].emit(true)
  engine.dispose(); await tick(); assert.equal(writes.at(-1), null)
})
// CHỨC NĂNG: Lỗi audio sau metadata phải được UI nhận và giải phóng nguồn.
test('UC07: lỗi nguồn đang phát được truyền tới UI', async () => {
  const { engine, tracks } = fixture(); await engine.start(); await engine.play('ngo-mon', 'vi')
  tracks[0].emit(false, true)
  assert.equal(engine.snapshot().status, 'error')
  assert.equal(tracks[0].disposed, true)
  engine.dispose()
})

// CHỨC NĂNG: Pause trước khi Promise play hoàn tất không được bị báo audioFailed.
// XỬ LÝ: Mô phỏng AbortError thật của HTML Audio để giữ nguồn và thời điểm paused.
for (const initial of [true, false]) {
  test('UC07: pause trong lúc ' + (initial ? 'play' : 'resume') + ' còn chờ không làm hỏng phiên', async () => {
    const t = track()
    const { engine } = fixture({ open: async () => t })
    await engine.start()
    if (!initial) await engine.play('ngo-mon', 'vi', 0, false)
    let rejectPlay
    t.play = async () => {
      t.playing = true; t.emit()
      await new Promise((_resolve, reject) => { rejectPlay = reject })
    }
    const waiting = initial ? engine.play('ngo-mon', 'vi') : engine.resume()
    await tick(); engine.pause()
    const error = new Error('play interrupted by pause'); error.name = 'AbortError'
    rejectPlay(error); await waiting
    assert.equal(engine.snapshot().status, 'paused')
    assert.equal(engine.snapshot().error, undefined)
    assert.equal(t.disposed, false)
    engine.dispose()
  })
}

// CHỨC NĂNG: × dừng nguồn thật, xóa checkpoint và không tự mở lại khi đổi ngôn ngữ.
test('UC07: close dừng/giải phóng nguồn, xóa phiên và checkpoint', async () => {
  const { engine, tracks, writes } = fixture()
  await engine.start(); await engine.play('ngo-mon', 'vi')
  engine.close(); engine.changeLanguage('en'); engine.retry(); engine.checkpoint(); await tick()
  assert.equal(tracks[0].playing, false); assert.equal(tracks[0].disposed, true)
  assert.equal(engine.snapshot().status, 'idle'); assert.equal(engine.snapshot().session, undefined)
  assert.equal(engine.snapshot().restore, undefined); assert.equal(engine.snapshot().error, undefined)
  assert.equal(tracks.length, 1); assert.equal(writes.at(-1), null)
  engine.dispose()
})
// CHỨC NĂNG: Đóng trong lúc tải không được phát lại khi request cũ trả về.
test('UC07: close khi tải chậm loại nguồn đến muộn', async () => {
  let release
  const late = track()
  const { engine } = fixture({ open: () => new Promise(resolve => { release = resolve }) })
  await engine.start(); const loading = engine.play('ngo-mon', 'vi'); await tick()
  engine.close(); release(late); await loading
  assert.equal(late.plays, 0); assert.equal(late.disposed, true)
  assert.equal(engine.snapshot().status, 'idle'); assert.equal(engine.snapshot().session, undefined)
  engine.dispose()
})
// CHỨC NĂNG: Bộ nhớ bị chặn không mở lại thanh nghe vừa đóng.
test('UC07/11: lỗi ghi đến muộn sau close không mở lại player', async () => {
  const { engine } = fixture({ write: async () => { throw Error('blocked') } })
  await engine.start(); await engine.play('ngo-mon', 'vi'); engine.close(); await tick()
  assert.equal(engine.snapshot().session, undefined); assert.equal(engine.snapshot().error, undefined)
  assert.equal(engine.snapshot().status, 'idle'); engine.dispose()
})
```
