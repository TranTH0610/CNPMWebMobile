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
 const [opened] = useState(initial)
 const state=useAdmin(),t=useAdminText(),vt=useText()
 const [title,setTitle]=useState(opened?.record.canonicalTitle??''),[category,setCategory]=useState<Category>(opened?categoryOf(opened.record):'palace')
 const [period,setPeriod]=useState(opened?.period??''),[lat,setLat]=useState(opened?.record.position?.lat.toString()??''),[lng,setLng]=useState(opened?.record.position?.lng.toString()??'')
 const [verified,setVerified]=useState(opened?.record.position?.verified??false),[images,setImages]=useState(opened?.record.images.join('\n')??''),[dirty,setDirty]=useState(false)
 const allowLeave=useUnsaved(dirty),change=(setter:(s:string)=>void)=>(s:string)=>{setDirty(true);setter(s)}
 return <Frame><PageHeader title={t(opened?'edit':'new')} description={t('catalogHint')}/><Feedback state={state}/>
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
  <Action title={t('save')} icon="save-outline" variant="primary" disabled={state.busy||opened?.workflow==='archived'} onPress={()=>{void state.run(()=>state.service.savePlace({id:opened?.id,expectedRevision:opened?.revision,title,category,period,lat,lng,verified,images:images.split('\n').map(s=>s.trim()).filter(Boolean)})).then(ok=>{if(ok){allowLeave();navigation.goBack()}})}}/>
  {opened&&opened.workflow!=='archived'&&<Action title={t('archive')} disabled={state.busy} onPress={()=>Alert.alert(t('archive'),t('confirmArchive'),[{text:t('cancel'),style:'cancel'},{text:t('archive'),style:'destructive',onPress:()=>{void state.run(()=>state.service.archive(opened.id,opened.revision)).then(ok=>{if(ok){allowLeave();navigation.goBack()}})}}])}/>}
  {/* CHỨC NĂNG: Xóa hẳn cả điểm đã lưu trữ; không xóa khi chưa xác nhận. */}
  {opened && <DangerAction title={t('delete')} disabled={state.busy} onPress={() => Alert.alert(t('delete'), t('confirmDelete') + '\n' + opened.record.canonicalTitle, [
    {text:t('cancel'),style:'cancel'},
    {text:t('delete'),style:'destructive',onPress:()=>{
      void state.run(()=>state.service.deletePlace(opened.id,opened.revision)).then(ok=>{
        if(ok){allowLeave();navigation.goBack()}
      })
    }},
  ])} />}
  </View>
 </Frame>
}
/* CÁCH KIỂM TRA: Back form bẩn có hỏi; lưu lỗi giữ giá trị; thêm mới không xuất hiện public trước duyệt. */
