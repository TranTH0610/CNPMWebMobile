# Toàn bộ mã sửa nghe thử và vị trí

Gốc: `D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong`.

## packages/visitor-core/src/audio/playback.ts

TẠO MỚI — Bộ cấp quyền phát duy nhất, tạm dừng nguồn trước khi bật nguồn mới.

Đường dẫn: `D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\visitor-core\src\audio\playback.ts`.

```typescript
/** FILE NÀY LÀM GÌ: Giữ quyền phát duy nhất giữa bài du khách và nghe thử Admin.
 * Adapter native/web và AdminAudioPreview dùng; không phụ thuộc React/thiết bị.
 * UC07/UC14: đổi nguồn chỉ tạm dừng nguồn trước, giữ vị trí để có thể tiếp tục.
 */
export type PlaybackOwner = { pause(): void }
export class PlaybackCoordinator {
  private owner?: PlaybackOwner
  // CHỨC NĂNG: Nguồn mới chiếm quyền phát trước khi gọi API play bất đồng bộ.
  // XỬ LÝ: Gán owner trước khi pause để sự kiện pause của nguồn cũ không xóa nguồn mới.
  claim(owner: PlaybackOwner): void {
    const previous = this.owner
    this.owner = owner
    if (previous && previous !== owner) previous.pause()
  }
  owns(owner: PlaybackOwner): boolean { return this.owner === owner }
  release(owner: PlaybackOwner): void { if (this.owner === owner) this.owner = undefined }
}
export const playbackCoordinator = new PlaybackCoordinator()
/* CÁCH KIỂM TRA: Bắt đầu B làm A pause; release A không xóa quyền B; resume A không tua về 0. */
```

## packages/visitor-core/src/audio/preview.ts

TẠO MỚI — Controller nghe thử giữ Track, tiến độ và chống nguồn bất đồng bộ đến muộn.

Đường dẫn: `D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\visitor-core\src\audio\preview.ts`.

```typescript
/** FILE NÀY LÀM GÌ: Điều khiển nghe thử Admin, giữ player khi pause/resume.
 * AudioPreview native dùng; test Node dùng Track giả. UC07/UC14.
 * Phụ thuộc hợp đồng Track; không tự tạo âm thanh hoặc đồng hồ giả.
 */
import type { Track } from '../journey/journey'
export type PreviewState = {
  status: 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error'
  position: number; duration: number
}
export class PreviewController {
  private state: PreviewState = { status: 'idle', position: 0, duration: 0 }
  private track?: Track
  private unlisten?: () => void
  private generation = 0
  private wantsPlay = false
  private pending = false
  private listeners = new Set<() => void>()
  constructor(private open: () => Promise<Track>) {}
  snapshot = () => this.state
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener) } }
  private set(next: Partial<PreviewState>) { this.state = { ...this.state, ...next }; this.listeners.forEach(listener => listener()) }
  async play(): Promise<void> {
    if (this.pending || this.state.status === 'playing') return
    const generation = this.generation
    this.wantsPlay = true; this.pending = true
    const ended = this.state.status === 'ended'
    this.set({ status: 'loading' })
    let current = this.track
    try {
      if (!current) {
        current = await this.open()
        // CHỨC NĂNG: Rời màn/đổi ngôn ngữ trong lúc tải không được phát nguồn đến muộn.
        if (generation !== this.generation) { current.dispose(); return }
        this.track = current
        this.set({ duration: current.duration })
        const opened = current
        this.unlisten = current.listen(status => {
          if (this.track !== opened) return
          if (status.error) {
            this.wantsPlay = false; this.unlisten?.(); this.unlisten = undefined
            this.track = undefined; opened.dispose(); this.set({ status: 'error' }); return
          }
          if (status.ended) this.wantsPlay = false
          this.set({ position: status.position, duration: status.duration,
            status: status.ended ? 'ended' : status.playing ? 'playing' : 'paused' })
        })
      }
      // CHỨC NĂNG: Chỉ nghe lại từ đầu khi bài đã kết thúc, không khi vừa tạm dừng.
      if (ended) await current.seek(0)
      if (generation !== this.generation || !this.wantsPlay) return
      await current.play()
      if (generation !== this.generation) return
      if (!this.wantsPlay) current.pause()
    } catch {
      if (generation === this.generation) {
        this.wantsPlay = false; this.unlisten?.(); this.unlisten = undefined
        this.track?.dispose(); this.track = undefined; this.set({ status: 'error' })
      }
    } finally {
      if (generation === this.generation) {
        this.pending = false
        if (this.state.status === 'loading') this.set({ status: this.wantsPlay ? 'playing' : 'paused' })
      }
    }
  }
  // CHỨC NĂNG: Pause không dispose, không mở URL lại và không seek(0).
  pause(): void { this.wantsPlay = false; this.track?.pause(); this.set({ status: 'paused' }) }
  close = (): void => {
    this.generation++; this.wantsPlay = false; this.pending = false
    this.unlisten?.(); this.unlisten = undefined; this.track?.dispose(); this.track = undefined
    this.set({ status: 'idle', position: 0, duration: 0 })
  }
}
/* CÁCH KIỂM TRA: Pause tại giây 12 rồi play vẫn giây 12, open chỉ gọi một lần;
 * close hủy nguồn tải chậm; play thất bại giải phóng player để thử lại sạch. */
```

## apps/mobile/src/components/admin/AdminUI.tsx

SỬA — AudioPreview dùng controller, pause/resume đúng giây, blur/unmount đóng nguồn.

Đường dẫn: `D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\components\admin\AdminUI.tsx`.

```tsx
/**
 * FILE NÀY LÀM GÌ: Bộ giao diện Admin mobile: khung, tiêu đề, trạng thái, trường nhập và thao tác nhanh.
 * Dashboard/Places/PlaceForm/ContentEditor/Reviews dùng; phụ thuộc token, Ionicons và admin-core.
 * UC12–UC17. Chỉ trình bày giao diện; lưu/duyệt/phiên vẫn do service hiện có xử lý.
 */
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ComponentProps, type ReactNode } from 'react'
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
import type { ManagedPlace } from '@travelguide/admin-core'
import { LANGUAGES, PreviewController, type Language } from '@travelguide/visitor-core'
import { Action } from '../Action'
import { colors, spacing } from '../../theme'
import { journeyAdapters } from '../../services/journeyAdapters'

type IconName = ComponentProps<typeof Ionicons>['name']
// CHỨC NĂNG: Tập trung style Admin, không sửa style của app du khách.
// XỬ LÝ: Dùng token chung; bố cục mềm và chữ có thể xuống dòng khi dịch dài.
export const styles = StyleSheet.create({
 page:{flex:1,backgroundColor:colors.page}, content:{padding:spacing.lg,gap:20,paddingBottom:32},
 card:{padding:spacing.lg,backgroundColor:colors.background,borderRadius:20,borderWidth:1,borderColor:colors.border,gap:12},
 title:{fontSize:26,lineHeight:34,fontWeight:'700',color:colors.text,letterSpacing:-0.5},
 heading:{fontSize:18,lineHeight:26,fontWeight:'700',color:colors.text},
 label:{fontSize:13,lineHeight:20,fontWeight:'600',color:colors.text},
 text:{fontSize:14,lineHeight:22,color:colors.text}, muted:{fontSize:12,lineHeight:19,color:colors.muted},
 notice:{padding:12,borderRadius:14,backgroundColor:colors.soft,flexDirection:'row',gap:8,alignItems:'flex-start'},
 error:{color:colors.danger,fontSize:13,lineHeight:21},
 feedback:{padding:12,borderRadius:14,backgroundColor:colors.background,borderWidth:1,borderColor:colors.border,gap:10},
 row:{flexDirection:'row',flexWrap:'wrap',gap:10,alignItems:'center'},
 input:{borderWidth:1,borderColor:colors.border,borderRadius:13,paddingHorizontal:14,paddingVertical:12,color:colors.text,backgroundColor:colors.background,minHeight:48,fontSize:14,lineHeight:21},
 inputFocused:{borderColor:colors.primary,backgroundColor:colors.soft},
 number:{fontSize:31,fontWeight:'700',lineHeight:42,color:colors.text},
 metric:{width:'47%',flexGrow:1,padding:16,backgroundColor:colors.background,borderRadius:20,borderWidth:1,borderColor:colors.border,gap:12},
 metricLabel:{fontSize:12,lineHeight:18,color:colors.muted,minHeight:36},
 metricIcon:{width:34,height:34,borderRadius:11,backgroundColor:colors.soft,alignItems:'center',justifyContent:'center'},
 badge:{alignSelf:'flex-start',paddingVertical:5,paddingHorizontal:10,backgroundColor:colors.soft,borderRadius:8,color:colors.primary,fontSize:11,fontWeight:'600'},
 hero:{backgroundColor:colors.playerBackground,borderRadius:24,padding:20,gap:12},
 brand:{fontSize:10,lineHeight:15,fontWeight:'700',letterSpacing:2,color:colors.playerAccent},
 heroTitle:{fontSize:27,lineHeight:35,fontWeight:'700',color:colors.white},
 heroText:{fontSize:12,lineHeight:20,color:colors.playerMuted},
 sectionHeading:{flexDirection:'row',alignItems:'center',gap:8},
 quickAction:{flexDirection:'row',alignItems:'center',gap:12,padding:16,backgroundColor:colors.background,borderWidth:1,borderColor:colors.border,borderRadius:18},
 quickIcon:{width:46,height:46,borderRadius:14,backgroundColor:colors.soft,alignItems:'center',justifyContent:'center'},
 languageChip:{minHeight:42,paddingHorizontal:14,justifyContent:'center',borderWidth:1,borderColor:colors.border,borderRadius:12,backgroundColor:colors.background},
 searchBox:{flexDirection:'row',alignItems:'center',gap:8,minHeight:50,borderWidth:1,borderColor:colors.border,borderRadius:15,paddingHorizontal:12,backgroundColor:colors.background},
 searchInput:{flex:1,minWidth:0,fontSize:14,color:colors.text,paddingVertical:12},
 listImage:{width:88,height:92,borderRadius:13,overflow:'hidden',flexShrink:0},
 divider:{height:1,backgroundColor:colors.border},
 pressed:{opacity:0.75},
})
// CHỨC NĂNG: Tiêu đề từng màn và tiêu đề từng nhóm dùng cùng nhịp chữ/khoảng cách.
export function PageHeader({title,description}:{title:string;description?:string}) {
 return <View style={{gap:6}}><Text style={styles.title}>{title}</Text>{description&&<Text style={styles.muted}>{description}</Text>}</View>
}
export function SectionHeading({title,icon}:{title:string;icon?:IconName}) {
 return <View style={styles.sectionHeading}>{icon&&<Ionicons name={icon} size={18} color={colors.primary}/>}<Text style={styles.heading}>{title}</Text></View>
}
export function QuickAction({title,description,icon,onPress}:{title:string;description:string;icon:IconName;onPress:()=>void}) {
 return <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress} style={({pressed})=>[styles.quickAction,pressed&&styles.pressed]}>
  <View style={styles.quickIcon}><Ionicons name={icon} size={23} color={colors.primary}/></View>
  <View style={{flex:1,gap:3}}><Text style={styles.label}>{title}</Text><Text style={styles.muted}>{description}</Text></View>
  <Ionicons name="chevron-forward" size={18} color={colors.muted}/>
 </Pressable>
}
// CHỨC NĂNG: Mỗi trạng thái có nhãn dịch và biểu tượng, không chỉ phân biệt bằng màu.
export function StatusBadge({workflow}:{workflow:ManagedPlace['workflow']}) {
 const t=useAdminText()
 const icons:Record<ManagedPlace['workflow'],IconName>={draft:'create-outline',submitted:'time-outline',changes:'alert-circle-outline',approved:'checkmark-circle-outline',published:'globe-outline',archived:'archive-outline'}
 const color=workflow==='changes'?colors.danger:workflow==='archived'?colors.muted:colors.primary
 return <View style={[styles.row,{alignSelf:'flex-start',gap:5,backgroundColor:colors.soft,paddingHorizontal:9,paddingVertical:5,borderRadius:9}]}>
  <Ionicons name={icons[workflow]} size={13} color={color}/><Text style={{fontSize:11,lineHeight:16,fontWeight:'600',color}}>{t(`status_${workflow}`)}</Text>
 </View>
}
export function LanguageTabs({value,onChange}:{value:Language;onChange:(language:Language)=>void}) {
 return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:8,paddingVertical:2}}>
  {LANGUAGES.map(language=><Pressable key={language.code} accessibilityRole="button" accessibilityLabel={language.label} accessibilityState={{selected:value===language.code}}
   onPress={()=>onChange(language.code)} style={[styles.languageChip,value===language.code&&{backgroundColor:colors.primary,borderColor:colors.primary}]}>
   <Text style={{fontSize:13,fontWeight:'600',color:value===language.code?colors.white:colors.muted}}>{language.label}</Text>
  </Pressable>)}
 </ScrollView>
}
export function DemoNotice() { const t=useAdminText();return <View style={styles.notice}><Ionicons name="information-circle-outline" size={17} color={colors.primary}/><Text style={[styles.muted,{flex:1}]}>{t('demo')}</Text></View> }
// CHỨC NĂNG: Biểu mẫu tránh bàn phím che nội dung; thông báo dữ liệu nằm cuối trang.
export function Frame({children}:{children:ReactNode}) {
 return <SafeAreaView style={styles.page} edges={['left','right','bottom']}><KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':undefined} keyboardVerticalOffset={88}>
  <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>{children}<DemoNotice/></ScrollView>
 </KeyboardAvoidingView></SafeAreaView>
}
export function Feedback({state}:{state:ReturnType<typeof useAdmin>}) {
 const t=useAdminText()
 return <>{state.loading&&<View style={styles.row}><ActivityIndicator color={colors.primary}/><Text style={styles.muted} accessibilityLiveRegion="polite">{t('loading')}</Text></View>}
 {state.error&&<View style={[styles.feedback,{borderColor:colors.danger}]}><Text style={styles.error} accessibilityRole="alert">{t(`error_${state.error}`)}</Text><Action title={t('retry')} icon="refresh-outline" onPress={()=>{void state.reload()}}/></View>}
 {state.success&&<View style={[styles.notice,{alignItems:'center'}]}><Ionicons name="checkmark-circle" size={18} color={colors.primary}/><Text style={styles.label}>{t('saved')}</Text></View>}</>
}
// CHỨC NĂNG: Trường nhập có nhãn và phản hồi focus, giữ nguyên giá trị/handler do form truyền.
export function Field({label,value,onChange,multiline=false,editable=true}:{label:string;value:string;onChange:(text:string)=>void;multiline?:boolean;editable?:boolean}) {
 const [focused,setFocused]=useState(false)
 return <View style={{gap:7}}><Text style={styles.label}>{label}</Text>
  <TextInput accessibilityLabel={label} style={[styles.input,multiline&&{minHeight:120,textAlignVertical:'top'},focused&&styles.inputFocused,!editable&&{backgroundColor:colors.page,color:colors.muted}]}
   value={value} editable={editable} onChangeText={onChange} multiline={multiline} autoCapitalize="none" onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}/>
 </View>
}
// CHỨC NĂNG: Thao tác xóa có màu cảnh báo riêng, vẫn do màn hình hỏi xác nhận.
export function DangerAction({title,onPress,disabled=false}:{title:string;onPress:()=>void;disabled?:boolean}) {
 return <Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityState={{disabled}} disabled={disabled} onPress={onPress}
  style={({pressed})=>[{minHeight:46,padding:12,borderRadius:13,borderWidth:1,borderColor:colors.danger,flexDirection:'row',justifyContent:'center',alignItems:'center',gap:8},(pressed||disabled)&&styles.pressed]}>
  <Ionicons name="trash-outline" size={18} color={colors.danger}/><Text style={[styles.label,{color:colors.danger,flexShrink:1,textAlign:'center'}]}>{title}</Text>
 </Pressable>
}
// CHỨC NĂNG: Hỏi trước khi back khỏi biểu mẫu chưa lưu, tránh mất nội dung.
export function useUnsaved(dirty:boolean) {
 const navigation=useNavigation(),t=useAdminText(),ref=useRef(dirty);ref.current=dirty
 useEffect(()=>navigation.addListener('beforeRemove',event=>{
  if(!ref.current)return
  event.preventDefault();Alert.alert(t('admin'),t('unsaved'),[{text:t('cancel'),style:'cancel'},{text:t('visitor'),onPress:()=>{ref.current=false;navigation.dispatch(event.data.action)}}])
 }),[navigation,t])
 return ()=>{ref.current=false}
}
// CHỨC NĂNG: Nghe thử giữ tiến độ; quyền phát chung nằm trong adapter, không ở từng màn.
export function AudioPreview({url,title}:{url:string;title:string}) {
 const t=useAdminText()
 // XỬ LÝ: Poll Admin không tạo lại controller khi URL và tên bài không đổi.
 const controller=useMemo(()=>new PreviewController(()=>journeyAdapters.open(url,title)),[url,title])
 const state=useSyncExternalStore(controller.subscribe,controller.snapshot,controller.snapshot)
 useEffect(()=>()=>controller.close(),[controller])
 // XỬ LÝ: Native-stack giữ màn phía dưới khi điều hướng; blur cũng phải đóng audio.
 useFocusEffect(useCallback(()=>()=>controller.close(),[controller]))
 const playing=state.status==='playing',busy=state.status==='loading'
 const resumed=state.status==='paused'
 const time=(value:number)=>Math.floor(value/60)+':'+Math.floor(value%60).toString().padStart(2,'0')
 return <View style={styles.card}>
  <Action title={busy?t('loading'):playing?t('previewPause'):resumed?t('previewResume'):t('preview')}
   icon={playing?'pause':'play'} disabled={busy} onPress={()=>{if(playing)controller.pause();else void controller.play()}}/>
  {state.duration>0&&<Text style={styles.muted}>{time(state.position)} / {time(state.duration)}</Text>}
  {state.status==='error'&&<Text style={styles.error}>{t('previewError')}</Text>}
 </View>
}
/* CÁCH KIỂM TRA: Pause/resume giữ giây; mở bài khác dừng bài trước;
 * rời màn/đổi ngôn ngữ đóng nguồn; nguồn tải muộn không tự phát. */
```

