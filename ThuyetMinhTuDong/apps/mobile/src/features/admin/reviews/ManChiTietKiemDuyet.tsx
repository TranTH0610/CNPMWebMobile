/**
 * FILE: apps/mobile/src/features/admin/reviews/ManChiTietKiemDuyet.tsx
 * FILE NÀY LÀM GÌ: Xem đầy đủ một hồ sơ rồi duyệt, yêu cầu sửa hoặc công bố. ReviewsScreen mở qua mã id; dùng cùng API/revision với web, không tự công bố khi xem.
 * VAI TRÒ: Khởi tạo, điều hướng hoặc thành phần hỗ trợ ứng dụng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC12: Kiểm duyệt nội dung và âm thanh.
 * - UC13: Công bố phiên bản đã duyệt.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { useState } from 'react'
import { Alert, Text, View } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { categoryOf, type Language } from '@travelguide/visitor-core'
import type { ManagedPlace } from '@travelguide/admin-core'
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
import type { AdminStack } from '../../../navigation/KieuDieuHuongQuanTri'
import { useText } from '../../language/i18n/CauHinhNgonNgu'
import { Cover } from '../../../shared/components/AnhBia'
import { Action } from '../../../shared/components/NutThaoTac'
import {
  AudioPreview,
  Feedback,
  Field,
  Frame,
  LanguageTabs,
  PageHeader,
  SectionHeading,
  StatusBadge,
  styles,
} from '../shared/components/ThanhPhanQuanTri'

// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider ReviewDetailScreen.
// [UC12 / UC13] ReviewDetailScreen — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider ReviewDetailScreen.
export function ReviewDetailScreen({
  route,
  navigation,
}: NativeStackScreenProps<AdminStack, 'ReviewDetail'>) {
  const state = useAdmin(),
    t = useAdminText(),
    place = state.data?.places.find((p) => p.id === route.params.id)
  if (!place)
    return (
      <Frame>
        <Feedback state={state} />
        {!state.loading && !state.error && <Text style={styles.error}>{t('error_notFound')}</Text>}
      </Frame>
    )
  return (
    <Details
      key={place.id + place.revision + place.workflow}
      place={place}
      edit={() => navigation.navigate('Content', { id: place.id })}
    />
  )
}

// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider Details.
// [UC12 / UC13] Details — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider Details.
function Details({ place, edit }: { place: ManagedPlace; edit: () => void }) {
  const state = useAdmin(),
    t = useAdminText(),
    vt = useText()
  const [language, setLanguage] = useState<Language>('vi'),
    [note, setNote] = useState(place.reviewNote)
  const text = place.record.content[language]
  return (
    <Frame>
      <PageHeader title={place.record.canonicalTitle} />
      <View style={styles.row}>
        <StatusBadge workflow={place.workflow} />
        <Text style={styles.muted}>
          {t('revision')}: {place.revision}
        </Text>
      </View>
      <Feedback state={state} />
      <Cover uri={place.record.images[0]} style={{ height: 220, borderRadius: 18 }} />
      <LanguageTabs value={language} onChange={setLanguage} disabled={state.busy} />
      <View style={styles.card}>
        <SectionHeading title={t('basicInfo')} icon="business-outline" />
        <Text style={styles.heading}>{text?.title ?? t('none')}</Text>
        <Text style={styles.text}>{text?.summary}</Text>
        <Text style={styles.label}>{t('category')}</Text>
        <Text style={styles.text}>{vt(`category_${categoryOf(place.record)}`)}</Text>
        <Text style={styles.label}>{t('period')}</Text>
        <Text style={styles.text}>{place.period || t('none')}</Text>
        <Text style={styles.label}>{t('address')}</Text>
        <Text style={styles.text}>{text?.address || t('none')}</Text>
        <Text style={styles.label}>{t('locationSection')}</Text>
        <Text style={styles.text}>
          {place.record.position
            ? `${place.record.position.lat}, ${place.record.position.lng}`
            : t('none')}
        </Text>
      </View>
      <View style={styles.card}>
        <SectionHeading title={t('body')} icon="document-text-outline" />
        <Text style={styles.text}>{text?.body ?? t('none')}</Text>
        {text?.audio && (
          <AudioPreview key={language + text.audio.url} url={text.audio.url} title={text.title} />
        )}
      </View>
      {place.record.images.slice(1).map((uri, index) => (
        <Cover key={uri + index} uri={uri} style={{ height: 180, borderRadius: 16 }} />
      ))}
      <View style={styles.card}>
        <SectionHeading title={t('reviews')} icon="shield-checkmark-outline" />
        <Field label={t('note')} value={note} onChange={setNote} multiline editable={!state.busy} />
        {place.workflow === 'submitted' && (
          <>
            <Action
              title={t('approve')}
              icon="checkmark-circle-outline"
              variant="primary"
              disabled={state.busy}
              onPress={() => {
                void state.run(() => state.service.review(place.id, place.revision, true, note))
              }}
            />
            <Action
              title={t('reject')}
              icon="return-down-back-outline"
              disabled={state.busy || !note.trim()}
              onPress={() => {
                void state.run(() => state.service.review(place.id, place.revision, false, note))
              }}
            />
          </>
        )}
        {place.workflow === 'approved' && (
          <Action
            title={t('publish')}
            variant="primary"
            disabled={state.busy}
            onPress={() =>
              Alert.alert(t('publish'), t('confirmPublish'), [
                { text: t('cancel'), style: 'cancel' },
                {
                  text: t('publish'),
                  onPress: () => {
                    void state.run(() => state.service.publish(place.id, place.revision))
                  },
                },
              ])
            }
          />
        )}
        <Action title={t('content')} onPress={edit} disabled={state.busy} />
      </View>
    </Frame>
  )
}
