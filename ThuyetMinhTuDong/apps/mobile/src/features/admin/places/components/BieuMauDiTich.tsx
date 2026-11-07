/**
 * CHỨC NĂNG: [QUAN-LY-DI-TICH] [LUU-NHAP]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Hiển thị form thêm/sửa di tích; chuyển thao tác lưu, dịch, tạo audio và gửi duyệt cho hook.
 *
 * VỊ TRÍ: apps/mobile/src/features/admin/places/components/BieuMauDiTich.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/features/admin/content/ManBienTapNoiDung.tsx
 * - apps/mobile/src/features/admin/places/ManThemSuaDiTich.tsx
 *
 * PHỤ THUỘC:
 * - react-native
 * - @travelguide/visitor-core
 * - @travelguide/admin-core
 * - @travelguide/admin-core/react
 * - ../../../language/i18n/CauHinhNgonNgu
 * - ../../../../shared/GiaoDienChung
 * - ../../../../shared/components/NutThaoTac
 * - ./ChinhSuaAnhDiTich
 * - ../../shared/components/ChonTepTuThietBi
 * - ../../shared/components/ThanhPhanQuanTri
 *
 * CÁC KHỐI CHÍNH:
 * 1. PlaceEditor
 * 2. EditorForm
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { ActivityIndicator, Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native'
import { CATEGORIES } from '@travelguide/visitor-core'
import type { ManagedPlace } from '@travelguide/admin-core'
import {
  useAdmin,
  useAdminText,
  usePlaceEditor,
  type PlaceEditorAction,
} from '@travelguide/admin-core/react'
import { useText } from '../../../language/i18n/CauHinhNgonNgu'
import { colors } from '../../../../shared/GiaoDienChung'
import { Action } from '../../../../shared/components/NutThaoTac'
import { PlaceImagesEditor } from './ChinhSuaAnhDiTich'
import { LocalMediaPicker } from '../../shared/components/ChonTepTuThietBi'
import {
  AudioPreview,
  DangerAction,
  Feedback,
  Field,
  Frame,
  LanguageTabs,
  PageHeader,
  SectionHeading,
  StatusBadge,
  styles,
  useUnsaved,
} from '../../shared/components/ThanhPhanQuanTri'

type Props = {
  id?: string
  onCreated: (id: string) => void
  onLeave: () => void
  onSubmitted: () => void
  submittedNotice?: boolean
}

// CHỨC NĂNG: Đợi dữ liệu trước khi tạo vùng đang nhập của form.
// XỬ LÝ: Không coi lỗi tải dữ liệu là một form thêm mới trống.
// ==================== [QUAN-LY-DI-TICH] [LUU-NHAP] PlaceEditor ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function PlaceEditor(props: Props) {
  const state = useAdmin(),
    t = useAdminText()
  const place = state.data?.places.find((item) => item.id === props.id)
  if (state.loading || (state.error && !state.data))
    return (
      <Frame>
        <Feedback state={state} />
      </Frame>
    )
  if (props.id && !place)
    return (
      <Frame>
        <Text style={styles.error}>{t('error_notFound')}</Text>
      </Frame>
    )
  return <EditorForm key={props.id ?? 'new'} {...props} initial={place} />
}

// ==================== [QUAN-LY-DI-TICH] [LUU-NHAP] EditorForm ====================
// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider EditorForm.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
function EditorForm({
  initial,
  onCreated,
  onLeave,
  onSubmitted,
  submittedNotice,
}: Props & { initial?: ManagedPlace }) {
  const state = useAdmin(),
    t = useAdminText(),
    vt = useText()
  const editor = usePlaceEditor(state, initial, t)
  const {
    saved,
    current,
    language,
    setLanguage,
    title,
    text,
    category,
    setCategory,
    period,
    setPeriod,
    lat,
    setLat,
    lng,
    setLng,
    verified,
    setVerified,
    images,
    setImages,
    dirty,
    setDirty,
    autoTranslate,
    setAutoTranslate,
    disabled,
    progress,
    edit,
  } = editor
  const allowLeave = useUnsaved(dirty)

  // CHỨC NĂNG: Chạy cùng tác vụ với web; nhận đúng mã SQL sau khi thêm mới.
  // TẠI SAO: Thử lại sau lỗi dịch/audio tiếp tục nháp cũ, không tạo thêm một di tích.
  async function perform(action: PlaceEditorAction) {
    const ok = await editor.perform(action)
    if (ok && action === 'submit') {
      allowLeave()
      onSubmitted()
      return
    }
    if (ok && !initial && current.current) {
      allowLeave()
      onCreated(current.current.id)
    }
  }

  function confirm(title: string, message: string, action: () => void, destructive = false) {
    Alert.alert(title, message, [
      { text: t('cancel'), style: 'cancel' },
      { text: title, style: destructive ? 'destructive' : 'default', onPress: action },
    ])
  }

  return (
    <Frame>
      <PageHeader title={saved?.record.canonicalTitle ?? t('new')} />
      {saved && (
        <View style={styles.row}>
          <StatusBadge workflow={saved.workflow} />
          <Text style={styles.muted}>
            {t('revision')}: {saved.revision}
          </Text>
        </View>
      )}
      {(submittedNotice || editor.submittedSuccess) && !dirty && !saved && (
        <View style={styles.notice}>
          <Text style={styles.label} accessibilityLiveRegion="polite">
            {t('submittedSuccess')}
          </Text>
        </View>
      )}
      <Feedback
        state={{ ...state, success: state.success && !editor.submittedSuccess && !dirty }}
      />
      {state.error === 'conflict' && (
        <Action
          title={t('retry')}
          icon="refresh-outline"
          onPress={() =>
            confirm(t('retry'), t('unsaved'), () => {
              void state.run(editor.reloadDraft)
            })
          }
        />
      )}
      <LanguageTabs value={language} onChange={setLanguage} disabled={state.busy} />

      {/* CHỨC NĂNG: Gom tên và bài đọc trong một khối; giữ dữ liệu tab khác khi chuyển ngôn ngữ. */}
      <View style={styles.card}>
        <SectionHeading title={t('basicInfo')} icon="document-text-outline" />
        <Field
          label={t('title')}
          value={language === 'vi' ? title : text.title}
          editable={!disabled}
          onChange={(value) => edit('title', value)}
        />
        <Text style={styles.label}>{t('category')}</Text>
        <View style={styles.row}>
          {CATEGORIES.map((code) => (
            <Pressable
              key={code}
              disabled={disabled}
              accessibilityRole="button"
              accessibilityLabel={vt(`category_${code}`)}
              accessibilityState={{ selected: category === code, disabled }}
              onPress={() => {
                setCategory(code)
                setDirty(true)
              }}
              style={[styles.languageChip, category === code && local.selectedChip]}
            >
              <Text style={[local.chipText, category === code && local.selectedText]}>
                {vt(`category_${code}`)}
              </Text>
            </Pressable>
          ))}
        </View>
        <Field
          label={t('period')}
          value={period}
          editable={!disabled}
          onChange={(value) => {
            setPeriod(value)
            setDirty(true)
          }}
        />
        <Field
          label={t('summary')}
          value={text.summary}
          editable={!disabled}
          onChange={(value) => edit('summary', value)}
          multiline
        />
        <Field
          label={t('address')}
          value={text.address}
          editable={!disabled}
          onChange={(value) => edit('address', value)}
        />
        <Field
          label={t('body')}
          value={text.body}
          editable={!disabled}
          onChange={(value) => edit('body', value)}
          multiline
          minHeight={240}
          maxLength={20000}
        />
      </View>

      <View style={styles.card}>
        <SectionHeading title={t('locationSection')} icon="location-outline" />
        <View style={local.coordinates}>
          <View style={local.column}>
            <Field
              label={t('lat')}
              value={lat}
              editable={!disabled}
              keyboardType="decimal-pad"
              onChange={(value) => {
                setLat(value)
                setDirty(true)
              }}
            />
          </View>
          <View style={local.column}>
            <Field
              label={t('lng')}
              value={lng}
              editable={!disabled}
              keyboardType="decimal-pad"
              onChange={(value) => {
                setLng(value)
                setDirty(true)
              }}
            />
          </View>
        </View>
        <View style={local.toggle}>
          <Text style={[styles.label, local.grow]}>{t('verified')}</Text>
          <Switch
            disabled={disabled}
            accessibilityLabel={t('verified')}
            value={verified}
            onValueChange={(value) => {
              setVerified(value)
              setDirty(true)
            }}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>
      </View>

      <View style={styles.card}>
        <SectionHeading title={t('mediaSection')} icon="images-outline" />
        <PlaceImagesEditor
          value={images}
          disabled={disabled}
          onChange={(value) => {
            setImages(value)
            setDirty(true)
          }}
        />
        <View style={styles.divider} />
        <Field
          label={t('audio')}
          value={text.audioUrl?.startsWith('data:') ? t('localFile') : (text.audioUrl ?? '')}
          editable={!disabled && !text.audioUrl?.startsWith('data:')}
          onChange={(value) => edit('audioUrl', value)}
        />
        <LocalMediaPicker
          kind="audio"
          disabled={disabled}
          onPick={(value) => edit('audioUrl', value)}
        />
        {text.audioUrl?.startsWith('data:') && (
          <Action title={t('clearFile')} disabled={disabled} onPress={() => edit('audioUrl', '')} />
        )}
        {!dirty && saved?.record.content[language]?.audio && (
          <AudioPreview
            url={saved.record.content[language]!.audio!.url}
            title={saved.record.content[language]!.title}
          />
        )}
      </View>

      {/* CHỨC NĂNG: Tách lưu nháp khỏi gửi duyệt; không có lệnh công bố trong form này. */}
      <View style={styles.card}>
        <SectionHeading title={t('workflowSection')} icon="layers-outline" />
        <View style={local.toggle}>
          <Text style={[styles.label, local.grow]}>{t('autoTranslate')}</Text>
          <Switch
            disabled={disabled}
            accessibilityLabel={t('autoTranslate')}
            value={autoTranslate}
            onValueChange={setAutoTranslate}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>
        <View style={local.actionGrid}>
          <View style={local.actionCell}>
            <Action
              title={t('translateAll')}
              icon="language-outline"
              disabled={disabled}
              onPress={() =>
                confirm(t('translateAll'), t('confirmTranslate'), () => {
                  void perform('translate')
                })
              }
            />
          </View>
          <View style={local.actionCell}>
            <Action
              title={t('audioAll')}
              icon="musical-notes-outline"
              disabled={disabled}
              onPress={() => {
                void perform('audio')
              }}
            />
          </View>
        </View>
        <View style={styles.divider} />
        <Action
          title={t('save')}
          icon="save-outline"
          disabled={disabled}
          onPress={() => {
            void perform('save')
          }}
        />
        <Action
          title={t('submit')}
          icon="paper-plane-outline"
          variant="primary"
          disabled={
            disabled || Boolean(saved && !dirty && !['draft', 'changes'].includes(saved.workflow))
          }
          onPress={() => {
            void perform('submit')
          }}
        />
        {!!saved?.reviewNote && <Text style={styles.text}>{saved.reviewNote}</Text>}
      </View>
      {!!progress && (
        <View style={local.progress} accessibilityLiveRegion="polite">
          <ActivityIndicator color={colors.primary} />
          <Text style={[styles.label, local.grow]}>{progress}</Text>
        </View>
      )}
      {saved && (
        <View style={local.footer}>
          {saved.workflow !== 'archived' && (
            <Action
              title={t('archive')}
              icon="archive-outline"
              disabled={state.busy}
              onPress={() =>
                confirm(
                  t('archive'),
                  t('confirmArchive'),
                  () => {
                    void state
                      .run(() => state.service.archive(saved.id, saved.revision))
                      .then((ok) => {
                        if (ok) {
                          allowLeave()
                          onLeave()
                        }
                      })
                  },
                  true,
                )
              }
            />
          )}
          <DangerAction
            title={t('delete')}
            disabled={state.busy}
            onPress={() =>
              confirm(
                t('delete'),
                t('confirmDelete'),
                () => {
                  void state
                    .run(() => state.service.deletePlace(saved.id, saved.revision))
                    .then((ok) => {
                      if (ok) {
                        allowLeave()
                        onLeave()
                      }
                    })
                },
                true,
              )
            }
          />
        </View>
      )}
    </Frame>
  )
}

// CHỨC NĂNG: Style chỉ cho form; màu dùng lại theme và không ảnh hưởng màn du khách.
const local = StyleSheet.create({
  coordinates: { flexDirection: 'row', gap: 12 },
  column: { flex: 1, minWidth: 0 },
  grow: { flex: 1 },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 },
  selectedChip: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 12, fontWeight: '600', color: colors.muted },
  selectedText: { color: colors.white },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  actionCell: { flexBasis: 140, flexGrow: 1 },
  progress: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.soft,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  footer: { gap: 10, paddingTop: 4 },
})