## apps/mobile/src/services/journeyAdapters.ts

SỬA — Adapter native dùng quyền phát chung với preview; giải phóng lock-screen đúng chủ.

Đường dẫn: `D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\services\journeyAdapters.ts`.

```typescript
/**
 * FILE NÀY LÀM GÌ: Kết nối audio/GPS/bộ nhớ riêng nền tảng vào JourneyProvider.
 * Vị trí: apps/mobile/src/services/journeyAdapters.ts. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { narrationKey, playbackCoordinator } from '@travelguide/visitor-core'
import { narrationAssets } from './narrationAssets'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppState } from 'react-native'
import * as Location from 'expo-location'
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio'
import type { JourneyAdapters } from '@travelguide/visitor-core/journey/react'
import type { Track } from '@travelguide/visitor-core/journey'
import vi from '../../assets/demo-audio/vi.mp3'
import en from '../../assets/demo-audio/en.mp3'
import cn from '../../assets/demo-audio/cn.mp3'
import pt from '../../assets/demo-audio/pt.mp3'
import ja from '../../assets/demo-audio/ja.mp3'

const demo: Record<string, number> = { vi, en, cn, pt, ja }

export const journeyAdapters: JourneyAdapters = {
  read: () => AsyncStorage.getItem('visitor-journey-v1'),
  write: value => value === null ? AsyncStorage.removeItem('visitor-journey-v1') : AsyncStorage.setItem('visitor-journey-v1', value),
  async watch(next, fail) {
    const permission = await Location.requestForegroundPermissionsAsync()
    if (permission.status !== 'granted') throw new Error('GPS denied')
    let stopped = false, generation = 0
    let subscription: Location.LocationSubscription | undefined
    const start = async () => {
      const request = ++generation
      try {
        const result = await Location.watchPositionAsync({ accuracy: Location.Accuracy.High, timeInterval: 3000, distanceInterval: 5 }, p => {
          if (!stopped && request === generation) next({ lat: p.coords.latitude, lng: p.coords.longitude,
            accuracy: p.coords.accuracy ?? Infinity, timestamp: p.timestamp })
        })
        if (stopped || request !== generation) result.remove(); else subscription = result
      } catch { if (!stopped) fail() }
    }
    const listener = AppState.addEventListener('change', state => {
      generation++; subscription?.remove(); subscription = undefined
      if (state === 'active' && !stopped) void start()
    })
    if (AppState.currentState === 'active') await start()
    return () => { stopped = true; generation++; listener.remove(); subscription?.remove() }
  },
  async open(url, title): Promise<Track> {
    await setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: true, interruptionMode: 'doNotMix' })
    // CHỨC NĂNG: Đọc asset cùng bài với web; bản Admin vừa tạo tải từ API RAM.
    // XỬ LÝ: Không dùng localhost của điện thoại; URL lấy từ cấu hình nền tảng.
    const key = narrationKey(url)
    const admin = process.env.EXPO_PUBLIC_APP_TARGET === 'admin'
    const base = admin ? process.env.EXPO_PUBLIC_ADMIN_API_URL : process.env.EXPO_PUBLIC_CATALOG_API_URL
    if (url.startsWith('narration:') && !key) throw new Error('Invalid narration key')
    const source = key ? narrationAssets[key] ?? (base ? base.replace(/\/$/, '') + '/audio/' + (admin ? 'preview/' : 'published/') + key + '.mp3' : undefined)
      : url.startsWith('demo:') ? demo[url.slice(5)] : url
    if (!source) throw new Error('Missing audio')
    const player = createAudioPlayer(source, { updateInterval: 250 })
    try {
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => { listener.remove(); reject(new Error('Audio timeout')) }, 20000)
        const listener = player.addListener('playbackStatusUpdate', status => {
          if (status.error || status.isLoaded) { clearTimeout(timer); listener.remove(); if (status.error) reject(new Error(status.error)); else resolve() }
        })
        if (player.isLoaded) { clearTimeout(timer); listener.remove(); resolve() }
      })
    } catch (error) { player.remove(); throw error }
    let disposed = false
    const owner = { pause: () => { if (!disposed) player.pause() } }
    return {
      duration: player.duration,
      // CHỨC NĂNG: Cả preview và bài du khách tranh quyền qua cùng coordinator.
      play: async () => {
        if (disposed) throw new Error('Audio closed')
        playbackCoordinator.claim(owner)
        try { player.setActiveForLockScreen(true, { title }); player.play() }
        catch (error) { playbackCoordinator.release(owner); throw error }
      },
      pause: () => player.pause(), seek: seconds => player.seekTo(seconds), rate: value => player.setPlaybackRate(value),
      listen: callback => {
        const listener = player.addListener('playbackStatusUpdate', s => callback({ position: s.currentTime,
          duration: s.duration, playing: s.playing, ended: s.didJustFinish, error: Boolean(s.error) }))
        return () => listener.remove()
      },
      dispose: () => {
        if (!disposed) {
          const owns = playbackCoordinator.owns(owner)
          disposed = true; playbackCoordinator.release(owner)
          if (owns) player.setActiveForLockScreen(false)
          player.remove()
        }
      },
    }
  },
}
```

## apps/web/src/services/journeyAdapters.ts

SỬA — Quyền phát chung, chặn play đến muộn làm chồng tiếng.

Đường dẫn: `D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\services\journeyAdapters.ts`.

```typescript
/**
 * FILE NÀY LÀM GÌ: Kết nối audio/GPS/bộ nhớ riêng nền tảng vào JourneyProvider.
 * Vị trí: apps/web/src/services/journeyAdapters.ts. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { playbackCoordinator } from '@travelguide/visitor-core'
import type { JourneyAdapters } from '@travelguide/visitor-core/journey/react'
import { narrationSource } from './narrationSource'
import type { Track } from '@travelguide/visitor-core/journey'

let mediaOwner: HTMLAudioElement | undefined

export const journeyAdapters: JourneyAdapters = {
  read: async () => localStorage.getItem('visitor-journey-v1'),
  write: async value => { if (value === null) localStorage.removeItem('visitor-journey-v1'); else localStorage.setItem('visitor-journey-v1', value) },
  async watch(next, fail) {
    if (!navigator.geolocation) throw new Error('GPS unavailable')
    const id = navigator.geolocation.watchPosition(p => next({ lat: p.coords.latitude, lng: p.coords.longitude,
      accuracy: p.coords.accuracy, timestamp: p.timestamp }), fail, { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 })
    return () => navigator.geolocation.clearWatch(id)
  },
  async open(url, title): Promise<Track> {
    const audio = new Audio(narrationSource(url))
    audio.preload = 'auto'
    try {
      // CHỨC NĂNG: Chờ metadata để thời lượng và thanh tua lấy từ file thật.
      // XỬ LÝ: Lỗi nguồn và timeout được trả về controller để cho thử lại.
      await new Promise<void>((resolve, reject) => {
        const done = () => { clearTimeout(timer); audio.removeEventListener('loadedmetadata', ready); audio.removeEventListener('error', bad) }
        const ready = () => { done(); resolve() }
        const bad = () => { done(); reject(new Error('Audio unavailable')) }
        const timer = setTimeout(bad, 20000)
        audio.addEventListener('loadedmetadata', ready)
        audio.addEventListener('error', bad)
        audio.load()
      })
    } catch (error) { audio.removeAttribute('src'); audio.load(); throw error }
    let disposed = false
    const owner = { pause: () => audio.pause() }
    const track: Track = {
      duration: audio.duration,
      play: async () => {
        if (disposed) throw new Error('Audio closed')
        playbackCoordinator.claim(owner)
        try { await audio.play() } catch (error) { playbackCoordinator.release(owner); throw error }
        // XỬ LÝ: Một bài khác có thể được bật khi lời gọi play còn đang chờ.
        if (disposed || !playbackCoordinator.owns(owner)) { audio.pause(); return }
        if ('mediaSession' in navigator) {
          mediaOwner = audio
          navigator.mediaSession.metadata = new MediaMetadata({ title })
          navigator.mediaSession.setActionHandler('play', () => { void track.play().catch(() => audio.dispatchEvent(new Event('error'))) })
          navigator.mediaSession.setActionHandler('pause', () => audio.pause())
          navigator.mediaSession.setActionHandler('seekto', d => { if (d.seekTime !== undefined) audio.currentTime = d.seekTime })
        }
      },
      pause: () => audio.pause(),
      seek: async value => { audio.currentTime = value },
      rate: value => { audio.playbackRate = value },
      listen: callback => {
        const report = () => callback({ position: audio.currentTime, duration: audio.duration, playing: !audio.paused, ended: audio.ended, error: Boolean(audio.error) })
        const events = ['timeupdate', 'play', 'pause', 'ended', 'seeked', 'error']
        events.forEach(event => audio.addEventListener(event, report))
        return () => events.forEach(event => audio.removeEventListener(event, report))
      },
      dispose: () => {
        if (disposed) return
        disposed = true; playbackCoordinator.release(owner); audio.pause(); audio.removeAttribute('src'); audio.load()
        if ('mediaSession' in navigator && mediaOwner === audio) for (const action of ['play', 'pause', 'seekto'] as const) navigator.mediaSession.setActionHandler(action, null)
      },
    }
    return track
  },
}
```

## apps/web/src/components/admin/AudioPreview.tsx

TẠO MỚI — Thẻ HTML audio ổn định, giữ currentTime, dừng khi đổi bài/rời màn.

Đường dẫn: `D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\components\admin\AudioPreview.tsx`.

```tsx
/** FILE NÀY LÀM GÌ: Nghe thử bản biên tập/kiểm duyệt bằng cùng HTML audio.
 * ContentEditorPage và ReviewsPage dùng; phụ thuộc resolver và coordinator chung.
 * UC14/UC15: pause giữ currentTime, resume không thay src hoặc tạo audio mới.
 */
import { useEffect, useRef } from 'react'
import { playbackCoordinator } from '@travelguide/visitor-core'
import { narrationSource } from '../../services/narrationSource'
export function AudioPreview({url}:{url:string}) {
  const ref=useRef<HTMLAudioElement>(null)
  useEffect(()=>{
    const audio=ref.current
    if(!audio)return
    // CHỨC NĂNG: Rời màn/đổi bài dừng và nhả nguồn đang nghe thử.
    return()=>{audio.pause();playbackCoordinator.release(audio)}
  },[url])
  return <audio ref={ref} controls preload="metadata" src={narrationSource(url,true)} onPlay={event=>{
    // XỬ LÝ: Bao gồm cả audio du khách do adapter tạo, không chỉ thẻ trong DOM.
    playbackCoordinator.claim(event.currentTarget)
  }} />
}
/* CÁCH KIỂM TRA: Pause tại 0:12, resume từ 0:12; bật bản khác làm bản trước pause. */
```

## apps/web/src/pages/admin/ContentEditorPage.tsx

SỬA — Dùng component nghe thử chung; bỏ khung nguồn nội dung.

Đường dẫn: `D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\pages\admin\ContentEditorPage.tsx`.

