/**
 * CHỨC NĂNG: [KHAM-PHA]
 * VAI TRÒ: GIAO DIỆN WEB
 *
 * FILE NÀY LÀM GÌ:
 * Hiển thị các nút danh mục và trạng thái đang chọn; gửi lựa chọn về màn cha để cập nhật bộ lọc.
 *
 * VỊ TRÍ: apps/web/src/features/explore/components/NutLocDanhMuc.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/features/explore/pages/TrangChu.tsx
 *
 * PHỤ THUỘC:
 * - ../../../shared/components/BieuTuong
 * - @travelguide/visitor-core
 * - ../../language/i18n/CauHinhNgonNgu
 *
 * CÁC KHỐI CHÍNH:
 * 1. CategoryChips
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { Icon } from '../../../shared/components/BieuTuong'
import type { Category } from '@travelguide/visitor-core'
import { useText } from '../../language/i18n/CauHinhNgonNgu'

// CHỨC NĂNG: Chip danh mục ở hero.
// XỬ LÝ: Chỉ hiện danh mục có dữ liệu và có ít nhất hai loại.

// ==================== [KHAM-PHA] CategoryChips ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
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
      <button aria-pressed={!selected.length} onClick={() => onSelect([])}>
        <Icon name="grid" />
        {t('all')}
      </button>

      {categories.map((category) => (
        <button
          key={category}
          aria-pressed={selected.includes(category)}
          onClick={() => onSelect([category])}
        >
          <Icon name="landmark" />
          {t(`category_${category}`)}
        </button>
      ))}
    </div>
  )
}
// TẠI SAO (CategoryChips): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao
// diện tại một nơi.
