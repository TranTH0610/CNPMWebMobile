/**
 * FILE: apps/web/src/features/explore/components/NutLocDanhMuc.tsx
 * FILE NÀY LÀM GÌ: Hiển thị các nút danh mục và trạng thái đang chọn; gửi lựa chọn về màn cha để cập nhật bộ lọc.
 * VAI TRÒ: Giao diện Web; gọi hook/service để xử lý nghiệp vụ.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC02: Xem danh sách di tích.
 * - UC03: Tìm kiếm, lọc và sắp xếp.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { Icon } from '../../../shared/components/BieuTuong'
import type { Category } from '@travelguide/visitor-core'
import { useText } from '../../language/i18n/CauHinhNgonNgu'

// CHỨC NĂNG: Chip danh mục ở hero.
// XỬ LÝ: Chỉ hiện danh mục có dữ liệu và có ít nhất hai loại.

// [UC02 / UC03] CategoryChips — Chip danh mục ở hero.
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
