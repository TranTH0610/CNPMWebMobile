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
  <FlatList style={{flex:1}} contentInsetAdjustmentBehavior="automatic" automaticallyAdjustsScrollIndicatorInsets keyboardShouldPersistTaps="handled" data={places} keyExtractor={place=>place.id} contentContainerStyle={styles.content}
   ListHeaderComponent={<View style={{gap:16}}>
    <PageHeader title={t('places')} description={t('catalogHint')}/><Feedback state={state}/>
    <Action title={t('new')} icon="add-outline" variant="primary" onPress={()=>navigation.navigate('PlaceForm')}/>
    <View style={styles.searchBox}><Ionicons name="search-outline" size={20} color={colors.muted}/>
     <TextInput style={styles.searchInput} accessibilityLabel={t('search')} placeholder={t('search')} placeholderTextColor={colors.muted} value={query} onChangeText={setQuery} autoCorrect={false}/>
     {!!query&&<Pressable accessibilityRole="button" accessibilityLabel={t('clearSearch')} onPress={()=>setQuery('')} style={{padding:8}}><Ionicons name="close-circle" size={20} color={colors.muted}/></Pressable>}
    </View>
    <Text style={styles.muted}>{places.length} {t('places')}</Text>
   </View>}
   ListEmptyComponent={!state.loading&&!state.error?<View style={[styles.card,{alignItems:'center',paddingVertical:28}]}><Ionicons name="search-outline" size={32} color={colors.muted}/><Text style={styles.muted}>{t('empty')}</Text></View>:undefined}
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
