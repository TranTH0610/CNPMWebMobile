/**
 * FILE NÀY LÀM GÌ
 * Kiểm tra bài nghe, GPS, tuyến, tiến độ, đổi ngôn ngữ và phản hồi đến muộn của nguồn audio.
 *
 * VỊ TRÍ: packages/visitor-core/tests/journey.test.cjs
 * DÙNG BỞI: Bộ chạy test tương ứng trong package.json.
 * PHỤ THUỘC: node:test; node:assert/strict; ../.test-build/journey/journey.js;
 * ../.test-build/catalog/catalog.js; ../.test-build/data/mock.js
 * TẠI SAO TÁCH FILE: Kiểm tra hành vi tự động giúp phát hiện lỗi mà không phải thao tác lại toàn
 * bộ giao diện.
 */
// Khai báo { test }: require nạp module 'node:test' để dùng chức năng có sẵn thay vì chép lại.
const { test } = require('node:test')
// Khai báo assert: require nạp module 'node:assert/strict' để dùng chức năng có sẵn thay vì chép lại.
const assert = require('node:assert/strict')
// Khai báo { JourneyController, nearest, parseSaved, clampTime, routeAvailable }: require nạp module '../.test-build/journey/journey.js' để dùng chức năng có sẵn thay vì chép lại.
const { JourneyController, nearest, parseSaved, clampTime, routeAvailable } = require('../.test-build/journey/journey.js')
// Khai báo { createCatalog }: require nạp module '../.test-build/catalog/catalog.js' để dùng chức năng có sẵn thay vì chép lại.
const { createCatalog } = require('../.test-build/catalog/catalog.js')
// Khai báo { MOCK_PLACES }: require nạp module '../.test-build/data/mock.js' để dùng chức năng có sẵn thay vì chép lại.
const { MOCK_PLACES } = require('../.test-build/data/mock.js')
// Khai báo tick: khai báo callback () => new Promise(resolve => setImmediate(resolve)).
const tick = () => new Promise(resolve => setImmediate(resolve))
// TẠI SAO (tick): Kiểm tra hành vi tự động giúp phát hiện lỗi mà không phải thao tác lại toàn bộ
// giao diện.
// CHỨC NĂNG: Các test GPS dùng hệ tọa độ 0,0 riêng, không lẫn tọa độ Huế thật.
// Khai báo TEST_PLACES: MOCK_PLACES.map tạo mảng kết quả từ từng phần tử, dùng cho dữ liệu dẫn xuất hoặc danh sách thành phần. | Gán thuộc tính position: sử dụng undefined làm giá trị của bước hiện tại. Giữ vị trí theo ngữ cảnh: tọa độ địa điểm hoặc thời điểm audio.
const TEST_PLACES = MOCK_PLACES.map(place => ({ ...place, position: undefined }))

