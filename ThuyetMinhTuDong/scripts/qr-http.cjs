/** FILE NÀY LÀM GÌ: Kiểm tra HTTPS tunnel có dự phòng DNS công khai khi Windows cache lỗi.
 * create-public-qr.cjs và start-public-demo.cjs dùng; phụ thuộc https và dns built-in.
 * Không thay DNS hệ thống, không bỏ kiểm tra chứng chỉ hoặc hostname TLS.
 */
const https = require('node:https')
const { Resolver } = require('node:dns')
function readWithPublicDns(url) {
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
      response.on('data', chunk => { body += chunk })
      response.on('end', () => resolve(body))
      response.on('error', () => resolve(null))
    })
    request.setTimeout(5000, () => { request.destroy(); resolve(null) })
    request.on('error', () => resolve(null))
  })
}

// CHỨC NĂNG: Kiểm tra bằng fetch thường trước; chỉ dùng DNS dự phòng cho tunnel khi ENOTFOUND.
// XỬ LÝ: Không coi HTML lỗi hay kết nối thất bại là website đã sẵn sàng.
async function fetchQrPage(url, options) {
  try { return await fetch(url, options) }
  catch (error) {
    if (!['ENOTFOUND', 'EAI_AGAIN'].includes(error.cause?.code) || !new URL(url).hostname.endsWith('.trycloudflare.com')) throw error
    const body = await readWithPublicDns(url)
    if (body === null) throw error
    return new Response(body, { status: 200, headers: { 'Content-Type': 'text/html' } })
  }
}
module.exports = { readWithPublicDns, fetchQrPage }
/* CÁCH KIỂM TRA: DNS lỗi chỉ thử dự phòng với trycloudflare.com; TLS luôn được kiểm tra. */
