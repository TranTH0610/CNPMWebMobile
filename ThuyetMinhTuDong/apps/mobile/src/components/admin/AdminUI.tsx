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
import { useHeaderHeight } from '@react-navigation/elements'
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
import type { ManagedPlace } from '@travelguide/admin-core'
import { LANGUAGES, type Language } from '@travelguide/visitor-core'
import { Action } from '../Action'
import { colors, spacing } from '../../theme'

type IconName = ComponentProps<typeof Ionicons>['name']
// CHỨC NĂNG: Tập trung style Admin, không sửa style của app du khách.
// XỬ LÝ: Dùng token chung; bố cục mềm và chữ có thể xuống dòng khi dịch dài.
export const styles = StyleSheet.create({
 page:{flex:1,backgroundColor:colors.page}, content:{flexGrow:1,padding:spacing.lg,gap:20,paddingBottom:32},
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
 // Dùng chiều cao header thực tế thay vì 88 cố định khi bàn phím mở.
 const headerHeight=useHeaderHeight()
 return <SafeAreaView style={styles.page} edges={['left','right','bottom']}><KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':undefined} keyboardVerticalOffset={headerHeight}>
  <ScrollView style={{flex:1}} contentInsetAdjustmentBehavior="automatic" automaticallyAdjustsScrollIndicatorInsets keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>{children}<DemoNotice/></ScrollView>
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
// CHỨC NĂNG: Giữ API import cũ; player đầy đủ được quản lý trong một file riêng.
export { AudioPreview } from './AudioPreview'
