import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Button, ScrollView, Switch, Text, View } from 'react-native'
import * as Speech from 'expo-speech'
import { useTranslation } from 'react-i18next'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../navigation/types'
import { LANGUAGES, type LangCode } from '../i18n'
import type { Place } from '../services/places'
import { getPlace } from '../services/placeStore'
import { usePlaceText } from '../hooks/usePlaceText'

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>

export default function DetailScreen({ route, navigation }: Props) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as LangCode
  const [place, setPlace] = useState<Place | undefined>()
  const { text, loading, error } = usePlaceText(place, lang)
  const speechCode = LANGUAGES.find((l) => l.code === lang)?.speech
  const [speaking, setSpeaking] = useState(false)
  const [auto, setAuto] = useState(true)
  const autoPlayed = useRef(false)

  useEffect(() => {
    getPlace(route.params.placeId).then(setPlace)
    return () => {
      Speech.stop()
    }
  }, [route.params.placeId])

  useEffect(() => {
    if (place) navigation.setOptions({ title: place.name[lang] })
  }, [place, lang, navigation])

  const play = () => {
    if (!text) return
    Speech.stop()
    setSpeaking(true)
    Speech.speak(text, {
      language: speechCode,
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    })
  }

  const stop = () => {
    Speech.stop()
    setSpeaking(false)
  }

  // Tự phát đúng một lần, khi văn bản đã sẵn sàng
  useEffect(() => {
    if (text && auto && !autoPlayed.current) {
      autoPlayed.current = true
      play()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  if (!place) return null

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '600', marginBottom: 12 }}>{place.name[lang]}</Text>
      {loading && <ActivityIndicator style={{ marginBottom: 16 }} />}
      {error && <Text style={{ color: 'crimson', marginBottom: 16 }}>{t('detail.translateError')}</Text>}
      {text && <Text style={{ fontSize: 16, lineHeight: 24, marginBottom: 20 }}>{text}</Text>}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <Switch value={auto} onValueChange={setAuto} />
        <Text style={{ marginLeft: 8 }}>{t('detail.autoPlay')}</Text>
      </View>
      {speaking ? (
        <Button title={t('detail.stop')} onPress={stop} />
      ) : (
        <Button title={t('detail.play')} onPress={play} disabled={!text} />
      )}
    </ScrollView>
  )
}