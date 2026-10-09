import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getLocales } from 'expo-localization'
import vi from './locales/vi.json'
import en from './locales/en.json'
import ja from './locales/ja.json'

// CHỨC NĂNG: danh sách ngôn ngữ app hỗ trợ (nguồn dữ liệu duy nhất).
//  - code:  mã dùng trong code
//  - label: tên viết bằng CHÍNH ngôn ngữ đó để người dùng nhận ra
//  - speech: mã giọng đọc cho expo-speech
// `as const` để TypeScript suy ra kiểu LangCode bên dưới.
export const LANGUAGES = [
  { code: 'vi', label: 'Tiếng Việt', speech: 'vi-VN' },
  { code: 'en', label: 'English', speech: 'en-US' },
  { code: 'ja', label: '日本語', speech: 'ja-JP' },
] as const

// CHỨC NĂNG: kiểu 'vi' | 'en' | 'ja', tự cập nhật khi thêm dòng vào LANGUAGES.
export type LangCode = (typeof LANGUAGES)[number]['code']

// CHỨC NĂNG: tìm ngôn ngữ của điện thoại.
// XỬ LÝ: nếu app KHÔNG hỗ trợ ngôn ngữ máy (vd tiếng Pháp) → null.
// Dùng để "gợi ý" ở màn chọn ngôn ngữ (UC01 luồng thay thế).
const deviceCode = getLocales()[0]?.languageCode ?? ''
export const DEVICE_LANG: LangCode | null =
  LANGUAGES.find((l) => l.code === deviceCode)?.code ?? null

// CHỨC NĂNG: khởi tạo thư viện i18n, đăng ký 3 file dịch.
// XỬ LÝ: fallbackLng 'vi' → thiếu chuỗi ở ngôn ngữ nào thì dùng tiếng Việt.
// lng chỉ là giá trị TẠM; RootNavigator sẽ ghi đè bằng lựa chọn đã lưu.
i18n.use(initReactI18next).init({
  resources: {
    vi: { translation: vi },
    en: { translation: en },
    ja: { translation: ja },
  },
  lng: DEVICE_LANG ?? 'vi',
  fallbackLng: 'vi',
  interpolation: { escapeValue: false },
})

export default i18n