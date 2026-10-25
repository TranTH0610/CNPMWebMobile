# Toàn bộ code giao diện Admin mobile

Mỗi mục ghi đường dẫn tính từ gốc monorepo. Các file có chú thích tiếng Việt ngay trong code.

## 1. SỬA — apps/mobile/src/components/admin/AdminUI.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\components\admin\AdminUI.tsx

Bộ giao diện dùng chung: thẻ, nút, ô nhập, trạng thái, ngôn ngữ và phản hồi.

```tsx
/**
 * FILE NÀY LÀM GÌ: Bộ giao diện Admin mobile: khung, tiêu đề, trạng thái, trường nhập và thao tác nhanh.
 * Dashboard/Places/PlaceForm/ContentEditor/Reviews dùng; phụ thuộc token, Ionicons và admin-core.
 * UC12–UC17. Chỉ trình bày giao diện; lưu/duyệt/phiên vẫn do service hiện có xử lý.
 */
import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react'
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
import type { ManagedPlace } from '@travelguide/admin-core'
import { LANGUAGES, type Language } from '@travelguide/visitor-core'
import type { Track } from '@travelguide/visitor-core/journey'
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
// CHỨC NĂNG: Chỉ một preview Admin hoạt động trong toàn bộ cây màn hình.
let stopOtherPreview: (() => void) | undefined
export function AudioPreview({url,title}:{url:string;title:string}) {
 const t=useAdminText(),track=useRef<Track | undefined>(undefined),generation=useRef(0)
 const unlisten=useRef<(() => void) | undefined>(undefined),release=useRef<(() => void) | undefined>(undefined)
 const [busy,setBusy]=useState(false),[playing,setPlaying]=useState(false),[error,setError]=useState(false)
 const stop=()=>{generation.current++;unlisten.current?.();unlisten.current=undefined;track.current?.dispose();track.current=undefined;setPlaying(false);setBusy(false)}
 useEffect(()=>()=>{
  generation.current++;unlisten.current?.();track.current?.dispose();track.current=undefined
  if(stopOtherPreview===release.current)stopOtherPreview=undefined
 },[url])
 return <View style={styles.card}><Action title={playing?t('stop'):t('preview')} icon={playing?'stop':'play'} disabled={busy} onPress={()=>{
  if(playing){stop();return}
  stopOtherPreview?.();release.current=stop;stopOtherPreview=stop
  const request=++generation.current;setBusy(true);setError(false)
  void journeyAdapters.open(url,title).then(async next=>{
   if(request!==generation.current){next.dispose();return}
   track.current=next
   unlisten.current=next.listen(status=>{if(request===generation.current){setPlaying(status.playing);if(status.error)setError(true)}})
   await next.play();if(request===generation.current)setPlaying(true)
  }).catch(()=>{if(request===generation.current)setError(true)}).finally(()=>{if(request===generation.current)setBusy(false)})
 }} />{error && <Text style={styles.error}>{t('previewError')}</Text>}</View>
}
/* CÁCH KIỂM TRA: Rời màn dừng preview; input có nhãn; nút dễ bấm, không chồng audio du khách. */
```

## 2. SỬA — apps/mobile/src/screens/admin/DashboardScreen.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\screens\admin\DashboardScreen.tsx

Tổng quan bốn chỉ số và các lối vào quản lý nhanh.

