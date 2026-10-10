import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { LangCode } from '../i18n'
import { getSavedNarration, saveNarration } from '../i18n/storage'

// CHỨC NĂNG: mô tả những gì mọi màn hình có thể lấy từ Context này.
type SettingsValue = {
  narrationSetting: LangCode | null // lựa chọn của người dùng: null = "Theo giao diện"
  narrationLang: LangCode           // ngôn ngữ thuyết minh THỰC SỰ dùng (luôn có giá trị)
  setNarrationSetting: (code: LangCode | null) => Promise<boolean>
}

// XỬ LÝ: giá trị ban đầu null để bắt lỗi nếu quên bọc <SettingsProvider>.
const SettingsContext = createContext<SettingsValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation() // useTranslation làm Provider vẽ lại khi đổi ngôn ngữ giao diện
  const [narrationSetting, setSetting] = useState<LangCode | null>(null)
  const [loaded, setLoaded] = useState(false)

  // CHỨC NĂNG: chạy 1 lần lúc khởi động, đọc lựa chọn đã lưu.
  useEffect(() => {
    let cancelled = false
    getSavedNarration().then((saved) => {
      if (cancelled) return
      setSetting(saved)
      setLoaded(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  // CHỨC NĂNG: đổi lựa chọn → cập nhật state NGAY (giao diện đổi liền) rồi mới lưu xuống máy.
  // XỬ LÝ: trả về kết quả lưu để nơi gọi báo lỗi nếu cần.
  const setNarrationSetting = useCallback(async (code: LangCode | null) => {
    setSetting(code)
    return saveNarration(code)
  }, [])

  // XỬ LÝ: chưa đọc xong thì chưa vẽ app, để màn Chi tiết không dùng nhầm ngôn ngữ
  // rồi mới "nhảy" sang ngôn ngữ đã lưu. (Hook ở trên đã gọi hết nên return ở đây là hợp lệ.)
  if (!loaded) return null

  // CHỨC NĂNG (logic cốt lõi M2): có lựa chọn riêng thì dùng, không thì theo giao diện.
  const narrationLang = narrationSetting ?? (i18n.language as LangCode)

  return (
    <SettingsContext.Provider value={{ narrationSetting, narrationLang, setNarrationSetting }}>
      {children}
    </SettingsContext.Provider>
  )
}

// CHỨC NĂNG: hook cho các màn hình dùng.
export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings phải được dùng bên trong <SettingsProvider>')
  return ctx
}