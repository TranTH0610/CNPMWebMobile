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
import { MAP_POINTS } from '@travelguide/visitor-core/journey/data'
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
        {MAP_POINTS[item.id] && <Action title={t('jSource')} onPress={() => { void Linking.openURL(MAP_POINTS[item.id].source) }} />}
      </View>} />
  </SafeAreaView>
}
