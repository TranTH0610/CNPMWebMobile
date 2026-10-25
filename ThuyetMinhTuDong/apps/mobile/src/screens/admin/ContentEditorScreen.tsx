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
