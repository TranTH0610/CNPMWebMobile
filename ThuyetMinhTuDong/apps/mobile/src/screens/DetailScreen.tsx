/**
 * FILE NÀY LÀM GÌ:
 * Hiển thị mô tả địa điểm, đổi ngôn ngữ thuyết minh và điều khiển TTS.
 * Kiểm tra giọng có trên thiết bị, báo lỗi khi không đọc được.
 *
 * Được mở bởi: navigation với route Detail và placeId.
 *
 * Phụ thuộc:
 * - usePlaceText
 * - placeStore
 * - SettingsContext
 * - i18n
 * - expo-speech
 *
 * Liên quan: UC02, Detail/TTS và các luồng lỗi.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  ActivityIndicator,
  Button,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from 'react-native'

import * as Speech from 'expo-speech'
import { useTranslation } from 'react-i18next'

import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack'

import type {
  RootStackParamList,
} from '../navigation/types'

import {
  LANGUAGES,
  type LangCode,
} from '../i18n'

import type { Place } from '../services/places'
import { getPlace } from '../services/placeStore'
import { usePlaceText } from '../hooks/usePlaceText'
import { useSettings } from '../store/SettingsContext'

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Detail'
>

type SpeechError =
  | 'missingVoice'
  | 'speechError'
  | null

export default function DetailScreen({
  route,
  navigation,
}: Props) {
  const { t, i18n } = useTranslation()

  const uiLang = i18n.language as LangCode

  const {
    narrationLang,
    setNarrationSetting,
  } = useSettings()

  const [place, setPlace] = useState<Place | undefined>()

  const {
    text,
    loading,
    error,
    retry,
  } = usePlaceText(place, narrationLang)

  const speechCode =
    LANGUAGES.find(
      (language) => language.code === narrationLang,
    )?.speech

  const [speaking, setSpeaking] = useState(false)
  const [preparing, setPreparing] = useState(false)

  const [speechError, setSpeechError] =
    useState<SpeechError>(null)

  const [auto, setAuto] = useState(true)

  // CHỨC NĂNG: ghi nhận đã tự phát ở lần mở địa điểm này hay chưa.
  // XỬ LÝ: đổi ngôn ngữ không tự phát lại; người dùng bấm Nghe.
  const autoPlayed = useRef(false)

  // CHỨC NĂNG: đánh số lần phát.
  // XỬ LÝ: callback của lần phát cũ không được đổi trạng thái
  // của lần phát mới sau khi người dùng dừng/đổi ngôn ngữ.
  const speechRequest = useRef(0)

  const previousContext = useRef({
    placeId: route.params.placeId,
    language: narrationLang,
  })

  // CHỨC NĂNG: tải địa điểm theo ID.
  // XỬ LÝ: bỏ kết quả nếu đã đổi route hoặc rời màn hình.
  useEffect(() => {
    let cancelled = false

    setPlace(undefined)

    getPlace(route.params.placeId)
      .then((result) => {
        if (!cancelled) {
          setPlace(result)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPlace(undefined)
        }
      })

    return () => {
      cancelled = true
    }
  }, [route.params.placeId])

  // CHỨC NĂNG: đặt tiêu đề theo ngôn ngữ giao diện.
  // XỬ LÝ: thiếu tên ngôn ngữ đang chọn thì dùng tên Việt,
  // tránh tiêu đề trống ở địa điểm mẫu chỉ có tiếng Việt.
  useEffect(() => {
    if (place) {
      navigation.setOptions({
        title: place.name[uiLang] ?? place.name.vi,
      })
    }
  }, [place, uiLang, navigation])

  // CHỨC NĂNG: dừng phát khi đổi ngôn ngữ/địa điểm.
  // XỬ LÝ:
  // - Tăng request để vô hiệu hóa callback cũ.
  // - Đổi ngôn ngữ trên cùng địa điểm thì không tự phát lại.
  // - Sang địa điểm khác thì cho phép tự phát một lần.
  useEffect(() => {
    const previous = previousContext.current

    if (previous.placeId !== route.params.placeId) {
      autoPlayed.current = false
    } else if (previous.language !== narrationLang) {
      autoPlayed.current = true
    }

    previousContext.current = {
      placeId: route.params.placeId,
      language: narrationLang,
    }

    speechRequest.current += 1

    setSpeaking(false)
    setPreparing(false)
    setSpeechError(null)

    void Speech.stop().catch(() => {
      // Không phát sinh Promise rejection khi hệ thống TTS lỗi.
      // Lần bấm Nghe tiếp theo sẽ kiểm tra và hiển thị lỗi.
    })

    return () => {
      speechRequest.current += 1

      void Speech.stop().catch(() => {
        // Cleanup không cập nhật state sau khi rời màn hình.
      })
    }
  }, [narrationLang, route.params.placeId])

  // CHỨC NĂNG: chuẩn bị và phát thuyết minh.
  // XỬ LÝ:
  // - Không phát khi đang dịch hoặc dịch thất bại.
  // - Chọn giọng thực sự có trên thiết bị.
  // - Ưu tiên đúng biến thể; nếu không có thì dùng cùng ngôn ngữ.
  //   Ví dụ pt-PT không có nhưng pt-BR có thì dùng giọng pt-BR.
  const play = useCallback(async (): Promise<void> => {
    if (
      !text ||
      loading ||
      error ||
      !speechCode
    ) {
      return
    }

    const request = ++speechRequest.current

    setPreparing(true)
    setSpeaking(false)
    setSpeechError(null)

    const isCurrent = (): boolean =>
      speechRequest.current === request

    try {
      // Chờ dừng xong âm thanh trước rồi mới chuẩn bị lượt mới.
      await Speech.stop()

      if (!isCurrent()) {
        return
      }

      const voices =
        await Speech.getAvailableVoicesAsync()

      if (!isCurrent()) {
        return
      }

      const requestedCode =
        speechCode.replace(/_/g, '-').toLowerCase()

      const baseLanguage =
        requestedCode.split('-')[0]

      // CHỨC NĂNG: ưu tiên giọng khớp chính xác như pt-PT/zh-CN.
      // XỬ LÝ: một số engine trả dấu "_" nên chuẩn hóa thành "-".
      const exactVoice = voices.find((voice) => {
        const voiceCode =
          voice.language
            .replace(/_/g, '-')
            .toLowerCase()

        return voiceCode === requestedCode
      })

      // CHỨC NĂNG: tìm giọng cùng ngôn ngữ khi thiếu đúng biến thể.
      // XỬ LÝ: không rơi về giọng mặc định của ngôn ngữ khác.
      const compatibleVoice = voices.find((voice) => {
        const voiceCode =
          voice.language
            .replace(/_/g, '-')
            .toLowerCase()

        return (
          voiceCode.split('-')[0] === baseLanguage
        )
      })

      const voice =
        exactVoice ?? compatibleVoice

      if (!voice) {
        setPreparing(false)
        setSpeechError('missingVoice')
        return
      }

      // CHỨC NĂNG: kết thúc trạng thái của đúng lượt phát hiện tại.
      // XỬ LÝ: callback cũ bị bỏ qua nhờ request.
      const finish = (): void => {
        if (isCurrent()) {
          setSpeaking(false)
          setPreparing(false)
        }
      }

      setPreparing(false)
      setSpeaking(true)

      Speech.speak(text, {
        language: voice.language,
        voice: voice.identifier,

        onDone: finish,
        onStopped: finish,

        onError: () => {
          if (isCurrent()) {
            setSpeaking(false)
            setPreparing(false)
            setSpeechError('speechError')
          }
        },
      })
    } catch {
      if (isCurrent()) {
        setSpeaking(false)
        setPreparing(false)
        setSpeechError('speechError')
      }
    }
  }, [text, loading, error, speechCode])

  // CHỨC NĂNG: dừng cả lúc chuẩn bị và lúc đang đọc.
  // XỬ LÝ: vô hiệu hóa lượt phát trước khi gọi hệ thống dừng.
  const stop = useCallback((): void => {
    speechRequest.current += 1

    setSpeaking(false)
    setPreparing(false)

    void Speech.stop().catch(() => {
      setSpeechError('speechError')
    })
  }, [])

  // CHỨC NĂNG: tự phát một lần khi nội dung đầu tiên sẵn sàng.
  // XỬ LÝ: đánh dấu trước khi gọi play để render lại không phát đôi.
  useEffect(() => {
    if (
      text &&
      !loading &&
      !error &&
      auto &&
      !autoPlayed.current
    ) {
      autoPlayed.current = true
      void play()
    }
  }, [text, loading, error, auto, play])

  if (!place) {
    return (
      <View style={{ padding: 16 }}>
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <ScrollView
      contentContainerStyle={{ padding: 16 }}
    >
      <Text
        style={{
          fontSize: 22,
          fontWeight: '600',
          marginBottom: 12,
        }}
      >
        {place.name[uiLang] ?? place.name.vi}
      </Text>

      <Text
        style={{
          marginBottom: 8,
          color: '#555',
        }}
      >
        {t('detail.narrationLang')}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginBottom: 16,
        }}
      >
        {LANGUAGES.map((language) => {
          const selected =
            language.code === narrationLang

          return (
            <Pressable
              key={language.code}
              onPress={() => {
                void setNarrationSetting(language.code)
              }}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={language.label}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderWidth: selected ? 2 : 1,
                borderColor: selected
                  ? '#4F46E5'
                  : '#ddd',
                borderRadius: 20,
                marginRight: 8,
                marginBottom: 8,
              }}
            >
              <Text>{language.label}</Text>
            </Pressable>
          )
        })}
      </View>

      {loading && (
        <ActivityIndicator
          style={{ marginBottom: 16 }}
        />
      )}

      {/* CHỨC NĂNG: dịch lỗi thì cho thử lại và đọc bản Việt.
          XỬ LÝ: không đưa bản Việt vào TTS của ngôn ngữ khác. */}
      {error && (
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              color: 'crimson',
              marginBottom: 8,
            }}
          >
            {t('detail.translateError')}
          </Text>

          <Button
            title={t('detail.retry')}
            onPress={retry}
          />

          <Text
            style={{
              fontSize: 16,
              lineHeight: 24,
              marginTop: 12,
            }}
          >
            {place.description.vi}
          </Text>
        </View>
      )}

      {text && (
        <Text
          style={{
            fontSize: 16,
            lineHeight: 24,
            marginBottom: 20,
          }}
        >
          {text}
        </Text>
      )}

      {/* CHỨC NĂNG: phân biệt lỗi dịch và lỗi giọng đọc.
          XỬ LÝ: thông báo qua i18n, không hiển thị lỗi kỹ thuật. */}
      {speechError && (
        <Text
          accessibilityRole="alert"
          style={{
            color: 'crimson',
            marginBottom: 16,
          }}
        >
          {t(`detail.${speechError}`)}
        </Text>
      )}

      {preparing && (
        <ActivityIndicator
          style={{ marginBottom: 16 }}
        />
      )}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Switch
          value={auto}
          onValueChange={setAuto}
        />

        <Text style={{ marginLeft: 8 }}>
          {t('detail.autoPlay')}
        </Text>
      </View>

      {speaking || preparing ? (
        <Button
          title={t('detail.stop')}
          onPress={stop}
        />
      ) : (
        <Button
          title={t('detail.play')}
          onPress={() => {
            void play()
          }}
          disabled={!text || loading || error}
        />
      )}
    </ScrollView>
  )
}