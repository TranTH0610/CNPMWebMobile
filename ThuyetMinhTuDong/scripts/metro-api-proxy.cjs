/**
 * FILE NÀY LÀM GÌ: Cơ chế dev proxy chung cho FE mobile, dùng HTTP server Metro.
 * Hai middleware admin/visitor gọi; chỉ chuyển tiếp, không có dữ liệu/nghiệp vụ BE mới.
 * allowed bắt buộc khai báo route; mặc định từ chối mọi API để không lộ route quản lý.
 */
const http = require('node:http')
const https = require('node:https')
function createDevApiProxy({ enabled = false, prefix, target, allowed = () => false, timeoutMs = 190000 }) {
  const base = new URL(target)
  if (!['http:', 'https:'].includes(base.protocol)) throw new Error('API target phải dùng HTTP(S).')
  if (!prefix || !prefix.startsWith('/')) throw new Error('Proxy prefix không hợp lệ.')
  return (req, res, next) => {
    if (!enabled || !(req.url === prefix || req.url.startsWith(prefix + '/'))) return next()
    const route = new URL(req.url.slice(prefix.length) || '/', 'http://metro.invalid')
    if (!allowed(req.method, route.pathname)) {
      res.writeHead(404, { 'Content-Type': 'application/json' }); res.end('{"error":"notFound"}'); return
    }
    // CHỨC NĂNG: Giữ JSON, status và Range của nguồn, không tạo số liệu thay thế.
    const url = new URL(base)
    url.pathname = base.pathname.replace(/\/$/, '') + route.pathname
    url.search = route.search
    const headers = { ...req.headers, host: url.host }
    delete headers.origin
    const transport = url.protocol === 'https:' ? https : http
    const upstream = transport.request(url, { method: req.method, headers }, response => {
      res.writeHead(response.statusCode || 502, response.headers)
      response.on('error', () => res.destroy())
      response.pipe(res)
    })
    // CHỨC NĂNG: Dọn kết nối khi client bỏ request hoặc mock API dừng.
    upstream.setTimeout(timeoutMs, () => upstream.destroy(new Error('API timeout')))
    upstream.on('error', () => {
      if (res.headersSent) { res.destroy(); return }
      res.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' }); res.end('{"error":"loadError"}')
    })
    req.on('aborted', () => upstream.destroy())
    res.on('close', () => { if (!res.writableEnded) upstream.destroy() })
    req.pipe(upstream)
  }
}
module.exports = { createDevApiProxy }
