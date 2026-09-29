import { useEffect } from 'react'
import { FlatList, Pressable, Text, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTranslation } from 'react-i18next'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../navigation/types'
import { LANGUAGES } from '../i18n'

type Props = NativeStackScreenProps<RootStackParamList, 'Language'>

const LANG_KEY = 'lang'

export default function LanguageScreen({ navigation, route }: Props) {
  const { i18n } = useTranslation()
  const change = route.params?.change

  // Lần đầu mở app: nếu đã chọn ngôn ngữ trước đó thì vào thẳng danh sách
  useEffect(() => {
    if (change) return
    AsyncStorage.getItem(LANG_KEY).then(async (saved) => {
      if (saved && LANGUAGES.some((l) => l.code === saved)) {
        await i18n.changeLanguage(saved)
        navigation.replace('Home')
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const choose = async (code: string) => {
    await i18n.changeLanguage(code)
    await AsyncStorage.setItem(LANG_KEY, code)
    if (change) navigation.goBack()
    else navigation.replace('Home')
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={LANGUAGES}
        keyExtractor={(l) => l.code}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => choose(item.code)}
            style={{ padding: 16, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 12 }}
          >
            <Text style={{ fontSize: 18 }}>{item.label}</Text>
          </Pressable>
        )}
      />
    </View>
  )
}