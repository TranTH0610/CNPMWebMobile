/**
 * FILE NÀY LÀM GÌ: Trang tổng quan Admin mobile với bốn chỉ số và thao tác nhanh.
 * AdminNavigator gọi; phụ thuộc admin-core, presence RAM và bộ AdminUI. UC12–UC17.
 * Dữ liệu nội dung và lượt QR lấy từ API RAM chung; không có nút reset.
 */
import { useMemo, type ComponentProps } from 'react'
import { Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { dashboard } from '@travelguide/admin-core'
import { useAdmin, useAdminText, useGateStatistics } from '@travelguide/admin-core/react'
import { usePresenceStatistics } from '@travelguide/visitor-core/presence/react'
import type { AdminStack } from '../../navigation/adminTypes'
import { gateClient } from '../../services/admin/services'
import { adminPresenceClient } from '../../services/presence'
import { Action } from '../../components/Action'
import { Frame, Feedback, QuickAction, SectionHeading, styles } from '../../components/admin/AdminUI'
import { colors } from '../../theme'

export function DashboardScreen({navigation}:NativeStackScreenProps<AdminStack,'Dashboard'>) {
 const state=useAdmin(),t=useAdminText(),presence=usePresenceStatistics(adminPresenceClient),gate=useGateStatistics(gateClient)
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
    <Text style={[styles.number,key==='active'&&{color:colors.white}]}>{key==='active'?presence.stats?.active??'—':key==='gateToday'?gate.stats?.today??'—':metrics[key]}</Text>
   </View>)}
  </View>
  {presence.error?<View style={styles.card}><Text style={styles.error} accessibilityRole="alert">{t('presenceError')}</Text><Action title={t('retry')} icon="refresh-outline" onPress={presence.retry}/></View>:!presence.stats?<Text style={styles.muted}>{t('loading')}</Text>:null}
  <Text style={styles.muted}>{t('gateHint')}</Text>
  {gate.error&&<View style={styles.card}><Text style={styles.error}>{t('gateError')}</Text><Action title={t('retry')} onPress={gate.retry}/></View>}
  <SectionHeading title={t('quickActions')} icon="grid-outline"/>
  <QuickAction title={t('places')} description={t('managePlacesHint')} icon="business-outline" onPress={()=>navigation.navigate('AdminPlaces')}/>
  <QuickAction title={t('reviews')} description={t('reviewQueueHint')} icon="shield-checkmark-outline" onPress={()=>navigation.navigate('Reviews')}/>
  <Action title={t('new')} icon="add-outline" variant="primary" onPress={()=>navigation.navigate('PlaceForm')}/>
  <View style={styles.notice}><Ionicons name="pulse-outline" size={18} color={colors.primary}/><Text style={[styles.muted,{flex:1}]}>{t('analyticsHint')}</Text></View>
 </Frame>
}
/* CÁCH KIỂM TRA: Bốn ô không tràn; hai mục thao tác mở đúng màn; mất RAM server hiện —/thử lại. */