```tsx
/**
 * FILE NÀY LÀM GÌ: Trang tổng quan Admin mobile với bốn chỉ số và thao tác nhanh.
 * AdminNavigator gọi; phụ thuộc admin-core, presence RAM và bộ AdminUI. UC12–UC17.
 * Chỉ thay bố cục; giữ service thống kê, dữ liệu cục bộ và xác nhận reset.
 */
import { useMemo, type ComponentProps } from 'react'
import { Alert, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { dashboard } from '@travelguide/admin-core'
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
import { usePresenceStatistics } from '@travelguide/visitor-core/presence/react'
import type { AdminStack } from '../../navigation/adminTypes'
import { adminPresenceClient } from '../../services/presence'
import { Action } from '../../components/Action'
import { Frame, Feedback, QuickAction, SectionHeading, styles } from '../../components/admin/AdminUI'
import { colors } from '../../theme'

export function DashboardScreen({navigation}:NativeStackScreenProps<AdminStack,'Dashboard'>) {
 const state=useAdmin(),t=useAdminText(),presence=usePresenceStatistics(adminPresenceClient)
 const metrics=useMemo(()=>state.data?dashboard(state.data):null,[state.data])
 const icons:Record<'active'|'gateToday'|'places'|'pending',ComponentProps<typeof Ionicons>['name']>={active:'people-outline',gateToday:'qr-code-outline',places:'business-outline',pending:'time-outline'}
 return <Frame>
  <View style={styles.hero}>
   <Text style={styles.brand}>HUEGUIDE</Text>
   <Text style={styles.heroTitle}>{t('dashboard')}</Text>
   <Text style={styles.heroText}>{t('overviewHint')}</Text>
  </View>
  <Feedback state={state}/>
  {/* CHỨC NĂNG: Active lấy API RAM, ba chỉ số khác lấy service cũ; không giả lập số. */}
  <View style={[styles.row,{alignItems:'stretch',gap:12}]}>
   {metrics&&(['active','gateToday','places','pending'] as const).map(key=><View key={key} style={[styles.metric,key==='active'&&{backgroundColor:colors.primary,borderColor:colors.primary}]}>
    <View style={[styles.metricIcon,key==='active'&&{backgroundColor:colors.playerControl}]}><Ionicons name={icons[key]} size={19} color={key==='active'?colors.white:colors.primary}/></View>
    <Text style={[styles.metricLabel,key==='active'&&{color:colors.white}]}>{t(key==='pending'?'status_submitted':key)}</Text>
    <Text style={[styles.number,key==='active'&&{color:colors.white}]}>{key==='active'?presence.stats?.active??'—':metrics[key]}</Text>
   </View>)}
  </View>
  {presence.error?<View style={styles.card}><Text style={styles.error} accessibilityRole="alert">{t('presenceError')}</Text><Action title={t('retry')} icon="refresh-outline" onPress={presence.retry}/></View>:!presence.stats?<Text style={styles.muted}>{t('loading')}</Text>:null}
  <SectionHeading title={t('quickActions')} icon="grid-outline"/>
  <QuickAction title={t('places')} description={t('managePlacesHint')} icon="business-outline" onPress={()=>navigation.navigate('AdminPlaces')}/>
  <QuickAction title={t('reviews')} description={t('reviewQueueHint')} icon="shield-checkmark-outline" onPress={()=>navigation.navigate('Reviews')}/>
  <Action title={t('new')} icon="add-outline" variant="primary" onPress={()=>navigation.navigate('PlaceForm')}/>
  <View style={styles.notice}><Ionicons name="pulse-outline" size={18} color={colors.primary}/><Text style={[styles.muted,{flex:1}]}>{t('analyticsHint')}</Text></View>
  <View style={styles.card}>
   <Text style={styles.label}>{t('reset')}</Text><Text style={styles.muted}>{t('resetHint')}</Text>
   <Action title={t('reset')} icon="refresh-outline" disabled={state.busy} onPress={()=>Alert.alert(t('reset'),t('confirmReset'),[{text:t('cancel'),style:'cancel'},{text:t('reset'),style:'destructive',onPress:()=>{void state.run(()=>state.service.reset())}}])}/>
  </View>
 </Frame>
}
/* CÁCH KIỂM TRA: Bốn ô không tràn; hai mục thao tác mở đúng màn; mất RAM server hiện —/thử lại. */
```

## 3. SỬA — apps/mobile/src/screens/admin/PlacesScreen.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\screens\admin\PlacesScreen.tsx

Danh sách di tích bằng FlatList, tìm kiếm, mở thông tin và biên tập.

