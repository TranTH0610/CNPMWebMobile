/**
 * FILE NÀY LÀM GÌ:
 * Chuẩn bị nội dung thuyết minh đúng ngôn ngữ, ưu tiên bản có sẵn,
 * sau đó cache, cuối cùng mới gọi dịch.
 *
 * Được dùng bởi: screens/DetailScreen.tsx.
 *
 * Phụ thuộc:
 * - services/places.ts
 * - services/translate.ts
 * - services/placeStore.ts
 *
 * Liên quan: UC02, tự dịch, cache và xử lý lỗi.
 */

import { useEffect, useState } from 'react'

import type { Place } from '../services/places'
import type { LangCode } from '../i18n'

import {
  TRANSLATION_CACHE_VERSION,
  translateLong,
} from '../services/translate'

import {
  getSavedTranslation,
  saveTranslation,
} from '../services/placeStore'

// CHỨC NĂNG: giữ trạng thái của một lần chuẩn bị nội dung.
// XỬ LÝ: key xác định địa điểm, ngôn ngữ và nội dung nguồn.
// Nhờ đó không hiển thị văn bản của ngôn ngữ cũ trong lúc đổi.
type TextState = {
  key: string
  text: string | null
  loading: boolean
  error: boolean
}

export function usePlaceText(
  place: Place | undefined,
  lang: LangCode,
) {
  const [attempt, setAttempt] = useState(0)

  const source = place?.description.vi ?? ''

  // CHỨC NĂNG: tạo khóa cache mới cho cơ chế đã sửa.
  // XỬ LÝ:
  // - Không đọc khóa cũ dạng id|lang.
  // - Không cần xóa toàn bộ AsyncStorage.
  // - Có nội dung nguồn để tránh cache cũ khi sửa mô tả.
  const key = place
    ? `detail|${TRANSLATION_CACHE_VERSION}|` +
      `${place.id}|${lang}|${source}`
    : ''

  const [state, setState] = useState<TextState>({
    key: '',
    text: null,
    loading: false,
    error: false,
  })

  useEffect(() => {
    // CHỨC NĂNG: chưa có địa điểm thì chưa dịch.
    // XỬ LÝ: xóa trạng thái cũ thay vì giữ văn bản trước đó.
    if (!place) {
      setState({
        key,
        text: null,
        loading: false,
        error: false,
      })

      return
    }

    const ready = place.description[lang]

    // CHỨC NĂNG: dùng ngay bản dịch đã có trong dữ liệu.
    // XỬ LÝ: luôn đặt loading về false, khắc phục trạng thái
    // loading còn sót khi chuyển từ ngôn ngữ đang dịch sang
    // ngôn ngữ đã có sẵn nội dung.
    if (ready?.trim()) {
      setState({
        key,
        text: ready,
        loading: false,
        error: false,
      })

      return
    }

    let cancelled = false
  }, [place, lang, key, source, attempt])

  // CHỨC NĂNG: chặn văn bản cũ ngay trong lần render đổi ngôn ngữ.
  // XỬ LÝ: useEffect chạy sau render; nếu chỉ xóa text trong effect
  // thì có một khoảng ngắn UI còn nhìn thấy text của ngôn ngữ cũ.
  const visibleState: TextState =
    state.key === key
      ? state
      : {
          key,
          text: null,
          loading: Boolean(place),
          error: false,
        }

  return {
    text: visibleState.text,
    loading: visibleState.loading,
    error: visibleState.error,

    // CHỨC NĂNG: cho nút Thử lại chạy lại effect.
    // XỬ LÝ: tăng attempt, không sửa nội dung địa điểm.
    retry: () => {
      setAttempt((current) => current + 1)
    },
  }
}