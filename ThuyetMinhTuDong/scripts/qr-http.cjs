/**
 * FILE NÀY LÀM GÌ
 * Tiện ích request/xác minh kết nối HTTPS phục vụ tạo QR, gồm xử lý trường hợp DNS theo triển khai
 * hiện tại.
 *
 * VỊ TRÍ: scripts/qr-http.cjs
 * DÙNG BỞI: scripts/create-public-qr.cjs; scripts/start-public-demo.cjs.
 * PHỤ THUỘC: node:https; node:dns
 * TẠI SAO TÁCH FILE: Các bước chạy demo được tập trung trong công cụ để các máy thực hiện cùng
 * quy trình.
 */
// Khai báo https: require nạp module 'node:https' để dùng chức năng có sẵn thay vì chép lại.
const https = require('node:https')
// Khai báo { Resolver }: require nạp module 'node:dns' để dùng chức năng có sẵn thay vì chép lại.
const { Resolver } = require('node:dns')
// Khai báo readWithPublicDns(url). Nhận đầu vào qua tham số.
function readWithPublicDns(url) {
  // Trả kết quả: Tạo đối tượng bằng new Promise(resolve => { const dns = new Resolver({ timeout: 1500, tries: 2 }) dns.setServ.
  return new Promise(resolve => {
    // Khai báo dns: Tạo đối tượng bằng new Resolver({ timeout: 1500, tries: 2 }). | Gán thuộc tính timeout: giá trị số 1500. | Gán thuộc tính tries: giá trị số 2.
    const dns = new Resolver({ timeout: 1500, tries: 2 })
    // Thực hiện Gọi dns.setServers(['1.1.1.1', '8.8.8.8']).
    dns.setServers(['1.1.1.1', '8.8.8.8'])
    // Khai báo request: https.get đọc theo khóa. | Khai báo lookup(hostname, options, callback). Nhận đầu vào qua tham số.
    const request = https.get(url, { lookup(hostname, options, callback) {
      // Thực hiện Gọi dns.resolve4(hostname, (error, addresses) => { if (error || !addresses?.length) { callback.
      dns.resolve4(hostname, (error, addresses) => {
        // Rẽ nhánh nếu error || !addresses?.length. | Thực hiện Gọi callback(error || new Error('No public DNS record')). | Thoát hàm hiện tại ngay.
        if (error || !addresses?.length) { callback(error || new Error('No public DNS record')); return }
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `if (options.all) callback(null, addresses.map(address => ({ address, family: 4 })))`: Rẽ nhánh nếu options.all. | Thực hiện Gọi callback(null, addresses.map(address => ({ address, family: 4 }))). | Đặt trường address bằng giá trị của biến cùng tên. | Gán thuộc tính family: giá trị số 4.
         * DÒNG `else callback(null, addresses[0], 4)`: Rẽ nhánh nếu options.all. | Thực hiện Gọi callback(null, addresses[0], 4).
         * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `} }, response => {`: Khai báo lookup(hostname, options, callback). Nhận đầu vào qua tham số.
         */
        if (options.all) callback(null, addresses.map(address => ({ address, family: 4 })))
        else callback(null, addresses[0], 4)
      })
    } }, response => {
      // Rẽ nhánh nếu response.statusCode !== 200. | Thực hiện Gọi response.resume(). | Thực hiện Gọi resolve(null). | Thoát hàm hiện tại ngay.
      if (response.statusCode !== 200) { response.resume(); resolve(null); return }
      // Khai báo body: chuỗi ''.
      let body = ''
      // Thực hiện Gọi response.setEncoding('utf8').
      response.setEncoding('utf8')
      // Đăng ký xử lý sự kiện: response.on('data', chunk => { body += chunk }). | Thực hiện tính biểu thức body += chunk.
      response.on('data', chunk => { body += chunk })
      // Đăng ký xử lý sự kiện: response.on('end', () => resolve(body)).
      response.on('end', () => resolve(body))
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `response.on('error', () => resolve(null))`: Đăng ký xử lý sự kiện: response.on('error', () => resolve(null)).
       * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      response.on('error', () => resolve(null))
    })
    // Thực hiện setTimeout lên lịch tác vụ một lần. | Thực hiện Gọi request.destroy(). | Thực hiện Gọi resolve(null).
    request.setTimeout(5000, () => { request.destroy(); resolve(null) })
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `request.on('error', () => resolve(null))`: Đăng ký xử lý sự kiện: request.on('error', () => resolve(null)).
     * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    request.on('error', () => resolve(null))
  })
}
// TẠI SAO (readWithPublicDns): Tác vụ có thời gian chờ cần được lên lịch và dọn đúng vòng đời để
// không chạy lặp ngoài ý muốn.

// CHỨC NĂNG: Kiểm tra bằng fetch thường trước; chỉ dùng DNS dự phòng cho tunnel khi ENOTFOUND.
// XỬ LÝ: Không coi HTML lỗi hay kết nối thất bại là website đã sẵn sàng.
// Khai báo fetchQrPage(url, options). Nhận đầu vào qua tham số.
async function fetchQrPage(url, options) {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `try { return await fetch(url, options) }`: Bắt đầu vùng try. | Trả kết quả: await chờ fetch gửi HTTP request.
   * DÒNG `catch (error) {`: Bắt đầu vùng try.
   */
  try { return await fetch(url, options) }
  catch (error) {
    // Rẽ nhánh nếu !['ENOTFOUND', 'EAI_AGAIN'].includes(error.cause?.code) || !new URL(url).hostname.endsWith('.trycloudflare.com. | Ném error.
    if (!['ENOTFOUND', 'EAI_AGAIN'].includes(error.cause?.code) || !new URL(url).hostname.endsWith('.trycloudflare.com')) throw error
    // Khai báo body: await chờ Gọi readWithPublicDns(url).
    const body = await readWithPublicDns(url)
    // Rẽ nhánh nếu body === null. | Ném error.
    if (body === null) throw error
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return new Response(body, { status: 200, headers: { 'Content-Type': 'text/html' } })`: Trả kết quả: Tạo đối tượng bằng new Response(body, { status: 200, headers: { 'Content-Type': 'text/html' } }). | Gán thuộc tính status: giá trị số 200. | Gán thuộc tính headers: tạo object gồm 'Content-Type'. | Gán thuộc tính 'Content-Type': chuỗi 'text/html'.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return new Response(body, { status: 200, headers: { 'Content-Type': 'text/html' } })
  }
}
// TẠI SAO (fetchQrPage): Tách request giúp các nơi gọi dùng cùng địa chỉ, định dạng và cách xử
// lý lỗi.
// Thực hiện tính biểu thức module.exports = { readWithPublicDns, fetchQrPage }. | Đặt trường readWithPublicDns bằng giá trị của biến cùng tên. | Đặt trường fetchQrPage bằng giá trị của biến cùng tên.
module.exports = { readWithPublicDns, fetchQrPage }
/* CÁCH KIỂM TRA: DNS lỗi chỉ thử dự phòng với trycloudflare.com; TLS luôn được kiểm tra. */
