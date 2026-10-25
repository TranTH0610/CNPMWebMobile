/**
 * FILE NÀY LÀM GÌ: Thanh nghe thử đầy đủ cho Admin mobile: phát/pause, tua,
 * thời gian, âm lượng và tốc độ. AdminUI xuất lại để màn biên tập/duyệt dùng chung.
 * Phụ thuộc PreviewController, Slider có sẵn và adapter audio native. UC07/UC14.
 */
import { useCallback, useMemo, useState, useSyncExternalStore } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import Slider from '@react-native-community/slider'
import { Ionicons } from '@expo/vector-icons'
import { PreviewController } from '@travelguide/visitor-core'
import { useAdminText } from '@travelguide/admin-core/react'
import { journeyAdapters } from '../../services/journeyAdapters'
import { colors } from '../../theme'

const clock=(seconds:number)=>{
  const safe=Number.isFinite(seconds)?Math.max(0,Math.floor(seconds)):0
  return Math.floor(safe/60)+':'+(safe%60).toString().padStart(2,'0')
}
export function AudioPreview({url,title}:{url:string;title:string}) {
  const t=useAdminText()
  // CHỨC NĂNG: Giữ cùng player khi form render/poll, không mở lại khi pause.
  const controller=useMemo(()=>new PreviewController(()=>journeyAdapters.open(url,title)),[url,title])
  const state=useSyncExternalStore(controller.subscribe,controller.snapshot,controller.snapshot)
  const [draft,setDraft]=useState<number|undefined>(undefined)
  const [panel,setPanel]=useState<'volume'|'rate'|undefined>(undefined)
  // XỬ LÝ: Nạp metadata để hiện tổng thời gian trước khi nghe; rời màn thì đóng.
  useFocusEffect(useCallback(()=>{void controller.prepare();return()=>controller.close()},[controller]))
  const busy=state.status==='loading',playing=state.status==='playing'
  const canSeek=state.duration>0&&!busy&&state.status!=='error'
  const label=playing?t('previewPause'):state.status==='paused'?t('previewResume'):t('preview')
  return <View style={styles.box}>
    <Text style={styles.label}>{t('preview')}</Text>
    <View style={styles.bar}>
      <Pressable accessibilityRole="button" accessibilityLabel={label} disabled={busy}
        onPress={()=>{if(playing)controller.pause();else void controller.play()}}
        style={({pressed})=>[styles.icon,pressed&&styles.pressed,busy&&styles.disabled]}>
        {busy?<ActivityIndicator size="small" color={colors.primary}/>:<Ionicons name={playing?'pause':'play'} size={21} color={colors.text}/>}
      </Pressable>
      <Text style={styles.time}>{clock(draft??state.position)} / {clock(state.duration)}</Text>
      {/* CHỨC NĂNG: Tua MP3 thật khi thả; draft giữ tay kéo không nhảy theo timeupdate.
          XỬ LÝ: Controller giới hạn giá trị, xếp hàng tua và giữ pause khi đang pause. */}
      <Slider accessibilityLabel={t('previewSeek')} style={styles.seek} minimumValue={0}
        maximumValue={Math.max(state.duration,1)} value={draft??state.position} disabled={!canSeek}
        minimumTrackTintColor={colors.primary} maximumTrackTintColor={colors.border} thumbTintColor={colors.primary}
        onSlidingStart={()=>setDraft(state.position)} onValueChange={setDraft}
        onSlidingComplete={value=>{void controller.seek(value).finally(()=>setDraft(undefined))}}/>
      <Pressable accessibilityRole="button" accessibilityLabel={t('previewVolume')} accessibilityState={{expanded:panel==='volume'}}
        onPress={()=>setPanel(value=>value==='volume'?undefined:'volume')} style={styles.icon}>
        <Ionicons name={state.volume===0?'volume-mute':'volume-high'} size={20} color={colors.text}/>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={t('previewMore')} accessibilityState={{expanded:panel==='rate'}}
        onPress={()=>setPanel(value=>value==='rate'?undefined:'rate')} style={styles.icon}>
        <Ionicons name="ellipsis-vertical" size={20} color={colors.text}/>
      </Pressable>
    </View>
    {/* CHỨC NĂNG: Loa mở chỉnh âm lượng; dấu ba chấm mở tốc độ như nhóm điều khiển web. */}
    {panel==='volume'&&<View style={styles.options}>
      <Text style={styles.label}>{t('previewVolume')}</Text>
      <Slider accessibilityLabel={t('previewVolume')} style={styles.volume} minimumValue={0} maximumValue={1}
        value={state.volume} minimumTrackTintColor={colors.primary} maximumTrackTintColor={colors.border}
        thumbTintColor={colors.primary} onValueChange={value=>controller.setVolume(value)}/>
      <Text style={styles.time}>{Math.round(state.volume*100)}%</Text>
    </View>}
    {panel==='rate'&&<View style={styles.rates}>
      <Text style={styles.label}>{t('previewRate')}</Text>
      {[0.75,1,1.25,1.5,2].map(rate=><Pressable key={rate} accessibilityRole="button" accessibilityLabel={t('previewRate')+' '+rate+'×'}
        accessibilityState={{selected:state.rate===rate}} onPress={()=>controller.setRate(rate)}
        style={[styles.rate,state.rate===rate&&styles.selected]}>
        <Text style={[styles.label,state.rate===rate&&{color:colors.white}]}>{rate}×</Text>
      </Pressable>)}
    </View>}
    {state.status==='error'&&<Text accessibilityRole="alert" style={styles.error}>{t('previewError')}</Text>}
  </View>
}
const styles=StyleSheet.create({
  box:{gap:10,paddingVertical:12},label:{fontSize:12,fontWeight:'600',color:colors.text},
  bar:{flexDirection:'row',alignItems:'center',backgroundColor:colors.page,borderRadius:28,paddingHorizontal:4,minHeight:54},
  icon:{width:34,minHeight:46,alignItems:'center',justifyContent:'center',flexShrink:0},
  time:{fontSize:11,fontVariant:['tabular-nums'],color:colors.text},seek:{flex:1,minWidth:40,height:44},
  options:{flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:8},volume:{flex:1,height:44},
  rates:{flexDirection:'row',flexWrap:'wrap',alignItems:'center',gap:8},
  rate:{minHeight:42,paddingHorizontal:12,justifyContent:'center',borderRadius:12,backgroundColor:colors.page},
  selected:{backgroundColor:colors.primary},pressed:{opacity:0.7},disabled:{opacity:0.5},error:{color:colors.danger,fontSize:12},
})
/* CÁCH KIỂM TRA: Hiện tổng thời gian khi mở; kéo tua khi pause vẫn pause;
 * loa chỉnh âm lượng thật; ba chấm đổi tốc độ; resume không về giây 0. */
