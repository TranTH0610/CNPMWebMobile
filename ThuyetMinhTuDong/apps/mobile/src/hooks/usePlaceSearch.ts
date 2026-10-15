/**
 * FILE NÀY LÀM GÌ:
 * Gom debounce, tìm kiếm, lọc danh mục và sắp xếp.
 * Home/Search gọi; phụ thuộc place-core, usePlaces và geo.ts.
 * Liên quan UC03, FR-38/39.
 */

import { useMemo, useState } from 'react'

import {
  categoryCounts,
  filterCategories,
  searchPlaces,
  sortPlaces,
  type CategoryId,
  type SortOrder,
} from '@travelguide/place-core'

import {
  useDebounce,
} from '@travelguide/place-core/useDebounce'

import { distanceMeters } from '../services/geo'
import { usePlaces } from './usePlaces'

export function usePlaceSearch(
  initialQuery = '',
  initialCategory: CategoryId | null = null,
) {
  const catalog = usePlaces()

  const [query, setQuery] = useState(initialQuery)

  const [category, setCategory] =
    useState<CategoryId | null>(initialCategory)

  const [order, setOrder] =
    useState<SortOrder>('nearest')

  const debouncedQuery = useDebounce(query, 300)

  // CHỨC NĂNG: khi chưa có vị trí, hiển thị cách sắp xếp thực tế.
  // XỬ LÝ: không để UI ghi "Gần nhất" nhưng dữ liệu lại theo tên.
  const effectiveOrder: SortOrder =
    order === 'nearest' && !catalog.origin
      ? 'name'
      : order

  // CHỨC NĂNG: tính danh mục từ nguồn gốc đã tải.
  // XỬ LÝ: không tính từ kết quả đã lọc, tránh chip biến mất
  // khi người dùng chọn một danh mục.
  const categories = useMemo(
    () => Object.keys(
      categoryCounts(catalog.places),
    ) as CategoryId[],
    [catalog.places],
  )

  // CHỨC NĂNG: chỉ tính lại khi đầu vào liên quan thay đổi.
  // XỬ LÝ: bấm tim không đổi các dependency này nên không lọc lại.
  const results = useMemo(() => {
    const searched = searchPlaces(
      catalog.places,
      debouncedQuery,
      catalog.language,
    )

    const filtered = filterCategories(
      searched,
      category ? [category] : [],
    )

    return sortPlaces(filtered, {
      language: catalog.language,
      order: effectiveOrder,
      origin: catalog.origin,
      distanceMeters,
    })
  }, [
    catalog.places,
    catalog.language,
    catalog.origin,
    debouncedQuery,
    category,
    effectiveOrder,
  ])

  // CHỨC NĂNG: chuẩn bị khoảng cách cho thẻ.
  // XỬ LÝ: không có vị trí thì trả Map rỗng, UI không hiện khoảng cách.
  const distances = useMemo(() => {
    const values = new Map<string, number>()

    if (!catalog.origin) return values

    for (const place of catalog.places) {
      if (!place.location) continue

      const distance = distanceMeters(
        catalog.origin,
        place.location,
      )

      if (Number.isFinite(distance) && distance >= 0) {
        values.set(place.id, distance)
      }
    }

    return values
  }, [catalog.places, catalog.origin])

  const changeOrder = (next: SortOrder): void => {
    setOrder(next)

    if (next === 'nearest' && !catalog.origin) {
      void catalog.requestLocation()
    }
  }

  const reset = (): void => {
    setQuery('')
    setCategory(null)
  }

  return {
    ...catalog,
    query,
    setQuery,
    category,
    setCategory,
    categories,
    results,
    distances,
    effectiveOrder,
    changeOrder,
    reset,
  }
}