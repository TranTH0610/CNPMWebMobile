/**
 * FILE NÀY LÀM GÌ: Hiển thị các chip danh mục có dữ liệu và cập nhật mục đang chọn.
 * Vị trí: apps/web/src/components/CategoryChips.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { categoryIcons } from '@travelguide/visitor-core'
import type { Category } from '@travelguide/visitor-core'
import { useText } from '../i18n/index'

// CHỨC NĂNG: Chip danh mục ở hero.
// XỬ LÝ: Chỉ hiện danh mục có dữ liệu và có ít nhất hai loại.
export function CategoryChips({
  categories,
  selected,
  onSelect,
}: {
  categories: readonly Category[]
  selected: readonly Category[]
  onSelect: (value: Category[]) => void
}) {
  const t = useText()

  if (categories.length < 2) return null

  return (
    <div className="category-chips">
      <button
        aria-pressed={!selected.length}
        onClick={() => onSelect([])}
      >
        <span>▥</span>{t('all')}
      </button>

      {categories.map((category) => (
        <button
          key={category}
          aria-pressed={selected.includes(category)}
          onClick={() => onSelect([category])}
        >
          <span>{categoryIcons[category]}</span>
          {t(`category_${category}`)}
        </button>
      ))}
    </div>
  )
}