```tsx
/** FILE NÀY LÀM GÌ: Biên tập năm ngôn ngữ, bản thu URL, dịch/TTS demo và gửi duyệt.
 * /admin/places/:id/content; UC14/14.1/14.2. Không gửi API key hoặc gọi dịch thật.
 * Mỗi bản form giữ expectedRevision; service chặn kết quả dịch cũ ghi đè bản mới. */
import { AudioPreview } from '../../components/admin/AudioPreview'
import { AdminIcon } from '../../components/admin/AdminIcon'
import { LocalMediaPicker } from '../../components/admin/LocalMediaPicker'
import { useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { LANGUAGES } from '@travelguide/visitor-core'
import type { Language } from '@travelguide/visitor-core'
import type { ManagedPlace } from '@travelguide/admin-core'
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
import { Feedback, Field, Status, useUnsaved } from '../../components/admin/AdminUI'
export function ContentEditorPage() {
 const state = useAdmin(), t = useAdminText(), { id } = useParams()
 const [language,setLanguage] = useState<Language>('vi'), [dirty,setDirty] = useState(false)
 const fresh = state.data?.places.find(p => p.id === id)
 const snapshot = useRef<ManagedPlace | undefined>(undefined)
 // CHỨC NĂNG: Poll từ máy khác không xóa nội dung chưa lưu.
 if (!dirty || snapshot.current?.id !== id) snapshot.current = fresh
 const place = dirty ? snapshot.current : fresh
 if (state.loading || !place) return <><Feedback state={state} />{!state.loading && <p>{t('error_notFound')}</p>}</>
 return <><div className="admin-page-title"><div><h1>{place.record.canonicalTitle}</h1><p>{t('editorHint')} · {t('revision')}: {place.revision}</p></div><Status value={place.workflow} /></div>
  <p className="admin-demo">{t('mockMedia')}</p>
  <div className="admin-language-tabs">{LANGUAGES.map(l => <button key={l.code} className={language === l.code ? '' : 'secondary'} aria-pressed={language === l.code} onClick={() => { if(!dirty || window.confirm(t('unsaved'))) { setDirty(false); setLanguage(l.code) } }}>{l.label}</button>)}</div>
  <ContentForm key={place.id + language + place.revision} place={place} language={language} dirty={dirty} setDirty={setDirty} />
 </>
}
function ContentForm({ place, language, dirty, setDirty }: { place: ManagedPlace; language: Language; dirty: boolean; setDirty: (value: boolean) => void }) {
 const state = useAdmin(), t = useAdminText(), text = place.record.content[language]
 const [title,setTitle] = useState(text?.title ?? ''), [summary,setSummary] = useState(text?.summary ?? '')
 const [body,setBody] = useState(text?.body ?? ''), [address,setAddress] = useState(text?.address ?? '')
 const [audioUrl,setAudioUrl] = useState(text?.audio?.url.startsWith('demo:') || text?.audio?.url.startsWith('narration:') ? '' : text?.audio?.url ?? '')
 useUnsaved(dirty)
 const disabled = state.busy || place.workflow === 'archived'
 return <><Feedback state={state} /><form className="admin-card admin-form" onChange={() => setDirty(true)} onSubmit={event => {
  event.preventDefault(); void state.run(() => state.service.saveContent({ id: place.id, language, expectedRevision: place.revision, title, summary, body, address, audioUrl: audioUrl.trim() || undefined })).then(ok => { if(ok) setDirty(false) })
 }}>
  {/* CHỨC NĂNG: Tách nội dung và âm thanh để người biên tập không bỏ sót bước lưu. */}
  <section className="admin-form-section"><h2><AdminIcon name="content"/>{t('basicInfo')}</h2>
  <Field label={t('title')}><input value={title} required onChange={e => setTitle(e.target.value)} /></Field>
  <Field label={t('summary')}><textarea value={summary} rows={2} onChange={e => setSummary(e.target.value)} /></Field>
  <Field label={t('address')}><input value={address} onChange={e => setAddress(e.target.value)} /></Field>
  <Field label={t('body')}><textarea value={body} required rows={10} onChange={e => setBody(e.target.value)} /></Field>
  </section>
  <section className="admin-form-section"><h2><AdminIcon name="image"/>{t('mediaSection')}</h2>
  <Field label={t('audio')}><input value={audioUrl.startsWith('data:') ? t('localFile') : audioUrl} readOnly={audioUrl.startsWith('data:')} onChange={e => setAudioUrl(e.target.value)} placeholder="https://…/audio.mp3" /></Field>
  <LocalMediaPicker kind="audio" onPick={value => { setAudioUrl(value);setDirty(true) }} />
  {audioUrl.startsWith('data:') && <button type="button" className="secondary" onClick={()=>{setAudioUrl('');setDirty(true)}}>{t('clearFile')}</button>}
  {text?.audio && <div className="admin-audio"><span>{t('preview')}</span><AudioPreview url={text.audio.url} /></div>}
  </section>
  <section className="admin-form-section"><h2><AdminIcon name="save"/>{t('workflowSection')}</h2>
  <div className="admin-actions"><button disabled={disabled}>{t('save')}</button>
   <button type="button" className="secondary" disabled={disabled || dirty || language === 'vi'} onClick={() => { void state.run(() => state.service.translate(place.id, language, place.revision)) }}>{t('translate')}</button>
   <button type="button" className="secondary" disabled={disabled || dirty || !text?.body} onClick={() => { void state.run(() => state.service.generateAudio(place.id, language, place.revision)) }}>{t('prepare')}</button>
   <button type="button" className="secondary" disabled={disabled || dirty || !['draft','changes'].includes(place.workflow)} onClick={() => { void state.run(() => state.service.submit(place.id, place.revision)) }}>{t('submit')}</button>
  </div>
  {place.reviewNote && <p className="admin-note">{t('note')}: {place.reviewNote}</p>}
 </section></form></>
}
/* CÁCH KIỂM TRA: Lưu trước khi dịch/tạo audio; đổi tab khi bẩn có hỏi; sửa body xóa audio cũ. */
```

## apps/web/src/pages/admin/ReviewsPage.tsx

SỬA — Dùng cùng component nghe thử và coordinator, không có hai bộ luật riêng.

Đường dẫn: `D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\pages\admin\ReviewsPage.tsx`.

```tsx
/** FILE NÀY LÀM GÌ: So sánh văn bản/audio, yêu cầu sửa, duyệt và công bố đúng bản.
 * /admin/reviews; UC15–UC16. Backend tương lai phải kiểm tra lại mọi điều kiện.
 * Chỉ service đổi public; UI không tự gán status=published hoặc ngày duyệt. */
import { AdminIcon } from '../../components/admin/AdminIcon'
import { PlaceImage } from '../../components/PlaceImage'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { LANGUAGES } from '@travelguide/visitor-core'
import type { ManagedPlace } from '@travelguide/admin-core'
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
import { Feedback, Status, Field, useConfirmation } from '../../components/admin/AdminUI'
import { AudioPreview } from '../../components/admin/AudioPreview'
export function ReviewsPage() {
 const state = useAdmin(), t = useAdminText()
 const places = state.data?.places.filter(p => ['submitted','approved','changes'].includes(p.workflow)) ?? []
 return <><div className="admin-page-title"><div><h1>{t('reviews')}</h1><p>{t('reviewQueueHint')}</p></div><span className="admin-pill">{places.length} {t('reviews')}</span></div><Feedback state={state} />
  {!state.loading && !places.length && <div className="admin-card admin-empty"><AdminIcon name="review"/><h2>{t('empty')}</h2></div>}
  {places.map(place => <ReviewCard key={place.id + place.revision + place.workflow} place={place} />)}
 </>
}
function ReviewCard({ place }: { place: ManagedPlace }) {
 const state = useAdmin(), t = useAdminText(), [note,setNote] = useState(''), confirmation = useConfirmation()
 return <article className="admin-card admin-review">{/* CHỨC NĂNG: Nhận diện đúng di tích trước khi đọc, duyệt hoặc công bố. */}<div className="admin-review-identity"><PlaceImage uri={place.record.images[0]} title={place.record.canonicalTitle}/><div><h2>{place.record.canonicalTitle}</h2><Status value={place.workflow}/></div></div>
  <p className="admin-review-meta">{t('revision')}: {place.revision} · {t('current')}: {place.published?.content.vi?.version ?? t('none')}</p>
  <div className="admin-review-grid">{LANGUAGES.map(l => { const text = place.record.content[l.code]; return text ? <section key={l.code}><h3>{l.label} · {text.title}</h3><p className="admin-body">{text.body}</p>{text.audio && <AudioPreview url={text.audio.url} />}</section> : null })}</div>
  <Field label={t('note')}><textarea rows={2} value={note} onChange={e => setNote(e.target.value)} /></Field>
  {place.reviewNote && <p>{place.reviewNote}</p>}
  <div className="admin-actions"><Link className="button secondary" to={'/admin/places/' + place.id + '/content'}>{t('content')}</Link>
   {place.workflow === 'submitted' && <><button disabled={state.busy} onClick={() => { void state.run(() => state.service.review(place.id, place.revision, true, note)) }}>{t('approve')}</button><button className="secondary" disabled={state.busy || !note.trim()} onClick={() => { void state.run(() => state.service.review(place.id, place.revision, false, note)) }}>{t('reject')}</button></>}
   {place.workflow === 'approved' && <button disabled={state.busy} onClick={() => { confirmation.ask(t('confirmPublish'), () => { void state.run(() => state.service.publish(place.id, place.revision)) }) }}>{t('publish')}</button>}
  </div>
 {confirmation.dialog}</article>
}
/* CÁCH KIỂM TRA: Reject thiếu ghi chú bị khóa; approve không tự public; publish cần xác nhận. */
```

## apps/mobile/src/screens/admin/ContentEditorScreen.tsx

SỬA — Bỏ khung nguồn nội dung; dùng AudioPreview native đã sửa.

Đường dẫn: `D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\screens\admin\ContentEditorScreen.tsx`.

```tsx
/** FILE NÀY LÀM GÌ: Biên tập 5 ngôn ngữ native, audio URL và dịch/TTS demo.
 * AdminNavigator gọi; UC14/14.1/14.2. Dùng cùng service với web.
 * Form chưa lưu không được gửi duyệt/tạo tác vụ để tránh dùng văn bản cũ. */
import { LocalMediaPicker } from '../../components/admin/LocalMediaPicker'
import { useState, useRef } from 'react'
import { Alert,Text,View } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { LANGUAGES } from '@travelguide/visitor-core'
import type { Language } from '@travelguide/visitor-core'
import type { ManagedPlace } from '@travelguide/admin-core'
import { useAdmin,useAdminText } from '@travelguide/admin-core/react'
import type { AdminStack } from '../../navigation/adminTypes'
import { Action } from '../../components/Action'
import { Frame,Field,Feedback,PageHeader,SectionHeading,StatusBadge,LanguageTabs,styles,useUnsaved,AudioPreview } from '../../components/admin/AdminUI'
export function ContentEditorScreen({route}:NativeStackScreenProps<AdminStack,'Content'>){
 const state=useAdmin(),t=useAdminText(),[language,setLanguage]=useState<Language>('vi'),[dirty,setDirty]=useState(false)
 const fresh=state.data?.places.find(p=>p.id===route.params.id)
 const snapshot=useRef<ManagedPlace|undefined>(undefined)
 // CHỨC NĂNG: Giữ bản đang gõ; server sẽ báo conflict nếu revision bị thay đổi.
 if(!dirty||snapshot.current?.id!==route.params.id)snapshot.current=fresh
 const place=dirty?snapshot.current:fresh
 if(!place)return <Frame><Feedback state={state}/>{!state.loading&&<Text>{t('error_notFound')}</Text>}</Frame>
 const select=(code:Language)=>{const apply=()=>{setDirty(false);setLanguage(code)};if(!dirty)apply();else Alert.alert(t('admin'),t('unsaved'),[{text:t('cancel'),style:'cancel'},{text:LANGUAGES.find(l=>l.code===code)?.label,onPress:apply}])}
 return <Frame><PageHeader title={place.record.canonicalTitle} description={t('editorHint')}/>
  <View style={styles.row}><StatusBadge workflow={place.workflow}/><Text style={styles.muted}>{t('revision')} {place.revision}</Text></View>
  <LanguageTabs value={language} onChange={select}/>
  <View style={styles.notice}><Text style={[styles.muted,{flex:1}]}>{t('mockMedia')}</Text></View>
  <ContentForm key={place.id+language+place.revision} place={place} language={language} dirty={dirty} setDirty={setDirty}/>
 </Frame>
}
function ContentForm({place,language,dirty,setDirty}:{place:ManagedPlace;language:Language;dirty:boolean;setDirty:(v:boolean)=>void}){
 const state=useAdmin(),t=useAdminText(),text=place.record.content[language]
 const [title,setTitle]=useState(text?.title??''),[summary,setSummary]=useState(text?.summary??''),[body,setBody]=useState(text?.body??''),[address,setAddress]=useState(text?.address??'')
 const [audioUrl,setAudioUrl]=useState(text?.audio?.url.startsWith('demo:')||text?.audio?.url.startsWith('narration:')?'':text?.audio?.url??'')
 useUnsaved(dirty)
 const change=(setter:(s:string)=>void)=>(s:string)=>{setDirty(true);setter(s)},disabled=state.busy||place.workflow==='archived'
 return <View style={{gap:16}}><Feedback state={state}/>
  <View style={styles.card}><SectionHeading title={t('basicInfo')} icon="document-text-outline"/>
  <Field label={t('title')} value={title} onChange={change(setTitle)}/><Field label={t('summary')} value={summary} onChange={change(setSummary)} multiline/>
  <Field label={t('address')} value={address} onChange={change(setAddress)}/><Field label={t('body')} value={body} onChange={change(setBody)} multiline/>
  </View>
  <View style={styles.card}><SectionHeading title={t('mediaSection')} icon="musical-notes-outline"/>
  <Field label={t('audio')} value={audioUrl.startsWith('data:')?t('localFile'):audioUrl} editable={!audioUrl.startsWith('data:')} onChange={change(setAudioUrl)}/>
  <LocalMediaPicker kind="audio" onPick={value=>{setAudioUrl(value);setDirty(true)}}/>
  {audioUrl.startsWith('data:')&&<Action title={t('clearFile')} onPress={()=>{setAudioUrl('');setDirty(true)}}/>}
  {text?.audio&&<AudioPreview url={text.audio.url} title={text.title}/>}
  </View>
  <View style={styles.card}><SectionHeading title={t('workflowSection')} icon="layers-outline"/>
  <Action title={t('save')} icon="save-outline" variant="primary" disabled={disabled} onPress={()=>{void state.run(()=>state.service.saveContent({id:place.id,language,expectedRevision:place.revision,title,summary,address,body,audioUrl:audioUrl.trim()||undefined})).then(ok=>{if(ok)setDirty(false)})}}/>
  <Action title={t('translate')} disabled={disabled||dirty||language==='vi'} onPress={()=>{void state.run(()=>state.service.translate(place.id,language,place.revision))}}/>
  <Action title={t('prepare')} disabled={disabled||dirty||!text?.body} onPress={()=>{void state.run(()=>state.service.generateAudio(place.id,language,place.revision))}}/>
  <Action title={t('submit')} icon="paper-plane-outline" disabled={disabled||dirty||!['draft','changes'].includes(place.workflow)} onPress={()=>{void state.run(()=>state.service.submit(place.id,place.revision))}}/>
  {!!place.reviewNote&&<Text style={styles.text}>{place.reviewNote}</Text>}
  </View>
 </View>
}
/* CÁCH KIỂM TRA: Lưu body mới bỏ audio cũ; tác vụ sai revision báo conflict, không ghi đè. */
```

## apps/mobile/src/screens/DetailScreen.tsx

SỬA — Bỏ nguồn nội dung, hiển thị tọa độ bản đồ đã có dù chưa khảo sát GPS.

Đường dẫn: `D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\screens\DetailScreen.tsx`.

```tsx
/**
 * FILE NÀY LÀM GÌ: Hiển thị bài đọc đúng ngôn ngữ, nút nghe và nút mở bản đồ của địa điểm.
 * Vị trí: apps/mobile/src/screens/DetailScreen.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */
import { PLACE_PHOTOS } from '@travelguide/visitor-core'


import { ListenButton } from '../components/ListenButton'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { availableLanguages, LANGUAGES, publishedText, validPoint } from '@travelguide/visitor-core'
import { usePublishedPlace } from '../hooks/usePlaces'
import { useText } from '../i18n/index'
import { useVisitor } from '../hooks/useVisitor'
import { Action, DemoNotice, LanguageBar, PlaceImage, State, ui } from '../components/index'
import type { VisitorStack } from '../navigation/types'

// CHỨC NĂNG: Tải đúng địa điểm theo tham số điều hướng.
// XỬ LÝ: ID sai, lỗi tải và thiếu bản ngôn ngữ được xử lý riêng.
export default function DetailScreen({
  route,
  navigation,
}: NativeStackScreenProps<
  VisitorStack,
  'Detail'
>) {
  const { placeId } = route.params

  const data = usePublishedPlace(placeId)

  const {
    language,
    changeLanguage,
    saving,
  } = useVisitor()

  const t = useText()

  // CHỨC NĂNG: Quay về danh sách.
  // XỬ LÝ: Hoạt động cả khi mở chi tiết từ QR.
  const back = () => {
    navigation.navigate('Places')
  }

  if (data.loading) {
    return (
      <State
        message="loading"
        busy
      />
    )
  }

  if (data.error || !data.place) {
    return (
      <State
        message={data.error ?? 'notFound'}
        retry={data.retry}
        back={back}
      />
    )
  }

  const place = data.place

  // CHỨC NĂNG: Chọn bài đọc bằng ngôn ngữ đang dùng trên giao diện.
  // XỬ LÝ: Không giữ useState riêng cho ngôn ngữ bài đọc.
  // Khi provider đổi language, tiêu đề/tab/bài đọc cùng render lại.
  const content = publishedText(
    place,
    language,
  )

  return (
    <SafeAreaView
      style={ui.page}
      edges={['bottom', 'left', 'right']}
    >
      <ScrollView
        contentContainerStyle={ui.content}
      >
        <LanguageBar />

        <DemoNotice />

        <PlaceImage
          uri={place.images[0]}
          title={place.canonicalTitle}
        />

        {PLACE_PHOTOS[place.id]?.note?.[language] && <Text style={ui.muted}>{PLACE_PHOTOS[place.id].note?.[language]}</Text>}

        <Text style={ui.title}>
          {content?.title ?? place.canonicalTitle}
        </Text>
        {place.period && <Text style={ui.muted}>{place.period}</Text>}

        <Text style={ui.muted}>
          {t('available')}
        </Text>

        <ListenButton id={place.id} />
        <Action title={t('jMap')} icon="map-outline" onPress={() => navigation.navigate('Journey', { placeId: place.id })} />
        <View style={ui.row}>
          {availableLanguages(place).map(
            (code) => (
              <Action
                key={code}
                title={
                  LANGUAGES.find(
                    (item) =>
                      item.code === code,
                  )?.label ?? code
                }
                selected={language === code}
                disabled={saving}
                onPress={() => {
                  // CHỨC NĂNG: Đổi ngôn ngữ cho toàn ứng dụng.
                  // XỬ LÝ: Provider cập nhật i18n và lưu AsyncStorage.
                  void changeLanguage(code)
                }}
              />
            ),
          )}
        </View>

        {content ? (
          <View style={ui.card}>
            <Text style={ui.muted}>
              {content.address}
            </Text>

            <Text style={ui.heading}>
              {t('read')}
            </Text>

            <Text style={ui.text}>
              {content.body}
            </Text>

            <Text style={ui.muted}>
              {t('version')}: {content.version}
            </Text>
          </View>
        ) : (
          <State message="missing" />
        )}


        <Text style={ui.muted}>
          {place.position && validPoint(place.position)
            ? (
              t(place.position.verified ? 'coordinates' : 'mapCoordinates')
              + ': '
              + place.position.lat
              + ', '
              + place.position.lng
            )
            : t('unverified')}
        </Text>

        <Action
          title={t('back')}
          onPress={back}
        />
      </ScrollView>
    </SafeAreaView>
  )
}
```

