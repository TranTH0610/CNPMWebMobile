import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Button, FlatList, Pressable, Switch, Text, View } from 'react-native'
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../navigation/types'
import type { LangCode } from '../i18n'
import type { Place } from '../services/places'
import { loadAllPlaces } from '../services/placeStore'
import { useNearbyPlace } from '../hooks/useNearbyPlace'

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>

export default function HomeScreen({ navigation }: Props) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as LangCode
  const isFocused = useIsFocused()
  const [places, setPlaces] = useState<Place[]>([])
  const [autoLocation, setAutoLocation] = useState(false)
  const { nearby, denied, simulate } = useNearbyPlace(places, autoLocation)
  const visited = useRef(new Set<string>())

  useFocusEffect(
    useCallback(() => {
      loadAllPlaces().then(setPlaces)
    }, [])
  )

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button title="🌐" onPress={() => navigation.navigate('Language', { change: true })} />
      ),
    })
  }, [navigation])

  // Đến gần địa điểm nào thì tự mở địa điểm đó, mỗi lần đến chỉ mở một lần
  useEffect(() => {
    if (!autoLocation) return
    if (!nearby) {
      visited.current.clear() // đã đi xa, lần sau đến gần sẽ phát lại
      return
    }
    if (!isFocused || visited.current.has(nearby.id)) return
    visited.current.add(nearby.id)
    navigation.navigate('Detail', { placeId: nearby.id })
  }, [nearby, autoLocation, isFocused, navigation])

  const openPlace = (id: string) => {
    visited.current.add(id) // mở tay thì không tự mở lại khi quay về
    navigation.navigate('Detail', { placeId: id })
  }

  const firstWithLocation = places.find((p) => p.location)

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ marginBottom: 12, color: '#555' }}>{t('home.subtitle')}</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <Switch value={autoLocation} onValueChange={setAutoLocation} />
        <Text style={{ marginLeft: 8, flex: 1 }}>{t('home.autoLocation')}</Text>
      </View>
      {denied && <Text style={{ color: 'crimson', marginBottom: 8 }}>{t('home.denied')}</Text>}
      {__DEV__ && autoLocation && firstWithLocation?.location && (
        <View style={{ marginBottom: 8 }}>
          <Button title={t('home.simulate')} onPress={() => simulate(firstWithLocation.location!)} />
        </View>
      )}

      <FlatList
        data={places}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => openPlace(item.id)}
            style={{ padding: 16, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 12 }}
          >
            <Text style={{ fontSize: 18 }}>{item.name[lang]}</Text>
          </Pressable>
        )}
      />
      <Button title="+ Thêm địa điểm" onPress={() => navigation.navigate('AddPlace')} />
    </View>
  )
}