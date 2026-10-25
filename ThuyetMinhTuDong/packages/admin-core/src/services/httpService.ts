/**
 * FILE NÀY LÀM GÌ: Adapter HTTP dùng chung cho web và mobile; thay kho cục bộ bằng server RAM.
 * Service nền tảng gọi; giữ hợp đồng AdminService cho UC12–UC17.
 * Phụ thuộc fetch/AbortController và models; không phụ thuộc React hoặc thiết bị.
 */
import type { AdminService } from '../domain/contracts'
import { AdminError, type AdminErrorCode } from '../domain/models'
export interface GateStats { today: number; day: string }
export interface GateClient { entry(visitId: string, platform: 'web'|'mobile-app'): Promise<void>; statistics(): Promise<GateStats> }
const errors: readonly AdminErrorCode[] = ['loadError','saveError','invalid','conflict','notFound','notApproved','incomplete','staleJob']
function transport(base: string) {
 return async <T,>(path: string, body?: unknown, timeoutMs = 8000): Promise<T> => {
  if (!base) throw new AdminError('loadError')
  const controller = new AbortController(), timer = setTimeout(()=>controller.abort(),timeoutMs)
  try {
   const response = await fetch(base.replace(/\/$/,'')+path,{method:body===undefined?'GET':'POST',headers:body===undefined?undefined:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body),signal:controller.signal})
   const value: unknown = await response.json()
   if (!response.ok) {
    const code = value && typeof value==='object' && 'error' in value ? value.error : null
    throw new AdminError(errors.includes(code as AdminErrorCode)?code as AdminErrorCode:body===undefined?'loadError':'saveError')
   }
   return value as T
  } catch(error) { throw error instanceof AdminError?error:new AdminError(body===undefined?'loadError':'saveError') }
  finally {clearTimeout(timer)}
 }
}
// CHỨC NĂNG: Poll một số phiên bản nhỏ, không tải toàn bộ ảnh base64 mỗi 3 giây.
// XỬ LÝ: Chỉ một timer cho mọi subscriber; hết người nghe thì hủy, không chồng request.
export function createHttpAdminService(base: string, pollMs=3000): AdminService {
 const request=transport(base),listeners=new Set<()=>void>()
 let stopped=true,timer:ReturnType<typeof setTimeout>|undefined,last='',failed=false,generation=0
 const notify=()=>listeners.forEach(listener=>listener())
 async function pulse(run:number) {
  try {const value=await request<{version:string}>('/version');if(run!==generation)return;if(value.version!==last||failed){last=value.version;failed=false;if(!stopped)notify()}}
  catch {if(run!==generation)return;failed=true;if(!stopped)notify()}
  if(!stopped&&run===generation)timer=setTimeout(()=>{void pulse(run)},pollMs)
 }
 async function command(action:string,args:unknown[]) {await request('/commands',{action,args},action==='generateAudio'?180000:8000);notify()}
 return {
  identity:()=>request('/identity'),load:()=>request('/document'),published:()=>request('/published'),
  savePlace:input=>command('savePlace',[input]),saveContent:input=>command('saveContent',[input]),
  translate:(...args)=>command('translate',args),generateAudio:(...args)=>command('generateAudio',args),
  submit:(...args)=>command('submit',args),review:(...args)=>command('review',args),publish:(...args)=>command('publish',args),
  archive:(...args)=>command('archive',args),deletePlace:(...args)=>command('deletePlace',args),
  // CHỨC NĂNG: Không cung cấp reset/số phiên giả qua API dùng chung.
  reset:async()=>{throw new AdminError('invalid')},simulate:async()=>{throw new AdminError('invalid')},endSessions:async()=>{throw new AdminError('invalid')},
  subscribe(listener){listeners.add(listener);if(stopped){stopped=false;const run=++generation;timer=setTimeout(()=>{void pulse(run)},pollMs)}return()=>{listeners.delete(listener);if(!listeners.size){stopped=true;generation++;if(timer)clearTimeout(timer)}}},
 }
}
export function createGateClient(base:string):GateClient {
 const request=transport(base)
 return {
  async entry(visitId,platform){await request('/gate/entry',{visitId,platform})},
  async statistics(){const value=await request<GateStats>('/gate/statistics');if(!Number.isSafeInteger(value.today)||value.today<0||typeof value.day!=='string')throw new AdminError('loadError');return value},
 }
}
// CHỨC NĂNG: Gửi lượt mở QR với cùng ID khi retry; server loại lượt lặp.
// XỬ LÝ: Không chặn giao diện du khách; dừng retry khi rời app hoặc sau ba lần lỗi.
export function sendGateEntry(client:GateClient,visitId:string,platform:'web'|'mobile-app') {
 let stopped=false,timer:ReturnType<typeof setTimeout>|undefined,attempt=0
 const send=async()=>{try{await client.entry(visitId,platform)}catch{if(!stopped&&++attempt<3)timer=setTimeout(()=>{void send()},2000)}}
 void send();return()=>{stopped=true;if(timer)clearTimeout(timer)}
}
/* CÁCH KIỂM TRA: Hai client đọc cùng bản; mất mạng không về dữ liệu cục bộ; HTTP409 hiện conflict; hủy subscriber dừng polling. */