## apps/web/src/pages/DetailPage.tsx

SỬA — Cùng quy tắc hiển thị nguồn/tọa độ với mobile.

Đường dẫn: `D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\pages\DetailPage.tsx`.

```tsx
/**
 * FILE NÀY LÀM GÌ: Trang bài đọc, đổi ngôn ngữ, nghe thuyết minh và mở marker địa điểm.
 * Vị trí: apps/web/src/pages/DetailPage.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */
import { PLACE_PHOTOS } from '@travelguide/visitor-core'


import { ListenButton } from '../components/ListenButton'
import { Link, useParams } from 'react-router-dom'
import { availableLanguages, LANGUAGES, publishedText, validPoint } from '@travelguide/visitor-core'
import { usePublishedPlace } from '../hooks/usePlaces'
import { useText } from '../i18n/index'
import { useVisitor } from '../hooks/useVisitor'
import { PlaceImage, State, Icon } from '../components/index'

// CHỨC NĂNG: Hiển thị chi tiết địa điểm theo route /places/:id.
// XỬ LÝ:
// - Tải dữ liệu thông qua hook và service.
// - Phân biệt đang tải, lỗi và không tìm thấy.
// - Không tạo QR tại trang chi tiết.
export function DetailPage() {
  const { id = '' } = useParams()

  const data = usePublishedPlace(id)

  const {
    language,
    changeLanguage,
    saving,
  } = useVisitor()

  const t = useText()

  // CHỨC NĂNG: Hiển thị trạng thái chờ dữ liệu.
  // XỬ LÝ: Chưa đọc place khi request chưa hoàn thành.
  if (data.loading) {
    return (
      <State
        message="loading"
        busy
      />
    )
  }

  // CHỨC NĂNG: Hiển thị lỗi hoặc địa điểm không tồn tại.
  // XỬ LÝ: Có nút thử lại và đường quay về danh sách.
  if (data.error || !data.place) {
    return (
      <section className="detail">
        <State
          message={
            data.error ?? 'notFound'
          }
          retry={data.retry}
        />

        <Link to="/places">
          {t('back')}
        </Link>
      </section>
    )
  }

  const place = data.place

  // CHỨC NĂNG: Lấy bài đọc bằng ngôn ngữ chung của giao diện.
  // XỬ LÝ:
  // - Không giữ lựa chọn ngôn ngữ riêng trong trang chi tiết.
  // - Đổi ngôn ngữ sẽ đổi cả UI và bài đọc.
  // - Thiếu bản công bố thì trả undefined để hiện thông báo.
  const content = publishedText(
    place,
    language,
  )

  const title =
    content?.title
    ?? place.canonicalTitle

  // CHỨC NĂNG: Chỉ liệt kê các bản ngôn ngữ đã công bố.
  // XỬ LÝ: Không cho chọn nội dung nháp hoặc chưa duyệt.
  const languages =
    availableLanguages(place)

  const position = place.position

  // CHỨC NĂNG: Kiểm tra tọa độ trước khi hiển thị.
  // XỬ LÝ: Cần cả trạng thái xác nhận và giá trị tọa độ hợp lệ.
  // Đoạn này không theo dõi GPS và không tự xác định địa điểm.
  const hasVerifiedPosition =
    position?.verified === true
    && validPoint(position)

  return (
    <article className="detail">
      <Link to="/places">
        {t('back')}
      </Link>

      <h1>{title}</h1>
      {place.period && <p>{place.period}</p>}

      <PlaceImage
        uri={place.images[0]}
        title={title}
      />

      {PLACE_PHOTOS[place.id]?.note?.[language] && <p className="photo-caption">{PLACE_PHOTOS[place.id].note?.[language]}</p>}
      <div className="detail-actions">
        <ListenButton id={place.id} />
        <Link className="button secondary" to={'/journey?placeId=' + place.id}><Icon name="pin" />{t('jMap')}</Link>
      </div>
      <p>{t('available')}</p>

      <div className="language-options">
        {languages.map((code) => {
          const label = LANGUAGES.find(
            (item) => item.code === code,
          )?.label ?? code

          return (
            <button
              key={code}
              type="button"
              aria-pressed={
                language === code
              }
              disabled={saving}
              onClick={() => {
                // CHỨC NĂNG: Đổi ngôn ngữ toàn website.
                // XỬ LÝ: Provider cập nhật i18n và lưu lựa chọn;
                // không chỉ đổi riêng bài đọc trên trang này.
                void changeLanguage(code)
              }}
            >
              {label}
            </button>
          )
        })}
      </div>

      {content ? (
        <section>
          <p>{content.address}</p>

          <h2>{t('read')}</h2>

          <p className="narration">
            {content.body}
          </p>

          <p>
            {t('version')}: {content.version}
          </p>
        </section>
      ) : (
        <State message="missing" />
      )}


      <p>
        {position && validPoint(position)
          ? (
            t(hasVerifiedPosition ? 'coordinates' : 'mapCoordinates')
            + ': '
            + position.lat
            + ', '
            + position.lng
          )
          : t('unverified')}
      </p>

      {/* CHỨC NĂNG: Chi tiết chỉ hiển thị thông tin địa điểm.
          XỬ LÝ: Không đặt QrImage tại đây.
          GPS được điều phối qua useJourneyNavigation; chi tiết không tự phát audio. */}
    </article>
  )
}
```

## packages/visitor-core/src/domain/model.ts

SỬA — Optional source/checkedAt của position, không đổi luật verified thực địa.

Đường dẫn: `D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\visitor-core\src\domain\model.ts`.

```typescript
/**
 * FILE NÀY LÀM GÌ:
 * Định nghĩa dữ liệu dùng chung cho UC01–UC11.
 * Service, hooks và các màn mobile/web sử dụng.
 * Không phụ thuộc React Native hoặc trình duyệt.
 */

// CHỨC NĂNG: Khai báo các ngôn ngữ được hỗ trợ.
// XỬ LÝ: Giữ cn làm mã nội bộ để tương thích lựa chọn đã lưu.
export const LANGUAGES = [
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'en', label: 'English' },
  { code: 'cn', label: '中文' },
  { code: 'pt', label: 'Português' },
  { code: 'ja', label: '日本語' },
] as const

export type Language = (typeof LANGUAGES)[number]['code']

// CHỨC NĂNG: Nhận diện ngôn ngữ từ bộ nhớ hoặc thiết bị.
// XỬ LÝ: zh-CN thành cn, pt_BR thành pt; không hỗ trợ trả null.
export function languageOf(
  value: string | null | undefined,
): Language | null {
  const base = value
    ?.toLowerCase()
    .replace(/_/g, '-')
    .split('-')[0]

  return base === 'zh'
    ? 'cn'
    : LANGUAGES.find((item) => item.code === base)?.code ?? null
}

// CHỨC NĂNG: Khai báo mã danh mục ổn định.
// XỬ LÝ: UI lấy tên qua i18n; không dùng tên tiếng Việt làm mã.
export const CATEGORIES = [
  'palace',
  'gate',
  'temple',
  'tomb',
  'museum',
  'monument',
] as const

export type Category = (typeof CATEGORIES)[number]

export type Zone = 'fortifications' | 'ceremonial'
export type SortOrder = 'name' | 'nearest'

export type Point = {
  lat: number
  lng: number
}

// CHỨC NĂNG: Mô tả một bản nội dung theo ngôn ngữ.
// XỬ LÝ: Service kiểm tra trạng thái duyệt/công bố trước khi trả cho khách.
// CHỨC NĂNG: Nguồn audio có phiên bản và trạng thái công bố riêng.
// XỬ LÝ: Optional trong PublishedText để dữ liệu UC01–UC11 cũ vẫn dùng được.
export type PublishedAudio = {
  id: string; url: string; version: number
  status: 'draft' | 'published'; approvedAt?: string; publishedAt?: string
}
// CHỨC NĂNG: Ghi nguồn để người đọc/Admin đối chiếu bài đã biên soạn.
// XỬ LÝ: Optional trong bản nội dung; không ép dữ liệu cũ phải có nguồn.
export type ContentSource = {
  title: string; url: string; accessedAt: string; license: string; licenseUrl: string
}
export type PublishedText = {
  sources?: readonly ContentSource[]
  adaptation?: 'rewritten-and-translated'

  audio?: PublishedAudio
  title: string
  summary: string
  body: string
  address: string
  version: number
  status: 'draft' | 'approved' | 'published'
  approvedAt?: string
  publishedAt?: string
}

// CHỨC NĂNG: Mô tả một địa điểm trong danh mục triển khai.
// XỬ LÝ: Các trường mới optional để dữ liệu cũ vẫn dùng được.
export type PlaceRecord = {
  id: string
  scope: string
  inLaunchCatalog: boolean
  status: 'draft' | 'published' | 'withdrawn'
  canonicalTitle: string
  zone: Zone
  images: string[]
  period?: string
  category?: Category
  featured?: boolean

  // CHỨC NĂNG: Phân biệt tọa độ đã xác nhận.
  // XỬ LÝ: Chỉ dùng verified=true để tính khoảng cách.
  position?: Point & {
    source?: string
    checkedAt?: string
    verified: boolean
  }

  // CHỨC NĂNG: Cho phép thiếu một số bản ngôn ngữ.
  // XỬ LÝ: Không tự dịch chưa duyệt để lấp bản thiếu.
  content: Partial<Record<Language, PublishedText>>
}

// CHỨC NĂNG: Đọc danh mục của dữ liệu mới hoặc dữ liệu cũ.
// XỬ LÝ: Thiếu category thì suy ra từ zone để tương thích ngược.
export function categoryOf(place: PlaceRecord): Category {
  return place.category
    ?? (place.zone === 'fortifications' ? 'gate' : 'palace')
}

export type CatalogSource =
  () => Promise<readonly PlaceRecord[]>

// CHỨC NĂNG: Tách logic ngôn ngữ khỏi công nghệ lưu trữ.
// XỬ LÝ: Mobile cung cấp AsyncStorage, web cung cấp localStorage.
export type StoragePort = {
  readLanguage: () => Promise<string | null>
  writeLanguage: (language: Language) => Promise<void>
}
```

## packages/visitor-core/src/data/mock.ts

SỬA — Seed Admin và du khách có tọa độ của tám công trình.

Đường dẫn: `D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\visitor-core\src\data\mock.ts`.

```typescript
/**
 * FILE NÀY LÀM GÌ:
 * Cung cấp tám di tích với bài lịch sử có nguồn Wikipedia và MP3 riêng.
 * demoCatalog được provider dùng mặc định.
 * Phụ thuộc model.ts và catalog.ts.
 *
 * Bài đã biên soạn lại và dịch; chưa phải bản do đơn vị di tích chứng nhận.
 * Không khai báo tọa độ suy đoán.
 */

import { MAP_POINTS } from '../journey/journey-data'
import { heritageText, HERITAGE_CONTENT } from './heritage'
import { PLACE_PHOTOS } from './photos'
import { createCatalog } from '../catalog/catalog'
import type { Language, PlaceRecord } from '../domain/model'

// CHỨC NĂNG: Tạo địa điểm từ những bản ngôn ngữ được khai báo.
// XỬ LÝ: Thiếu ngôn ngữ thì giữ thiếu, không tự dịch.
function make(
  id: string,
  zone: PlaceRecord['zone'],
  // CHỨC NĂNG: Bắt buộc dữ liệu demo khai báo đủ năm tên ngôn ngữ.
  // XỬ LÝ: Quên cn, pt hoặc ja sẽ được TypeScript báo ngay khi viết dữ liệu.
  names: Record<Language, string>,
): PlaceRecord {
  const content: PlaceRecord['content'] = {}

  for (const language of ['vi', 'en', 'cn', 'pt', 'ja'] as const) {
    const title = names[language]
    if (title) content[language] = heritageText(id, language, title)
  }

  return {
    id,
    scope: 'hue-citadel',
    inLaunchCatalog: true,
    status: 'published',
    canonicalTitle: names.vi ?? id,
    zone,
    images: [],
    // CHỨC NĂNG: Admin và du khách cùng có tọa độ của đúng công trình.
    // XỬ LÝ: Tâm OSM là vị trí trên bản đồ, không phải xác nhận GPS thực địa.
    position: MAP_POINTS[id] ? { lat: MAP_POINTS[id].lat, lng: MAP_POINTS[id].lng,
      verified: false, source: MAP_POINTS[id].source, checkedAt: '2026-10-24' } : undefined,
    content,
    period: HERITAGE_CONTENT.find(place => place.id === id)?.period,
  }
}

// CHỨC NĂNG: Cung cấp tám điểm minh họa đủ năm ngôn ngữ.
// XỬ LÝ: Hàm make lấy bài và MP3 tương ứng từ heritage.ts.
// Trường hợp API thiếu bản dịch được kiểm tra bằng dữ liệu riêng trong test.
export const MOCK_PLACES: PlaceRecord[] = [
  make('ky-dai', 'fortifications', {
    vi: 'Kỳ Đài',
    en: 'Flag Tower',
    cn: '旗台',
    pt: 'Torre da Bandeira',
    ja: '旗台',
  }),

  make('ngo-mon', 'fortifications', {
    vi: 'Ngọ Môn',
    en: 'Ngo Mon Gate',
    cn: '午门',
    pt: 'Porta Ngo Mon',
    ja: '午門',
  }),

  make('dien-thai-hoa', 'ceremonial', {
    vi: 'Điện Thái Hòa',
    en: 'Thai Hoa Palace',
    cn: '太和殿',
    pt: 'Palácio Thai Hoa',
    ja: '太和殿',
  }),

  make('the-mieu', 'ceremonial', {
    vi: 'Thế Miếu',
    en: 'The Mieu Temple',
    cn: '世庙',
    pt: 'Templo The Mieu',
    ja: '世廟',
  }),

  make('cung-dien-tho', 'ceremonial', {
    vi: 'Cung Diên Thọ',
    en: 'Dien Tho Palace',
    cn: '延寿宫',
    pt: 'Palácio Dien Tho',
    ja: '延寿宮',
  }),

  make('truong-sanh-cung', 'ceremonial', {
    vi: 'Trường Sanh Cung',
    en: 'Truong Sanh Palace',
    cn: '长生宫',
    pt: 'Palácio Truong Sanh',
    ja: '長生宮',
  }),

  make('dien-can-chanh', 'ceremonial', {
    vi: 'Điện Cần Chánh',
    en: 'Can Chanh Palace',
    cn: '勤政殿',
    pt: 'Palácio Can Chanh',
    ja: '勤政殿',
  }),

  make('hien-lam-cac', 'ceremonial', {
    vi: 'Hiển Lâm Các',
    en: 'Hien Lam Pavilion',
    cn: '显临阁',
    pt: 'Pavilhão Hien Lam',
    ja: '顕臨閣',
  }),
]

// CHỨC NĂNG: Gắn danh mục và trạng thái nổi bật.
// XỬ LÝ: Kỳ Đài không bị gọi là cổng thành;
// không thêm điểm ngoài phạm vi chỉ để đủ danh mục trong ảnh.
for (const place of MOCK_PLACES) {
  place.category =
    place.id === 'ky-dai' ? 'monument'
      : place.id === 'ngo-mon' ? 'gate'
        : place.id === 'the-mieu' || place.id === 'hien-lam-cac'
          ? 'temple'
          : 'palace'

  place.featured = [
    'ngo-mon',
    'dien-thai-hoa',
    'the-mieu',
    'cung-dien-tho',
  ].includes(place.id)
}

// CHỨC NĂNG: Mỗi địa điểm có ảnh riêng đã kiểm tra nguồn, không mượn ảnh điểm khác.
for (const place of MOCK_PLACES) {
  const photo = PLACE_PHOTOS[place.id]
  place.images = photo ? [photo.image] : []
}

// CHỨC NĂNG: Mô phỏng nguồn API bất đồng bộ.
// XỬ LÝ: Trả bản sao dữ liệu JSON để UI không sửa nguồn.
export async function loadMockCatalog(): Promise<PlaceRecord[]> {
  return JSON.parse(JSON.stringify(MOCK_PLACES)) as PlaceRecord[]
}

export const demoCatalog = createCatalog(loadMockCatalog)
```

