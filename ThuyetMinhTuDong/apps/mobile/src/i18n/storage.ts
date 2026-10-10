import AsyncStorage from '@react-native-async-storage/async-storage'
import { LANGUAGES, type LangCode } from '.'

// CHỨC NĂNG: khóa lưu trong bộ nhớ máy. Giữ 'lang' để không mất lựa chọn cũ.
const LANG_KEY = 'lang'

// CHỨC NĂNG: đọc ngôn ngữ đã lưu.
// XỬ LÝ:
//  - trả null nếu CHƯA từng chọn → đây là tín hiệu "lần đầu mở app"
//  - trả null nếu giá trị lưu không còn nằm trong danh sách hỗ trợ
//  - trả null nếu đọc bộ nhớ lỗi → app vẫn chạy, chỉ cho chọn lại
export async function getSavedLanguage(): Promise<LangCode | null> {
  try {
    const saved = await AsyncStorage.getItem(LANG_KEY)
    return LANGUAGES.find((l) => l.code === saved)?.code ?? null
  } catch {
    return null
  }
}

// CHỨC NĂNG: lưu lựa chọn.
// XỬ LÝ: trả true/false thay vì ném lỗi, để màn hình biết mà báo người dùng
// (UC01 luồng lỗi: "không lưu được → vẫn dùng ngôn ngữ trong phiên + thông báo").
export async function saveLanguage(code: LangCode): Promise<boolean> {
  try {
    await AsyncStorage.setItem(LANG_KEY, code)
    return true
  } catch {
    return false
  }
}
const NARRATION_KEY = 'narration_lang'

// CHỨC NĂNG: đọc ngôn ngữ thuyết minh đã lưu.
// XỬ LÝ: trả null nghĩa là "theo giao diện" (chưa đặt riêng, giá trị lạ, hoặc đọc lỗi).
export async function getSavedNarration(): Promise<LangCode | null> {
  try {
    const saved = await AsyncStorage.getItem(NARRATION_KEY)
    return LANGUAGES.find((l) => l.code === saved)?.code ?? null
  } catch {
    return null
  }
}

// CHỨC NĂNG: lưu ngôn ngữ thuyết minh.
// XỬ LÝ: truyền null = chọn "Theo giao diện" → XÓA khóa đi (không lưu chữ "null").
// Trả true/false để màn hình báo người dùng nếu lưu lỗi.
export async function saveNarration(code: LangCode | null): Promise<boolean> {
  try {
    if (code === null) await AsyncStorage.removeItem(NARRATION_KEY)
    else await AsyncStorage.setItem(NARRATION_KEY, code)
    return true
  } catch {
    return false
  }
}