// Khai báo track(). Nhận đầu vào qua tham số.
function track() {
  // CHỨC NĂNG: Các callback nhận thay đổi; dùng Set để không đăng ký trùng cùng tham chiếu.
  // Khai báo listeners: Set giữ các phần tử duy nhất để tránh đăng ký hoặc đếm trùng.
  const listeners = new Set()
  // Khai báo t: tạo object gồm duration, position, playing, plays, disposed, play, pause, seek, rate. | Gán thuộc tính duration: giá trị số 30. | Gán thuộc tính position: giá trị số 0. | Gán thuộc tính playing: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính plays: giá trị số 0. | Gán thuộc tính disposed: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  const t = { duration: 30, position: 0, playing: false, plays: 0, disposed: false,
    // Khai báo play(). Nhận đầu vào qua tham số. | Thực hiện tính biểu thức this.playing = true. | Thực hiện sử dụng this.plays++ làm giá trị của bước hiện tại. | Thực hiện Gọi this.emit().
    async play() { this.playing = true; this.plays++; this.emit() },
    // TẠI SAO (play): Kiểm tra hành vi tự động giúp phát hiện lỗi mà không phải thao tác lại toàn bộ
    // giao diện.
    // CHỨC NĂNG: Tạm dừng nguồn hiện tại.
    // XỬ LÝ: Giữ track và thời điểm đang nghe; không tua về đầu hoặc mở lại URL.
    // Khai báo pause(). Nhận đầu vào qua tham số. | Thực hiện tính biểu thức this.playing = false. | Thực hiện Gọi this.emit().
    pause() { this.playing = false; this.emit() },
    // TẠI SAO (pause): Giữ track khi dừng giúp tiếp tục đúng thời điểm, đồng thời không phát sinh
    // thêm nguồn âm thanh.
    // CHỨC NĂNG: Tua đến thời điểm hợp lệ trong bản thu.
    // XỬ LÝ: Giới hạn theo thời lượng và giữ trạng thái tạm dừng nếu trước đó chưa phát.
    // TẠI SAO (seek): Thời điểm phải nằm trong bản thu; thao tác tua khi đang pause không được vô
    // tình bật phát.
    // Khai báo seek(value). Nhận đầu vào qua tham số. | Thực hiện tính biểu thức this.position = value. | Thực hiện Gọi this.emit(). | Khai báo rate(). Nhận đầu vào qua tham số.
    async seek(value) { this.position = value; this.emit() }, rate() {},
    // Khai báo listen(callback). Nhận đầu vào qua tham số. | Thực hiện listeners.add đăng ký một callback nhận thay đổi. | Trả kết quả: khai báo callback () => listeners.delete(callback).
    listen(callback) { listeners.add(callback); return () => listeners.delete(callback) },
    // TẠI SAO (listen): Kiểm tra hành vi tự động giúp phát hiện lỗi mà không phải thao tác lại toàn
    // bộ giao diện.
    // CHỨC NĂNG: Dọn controller khi nơi sở hữu kết thúc.
    // XỬ LÝ: Dừng nguồn/timer/listener liên quan để không còn xử lý chạy sau khi rời luồng.
    // Khai báo dispose(). Nhận đầu vào qua tham số. | Thực hiện tính biểu thức this.disposed = true. | Thực hiện tính biểu thức this.playing = false.
    dispose() { this.disposed = true; this.playing = false },
    // TẠI SAO (dispose): Timer, GPS và audio có vòng đời riêng; không dọn sẽ tiếp tục hoạt động khi
    // component sở hữu đã rời.
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `emit(ended = false, error = false) { listeners.forEach(l => l({ position: this.positi`: Khai báo emit(ended, error). Nhận đầu vào qua tham số. | Thực hiện Gọi listeners.forEach(l => l({ position: this.position, duration: 30, playing: this.playing, e. | Gán thuộc tính position: đọc this.position từ đối tượng/mảng để dùng tại bước hiện tại. Giữ vị trí theo ngữ cảnh: tọa độ địa điểm hoặc thời điểm audio. | Gán thuộc tính duration: giá trị số 30. | Gán thuộc tính playing: đọc this.playing từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Đặt trường ended bằng giá trị của biến cùng tên. | Đặt trường error bằng giá trị của biến cùng tên.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    emit(ended = false, error = false) { listeners.forEach(l => l({ position: this.position, duration: 30, playing: this.playing, ended, error })) },
    // TẠI SAO (emit): Dữ liệu hoặc adapter giả có kiểm soát giúp test đúng tình huống mà không cần
    // mạng, GPS hay loa thật.
  }
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return t`: Trả kết quả: sử dụng t làm giá trị của bước hiện tại.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return t
}
// TẠI SAO (track): Dữ liệu hoặc adapter giả có kiểm soát giúp test đúng tình huống mà không cần
// mạng, GPS hay loa thật.
// Khai báo fixture(extra). Nhận đầu vào qua tham số.
function fixture(extra = {}) {
  // CHỨC NĂNG: Hàng đợi lưu tiến độ; giữ đúng thứ tự các lần ghi bất đồng bộ.
  // Khai báo writes: tạo mảng [].
  const writes = [], tracks = []
  // Khai báo ports: tạo object gồm catalog, positions, routes, open, watch, read, write, ...giá trị ghép.
  const ports = {
    // Gán thuộc tính catalog: Gọi createCatalog(async () => TEST_PLACES).
    catalog: createCatalog(async () => TEST_PLACES),
    // Gán thuộc tính positions: tạo object gồm 'ngo-mon'. | Gán thuộc tính 'ngo-mon': tạo object gồm lat, lng, source, fieldVerified. | Gán thuộc tính lat: giá trị số 0. | Gán thuộc tính lng: giá trị số 0. | Gán thuộc tính source: chuỗi 'test'. | Gán thuộc tính fieldVerified: sử dụng true làm giá trị của bước hiện tại. Ghi trạng thái khảo sát thực địa của điểm bản đồ. | Gán thuộc tính routes: tạo mảng [].
    positions: { 'ngo-mon': { lat: 0, lng: 0, source: 'test', fieldVerified: true } }, routes: [],
    // Gán thuộc tính open: khai báo callback async () => { const t = track(). | Khai báo t: Gọi track(). | Thực hiện Gọi tracks.push(t). | Trả kết quả: sử dụng t làm giá trị của bước hiện tại.
    open: async () => { const t = track(); tracks.push(t); return t },
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `watch: async () => () => {}, read: async () => null, write: async value => { writes.p`: Gán thuộc tính watch: khai báo callback async () => () => {}. | Gán thuộc tính read: khai báo callback async () => null. | Gán thuộc tính write: khai báo callback async value => { writes.push(value) }. | Thực hiện Gọi writes.push(value).
     * DÒNG `...extra,`: Khai báo ports: tạo object gồm catalog, positions, routes, open, watch, read, write, ...giá trị ghép.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    watch: async () => () => {}, read: async () => null, write: async value => { writes.push(value) },
    ...extra,
  }
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return { engine: new JourneyController(ports), writes, tracks }`: Trả kết quả: tạo object gồm engine, writes, tracks. | Gán thuộc tính engine: Tạo đối tượng bằng new JourneyController(ports). | Đặt trường writes bằng giá trị của biến cùng tên. | Đặt trường tracks bằng giá trị của biến cùng tên.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return { engine: new JourneyController(ports), writes, tracks }
}
// TẠI SAO (fixture): Dữ liệu hoặc adapter giả có kiểm soát giúp test đúng tình huống mà không
// cần mạng, GPS hay loa thật.
// Khai báo fix: khai báo callback (lng = 0) => ({ lat: 0, lng, accuracy: 5, timestamp: Date.now() }). | Gán thuộc tính lat: giá trị số 0. | Đặt trường lng bằng giá trị của biến cùng tên. | Gán thuộc tính accuracy: giá trị số 5. | Gán thuộc tính timestamp: Date.now() lấy thời gian hiện tại theo mili giây để so sánh tuổi dữ liệu hoặc tạo dấu thời gian. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
const fix = (lng = 0) => ({ lat: 0, lng, accuracy: 5, timestamp: Date.now() })
// TẠI SAO (fix): Kiểm tra hành vi tự động giúp phát hiện lỗi mà không phải thao tác lại toàn bộ
// giao diện.

// Khẳng định kết quả thử nghiệm bằng test('UC06: chỉ chọn điểm trong 100m, dữ liệu GPS cũ/sai bị loại', () => { const { engine } = fixture(), places = [TEST_.
test('UC06: chỉ chọn điểm trong 100m, dữ liệu GPS cũ/sai bị loại', () => {
  // Khai báo { engine }: Gọi fixture().
  const { engine } = fixture(), places = [TEST_PLACES[1]], points = engine.ports.positions
  // Khẳng định kết quả thử nghiệm bằng assert.equal(nearest(places, points, fix()), 'ngo-mon').
  assert.equal(nearest(places, points, fix()), 'ngo-mon')
  // Khẳng định kết quả thử nghiệm bằng assert.equal(nearest(places, points, fix(0.00089)), 'ngo-mon').
  assert.equal(nearest(places, points, fix(0.00089)), 'ngo-mon')
  // Khẳng định kết quả thử nghiệm bằng assert.equal(nearest(places, points, fix(0.00091)), undefined).
  assert.equal(nearest(places, points, fix(0.00091)), undefined)
  // Khẳng định kết quả thử nghiệm bằng assert.equal(nearest(places, points, { ...fix(), accuracy: 100 }), undefined). | Gán thuộc tính accuracy: giá trị số 100.
  assert.equal(nearest(places, points, { ...fix(), accuracy: 100 }), undefined)
  // Khẳng định kết quả thử nghiệm bằng assert.equal(nearest(places, points, { ...fix(), timestamp: Date.now() - 31000 }), undefined). | Gán thuộc tính timestamp: tính biểu thức Date.now() - 31000.
  assert.equal(nearest(places, points, { ...fix(), timestamp: Date.now() - 31000 }), undefined)
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(nearest(places, points, { ...fix(), lat: NaN }), undefined)`: Khẳng định kết quả thử nghiệm bằng assert.equal(nearest(places, points, { ...fix(), lat: NaN }), undefined). | Gán thuộc tính lat: sử dụng NaN làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.equal(nearest(places, points, { ...fix(), lat: NaN }), undefined)
})
// Khẳng định kết quả thử nghiệm bằng test('UC06: khoảng cách bằng nhau giữ điểm trước', () => { const points = { 'ngo-mon': { lat: 0, lng: 0 }, 'ky-dai': { l.
test('UC06: khoảng cách bằng nhau giữ điểm trước', () => {
  // Khai báo points: tạo object gồm 'ngo-mon', 'ky-dai'. | Gán thuộc tính 'ngo-mon': tạo object gồm lat, lng. | Gán thuộc tính lat: giá trị số 0. | Gán thuộc tính lng: giá trị số 0. | Gán thuộc tính 'ky-dai': tạo object gồm lat, lng.
  const points = { 'ngo-mon': { lat: 0, lng: 0 }, 'ky-dai': { lat: 0, lng: 0 } }
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(nearest(TEST_PLACES, points, fix(), 'ngo-mon'), 'ngo-mon')`: Khẳng định kết quả thử nghiệm bằng assert.equal(nearest(TEST_PLACES, points, fix(), 'ngo-mon'), 'ngo-mon').
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.equal(nearest(TEST_PLACES, points, fix(), 'ngo-mon'), 'ngo-mon')
})
// Khẳng định kết quả thử nghiệm bằng test('UC06/07: đang nghe giữ bài và màn.
test('UC06/07: đang nghe giữ bài và màn; tạm dừng được gợi ý nhưng không tự phát', async () => {
  // Khai báo { engine, tracks }: Gọi fixture(). | Thực hiện await chờ Gọi engine.start().
  const { engine, tracks } = fixture(); await engine.start()
  // Thực hiện await chờ Gọi engine.play('ky-dai', 'vi'). | Thực hiện Gọi engine.acceptFix(fix()).
  await engine.play('ky-dai', 'vi'); engine.acceptFix(fix())
  // Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().suggestedId, undefined).
  assert.equal(engine.snapshot().suggestedId, undefined)
  // Khẳng định kết quả thử nghiệm bằng assert.equal(tracks[0].plays, 1).
  assert.equal(tracks[0].plays, 1)
  // Thực hiện engine.pause tạm dừng nguồn âm thanh hiện tại. | Thực hiện Gọi engine.acceptFix(fix()).
  engine.pause(); engine.acceptFix(fix())
  // Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().suggestedId, 'ngo-mon').
  assert.equal(engine.snapshot().suggestedId, 'ngo-mon')
  // Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().session.placeId, 'ky-dai').
  assert.equal(engine.snapshot().session.placeId, 'ky-dai')
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(tracks[0].plays, 1); engine.dispose()`: Khẳng định kết quả thử nghiệm bằng assert.equal(tracks[0].plays, 1). | Thực hiện engine.dispose giải phóng nguồn/tài nguyên theo hợp đồng adapter để phiên cũ không tiếp tục chạy.
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.equal(tracks[0].plays, 1); engine.dispose()
})
// Khẳng định kết quả thử nghiệm bằng test('UC07: pause/seek giữ paused, tua clamp theo thời lượng thật', async () => { const { engine, tracks } = fixture().
test('UC07: pause/seek giữ paused, tua clamp theo thời lượng thật', async () => {
  // Khai báo { engine, tracks }: Gọi fixture(). | Thực hiện await chờ Gọi engine.start(). | Thực hiện await chờ Gọi engine.play('ngo-mon', 'vi').
  const { engine, tracks } = fixture(); await engine.start(); await engine.play('ngo-mon', 'vi')
  // Thực hiện tính biểu thức tracks[0].position = 8. | Thực hiện Gọi tracks[0].emit(). | Thực hiện engine.pause tạm dừng nguồn âm thanh hiện tại.
  tracks[0].position = 8; tracks[0].emit(); engine.pause()
  // Thực hiện await chờ engine.seek yêu cầu chuyển thời điểm phát. | Khẳng định kết quả thử nghiệm bằng assert.equal(tracks[0].position, 30).
  await engine.seek(999); assert.equal(tracks[0].position, 30)
  // Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().status, 'paused').
  assert.equal(engine.snapshot().status, 'paused')
  // Thực hiện await chờ engine.seek yêu cầu chuyển thời điểm phát. | Khẳng định kết quả thử nghiệm bằng assert.equal(tracks[0].position, 0).
  await engine.seek(-10); assert.equal(tracks[0].position, 0)
  // Thực hiện await chờ Gọi engine.resume(). | Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().status, 'playing').
  await engine.resume(); assert.equal(engine.snapshot().status, 'playing')
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `engine.dispose()`: Thực hiện engine.dispose giải phóng nguồn/tài nguyên theo hợp đồng adapter để phiên cũ không tiếp tục chạy.
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  engine.dispose()
})
// Khẳng định kết quả thử nghiệm bằng test('UC07: chỉ một bài phát và nguồn cũ được giải phóng', async () => { const { engine, tracks } = fixture().
test('UC07: chỉ một bài phát và nguồn cũ được giải phóng', async () => {
  // Khai báo { engine, tracks }: Gọi fixture(). | Thực hiện await chờ Gọi engine.start().
  const { engine, tracks } = fixture(); await engine.start()
  // Thực hiện await chờ Gọi engine.play('ngo-mon', 'vi'). | Thực hiện await chờ Gọi engine.play('ky-dai', 'vi').
  await engine.play('ngo-mon', 'vi'); await engine.play('ky-dai', 'vi')
  // Khẳng định kết quả thử nghiệm bằng assert.equal(tracks[0].disposed, true). | Khẳng định kết quả thử nghiệm bằng assert.equal(tracks[0].playing, false).
  assert.equal(tracks[0].disposed, true); assert.equal(tracks[0].playing, false)
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(tracks[1].playing, true); engine.dispose()`: Khẳng định kết quả thử nghiệm bằng assert.equal(tracks[1].playing, true). | Thực hiện engine.dispose giải phóng nguồn/tài nguyên theo hợp đồng adapter để phiên cũ không tiếp tục chạy.
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.equal(tracks[1].playing, true); engine.dispose()
})
// Khẳng định kết quả thử nghiệm bằng test('UC07.3: lỗi tốc độ giữ tốc độ đang có hiệu lực', async () => { const { engine, tracks } = fixture().
test('UC07.3: lỗi tốc độ giữ tốc độ đang có hiệu lực', async () => {
  // Khai báo { engine, tracks }: Gọi fixture(). | Thực hiện await chờ Gọi engine.start(). | Thực hiện await chờ Gọi engine.play('ngo-mon', 'vi').
  const { engine, tracks } = fixture(); await engine.start(); await engine.play('ngo-mon', 'vi')
  // Thực hiện tính biểu thức tracks[0].rate = () => { throw Error('unsupported') }. | Ném Error('unsupported'). | Thực hiện Gọi engine.rate(1.5).
  tracks[0].rate = () => { throw Error('unsupported') }; engine.rate(1.5)
  // Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().session.rate, 1).
  assert.equal(engine.snapshot().session.rate, 1)
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(engine.snapshot().error, 'audioFailed'); engine.dispose()`: Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().error, 'audioFailed'). | Thực hiện engine.dispose giải phóng nguồn/tài nguyên theo hợp đồng adapter để phiên cũ không tiếp tục chạy.
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.equal(engine.snapshot().error, 'audioFailed'); engine.dispose()
})
// Khẳng định kết quả thử nghiệm bằng test('UC08: đổi ngôn ngữ đang nghe phát bản mới từ 0.
test('UC08: đổi ngôn ngữ đang nghe phát bản mới từ 0; paused vẫn paused', async () => {
  // Khai báo { engine, tracks }: Gọi fixture(). | Thực hiện await chờ Gọi engine.start(). | Thực hiện await chờ Gọi engine.play('ngo-mon', 'vi').
  const { engine, tracks } = fixture(); await engine.start(); await engine.play('ngo-mon', 'vi')
  // Thực hiện tính biểu thức tracks[0].position = 12. | Thực hiện Gọi tracks[0].emit(). | Thực hiện Gọi engine.changeLanguage('cn'). | Thực hiện await chờ Gọi tick().
  tracks[0].position = 12; tracks[0].emit(); engine.changeLanguage('cn'); await tick()
  // Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().session.language, 'cn').
  assert.equal(engine.snapshot().session.language, 'cn')
  // Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().session.position, 0). | Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().status, 'playing').
  assert.equal(engine.snapshot().session.position, 0); assert.equal(engine.snapshot().status, 'playing')
  // Thực hiện engine.pause tạm dừng nguồn âm thanh hiện tại. | Thực hiện Gọi engine.changeLanguage('pt'). | Thực hiện await chờ Gọi tick().
  engine.pause(); engine.changeLanguage('pt'); await tick()
  // Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().session.language, 'pt').
  assert.equal(engine.snapshot().session.language, 'pt')
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(engine.snapshot().status, 'paused'); engine.dispose()`: Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().status, 'paused'). | Thực hiện engine.dispose giải phóng nguồn/tài nguyên theo hợp đồng adapter để phiên cũ không tiếp tục chạy.
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.equal(engine.snapshot().status, 'paused'); engine.dispose()
})
// Khẳng định kết quả thử nghiệm bằng test('UC07/08: phản hồi nguồn cũ đến muộn không phát đè bản mới', async () => { let release const late = track(), recent.
test('UC07/08: phản hồi nguồn cũ đến muộn không phát đè bản mới', async () => {
  // Khai báo release: không có giá trị khởi tạo.
  let release
  // Khai báo late: Gọi track().
  const late = track(), recent = track()
  // Khai báo { engine }: Gọi fixture({ open: url => url === MOCK_PLACES[1].content.vi.audio.url ? new Promise(resolve =. | Gán thuộc tính open: khai báo callback url => url === MOCK_PLACES[1].content.vi.audio.url ? new Promise(resolve =>. | Thực hiện tính biểu thức release = resolve.
  const { engine } = fixture({ open: url => url === MOCK_PLACES[1].content.vi.audio.url ? new Promise(resolve => { release = resolve }) : Promise.resolve(recent) })
  // Thực hiện await chờ Gọi engine.start(). | Khai báo first: Gọi engine.play('ngo-mon', 'vi'). | Thực hiện await chờ Gọi tick().
  await engine.start(); const first = engine.play('ngo-mon', 'vi'); await tick()
  // Thực hiện await chờ Gọi engine.play('ngo-mon', 'en'). | Thực hiện Gọi release(late). | Thực hiện await chờ sử dụng first làm giá trị của bước hiện tại.
  await engine.play('ngo-mon', 'en'); release(late); await first
  // Khẳng định kết quả thử nghiệm bằng assert.equal(late.plays, 0). | Khẳng định kết quả thử nghiệm bằng assert.equal(late.disposed, true).
  assert.equal(late.plays, 0); assert.equal(late.disposed, true)
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(recent.plays, 1); assert.equal(engine.snapshot().session.language, 'en')`: Khẳng định kết quả thử nghiệm bằng assert.equal(recent.plays, 1). | Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().session.language, 'en'). | Thực hiện engine.dispose giải phóng nguồn/tài nguyên theo hợp đồng adapter để phiên cũ không tiếp tục chạy.
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.equal(recent.plays, 1); assert.equal(engine.snapshot().session.language, 'en'); engine.dispose()
})
// Khẳng định kết quả thử nghiệm bằng test('UC07: thiếu audio đã công bố không tự dùng bản nháp', async () => { const place = JSON.parse(JSON.stringify(MOCK_P.
test('UC07: thiếu audio đã công bố không tự dùng bản nháp', async () => {
  // Khai báo place: JSON.parse chuyển chuỗi sang dữ liệu. | Thực hiện tính biểu thức place.content.vi.audio.status = 'draft'.
  const place = JSON.parse(JSON.stringify(MOCK_PLACES[1])); place.content.vi.audio.status = 'draft'
  // Khai báo { engine, tracks }: Gọi fixture({ catalog: createCatalog(async () => [place]) }). | Gán thuộc tính catalog: Gọi createCatalog(async () => [place]).
  const { engine, tracks } = fixture({ catalog: createCatalog(async () => [place]) })
  // Thực hiện await chờ Gọi engine.start(). | Thực hiện await chờ Gọi engine.play(place.id, 'vi').
  await engine.start(); await engine.play(place.id, 'vi')
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(engine.snapshot().error, 'audioMissing'); assert.equal(tracks.length, 0)`: Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().error, 'audioMissing'). | Khẳng định kết quả thử nghiệm bằng assert.equal(tracks.length, 0). | Thực hiện engine.dispose giải phóng nguồn/tài nguyên theo hợp đồng adapter để phiên cũ không tiếp tục chạy.
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.equal(engine.snapshot().error, 'audioMissing'); assert.equal(tracks.length, 0); engine.dispose()
})
// Khẳng định kết quả thử nghiệm bằng test('UC07: kết thúc không phát bài kế tiếp', async () => { const { engine, tracks } = fixture().
test('UC07: kết thúc không phát bài kế tiếp', async () => {
  // Khai báo { engine, tracks }: Gọi fixture(). | Thực hiện await chờ Gọi engine.start(). | Thực hiện await chờ Gọi engine.play('ngo-mon', 'vi').
  const { engine, tracks } = fixture(); await engine.start(); await engine.play('ngo-mon', 'vi')
  // Thực hiện tính biểu thức tracks[0].position = 30. | Thực hiện tính biểu thức tracks[0].playing = false. | Thực hiện Gọi tracks[0].emit(true).
  tracks[0].position = 30; tracks[0].playing = false; tracks[0].emit(true)
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(engine.snapshot().status, 'ended'); assert.equal(tracks.length, 1); engi`: Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().status, 'ended'). | Khẳng định kết quả thử nghiệm bằng assert.equal(tracks.length, 1). | Thực hiện engine.dispose giải phóng nguồn/tài nguyên theo hợp đồng adapter để phiên cũ không tiếp tục chạy.
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.equal(engine.snapshot().status, 'ended'); assert.equal(tracks.length, 1); engine.dispose()
})
// Khẳng định kết quả thử nghiệm bằng test('UC10: tuyến có điểm bị rút không được sử dụng', () => { const route = { available: true, stops: ['ngo-mon', 'gone'.
test('UC10: tuyến có điểm bị rút không được sử dụng', () => {
  // Khai báo route: tạo object gồm available, stops. | Gán thuộc tính available: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính stops: tạo mảng ['ngo-mon', 'gone'].
  const route = { available: true, stops: ['ngo-mon', 'gone'] }
  // Khẳng định kết quả thử nghiệm bằng assert.equal(routeAvailable(route, MOCK_PLACES), false).
  assert.equal(routeAvailable(route, MOCK_PLACES), false)
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(routeAvailable({ ...route, stops: ['ngo-mon'] }, MOCK_PLACES), true)`: Khẳng định kết quả thử nghiệm bằng assert.equal(routeAvailable({ ...route, stops: ['ngo-mon'] }, MOCK_PLACES), true). | Gán thuộc tính stops: tạo mảng ['ngo-mon'].
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.equal(routeAvailable({ ...route, stops: ['ngo-mon'] }, MOCK_PLACES), true)
})
// Khẳng định kết quả thử nghiệm bằng test('UC11: bản lưu hỏng bị loại.
test('UC11: bản lưu hỏng bị loại; tiến độ vượt thời lượng được clamp', () => {
  // Khẳng định kết quả thử nghiệm bằng assert.equal(parseSaved('{bad'), undefined).
  assert.equal(parseSaved('{bad'), undefined)
  // Khẳng định kết quả thử nghiệm bằng assert.equal(parseSaved(JSON.stringify({ placeId: 'ngo-mon', language: 'xx' })), undefined). | Gán thuộc tính placeId: chuỗi 'ngo-mon'. | Gán thuộc tính language: chuỗi 'xx'.
  assert.equal(parseSaved(JSON.stringify({ placeId: 'ngo-mon', language: 'xx' })), undefined)
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(clampTime(-10, 30), 0); assert.equal(clampTime(NaN, 30), 0)`: Khẳng định kết quả thử nghiệm bằng assert.equal(clampTime(-10, 30), 0). | Khẳng định kết quả thử nghiệm bằng assert.equal(clampTime(NaN, 30), 0).
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.equal(clampTime(-10, 30), 0); assert.equal(clampTime(NaN, 30), 0)
})
// Khẳng định kết quả thử nghiệm bằng test('UC11: mở lại chỉ đề nghị, đúng phiên bản mới tiếp tục tại thời điểm cũ', async () => { const saved = { placeId: 'n.
test('UC11: mở lại chỉ đề nghị, đúng phiên bản mới tiếp tục tại thời điểm cũ', async () => {
  // Khai báo saved: tạo object gồm placeId, language, textVersion, audioId, audioVersion, position, duration, rate. | Gán thuộc tính placeId: chuỗi 'ngo-mon'. | Gán thuộc tính language: chuỗi 'vi'. | Gán thuộc tính textVersion: đọc MOCK_PLACES[1].content.vi.version từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính audioId: đọc MOCK_PLACES[1].content.vi.audio.id từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính audioVersion: đọc MOCK_PLACES[1].content.vi.audio.version từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính position: giá trị số 9. | Gán thuộc tính duration: giá trị số 30. | Gán thuộc tính rate: giá trị số 1.25.
  const saved = { placeId: 'ngo-mon', language: 'vi', textVersion: MOCK_PLACES[1].content.vi.version, audioId: MOCK_PLACES[1].content.vi.audio.id, audioVersion: MOCK_PLACES[1].content.vi.audio.version, position: 9, duration: 30, rate: 1.25 }
  // Khai báo { engine, tracks }: Gọi fixture({ read: async () => JSON.stringify(saved) }). | Gán thuộc tính read: khai báo callback async () => JSON.stringify(saved).
  const { engine, tracks } = fixture({ read: async () => JSON.stringify(saved) })
  // Thực hiện await chờ Gọi engine.start(). | Khẳng định kết quả thử nghiệm bằng assert.equal(tracks.length, 0). | Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().changed, false).
  await engine.start(); assert.equal(tracks.length, 0); assert.equal(engine.snapshot().changed, false)
  // Thực hiện await chờ Gọi engine.restorePlay(). | Khẳng định kết quả thử nghiệm bằng assert.equal(tracks[0].position, 9). | Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().session.rate, 1.25).
  await engine.restorePlay(); assert.equal(tracks[0].position, 9); assert.equal(engine.snapshot().session.rate, 1.25)
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `engine.dispose()`: Thực hiện engine.dispose giải phóng nguồn/tài nguyên theo hợp đồng adapter để phiên cũ không tiếp tục chạy.
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  engine.dispose()
})
// Khẳng định kết quả thử nghiệm bằng test('UC11: phiên bản thay đổi thì đề nghị nghe mới từ đầu', async () => { const saved = { placeId: 'ngo-mon', language:.
test('UC11: phiên bản thay đổi thì đề nghị nghe mới từ đầu', async () => {
  // Khai báo saved: tạo object gồm placeId, language, textVersion, audioId, audioVersion, position, duration, rate. | Gán thuộc tính placeId: chuỗi 'ngo-mon'. | Gán thuộc tính language: chuỗi 'vi'. | Gán thuộc tính textVersion: giá trị số 99. | Gán thuộc tính audioId: chuỗi 'old'. | Gán thuộc tính audioVersion: giá trị số 1. | Gán thuộc tính position: giá trị số 9. | Gán thuộc tính duration: giá trị số 30. | Gán thuộc tính rate: giá trị số 1.
  const saved = { placeId: 'ngo-mon', language: 'vi', textVersion: 99, audioId: 'old', audioVersion: 1, position: 9, duration: 30, rate: 1 }
  // Khai báo { engine, tracks }: Gọi fixture({ read: async () => JSON.stringify(saved) }). | Gán thuộc tính read: khai báo callback async () => JSON.stringify(saved).
  const { engine, tracks } = fixture({ read: async () => JSON.stringify(saved) })
  // Thực hiện await chờ Gọi engine.start(). | Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().changed, true). | Khẳng định kết quả thử nghiệm bằng assert.equal(tracks.length, 0).
  await engine.start(); assert.equal(engine.snapshot().changed, true); assert.equal(tracks.length, 0)
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `await engine.restorePlay(); assert.equal(tracks[0].position, 0); engine.dispose()`: Thực hiện await chờ Gọi engine.restorePlay(). | Khẳng định kết quả thử nghiệm bằng assert.equal(tracks[0].position, 0). | Thực hiện engine.dispose giải phóng nguồn/tài nguyên theo hợp đồng adapter để phiên cũ không tiếp tục chạy.
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  await engine.restorePlay(); assert.equal(tracks[0].position, 0); engine.dispose()
})
// Khẳng định kết quả thử nghiệm bằng test('UC11: lỗi ghi không dừng âm thanh', async () => { const { engine, tracks } = fixture({ write: async () => { throw.
test('UC11: lỗi ghi không dừng âm thanh', async () => {
  // Khai báo { engine, tracks }: Gọi fixture({ write: async () => { throw Error('full') } }). | Gán thuộc tính write: khai báo callback async () => { throw Error('full') }. | Ném Error('full').
  const { engine, tracks } = fixture({ write: async () => { throw Error('full') } })
  // Thực hiện await chờ Gọi engine.start(). | Thực hiện await chờ Gọi engine.play('ngo-mon', 'vi'). | Thực hiện await chờ Gọi tick().
  await engine.start(); await engine.play('ngo-mon', 'vi'); await tick()
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(engine.snapshot().error, 'saveFailed'); assert.equal(tracks[0].playing, `: Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().error, 'saveFailed'). | Khẳng định kết quả thử nghiệm bằng assert.equal(tracks[0].playing, true). | Thực hiện engine.dispose giải phóng nguồn/tài nguyên theo hợp đồng adapter để phiên cũ không tiếp tục chạy.
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.equal(engine.snapshot().error, 'saveFailed'); assert.equal(tracks[0].playing, true); engine.dispose()
})