## packages/visitor-core/src/journey/journey-data.ts

SỬA — Tâm OSM được đối chiếu lại; mapPointFor ưu tiên tọa độ từ API Admin.

Đường dẫn: `D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\visitor-core\src\journey\journey-data.ts`.

```typescript
/**
 * FILE NÀY LÀM GÌ: Cung cấp tọa độ tham khảo từ OpenStreetMap và tuyến minh họa.
 * JourneyProvider/map dùng; backend thật thay module này bằng service.
 * Nguồn: Overpass, đối chiếu API OSM 24/10/2026; center của hình công trình, chưa khảo sát điểm đón GPS.
 * Tuyến chưa được quản lý xác nhận nên không dùng làm chỉ đường nội bộ UC09/UC10.
 */
import { validPoint } from '../catalog/search'
import type { PlaceRecord } from '../domain/model'
import type { MapPoint, VisitRoute } from './journey'

// CHỨC NĂNG: Giữ nguồn của từng marker để người dùng kiểm tra tọa độ.
// XỬ LÝ: fieldVerified=false phân biệt dữ liệu bản đồ với khảo sát thực địa.
export const MAP_POINTS: Readonly<Record<string, MapPoint>> = {
  'ky-dai': { lat: 16.4663575, lng: 107.5802462, source: 'https://www.openstreetmap.org/way/218427614', fieldVerified: false },
  'ngo-mon': { lat: 16.4676824, lng: 107.5791834, source: 'https://www.openstreetmap.org/way/172657562', fieldVerified: false },
  'dien-thai-hoa': { lat: 16.4687434, lng: 107.5783867, source: 'https://www.openstreetmap.org/way/531031566', fieldVerified: false },
  'the-mieu': { lat: 16.4671614, lng: 107.5767398, source: 'https://www.openstreetmap.org/way/172657567', fieldVerified: false },
  'cung-dien-tho': { lat: 16.4688916, lng: 107.5754008, source: 'https://www.openstreetmap.org/way/172763420', fieldVerified: false },
  'truong-sanh-cung': { lat: 16.4697182, lng: 107.5746783, source: 'https://www.openstreetmap.org/way/172763427', fieldVerified: false },
  'dien-can-chanh': { lat: 16.4694768, lng: 107.5777963, source: 'https://www.openstreetmap.org/way/285990343', fieldVerified: false },
  'hien-lam-cac': { lat: 16.4667375, lng: 107.5770629, source: 'https://www.openstreetmap.org/way/172657564', fieldVerified: false },
}

export const VISIT_ROUTES: readonly VisitRoute[] = [{
  id: 'hue-preview',
  title: { vi: 'Thứ tự tham khảo Hoàng thành — chưa duyệt lối đi', en: 'Imperial City preview — walking paths pending approval',
    cn: '皇城参考顺序，步行路线待审核', pt: 'Ordem de visita da Cidade Imperial — percursos por aprovar', ja: '皇城の参考順序・歩行経路は未承認' },
  stops: ['ngo-mon', 'dien-thai-hoa', 'the-mieu', 'cung-dien-tho'],
  verified: false, available: true,
}]

/* CÁCH KIỂM TRA FILE NÀY CHẠY ĐÚNG:
 * - Mở từng source để đối chiếu marker OSM.
 * - Tuyến tham khảo phải hiển thị nhãn chưa duyệt, không vẽ lối đi giả.
 */

// CHỨC NĂNG: Map, GPS và chi tiết ưu tiên tọa độ đang công bố từ cùng record Admin.
// XỬ LÝ: Chỉ dùng marker mặc định khi API cũ chưa có position; không gán nguồn OSM
// cũ cho tọa độ Admin đã chỉnh sang chỗ khác.
export function mapPointFor(place: PlaceRecord): MapPoint | undefined {
  const fallback = MAP_POINTS[place.id], position = place.position
  if (!position || !validPoint(position)) return fallback
  const same = fallback && Math.abs(position.lat-fallback.lat)<0.000001 && Math.abs(position.lng-fallback.lng)<0.000001
  return { lat: position.lat, lng: position.lng, fieldVerified: position.verified,
    source: position.source ?? (same ? fallback.source : '') }
}
```

## packages/visitor-core/src/journey/journey.ts

SỬA — Gợi ý GPS dùng position đã công bố thay vì cố định marker mặc định.

Đường dẫn: `D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\visitor-core\src\journey\journey.ts`.

```typescript
/**
 * FILE NÀY LÀM GÌ: Điều phối GPS, một nguồn audio và lưu tiến độ UC06–UC11.
 * JourneyProvider gọi; phụ thuộc model/catalog/search, không phụ thuộc React/thiết bị.
 * Adapter audio và bộ nhớ được truyền vào để test không cần GPS hoặc loa thật.
 */
import { LANGUAGES, type Language, type PlaceRecord, type Point } from '../domain/model'
import { publishedText, type Catalog } from '../catalog/catalog'
import { distanceMeters, validPoint } from '../catalog/search'

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
    const point = p.position && validPoint(p.position) ? p.position : points[p.id]
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

## apps/mobile/src/components/VisitorMap.tsx

SỬA — Marker/định tâm lấy cùng record đã công bố.

Đường dẫn: `D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\components\VisitorMap.tsx`.

```tsx
/**
 * FILE NÀY LÀM GÌ: Bản đồ native và marker bấm mở chi tiết; không tạo tuyến đi giả.
 * Vị trí: apps/mobile/src/components/VisitorMap.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { Action } from './Action'
import { spacing } from '../theme'
import { Linking, Platform, StyleSheet } from 'react-native'
import MapView from 'react-native-maps'
import { Marker } from 'react-native-maps'
import { publishedText } from '@travelguide/visitor-core'
import { useText } from '../i18n/index'
import { useVisitor } from '../hooks/useVisitor'
import { useJourney } from '../hooks/useJourney'
import { mapPointFor } from '@travelguide/visitor-core/journey/data'

export function VisitorMap({ selected, onOpen }: { selected?: string; onOpen: (id: string) => void }) {
 const { state } = useJourney(), { language } = useVisitor(), t = useText()
 const selectedPlace = state.places.find(place => place.id === selected)
 const point = selectedPlace ? mapPointFor(selectedPlace) : undefined
 const open = onOpen
 return (__DEV__ || Platform.OS === 'ios' || process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ? <MapView style={styles.map}
          key={selected ?? 'all'} initialRegion={{ latitude: point?.lat ?? 16.468, longitude: point?.lng ?? 107.578,
            latitudeDelta: point ? 0.003 : 0.012, longitudeDelta: point ? 0.003 : 0.012 }}>
          {state.places.map(place => { const p = mapPointFor(place); return p ? <Marker key={place.id}
            coordinate={{ latitude: p.lat, longitude: p.lng }} title={publishedText(place, language)?.title ?? place.canonicalTitle}
            onPress={() => open(place.id)} /> : null })}
          {state.fix && <Marker pinColor="blue" coordinate={{ latitude: state.fix.lat, longitude: state.fix.lng }} title={t('jMyLocation')} />}
        </MapView> : <Action title={t('jExternalMap')} onPress={() => {
          void Linking.openURL('https://www.openstreetmap.org/#map=17/' + (point?.lat ?? 16.468) + '/' + (point?.lng ?? 107.578))
        }} />)
}
const styles = StyleSheet.create({ map: { height: 300, marginVertical: spacing.md } })
```

## apps/web/src/components/VisitorMap.tsx

SỬA — Bản đồ web dùng cùng helper vị trí với native.

Đường dẫn: `D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\components\VisitorMap.tsx`.

```tsx
/**
 * FILE NÀY LÀM GÌ: Bản đồ Leaflet với marker là nút HTML, hỗ trợ bấm/Enter mở đúng chi tiết.
 * Vị trí: apps/web/src/components/VisitorMap.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import { publishedText } from '@travelguide/visitor-core'
import { useText } from '../i18n/index'
import { useVisitor } from '../hooks/useVisitor'
import { useJourney } from '../hooks/useJourney'
import { mapPointFor } from '@travelguide/visitor-core/journey/data'
import 'leaflet/dist/leaflet.css'

export function VisitorMap({ selected }: { selected: string | null }) {
  const element = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)
  const t = useText()
  const mapRef = useRef<L.Map | null>(null)
  const userLayer = useRef<L.LayerGroup | null>(null)
  const { state } = useJourney(), { language } = useVisitor(), navigate = useNavigate()
  const open = useCallback((id: string) => navigate('/places/' + id), [navigate])
  useEffect(() => {
    if (!element.current) return
    const map = L.map(element.current, { zoomAnimation: false }).setView([16.468, 107.578], 17)
    mapRef.current = map
    userLayer.current = L.layerGroup().addTo(map)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors', maxZoom: 19 }).on('tileerror', () => setFailed(true)).addTo(map)
    state.places.forEach(place => {
      const point = mapPointFor(place)
      if (!point) return
      const title = publishedText(place, language)?.title ?? place.canonicalTitle
      const label = document.createElement('span'); label.textContent = title
      // CHỨC NĂNG: Marker là nút HTML thật, bấm chuột hoặc Enter đều mở chi tiết.
      // XỬ LÝ: Không chèn tên từ API bằng innerHTML; tránh vùng bấm SVG quá nhỏ.
      const button = document.createElement('button')
      button.type = 'button'; button.textContent = '●'; button.setAttribute('aria-label', title)
      button.style.cssText = 'width:30px;height:30px;padding:0;border-radius:50%;background:white;color:#0759c7;border:2px solid #0759c7;font-size:20px;cursor:pointer'
      if (selected === place.id) button.style.backgroundColor = '#dbeafe'
      button.addEventListener('click', event => { event.stopPropagation(); open(place.id) })
      L.marker([point.lat, point.lng], { keyboard: false,
        icon: L.divIcon({ html: button, className: '', iconSize: [30, 30], iconAnchor: [15, 15] }) })
        .addTo(map).bindTooltip(label)
      if (selected === place.id) map.setView([point.lat, point.lng], 18)
    })
    return () => { map.remove(); mapRef.current = null; userLayer.current = null }
  }, [state.places, selected, language, open])
  useEffect(() => {
    userLayer.current?.clearLayers()
    if (state.fix && userLayer.current) L.circleMarker([state.fix.lat, state.fix.lng], { radius: 9, color: '#16813c' }).addTo(userLayer.current)
  }, [state.fix, state.places, selected, language, open])
  return <>{failed && <p role="alert">{t('loadError')}</p>}<div ref={element} role="region" aria-label={t('jMap')} style={{ height: 360, width: '100%' }} /></>
}
```

## apps/mobile/src/screens/JourneyScreen.tsx

SỬA — Nguồn tọa độ theo vị trí đang công bố, không trỏ nhầm marker cũ.

Đường dẫn: `D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\screens\JourneyScreen.tsx`.

```tsx
/**
 * FILE NÀY LÀM GÌ: Màn bản đồ, GPS và thứ tự tham quan tham khảo trên mobile.
 * Vị trí: apps/mobile/src/screens/JourneyScreen.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { VisitorMap } from '../components/VisitorMap'
import { FlatList, Linking, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { publishedText } from '@travelguide/visitor-core'
import { useText } from '../i18n/index'
import { useVisitor } from '../hooks/useVisitor'
import { useJourney } from '../hooks/useJourney'
import { mapPointFor } from '@travelguide/visitor-core/journey/data'
import { routeAvailable } from '@travelguide/visitor-core/journey'
import { Action, ui } from '../components/index'
import type { VisitorStack } from '../navigation/types'

export function JourneyScreen() {
  const { engine, state } = useJourney(), { language } = useVisitor(), t = useText()
  const navigation = useNavigation<NativeStackNavigationProp<VisitorStack>>()
  const route = useRoute<RouteProp<VisitorStack, 'Journey'>>()
  const selected = route.params?.placeId
  const open = (id: string) => navigation.navigate('Detail', { placeId: id })
  return <SafeAreaView style={ui.page} edges={['left', 'right']}>
    <FlatList data={state.places} keyExtractor={place => place.id} contentContainerStyle={ui.content}
      ListHeaderComponent={<>
        <Text style={ui.title}>{t('jTitle')}</Text>
        <Text style={ui.muted}>{t('jReference')}</Text>
        <Action title={t(state.gps ? 'jGpsOff' : 'jGpsOn')} onPress={() => { void engine.gps(!state.gps) }} />
        {state.error && <Text style={ui.muted}>{t(state.error)}</Text>}
        {state.gps && !state.suggestedId && <Text style={ui.muted}>{t('jNoNearby')}</Text>}
        {/* CHỨC NĂNG: Marker lấy từ OSM; bấm marker mở chi tiết native.
            XỬ LÝ: Không vẽ đường thẳng giả thành lối đi qua tường thành. */}
        <VisitorMap selected={selected} onOpen={open} />
        <Text style={ui.heading}>{t('jRoutes')}</Text>
        {engine.ports.routes.map(r => <View key={r.id} style={ui.card}>
          <Text style={ui.heading}>{r.title[language]}</Text>
          {!r.verified && <Text style={ui.muted}>{t('jPreview')}</Text>}
          <Action title={t('jUseRoute')} disabled={!routeAvailable(r, state.places)} onPress={() => engine.selectRoute(r.id)} />
          {!routeAvailable(r, state.places) && <Text style={ui.muted}>{t('jRouteInvalid')}</Text>}
          {state.routeId === r.id && r.stops.map((id, index) => <Action key={id}
            title={(index + 1) + '. ' + (publishedText(state.places.find(p => p.id === id)!, language)?.title ?? id)} onPress={() => open(id)} />)}
        </View>)}
        <Action title={t('jSkipRoute')} onPress={() => engine.selectRoute()} />
        <Text style={ui.muted}>{t('jWalkingPending')}</Text>
        <Text style={ui.heading}>{t('allPlaces')}</Text>
      </>}
      renderItem={({ item }) => <View style={ui.card}>
        <Action title={publishedText(item, language)?.title ?? item.canonicalTitle} onPress={() => open(item.id)} />
        {mapPointFor(item)?.source && <Action title={t('jSource')} onPress={() => { void Linking.openURL(mapPointFor(item)!.source) }} />}
      </View>} />
  </SafeAreaView>
}
```

## apps/web/src/pages/JourneyPage.tsx

SỬA — Danh sách/bản đồ lấy cùng helper vị trí.

Đường dẫn: `D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\pages\JourneyPage.tsx`.

```tsx
/**
 * FILE NÀY LÀM GÌ: Trang bản đồ, thẻ địa điểm và thứ tự tham quan bấm được.
 * AppRoutes gọi tại /journey; phụ thuộc useJourney, VisitorMap, ảnh và i18n.
 * Liên quan UC06–UC11: chọn điểm thủ công không phụ thuộc quyền GPS.
 */
import { useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { categoryOf, publishedText } from '@travelguide/visitor-core'
import { mapPointFor } from '@travelguide/visitor-core/journey/data'
import { routeAvailable } from '@travelguide/visitor-core/journey'
import { VisitorMap } from '../components/VisitorMap'
import { PlaceImage } from '../components/PlaceImage'
import { Icon } from '../components/Icon'
import { useText } from '../i18n'
import { useVisitor } from '../hooks/useVisitor'
import { useJourney } from '../hooks/useJourney'
import '../styles/journey.css'

export function JourneyPage() {
  const { engine, state } = useJourney()
  const { language } = useVisitor()
  const t = useText()
  const [params, setParams] = useSearchParams()
  const mapArea = useRef<HTMLDivElement>(null)
  const selected = params.get('placeId')

  // CHỨC NĂNG: Định vị công trình ngay trên bản đồ trong trang.
  // XỬ LÝ: Chỉ đổi placeId, giữ query khác và không cần GPS điện thoại.
  // VisitorMap theo dõi selected để phóng đúng marker; cuộn giúp thấy kết quả.
  function locate(id: string) {
    setParams(previous => {
      const next = new URLSearchParams(previous)
      next.set('placeId', id)
      return next
    }, { replace: true })
    mapArea.current?.scrollIntoView({ block: 'start', behavior: 'auto' })
    mapArea.current?.focus({ preventScroll: true })
  }

  return <section className="panel journey-page">
    <header className="journey-heading">
      <div><h1>{t('jTitle')}</h1><p>{t('jReference')}</p></div>
      <button type="button" className={state.gps ? 'button' : 'button secondary'}
        aria-pressed={state.gps} onClick={() => { void engine.gps(!state.gps) }}>
        <Icon name="pin" />{t(state.gps ? 'jGpsOff' : 'jGpsOn')}
      </button>
    </header>
    {state.error && <p className="journey-notice" role="alert">{t(state.error)}</p>}
    {(state.status === 'error' || state.error === 'loadError') && <button type="button" onClick={() => engine.retry()}>{t('jRetry')}</button>}
    {state.gps && !state.suggestedId && <p className="journey-notice">{t('jNoNearby')}</p>}
    <div className="journey-map" ref={mapArea} tabIndex={-1} aria-label={t('jMap')}>
      <VisitorMap selected={selected} />
    </div>

    <section className="journey-section" aria-labelledby="journey-places-title">
      <div className="journey-section-heading">
        <h2 id="journey-places-title">{t('allPlaces')}</h2>
        <span className="journey-count">{state.places.length}</span>
      </div>
      {/* CHỨC NĂNG: Ảnh, tên và lời mời mở chi tiết là một liên kết lớn.
          XỬ LÝ: Nút định vị và nguồn tọa độ ở ngoài Link; không lồng nút/link.
          Đường dẫn dùng ID dữ liệu, không dùng tên đã dịch nên đổi ngôn ngữ không hỏng. */}
      <ul className="journey-places">
        {state.places.map(place => {
          const title = publishedText(place, language)?.title ?? place.canonicalTitle
          const point = mapPointFor(place)
          return <li key={place.id} className={'journey-place' + (selected === place.id ? ' is-selected' : '')}>
            <Link className="journey-place-open" to={'/places/' + encodeURIComponent(place.id)} aria-label={t('jOpenPlace') + ': ' + title}>
              <PlaceImage uri={place.images[0]} title={title} />
              <div className="journey-place-copy">
                <span className="journey-category">{t(`category_${categoryOf(place)}`)}</span>
                <h3>{title}</h3>
                <span className="journey-open-label">{t('jOpenPlace')}<Icon name="arrow" /></span>
              </div>
            </Link>
            {point && <div className="journey-place-tools">
              <button type="button" className="secondary" aria-pressed={selected === place.id}
                aria-label={t('jMap') + ': ' + title} onClick={() => locate(place.id)}>
                <Icon name="pin" />{t('jMap')}
              </button>
              {point.source && <details className="journey-source">
                <summary>{t('jSource')}</summary>
                <a href={point.source} target="_blank" rel="noreferrer" aria-label={t('jSource') + ': ' + title}>OpenStreetMap ↗</a>
              </details>}
            </div>}
          </li>
        })}
      </ul>
    </section>

    <section className="journey-section" aria-labelledby="journey-routes-title">
      <div className="journey-section-heading"><h2 id="journey-routes-title">{t('jRoutes')}</h2></div>
      {engine.ports.routes.map(route => {
        const available = routeAvailable(route, state.places)
        const active = state.routeId === route.id
        // CHỨC NĂNG: Lấy các điểm còn tồn tại; không dùng dấu ! để ép dữ liệu sai.
        // XỬ LÝ: Tuyến thiếu điểm bị khóa bởi routeAvailable trước khi chọn.
        const stops = route.stops.flatMap(id => {
          const place = state.places.find(item => item.id === id)
          return place ? [place] : []
        })
        return <article className={'journey-route' + (active ? ' is-selected' : '')} key={route.id}>
          <div className="journey-route-intro"><span className="journey-route-icon"><Icon name="pin" /></span>
            <div><h3>{route.title[language]}</h3>{!route.verified && <p>{t('jPreview')}</p>}</div>
          </div>
          {!available ? <p role="alert">{t('jRouteInvalid')}</p> : <>
            <div className="journey-route-actions">
              <button type="button" aria-pressed={active} onClick={() => engine.selectRoute(route.id)}>
                <Icon name="list" />{t('jUseRoute')}
              </button>
              <button type="button" className="secondary" onClick={() => engine.selectRoute()}>{t('jSkipRoute')}</button>
            </div>
            {/* CHỨC NĂNG: Chọn tuyến hiện thứ tự cùng các liên kết chi tiết.
                XỬ LÝ: Không chỉ đổi state âm thầm; có phản hồi aria-pressed và thẻ điểm.
                Đây là thứ tự tham khảo, không tự phát audio hoặc vẽ đường đi giả. */}
            {active && <ol className="journey-stops">
              {stops.map((place, index) => {
                const title = publishedText(place, language)?.title ?? place.canonicalTitle
                return <li key={place.id}><span className="journey-step">{index + 1}</span>
                  <Link to={'/places/' + encodeURIComponent(place.id)} aria-label={t('jOpenPlace') + ': ' + title}>
                    <PlaceImage uri={place.images[0]} title={title} /><span>{title}</span><Icon name="arrow" />
                  </Link>
                </li>
              })}
            </ol>}
          </>}
        </article>
      })}
      <p className="journey-footnote">{t('jWalkingPending')}</p>
    </section>
  </section>
}

/* CÁCH KIỂM TRA FILE NÀY CHẠY ĐÚNG:
 * - Bấm ảnh/tên/Xem địa điểm: URL thành /places/ID và có tiêu đề tương ứng.
 * - Bấm Bản đồ trong thẻ: vẫn ở /journey?placeId=ID, bản đồ phóng đúng điểm.
 * - Xem thứ tự này hiện các điểm; bấm từng điểm mở đúng chi tiết; Tự khám phá bỏ chọn.
 * - Thử màn hình 390px, bàn phím Tab/Enter và đổi đủ năm ngôn ngữ.
 */
```

## packages/admin-core/src/i18n/messages.ts

SỬA — Nhãn Tạm dừng/Tiếp tục đủ 5 ngôn ngữ.

Đường dẫn: `D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\admin-core\src\i18n\messages.ts`.

```typescript
/** FILE NÀY LÀM GÌ: Chữ Admin đủ năm ngôn ngữ dùng chung mobile/web.
 * useAdminText gọi; UC12–UC17. Keys được suy ra từ bản Việt để chặn thiếu khóa. */
import type { Language } from '@travelguide/visitor-core'
const vi = {
  "previewPause": "Tạm dừng",
  "previewResume": "Tiếp tục",
  "gateHint": "Lượt mở liên kết QR vào cổng, mỗi phiên/ngày tính một lần; không phải số vé hay số người.",
  "gateError": "Chưa tải được lượt QR.",
  "confirmDelete": "Xóa vĩnh viễn di tích này khỏi Admin và trang du khách trong kho RAM dùng chung? Bản nháp và bản công khai sẽ bị xóa. Không có nút hoàn tác.",
  "delete": "Xóa vĩnh viễn",
  "clearFile": "Bỏ tệp đã chọn",
  "localFile": "Đã chọn tệp cục bộ",
  "mediaError": "Tệp không hợp lệ hoặc lớn hơn 1 MB. Chọn JPEG/PNG/WebP hoặc MP3/WAV/OGG.",
  "fileHint": "Lưu tệp cục bộ tối đa 1 MB/tệp; API upload sẽ nối sau.",
  "pickAudio": "Chọn bản thu từ thiết bị",
  "pickImage": "Chọn ảnh từ thiết bị",
  "confirm": "Xác nhận",
  "previewError": "Không phát được bản nghe thử. Kiểm tra nguồn và thử lại.",
  "simListening": "Mô phỏng khách đang nghe",
  "overviewHint": "Theo dõi hoạt động và quản lý nội dung di tích.",
  "quickActions": "Thao tác nhanh",
  "managePlacesHint": "Cập nhật thông tin, hình ảnh và bài thuyết minh.",
  "reviewQueueHint": "Kiểm tra và công bố nội dung đã duyệt.",
  "catalogHint": "Quản lý danh mục và nội dung thuyết minh.",
  "basicInfo": "Thông tin di tích",
  "locationSection": "Vị trí và tọa độ",
  "mediaSection": "Hình ảnh và tư liệu",
  "workflowSection": "Lưu và quản lý phiên bản",
  "resetHint": "Khôi phục dữ liệu mẫu khi cần bắt đầu lại.",
  "editorHint": "Biên tập nội dung theo từng ngôn ngữ.",
  "clearSearch": "Xóa từ khóa",
  "admin": "Quản lý",
  "dashboard": "Tổng quan",
  "places": "Di tích",
  "reviews": "Kiểm duyệt",
  "qr": "QR tại cổng",
  "visitor": "Về trang du khách",
  "demo": "Dữ liệu dùng chung trên server RAM; khởi động lại server sẽ mất thay đổi.",
  "mockMedia": "MP3 được tạo từ đúng bài đã lưu. Dịch tự động còn mô phỏng; nhập bản dịch đã kiểm tra trước khi công bố.",
  "loading": "Đang tải…",
  "save": "Lưu bản nháp",
  "saved": "Thao tác thành công",
  "new": "Thêm di tích",
  "edit": "Thông tin",
  "content": "Biên tập",
  "search": "Tìm di tích…",
  "title": "Tên chính thức",
  "period": "Giai đoạn lịch sử",
  "category": "Danh mục",
  "lat": "Vĩ độ",
  "lng": "Kinh độ",
  "verified": "Tọa độ đã kiểm tra",
  "images": "Ảnh: mỗi dòng một URL hoặc mã photo:ID",
  "summary": "Mô tả ngắn",
  "address": "Địa chỉ",
  "body": "Bài thuyết minh",
  "audio": "URL bản thu MP3 đã lưu trên máy chủ",
  "preview": "Nghe thử",
  "prepare": "Tạo giọng đọc từ bài đã lưu",
  "translate": "Dịch nháp mô phỏng từ tiếng Việt",
  "submit": "Gửi duyệt",
  "approve": "Duyệt phiên bản",
  "reject": "Yêu cầu sửa",
  "note": "Ghi chú kiểm duyệt",
  "publish": "Công bố phiên bản",
  "confirmPublish": "Công bố bản này cho giao diện du khách trên thiết bị hiện tại?",
  "archive": "Lưu trữ di tích",
  "confirmArchive": "Lưu trữ sẽ bỏ điểm khỏi danh mục công khai . Tiếp tục?",
  "reset": "Đặt lại dữ liệu mẫu",
  "confirmReset": "Xóa các thay đổi cục bộ và nạp lại dữ liệu mẫu?",
  "cancel": "Hủy",
  "unsaved": "Có thay đổi chưa lưu. Bạn muốn rời biểu mẫu?",
  "active": "Phiên đang hoạt động",
  "web": "Web",
  "mobile": "App Mobile",
  "listening": "Đang nghe",
  "gateToday": "Lượt QR hôm nay",
  "simWeb": "Mô phỏng khách Web",
  "simMobile": "Mô phỏng khách App",
  "endSessions": "Kết thúc phiên mô phỏng",
  "analyticsHint": "Phiên ẩn danh được cập nhật từ server RAM; hết hoạt động sau 90 giây không gửi tín hiệu. Khởi động lại server sẽ mất số liệu. Đây là số phiên, không phải số người/vé.",
  "presenceError": "Chưa lấy được thống kê. Kiểm tra server RAM và địa chỉ API.",
  "empty": "Chưa có dữ liệu phù hợp",
  "revision": "Bản sửa",
  "current": "Bản công khai hiện hành",
  "none": "Chưa có",
  "status_draft": "Bản nháp",
  "status_submitted": "Chờ duyệt",
  "status_changes": "Cần sửa",
  "status_approved": "Đã duyệt",
  "status_published": "Đã công bố",
  "status_archived": "Đã lưu trữ",
  "error_loadError": "Không đọc được dữ liệu. Thử lại hoặc đặt lại dữ liệu.",
  "error_saveError": "Không lưu được. Bản công khai cũ được giữ nguyên.",
  "error_invalid": "Kiểm tra trường bắt buộc, tọa độ Huế và URL HTTP(S).",
  "error_conflict": "Bản đã thay đổi. Tải lại trước khi tiếp tục.",
  "error_notFound": "Không tìm thấy di tích",
  "error_notApproved": "Chỉ công bố đúng phiên bản đã duyệt, chưa sửa tiếp.",
  "error_incomplete": "Cần ảnh, bài Việt và audio cho các bản nội dung đã nhập.",
  "error_staleJob": "Kết quả tác vụ thuộc bản cũ. Hãy thử lại.",
  "retry": "Thử lại",
  "stop": "Dừng nghe thử"
} as const
const en = {
  "previewPause": "Pause",
  "previewResume": "Resume",
  "gateHint": "Gate QR link opens, counted once per session/day; not tickets or people.",
  "gateError": "QR statistics are unavailable.",
  "confirmDelete": "Permanently delete this place from shared Admin and visitor data? Draft and published content will be removed. There is no undo button.",
  "delete": "Delete permanently",
  "clearFile": "Remove selected file",
  "localFile": "Local file selected",
  "mediaError": "Invalid file or larger than 1 MB. Choose JPEG/PNG/WebP or MP3/WAV/OGG.",
  "fileHint": "Stores local files up to 1 MB each; upload API comes later.",
  "pickAudio": "Choose local recording",
  "pickImage": "Choose local image",
  "confirm": "Confirm",
  "previewError": "Preview unavailable. Check the source and retry.",
  "simListening": "Simulate listening visitor",
  "overviewHint": "Monitor activity and manage heritage content.",
  "quickActions": "Quick actions",
  "managePlacesHint": "Update information, photos and narration.",
  "reviewQueueHint": "Review and publish approved content.",
  "catalogHint": "Manage places and narration content.",
  "basicInfo": "Place information",
  "locationSection": "Location and coordinates",
  "mediaSection": "Photos and media",
  "workflowSection": "Save and manage versions",
  "resetHint": "Restore sample data when you need a fresh start.",
  "editorHint": "Edit content in each language.",
  "clearSearch": "Clear search",
  "admin": "Management",
  "dashboard": "Dashboard",
  "places": "Places",
  "reviews": "Reviews",
  "qr": "Gate QR",
  "visitor": "Visitor view",
  "demo": "Shared server RAM data; restarting the server loses changes.",
  "mockMedia": "MP3 reads the saved text. Automatic translation remains simulated; enter checked translations before publishing.",
  "loading": "Loading…",
  "save": "Save draft",
  "saved": "Operation completed",
  "new": "Add place",
  "edit": "Information",
  "content": "Edit content",
  "search": "Search places…",
  "title": "Official title",
  "period": "Historical period",
  "category": "Category",
  "lat": "Latitude",
  "lng": "Longitude",
  "verified": "Coordinates verified",
  "images": "Images: one URL or photo:ID per line",
  "summary": "Summary",
  "address": "Address",
  "body": "Narration text",
  "audio": "Hosted recording MP3 URL",
  "preview": "Preview audio",
  "prepare": "Create speech from saved text",
  "translate": "Simulated translation from Vietnamese",
  "submit": "Submit for review",
  "approve": "Approve revision",
  "reject": "Request changes",
  "note": "Review note",
  "publish": "Publish revision",
  "confirmPublish": "Publish this revision to the visitor view on this device?",
  "archive": "Archive place",
  "confirmArchive": "Archive removes this place from the public catalogue. Continue?",
  "reset": "Reset sample data",
  "confirmReset": "Discard local changes and restore sample data?",
  "cancel": "Cancel",
  "unsaved": "Unsaved changes. Leave this form?",
  "active": "Active sessions",
  "web": "Web",
  "mobile": "Mobile app",
  "listening": "Listening",
  "gateToday": "Gate entries today",
  "simWeb": "Simulate web visitor",
  "simMobile": "Simulate app visitor",
  "endSessions": "End simulated sessions",
  "analyticsHint": "Anonymous sessions are read from the RAM server and expire after 90 seconds without a heartbeat. Restarting the server clears them. Sessions are not people or tickets.",
  "presenceError": "Statistics are unavailable. Check the RAM server and API address.",
  "empty": "No matching data",
  "revision": "Revision",
  "current": "Current published version",
  "none": "None",
  "status_draft": "Draft",
  "status_submitted": "In review",
  "status_changes": "Changes requested",
  "status_approved": "Approved",
  "status_published": "Published",
  "status_archived": "Archived",
  "error_loadError": "Could not load data. Retry or reset data.",
  "error_saveError": "Save failed. The published version is unchanged.",
  "error_invalid": "Check required fields, Hue coordinates and HTTP(S) URLs.",
  "error_conflict": "Revision changed. Reload before continuing.",
  "error_notFound": "Place not found",
  "error_notApproved": "Publish only the unchanged approved revision.",
  "error_incomplete": "Require an image, Vietnamese text and audio for entered languages.",
  "error_staleJob": "Task result is stale. Retry.",
  "retry": "Retry",
  "stop": "Stop preview"
} as const
const cn = {
  "previewPause": "暂停",
  "previewResume": "继续播放",
  "gateHint": "入口二维码链接打开次数，每个会话每天计一次；不代表票数或人数。",
  "gateError": "无法加载二维码统计。",
  "confirmDelete": "从共享管理和游客数据中永久删除此景点？草稿和公开内容将被删除，无法撤销。",
  "delete": "永久删除",
  "clearFile": "移除文件",
  "localFile": "已选本地文件",
  "mediaError": "文件无效或超过1MB。选择图片或音频支持格式。",
  "fileHint": "示例本地保存，每个文件最大1MB，后续连接上传API。",
  "pickAudio": "选择本地录音",
  "pickImage": "选择本地图片",
  "confirm": "确认",
  "previewError": "无法试听，请检查来源后重试。",
  "simListening": "模拟收听游客",
  "overviewHint": "查看使用情况并管理景点内容。",
  "quickActions": "快捷操作",
  "managePlacesHint": "更新信息、图片和讲解。",
  "reviewQueueHint": "审核并发布已批准的内容。",
  "catalogHint": "管理景点目录和讲解内容。",
  "basicInfo": "景点信息",
  "locationSection": "位置与坐标",
  "mediaSection": "图片与资料",
  "workflowSection": "保存与版本管理",
  "resetHint": "需要重新开始时恢复示例数据。",
  "editorHint": "按语言编辑内容。",
  "clearSearch": "清除关键词",
  "admin": "管理",
  "dashboard": "概览",
  "places": "景点",
  "reviews": "审核",
  "qr": "入口二维码",
  "visitor": "游客页面",
  "demo": "数据共用服务器内存；重启服务器会丢失更改。",
  "mockMedia": "MP3朗读已保存的正文。自动翻译仍为模拟，请在发布前录入核对后的译文。",
  "loading": "加载中…",
  "save": "保存草稿",
  "saved": "操作成功",
  "new": "添加景点",
  "edit": "信息",
  "content": "编辑内容",
  "search": "搜索景点…",
  "title": "正式名称",
  "period": "历史时期",
  "category": "类别",
  "lat": "纬度",
  "lng": "经度",
  "verified": "坐标已核实",
  "images": "图片：每行一个URL或photo:ID",
  "summary": "简介",
  "address": "地址",
  "body": "讲解文稿",
  "audio": "已托管MP3录音URL",
  "preview": "试听",
  "prepare": "根据已保存正文生成语音",
  "translate": "从越南语模拟翻译",
  "submit": "提交审核",
  "approve": "批准版本",
  "reject": "要求修改",
  "note": "审核备注",
  "publish": "发布版本",
  "confirmPublish": "向当前设备游客视图发布此版本？",
  "archive": "归档景点",
  "confirmArchive": "归档会从示例公开目录移除景点。继续？",
  "reset": "重置示例数据",
  "confirmReset": "清除本地修改并恢复示例数据？",
  "cancel": "取消",
  "unsaved": "有未保存修改，离开？",
  "active": "活跃会话",
  "web": "网页",
  "mobile": "移动应用",
  "listening": "正在收听",
  "gateToday": "今日入口次数",
  "simWeb": "模拟网页游客",
  "simMobile": "模拟应用游客",
  "endSessions": "结束示例会话",
  "analyticsHint": "匿名会话来自内存服务器，90秒未发送心跳即过期。重启服务器会清空数据。会话数不等于人数或票数。",
  "presenceError": "无法读取统计，请检查内存服务器和API地址。",
  "empty": "暂无匹配数据",
  "revision": "修订",
  "current": "当前公开版本",
  "none": "暂无",
  "status_draft": "草稿",
  "status_submitted": "待审核",
  "status_changes": "需修改",
  "status_approved": "已批准",
  "status_published": "已发布",
  "status_archived": "已归档",
  "error_loadError": "读取失败，请重试或重置。",
  "error_saveError": "保存失败，公开版本未改变。",
  "error_invalid": "请检查必填项、顺化坐标和HTTP(S)链接。",
  "error_conflict": "版本已变，请刷新后继续。",
  "error_notFound": "未找到景点",
  "error_notApproved": "只能发布未再修改的已批准版本。",
  "error_incomplete": "需要图片、越南语内容及已输入语言的音频。",
  "error_staleJob": "任务结果已过期，请重试。",
  "retry": "重试",
  "stop": "停止试听"
} as const
const pt = {
  "previewPause": "Pausar",
  "previewResume": "Continuar",
  "gateHint": "Aberturas do link QR de entrada, uma por sessão/dia; não são bilhetes nem pessoas.",
  "gateError": "Estatísticas QR indisponíveis.",
  "confirmDelete": "Eliminar este local dos dados partilhados de gestão e visitantes? O rascunho e a versão pública serão removidos. Não há botão para desfazer.",
  "delete": "Eliminar permanentemente",
  "clearFile": "Remover ficheiro",
  "localFile": "Ficheiro local escolhido",
  "mediaError": "Ficheiro inválido ou superior a 1 MB. Use imagem/áudio suportado.",
  "fileHint": "Guarda ficheiros locais até 1 MB; API de upload futura.",
  "pickAudio": "Escolher gravação local",
  "pickImage": "Escolher imagem local",
  "confirm": "Confirmar",
  "previewError": "Prévia indisponível. Verifique a origem e repita.",
  "simListening": "Simular visitante a ouvir",
  "overviewHint": "Acompanhe a atividade e gira conteúdos do património.",
  "quickActions": "Ações rápidas",
  "managePlacesHint": "Atualize informações, fotografias e narrações.",
  "reviewQueueHint": "Reveja e publique conteúdos aprovados.",
  "catalogHint": "Gira locais e conteúdos de narração.",
  "basicInfo": "Informação do local",
  "locationSection": "Localização e coordenadas",
  "mediaSection": "Fotografias e materiais",
  "workflowSection": "Guardar e gerir versões",
  "resetHint": "Reponha os dados de exemplo para recomeçar.",
  "editorHint": "Edite conteúdos em cada idioma.",
  "clearSearch": "Limpar pesquisa",
  "admin": "Gestão",
  "dashboard": "Visão geral",
  "places": "Locais",
  "reviews": "Revisão",
  "qr": "QR da entrada",
  "visitor": "Vista visitante",
  "demo": "Dados na RAM partilhada do servidor; reiniciar perde as alterações.",
  "mockMedia": "O MP3 lê o texto guardado. A tradução automática continua simulada; introduza traduções verificadas antes de publicar.",
  "loading": "A carregar…",
  "save": "Guardar rascunho",
  "saved": "Operação concluída",
  "new": "Adicionar local",
  "edit": "Informação",
  "content": "Editar conteúdo",
  "search": "Pesquisar locais…",
  "title": "Nome oficial",
  "period": "Período histórico",
  "category": "Categoria",
  "lat": "Latitude",
  "lng": "Longitude",
  "verified": "Coordenadas verificadas",
  "images": "Imagens: um URL ou photo:ID por linha",
  "summary": "Resumo",
  "address": "Morada",
  "body": "Texto da narração",
  "audio": "URL MP3 alojado",
  "preview": "Ouvir prévia",
  "prepare": "Gerar voz do texto guardado",
  "translate": "Tradução simulada do vietnamita",
  "submit": "Enviar para revisão",
  "approve": "Aprovar versão",
  "reject": "Pedir alterações",
  "note": "Nota de revisão",
  "publish": "Publicar versão",
  "confirmPublish": "Publicar esta versão para visitantes neste dispositivo?",
  "archive": "Arquivar local",
  "confirmArchive": "Arquivar remove o local do catálogo. Continuar?",
  "reset": "Repor exemplo",
  "confirmReset": "Eliminar alterações locais e repor dados de exemplo?",
  "cancel": "Cancelar",
  "unsaved": "Alterações por guardar. Sair?",
  "active": "Sessões ativas",
  "web": "Web",
  "mobile": "Aplicação móvel",
  "listening": "A ouvir",
  "gateToday": "Entradas QR hoje",
  "simWeb": "Simular visitante Web",
  "simMobile": "Simular visitante App",
  "endSessions": "Terminar sessões simuladas",
  "analyticsHint": "Sessões anónimas no servidor RAM expiram após 90 segundos sem sinal. Reiniciar o servidor apaga os dados. Sessões não são pessoas ou bilhetes.",
  "presenceError": "Estatísticas indisponíveis. Verifique o servidor RAM e o endereço da API.",
  "empty": "Sem dados correspondentes",
  "revision": "Revisão",
  "current": "Versão publicada atual",
  "none": "Nenhum",
  "status_draft": "Rascunho",
  "status_submitted": "Em revisão",
  "status_changes": "Alterações pedidas",
  "status_approved": "Aprovado",
  "status_published": "Publicado",
  "status_archived": "Arquivado",
  "error_loadError": "Falha ao carregar. Repetir ou repor dados.",
  "error_saveError": "Falha ao guardar. Versão pública mantida.",
  "error_invalid": "Verifique campos, coordenadas e URL HTTP(S).",
  "error_conflict": "Versão alterada. Recarregue antes de continuar.",
  "error_notFound": "Local não encontrado",
  "error_notApproved": "Publique apenas a revisão aprovada sem alterações.",
  "error_incomplete": "É necessária imagem, texto vietnamita e áudio nos idiomas preenchidos.",
  "error_staleJob": "Resultado desatualizado. Repita.",
  "retry": "Repetir",
  "stop": "Parar prévia"
} as const
const ja = {
  "previewPause": "一時停止",
  "previewResume": "再開",
  "gateHint": "入口QRリンクを開いた回数。同じセッションは1日1回で、人数や入場券数ではありません。",
  "gateError": "QR統計を取得できません。",
  "confirmDelete": "この史跡を共有された管理・来訪者データから完全に削除しますか？下書きと公開版が削除され、元に戻すボタンはありません。",
  "delete": "完全に削除",
  "clearFile": "選択ファイルを外す",
  "localFile": "ローカルファイル選択済み",
  "mediaError": "無効または1MB超過。対応する画像・音声を選んでください。",
  "fileHint": "サンプルは1ファイル1MBまでローカル保存。アップロードAPIは後日接続。",
  "pickAudio": "端末の録音を選択",
  "pickImage": "端末の画像を選択",
  "confirm": "確認",
  "previewError": "試聴できません。音源を確認して再試行してください。",
  "simListening": "再生中の利用者を追加",
  "overviewHint": "利用状況を確認し、史跡のコンテンツを管理します。",
  "quickActions": "クイック操作",
  "managePlacesHint": "情報、写真、音声ガイドを更新します。",
  "reviewQueueHint": "内容を確認して承認済みの版を公開します。",
  "catalogHint": "スポットと音声ガイドを管理します。",
  "basicInfo": "スポット情報",
  "locationSection": "場所と座標",
  "mediaSection": "写真と資料",
  "workflowSection": "保存とバージョン管理",
  "resetHint": "最初から始める場合にサンプルデータを復元します。",
  "editorHint": "言語ごとにコンテンツを編集します。",
  "clearSearch": "検索語を消去",
  "admin": "管理",
  "dashboard": "概要",
  "places": "史跡",
  "reviews": "審査",
  "qr": "入口QR",
  "visitor": "来訪者画面",
  "demo": "サーバーRAMの共有データです。再起動すると変更は失われます。",
  "mockMedia": "MP3は保存済み本文を読み上げます。自動翻訳は模擬のため、公開前に確認済みの訳文を入力してください。",
  "loading": "読込中…",
  "save": "下書き保存",
  "saved": "処理完了",
  "new": "史跡を追加",
  "edit": "情報",
  "content": "内容編集",
  "search": "史跡を検索…",
  "title": "正式名称",
  "period": "歴史的時代",
  "category": "分類",
  "lat": "緯度",
  "lng": "経度",
  "verified": "座標確認済み",
  "images": "画像：1行にURLまたはphoto:ID",
  "summary": "概要文",
  "address": "住所",
  "body": "解説文",
  "audio": "サーバー上のMP3 URL",
  "preview": "試聴",
  "prepare": "保存済み本文から音声を生成",
  "translate": "ベトナム語から模擬翻訳",
  "submit": "審査に送信",
  "approve": "版を承認",
  "reject": "修正依頼",
  "note": "審査メモ",
  "publish": "版を公開",
  "confirmPublish": "この端末の来訪者画面に公開しますか？",
  "archive": "史跡をアーカイブ",
  "confirmArchive": "サンプル公開一覧から除きます。続けますか？",
  "reset": "サンプルデータをリセット",
  "confirmReset": "ローカル変更を破棄しサンプルに戻しますか？",
  "cancel": "取消",
  "unsaved": "未保存の変更があります。移動しますか？",
  "active": "アクティブセッション",
  "web": "Web",
  "mobile": "モバイルアプリ",
  "listening": "再生中",
  "gateToday": "本日のQR入場",
  "simWeb": "Web利用者を追加",
  "simMobile": "アプリ利用者を追加",
  "endSessions": "サンプルセッション終了",
  "analyticsHint": "匿名セッションをRAMサーバーから取得します。90秒間通知がないと期限切れになります。再起動で消去されます。人数・チケット数ではありません。",
  "presenceError": "統計を取得できません。RAMサーバーとAPIアドレスを確認してください。",
  "empty": "該当データなし",
  "revision": "改訂",
  "current": "現在の公開版",
  "none": "なし",
  "status_draft": "下書き",
  "status_submitted": "審査待ち",
  "status_changes": "要修正",
  "status_approved": "承認済み",
  "status_published": "公開済み",
  "status_archived": "アーカイブ済み",
  "error_loadError": "読込失敗。再試行またはリセットしてください。",
  "error_saveError": "保存失敗。公開版は変更されません。",
  "error_invalid": "必須項目・フエの座標・HTTP(S) URLを確認してください。",
  "error_conflict": "版が変更されました。再読込してください。",
  "error_notFound": "史跡が見つかりません",
  "error_notApproved": "承認後未変更の版だけ公開できます。",
  "error_incomplete": "画像・ベトナム語文・入力した言語の音声が必要です。",
  "error_staleJob": "古い処理結果です。再試行してください。",
  "retry": "再試行",
  "stop": "試聴停止"
} as const
export type AdminTextKey = keyof typeof vi
export const adminMessages: Record<Language, Record<AdminTextKey, string>> = { vi, en, cn, pt, ja }
/* CÁCH KIỂM TRA: Đổi đủ năm ngôn ngữ, mọi nhãn Admin đổi cùng lựa chọn du khách. */
```

## packages/visitor-core/src/i18n/heritage-messages.ts

SỬA — Nhãn Vị trí công trình trên bản đồ đủ 5 ngôn ngữ.

Đường dẫn: `D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\visitor-core\src\i18n\heritage-messages.ts`.

```typescript
/** FILE NÀY LÀM GÌ: Nhãn nguồn lịch sử/giọng tổng hợp cho cả web và mobile.
 * messages.ts ghép vào i18n; UC04/UC06/UC14. */
import type { Language } from '../domain/model'
export const heritageMessages = {
  "vi": {
    "mapCoordinates": "Vị trí công trình trên bản đồ",
    "heritageSources": "Nguồn tư liệu",
    "heritageCredit": "Biên soạn lại và dịch từ Wikipedia, ghi công các tác giả bài viết; chia sẻ theo CC BY-SA 4.0.",
    "heritageChecked": "Ngày đối chiếu",
    "heritageSynthetic": "Giọng đọc tổng hợp từ đúng bài thuyết minh hiển thị."
  },
  "en": {
    "mapCoordinates": "Building location on map",
    "heritageSources": "Historical sources",
    "heritageCredit": "Rewritten and translated from Wikipedia, credited to its article contributors; shared under CC BY-SA 4.0.",
    "heritageChecked": "Checked on",
    "heritageSynthetic": "Synthetic speech reads the displayed narration text."
  },
  "cn": {
    "mapCoordinates": "建筑在地图上的位置",
    "heritageSources": "历史资料来源",
    "heritageCredit": "依据维基百科重新编写并翻译，署名归原条目贡献者；按 CC BY-SA 4.0 分享。",
    "heritageChecked": "核对日期",
    "heritageSynthetic": "合成语音朗读页面显示的讲解正文。"
  },
  "pt": {
    "mapCoordinates": "Localização do edifício no mapa",
    "heritageSources": "Fontes históricas",
    "heritageCredit": "Texto reescrito e traduzido da Wikipédia, com crédito aos autores dos artigos; partilhado sob CC BY-SA 4.0.",
    "heritageChecked": "Verificado em",
    "heritageSynthetic": "A voz sintética lê o texto de narração apresentado."
  },
  "ja": {
    "mapCoordinates": "地図上の建物の位置",
    "heritageSources": "歴史資料の出典",
    "heritageCredit": "ウィキペディアの記事を再構成・翻訳。原記事の執筆者に帰属し、CC BY-SA 4.0で共有します。",
    "heritageChecked": "照合日",
    "heritageSynthetic": "表示されている解説文を合成音声で読み上げます。"
  }
} satisfies Record<Language, Record<'mapCoordinates' | 'heritageSources' | 'heritageCredit' | 'heritageChecked' | 'heritageSynthetic', string>>
```

## packages/visitor-core/src/index.ts

SỬA — Xuất controller và coordinator qua tên package.

Đường dẫn: `D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\visitor-core\src\index.ts`.

```typescript
/**
 * FILE NÀY LÀM GÌ:
 * Xuất các kiểu dữ liệu và hàm nghiệp vụ dùng chung.
 *
 * Được dùng bởi:
 * - Mobile và web thông qua @travelguide/visitor-core.
 *
 * Phụ thuộc:
 * - Các module nghiệp vụ trong cùng thư mục.
 *
 * Liên quan: UC01–UC05.
 */

// CHỨC NĂNG: Công khai phần logic không phụ thuộc giao diện.
// XỬ LÝ: Mobile và web import bằng tên package thay vì đường dẫn sâu.
export * from './domain/model'
export * from './catalog/catalog'
export * from './catalog/search'
export * from './links/qr'
export * from './links/site'
export * from './data/mock'
export * from './i18n/messages'
export * from './catalog/presentation'

// CHỨC NĂNG: Giữ phần React ở entry riêng.
// XỬ LÝ: Hooks tiếp tục được import từ @travelguide/visitor-core/react;
// không export chúng tại đây để test nghiệp vụ không phải nạp React.
export { PLACE_PHOTOS } from './data/photos'

// CHỨC NĂNG: Công khai nguồn lịch sử và tra MP3 dùng chung web/mobile/Admin.
export * from './data/heritage'

// CHỨC NĂNG: Bộ điều khiển nghe thử và quyền phát chung, dùng được trong test thuần.
export * from './audio/playback'
export * from './audio/preview'
```

## packages/visitor-core/tests/audio.test.cjs

TẠO MỚI — 8 test hồi quy pause/resume, nguồn chậm, quyền phát và vị trí seed/Admin.

Đường dẫn: `D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\visitor-core\tests\audio.test.cjs`.

```javascript
/** FILE NÀY LÀM GÌ: Chặn lỗi preview phát lại từ đầu, phát chồng và nguồn tải muộn.
 * npm test gọi; dùng Track giả có vị trí thật trong test, không cần React/thiết bị. */
const {test}=require('node:test'),assert=require('node:assert/strict')
const {PreviewController}=require('../.test-build/audio/preview.js')
const {PlaybackCoordinator}=require('../.test-build/audio/playback.js')
const {mapPointFor,MAP_POINTS}=require('../.test-build/journey/journey-data.js')
const {MOCK_PLACES}=require('../.test-build/data/mock.js')
function track(coordinator){
 const listeners=new Set()
 const t={position:0,duration:35,playing:false,disposed:false,plays:0,seeks:[],
  async play(){coordinator?.claim(t);t.playing=true;t.plays++;t.emit()},
  pause(){t.playing=false;t.emit()},async seek(value){t.position=value;t.seeks.push(value);t.emit()},rate(){},
  listen(fn){listeners.add(fn);return()=>listeners.delete(fn)},
  dispose(){t.disposed=true;t.pause();coordinator?.release(t)},
  emit(ended=false){listeners.forEach(fn=>fn({position:t.position,duration:t.duration,playing:t.playing,ended}))}}
 return t
}
test('Preview pause/resume giữ giây 12, không tạo player mới hoặc seek về 0',async()=>{
 let opens=0;const t=track(),p=new PreviewController(async()=>{opens++;return t})
 await p.play();t.position=12;t.emit();p.pause();assert.equal(p.snapshot().status,'paused')
 await p.play();assert.equal(t.position,12);assert.equal(opens,1);assert.deepEqual(t.seeks,[]);p.close()
})
test('Preview chỉ tua đầu khi bài đã kết thúc',async()=>{
 const t=track(),p=new PreviewController(async()=>t);await p.play();t.position=35;t.playing=false;t.emit(true)
 assert.equal(p.snapshot().status,'ended');await p.play();assert.deepEqual(t.seeks,[0]);p.close()
})
test('Đổi màn khi tải: nguồn về muộn bị dispose và không tự phát',async()=>{
 let finish;const t=track(),p=new PreviewController(()=>new Promise(r=>finish=r))
 const job=p.play();p.close();finish(t);await job;assert.equal(t.plays,0);assert.equal(t.disposed,true)
 assert.equal(p.snapshot().status,'idle')
})
test('Pause trong lúc tải: chỉ phát khi người dùng bấm tiếp tục',async()=>{
 let finish,opens=0;const t=track(),p=new PreviewController(()=>{opens++;return new Promise(r=>finish=r)})
 const job=p.play();p.pause();finish(t);await job;assert.equal(t.plays,0)
 await p.play();assert.equal(t.plays,1);assert.equal(opens,1);p.close()
})
test('Bấm liên tiếp trong lúc tải không tạo hai nguồn',async()=>{
 let finish,opens=0;const t=track(),p=new PreviewController(()=>{opens++;return new Promise(r=>finish=r)})
 const first=p.play();await p.play();finish(t);await first;assert.equal(opens,1);assert.equal(t.plays,1);p.close()
})
test('Coordinator: B bắt đầu làm A pause; resume A giữ tiến độ và pause B',async()=>{
 const coordinator=new PlaybackCoordinator(),a=track(coordinator),b=track(coordinator)
 const first=new PreviewController(async()=>a),second=new PreviewController(async()=>b)
 await first.play();a.position=14;a.emit();await second.play()
 assert.equal(a.playing,false);assert.equal(first.snapshot().status,'paused');assert.equal(b.playing,true)
 await first.play();assert.equal(a.position,14);assert.equal(a.playing,true);assert.equal(b.playing,false)
 second.close();assert.equal(coordinator.owns(a),true);first.close();assert.equal(coordinator.owns(a),false)
})
test('Lỗi mở audio có thể thử lại, không giữ trạng thái loading',async()=>{
 let opens=0;const t=track(),p=new PreviewController(async()=>{if(++opens===1)throw Error('offline');return t})
 await p.play();assert.equal(p.snapshot().status,'error');await p.play();assert.equal(p.snapshot().status,'playing');p.close()
})
test('8 record có tọa độ OSM đúng nguồn; tọa độ Admin ưu tiên hơn marker mặc định',()=>{
 for(const p of MOCK_PLACES){assert.ok(p.position);assert.equal(p.position.verified,false);assert.equal(p.position.lat,MAP_POINTS[p.id].lat);assert.equal(p.position.lng,MAP_POINTS[p.id].lng)}
 const place={...MOCK_PLACES[0],position:{lat:16.47,lng:107.57,verified:true}}
 assert.deepEqual(mapPointFor(place),{lat:16.47,lng:107.57,fieldVerified:true,source:''})
 assert.deepEqual(mapPointFor({...MOCK_PLACES[0],position:undefined}),MAP_POINTS['ky-dai'])
})
```

## packages/visitor-core/tests/journey.test.cjs

SỬA — GPS fixture tách tọa độ thật; thêm test ưu tiên position mới công bố.

Đường dẫn: `D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\visitor-core\tests\journey.test.cjs`.

```javascript
/**
 * FILE NÀY LÀM GÌ: Kiểm tra nghiệp vụ UC06–UC11 bằng adapter audio/GPS giả.
 * npm test gọi; không phát loa, không cần mạng. Kiểm tra race và quy tắc thật,
 * không dùng đồng hồ giả thay cho thời lượng audio ở giao diện sản phẩm.
 */
const { test } = require('node:test')
const assert = require('node:assert/strict')
const { JourneyController, nearest, parseSaved, clampTime, routeAvailable } = require('../.test-build/journey/journey.js')
const { createCatalog } = require('../.test-build/catalog/catalog.js')
const { MOCK_PLACES } = require('../.test-build/data/mock.js')
const tick = () => new Promise(resolve => setImmediate(resolve))
// CHỨC NĂNG: Các test GPS dùng hệ tọa độ 0,0 riêng, không lẫn tọa độ Huế thật.
const TEST_PLACES = MOCK_PLACES.map(place => ({ ...place, position: undefined }))

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
    catalog: createCatalog(async () => TEST_PLACES),
    positions: { 'ngo-mon': { lat: 0, lng: 0, source: 'test', fieldVerified: true } }, routes: [],
    open: async () => { const t = track(); tracks.push(t); return t },
    watch: async () => () => {}, read: async () => null, write: async value => { writes.push(value) },
    ...extra,
  }
  return { engine: new JourneyController(ports), writes, tracks }
}
const fix = (lng = 0) => ({ lat: 0, lng, accuracy: 5, timestamp: Date.now() })