```tsx
/**
 * FILE NÀY LÀM GÌ: Danh mục Admin dạng thẻ ảnh nhỏ, trạng thái và hai thao tác rõ ràng.
 * AdminNavigator gọi; phụ thuộc useAdmin, Cover, AdminUI. UC13.
 * Tìm kiếm debounce/không dấu và key ID giữ nguyên; không đổi service hoặc dữ liệu.
 */
import { useMemo, useState } from 'react'
import { FlatList, Pressable, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { normalize } from '@travelguide/visitor-core'
import { useDebounce } from '@travelguide/visitor-core/react'
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
import type { AdminStack } from '../../navigation/adminTypes'
import { Action } from '../../components/Action'
import { Cover } from '../../components/Cover'
import { DemoNotice, Feedback, PageHeader, StatusBadge, styles } from '../../components/admin/AdminUI'
import { colors } from '../../theme'
export function AdminPlacesScreen({navigation}:NativeStackScreenProps<AdminStack,'AdminPlaces'>) {
 const state=useAdmin(),t=useAdminText(),[query,setQuery]=useState(''),debounced=useDebounce(query)
 const places=useMemo(()=>state.data?.places.filter(p=>normalize(p.record.canonicalTitle).includes(normalize(debounced)))??[],[state.data,debounced])
 return <SafeAreaView style={styles.page} edges={['left','right','bottom']}>
  <FlatList data={places} keyExtractor={place=>place.id} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"
   ListHeaderComponent={<View style={{gap:16}}>
    <PageHeader title={t('places')} description={t('catalogHint')}/><Feedback state={state}/>
    <Action title={t('new')} icon="add-outline" variant="primary" onPress={()=>navigation.navigate('PlaceForm')}/>
    <View style={styles.searchBox}><Ionicons name="search-outline" size={20} color={colors.muted}/>
     <TextInput style={styles.searchInput} accessibilityLabel={t('search')} placeholder={t('search')} placeholderTextColor={colors.muted} value={query} onChangeText={setQuery} autoCorrect={false}/>
     {!!query&&<Pressable accessibilityRole="button" accessibilityLabel={t('clearSearch')} onPress={()=>setQuery('')} style={{padding:8}}><Ionicons name="close-circle" size={20} color={colors.muted}/></Pressable>}
    </View>
    <Text style={styles.muted}>{places.length} {t('places')}</Text>
   </View>}
   ListEmptyComponent={!state.loading&&!state.error?<View style={[styles.card,{alignItems:'center',paddingVertical:28}]}><Ionicons name="search-outline" size={32} color={colors.muted}/><Text style={styles.muted}>{t('empty')}</Text></View>:null}
   ListFooterComponent={<DemoNotice/>}
   // CHỨC NĂNG: FlatList chỉ dựng các thẻ cần thiết; ảnh cố định, nội dung tự xuống dòng.
   renderItem={({item})=><View style={styles.card}>
    <View style={{flexDirection:'row',gap:12,alignItems:'center'}}>
     <Cover uri={item.record.images[0]} style={styles.listImage}/>
     <View style={{flex:1,minWidth:0,gap:8}}><StatusBadge workflow={item.workflow}/><Text numberOfLines={2} style={styles.heading}>{item.record.canonicalTitle}</Text>
      {!!item.period&&<Text numberOfLines={1} style={styles.muted}>{item.period}</Text>}
     </View>
    </View>
    <View style={styles.divider}/>
    <View style={{flexDirection:'row',gap:10}}>
     <View style={{flex:1}}><Action title={t('edit')} icon="create-outline" onPress={()=>navigation.navigate('PlaceForm',{id:item.id})}/></View>
     <View style={{flex:1}}><Action title={t('content')} icon="document-text-outline" variant="primary" onPress={()=>navigation.navigate('Content',{id:item.id})}/></View>
    </View>
   </View>}
  />
 </SafeAreaView>
}
/* CÁCH KIỂM TRA: 'ky dai' tìm đúng; xóa tìm khôi phục danh sách; hai nút truyền đúng place ID. */
```

## 4. SỬA — apps/mobile/src/screens/admin/PlaceFormScreen.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\screens\admin\PlaceFormScreen.tsx

Biểu mẫu chia nhóm thông tin, tọa độ, hình ảnh và thao tác lưu.