// CHỨC NĂNG: Lỗi bộ nhớ không được làm mất danh sách UC06/UC09.
// Khẳng định kết quả thử nghiệm bằng test('UC11: lỗi đọc bộ nhớ vẫn hiển thị địa điểm', async () => { const { engine } = fixture({ read: async () => { throw.
test('UC11: lỗi đọc bộ nhớ vẫn hiển thị địa điểm', async () => {
  // Khai báo { engine }: Gọi fixture({ read: async () => { throw Error('blocked') } }). | Gán thuộc tính read: khai báo callback async () => { throw Error('blocked') }. | Ném Error('blocked').
  const { engine } = fixture({ read: async () => { throw Error('blocked') } })
  // Thực hiện await chờ Gọi engine.start(). | Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().places.length, 8).
  await engine.start(); assert.equal(engine.snapshot().places.length, 8)
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(engine.snapshot().error, 'saveFailed'); engine.dispose()`: Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().error, 'saveFailed'). | Thực hiện engine.dispose giải phóng nguồn/tài nguyên theo hợp đồng adapter để phiên cũ không tiếp tục chạy.
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.equal(engine.snapshot().error, 'saveFailed'); engine.dispose()
})
// CHỨC NĂNG: Đã nghe hết thì không đề nghị tiếp tục khi khởi động lại.
// Khẳng định kết quả thử nghiệm bằng test('UC11: dispose không ghi lại bài đã kết thúc', async () => { const { engine, tracks, writes } = fixture().
test('UC11: dispose không ghi lại bài đã kết thúc', async () => {
  // Khai báo { engine, tracks, writes }: Gọi fixture(). | Thực hiện await chờ Gọi engine.start(). | Thực hiện await chờ Gọi engine.play('ngo-mon', 'vi').
  const { engine, tracks, writes } = fixture(); await engine.start(); await engine.play('ngo-mon', 'vi')
  // Thực hiện tính biểu thức tracks[0].position = 30. | Thực hiện tính biểu thức tracks[0].playing = false. | Thực hiện Gọi tracks[0].emit(true).
  tracks[0].position = 30; tracks[0].playing = false; tracks[0].emit(true)
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `engine.dispose(); await tick(); assert.equal(writes.at(-1), null)`: Thực hiện engine.dispose giải phóng nguồn/tài nguyên theo hợp đồng adapter để phiên cũ không tiếp tục chạy. | Thực hiện await chờ Gọi tick(). | Khẳng định kết quả thử nghiệm bằng assert.equal(writes.at(-1), null).
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  engine.dispose(); await tick(); assert.equal(writes.at(-1), null)
})
// CHỨC NĂNG: Lỗi audio sau metadata phải được UI nhận và giải phóng nguồn.
// Khẳng định kết quả thử nghiệm bằng test('UC07: lỗi nguồn đang phát được truyền tới UI', async () => { const { engine, tracks } = fixture().
test('UC07: lỗi nguồn đang phát được truyền tới UI', async () => {
  // Khai báo { engine, tracks }: Gọi fixture(). | Thực hiện await chờ Gọi engine.start(). | Thực hiện await chờ Gọi engine.play('ngo-mon', 'vi').
  const { engine, tracks } = fixture(); await engine.start(); await engine.play('ngo-mon', 'vi')
  // Thực hiện Gọi tracks[0].emit(false, true).
  tracks[0].emit(false, true)
  // Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().status, 'error').
  assert.equal(engine.snapshot().status, 'error')
  // Khẳng định kết quả thử nghiệm bằng assert.equal(tracks[0].disposed, true).
  assert.equal(tracks[0].disposed, true)
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `engine.dispose()`: Thực hiện engine.dispose giải phóng nguồn/tài nguyên theo hợp đồng adapter để phiên cũ không tiếp tục chạy.
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  engine.dispose()
})

// CHỨC NĂNG: Pause trước khi Promise play hoàn tất không được bị báo audioFailed.
// XỬ LÝ: Mô phỏng AbortError thật của HTML Audio để giữ nguồn và thời điểm paused.
// Duyệt lần lượt [true, false] bằng const initial.
for (const initial of [true, false]) {
  // Khẳng định kết quả thử nghiệm bằng test('UC07: pause trong lúc ' + (initial ? 'play' : 'resume') + ' còn chờ không làm hỏng phiên', async () => { const t =.
  test('UC07: pause trong lúc ' + (initial ? 'play' : 'resume') + ' còn chờ không làm hỏng phiên', async () => {
    // Khai báo t: Gọi track().
    const t = track()
    // Khai báo { engine }: Gọi fixture({ open: async () => t }). | Gán thuộc tính open: khai báo callback async () => t.
    const { engine } = fixture({ open: async () => t })
    // Thực hiện await chờ Gọi engine.start().
    await engine.start()
    // Rẽ nhánh nếu !initial. | Thực hiện await chờ Gọi engine.play('ngo-mon', 'vi', 0, false).
    if (!initial) await engine.play('ngo-mon', 'vi', 0, false)
    // Khai báo rejectPlay: không có giá trị khởi tạo.
    let rejectPlay
    // Thực hiện tính biểu thức t.play = async () => { t.playing = true.
    t.play = async () => {
      // Thực hiện tính biểu thức t.playing = true. | Thực hiện Gọi t.emit().
      t.playing = true; t.emit()
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `await new Promise((_resolve, reject) => { rejectPlay = reject })`: Thực hiện await chờ Tạo đối tượng bằng new Promise((_resolve, reject) => { rejectPlay = reject }). | Thực hiện tính biểu thức rejectPlay = reject.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      await new Promise((_resolve, reject) => { rejectPlay = reject })
    }
    // Khai báo waiting: chọn giữa hai giá trị theo điều kiện initial.
    const waiting = initial ? engine.play('ngo-mon', 'vi') : engine.resume()
    // Thực hiện await chờ Gọi tick(). | Thực hiện engine.pause tạm dừng nguồn âm thanh hiện tại.
    await tick(); engine.pause()
    // Khai báo error: Tạo đối tượng bằng new Error('play interrupted by pause'). | Thực hiện tính biểu thức error.name = 'AbortError'.
    const error = new Error('play interrupted by pause'); error.name = 'AbortError'
    // Thực hiện Gọi rejectPlay(error). | Thực hiện await chờ sử dụng waiting làm giá trị của bước hiện tại.
    rejectPlay(error); await waiting
    // Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().status, 'paused').
    assert.equal(engine.snapshot().status, 'paused')
    // Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().error, undefined).
    assert.equal(engine.snapshot().error, undefined)
    // Khẳng định kết quả thử nghiệm bằng assert.equal(t.disposed, false).
    assert.equal(t.disposed, false)
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `engine.dispose()`: Thực hiện engine.dispose giải phóng nguồn/tài nguyên theo hợp đồng adapter để phiên cũ không tiếp tục chạy.
     * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    engine.dispose()
  })
}

// CHỨC NĂNG: × dừng nguồn thật, xóa checkpoint và không tự mở lại khi đổi ngôn ngữ.
// Khẳng định kết quả thử nghiệm bằng test('UC07: close dừng/giải phóng nguồn, xóa phiên và checkpoint', async () => { const { engine, tracks, writes } = fixt.
test('UC07: close dừng/giải phóng nguồn, xóa phiên và checkpoint', async () => {
  // Khai báo { engine, tracks, writes }: Gọi fixture().
  const { engine, tracks, writes } = fixture()
  // Thực hiện await chờ Gọi engine.start(). | Thực hiện await chờ Gọi engine.play('ngo-mon', 'vi').
  await engine.start(); await engine.play('ngo-mon', 'vi')
  // Thực hiện Gọi engine.close(). | Thực hiện Gọi engine.changeLanguage('en'). | Thực hiện Gọi engine.retry(). | Thực hiện Gọi engine.checkpoint(). | Thực hiện await chờ Gọi tick().
  engine.close(); engine.changeLanguage('en'); engine.retry(); engine.checkpoint(); await tick()
  // Khẳng định kết quả thử nghiệm bằng assert.equal(tracks[0].playing, false). | Khẳng định kết quả thử nghiệm bằng assert.equal(tracks[0].disposed, true).
  assert.equal(tracks[0].playing, false); assert.equal(tracks[0].disposed, true)
  // Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().status, 'idle'). | Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().session, undefined).
  assert.equal(engine.snapshot().status, 'idle'); assert.equal(engine.snapshot().session, undefined)
  // Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().restore, undefined). | Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().error, undefined).
  assert.equal(engine.snapshot().restore, undefined); assert.equal(engine.snapshot().error, undefined)
  // Khẳng định kết quả thử nghiệm bằng assert.equal(tracks.length, 1). | Khẳng định kết quả thử nghiệm bằng assert.equal(writes.at(-1), null).
  assert.equal(tracks.length, 1); assert.equal(writes.at(-1), null)
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `engine.dispose()`: Thực hiện engine.dispose giải phóng nguồn/tài nguyên theo hợp đồng adapter để phiên cũ không tiếp tục chạy.
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  engine.dispose()
})
// CHỨC NĂNG: Đóng trong lúc tải không được phát lại khi request cũ trả về.
// Khẳng định kết quả thử nghiệm bằng test('UC07: close khi tải chậm loại nguồn đến muộn', async () => { let release const late = track() const { engine } = f.
test('UC07: close khi tải chậm loại nguồn đến muộn', async () => {
  // Khai báo release: không có giá trị khởi tạo.
  let release
  // Khai báo late: Gọi track().
  const late = track()
  // Khai báo { engine }: Gọi fixture({ open: () => new Promise(resolve => { release = resolve }) }). | Gán thuộc tính open: khai báo callback () => new Promise(resolve => { release = resolve }). | Thực hiện tính biểu thức release = resolve.
  const { engine } = fixture({ open: () => new Promise(resolve => { release = resolve }) })
  // Thực hiện await chờ Gọi engine.start(). | Khai báo loading: Gọi engine.play('ngo-mon', 'vi'). | Thực hiện await chờ Gọi tick().
  await engine.start(); const loading = engine.play('ngo-mon', 'vi'); await tick()
  // Thực hiện Gọi engine.close(). | Thực hiện Gọi release(late). | Thực hiện await chờ sử dụng loading làm giá trị của bước hiện tại.
  engine.close(); release(late); await loading
  // Khẳng định kết quả thử nghiệm bằng assert.equal(late.plays, 0). | Khẳng định kết quả thử nghiệm bằng assert.equal(late.disposed, true).
  assert.equal(late.plays, 0); assert.equal(late.disposed, true)
  // Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().status, 'idle'). | Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().session, undefined).
  assert.equal(engine.snapshot().status, 'idle'); assert.equal(engine.snapshot().session, undefined)
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `engine.dispose()`: Thực hiện engine.dispose giải phóng nguồn/tài nguyên theo hợp đồng adapter để phiên cũ không tiếp tục chạy.
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  engine.dispose()
})
// CHỨC NĂNG: Bộ nhớ bị chặn không mở lại thanh nghe vừa đóng.
// Khẳng định kết quả thử nghiệm bằng test('UC07/11: lỗi ghi đến muộn sau close không mở lại player', async () => { const { engine } = fixture({ write: async.
test('UC07/11: lỗi ghi đến muộn sau close không mở lại player', async () => {
  // Khai báo { engine }: Gọi fixture({ write: async () => { throw Error('blocked') } }). | Gán thuộc tính write: khai báo callback async () => { throw Error('blocked') }. | Ném Error('blocked').
  const { engine } = fixture({ write: async () => { throw Error('blocked') } })
  // Thực hiện await chờ Gọi engine.start(). | Thực hiện await chờ Gọi engine.play('ngo-mon', 'vi'). | Thực hiện Gọi engine.close(). | Thực hiện await chờ Gọi tick().
  await engine.start(); await engine.play('ngo-mon', 'vi'); engine.close(); await tick()
  // Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().session, undefined). | Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().error, undefined).
  assert.equal(engine.snapshot().session, undefined); assert.equal(engine.snapshot().error, undefined)
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(engine.snapshot().status, 'idle'); engine.dispose()`: Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().status, 'idle'). | Thực hiện engine.dispose giải phóng nguồn/tài nguyên theo hợp đồng adapter để phiên cũ không tiếp tục chạy.
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.equal(engine.snapshot().status, 'idle'); engine.dispose()
})

