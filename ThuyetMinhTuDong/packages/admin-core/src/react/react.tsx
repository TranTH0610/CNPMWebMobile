/**
 * FILE NÀY LÀM GÌ: Context và hooks Admin dùng chung, UI không biết adapter lưu ở đâu.
 * Admin layout/web và AdminScreen/mobile dùng; UC12–UC17.
 * Phụ thuộc React, service và ngôn ngữ VisitorProvider hiện có.
 */
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { useVisitor } from '@travelguide/visitor-core/react'
import type { AdminService } from '../domain/contracts'
import { AdminError, type AdminDocument, type AdminErrorCode, type AdminIdentity } from '../domain/models'
import { adminMessages, type AdminTextKey } from '../i18n/messages'
const Context = createContext<AdminService | null>(null)
export function AdminProvider({ service, children }: { service: AdminService; children: ReactNode }) {
  return <Context.Provider value={service}>{children}</Context.Provider>
}
export function useAdminText() {
  const { language } = useVisitor()
  return useCallback((key: AdminTextKey): string => adminMessages[language][key], [language])
}
export function useAdmin() {
  const service = useContext(Context)
  if (!service) throw new Error('AdminProvider missing')
  const [data, setData] = useState<AdminDocument | null>(null)
  const [identity, setIdentity] = useState<AdminIdentity | null>(null)
  const [error, setError] = useState<AdminErrorCode | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [success, setSuccess] = useState(false)
  const alive = useRef(true), sequence = useRef(0), locked = useRef(false)
  // CHỨC NĂNG: Hủy nhận dữ liệu cũ bằng sequence, gỡ subscription khi rời màn.
  const reload = useCallback(async () => {
    const request = ++sequence.current
    try {
      const [doc, manager] = await Promise.all([service.load(), service.identity()])
      if (alive.current && request === sequence.current) { setData(doc); setIdentity(manager); setError(null) }
    } catch (e) { if (alive.current && request === sequence.current) setError(e instanceof AdminError ? e.code : 'loadError') }
    finally { if (alive.current && request === sequence.current) setLoading(false) }
  }, [service])
  const invalidate = useCallback(() => { sequence.current++ }, [])
  useEffect(() => {
    alive.current = true; void reload()
    const stop = service.subscribe(() => { void reload() })
    return () => { alive.current = false; invalidate(); stop() }
  }, [service, reload, invalidate])
  // CHỨC NĂNG: Một thao tác tại một thời điểm; lỗi giữ nguyên form/bản công khai.
  const run = async (operation: () => Promise<void>): Promise<boolean> => {
    if (locked.current) return false
    locked.current = true; setBusy(true); setError(null); setSuccess(false)
    try { await operation(); if (alive.current) { await reload(); setSuccess(true) } return true }
    catch (e) { if (alive.current) setError(e instanceof AdminError ? e.code : 'saveError'); return false }
    finally { locked.current = false; if (alive.current) setBusy(false) }
  }
  return { service, data, identity, error, loading, busy, success, reload, run }
}
/* CÁCH KIỂM TRA: Rời màn trong lúc lưu không setState; lỗi lưu hiện thông báo, không báo thành công. */

// CHỨC NĂNG: Hai dashboard đọc cùng bộ đếm QR từ server RAM mỗi 5 giây.
// XỬ LÝ: Lỗi để —, không báo 0; cleanup bỏ timer và kết quả đến muộn.
export function useGateStatistics(client: import('../services/httpService').GateClient) {
 const [stats,setStats]=useState<import('../services/httpService').GateStats|null>(null),[error,setError]=useState(false),[retryKey,setRetryKey]=useState(0)
 useEffect(()=>{let alive=true;let timer:ReturnType<typeof setTimeout>|undefined
  const tick=async()=>{try{const value=await client.statistics();if(alive){setStats(value);setError(false)}}catch{if(alive){setStats(null);setError(true)}}if(alive)timer=setTimeout(()=>{void tick()},5000)}
  void tick();return()=>{alive=false;if(timer)clearTimeout(timer)}
 },[client,retryKey])
 return {stats,error,retry:()=>setRetryKey(value=>value+1)}
}
