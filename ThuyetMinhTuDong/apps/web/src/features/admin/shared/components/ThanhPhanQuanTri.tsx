/**
 * CHỨC NĂNG: [GIAO-DIEN]
 * VAI TRÒ: GIAO DIỆN WEB
 *
 * FILE NÀY LÀM GÌ:
 * Các khối giao diện quản trị dùng lại như khung trang, phản hồi thao tác, biểu mẫu, thẻ và nút hành động.
 *
 * VỊ TRÍ: apps/web/src/features/admin/shared/components/ThanhPhanQuanTri.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/features/admin/dashboard/TrangTongQuan.tsx
 * - apps/web/src/features/admin/places/components/ChinhSuaAnhDiTich.tsx
 * - apps/web/src/features/admin/places/TrangDanhSachDiTich.tsx
 * - apps/web/src/features/admin/places/TrangThemSuaDiTich.tsx
 * - apps/web/src/features/admin/reviews/TrangKiemDuyet.tsx
 *
 * PHỤ THUỘC:
 * - react
 * - @travelguide/admin-core/react
 * - @travelguide/admin-core
 *
 * CÁC KHỐI CHÍNH:
 * 1. Status
 * 2. Feedback
 * 3. Field
 * 4. useUnsaved
 * 5. useConfirmation
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { useEffect, useState, type ReactNode } from 'react'
import { useAdminText } from '@travelguide/admin-core/react'
import type { Workflow } from '@travelguide/admin-core'
import { useAdmin } from '@travelguide/admin-core/react'
// CHỨC NĂNG: Hiển thị nhãn trạng thái nội dung.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.

// ==================== [GIAO-DIEN] Status ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function Status({ value }: { value: Workflow }) {
  const t = useAdminText()
  return <span className={'admin-badge state-' + value}>{t(`status_${value}`)}</span>
}
// TẠI SAO (Status): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện tại
// một nơi.
// CHỨC NĂNG: Hiển thị kết quả tải/lưu hoặc lỗi của thao tác quản trị.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.

// ==================== [GIAO-DIEN] Feedback ====================
export function Feedback({ state }: { state: ReturnType<typeof useAdmin> }) {
  const t = useAdminText()
  return (
    <>
      {state.loading && <p role="status">{t('loading')}</p>}
      {state.error && (
        <div className="admin-error" role="alert">
          {t(`error_${state.error}`)}{' '}
          <button
            className="secondary"
            onClick={() => {
              void state.reload()
            }}
          >
            {t('retry')}
          </button>
        </div>
      )}
      {state.success && (
        <p className="admin-success" role="status">
          {t('saved')}
        </p>
      )}
    </>
  )
}
// TẠI SAO (Feedback): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
// tại một nơi.
// CHỨC NĂNG: Ghép nhãn, ô nhập và giá trị của một trường form.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.

// ==================== [GIAO-DIEN] Field ====================
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {children}
    </label>
  )
}
// TẠI SAO (Field): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện tại
// một nơi.
// CHỨC NĂNG: Bảo vệ thay đổi khi đóng/tải lại tab và bấm liên kết rời form.
// XỬ LÝ: Gỡ đúng listener; không chặn nút lưu hoặc điều hướng sau lưu thành công.

// ==================== [GIAO-DIEN] useUnsaved ====================
export function useUnsaved(dirty: boolean) {
  const t = useAdminText(),
    message = t('unsaved')
  // CHỨC NĂNG: Cảnh báo khi đóng trang còn thay đổi chưa lưu.
  // XỬ LÝ: Đăng ký kiểm tra theo dirty và gỡ listener khi không còn cần cảnh báo.
  // CHỨC NĂNG: Khi form dirty, đăng ký cảnh báo đóng trang và xác nhận trước khi bấm liên
  // kết rời trang.
  // XỬ LÝ: Tạo các listener dùng message hiện tại; cleanup gỡ đúng callback và capture
  // của lần đăng ký đó.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: dirty, message.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => {
    if (!dirty) return

    const unload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }
    // TẠI SAO (unload): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện tại
    // một nơi.

    const click = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest('a') : null

      if (
        anchor &&
        anchor.getAttribute('href') &&
        !anchor.hasAttribute('download') &&
        !window.confirm(message)
      ) {
        event.preventDefault()
        event.stopPropagation()
      }
    }
    // TẠI SAO (click): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện tại
    // một nơi.

    window.addEventListener('beforeunload', unload)
    document.addEventListener('click', click, true)

    return () => {
      window.removeEventListener('beforeunload', unload)
      document.removeEventListener('click', click, true)
    }
  }, [dirty, message])
  // TẠI SAO: Giữ dữ liệu nhập chưa lưu và tránh nhiều listener chặn cùng một thao tác sau mỗi lần
  // render.
}
// TẠI SAO (useUnsaved): Rời form chưa lưu có thể mất nội dung đang nhập; cảnh báo cho phép người
// dùng chọn trước khi rời.
/* CÁCH KIỂM TRA: Mỗi trạng thái có nhãn; bấm liên kết khi form bẩn phải hỏi trước. */

// CHỨC NĂNG: Hộp xác nhận trong app, không dùng hộp modal chặn của trình duyệt.

// ==================== [GIAO-DIEN] useConfirmation ====================
export function useConfirmation() {
  // CHỨC NĂNG: Đang chờ tác vụ chuẩn bị/phát; hạn chế tạo nguồn hoặc gửi thao tác trùng.

  const t = useAdminText(),
    [pending, setPending] = useState<{ message: string; run: () => void } | null>(null)

  return {
    ask: (message: string, run: () => void) => setPending({ message, run }),
    dialog: pending && (
      <div className="admin-modal-backdrop">
        <section
          className="admin-confirm"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="admin-confirm-title"
        >
          <h2 id="admin-confirm-title">{t('admin')}</h2>
          <p>{pending.message}</p>
          <div className="admin-actions">
            <button type="button" className="secondary" onClick={() => setPending(null)}>
              {t('cancel')}
            </button>
            <button
              type="button"
              autoFocus
              onClick={() => {
                const run = pending.run
                setPending(null)
                run()
              }}
            >
              {t('confirm')}
            </button>
          </div>
        </section>
      </div>
    ),
  }
}
// TẠI SAO (useConfirmation): Người dùng cần xác nhận rõ trước một thao tác có thể làm mất dữ
// liệu hoặc thay trạng thái công bố.
