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
 return <SafeAreaView style={styles.page} edges={['left','right','bottom']}><FlatList style={{flex:1}} contentInsetAdjustmentBehavior="automatic" automaticallyAdjustsScrollIndicatorInsets keyboardShouldPersistTaps="handled" data={places} keyExtractor={p=>p.id+p.revision+p.workflow} contentContainerStyle={styles.content}
  ListHeaderComponent={<View style={{gap:16}}><PageHeader title={t('reviews')} description={t('reviewQueueHint')}/><Feedback state={state}/><Text style={styles.muted}>{places.length} {t('reviews')}</Text></View>}
  ListFooterComponent={<DemoNotice/>}
  ListEmptyComponent={!state.loading&&!state.error?<View style={[styles.card,{alignItems:'center',paddingVertical:32}]}><Ionicons name="shield-checkmark-outline" size={36} color={colors.primary}/><Text style={styles.muted}>{t('empty')}</Text></View>:undefined} renderItem={({item})=><Review place={item}/>}/></SafeAreaView>
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
