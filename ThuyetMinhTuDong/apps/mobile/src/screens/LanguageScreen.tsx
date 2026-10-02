import { FlatList, Pressable, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../navigation/types'
import { LANGUAGES, type LangCode } from '../i18n'
import { saveLanguage } from '../i18n/storage'

type Props = NativeStackScreenProps<RootStackParamList, 'Language'>

export default function LanguageScreen({ navigation, route }: Props) {
  const { t, i18n } = useTranslation()
  const change = route.params?.change // true nếu mở từ nút 🌐 ở Home
  const current = i18n.language as LangCode

  const choose = async (code: LangCode) => {
    await i18n.changeLanguage(code) // đổi giao diện ngay
    await saveLanguage(code)        // nhớ cho lần mở sau
    if (change) navigation.goBack()
    else navigation.replace('Home')
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {!change && (
        <View style={{ marginTop: 8, marginBottom: 24 }}>
          {/* Cố ý viết nhiều thứ tiếng: người dùng chưa chọn ngôn ngữ nên cần ai cũng đọc được */}
          <Text style={{ fontSize: 28, fontWeight: '700' }}>Welcome 👋</Text>
          <Text style={{ fontSize: 16, color: '#555', marginTop: 4 }}>Xin chào • ようこそ</Text>
          <Text style={{ marginTop: 12, color: '#555' }}>{t('language.subtitle')}</Text>
        </View>
      )}

      <FlatList
        data={LANGUAGES}
        keyExtractor={(l) => l.code}
        renderItem={({ item }) => {
          const selected = change && item.code === current
          return (
            <Pressable
              onPress={() => choose(item.code)}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              style={{
                padding: 16,
                borderWidth: selected ? 2 : 1,
                borderColor: selected ? '#4F46E5' : '#ddd',
                borderRadius: 8,
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 18 }}>{item.label}</Text>
            </Pressable>
          )
        }}
      />
    </View>
  )
}