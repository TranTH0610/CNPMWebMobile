/** FILE NÀY LÀM GÌ: Thành phần và hooks nhỏ dùng lại trong Admin Web.
 * Các trang admin gọi; phụ thuộc admin-core/react. UC12–UC17. */
import { useEffect, useState, type ReactNode } from 'react'
import { useAdminText } from '@travelguide/admin-core/react'
import type { Workflow } from '@travelguide/admin-core'
import { useAdmin } from '@travelguide/admin-core/react'
export function Status({ value }: { value: Workflow }) {
 const t = useAdminText(); return <span className={'admin-badge state-' + value}>{t(`status_${value}`)}</span>
}
export function Feedback({ state }: { state: ReturnType<typeof useAdmin> }) {
 const t = useAdminText(); return <>
  {state.loading && <p role="status">{t('loading')}</p>}
  {state.error && <div className="admin-error" role="alert">{t(`error_${state.error}`)} <button className="secondary" onClick={() => { void state.reload() }}>{t('retry')}</button></div>}
  {state.success && <p className="admin-success" role="status">{t('saved')}</p>}
 </>
}
export function Field({ label, children }: { label: string; children: ReactNode }) {
 return <label className="admin-field"><span>{label}</span>{children}</label>
}
// CHỨC NĂNG: Bảo vệ thay đổi khi đóng/tải lại tab và bấm liên kết rời form.
// XỬ LÝ: Gỡ đúng listener; không chặn nút lưu hoặc điều hướng sau lưu thành công.
export function useUnsaved(dirty: boolean) {
 const t = useAdminText(), message = t('unsaved')
 useEffect(() => {
  if (!dirty) return
  const unload = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = '' }
  const click = (event: MouseEvent) => {
   const anchor = event.target instanceof Element ? event.target.closest('a') : null
   if (anchor && anchor.getAttribute('href') && !anchor.hasAttribute('download') && !window.confirm(message)) { event.preventDefault(); event.stopPropagation() }
  }
  window.addEventListener('beforeunload', unload); document.addEventListener('click', click, true)
  return () => { window.removeEventListener('beforeunload', unload); document.removeEventListener('click', click, true) }
 }, [dirty, message])
}
/* CÁCH KIỂM TRA: Mỗi trạng thái có nhãn; bấm liên kết khi form bẩn phải hỏi trước. */

// CHỨC NĂNG: Hộp xác nhận trong app, không dùng hộp modal chặn của trình duyệt.
export function useConfirmation() {
 const t=useAdminText(),[pending,setPending]=useState<{message:string;run:()=>void}|null>(null)
 return {ask:(message:string,run:()=>void)=>setPending({message,run}),dialog:pending&&<div className="admin-modal-backdrop"><section className="admin-confirm" role="alertdialog" aria-modal="true" aria-labelledby="admin-confirm-title"><h2 id="admin-confirm-title">{t('admin')}</h2><p>{pending.message}</p><div className="admin-actions"><button type="button" className="secondary" onClick={()=>setPending(null)}>{t('cancel')}</button><button type="button" autoFocus onClick={()=>{const run=pending.run;setPending(null);run()}}>{t('confirm')}</button></div></section></div>}
}
