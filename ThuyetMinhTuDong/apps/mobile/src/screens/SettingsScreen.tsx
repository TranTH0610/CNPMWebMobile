import { Alert, Pressable, ScrollView, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { LANGUAGES, type LangCode } from '../i18n'
import { saveLanguage } from '../i18n/storage'
import { useSettings } from '../store/SettingsContext'

// CHỨC NĂNG: một dòng lựa chọn dùng lại cho cả 2 danh sách.
// selected = true → viền đậm màu chính để người dùng biết đang chọn cái nào.
function Option({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      style={{
        padding: 16,
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? '#4F46E5' : '#ddd',
        borderRadius: 8,
        marginBottom: 10,
      }}
    >
      <Text style={{ fontSize: 17 }}>{label}</Text>
    </Pressable>
  )
}

const heading = { fontSize: 18, fontWeight: '600' as const, marginBottom: 10 }

export default function SettingsScreen() {
  const { t, i18n } = useTranslation()
  const { narrationSetting, setNarrationSetting } = useSettings()
  const uiLang = i18n.language as LangCode

  // CHỨC NĂNG: đổi ngôn ngữ giao diện. Giống M1: đổi ngay rồi mới lưu.
  // XỬ LÝ: lưu lỗi vẫn dùng được trong phiên này và báo người dùng (UC01/UC02 luồng lỗi).
  const chooseInterface = async (code: LangCode) => {
    await i18n.changeLanguage(code)
    const saved = await saveLanguage(code)
    if (!saved) Alert.alert(t('language.saveError'))
  }

  // CHỨC NĂNG: đổi ngôn ngữ thuyết minh. code = null nghĩa là "Theo giao diện".
  const chooseNarration = async (code: LangCode | null) => {
    const saved = await setNarrationSetting(code)
    if (!saved) Alert.alert(t('language.saveError'))
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {/* ---- Phần 1: ngôn ngữ giao diện ---- */}
      <Text style={heading}>{t('settings.interface')}</Text>
      {LANGUAGES.map((l) => (
        <Option key={l.code} label={l.label} selected={uiLang === l.code} onPress={() => chooseInterface(l.code)} />
      ))}

      {/* ---- Phần 2: ngôn ngữ thuyết minh ---- */}
      <Text style={[heading, { marginTop: 20 }]}>{t('settings.narration')}</Text>
      {/* Dòng đặc biệt: null = đi theo ngôn ngữ giao diện */}
      <Option
        label={t('settings.followInterface')}
        selected={narrationSetting === null}
        onPress={() => chooseNarration(null)}
      />
      {LANGUAGES.map((l) => (
        <Option
          key={l.code}
          label={l.label}
          selected={narrationSetting === l.code}
          onPress={() => chooseNarration(l.code)}
        />
      ))}
    </ScrollView>
  )
}