// CHỨC NĂNG: Tọa độ được Admin công bố phải được ưu tiên hơn marker cũ.
// Khẳng định kết quả thử nghiệm bằng test('UC06: gợi ý GPS dùng position mới công bố',()=>{ const place={...MOCK_PLACES[1],position:{lat:0,lng:0,verified:tru.
test('UC06: gợi ý GPS dùng position mới công bố',()=>{
 // Khai báo place: tạo object gồm ...giá trị ghép, position. | Gán thuộc tính position: tạo object gồm lat, lng, verified. | Gán thuộc tính lat: giá trị số 0. | Gán thuộc tính lng: giá trị số 0. | Gán thuộc tính verified: sử dụng true làm giá trị của bước hiện tại. Tách tọa độ tham khảo với tọa độ đã xác nhận.
 const place={...MOCK_PLACES[1],position:{lat:0,lng:0,verified:true}}
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `assert.equal(nearest([place],{'ngo-mon':{lat:16.4676824,lng:107.5791834}},fix()),'ngo`: Khẳng định kết quả thử nghiệm bằng assert.equal(nearest([place],{'ngo-mon':{lat:16.4676824,lng:107.5791834}},fix()),'ngo-mon'). | Gán thuộc tính 'ngo-mon': tạo object gồm lat, lng. | Gán thuộc tính lat: giá trị số 16.4676824. | Gán thuộc tính lng: giá trị số 107.5791834.
  * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 assert.equal(nearest([place],{'ngo-mon':{lat:16.4676824,lng:107.5791834}},fix()),'ngo-mon')
})


