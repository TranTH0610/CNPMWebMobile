/**
 * FILE NÀY LÀM GÌ:
 * Hiển thị chi tiết và bài đọc theo ngôn ngữ chung của ứng dụng.
 *
 * Được dùng bởi:
 * - Navigator trong App.tsx.
 *
 * Phụ thuộc:
 * - visitor-core/react.
 * - Các component trong ui.tsx.
 *
 * Liên quan: UC01, UC04.
 */

import {
  ScrollView,
  Text,
  View,
} from 'react-native'

import {
  SafeAreaView,
} from 'react-native-safe-area-context'

import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack'

import {
  availableLanguages,
  LANGUAGES,
  publishedText,
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

import type {
  VisitorStack,
} from './types'

// CHỨC NĂNG: Tải đúng địa điểm theo tham số điều hướng.
// XỬ LÝ: ID sai, lỗi tải và thiếu bản ngôn ngữ được xử lý riêng.
export default function DetailScreen({
  route,
  navigation,
}: NativeStackScreenProps<
  VisitorStack,
  'Detail'
>) {
  const { placeId } = route.params

  const data = usePublishedPlace(placeId)

  const {
    language,
    changeLanguage,
    saving,
  } = useVisitor()

  const t = useText()

  // CHỨC NĂNG: Quay về danh sách.
  // XỬ LÝ: Hoạt động cả khi mở chi tiết từ QR.
  const back = () => {
    navigation.navigate('Places')
  }

  if (data.loading) {
    return (
      <State
        message="loading"
        busy
      />
    )
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

  // CHỨC NĂNG: Chọn bài đọc bằng ngôn ngữ đang dùng trên giao diện.
  // XỬ LÝ: Không giữ useState riêng cho ngôn ngữ bài đọc.
  // Khi provider đổi language, tiêu đề/tab/bài đọc cùng render lại.
  const content = publishedText(
    place,
    language,
  )

  return (
    <SafeAreaView
      style={ui.page}
      edges={['bottom', 'left', 'right']}
    >
      <ScrollView
        contentContainerStyle={ui.content}
      >
        <LanguageBar />

        <DemoNotice />

        <PlaceImage
          uri={place.images[0]}
          title={place.canonicalTitle}
        />

        <Text style={ui.title}>
          {content?.title ?? place.canonicalTitle}
        </Text>

        <Text style={ui.muted}>
          {t('available')}
        </Text>

        <View style={ui.row}>
          {availableLanguages(place).map(
            (code) => (
              <Action
                key={code}
                title={
                  LANGUAGES.find(
                    (item) =>
                      item.code === code,
                  )?.label ?? code
                }
                selected={language === code}
                disabled={saving}
                onPress={() => {
                  // CHỨC NĂNG: Đổi ngôn ngữ cho toàn ứng dụng.
                  // XỬ LÝ: Provider cập nhật i18n và lưu AsyncStorage.
                  void changeLanguage(code)
                }}
              />
            ),
          )}
        </View>

        {content ? (
          <View style={ui.card}>
            <Text style={ui.muted}>
              {content.address}
            </Text>

            <Text style={ui.heading}>
              {t('read')}
            </Text>

            <Text style={ui.text}>
              {content.body}
            </Text>

            <Text style={ui.muted}>
              {t('version')}: {content.version}
            </Text>
          </View>
        ) : (
          <State message="missing" />
        )}

        <Text style={ui.muted}>
          {place.position?.verified
            ? (
              t('coordinates')
              + ': '
              + place.position.lat
              + ', '
              + place.position.lng
            )
            : t('unverified')}
        </Text>

        <Action
          title={t('back')}
          onPress={back}
        />
      </ScrollView>
    </SafeAreaView>
  )
}