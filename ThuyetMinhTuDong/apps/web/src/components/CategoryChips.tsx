/**
 * FILE NÀY LÀM GÌ
 * Hiển thị các nút danh mục và trạng thái đang chọn; gửi lựa chọn về màn cha để cập nhật bộ lọc.
 *
 * VỊ TRÍ: apps/web/src/components/CategoryChips.tsx
 * DÙNG BỞI: apps/web/src/components/index.ts.
 * PHỤ THUỘC: @travelguide/visitor-core; ../i18n/index
 * TẠI SAO TÁCH FILE: Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
 * tại một nơi.
 */
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { categoryIcons } from '@travelguide/visitor-core'
// Nhập kiểu dữ liệu từ '@travelguide/visitor-core'.
import type { Category } from '@travelguide/visitor-core'
// Nhập các thành phần từ '../i18n/index'.
import { useText } from '../i18n/index'

// CHỨC NĂNG: Chip danh mục ở hero.
// XỬ LÝ: Chỉ hiện danh mục có dữ liệu và có ít nhất hai loại.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function CategoryChips({`: Khai báo CategoryChips({ categories, selected, onSelect, }). Component hàm nhận props và dựng phần giao diện CategoryChips.
 * DÒNG `categories,`: Nhận đầu vào { categories, selected, onSelect, }: { categories: readonly Category[] selected: readonly Categ từ nơi gọi hàm.
 * DÒNG `selected,`: Nhận đầu vào { categories, selected, onSelect, }: { categories: readonly Category[] selected: readonly Categ từ nơi gọi hàm.
 * DÒNG `onSelect,`: Nhận đầu vào { categories, selected, onSelect, }: { categories: readonly Category[] selected: readonly Categ từ nơi gọi hàm.
 * DÒNG `}: {`: Nhận đầu vào { categories, selected, onSelect, }: { categories: readonly Category[] selected: readonly Categ từ nơi gọi hàm.
 */
export function CategoryChips({
  categories,
  selected,
  onSelect,
}: {
  // Khai báo categories, kiểu readonly Category[].
  categories: readonly Category[]
  // Khai báo selected, kiểu readonly Category[].
  selected: readonly Category[]
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `onSelect: (value: Category[]) => void`: Khai báo onSelect, kiểu (value: Category[]) => void.
   * DÒNG `}) {`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  onSelect: (value: Category[]) => void
}) {
  // Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
  const t = useText()

  // Rẽ nhánh nếu categories.length < 2. | Trả kết quả: sử dụng null làm giá trị của bước hiện tại.
  if (categories.length < 2) return null

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<div className="category-chips">`: Dựng div. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
   * DÒNG `<button`: Dựng button.
   * DÒNG `aria-pressed={!selected.length}`: Thuộc tính aria-pressed: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `onClick={() => onSelect([])}`: Thuộc tính onClick: nối thao tác bấm với callback.
   * DÒNG `>`: Dựng button.
   * DÒNG `<span>▥</span>{t('all')}`: Dựng span.
   * DÒNG `</button>`: Đóng phần giao diện button.
   * DÒNG `{categories.map((category) => (`: Đưa biểu thức JavaScript categories.map((category) => ( <button key={category} aria-pressed={selected.includes(category)} onClick={() = vào JSX.
   * DÒNG `<button`: Dựng button.
   * DÒNG `key={category}`: Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách.
   * DÒNG `aria-pressed={selected.includes(category)}`: Thuộc tính aria-pressed: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `onClick={() => onSelect([category])}`: Thuộc tính onClick: nối thao tác bấm với callback.
   * DÒNG `>`: Dựng button.
   * DÒNG `<span>{categoryIcons[category]}</span>`: Dựng span.
   * DÒNG `{t(`category_${category}`)}`: Đưa biểu thức JavaScript t(`category_${category}`) vào JSX.
   * DÒNG `</button>`: Đóng phần giao diện button.
   * DÒNG `))}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `</div>`: Đóng phần giao diện div.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
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
// TẠI SAO (CategoryChips): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao
// diện tại một nơi.
