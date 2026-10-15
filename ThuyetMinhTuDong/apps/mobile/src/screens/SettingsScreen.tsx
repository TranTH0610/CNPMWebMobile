/**
 * FILE NÀY LÀM GÌ:
 * Cho phép đổi ngôn ngữ giao diện và thuyết minh.
 * Khi đổi giao diện, tự đưa thuyết minh về chế độ theo giao diện.
 *
 * Được mở bởi: route Settings trong RootNavigator.
 *
 * Phụ thuộc:
 * - i18n và storage ngôn ngữ
 * - SettingsContext
 * - navigation/types
 * - theme
 *
 * Liên quan: chọn ngôn ngữ, cấu hình thuyết minh và header đa ngôn ngữ.
 */

import {
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import {
  Alert,
  Pressable,
  ScrollView,
  Text,
} from 'react-native'

import { useTranslation } from 'react-i18next'

import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack'

import {
  LANGUAGES,
  type LangCode,
} from '../i18n'

import { saveLanguage } from '../i18n/storage'
import { useSettings } from '../store/SettingsContext'

import type {
  RootStackParamList,
} from '../navigation/types'

import {
  colors,
  fonts,
  radii,
  sizes,
  spacing,
  ui,
} from '../theme'

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Settings'
>

type OptionProps = {
  label: string
  selected: boolean
  disabled: boolean
  onPress: () => void
}

// CHỨC NĂNG: hiển thị một lựa chọn ngôn ngữ.
// XỬ LÝ: dùng lại cho cả giao diện và thuyết minh;
// khóa thao tác trong lúc đang lưu để tránh hai lựa chọn chạy chồng.
function Option({
  label,
  selected,
  disabled,
  onPress,
}: OptionProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{
        selected,
        disabled,
      }}
      accessibilityLabel={label}
      style={{
        minHeight: sizes.touch,
        padding: spacing.lg,
        borderWidth: selected ? 2 : 1,
        borderColor: selected
          ? colors.primary
          : colors.border,
        borderRadius: radii.sm,
        marginBottom: spacing.md,
        backgroundColor: colors.background,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <Text style={ui.body}>
        {label}
      </Text>
    </Pressable>
  )
}

export default function SettingsScreen({
  navigation,
}: Props) {
  const { t, i18n } = useTranslation()

  const {
    narrationSetting,
    setNarrationSetting,
  } = useSettings()

  const uiLang =
    LANGUAGES.find(
      (language) => language.code === i18n.language,
    )?.code ?? 'vi'

  const [pending, setPending] = useState(false)

  // CHỨC NĂNG: chặn hai lần bấm xảy ra quá gần nhau.
  // XỬ LÝ: ref đổi ngay lập tức, không phải chờ React render
  // như state pending.
  const busy = useRef(false)

  // CHỨC NĂNG: cập nhật cả tiêu đề và chữ nút quay lại.
  // XỬ LÝ:
  // - title: tên màn Cài đặt.
  // - headerBackTitle: chữ cạnh mũi tên quay lại trên iOS.
  // - Đặt trên chính màn đang hiển thị, không chỉ sửa title
  //   của Home đang nằm phía sau.
  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('settings.title'),
      headerBackTitle: t('tabs.explore'),
      headerBackTitleVisible: true,
    })
  }, [navigation, t, uiLang])

  // CHỨC NĂNG: đổi giao diện và đồng bộ chế độ thuyết minh.
  // XỬ LÝ:
  // 1. Bỏ lựa chọn thuyết minh riêng bằng cách đặt null.
  // 2. Đổi ngôn ngữ giao diện.
  // 3. Lưu ngôn ngữ cho lần mở ứng dụng sau.
  //
  // null không có nghĩa là không có ngôn ngữ.
  // Trong SettingsContext, null nghĩa là "Theo giao diện".
  const chooseInterface = async (
    code: LangCode,
  ): Promise<void> => {
    if (busy.current) return

    busy.current = true
    setPending(true)

    try {
      const narrationSaved =
        await setNarrationSetting(null)

      await i18n.changeLanguage(code)

      const interfaceSaved =
        await saveLanguage(code)

      // CHỨC NĂNG: thông báo khi lưu thất bại.
      // XỬ LÝ: trạng thái trong phiên hiện tại vẫn đã cập nhật;
      // dùng i18n.t để thông báo theo ngôn ngữ mới nhất.
      if (!narrationSaved || !interfaceSaved) {
        Alert.alert(
          i18n.t('language.saveError'),
        )
      }
    } catch {
      Alert.alert(
        i18n.t('language.saveError'),
      )
    } finally {
      busy.current = false
      setPending(false)
    }
  }

  // CHỨC NĂNG: vẫn cho phép chọn riêng ngôn ngữ thuyết minh.
  // XỬ LÝ:
  // - code cụ thể: dùng ngôn ngữ đó.
  // - null: theo ngôn ngữ giao diện.
  // - Lần đổi giao diện tiếp theo sẽ đưa về null trở lại.
  const chooseNarration = async (
    code: LangCode | null,
  ): Promise<void> => {
    if (busy.current) return

    busy.current = true
    setPending(true)

    try {
      const saved =
        await setNarrationSetting(code)

      if (!saved) {
        Alert.alert(
          i18n.t('language.saveError'),
        )
      }
    } catch {
      Alert.alert(
        i18n.t('language.saveError'),
      )
    } finally {
      busy.current = false
      setPending(false)
    }
  }

  return (
    <ScrollView
      style={ui.page}
      contentContainerStyle={ui.content}
    >
      <Text
        style={{
          fontSize: fonts.section,
          fontWeight: '700',
          color: colors.text,
          marginBottom: spacing.md,
        }}
      >
        {t('settings.interface')}
      </Text>

      {LANGUAGES.map((language) => (
        <Option
          key={language.code}
          label={language.label}
          selected={uiLang === language.code}
          disabled={pending}
          onPress={() => {
            void chooseInterface(language.code)
          }}
        />
      ))}

      <Text
        style={{
          fontSize: fonts.section,
          fontWeight: '700',
          color: colors.text,
          marginTop: spacing.xl,
          marginBottom: spacing.md,
        }}
      >
        {t('settings.narration')}
      </Text>

      <Option
        label={t('settings.followInterface')}
        selected={narrationSetting === null}
        disabled={pending}
        onPress={() => {
          void chooseNarration(null)
        }}
      />

      {LANGUAGES.map((language) => (
        <Option
          key={language.code}
          label={language.label}
          selected={
            narrationSetting === language.code
          }
          disabled={pending}
          onPress={() => {
            void chooseNarration(language.code)
          }}
        />
      ))}
    </ScrollView>
  )
}