test('UC06: chỉ chọn điểm trong 100m, dữ liệu GPS cũ/sai bị loại', () => {
  const { engine } = fixture(), places = [TEST_PLACES[1]], points = engine.ports.positions
  assert.equal(nearest(places, points, fix()), 'ngo-mon')
  assert.equal(nearest(places, points, fix(0.00089)), 'ngo-mon')
  assert.equal(nearest(places, points, fix(0.00091)), undefined)
  assert.equal(nearest(places, points, { ...fix(), accuracy: 100 }), undefined)
  assert.equal(nearest(places, points, { ...fix(), timestamp: Date.now() - 31000 }), undefined)
  assert.equal(nearest(places, points, { ...fix(), lat: NaN }), undefined)
})
test('UC06: khoảng cách bằng nhau giữ điểm trước', () => {
  const points = { 'ngo-mon': { lat: 0, lng: 0 }, 'ky-dai': { lat: 0, lng: 0 } }
  assert.equal(nearest(TEST_PLACES, points, fix(), 'ngo-mon'), 'ngo-mon')
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
  const { engine } = fixture({ open: url => url === MOCK_PLACES[1].content.vi.audio.url ? new Promise(resolve => { release = resolve }) : Promise.resolve(recent) })
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
  const saved = { placeId: 'ngo-mon', language: 'vi', textVersion: MOCK_PLACES[1].content.vi.version, audioId: MOCK_PLACES[1].content.vi.audio.id, audioVersion: MOCK_PLACES[1].content.vi.audio.version, position: 9, duration: 30, rate: 1.25 }
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

// CHỨC NĂNG: Tọa độ được Admin công bố phải được ưu tiên hơn marker cũ.
test('UC06: gợi ý GPS dùng position mới công bố',()=>{
 const place={...MOCK_PLACES[1],position:{lat:0,lng:0,verified:true}}
 assert.equal(nearest([place],{'ngo-mon':{lat:16.4676824,lng:107.5791834}},fix()),'ngo-mon')
})
```

## packages/visitor-core/tsconfig.test.json

SỬA — Biên dịch các module audio cho test thuần.

Đường dẫn: `D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\visitor-core\tsconfig.test.json`.

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "Node",
    "outDir": ".test-build",
    "skipLibCheck": true,
    "types": [],
    "resolveJsonModule": true,
    "esModuleInterop": true
  },
  "include": [
    "src/domain/model.ts",
    "src/catalog/catalog.ts",
    "src/links/qr.ts",
    "src/data/mock.ts",
    "src/i18n/messages.ts",
    "src/catalog/search.ts",
    "src/links/site.ts",
    "src/journey/journey.ts",
    "src/journey/journey-data.ts",
    "src/audio/*.ts"
  ]
}
```

## packages/visitor-core/package.json

SỬA — Nối test audio vào lệnh kiểm thử hiện có.

Đường dẫn: `D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\visitor-core\package.json`.

```json
{
  "name": "@travelguide/visitor-core",
  "version": "0.1.0",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./react": "./src/react/react.tsx",
    "./journey": "./src/journey/journey.ts",
    "./journey/react": "./src/journey/journey-react.tsx",
    "./journey/data": "./src/journey/journey-data.ts",
    "./presence": "./src/presence/presence.ts",
    "./presence/react": "./src/presence/presence-react.ts"
  },
  "scripts": {
    "test": "tsc -p tsconfig.test.json && node --test tests/core.test.cjs tests/locale.test.cjs tests/site.test.cjs tests/journey.test.cjs tests/audio.test.cjs",
    "typecheck": "tsc --noEmit -p tsconfig.json",
    "lint": "eslint src --ext .ts,.tsx"
  },
  "peerDependencies": {
    "react": "^18.2.0 || ^19.0.0",
    "i18next": "^26.4.2",
    "react-i18next": "^17.0.15"
  },
  "devDependencies": {
    "@types/react": "~19.2.4"
  }
}
```
