/**
 * FILE NÀY LÀM GÌ:
 * Hiển thị bài đọc đã công bố cho UC04.
 * Navigator mở từ danh sách hoặc QR.
 * Phụ thuộc service/hook chung và component UI.
 *
 * Không gọi TTS, không tự dịch và không tự phát âm thanh.
 */

import { useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import {
  availableLanguages,
  LANGUAGES,
  publishedText,
  type Language,
} from '@travelguide/visitor-core'

import {
  usePublishedPlace,
  useText,
  useVisitor,
} from '@travelguide/visitor-core/react'

import {
  Action,
  DemoNotice,
  LanguageBar,
  PlaceImage,
  State,
  ui,
} from './ui'

import type { VisitorStack } from './types'

// CHỨC NĂNG: Đọc dữ liệu theo placeId.
// XỬ LÝ: ID sai, lỗi tải và thiếu ngôn ngữ có trạng thái riêng.
export default function DetailScreen({
  route,
  navigation,
}: NativeStackScreenProps<VisitorStack, 'Detail'>) {
  const { placeId } = route.params

  const data = usePublishedPlace(placeId)
  const { language } = useVisitor()
  const t = useText()

  // CHỨC NĂNG: Cho đọc bản ngôn ngữ đã có khi thiếu bản hiện tại.
  // XỬ LÝ: Gắn lựa chọn với ID và ngôn ngữ UI;
  // đổi điểm hoặc ngôn ngữ UI thì không dùng lựa chọn cũ.
  const [choice, setChoice] = useState<{
    context: string
    language: Language
  }>()

  const context = placeId + '|' + language

  const selected = choice?.context === context
    ? choice.language
    : language

  const back = () => navigation.navigate('Places')

  if (data.loading) {
    return <State message="loading" busy />
  }

  if (data.error || !data.place) {
    return (
      <State
        message={data.error ?? 'notFound'}
        retry={data.retry}
        back={back}
      />
    )
  }

  const place = data.place
  const content = publishedText(place, selected)

  return (
    <SafeAreaView
      style={ui.page}
      edges={['bottom', 'left', 'right']}
    >
      <ScrollView contentContainerStyle={ui.content}>
        <LanguageBar />
        <DemoNotice />

        <PlaceImage
          uri={place.images[0]}
          title={place.canonicalTitle}
        />

        <Text style={ui.title}>
          {content?.title ?? place.canonicalTitle}
        </Text>

        <Text style={ui.muted}>{t('available')}</Text>

        <View style={ui.row}>
          {availableLanguages(place).map((code) => (
            <Action
              key={code}
              title={
                LANGUAGES.find(
                  (item) => item.code === code,
                )?.label ?? code
              }
              selected={selected === code}
              onPress={() => setChoice({
                context,
                language: code,
              })}
            />
          ))}
        </View>

        {content ? (
          <View style={ui.card}>
            <Text style={ui.muted}>{content.address}</Text>
            <Text style={ui.heading}>{t('read')}</Text>
            <Text style={ui.text}>{content.body}</Text>

            <Text style={ui.muted}>
              {t('version')}: {content.version}
            </Text>
          </View>
        ) : (
          <State message="missing" />
        )}

        <Text style={ui.muted}>
          {place.position?.verified
            ? t('coordinates')
              + ': '
              + place.position.lat
              + ', '
              + place.position.lng
            : t('unverified')}
        </Text>

        <Action title={t('back')} onPress={back} />
      </ScrollView>
    </SafeAreaView>
  )
}