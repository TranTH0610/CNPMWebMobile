/**
 * FILE NÀY LÀM GÌ
 * Triển khai hợp đồng quản trị qua HTTP; gom xử lý request, phản hồi, lỗi và theo dõi cập nhật dữ
 * liệu.
 *
 * VỊ TRÍ: packages/admin-core/src/services/httpService.ts
 * DÙNG BỞI: packages/admin-core/src/index.ts.
 * PHỤ THUỘC: ../domain/contracts; ../domain/models
 * TẠI SAO TÁCH FILE: Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho RAM được giữ tại
 * lớp kết nối này.
 */
// Nhập kiểu dữ liệu từ '../domain/contracts'.
import type { AdminService } from '../domain/contracts'
// Nhập các thành phần từ '../domain/models'.
import { AdminError, type AdminErrorCode } from '../domain/models'
// Khai báo hợp đồng GateStats. | Khai báo today, kiểu number. | Khai báo day, kiểu string.
export interface GateStats { today: number; day: string }
// Khai báo hợp đồng GateClient.
export interface GateClient { entry(visitId: string, platform: 'web'|'mobile-app'): Promise<void>; statistics(): Promise<GateStats> }
// Khai báo errors: tạo mảng ['loadError','saveError','invalid','conflict','notFound','notApproved','incomple.
const errors: readonly AdminErrorCode[] = ['loadError','saveError','invalid','conflict','notFound','notApproved','incomplete','staleJob']
// CHỨC NĂNG: Gửi HTTP và chuẩn hóa lỗi của quản trị.
// XỬ LÝ: Màn hình nhận mã lỗi nghiệp vụ thay vì phụ thuộc chi tiết response của fetch.
// Khai báo transport(base). Nhận đầu vào qua tham số.
function transport(base: string) {
 // Trả kết quả: khai báo callback async <T,>(path: string, body?: unknown, timeoutMs = 8000): Promise<T> => {.
 return async <T,>(path: string, body?: unknown, timeoutMs = 8000): Promise<T> => {
  // Rẽ nhánh nếu !base. | Ném new AdminError('loadError').
  if (!base) throw new AdminError('loadError')
  // Khai báo controller: AbortController tạo tín hiệu hủy riêng cho tác vụ, tránh request treo vô hạn | Khai báo timer: setTimeout lên lịch tác vụ một lần.
  const controller = new AbortController(), timer = setTimeout(()=>controller.abort(),timeoutMs)
  // Bắt đầu vùng try.
  try {
   // Khai báo response: await chờ fetch gửi HTTP request. | Gán thuộc tính method: chọn giữa hai giá trị theo điều kiện body===undefined. | Gán thuộc tính headers: chọn giữa hai giá trị theo điều kiện body===undefined. | Gán thuộc tính 'Content-Type': chuỗi 'application/json'. | Gán thuộc tính body: chọn giữa hai giá trị theo điều kiện body===undefined. | Gán thuộc tính signal: đọc controller.signal từ đối tượng/mảng để dùng tại bước hiện tại. Cho phép hủy request khi hết thời gian chờ hoặc tác vụ không còn cần thiết.
   const response = await fetch(base.replace(/\/$/,'')+path,{method:body===undefined?'GET':'POST',headers:body===undefined?undefined:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body),signal:controller.signal})
   // Khai báo value: await chờ Gọi response.json().
   const value: unknown = await response.json()
   // Rẽ nhánh nếu !response.ok.
   if (!response.ok) {
    // Khai báo code: chọn giữa hai giá trị theo điều kiện value && typeof value==='object' && 'error' in value.
    const code = value && typeof value==='object' && 'error' in value ? value.error : null
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `throw new AdminError(errors.includes(code as AdminErrorCode)?code as AdminErrorCode:b`: Ném new AdminError(errors.includes(code as AdminErrorCode)?code as AdminErrorCode:body===undefined?'loadError':'sa.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    throw new AdminError(errors.includes(code as AdminErrorCode)?code as AdminErrorCode:body===undefined?'loadError':'saveError')
   }
   /* GIẢI THÍCH TỪNG DÒNG:
    * DÒNG `return value as T`: Trả kết quả: sử dụng value làm giá trị của bước hiện tại.
    * DÒNG `} catch(error) { throw error instanceof AdminError?error:new AdminError(body===undefi`: Bắt đầu vùng try. | Ném error instanceof AdminError?error:new AdminError(body===undefined?'loadError':'saveError').
    * DÒNG `finally {clearTimeout(timer)}`: Bắt đầu vùng try. | Dọn đăng ký/timer: clearTimeout(timer).
    * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
    * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
    */
   return value as T
  } catch(error) { throw error instanceof AdminError?error:new AdminError(body===undefined?'loadError':'saveError') }
  finally {clearTimeout(timer)}
 }
}
// TẠI SAO (transport): UI cần biết mã lỗi nghiệp vụ để hiển thị đúng; nếu mỗi màn tự fetch sẽ dễ
// xử lý lỗi không nhất quán.
// CHỨC NĂNG: Poll một số phiên bản nhỏ, không tải toàn bộ ảnh base64 mỗi 3 giây.
// XỬ LÝ: Chỉ một timer cho mọi subscriber; hết người nghe thì hủy, không chồng request.
// Khai báo createHttpAdminService(base, pollMs). Nhận đầu vào qua tham số.
export function createHttpAdminService(base: string, pollMs=3000): AdminService {
 // CHỨC NĂNG: Các callback nhận thay đổi; dùng Set để không đăng ký trùng cùng tham chiếu.
 // Khai báo request: Gọi transport(base).
 const request=transport(base),listeners=new Set<()=>void>()
 // CHỨC NĂNG: Cờ dừng tác vụ lặp; không lên lịch hoặc xử lý tiếp khi đã cleanup.
 // Khai báo stopped: sử dụng true làm giá trị của bước hiện tại | Khai báo timer: không có giá trị khởi tạo.
 let stopped=true,timer:ReturnType<typeof setTimeout>|undefined,last='',failed=false,generation=0
 // Khai báo notify: khai báo callback ()=>listeners.forEach(listener=>listener()).
 const notify=()=>listeners.forEach(listener=>listener())
 // TẠI SAO (notify): Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho RAM được giữ tại
 // lớp kết nối này.
 // Khai báo pulse(run). Nhận đầu vào qua tham số.
 async function pulse(run:number) {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `try {const value=await request<{version:string}>('/version');if(run!==generation)retu`: Bắt đầu vùng try. | Khai báo value: await chờ Gọi request<{version:string}>('/version'). | Khai báo version, kiểu string. | Rẽ nhánh nếu run!==generation. | Thoát hàm hiện tại ngay. | Rẽ nhánh nếu value.version!==last||failed. | Thực hiện tính biểu thức last=value.version. | Thực hiện tính biểu thức failed=false. | Rẽ nhánh nếu !stopped. | Thực hiện Gọi notify().
   * DÒNG `catch {if(run!==generation)return;failed=true;if(!stopped)notify()}`: Bắt đầu vùng try. | Rẽ nhánh nếu run!==generation. | Thoát hàm hiện tại ngay. | Thực hiện tính biểu thức failed=true. | Rẽ nhánh nếu !stopped. | Thực hiện Gọi notify().
   */
  try {const value=await request<{version:string}>('/version');if(run!==generation)return;if(value.version!==last||failed){last=value.version;failed=false;if(!stopped)notify()}}
  catch {if(run!==generation)return;failed=true;if(!stopped)notify()}
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `if(!stopped&&run===generation)timer=setTimeout(()=>{void pulse(run)},pollMs)`: Rẽ nhánh nếu !stopped&&run===generation. | Thực hiện tính biểu thức timer=setTimeout(()=>{void pulse(run)},pollMs). | Thực hiện sử dụng void pulse(run) làm giá trị của bước hiện tại.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  if(!stopped&&run===generation)timer=setTimeout(()=>{void pulse(run)},pollMs)
 }
 // TẠI SAO (pulse): Tác vụ có thời gian chờ cần được lên lịch và dọn đúng vòng đời để không chạy
 // lặp ngoài ý muốn.
 // CHỨC NĂNG: Gửi một thao tác quản trị đến mock API.
 // XỬ LÝ: Tên lệnh và đối số theo hợp đồng; kiểm tra dữ liệu và revision vẫn do nơi nhận thực hiện.
 // Khai báo command(action, args). Nhận đầu vào qua tham số. | Thực hiện await chờ Gọi request('/commands',{action,args},action==='generateAudio'?180000:8000). | Đặt trường action bằng giá trị của biến cùng tên. | Đặt trường args bằng giá trị của biến cùng tên. | Thực hiện Gọi notify().
 async function command(action:string,args:unknown[]) {await request('/commands',{action,args},action==='generateAudio'?180000:8000);notify()}
 // TẠI SAO (command): Mọi thao tác quản trị phải đi qua cùng API kiểm tra lệnh và revision, không
 // ghi tùy ý cả document từ giao diện.
 // Trả kết quả: tạo object gồm identity, load, published, savePlace, saveContent, translate, generateAudio, submit, review.
 return {
  // Gán thuộc tính identity: khai báo callback ()=>request('/identity'). | Gán thuộc tính load: khai báo callback ()=>request('/document'). | Gán thuộc tính published: khai báo callback ()=>request('/published').
  identity:()=>request('/identity'),load:()=>request('/document'),published:()=>request('/published'),
  // Gán thuộc tính savePlace: khai báo callback input=>command('savePlace',[input]). | Gán thuộc tính saveContent: khai báo callback input=>command('saveContent',[input]).
  savePlace:input=>command('savePlace',[input]),saveContent:input=>command('saveContent',[input]),
  // Gán thuộc tính translate: khai báo callback (...args)=>command('translate',args). | Gán thuộc tính generateAudio: khai báo callback (...args)=>command('generateAudio',args).
  translate:(...args)=>command('translate',args),generateAudio:(...args)=>command('generateAudio',args),
  // Gán thuộc tính submit: khai báo callback (...args)=>command('submit',args). | Gán thuộc tính review: khai báo callback (...args)=>command('review',args). | Gán thuộc tính publish: khai báo callback (...args)=>command('publish',args).
  submit:(...args)=>command('submit',args),review:(...args)=>command('review',args),publish:(...args)=>command('publish',args),
  // Gán thuộc tính archive: khai báo callback (...args)=>command('archive',args). | Gán thuộc tính deletePlace: khai báo callback (...args)=>command('deletePlace',args).
  archive:(...args)=>command('archive',args),deletePlace:(...args)=>command('deletePlace',args),
  // CHỨC NĂNG: Không cung cấp reset/số phiên giả qua API dùng chung.
  // Gán thuộc tính reset: khai báo callback async()=>{throw new AdminError('invalid')}. | Ném new AdminError('invalid'). | Gán thuộc tính simulate: khai báo callback async()=>{throw new AdminError('invalid')}. | Gán thuộc tính endSessions: khai báo callback async()=>{throw new AdminError('invalid')}.
  reset:async()=>{throw new AdminError('invalid')},simulate:async()=>{throw new AdminError('invalid')},endSessions:async()=>{throw new AdminError('invalid')},
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `subscribe(listener){listeners.add(listener);if(stopped){stopped=false;const run=++gen`: Khai báo subscribe(listener). Nhận đầu vào qua tham số. | Thực hiện listeners.add đăng ký một callback nhận thay đổi. | Rẽ nhánh nếu stopped. | Thực hiện tính biểu thức stopped=false. | Khai báo run: sử dụng ++generation làm giá trị của bước hiện tại. | Thực hiện tính biểu thức timer=setTimeout(()=>{void pulse(run)},pollMs). | Thực hiện sử dụng void pulse(run) làm giá trị của bước hiện tại. | Trả kết quả: khai báo callback ()=>{listeners.delete(listener). | Thực hiện listeners.delete gỡ callback đã đăng ký để nơi rời màn không tiếp tục nhận cập nhật. | Rẽ nhánh nếu !listeners.size. | Thực hiện tính biểu thức stopped=true. | Thực hiện sử dụng generation++ làm giá trị của bước hiện tại. | Rẽ nhánh nếu timer. | Dọn đăng ký/timer: clearTimeout(timer).
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  subscribe(listener){listeners.add(listener);if(stopped){stopped=false;const run=++generation;timer=setTimeout(()=>{void pulse(run)},pollMs)}return()=>{listeners.delete(listener);if(!listeners.size){stopped=true;generation++;if(timer)clearTimeout(timer)}}},
  // TẠI SAO (subscribe): Tác vụ có thời gian chờ cần được lên lịch và dọn đúng vòng đời để không
  // chạy lặp ngoài ý muốn.
 }
}
// TẠI SAO (createHttpAdminService): Giữ hợp đồng service ổn định giúp thay mock bằng BE thật mà
// ít ảnh hưởng các màn hình.
// CHỨC NĂNG: Tạo client ghi lượt vào và đọc thống kê QR.
// XỬ LÝ: Dùng hợp đồng riêng với thống kê phiên vì lượt QR và phiên hoạt động có ý nghĩa khác
// nhau.
// Khai báo createGateClient(base). Nhận đầu vào qua tham số.
export function createGateClient(base:string):GateClient {
 // Khai báo request: Gọi transport(base).
 const request=transport(base)
 // Trả kết quả: tạo object gồm entry, statistics.
 return {
  // Khai báo entry(visitId, platform). Nhận đầu vào qua tham số. | Thực hiện await chờ Gọi request('/gate/entry',{visitId,platform}). | Đặt trường visitId bằng giá trị của biến cùng tên. | Đặt trường platform bằng giá trị của biến cùng tên.
  async entry(visitId,platform){await request('/gate/entry',{visitId,platform})},
  // TẠI SAO (entry): Tách request giúp các nơi gọi dùng cùng địa chỉ, định dạng và cách xử lý lỗi.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `async statistics(){const value=await request<GateStats>('/gate/statistics');if(!Numbe`: Khai báo statistics(). Nhận đầu vào qua tham số. | Khai báo value: await chờ Gọi request<GateStats>('/gate/statistics'). | Rẽ nhánh nếu !Number.isSafeInteger(value.today)||value.today<0||typeof value.day!=='string'. | Ném new AdminError('loadError'). | Trả kết quả: sử dụng value làm giá trị của bước hiện tại.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  async statistics(){const value=await request<GateStats>('/gate/statistics');if(!Number.isSafeInteger(value.today)||value.today<0||typeof value.day!=='string')throw new AdminError('loadError');return value},
  // TẠI SAO (statistics): Đầu vào hoặc kết quả có thể không hợp lệ; kiểm tra tại đây để nơi gọi
  // không phải xử lý dữ liệu sai như thành công.
 }
}
// TẠI SAO (createGateClient): Lượt mở QR và phiên đang hoạt động là hai số liệu khác nhau nên
// cần hợp đồng gọi riêng.
// CHỨC NĂNG: Gửi lượt mở QR với cùng ID khi retry; server loại lượt lặp.
// XỬ LÝ: Không chặn giao diện du khách; dừng retry khi rời app hoặc sau ba lần lỗi.
// Khai báo sendGateEntry(client, visitId, platform). Nhận đầu vào qua tham số.
export function sendGateEntry(client:GateClient,visitId:string,platform:'web'|'mobile-app') {
 // CHỨC NĂNG: Cờ dừng tác vụ lặp; không lên lịch hoặc xử lý tiếp khi đã cleanup.
 // Khai báo stopped: sử dụng false làm giá trị của bước hiện tại | Khai báo timer: không có giá trị khởi tạo.
 let stopped=false,timer:ReturnType<typeof setTimeout>|undefined,attempt=0
 // Khai báo send: khai báo callback async()=>{try{await client.entry(visitId,platform)}catch{if(!stopped&&++att. | Bắt đầu vùng try. | Thực hiện await chờ Gọi client.entry(visitId,platform). | Rẽ nhánh nếu !stopped&&++attempt<3. | Thực hiện tính biểu thức timer=setTimeout(()=>{void send()},2000). | Thực hiện sử dụng void send() làm giá trị của bước hiện tại.
 const send=async()=>{try{await client.entry(visitId,platform)}catch{if(!stopped&&++attempt<3)timer=setTimeout(()=>{void send()},2000)}}
 // TẠI SAO (send): Tác vụ có thời gian chờ cần được lên lịch và dọn đúng vòng đời để không chạy
 // lặp ngoài ý muốn.
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `void send();return()=>{stopped=true;if(timer)clearTimeout(timer)}`: Thực hiện sử dụng void send() làm giá trị của bước hiện tại. | Trả kết quả: khai báo callback ()=>{stopped=true. | Thực hiện tính biểu thức stopped=true. | Rẽ nhánh nếu timer. | Dọn đăng ký/timer: clearTimeout(timer).
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 void send();return()=>{stopped=true;if(timer)clearTimeout(timer)}
}
// TẠI SAO (sendGateEntry): Cùng mã lượt có thể được thử lại khi mạng lỗi mà không biến thành
// nhiều lượt khác nhau.
/* CÁCH KIỂM TRA: Hai client đọc cùng bản; mất mạng không về dữ liệu cục bộ; HTTP409 hiện conflict; hủy subscriber dừng polling. */
