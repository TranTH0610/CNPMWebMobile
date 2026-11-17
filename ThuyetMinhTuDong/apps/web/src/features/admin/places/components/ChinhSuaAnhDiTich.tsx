/**
 * FILE: apps/web/src/features/admin/places/components/ChinhSuaAnhDiTich.tsx
 * FILE NÀY LÀM GÌ: Sửa ảnh đại diện, danh sách URL và tệp ảnh trong form quản trị web. PlaceFormPage gọi cho cả thêm/sửa/biên tập; phụ thuộc thao tác ảnh admin-core, picker và PlaceImage. TẠI SAO: Hiển thị từng ảnh với nút chọn/xóa để không giữ ảnh cũ ở đầu danh sách ngoài ý muốn.
 * VAI TRÒ: Giao diện Web; gọi hook/service để xử lý nghiệp vụ.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC10: Quản lý di tích.
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * - UC12: Kiểm duyệt nội dung và âm thanh.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import {
  editImageLinks,
  imageList,
  removePlaceImage,
  selectCoverImage,
} from '@travelguide/admin-core'
import { useAdminText } from '@travelguide/admin-core/react'
import { PlaceImage } from '../../../../shared/components/AnhDiTich'
import { Field } from '../../shared/components/ThanhPhanQuanTri'
import { LocalMediaPicker } from '../../shared/components/ChonTepTuThietBi'
// CHỨC NĂNG: Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider PlaceImagesEditor.
// [UC10 / UC11 / UC12] PlaceImagesEditor — Nhận dữ liệu từ props/hook và dựng phần giao diện hoặc provider PlaceImagesEditor.
export function PlaceImagesEditor({
  value,
  title,
  disabled,
  onChange,
}: {
  value: string
  title: string
  disabled: boolean
  onChange: (value: string) => void
}) {
  const t = useAdminText(),
    images = imageList(value)
  return (
    <div className="admin-images-editor">
      {images[0] && (
        <div className="admin-image-preview">
          <PlaceImage uri={images[0]} title={title} />
        </div>
      )}
      {/* CHỨC NĂNG: Mỗi ảnh có thao tác riêng; lựa chọn chỉ đổi bản đang nhập, chưa ghi SQL. */}
      <div className="admin-image-options">
        {images.map((image, index) => (
          <div className="admin-image-option" key={image}>
            <PlaceImage uri={image} title={title + ' · ' + t('imageNumber') + ' ' + (index + 1)} />
            <div>
              <strong>
                {t('imageNumber')} {index + 1}
                {index === 0 ? ' · ' + t('coverImage') : ''}
              </strong>
              <div className="admin-image-buttons">
                <button
                  type="button"
                  className="secondary"
                  disabled={disabled || index === 0}
                  onClick={() => onChange(selectCoverImage(value, image))}
                >
                  {t('makeCover')}
                </button>
                <button
                  type="button"
                  className="secondary"
                  disabled={disabled}
                  aria-label={t('removeImage') + ' ' + (index + 1)}
                  onClick={() => onChange(removePlaceImage(value, image))}
                >
                  {t('removeImage')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Field label={t('images')}>
        <textarea
          rows={3}
          disabled={disabled}
          value={value
            .split('\n')
            .filter((item) => !item.startsWith('data:'))
            .join('\n')}
          onChange={(event) => onChange(editImageLinks(value, event.target.value))}
        />
      </Field>
      {/* CHỨC NĂNG: Tệp vừa chọn lên đầu ngay, thay vì thêm cuối rồi vẫn thấy ảnh cũ. */}
      <LocalMediaPicker
        kind="image"
        disabled={disabled}
        onPick={(image) => onChange(selectCoverImage(value, image))}
      />
    </div>
  )
}