```tsx
/** FILE NÀY LÀM GÌ: Metadata native tương đương biểu mẫu web.
 * AdminNavigator gọi; UC13. Dùng cùng validatePlace/revision qua service. */
import { LocalMediaPicker } from '../../components/admin/LocalMediaPicker'
import { useState } from 'react'
import { Alert,Pressable,Switch,Text,View } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { CATEGORIES,categoryOf } from '@travelguide/visitor-core'
import type { Category } from '@travelguide/visitor-core'
import type { ManagedPlace } from '@travelguide/admin-core'
import { useAdmin,useAdminText } from '@travelguide/admin-core/react'
import { useText } from '../../i18n'
import type { AdminStack } from '../../navigation/adminTypes'
import { Action } from '../../components/Action'
import { Cover } from '../../components/Cover'
import { colors } from '../../theme'
import { Frame,Field,Feedback,PageHeader,SectionHeading,DangerAction,styles,useUnsaved } from '../../components/admin/AdminUI'
type Props=NativeStackScreenProps<AdminStack,'PlaceForm'>
export function PlaceFormScreen(props:Props){const state=useAdmin(),t=useAdminText(),id=props.route.params?.id,place=state.data?.places.find(p=>p.id===id)
 if(state.loading)return <Frame><Feedback state={state}/></Frame>
 if(id&&!place)return <Frame><Text>{t('error_notFound')}</Text></Frame>
 return <Form key={id??'new'} initial={place} navigation={props.navigation}/>
}
function Form({initial,navigation}:{initial?:ManagedPlace;navigation:Props['navigation']}){
 const state=useAdmin(),t=useAdminText(),vt=useText()
 const [title,setTitle]=useState(initial?.record.canonicalTitle??''),[category,setCategory]=useState<Category>(initial?categoryOf(initial.record):'palace')
 const [period,setPeriod]=useState(initial?.period??''),[lat,setLat]=useState(initial?.record.position?.lat.toString()??''),[lng,setLng]=useState(initial?.record.position?.lng.toString()??'')
 const [verified,setVerified]=useState(initial?.record.position?.verified??false),[images,setImages]=useState(initial?.record.images.join('\n')??''),[dirty,setDirty]=useState(false)
 const allowLeave=useUnsaved(dirty),change=(setter:(s:string)=>void)=>(s:string)=>{setDirty(true);setter(s)}
 return <Frame><PageHeader title={t(initial?'edit':'new')} description={t('catalogHint')}/><Feedback state={state}/>
  {/* CHỨC NĂNG: Chia metadata thành nhóm rõ ràng, không đổi state và validate của service. */}
  <View style={styles.card}>
   <SectionHeading title={t('basicInfo')} icon="business-outline"/>
   <Field label={t('title')} value={title} onChange={change(setTitle)}/>
   <Text style={styles.label}>{t('category')}</Text>
   <View style={styles.row}>{CATEGORIES.map(c=><Pressable key={c} accessibilityRole="button" accessibilityLabel={vt(`category_${c}`)} accessibilityState={{selected:category===c}}
    onPress={()=>{setCategory(c);setDirty(true)}} style={[styles.languageChip,category===c&&{backgroundColor:colors.soft,borderColor:colors.primary}]}>
    <Text style={{color:category===c?colors.primary:colors.muted,fontSize:12,fontWeight:'600'}}>{vt(`category_${c}`)}</Text>
   </Pressable>)}</View>
   <Field label={t('period')} value={period} onChange={change(setPeriod)}/>
  </View>
  <View style={styles.card}>
   <SectionHeading title={t('locationSection')} icon="location-outline"/>
   <View style={{flexDirection:'row',gap:10}}>
    <View style={{flex:1,minWidth:0}}><Field label={t('lat')} value={lat} onChange={change(setLat)}/></View>
    <View style={{flex:1,minWidth:0}}><Field label={t('lng')} value={lng} onChange={change(setLng)}/></View>
   </View>
   <View style={[styles.row,{flexWrap:'nowrap',justifyContent:'space-between'}]}>
    <Text style={[styles.label,{flex:1}]}>{t('verified')}</Text>
    <Switch accessibilityLabel={t('verified')} trackColor={{false:colors.border,true:colors.primary}} thumbColor={colors.white} value={verified} onValueChange={value=>{setVerified(value);setDirty(true)}}/>
   </View>
  </View>
  <View style={styles.card}>
   <SectionHeading title={t('mediaSection')} icon="images-outline"/>
   {!!images.trim()&&<Cover uri={images.split('\n').map(value=>value.trim()).find(Boolean)} style={{height:160,borderRadius:14}}/>}
   <Field label={t('images')} multiline value={images.split('\n').filter(s=>!s.startsWith('data:')).join('\n')} onChange={value=>{setImages([...images.split('\n').filter(s=>s.startsWith('data:')),value].filter(Boolean).join('\n'));setDirty(true)}}/>
   <LocalMediaPicker kind="image" onPick={value=>{setImages(old=>[old,value].filter(Boolean).join('\n'));setDirty(true)}}/>
   {images.includes('data:')&&<Action title={t('clearFile')} onPress={()=>{setImages(images.split('\n').filter(s=>!s.startsWith('data:')).join('\n'));setDirty(true)}}/>}
  </View>
  <View style={styles.card}><SectionHeading title={t('workflowSection')} icon="layers-outline"/>
  <Action title={t('save')} icon="save-outline" variant="primary" disabled={state.busy||initial?.workflow==='archived'} onPress={()=>{void state.run(()=>state.service.savePlace({id:initial?.id,expectedRevision:initial?.revision,title,category,period,lat,lng,verified,images:images.split('\n').map(s=>s.trim()).filter(Boolean)})).then(ok=>{if(ok){allowLeave();navigation.goBack()}})}}/>
  {initial&&initial.workflow!=='archived'&&<Action title={t('archive')} disabled={state.busy} onPress={()=>Alert.alert(t('archive'),t('confirmArchive'),[{text:t('cancel'),style:'cancel'},{text:t('archive'),style:'destructive',onPress:()=>{void state.run(()=>state.service.archive(initial.id,initial.revision)).then(ok=>{if(ok){allowLeave();navigation.goBack()}})}}])}/>}
  {/* CHỨC NĂNG: Xóa hẳn cả điểm đã lưu trữ; không xóa khi chưa xác nhận. */}
  {initial && <DangerAction title={t('delete')} disabled={state.busy} onPress={() => Alert.alert(t('delete'), t('confirmDelete') + '\n' + initial.record.canonicalTitle, [
    {text:t('cancel'),style:'cancel'},
    {text:t('delete'),style:'destructive',onPress:()=>{
      void state.run(()=>state.service.deletePlace(initial.id,initial.revision)).then(ok=>{
        if(ok){allowLeave();navigation.goBack()}
      })
    }},
  ])} />}
  </View>
 </Frame>
}
/* CÁCH KIỂM TRA: Back form bẩn có hỏi; lưu lỗi giữ giá trị; thêm mới không xuất hiện public trước duyệt. */
```

