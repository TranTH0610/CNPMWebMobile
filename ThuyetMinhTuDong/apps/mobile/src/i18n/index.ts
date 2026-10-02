import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getLocales } from 'expo-localization'
import vi from './locales/vi.json'
import en from './locales/en.json'
import ja from './locales/ja.json'

export const LANGUAGES = [
  { code: 'vi', label: 'Tiếng Việt', speech: 'vi-VN' },
  { code: 'en', label: 'English', speech: 'en-US' },
  { code: 'ja', label: '日本語', speech: 'ja-JP' },
] as const

export type LangCode = (typeof LANGUAGES)[number]['code']

const device = getLocales()[0]?.languageCode ?? 'vi'
const initial = LANGUAGES.some((l) => l.code === device) ? device : 'vi'

i18n.use(initReactI18next).init({
  resources: {
    vi: { translation: vi },
    en: { translation: en },
    ja: { translation: ja },
  },
  lng: initial,
  fallbackLng: 'vi',
  interpolation: { escapeValue: false },
})

export default i18n