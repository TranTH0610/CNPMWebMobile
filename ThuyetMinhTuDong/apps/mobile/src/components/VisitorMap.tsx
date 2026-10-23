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
import { MAP_POINTS } from '@travelguide/visitor-core/journey/data'

export function VisitorMap({ selected, onOpen }: { selected?: string; onOpen: (id: string) => void }) {
 const { state } = useJourney(), { language } = useVisitor(), t = useText()
 const point = selected ? MAP_POINTS[selected] : undefined
 const open = onOpen
 return (__DEV__ || Platform.OS === 'ios' || process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ? <MapView style={styles.map}
          key={selected ?? 'all'} initialRegion={{ latitude: point?.lat ?? 16.468, longitude: point?.lng ?? 107.578,
            latitudeDelta: point ? 0.003 : 0.012, longitudeDelta: point ? 0.003 : 0.012 }}>
          {state.places.map(place => { const p = MAP_POINTS[place.id]; return p ? <Marker key={place.id}
            coordinate={{ latitude: p.lat, longitude: p.lng }} title={publishedText(place, language)?.title ?? place.canonicalTitle}
            onPress={() => open(place.id)} /> : null })}
          {state.fix && <Marker pinColor="blue" coordinate={{ latitude: state.fix.lat, longitude: state.fix.lng }} title={t('jMyLocation')} />}
        </MapView> : <Action title={t('jExternalMap')} onPress={() => {
          void Linking.openURL('https://www.openstreetmap.org/#map=17/' + (point?.lat ?? 16.468) + '/' + (point?.lng ?? 107.578))
        }} />)
}
const styles = StyleSheet.create({ map: { height: 300, marginVertical: spacing.md } })