## 5. SỬA — apps/mobile/src/screens/admin/ContentEditorScreen.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\screens\admin\ContentEditorScreen.tsx

Biên tập nội dung đa ngôn ngữ, nghe thử và gửi duyệt.

```tsx
/** FILE NÀY LÀM GÌ: Biên tập 5 ngôn ngữ native, audio URL và dịch/TTS demo.
 * AdminNavigator gọi; UC14/14.1/14.2. Dùng cùng service với web.
 * Form chưa lưu không được gửi duyệt/tạo tác vụ để tránh dùng văn bản cũ. */
import { LocalMediaPicker } from '../../components/admin/LocalMediaPicker'
import { useState } from 'react'
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
 const place=state.data?.places.find(p=>p.id===route.params.id)
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
 const [audioUrl,setAudioUrl]=useState(text?.audio?.url.startsWith('demo:')?'':text?.audio?.url??'')
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

## 6. SỬA — apps/mobile/src/screens/admin/ReviewsScreen.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\screens\admin\ReviewsScreen.tsx

Hàng chờ duyệt, đọc nội dung, ghi chú và công bố.

```tsx
/** FILE NÀY LÀM GÌ: Danh sách chờ duyệt, so sánh năm bản và công bố native.
 * AdminNavigator gọi; UC15–UC16. Gọi cùng service kiểm tra revision với web. */
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { AdminStack } from '../../navigation/adminTypes'
import { useState } from 'react'
import { Alert,FlatList,Text,View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Cover } from '../../components/Cover'
import { colors } from '../../theme'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { Language } from '@travelguide/visitor-core'
import type { ManagedPlace } from '@travelguide/admin-core'
import { useAdmin,useAdminText } from '@travelguide/admin-core/react'
import { Action } from '../../components/Action'
import { DemoNotice,Feedback,Field,PageHeader,StatusBadge,LanguageTabs,SectionHeading,styles,AudioPreview } from '../../components/admin/AdminUI'
export function ReviewsScreen(){const state=useAdmin(),t=useAdminText(),places=state.data?.places.filter(p=>['submitted','approved','changes'].includes(p.workflow))??[]
 return <SafeAreaView style={styles.page} edges={['left','right','bottom']}><FlatList data={places} keyExtractor={p=>p.id+p.revision+p.workflow} contentContainerStyle={styles.content}
  ListHeaderComponent={<View style={{gap:16}}><PageHeader title={t('reviews')} description={t('reviewQueueHint')}/><Feedback state={state}/><Text style={styles.muted}>{places.length} {t('reviews')}</Text></View>}
  ListFooterComponent={<DemoNotice/>}
  ListEmptyComponent={!state.loading&&!state.error?<View style={[styles.card,{alignItems:'center',paddingVertical:32}]}><Ionicons name="shield-checkmark-outline" size={36} color={colors.primary}/><Text style={styles.muted}>{t('empty')}</Text></View>:null} renderItem={({item})=><Review place={item}/>}/></SafeAreaView>
}
function Review({place}:{place:ManagedPlace}){
 const navigation=useNavigation<NativeStackNavigationProp<AdminStack>>()
 const state=useAdmin(),t=useAdminText(),[language,setLanguage]=useState<Language>('vi'),[note,setNote]=useState(''),text=place.record.content[language]
 // CHỨC NĂNG: Thẻ duyệt tách nhận diện di tích, ngôn ngữ, nội dung và hành động.
 // XỬ LÝ: Nội dung vẫn hiển thị đầy đủ; mọi nút giữ điều kiện workflow/revision cũ.
 return <View style={styles.card}>
  <View style={{flexDirection:'row',gap:12,alignItems:'center'}}>
   <Cover uri={place.record.images[0]} style={{width:70,height:78,borderRadius:12}}/>
   <View style={{flex:1,minWidth:0,gap:7}}><StatusBadge workflow={place.workflow}/><Text style={styles.heading}>{place.record.canonicalTitle}</Text></View>
  </View>
  <Text style={styles.muted}>{t('revision')}: {place.revision} · {t('current')}: {place.published?.content.vi?.version??t('none')}</Text>
  <View style={styles.divider}/>
  <LanguageTabs value={language} onChange={setLanguage}/>
  <View style={{gap:8,padding:12,borderRadius:13,backgroundColor:colors.page}}>
   <Text style={styles.label}>{text?.title??t('none')}</Text><Text style={styles.text}>{text?.body??t('none')}</Text>
  </View>
  {text?.audio&&<AudioPreview key={language} url={text.audio.url} title={text.title}/>}
  <SectionHeading title={t('note')} icon="chatbubble-ellipses-outline"/>
  <Field label={t('note')} value={note} onChange={setNote} multiline/>{!!place.reviewNote&&<Text>{place.reviewNote}</Text>}
  <Action title={t('content')} icon="document-text-outline" onPress={()=>navigation.navigate('Content',{id:place.id})}/>
  <Feedback state={state}/>
  {place.workflow==='submitted'&&<><Action title={t('approve')} icon="checkmark-circle-outline" variant="primary" disabled={state.busy} onPress={()=>{void state.run(()=>state.service.review(place.id,place.revision,true,note))}}/><Action title={t('reject')} icon="return-down-back-outline" disabled={state.busy||!note.trim()} onPress={()=>{void state.run(()=>state.service.review(place.id,place.revision,false,note))}}/></>}
  {place.workflow==='approved'&&<Action title={t('publish')} icon="globe-outline" variant="primary" disabled={state.busy} onPress={()=>Alert.alert(t('publish'),t('confirmPublish'),[{text:t('cancel'),style:'cancel'},{text:t('publish'),onPress:()=>{void state.run(()=>state.service.publish(place.id,place.revision))}}])}/>}
 </View>
}
/* CÁCH KIỂM TRA: Duyệt chưa public; sửa sau duyệt chặn publish; xác nhận mới công bố. */
```

## 7. SỬA — apps/mobile/src/navigation/AdminNavigator.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\navigation\AdminNavigator.tsx

Điều hướng Admin và kiểu hiển thị tiêu đề.

```tsx
/** FILE NÀY LÀM GÌ: Stack Admin native không đăng nhập, tách khỏi các màn visitor.
 * AdminApp đăng ký; UC12–UC17. Dùng danh tính demo và service chung.
 * Không tạo NavigationContainer thứ hai; header dùng cùng token màu du khách. */
import { useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useAdminText } from '@travelguide/admin-core/react'
import { useJourney } from '../hooks/useJourney'
import { colors } from '../theme'
import type { AdminStack } from './adminTypes'
import { DashboardScreen } from '../screens/admin/DashboardScreen'
import { AdminPlacesScreen } from '../screens/admin/PlacesScreen'
import { PlaceFormScreen } from '../screens/admin/PlaceFormScreen'
import { ContentEditorScreen } from '../screens/admin/ContentEditorScreen'
import { ReviewsScreen } from '../screens/admin/ReviewsScreen'
const Stack=createNativeStackNavigator<AdminStack>()
export function AdminNavigator(){const t=useAdminText(),{engine}=useJourney();useEffect(()=>{engine.pause()},[engine]);return <Stack.Navigator screenOptions={{headerShadowVisible:false,headerTitleStyle:{fontSize:18,fontWeight:'700'},headerTintColor:colors.primary,headerStyle:{backgroundColor:colors.background},contentStyle:{backgroundColor:colors.page}}}>
 <Stack.Screen name="Dashboard" component={DashboardScreen} options={{title:t('admin')}}/>
 <Stack.Screen name="AdminPlaces" component={AdminPlacesScreen} options={{title:t('places')}}/>
 <Stack.Screen name="PlaceForm" component={PlaceFormScreen} options={{title:t('edit')}}/>
 <Stack.Screen name="Content" component={ContentEditorScreen} options={{title:t('content')}}/>
 <Stack.Screen name="Reviews" component={ReviewsScreen} options={{title:t('reviews')}}/>
 </Stack.Navigator>}
