import { useRef } from 'react'
import { Alert, FlatList, Pressable, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../navigation/types'
import { DEVICE_LANG, LANGUAGES, type LangCode } from '../i18n'
import { saveLanguage } from '../i18n/storage'

type Props = NativeStackScreenProps<RootStackParamList, 'Language'>

export default function LanguageScreen({ navigation, route }: Props) {
  const { t, i18n } = useTranslation()

  // CHỨC NĂNG: màn này dùng cho 2 tình huống.
  //  change = undefined → lần đầu mở app (có lời chào, chọn xong vào Home)
  //  change = true      → mở từ nút 🌐 ở Home (không chào, chọn xong quay lại)
  const change = route.params?.change
  const current = i18n.language as LangCode

  // XỬ LÝ: chặn bấm 2 lần liên tiếp (tránh gọi replace('Home') hai lần gây lỗi điều hướng).
  const busy = useRef(false)

  const choose = async (code: LangCode) => {
    if (busy.current) return
    busy.current = true

    await i18n.changeLanguage(code)       // 1. đổi giao diện ngay
    const saved = await saveLanguage(code) // 2. lưu cho lần mở sau

    // XỬ LÝ (UC01 luồng lỗi): lưu thất bại vẫn dùng ngôn ngữ trong phiên + báo người dùng
    if (!saved) Alert.alert(t('language.saveError'))

    // 3. điều hướng. replace → bấm Back không quay lại màn chọn
    if (change) navigation.goBack()
    else navigation.replace('Home')
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* CHỨC NĂNG: lời chào, chỉ hiện lần đầu.
          Viết nhiều thứ tiếng vì người dùng CHƯA chọn ngôn ngữ nên ai cũng phải đọc được. */}
      {!change && (
        <View style={{ marginTop: 8, marginBottom: 24 }}>
          <Text style={{ fontSize: 28, fontWeight: '700' }}>Welcome 👋</Text>
          <Text style={{ fontSize: 16, color: '#555', marginTop: 4 }}>Xin chào • ようこそ</Text>
          <Text style={{ marginTop: 12, color: '#555' }}>{t('language.subtitle')}</Text>
        </View>
      )}

      <FlatList
        data={LANGUAGES}
        keyExtractor={(l) => l.code}
        renderItem={({ item }) => {
          // selected: ngôn ngữ đang dùng (chỉ tô khi đổi từ Home)
          // suggested: ngôn ngữ của máy (chỉ gợi ý lần đầu)
          const selected = !!change && item.code === current
          const suggested = !change && item.code === DEVICE_LANG
          return (
            <Pressable
              onPress={() => choose(item.code)}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              style={{
                padding: 16,
                borderWidth: selected || suggested ? 2 : 1,
                borderColor: selected || suggested ? '#4F46E5' : '#ddd',
                borderRadius: 8,
                marginBottom: 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ fontSize: 18 }}>{item.label}</Text>
              {suggested && <Text style={{ color: '#4F46E5' }}>{t('language.suggested')}</Text>}
            </Pressable>
          )
        }}
      />
    </View>
  )
}