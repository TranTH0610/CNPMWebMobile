/**
 * FILE NÀY LÀM GÌ: Kiểm tra nghiệp vụ UC06–UC11 bằng adapter audio/GPS giả.
 * npm test gọi; không phát loa, không cần mạng. Kiểm tra race và quy tắc thật,
 * không dùng đồng hồ giả thay cho thời lượng audio ở giao diện sản phẩm.
 */
const { test } = require('node:test')
const assert = require('node:assert/strict')
const { JourneyController, nearest, parseSaved, clampTime, routeAvailable } = require('../.test-build/journey/journey.js')
const { createCatalog } = require('../.test-build/catalog/catalog.js')
const { MOCK_PLACES } = require('../.test-build/data/mock.js')
const tick = () => new Promise(resolve => setImmediate(resolve))
// CHỨC NĂNG: Các test GPS dùng hệ tọa độ 0,0 riêng, không lẫn tọa độ Huế thật.
const TEST_PLACES = MOCK_PLACES.map(place => ({ ...place, position: undefined }))

function track() {
  const listeners = new Set()
  const t = { duration: 30, position: 0, playing: false, plays: 0, disposed: false,
    async play() { this.playing = true; this.plays++; this.emit() },
    pause() { this.playing = false; this.emit() },
    async seek(value) { this.position = value; this.emit() }, rate() {},
    listen(callback) { listeners.add(callback); return () => listeners.delete(callback) },
    dispose() { this.disposed = true; this.playing = false },
    emit(ended = false, error = false) { listeners.forEach(l => l({ position: this.position, duration: 30, playing: this.playing, ended, error })) },
  }
  return t
}
function fixture(extra = {}) {
  const writes = [], tracks = []
  const ports = {
    catalog: createCatalog(async () => TEST_PLACES),
    positions: { 'ngo-mon': { lat: 0, lng: 0, source: 'test', fieldVerified: true } }, routes: [],
    open: async () => { const t = track(); tracks.push(t); return t },
    watch: async () => () => {}, read: async () => null, write: async value => { writes.push(value) },
    ...extra,
  }
  return { engine: new JourneyController(ports), writes, tracks }
}
const fix = (lng = 0) => ({ lat: 0, lng, accuracy: 5, timestamp: Date.now() })

