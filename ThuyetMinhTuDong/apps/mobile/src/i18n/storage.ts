import AsyncStorage from '@react-native-async-storage/async-storage'
import { LANGUAGES, type LangCode } from './index'

const LANG_KEY = 'lang'

// Đọc ngôn ngữ đã lưu. Trả về null nếu CHƯA từng chọn (lần đầu mở app)
export async function getSavedLanguage(): Promise<LangCode | null> {
  const saved = await AsyncStorage.getItem(LANG_KEY)
  const found = LANGUAGES.find((l) => l.code === saved)
  return found ? found.code : null
}

export async function saveLanguage(code: LangCode) {
  await AsyncStorage.setItem(LANG_KEY, code)
}