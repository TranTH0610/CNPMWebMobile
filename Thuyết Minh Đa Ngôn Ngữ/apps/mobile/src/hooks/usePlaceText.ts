import { useEffect, useState } from 'react'
import type { Place } from '../services/places'
import type { LangCode } from '../i18n'
import { translateLong } from '../services/translate'
import { getSavedTranslation, saveTranslation } from '../services/placeStore'

export function usePlaceText(place: Place | undefined, lang: LangCode) {
  const [text, setText] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!place) return
    const ready = place.description[lang]
    if (ready) {
      setText(ready)
      setError(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(false)
    setText(null)

    const key = `${place.id}|${lang}`
    getSavedTranslation(key)
      .then(async (saved) => {
        if (saved) return saved
        const translated = await translateLong(place.description.vi, 'vi', lang)
        await saveTranslation(key, translated)
        return translated
      })
      .then((t) => {
        if (!cancelled) setText(t)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [place, lang])

  return { text, loading, error }
}