test('UC06: chỉ chọn điểm trong 100m, dữ liệu GPS cũ/sai bị loại', () => {
  const { engine } = fixture(), places = [TEST_PLACES[1]], points = engine.ports.positions
  assert.equal(nearest(places, points, fix()), 'ngo-mon')
  assert.equal(nearest(places, points, fix(0.00089)), 'ngo-mon')
  assert.equal(nearest(places, points, fix(0.00091)), undefined)
  assert.equal(nearest(places, points, { ...fix(), accuracy: 100 }), undefined)
  assert.equal(nearest(places, points, { ...fix(), timestamp: Date.now() - 31000 }), undefined)
  assert.equal(nearest(places, points, { ...fix(), lat: NaN }), undefined)
})
test('UC06: khoảng cách bằng nhau giữ điểm trước', () => {
  const points = { 'ngo-mon': { lat: 0, lng: 0 }, 'ky-dai': { lat: 0, lng: 0 } }
  assert.equal(nearest(TEST_PLACES, points, fix(), 'ngo-mon'), 'ngo-mon')
})
test('UC06/07: đang nghe giữ bài và màn; tạm dừng được gợi ý nhưng không tự phát', async () => {
  const { engine, tracks } = fixture(); await engine.start()
  await engine.play('ky-dai', 'vi'); engine.acceptFix(fix())
  assert.equal(engine.snapshot().suggestedId, undefined)
  assert.equal(tracks[0].plays, 1)
  engine.pause(); engine.acceptFix(fix())
  assert.equal(engine.snapshot().suggestedId, 'ngo-mon')
  assert.equal(engine.snapshot().session.placeId, 'ky-dai')
  assert.equal(tracks[0].plays, 1); engine.dispose()
})
test('UC07: pause/seek giữ paused, tua clamp theo thời lượng thật', async () => {
  const { engine, tracks } = fixture(); await engine.start(); await engine.play('ngo-mon', 'vi')
  tracks[0].position = 8; tracks[0].emit(); engine.pause()
  await engine.seek(999); assert.equal(tracks[0].position, 30)
  assert.equal(engine.snapshot().status, 'paused')
  await engine.seek(-10); assert.equal(tracks[0].position, 0)
  await engine.resume(); assert.equal(engine.snapshot().status, 'playing')
  engine.dispose()
})
test('UC07: chỉ một bài phát và nguồn cũ được giải phóng', async () => {
  const { engine, tracks } = fixture(); await engine.start()
  await engine.play('ngo-mon', 'vi'); await engine.play('ky-dai', 'vi')
  assert.equal(tracks[0].disposed, true); assert.equal(tracks[0].playing, false)
  assert.equal(tracks[1].playing, true); engine.dispose()
})
test('UC07.3: lỗi tốc độ giữ tốc độ đang có hiệu lực', async () => {
  const { engine, tracks } = fixture(); await engine.start(); await engine.play('ngo-mon', 'vi')
  tracks[0].rate = () => { throw Error('unsupported') }; engine.rate(1.5)
  assert.equal(engine.snapshot().session.rate, 1)
  assert.equal(engine.snapshot().error, 'audioFailed'); engine.dispose()
})
test('UC08: đổi ngôn ngữ đang nghe phát bản mới từ 0; paused vẫn paused', async () => {
  const { engine, tracks } = fixture(); await engine.start(); await engine.play('ngo-mon', 'vi')
  tracks[0].position = 12; tracks[0].emit(); engine.changeLanguage('cn'); await tick()
  assert.equal(engine.snapshot().session.language, 'cn')
  assert.equal(engine.snapshot().session.position, 0); assert.equal(engine.snapshot().status, 'playing')
  engine.pause(); engine.changeLanguage('pt'); await tick()
  assert.equal(engine.snapshot().session.language, 'pt')
  assert.equal(engine.snapshot().status, 'paused'); engine.dispose()
})
test('UC07/08: phản hồi nguồn cũ đến muộn không phát đè bản mới', async () => {
  let release
  const late = track(), recent = track()
  const { engine } = fixture({ open: url => url === MOCK_PLACES[1].content.vi.audio.url ? new Promise(resolve => { release = resolve }) : Promise.resolve(recent) })
  await engine.start(); const first = engine.play('ngo-mon', 'vi'); await tick()
  await engine.play('ngo-mon', 'en'); release(late); await first
  assert.equal(late.plays, 0); assert.equal(late.disposed, true)
  assert.equal(recent.plays, 1); assert.equal(engine.snapshot().session.language, 'en'); engine.dispose()
})
test('UC07: thiếu audio đã công bố không tự dùng bản nháp', async () => {
  const place = JSON.parse(JSON.stringify(MOCK_PLACES[1])); place.content.vi.audio.status = 'draft'
  const { engine, tracks } = fixture({ catalog: createCatalog(async () => [place]) })
  await engine.start(); await engine.play(place.id, 'vi')
  assert.equal(engine.snapshot().error, 'audioMissing'); assert.equal(tracks.length, 0); engine.dispose()
})
test('UC07: kết thúc không phát bài kế tiếp', async () => {
  const { engine, tracks } = fixture(); await engine.start(); await engine.play('ngo-mon', 'vi')
  tracks[0].position = 30; tracks[0].playing = false; tracks[0].emit(true)
  assert.equal(engine.snapshot().status, 'ended'); assert.equal(tracks.length, 1); engine.dispose()
})
test('UC10: tuyến có điểm bị rút không được sử dụng', () => {
  const route = { available: true, stops: ['ngo-mon', 'gone'] }
  assert.equal(routeAvailable(route, MOCK_PLACES), false)
  assert.equal(routeAvailable({ ...route, stops: ['ngo-mon'] }, MOCK_PLACES), true)
})
test('UC11: bản lưu hỏng bị loại; tiến độ vượt thời lượng được clamp', () => {
  assert.equal(parseSaved('{bad'), undefined)
  assert.equal(parseSaved(JSON.stringify({ placeId: 'ngo-mon', language: 'xx' })), undefined)
  assert.equal(clampTime(-10, 30), 0); assert.equal(clampTime(NaN, 30), 0)
})
test('UC11: mở lại chỉ đề nghị, đúng phiên bản mới tiếp tục tại thời điểm cũ', async () => {
  const saved = { placeId: 'ngo-mon', language: 'vi', textVersion: MOCK_PLACES[1].content.vi.version, audioId: MOCK_PLACES[1].content.vi.audio.id, audioVersion: MOCK_PLACES[1].content.vi.audio.version, position: 9, duration: 30, rate: 1.25 }
  const { engine, tracks } = fixture({ read: async () => JSON.stringify(saved) })
  await engine.start(); assert.equal(tracks.length, 0); assert.equal(engine.snapshot().changed, false)
  await engine.restorePlay(); assert.equal(tracks[0].position, 9); assert.equal(engine.snapshot().session.rate, 1.25)
  engine.dispose()
})
test('UC11: phiên bản thay đổi thì đề nghị nghe mới từ đầu', async () => {
  const saved = { placeId: 'ngo-mon', language: 'vi', textVersion: 99, audioId: 'old', audioVersion: 1, position: 9, duration: 30, rate: 1 }
  const { engine, tracks } = fixture({ read: async () => JSON.stringify(saved) })
  await engine.start(); assert.equal(engine.snapshot().changed, true); assert.equal(tracks.length, 0)
  await engine.restorePlay(); assert.equal(tracks[0].position, 0); engine.dispose()
})
test('UC11: lỗi ghi không dừng âm thanh', async () => {
  const { engine, tracks } = fixture({ write: async () => { throw Error('full') } })
  await engine.start(); await engine.play('ngo-mon', 'vi'); await tick()
  assert.equal(engine.snapshot().error, 'saveFailed'); assert.equal(tracks[0].playing, true); engine.dispose()
})