// CHỨC NĂNG: Hồi quy lỗi player vẫn đỏ sau khi API đã kết nối lại.
// Khẳng định kết quả thử nghiệm bằng test('UC02/07: API phục hồi gỡ loadError, không tự phát audio', async () => { let offline=true const {engine,tracks}=fix.
test('UC02/07: API phục hồi gỡ loadError, không tự phát audio', async () => {
 // Khai báo offline: sử dụng true làm giá trị của bước hiện tại.
 let offline=true
 // Khai báo {engine,tracks}: Gọi fixture({catalog:createCatalog(async()=>{if(offline)throw Error('offline'). | Gán thuộc tính catalog: Gọi createCatalog(async()=>{if(offline)throw Error('offline'). | Rẽ nhánh nếu offline. | Ném Error('offline'). | Trả kết quả: sử dụng TEST_PLACES làm giá trị của bước hiện tại.
 const {engine,tracks}=fixture({catalog:createCatalog(async()=>{if(offline)throw Error('offline');return TEST_PLACES})})
 // Thực hiện await chờ Gọi engine.start(). | Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().error,'loadError').
 await engine.start();assert.equal(engine.snapshot().error,'loadError')
 // Thực hiện tính biểu thức offline=false. | Thực hiện await chờ Gọi engine.refreshCatalog().
 offline=false;await engine.refreshCatalog()
 // Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().error,undefined).
 assert.equal(engine.snapshot().error,undefined)
 // Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().places.length,TEST_PLACES.length).
 assert.equal(engine.snapshot().places.length,TEST_PLACES.length)
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `assert.equal(tracks.length,0);engine.dispose()`: Khẳng định kết quả thử nghiệm bằng assert.equal(tracks.length,0). | Thực hiện engine.dispose giải phóng nguồn/tài nguyên theo hợp đồng adapter để phiên cũ không tiếp tục chạy.
  * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 assert.equal(tracks.length,0);engine.dispose()
})
// Khẳng định kết quả thử nghiệm bằng test('UC07: refresh danh mục không xóa lỗi audio thật', async () => { const {engine}=fixture({open:async()=>{throw Error.
test('UC07: refresh danh mục không xóa lỗi audio thật', async () => {
 // Khai báo {engine}: Gọi fixture({open:async()=>{throw Error('audio offline')}}). | Gán thuộc tính open: khai báo callback async()=>{throw Error('audio offline')}. | Ném Error('audio offline').
 const {engine}=fixture({open:async()=>{throw Error('audio offline')}})
 // Thực hiện await chờ Gọi engine.start(). | Thực hiện await chờ Gọi engine.play('ngo-mon','vi').
 await engine.start();await engine.play('ngo-mon','vi')
 // Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().error,'audioFailed').
 assert.equal(engine.snapshot().error,'audioFailed')
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `await engine.refreshCatalog();assert.equal(engine.snapshot().error,'audioFailed');eng`: Thực hiện await chờ Gọi engine.refreshCatalog(). | Khẳng định kết quả thử nghiệm bằng assert.equal(engine.snapshot().error,'audioFailed'). | Thực hiện engine.dispose giải phóng nguồn/tài nguyên theo hợp đồng adapter để phiên cũ không tiếp tục chạy.
  * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 await engine.refreshCatalog();assert.equal(engine.snapshot().error,'audioFailed');engine.dispose()
})