/* CÁCH KIỂM TRA: start:admin mở quản lý; bản du khách không có route Admin. */
```

## 8. SỬA — packages/admin-core/src/messages.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\admin-core\src\messages.ts

Nhãn giao diện Admin bằng Việt, Anh, Trung, Bồ Đào Nha và Nhật.

```typescript
/** FILE NÀY LÀM GÌ: Chữ Admin đủ năm ngôn ngữ dùng chung mobile/web.
 * useAdminText gọi; UC12–UC17. Keys được suy ra từ bản Việt để chặn thiếu khóa. */
import type { Language } from '@travelguide/visitor-core'
const vi = {
  "confirmDelete": "Xóa vĩnh viễn di tích này khỏi Admin và trang du khách trong bộ nhớ cục bộ? Bản nháp và bản công khai sẽ bị xóa. Không có nút hoàn tác.",
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
  "demo": "Dữ liệu cục bộ mô phỏng; chưa xác thực, chưa đồng bộ giữa thiết bị.",
  "mockMedia": "Dịch/TTS mô phỏng. MP3 mẫu không đọc văn bản vừa soạn; nội dung được tạo là dữ liệu mẫu.",
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
  "prepare": "Tạo audio mẫu",
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
  "confirmDelete": "Permanently delete this place from local Admin and visitor data? Draft and published content will be removed. There is no undo button.",
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
  "demo": "Local data; no authentication or cross-device sync.",
  "mockMedia": "Simulated translation/TTS. Sample MP3 does not read your edited text; generated content is sample data.",
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
  "prepare": "Prepare sample audio",
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
  "confirmDelete": "从本地管理和游客数据中永久删除此景点？草稿和公开内容将被删除，无法撤销。",
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
  "demo": "本地示例数据，未认证且不跨设备同步。",
  "mockMedia": "翻译和语音为模拟，示例MP3不朗读编辑内容，仅供示例发布。",
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
  "prepare": "生成示例音频",
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
  "confirmDelete": "Eliminar este local dos dados locais de gestão e visitantes? O rascunho e a versão pública serão removidos. Não há botão para desfazer.",
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
  "demo": "Dados locais de exemplo, sem autenticação ou sincronização.",
  "mockMedia": "Tradução/TTS simulados. O MP3 não lê o texto editado; publicação com conteúdo de exemplo.",
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
  "prepare": "Preparar áudio de exemplo",
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
  "confirmDelete": "この史跡を端末内の管理・来訪者データから完全に削除しますか？下書きと公開版が削除され、元に戻すボタンはありません。",
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
  "demo": "ローカルサンプルデータ。認証・端末間同期はありません。",
  "mockMedia": "翻訳・TTSは模擬です。MP3は編集文を読みません。公開もサンプル用です。",
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
  "prepare": "サンプル音声を用意",
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