// CHỨC NĂNG: Lỗi bộ nhớ không được làm mất danh sách UC06/UC09.
test('UC11: lỗi đọc bộ nhớ vẫn hiển thị địa điểm', async () => {
  const { engine } = fixture({ read: async () => { throw Error('blocked') } })
  await engine.start(); assert.equal(engine.snapshot().places.length, 8)
  assert.equal(engine.snapshot().error, 'saveFailed'); engine.dispose()
})
// CHỨC NĂNG: Đã nghe hết thì không đề nghị tiếp tục khi khởi động lại.
test('UC11: dispose không ghi lại bài đã kết thúc', async () => {
  const { engine, tracks, writes } = fixture(); await engine.start(); await engine.play('ngo-mon', 'vi')
  tracks[0].position = 30; tracks[0].playing = false; tracks[0].emit(true)
  engine.dispose(); await tick(); assert.equal(writes.at(-1), null)
})
// CHỨC NĂNG: Lỗi audio sau metadata phải được UI nhận và giải phóng nguồn.
test('UC07: lỗi nguồn đang phát được truyền tới UI', async () => {
  const { engine, tracks } = fixture(); await engine.start(); await engine.play('ngo-mon', 'vi')
  tracks[0].emit(false, true)
  assert.equal(engine.snapshot().status, 'error')
  assert.equal(tracks[0].disposed, true)
  engine.dispose()
})

// CHỨC NĂNG: Pause trước khi Promise play hoàn tất không được bị báo audioFailed.
// XỬ LÝ: Mô phỏng AbortError thật của HTML Audio để giữ nguồn và thời điểm paused.
for (const initial of [true, false]) {
  test('UC07: pause trong lúc ' + (initial ? 'play' : 'resume') + ' còn chờ không làm hỏng phiên', async () => {
    const t = track()
    const { engine } = fixture({ open: async () => t })
    await engine.start()
    if (!initial) await engine.play('ngo-mon', 'vi', 0, false)
    let rejectPlay
    t.play = async () => {
      t.playing = true; t.emit()
      await new Promise((_resolve, reject) => { rejectPlay = reject })
    }
    const waiting = initial ? engine.play('ngo-mon', 'vi') : engine.resume()
    await tick(); engine.pause()
    const error = new Error('play interrupted by pause'); error.name = 'AbortError'
    rejectPlay(error); await waiting
    assert.equal(engine.snapshot().status, 'paused')
    assert.equal(engine.snapshot().error, undefined)
    assert.equal(t.disposed, false)
    engine.dispose()
  })
}

// CHỨC NĂNG: × dừng nguồn thật, xóa checkpoint và không tự mở lại khi đổi ngôn ngữ.
test('UC07: close dừng/giải phóng nguồn, xóa phiên và checkpoint', async () => {
  const { engine, tracks, writes } = fixture()
  await engine.start(); await engine.play('ngo-mon', 'vi')
  engine.close(); engine.changeLanguage('en'); engine.retry(); engine.checkpoint(); await tick()
  assert.equal(tracks[0].playing, false); assert.equal(tracks[0].disposed, true)
  assert.equal(engine.snapshot().status, 'idle'); assert.equal(engine.snapshot().session, undefined)
  assert.equal(engine.snapshot().restore, undefined); assert.equal(engine.snapshot().error, undefined)
  assert.equal(tracks.length, 1); assert.equal(writes.at(-1), null)
  engine.dispose()
})
// CHỨC NĂNG: Đóng trong lúc tải không được phát lại khi request cũ trả về.
test('UC07: close khi tải chậm loại nguồn đến muộn', async () => {
  let release
  const late = track()
  const { engine } = fixture({ open: () => new Promise(resolve => { release = resolve }) })
  await engine.start(); const loading = engine.play('ngo-mon', 'vi'); await tick()
  engine.close(); release(late); await loading
  assert.equal(late.plays, 0); assert.equal(late.disposed, true)
  assert.equal(engine.snapshot().status, 'idle'); assert.equal(engine.snapshot().session, undefined)
  engine.dispose()
})
// CHỨC NĂNG: Bộ nhớ bị chặn không mở lại thanh nghe vừa đóng.
test('UC07/11: lỗi ghi đến muộn sau close không mở lại player', async () => {
  const { engine } = fixture({ write: async () => { throw Error('blocked') } })
  await engine.start(); await engine.play('ngo-mon', 'vi'); engine.close(); await tick()
  assert.equal(engine.snapshot().session, undefined); assert.equal(engine.snapshot().error, undefined)
  assert.equal(engine.snapshot().status, 'idle'); engine.dispose()
})

// CHỨC NĂNG: Tọa độ được Admin công bố phải được ưu tiên hơn marker cũ.
test('UC06: gợi ý GPS dùng position mới công bố',()=>{
 const place={...MOCK_PLACES[1],position:{lat:0,lng:0,verified:true}}
 assert.equal(nearest([place],{'ngo-mon':{lat:16.4676824,lng:107.5791834}},fix()),'ngo-mon')
})
