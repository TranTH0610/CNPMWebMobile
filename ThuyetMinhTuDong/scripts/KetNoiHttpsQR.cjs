/**
 * FILE: scripts/KetNoiHttpsQR.cjs
 * FILE NÀY LÀM GÌ: Tiện ích request/xác minh kết nối HTTPS phục vụ tạo QR, gồm xử lý trường hợp DNS theo triển khai
 * VAI TRÒ: Công cụ vận hành/khởi động; hỗ trợ UC, không phải màn hình nghiệp vụ.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC05: Bắt đầu tham quan bằng QR chung tại cổng.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
const https = require('node:https')
const { Resolver } = require('node:dns')
function readWithPublicDns(url) {
  // Trả kết quả: Tạo đối tượng bằng new Promise(resolve => { const dns = new Resolver({ timeout: 1500, tries: 2 }) dns.setServ.
  return new Promise(resolve => {
    const dns = new Resolver({ timeout: 1500, tries: 2 })
    dns.setServers(['1.1.1.1', '8.8.8.8'])
    const request = https.get(url, { lookup(hostname, options, callback) {
      dns.resolve4(hostname, (error, addresses) => {
        if (error || !addresses?.length) { callback(error || new Error('No public DNS record')); return }
        
        if (options.all) callback(null, addresses.map(address => ({ address, family: 4 })))
        else callback(null, addresses[0], 4)
      })
    } }, response => {
      if (response.statusCode !== 200) { response.resume(); resolve(null); return }
      let body = ''
      response.setEncoding('utf8')
      // Đăng ký xử lý sự kiện: response.on('data', chunk => { body += chunk }). | Thực hiện tính biểu thức body += chunk.
      response.on('data', chunk => { body += chunk })
      // Đăng ký xử lý sự kiện: response.on('end', () => resolve(body)).
      response.on('end', () => resolve(body))
      
      response.on('error', () => resolve(null))
    })
    request.setTimeout(5000, () => { request.destroy(); resolve(null) })
    
    request.on('error', () => resolve(null))
  })
}
// TẠI SAO (readWithPublicDns): Tác vụ có thời gian chờ cần được lên lịch và dọn đúng vòng đời để
// không chạy lặp ngoài ý muốn.

// CHỨC NĂNG: Kiểm tra bằng fetch thường trước; chỉ dùng DNS dự phòng cho tunnel khi ENOTFOUND.
// XỬ LÝ: Không coi HTML lỗi hay kết nối thất bại là website đã sẵn sàng.
// [UC05] fetchQrPage — Kiểm tra bằng fetch thường trước; chỉ dùng DNS dự phòng cho tunnel khi ENOTFOUND.
async function fetchQrPage(url, options) {
  
  try { return await fetch(url, options) }
  catch (error) {
    if (!['ENOTFOUND', 'EAI_AGAIN'].includes(error.cause?.code) || !new URL(url).hostname.endsWith('.trycloudflare.com')) throw error
    const body = await readWithPublicDns(url)
    if (body === null) throw error
    
    return new Response(body, { status: 200, headers: { 'Content-Type': 'text/html' } })
  }
}
// TẠI SAO (fetchQrPage): Tách request giúp các nơi gọi dùng cùng địa chỉ, định dạng và cách xử
// lý lỗi.
module.exports = { readWithPublicDns, fetchQrPage }
/* CÁCH KIỂM TRA: DNS lỗi chỉ thử dự phòng với trycloudflare.com; TLS luôn được kiểm tra. */
