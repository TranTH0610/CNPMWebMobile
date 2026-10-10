import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Button, Pressable, ScrollView, Switch, Text, View } from 'react-native'
import * as Speech from 'expo-speech'
import { useTranslation } from 'react-i18next'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../navigation/types'
import { LANGUAGES, type LangCode } from '../i18n'
import type { Place } from '../services/places'
import { getPlace } from '../services/placeStore'
import { usePlaceText } from '../hooks/usePlaceText'
import { useSettings } from '../store/SettingsContext'

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>

export default function DetailScreen({ route, navigation }: Props) {
  const { t, i18n } = useTranslation()
  const uiLang = i18n.language as LangCode // dùng cho tiêu đề, nút, tên địa điểm
  const { narrationLang, setNarrationSetting } = useSettings() // dùng cho văn bản + giọng đọc

  const [place, setPlace] = useState<Place | undefined>()
  const { text, loading, error, retry } = usePlaceText(place, narrationLang)
  const speechCode = LANGUAGES.find((l) => l.code === narrationLang)?.speech
  const [speaking, setSpeaking] = useState(false)
  const [auto, setAuto] = useState(true)
  const autoPlayed = useRef(false)

  // CHỨC NĂNG: tải địa điểm; rời màn hình thì dừng đọc.
  useEffect(() => {
    getPlace(route.params.placeId).then(setPlace)
    return () => {
      Speech.stop()
    }
  }, [route.params.placeId])

  // CHỨC NĂNG: tiêu đề header = tên địa điểm theo NGÔN NGỮ GIAO DIỆN.
  useEffect(() => {
    if (place) navigation.setOptions({ title: place.name[uiLang] })
  }, [place, uiLang, navigation])

  // CHỨC NĂNG (UC02 luồng thay thế): đổi ngôn ngữ thuyết minh → DỪNG âm thanh đang phát.
  // XỬ LÝ: không tự phát lại bằng ngôn ngữ mới; người dùng bấm "Nghe" khi sẵn sàng.
  useEffect(() => {
    Speech.stop()
    setSpeaking(false)
  }, [narrationLang])

  const play = () => {
    if (!text) return
    Speech.stop()
    setSpeaking(true)
    Speech.speak(text, {
      language: speechCode, // giọng đọc khớp ngôn ngữ của văn bản
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    })
  }

  const stop = () => {
    Speech.stop()
    setSpeaking(false)
  }

  // CHỨC NĂNG: tự phát đúng MỘT lần khi văn bản đầu tiên sẵn sàng.
  // XỬ LÝ: autoPlayed chặn việc tự phát lại sau khi đổi ngôn ngữ.
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
      <Text style={{ fontSize: 22, fontWeight: '600', marginBottom: 12 }}>{place.name[uiLang]}</Text>

      {/* CHỨC NĂNG: đổi ngôn ngữ thuyết minh ngay tại màn chi tiết (UC02). */}
      <Text style={{ marginBottom: 8, color: '#555' }}>{t('detail.narrationLang')}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
        {LANGUAGES.map((l) => {
          const selected = l.code === narrationLang
          return (
            <Pressable
              key={l.code}
              onPress={() => setNarrationSetting(l.code)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={l.label}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderWidth: selected ? 2 : 1,
                borderColor: selected ? '#4F46E5' : '#ddd',
                borderRadius: 20,
                marginRight: 8,
                marginBottom: 8,
              }}
            >
              <Text>{l.label}</Text>
            </Pressable>
          )
        })}
      </View>

      {loading && <ActivityIndicator style={{ marginBottom: 16 }} />}

      {/* CHỨC NĂNG (UC02 luồng lỗi): dịch thất bại → báo lỗi + nút Thử lại,
          và hiện nội dung tiếng Việt để người dùng vẫn đọc được. */}
      {error && (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ color: 'crimson', marginBottom: 8 }}>{t('detail.translateError')}</Text>
          <Button title={t('detail.retry')} onPress={retry} />
          <Text style={{ fontSize: 16, lineHeight: 24, marginTop: 12 }}>{place.description.vi}</Text>
        </View>
      )}

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