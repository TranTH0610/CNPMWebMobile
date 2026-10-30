/**
 * FILE NÀY LÀM GÌ
 * Các khối giao diện quản trị dùng lại như khung trang, phản hồi thao tác, biểu mẫu, thẻ và nút
 * hành động.
 *
 * VỊ TRÍ: apps/web/src/components/admin/AdminUI.tsx
 * DÙNG BỞI: apps/web/src/pages/admin/ContentEditorPage.tsx;
 * apps/web/src/pages/admin/DashboardPage.tsx; apps/web/src/pages/admin/PlaceFormPage.tsx; và các
 * nơi import khác.
 * PHỤ THUỘC: react; @travelguide/admin-core/react; @travelguide/admin-core
 * TẠI SAO TÁCH FILE: Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
 * tại một nơi.
 */
// Nhập các thành phần từ 'react'.
import { useEffect, useState, type ReactNode } from 'react'
// Nhập các thành phần từ '@travelguide/admin-core/react'.
import { useAdminText } from '@travelguide/admin-core/react'
// Nhập kiểu dữ liệu từ '@travelguide/admin-core'.
import type { Workflow } from '@travelguide/admin-core'
// Nhập các thành phần từ '@travelguide/admin-core/react'.
import { useAdmin } from '@travelguide/admin-core/react'
// CHỨC NĂNG: Hiển thị nhãn trạng thái nội dung.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo Status({ value }). Component hàm nhận props và dựng phần giao diện Status. | Khai báo value, kiểu Workflow.
export function Status({ value }: { value: Workflow }) {
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `const t = useAdminText(); return <span className={'admin-badge state-' + value}>{t(`s`: Khai báo t: useAdminText() lấy hàm dịch từ provider ngôn ngữ đang chọn. | Trả cây giao diện của component để React hiển thị. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 const t = useAdminText(); return <span className={'admin-badge state-' + value}>{t(`status_${value}`)}</span>
}
// TẠI SAO (Status): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện tại
// một nơi.
// CHỨC NĂNG: Hiển thị kết quả tải/lưu hoặc lỗi của thao tác quản trị.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo Feedback({ state }). Component hàm nhận props và dựng phần giao diện Feedback. | Khai báo state, kiểu ReturnType<typeof useAdmin>.
export function Feedback({ state }: { state: ReturnType<typeof useAdmin> }) {
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `const t = useAdminText(); return <>`: Khai báo t: useAdminText() lấy hàm dịch từ provider ngôn ngữ đang chọn. | Trả cây giao diện của component để React hiển thị.
  * DÒNG `{state.loading && <p role="status">{t('loading')}</p>}`: Đưa biểu thức JavaScript state.loading && <p role="status">{t('loading')}</p> vào JSX. | Thuộc tính role: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `{state.error && <div className="admin-error" role="alert">{t(`error_${state.error}`)}`: Đưa biểu thức JavaScript state.error && <div className="admin-error" role="alert">{t(`error_${state.error}`)} <button className="second vào JSX. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính role: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onClick: nối thao tác bấm với callback. | Thực hiện sử dụng void state.reload() làm giá trị của bước hiện tại.
  * DÒNG `{state.success && <p className="admin-success" role="status">{t('saved')}</p>}`: Đưa biểu thức JavaScript state.success && <p className="admin-success" role="status">{t('saved')}</p> vào JSX. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính role: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
  * DÒNG `</>`: Trả cây giao diện của component để React hiển thị.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 const t = useAdminText(); return <>
  {state.loading && <p role="status">{t('loading')}</p>}
  {state.error && <div className="admin-error" role="alert">{t(`error_${state.error}`)} <button className="secondary" onClick={() => { void state.reload() }}>{t('retry')}</button></div>}
  {state.success && <p className="admin-success" role="status">{t('saved')}</p>}
 </>
}
// TẠI SAO (Feedback): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
// tại một nơi.
// CHỨC NĂNG: Ghép nhãn, ô nhập và giá trị của một trường form.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo Field({ label, children }). Component hàm nhận props và dựng phần giao diện Field. | Khai báo label, kiểu string. | Khai báo children, kiểu ReactNode.
export function Field({ label, children }: { label: string; children: ReactNode }) {
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return <label className="admin-field"><span>{label}</span>{children}</label>`: Trả cây giao diện của component để React hiển thị. | Thuộc tính className: liên kết phần tử với quy tắc CSS.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return <label className="admin-field"><span>{label}</span>{children}</label>
}
// TẠI SAO (Field): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện tại
// một nơi.
// CHỨC NĂNG: Bảo vệ thay đổi khi đóng/tải lại tab và bấm liên kết rời form.
// XỬ LÝ: Gỡ đúng listener; không chặn nút lưu hoặc điều hướng sau lưu thành công.
// Khai báo useUnsaved(dirty). Nhận đầu vào qua tham số.
export function useUnsaved(dirty: boolean) {
 // Khai báo t: useAdminText() lấy hàm dịch từ provider ngôn ngữ đang chọn | Khai báo message: Gọi t('unsaved').
 const t = useAdminText(), message = t('unsaved')
 // CHỨC NĂNG: Cảnh báo khi đóng trang còn thay đổi chưa lưu.
 // XỬ LÝ: Đăng ký kiểm tra theo dirty và gỡ listener khi không còn cần cảnh báo.
 // DÒNG NÀY LÀM GÌ: Khi form dirty, đăng ký cảnh báo đóng trang và xác nhận trước khi bấm liên
 // kết rời trang.
 // CÁCH HOẠT ĐỘNG: Tạo các listener dùng message hiện tại; cleanup gỡ đúng callback và capture
 // của lần đăng ký đó.
 // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: dirty, message.
 // Đăng ký useEffect để thực hiện tác vụ sau render.
 useEffect(() => {
  // Rẽ nhánh nếu !dirty. | Thoát hàm hiện tại ngay.
  if (!dirty) return
  // Khai báo unload: khai báo callback (event: BeforeUnloadEvent) => { event.preventDefault(). | Chặn hành vi mặc định của sự kiện. | Thực hiện tính biểu thức event.returnValue = ''.
  const unload = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = '' }
  // TẠI SAO (unload): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện tại
  // một nơi.
  // Khai báo click: khai báo callback (event: MouseEvent) => { const anchor = event.target instanceof Element ? e.
  const click = (event: MouseEvent) => {
   // Khai báo anchor: chọn giữa hai giá trị theo điều kiện event.target instanceof Element.
   const anchor = event.target instanceof Element ? event.target.closest('a') : null
   /* GIẢI THÍCH TỪNG DÒNG:
    * DÒNG `if (anchor && anchor.getAttribute('href') && !anchor.hasAttribute('download') && !win`: Rẽ nhánh nếu anchor && anchor.getAttribute('href') && !anchor.hasAttribute('download') && !window.confirm(message). | Chặn hành vi mặc định của sự kiện. | Thực hiện Gọi event.stopPropagation().
    * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
    */
   if (anchor && anchor.getAttribute('href') && !anchor.hasAttribute('download') && !window.confirm(message)) { event.preventDefault(); event.stopPropagation() }
  }
  // TẠI SAO (click): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện tại
  // một nơi.
  // Đăng ký xử lý sự kiện: window.addEventListener('beforeunload', unload). | Đăng ký xử lý sự kiện: document.addEventListener('click', click, true).
  window.addEventListener('beforeunload', unload); document.addEventListener('click', click, true)
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return () => { window.removeEventListener('beforeunload', unload); document.removeEve`: Trả kết quả: khai báo callback () => { window.removeEventListener('beforeunload', unload). | Dọn đăng ký/timer: window.removeEventListener('beforeunload', unload). | Dọn đăng ký/timer: document.removeEventListener('click', click, true).
   * DÒNG `}, [dirty, message])`: Đăng ký useEffect để thực hiện tác vụ sau render.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return () => { window.removeEventListener('beforeunload', unload); document.removeEventListener('click', click, true) }
 }, [dirty, message])
 // TẠI SAO: Giữ dữ liệu nhập chưa lưu và tránh nhiều listener chặn cùng một thao tác sau mỗi lần
 // render.
}
// TẠI SAO (useUnsaved): Rời form chưa lưu có thể mất nội dung đang nhập; cảnh báo cho phép người
// dùng chọn trước khi rời.
/* CÁCH KIỂM TRA: Mỗi trạng thái có nhãn; bấm liên kết khi form bẩn phải hỏi trước. */

// CHỨC NĂNG: Hộp xác nhận trong app, không dùng hộp modal chặn của trình duyệt.
// Khai báo useConfirmation(). Nhận đầu vào qua tham số.
export function useConfirmation() {
 // CHỨC NĂNG: Đang chờ tác vụ chuẩn bị/phát; hạn chế tạo nguồn hoặc gửi thao tác trùng.
 // Khai báo t: useAdminText() lấy hàm dịch từ provider ngôn ngữ đang chọn | Khai báo [pending,setPending]: useState(null) giữ trạng thái qua các lần render. | Khai báo message, kiểu string. | Khai báo run, kiểu ()=>void.
 const t=useAdminText(),[pending,setPending]=useState<{message:string;run:()=>void}|null>(null)
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return {ask:(message:string,run:()=>void)=>setPending({message,run}),dialog:pending&&`: Trả kết quả: tạo object gồm ask, dialog. | Gán thuộc tính ask: khai báo callback (message:string,run:()=>void)=>setPending({message,run}). | Đặt trường message bằng giá trị của biến cùng tên. | Đặt trường run bằng giá trị của biến cùng tên. | Gán thuộc tính dialog: tính biểu thức pending&&<div className="admin-modal-backdrop"><section className="admin-confirm" role="al. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính role: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính aria-modal: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính aria-labelledby: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính id: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onClick: nối thao tác bấm với callback. | Thuộc tính autoFocus: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Khai báo run: đọc pending.run từ đối tượng/mảng để dùng tại bước hiện tại. | Cập nhật trạng thái qua setPending(null). | Thực hiện Gọi run().
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return {ask:(message:string,run:()=>void)=>setPending({message,run}),dialog:pending&&<div className="admin-modal-backdrop"><section className="admin-confirm" role="alertdialog" aria-modal="true" aria-labelledby="admin-confirm-title"><h2 id="admin-confirm-title">{t('admin')}</h2><p>{pending.message}</p><div className="admin-actions"><button type="button" className="secondary" onClick={()=>setPending(null)}>{t('cancel')}</button><button type="button" autoFocus onClick={()=>{const run=pending.run;setPending(null);run()}}>{t('confirm')}</button></div></section></div>}
}
// TẠI SAO (useConfirmation): Người dùng cần xác nhận rõ trước một thao tác có thể làm mất dữ
// liệu hoặc thay trạng thái công bố.
