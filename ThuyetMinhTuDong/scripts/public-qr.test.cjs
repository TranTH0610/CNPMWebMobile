/**
 * FILE NÀY LÀM GÌ: Kiểm tra QR công khai không chứa link Expo và giữ biến .env khác.
 * npm test gọi; phụ thuộc Node test và create-public-qr.cjs. Liên quan UC05.
 */
const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { sharedEntryUrl, setVariable } = require('./create-public-qr.cjs')

test('QR chung luôn là website HTTPS, không phải QR Expo', () => {
  assert.equal(sharedEntryUrl('https://guide.test'), 'https://guide.test/')
  for (const value of ['exp://192.168.1.20:8081', 'exps://expo.dev', 'http://192.168.1.20',
    'https://localhost', 'https://guide.test/places/ngo-mon', 'https://hue-guide.example']) {
    assert.throws(() => sharedEntryUrl(value))
  }
})

test('Cập nhật URL không xóa biến khác và có bản sao cấu hình', () => {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'visitor-qr-'))
  const file = path.join(folder, '.env')
  const backup = path.join(folder, 'before.txt')
  try {
    const original = 'OTHER_SETTING=keep\nVITE_PUBLIC_SITE_URL=https://old.test\n'
    fs.writeFileSync(file, original)
    setVariable(file, 'VITE_PUBLIC_SITE_URL', 'https://new.test', backup)
    assert.equal(fs.readFileSync(backup, 'utf8'), original)
    const next = fs.readFileSync(file, 'utf8')
    assert.ok(next.includes('OTHER_SETTING=keep'))
    assert.equal(next.match(/VITE_PUBLIC_SITE_URL=/g).length, 1)
    assert.ok(next.includes('VITE_PUBLIC_SITE_URL=https://new.test'))
  } finally {
    for (const name of [file, backup]) fs.rmSync(name, { force: true })
    fs.rmdirSync(folder)
  }
})
