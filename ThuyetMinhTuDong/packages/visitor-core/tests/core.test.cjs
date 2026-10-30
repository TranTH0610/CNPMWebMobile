/**
 * FILE NÀY LÀM GÌ
 * Kiểm tra lọc công bố, ngôn ngữ, QR, tìm kiếm và dữ liệu du khách.
 *
 * VỊ TRÍ: packages/visitor-core/tests/core.test.cjs
 * DÙNG BỞI: Bộ chạy test tương ứng trong package.json.
 * PHỤ THUỘC: node:test; node:assert/strict; ../.test-build/catalog/catalog.js;
 * ../.test-build/data/mock.js; ../.test-build/domain/model.js; ../.test-build/catalog/search.js;
 * ../.test-build/links/qr.js; ../.test-build/i18n/messages.js; node:fs; node:path;
 * ../.test-build/data/photos.js
 * TẠI SAO TÁCH FILE: Kiểm tra hành vi tự động giúp phát hiện lỗi mà không phải thao tác lại toàn
 * bộ giao diện.
 */
// Khai báo { test }: require nạp module 'node:test' để dùng chức năng có sẵn thay vì chép lại.
const { test } = require('node:test')
// Khai báo assert: require nạp module 'node:assert/strict' để dùng chức năng có sẵn thay vì chép lại.
const assert = require('node:assert/strict')

/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `const {`: Khai báo { createCatalog, publishedText, availableLanguages, CatalogError, }: require nạp module '../.test-build/catalog/catalog.js' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `createCatalog,`: Khai báo { createCatalog, publishedText, availableLanguages, CatalogError, }: require nạp module '../.test-build/catalog/catalog.js' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `publishedText,`: Khai báo { createCatalog, publishedText, availableLanguages, CatalogError, }: require nạp module '../.test-build/catalog/catalog.js' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `availableLanguages,`: Khai báo { createCatalog, publishedText, availableLanguages, CatalogError, }: require nạp module '../.test-build/catalog/catalog.js' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `CatalogError,`: Khai báo { createCatalog, publishedText, availableLanguages, CatalogError, }: require nạp module '../.test-build/catalog/catalog.js' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `} = require('../.test-build/catalog/catalog.js')`: Khai báo { createCatalog, publishedText, availableLanguages, CatalogError, }: require nạp module '../.test-build/catalog/catalog.js' để dùng chức năng có sẵn thay vì chép lại.
 */
const {
  createCatalog,
  publishedText,
  availableLanguages,
  CatalogError,
} = require('../.test-build/catalog/catalog.js')

/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `const {`: Khai báo { MOCK_PLACES, loadMockCatalog, }: require nạp module '../.test-build/data/mock.js' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `MOCK_PLACES,`: Khai báo { MOCK_PLACES, loadMockCatalog, }: require nạp module '../.test-build/data/mock.js' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `loadMockCatalog,`: Khai báo { MOCK_PLACES, loadMockCatalog, }: require nạp module '../.test-build/data/mock.js' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `} = require('../.test-build/data/mock.js')`: Khai báo { MOCK_PLACES, loadMockCatalog, }: require nạp module '../.test-build/data/mock.js' để dùng chức năng có sẵn thay vì chép lại.
 */
const {
  MOCK_PLACES,
  loadMockCatalog,
} = require('../.test-build/data/mock.js')

// Khai báo { languageOf }: require nạp module '../.test-build/domain/model.js' để dùng chức năng có sẵn thay vì chép lại.
const { languageOf } = require('../.test-build/domain/model.js')

/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `const {`: Khai báo { normalize, selectPlaces, paginate, distanceTo, }: require nạp module '../.test-build/catalog/search.js' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `normalize,`: Khai báo { normalize, selectPlaces, paginate, distanceTo, }: require nạp module '../.test-build/catalog/search.js' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `selectPlaces,`: Khai báo { normalize, selectPlaces, paginate, distanceTo, }: require nạp module '../.test-build/catalog/search.js' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `paginate,`: Khai báo { normalize, selectPlaces, paginate, distanceTo, }: require nạp module '../.test-build/catalog/search.js' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `distanceTo,`: Khai báo { normalize, selectPlaces, paginate, distanceTo, }: require nạp module '../.test-build/catalog/search.js' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `} = require('../.test-build/catalog/search.js')`: Khai báo { normalize, selectPlaces, paginate, distanceTo, }: require nạp module '../.test-build/catalog/search.js' để dùng chức năng có sẵn thay vì chép lại.
 */
const {
  normalize,
  selectPlaces,
  paginate,
  distanceTo,
} = require('../.test-build/catalog/search.js')

/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `const {`: Khai báo { parsePlaceQr, parseQrTarget, placeUrl, }: require nạp module '../.test-build/links/qr.js' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `parsePlaceQr,`: Khai báo { parsePlaceQr, parseQrTarget, placeUrl, }: require nạp module '../.test-build/links/qr.js' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `parseQrTarget,`: Khai báo { parsePlaceQr, parseQrTarget, placeUrl, }: require nạp module '../.test-build/links/qr.js' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `placeUrl,`: Khai báo { parsePlaceQr, parseQrTarget, placeUrl, }: require nạp module '../.test-build/links/qr.js' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `} = require('../.test-build/links/qr.js')`: Khai báo { parsePlaceQr, parseQrTarget, placeUrl, }: require nạp module '../.test-build/links/qr.js' để dùng chức năng có sẵn thay vì chép lại.
 */
const {
  parsePlaceQr,
  parseQrTarget,
  placeUrl,
} = require('../.test-build/links/qr.js')

// Khai báo { messages }: require nạp module '../.test-build/i18n/messages.js' để dùng chức năng có sẵn thay vì chép lại.
const { messages } = require('../.test-build/i18n/messages.js')

// Khai báo policy: tạo object gồm allowedOrigins, allowHttp.
const policy = {
  // Gán thuộc tính allowedOrigins: tạo mảng ['https://hue-guide.example'].
  allowedOrigins: ['https://hue-guide.example'],
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `allowHttp: false,`: Gán thuộc tính allowHttp: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  allowHttp: false,
}

// CHỨC NĂNG: Kiểm tra mã ngôn ngữ và bộ khóa.
// XỬ LÝ: Bắt nhầm cn/pt và thiếu key giữa các resource.
// Khẳng định kết quả thử nghiệm bằng test('UC01: ánh xạ mã và đủ khóa UI', () => { assert.equal(languageOf('zh-Hans-CN'), 'cn') assert.equal(languageOf('pt_B.
test('UC01: ánh xạ mã và đủ khóa UI', () => {
  // Khẳng định kết quả thử nghiệm bằng assert.equal(languageOf('zh-Hans-CN'), 'cn').
  assert.equal(languageOf('zh-Hans-CN'), 'cn')
  // Khẳng định kết quả thử nghiệm bằng assert.equal(languageOf('pt_BR'), 'pt').
  assert.equal(languageOf('pt_BR'), 'pt')
  // Khẳng định kết quả thử nghiệm bằng assert.equal(languageOf('JA-jp'), 'ja').
  assert.equal(languageOf('JA-jp'), 'ja')
  // Khẳng định kết quả thử nghiệm bằng assert.equal(languageOf('fr'), null).
  assert.equal(languageOf('fr'), null)

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( languageOf('en') ?? languageOf('ja') ?? 'vi', 'en', ).
   * DÒNG `languageOf('en') ?? languageOf('ja') ?? 'vi',`: Khẳng định kết quả thử nghiệm bằng assert.equal( languageOf('en') ?? languageOf('ja') ?? 'vi', 'en', ).
   * DÒNG `'en',`: Khẳng định kết quả thử nghiệm bằng assert.equal( languageOf('en') ?? languageOf('ja') ?? 'vi', 'en', ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  assert.equal(
    languageOf('en') ?? languageOf('ja') ?? 'vi',
    'en',
  )

  // Duyệt lần lượt ['en', 'cn', 'pt', 'ja'] bằng const language.
  for (const language of ['en', 'cn', 'pt', 'ja']) {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `assert.deepEqual(`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( Object.keys(messages[language]).sort(), Object.keys(messages.vi).sort(), ).
     * DÒNG `Object.keys(messages[language]).sort(),`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( Object.keys(messages[language]).sort(), Object.keys(messages.vi).sort(), ).
     * DÒNG `Object.keys(messages.vi).sort(),`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( Object.keys(messages[language]).sort(), Object.keys(messages.vi).sort(), ).
     * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    assert.deepEqual(
      Object.keys(messages[language]).sort(),
      Object.keys(messages.vi).sort(),
    )
  }

  // Khẳng định kết quả thử nghiệm bằng assert.equal(messages.cn.explore, '探索').
  assert.equal(messages.cn.explore, '探索')
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(messages.pt.explore, 'Explorar')`: Khẳng định kết quả thử nghiệm bằng assert.equal(messages.pt.explore, 'Explorar').
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.equal(messages.pt.explore, 'Explorar')
})

// CHỨC NĂNG: Kiểm tra phạm vi và trạng thái công bố.
// XỬ LÝ: Tạo dữ liệu ngoài phạm vi, nháp và chưa triển khai để thử loại bỏ.
// Khẳng định kết quả thử nghiệm bằng test('UC02/04: chỉ trả dữ liệu được công bố', async () => { const base = MOCK_PLACES[0] const records = [ base, { ...bas.
test('UC02/04: chỉ trả dữ liệu được công bố', async () => {
  // Khai báo base: đọc MOCK_PLACES[0] từ đối tượng/mảng để dùng tại bước hiện tại.
  const base = MOCK_PLACES[0]

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const records = [`: Khai báo records: tạo mảng [ base, { ...base, id: 'outside', scope: 'ha-noi', }, { ...base, id: 'draft-poin.
   * DÒNG `base,`: Khai báo records: tạo mảng [ base, { ...base, id: 'outside', scope: 'ha-noi', }, { ...base, id: 'draft-poin.
   * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
   * DÒNG `...base,`: Khai báo records: tạo mảng [ base, { ...base, id: 'outside', scope: 'ha-noi', }, { ...base, id: 'draft-poin.
   */
  const records = [
    base,
    {
      ...base,
      // Gán thuộc tính id: chuỗi 'outside'.
      id: 'outside',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `scope: 'ha-noi',`: Gán thuộc tính scope: chuỗi 'ha-noi'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
       * DÒNG `...base,`: Khai báo records: tạo mảng [ base, { ...base, id: 'outside', scope: 'ha-noi', }, { ...base, id: 'draft-poin.
       */
      scope: 'ha-noi',
    },
    {
      ...base,
      // Gán thuộc tính id: chuỗi 'draft-point'.
      id: 'draft-point',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `status: 'draft',`: Gán thuộc tính status: chuỗi 'draft'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
       * DÒNG `...base,`: Khai báo records: tạo mảng [ base, { ...base, id: 'outside', scope: 'ha-noi', }, { ...base, id: 'draft-poin.
       */
      status: 'draft',
    },
    {
      ...base,
      // Gán thuộc tính id: chuỗi 'unlisted'.
      id: 'unlisted',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `inLaunchCatalog: false,`: Gán thuộc tính inLaunchCatalog: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
       * DÒNG `...base,`: Khai báo records: tạo mảng [ base, { ...base, id: 'outside', scope: 'ha-noi', }, { ...base, id: 'draft-poin.
       */
      inLaunchCatalog: false,
    },
    {
      ...base,
      // Gán thuộc tính id: chuỗi 'draft-text'.
      id: 'draft-text',
      // Gán thuộc tính content: tạo object gồm vi.
      content: {
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `vi: {`: Gán thuộc tính vi: tạo object gồm ...giá trị ghép, status.
         * DÒNG `...base.content.vi,`: Gán thuộc tính vi: tạo object gồm ...giá trị ghép, status.
         */
        vi: {
          ...base.content.vi,
          /* GIẢI THÍCH TỪNG DÒNG:
           * DÒNG `status: 'approved',`: Gán thuộc tính status: chuỗi 'approved'.
           * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
           * DÒNG `...base,`: Khai báo records: tạo mảng [ base, { ...base, id: 'outside', scope: 'ha-noi', }, { ...base, id: 'draft-poin.
           */
          status: 'approved',
        },
      },
    },
    {
      ...base,
      // Gán thuộc tính id: chuỗi 'mixed'.
      id: 'mixed',
      // Gán thuộc tính content: tạo object gồm vi, en.
      content: {
        // Gán thuộc tính vi: đọc base.content.vi từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
        vi: base.content.vi,
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `en: {`: Gán thuộc tính en: tạo object gồm ...giá trị ghép, status.
         * DÒNG `...base.content.en,`: Gán thuộc tính en: tạo object gồm ...giá trị ghép, status.
         */
        en: {
          ...base.content.en,
          /* GIẢI THÍCH TỪNG DÒNG:
           * DÒNG `status: 'draft',`: Gán thuộc tính status: chuỗi 'draft'.
           * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `]`: Kết thúc danh sách phần tử trong mảng.
           */
          status: 'draft',
        },
      },
    },
  ]

  // Khai báo catalog: Gọi createCatalog(async () => records).
  const catalog = createCatalog(async () => records)

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.deepEqual(`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( (await catalog.list()).map((place) => place.id), ['ky-dai', 'mixed'], ).
   * DÒNG `(await catalog.list()).map((place) => place.id),`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( (await catalog.list()).map((place) => place.id), ['ky-dai', 'mixed'], ).
   * DÒNG `['ky-dai', 'mixed'],`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( (await catalog.list()).map((place) => place.id), ['ky-dai', 'mixed'], ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  assert.deepEqual(
    (await catalog.list()).map((place) => place.id),
    ['ky-dai', 'mixed'],
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( (await catalog.get('mixed')).content.en, undefined, ).
   * DÒNG `(await catalog.get('mixed')).content.en,`: Khẳng định kết quả thử nghiệm bằng assert.equal( (await catalog.get('mixed')).content.en, undefined, ).
   * DÒNG `undefined,`: Khẳng định kết quả thử nghiệm bằng assert.equal( (await catalog.get('mixed')).content.en, undefined, ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  assert.equal(
    (await catalog.get('mixed')).content.en,
    undefined,
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `await assert.rejects(`: Khẳng định kết quả thử nghiệm bằng await assert.rejects( catalog.get('outside'), (error) => error instanceof CatalogError, ).
   * DÒNG `catalog.get('outside'),`: Khẳng định kết quả thử nghiệm bằng await assert.rejects( catalog.get('outside'), (error) => error instanceof CatalogError, ).
   * DÒNG `(error) => error instanceof CatalogError,`: Khẳng định kết quả thử nghiệm bằng await assert.rejects( catalog.get('outside'), (error) => error instanceof CatalogError, ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  await assert.rejects(
    catalog.get('outside'),
    (error) => error instanceof CatalogError,
  )

  // Khai báo copy: await chờ catalog.get đọc theo khóa.
  const copy = await catalog.get('ky-dai')
  // Thực hiện tính biểu thức copy.content.vi.title = 'changed'.
  copy.content.vi.title = 'changed'

  // Khẳng định kết quả thử nghiệm bằng assert.notEqual(base.content.vi.title, 'changed').
  assert.notEqual(base.content.vi.title, 'changed')

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( publishedText({ ...base, content: { vi: { ...base.content.vi, approvedAt: undefined, }, }, }, 'vi'), undef.
   * DÒNG `publishedText({`: Khẳng định kết quả thử nghiệm bằng assert.equal( publishedText({ ...base, content: { vi: { ...base.content.vi, approvedAt: undefined, }, }, }, 'vi'), undef.
   * DÒNG `...base,`: Khẳng định kết quả thử nghiệm bằng assert.equal( publishedText({ ...base, content: { vi: { ...base.content.vi, approvedAt: undefined, }, }, }, 'vi'), undef.
   */
  assert.equal(
    publishedText({
      ...base,
      // Gán thuộc tính content: tạo object gồm vi.
      content: {
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `vi: {`: Gán thuộc tính vi: tạo object gồm ...giá trị ghép, approvedAt.
         * DÒNG `...base.content.vi,`: Gán thuộc tính vi: tạo object gồm ...giá trị ghép, approvedAt.
         */
        vi: {
          ...base.content.vi,
          /* GIẢI THÍCH TỪNG DÒNG:
           * DÒNG `approvedAt: undefined,`: Gán thuộc tính approvedAt: sử dụng undefined làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
           * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           * DÒNG `}, 'vi'),`: Khẳng định kết quả thử nghiệm bằng assert.equal( publishedText({ ...base, content: { vi: { ...base.content.vi, approvedAt: undefined, }, }, }, 'vi'), undef.
           * DÒNG `undefined,`: Khẳng định kết quả thử nghiệm bằng assert.equal( publishedText({ ...base, content: { vi: { ...base.content.vi, approvedAt: undefined, }, }, }, 'vi'), undef.
           * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
           * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
           */
          approvedAt: undefined,
        },
      },
    }, 'vi'),
    undefined,
  )
})

// CHỨC NĂNG: Kiểm tra tìm không dấu và đúng ngôn ngữ.
// XỬ LÝ: Từ khóa rỗng, không có kết quả và thiếu bản dịch đều được thử.
// Khẳng định kết quả thử nghiệm bằng test('UC03: tìm kiếm và lọc', () => { assert.equal( normalize(' ĐIỆN Thái Hòa '), 'dien thai hoa', ) const options = { l.
test('UC03: tìm kiếm và lọc', () => {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( normalize(' ĐIỆN Thái Hòa '), 'dien thai hoa', ).
   * DÒNG `normalize(' ĐIỆN Thái Hòa '),`: Khẳng định kết quả thử nghiệm bằng assert.equal( normalize(' ĐIỆN Thái Hòa '), 'dien thai hoa', ).
   * DÒNG `'dien thai hoa',`: Khẳng định kết quả thử nghiệm bằng assert.equal( normalize(' ĐIỆN Thái Hòa '), 'dien thai hoa', ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  assert.equal(
    normalize('  ĐIỆN  Thái Hòa '),
    'dien thai hoa',
  )

  // Khai báo options: tạo object gồm language, query, zone, order.
  const options = {
    // Gán thuộc tính language: chuỗi 'vi'.
    language: 'vi',
    // Gán thuộc tính query: chuỗi 'ngo mon'.
    query: 'ngo mon',
    // Gán thuộc tính zone: sử dụng null làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    zone: null,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `order: 'name',`: Gán thuộc tính order: chuỗi 'name'.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    order: 'name',
  }

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.deepEqual(`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( selectPlaces(MOCK_PLACES, options) .map((place) => place.id), ['dien-thai-hoa', 'ky-dai', 'ngo-mon'],.
   * DÒNG `selectPlaces(MOCK_PLACES, options)`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( selectPlaces(MOCK_PLACES, options) .map((place) => place.id), ['dien-thai-hoa', 'ky-dai', 'ngo-mon'],.
   * DÒNG `.map((place) => place.id),`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( selectPlaces(MOCK_PLACES, options) .map((place) => place.id), ['dien-thai-hoa', 'ky-dai', 'ngo-mon'],.
   * DÒNG `['dien-thai-hoa', 'ky-dai', 'ngo-mon'],`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( selectPlaces(MOCK_PLACES, options) .map((place) => place.id), ['dien-thai-hoa', 'ky-dai', 'ngo-mon'],.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  assert.deepEqual(
    selectPlaces(MOCK_PLACES, options)
      .map((place) => place.id),
    ['dien-thai-hoa', 'ky-dai', 'ngo-mon'],
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces(MOCK_PLACES, { ...options, query: ' ', }).length, MOCK_PLACES.length, ).
   * DÒNG `selectPlaces(MOCK_PLACES, {`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces(MOCK_PLACES, { ...options, query: ' ', }).length, MOCK_PLACES.length, ).
   * DÒNG `...options,`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces(MOCK_PLACES, { ...options, query: ' ', }).length, MOCK_PLACES.length, ).
   */
  assert.equal(
    selectPlaces(MOCK_PLACES, {
      ...options,
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `query: ' ',`: Gán thuộc tính query: chuỗi ' '.
       * DÒNG `}).length,`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces(MOCK_PLACES, { ...options, query: ' ', }).length, MOCK_PLACES.length, ).
       * DÒNG `MOCK_PLACES.length,`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces(MOCK_PLACES, { ...options, query: ' ', }).length, MOCK_PLACES.length, ).
       * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
       */
      query: '   ',
    }).length,
    MOCK_PLACES.length,
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces(MOCK_PLACES, { ...options, query: 'zzzzz', }).length, 0, ).
   * DÒNG `selectPlaces(MOCK_PLACES, {`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces(MOCK_PLACES, { ...options, query: 'zzzzz', }).length, 0, ).
   * DÒNG `...options,`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces(MOCK_PLACES, { ...options, query: 'zzzzz', }).length, 0, ).
   */
  assert.equal(
    selectPlaces(MOCK_PLACES, {
      ...options,
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `query: 'zzzzz',`: Gán thuộc tính query: chuỗi 'zzzzz'.
       * DÒNG `}).length,`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces(MOCK_PLACES, { ...options, query: 'zzzzz', }).length, 0, ).
       * DÒNG `0,`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces(MOCK_PLACES, { ...options, query: 'zzzzz', }).length, 0, ).
       * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
       */
      query: 'zzzzz',
    }).length,
    0,
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces(MOCK_PLACES, { ...options, query: '', zone: 'ceremonial', }).length, MOCK_PLACES.filter((plac.
   * DÒNG `selectPlaces(MOCK_PLACES, {`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces(MOCK_PLACES, { ...options, query: '', zone: 'ceremonial', }).length, MOCK_PLACES.filter((plac.
   * DÒNG `...options,`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces(MOCK_PLACES, { ...options, query: '', zone: 'ceremonial', }).length, MOCK_PLACES.filter((plac.
   */
  assert.equal(
    selectPlaces(MOCK_PLACES, {
      ...options,
      // Gán thuộc tính query: chuỗi ''.
      query: '',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `zone: 'ceremonial',`: Gán thuộc tính zone: chuỗi 'ceremonial'.
       * DÒNG `}).length,`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces(MOCK_PLACES, { ...options, query: '', zone: 'ceremonial', }).length, MOCK_PLACES.filter((plac.
       * DÒNG `MOCK_PLACES.filter((place) => place.zone === 'ceremonial').length,`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces(MOCK_PLACES, { ...options, query: '', zone: 'ceremonial', }).length, MOCK_PLACES.filter((plac.
       * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
       */
      zone: 'ceremonial',
    }).length,
    MOCK_PLACES.filter((place) => place.zone === 'ceremonial').length,
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces(MOCK_PLACES, { ...options, language: 'en', query: 'lễ đăng quang', }).length, 0, ).
   * DÒNG `selectPlaces(MOCK_PLACES, {`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces(MOCK_PLACES, { ...options, language: 'en', query: 'lễ đăng quang', }).length, 0, ).
   * DÒNG `...options,`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces(MOCK_PLACES, { ...options, language: 'en', query: 'lễ đăng quang', }).length, 0, ).
   */
  assert.equal(
    selectPlaces(MOCK_PLACES, {
      ...options,
      // Gán thuộc tính language: chuỗi 'en'.
      language: 'en',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `query: 'lễ đăng quang',`: Gán thuộc tính query: chuỗi 'lễ đăng quang'.
       * DÒNG `}).length,`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces(MOCK_PLACES, { ...options, language: 'en', query: 'lễ đăng quang', }).length, 0, ).
       * DÒNG `0,`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces(MOCK_PLACES, { ...options, language: 'en', query: 'lễ đăng quang', }).length, 0, ).
       * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
       */
      query: 'lễ đăng quang',
    }).length,
    0,
  )

 // CHỨC NĂNG: Kiểm tra các điểm demo đủ năm bản ngôn ngữ.
// XỬ LÝ: Dùng dữ liệu visitor-core có trường content.
// Duyệt lần lượt MOCK_PLACES bằng const place.
for (const place of MOCK_PLACES) {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.deepEqual(`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( availableLanguages(place), ['vi', 'en', 'cn', 'pt', 'ja'], ).
   * DÒNG `availableLanguages(place),`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( availableLanguages(place), ['vi', 'en', 'cn', 'pt', 'ja'], ).
   * DÒNG `['vi', 'en', 'cn', 'pt', 'ja'],`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( availableLanguages(place), ['vi', 'en', 'cn', 'pt', 'ja'], ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.deepEqual(
    availableLanguages(place),
    ['vi', 'en', 'cn', 'pt', 'ja'],
  )
}

// CHỨC NĂNG: Vẫn kiểm tra trường hợp thiếu bản Nhật.
// XỬ LÝ: Tạo bản sao riêng, không sửa dữ liệu mock gốc.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `const incompletePlace = {`: Khai báo incompletePlace: tạo object gồm ...giá trị ghép, content.
 * DÒNG `...MOCK_PLACES[2],`: Khai báo incompletePlace: tạo object gồm ...giá trị ghép, content.
 */
const incompletePlace = {
  ...MOCK_PLACES[2],
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `content: {`: Gán thuộc tính content: tạo object gồm ...giá trị ghép.
   * DÒNG `...MOCK_PLACES[2].content,`: Gán thuộc tính content: tạo object gồm ...giá trị ghép.
   * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  content: {
    ...MOCK_PLACES[2].content,
  },
}

// Thực hiện sử dụng delete incompletePlace.content.ja làm giá trị của bước hiện tại.
delete incompletePlace.content.ja

/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( publishedText(incompletePlace, 'ja'), undefined, ).
 * DÒNG `publishedText(incompletePlace, 'ja'),`: Khẳng định kết quả thử nghiệm bằng assert.equal( publishedText(incompletePlace, 'ja'), undefined, ).
 * DÒNG `undefined,`: Khẳng định kết quả thử nghiệm bằng assert.equal( publishedText(incompletePlace, 'ja'), undefined, ).
 * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
 */
assert.equal(
  publishedText(incompletePlace, 'ja'),
  undefined,
)

/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `assert.deepEqual(`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( availableLanguages(incompletePlace), ['vi', 'en', 'cn', 'pt'], ).
 * DÒNG `availableLanguages(incompletePlace),`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( availableLanguages(incompletePlace), ['vi', 'en', 'cn', 'pt'], ).
 * DÒNG `['vi', 'en', 'cn', 'pt'],`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( availableLanguages(incompletePlace), ['vi', 'en', 'cn', 'pt'], ).
 * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
 * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
 */
assert.deepEqual(
  availableLanguages(incompletePlace),
  ['vi', 'en', 'cn', 'pt'],
)
})

// CHỨC NĂNG: Kiểm tra tìm kiếm, lọc và đủ bản ngôn ngữ demo.
// XỬ LÝ:
// - options được khai báo bên trong test.
// - Không cố định số điểm là 3 khi mock đã có 8.
// - Kiểm tra thiếu bản dịch bằng bản sao riêng.
// Khẳng định kết quả thử nghiệm bằng test('UC03: tìm kiếm và lọc', () => { assert.equal( normalize(' ĐIỆN Thái Hòa '), 'dien thai hoa', ) const options = { l.
test('UC03: tìm kiếm và lọc', () => {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( normalize(' ĐIỆN Thái Hòa '), 'dien thai hoa', ).
   * DÒNG `normalize(' ĐIỆN Thái Hòa '),`: Khẳng định kết quả thử nghiệm bằng assert.equal( normalize(' ĐIỆN Thái Hòa '), 'dien thai hoa', ).
   * DÒNG `'dien thai hoa',`: Khẳng định kết quả thử nghiệm bằng assert.equal( normalize(' ĐIỆN Thái Hòa '), 'dien thai hoa', ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  assert.equal(
    normalize('  ĐIỆN  Thái Hòa '),
    'dien thai hoa',
  )

  // Khai báo options: tạo object gồm language, query, zone, order.
  const options = {
    // Gán thuộc tính language: chuỗi 'vi'.
    language: 'vi',
    // Gán thuộc tính query: chuỗi 'ngo mon'.
    query: 'ngo mon',
    // Gán thuộc tính zone: sử dụng null làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    zone: null,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `order: 'name',`: Gán thuộc tính order: chuỗi 'name'.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    order: 'name',
  }

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.deepEqual(`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( selectPlaces( MOCK_PLACES, options, ).map( (place) => place.id, ), ['dien-thai-hoa', 'ky-dai', 'ngo-mo.
   * DÒNG `selectPlaces(`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( selectPlaces( MOCK_PLACES, options, ).map( (place) => place.id, ), ['dien-thai-hoa', 'ky-dai', 'ngo-mo.
   * DÒNG `MOCK_PLACES,`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( selectPlaces( MOCK_PLACES, options, ).map( (place) => place.id, ), ['dien-thai-hoa', 'ky-dai', 'ngo-mo.
   * DÒNG `options,`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( selectPlaces( MOCK_PLACES, options, ).map( (place) => place.id, ), ['dien-thai-hoa', 'ky-dai', 'ngo-mo.
   * DÒNG `).map(`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( selectPlaces( MOCK_PLACES, options, ).map( (place) => place.id, ), ['dien-thai-hoa', 'ky-dai', 'ngo-mo.
   * DÒNG `(place) => place.id,`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( selectPlaces( MOCK_PLACES, options, ).map( (place) => place.id, ), ['dien-thai-hoa', 'ky-dai', 'ngo-mo.
   * DÒNG `),`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `['dien-thai-hoa', 'ky-dai', 'ngo-mon'],`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( selectPlaces( MOCK_PLACES, options, ).map( (place) => place.id, ), ['dien-thai-hoa', 'ky-dai', 'ngo-mo.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  assert.deepEqual(
    selectPlaces(
      MOCK_PLACES,
      options,
    ).map(
      (place) => place.id,
    ),
    ['dien-thai-hoa', 'ky-dai', 'ngo-mon'],
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces( MOCK_PLACES, { ...options, query: ' ', }, ).length, MOCK_PLACES.length, ).
   * DÒNG `selectPlaces(`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces( MOCK_PLACES, { ...options, query: ' ', }, ).length, MOCK_PLACES.length, ).
   * DÒNG `MOCK_PLACES,`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces( MOCK_PLACES, { ...options, query: ' ', }, ).length, MOCK_PLACES.length, ).
   * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
   * DÒNG `...options,`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces( MOCK_PLACES, { ...options, query: ' ', }, ).length, MOCK_PLACES.length, ).
   */
  assert.equal(
    selectPlaces(
      MOCK_PLACES,
      {
        ...options,
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `query: ' ',`: Gán thuộc tính query: chuỗi ' '.
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `).length,`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces( MOCK_PLACES, { ...options, query: ' ', }, ).length, MOCK_PLACES.length, ).
         * DÒNG `MOCK_PLACES.length,`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces( MOCK_PLACES, { ...options, query: ' ', }, ).length, MOCK_PLACES.length, ).
         * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
         */
        query: '   ',
      },
    ).length,
    MOCK_PLACES.length,
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces( MOCK_PLACES, { ...options, query: 'zzzzz', }, ).length, 0, ).
   * DÒNG `selectPlaces(`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces( MOCK_PLACES, { ...options, query: 'zzzzz', }, ).length, 0, ).
   * DÒNG `MOCK_PLACES,`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces( MOCK_PLACES, { ...options, query: 'zzzzz', }, ).length, 0, ).
   * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
   * DÒNG `...options,`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces( MOCK_PLACES, { ...options, query: 'zzzzz', }, ).length, 0, ).
   */
  assert.equal(
    selectPlaces(
      MOCK_PLACES,
      {
        ...options,
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `query: 'zzzzz',`: Gán thuộc tính query: chuỗi 'zzzzz'.
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `).length,`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces( MOCK_PLACES, { ...options, query: 'zzzzz', }, ).length, 0, ).
         * DÒNG `0,`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces( MOCK_PLACES, { ...options, query: 'zzzzz', }, ).length, 0, ).
         * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
         */
        query: 'zzzzz',
      },
    ).length,
    0,
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces( MOCK_PLACES, { ...options, query: '', zone: 'ceremonial', }, ).length, MOCK_PLACES.filter( (.
   * DÒNG `selectPlaces(`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces( MOCK_PLACES, { ...options, query: '', zone: 'ceremonial', }, ).length, MOCK_PLACES.filter( (.
   * DÒNG `MOCK_PLACES,`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces( MOCK_PLACES, { ...options, query: '', zone: 'ceremonial', }, ).length, MOCK_PLACES.filter( (.
   * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
   * DÒNG `...options,`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces( MOCK_PLACES, { ...options, query: '', zone: 'ceremonial', }, ).length, MOCK_PLACES.filter( (.
   */
  assert.equal(
    selectPlaces(
      MOCK_PLACES,
      {
        ...options,
        // Gán thuộc tính query: chuỗi ''.
        query: '',
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `zone: 'ceremonial',`: Gán thuộc tính zone: chuỗi 'ceremonial'.
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `).length,`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces( MOCK_PLACES, { ...options, query: '', zone: 'ceremonial', }, ).length, MOCK_PLACES.filter( (.
         * DÒNG `MOCK_PLACES.filter(`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces( MOCK_PLACES, { ...options, query: '', zone: 'ceremonial', }, ).length, MOCK_PLACES.filter( (.
         * DÒNG `(place) =>`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces( MOCK_PLACES, { ...options, query: '', zone: 'ceremonial', }, ).length, MOCK_PLACES.filter( (.
         * DÒNG `place.zone === 'ceremonial',`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces( MOCK_PLACES, { ...options, query: '', zone: 'ceremonial', }, ).length, MOCK_PLACES.filter( (.
         * DÒNG `).length,`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces( MOCK_PLACES, { ...options, query: '', zone: 'ceremonial', }, ).length, MOCK_PLACES.filter( (.
         * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
         */
        zone: 'ceremonial',
      },
    ).length,

    MOCK_PLACES.filter(
      (place) =>
        place.zone === 'ceremonial',
    ).length,
  )

  // CHỨC NĂNG: Không tìm nhầm bản Việt khi đang dùng Anh.
  // XỬ LÝ: Dùng cụm chỉ có trong bản Việt; phiên âm tên riêng có thể xuất hiện trong bản Anh.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces( MOCK_PLACES, { ...options, language: 'en', query: 'lễ đăng quang', }, ).length, 0, ).
   * DÒNG `selectPlaces(`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces( MOCK_PLACES, { ...options, language: 'en', query: 'lễ đăng quang', }, ).length, 0, ).
   * DÒNG `MOCK_PLACES,`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces( MOCK_PLACES, { ...options, language: 'en', query: 'lễ đăng quang', }, ).length, 0, ).
   * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
   * DÒNG `...options,`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces( MOCK_PLACES, { ...options, language: 'en', query: 'lễ đăng quang', }, ).length, 0, ).
   */
  assert.equal(
    selectPlaces(
      MOCK_PLACES,
      {
        ...options,
        // Gán thuộc tính language: chuỗi 'en'.
        language: 'en',
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `query: 'lễ đăng quang',`: Gán thuộc tính query: chuỗi 'lễ đăng quang'.
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `).length,`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces( MOCK_PLACES, { ...options, language: 'en', query: 'lễ đăng quang', }, ).length, 0, ).
         * DÒNG `0,`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces( MOCK_PLACES, { ...options, language: 'en', query: 'lễ đăng quang', }, ).length, 0, ).
         * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
         */
        query: 'lễ đăng quang',
      },
    ).length,
    0,
  )

  // Duyệt lần lượt MOCK_PLACES bằng const place.
  for (const place of MOCK_PLACES) {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `assert.deepEqual(`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( availableLanguages(place), ['vi', 'en', 'cn', 'pt', 'ja'], ).
     * DÒNG `availableLanguages(place),`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( availableLanguages(place), ['vi', 'en', 'cn', 'pt', 'ja'], ).
     * DÒNG `['vi', 'en', 'cn', 'pt', 'ja'],`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( availableLanguages(place), ['vi', 'en', 'cn', 'pt', 'ja'], ).
     * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    assert.deepEqual(
      availableLanguages(place),
      ['vi', 'en', 'cn', 'pt', 'ja'],
    )
  }

  // CHỨC NĂNG: Giả lập API chưa có bản Nhật.
  // XỬ LÝ: Không xóa trực tiếp trên MOCK_PLACES dùng cho test khác.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const incompletePlace = {`: Khai báo incompletePlace: tạo object gồm ...giá trị ghép, content.
   * DÒNG `...MOCK_PLACES[2],`: Khai báo incompletePlace: tạo object gồm ...giá trị ghép, content.
   */
  const incompletePlace = {
    ...MOCK_PLACES[2],

    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `content: {`: Gán thuộc tính content: tạo object gồm ...giá trị ghép.
     * DÒNG `...MOCK_PLACES[2].content,`: Gán thuộc tính content: tạo object gồm ...giá trị ghép.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    content: {
      ...MOCK_PLACES[2].content,
    },
  }

  // Thực hiện sử dụng delete incompletePlace.content.ja làm giá trị của bước hiện tại.
  delete incompletePlace.content.ja

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( publishedText( incompletePlace, 'ja', ), undefined, ).
   * DÒNG `publishedText(`: Khẳng định kết quả thử nghiệm bằng assert.equal( publishedText( incompletePlace, 'ja', ), undefined, ).
   * DÒNG `incompletePlace,`: Khẳng định kết quả thử nghiệm bằng assert.equal( publishedText( incompletePlace, 'ja', ), undefined, ).
   * DÒNG `'ja',`: Khẳng định kết quả thử nghiệm bằng assert.equal( publishedText( incompletePlace, 'ja', ), undefined, ).
   * DÒNG `),`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `undefined,`: Khẳng định kết quả thử nghiệm bằng assert.equal( publishedText( incompletePlace, 'ja', ), undefined, ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  assert.equal(
    publishedText(
      incompletePlace,
      'ja',
    ),
    undefined,
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.deepEqual(`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( availableLanguages( incompletePlace, ), ['vi', 'en', 'cn', 'pt'], ).
   * DÒNG `availableLanguages(`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( availableLanguages( incompletePlace, ), ['vi', 'en', 'cn', 'pt'], ).
   * DÒNG `incompletePlace,`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( availableLanguages( incompletePlace, ), ['vi', 'en', 'cn', 'pt'], ).
   * DÒNG `),`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `['vi', 'en', 'cn', 'pt'],`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( availableLanguages( incompletePlace, ), ['vi', 'en', 'cn', 'pt'], ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.deepEqual(
    availableLanguages(
      incompletePlace,
    ),
    ['vi', 'en', 'cn', 'pt'],
  )
})

// CHỨC NĂNG: Kiểm tra QR hợp lệ.
// XỬ LÝ: Thử custom scheme, HTTPS và HTTP phát triển được cho phép.
// Khẳng định kết quả thử nghiệm bằng test('UC05: QR hợp lệ', () => { assert.equal( parsePlaceQr( 'https://hue-guide.example/places/ngo-mon', policy, ), 'ngo-.
test('UC05: QR hợp lệ', () => {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( parsePlaceQr( 'https://hue-guide.example/places/ngo-mon', policy, ), 'ngo-mon', ).
   * DÒNG `parsePlaceQr(`: Khẳng định kết quả thử nghiệm bằng assert.equal( parsePlaceQr( 'https://hue-guide.example/places/ngo-mon', policy, ), 'ngo-mon', ).
   * DÒNG `'https://hue-guide.example/places/ngo-mon',`: Khẳng định kết quả thử nghiệm bằng assert.equal( parsePlaceQr( 'https://hue-guide.example/places/ngo-mon', policy, ), 'ngo-mon', ).
   * DÒNG `policy,`: Khẳng định kết quả thử nghiệm bằng assert.equal( parsePlaceQr( 'https://hue-guide.example/places/ngo-mon', policy, ), 'ngo-mon', ).
   * DÒNG `),`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `'ngo-mon',`: Khẳng định kết quả thử nghiệm bằng assert.equal( parsePlaceQr( 'https://hue-guide.example/places/ngo-mon', policy, ), 'ngo-mon', ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  assert.equal(
    parsePlaceQr(
      'https://hue-guide.example/places/ngo-mon',
      policy,
    ),
    'ngo-mon',
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( parsePlaceQr('hueguide://places/ngo-mon', policy), 'ngo-mon', ).
   * DÒNG `parsePlaceQr('hueguide://places/ngo-mon', policy),`: Khẳng định kết quả thử nghiệm bằng assert.equal( parsePlaceQr('hueguide://places/ngo-mon', policy), 'ngo-mon', ).
   * DÒNG `'ngo-mon',`: Khẳng định kết quả thử nghiệm bằng assert.equal( parsePlaceQr('hueguide://places/ngo-mon', policy), 'ngo-mon', ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  assert.equal(
    parsePlaceQr('hueguide://places/ngo-mon', policy),
    'ngo-mon',
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( placeUrl('https://hue-guide.example', 'ngo-mon'), 'https://hue-guide.example/places/ngo-mon', ).
   * DÒNG `placeUrl('https://hue-guide.example', 'ngo-mon'),`: Khẳng định kết quả thử nghiệm bằng assert.equal( placeUrl('https://hue-guide.example', 'ngo-mon'), 'https://hue-guide.example/places/ngo-mon', ).
   * DÒNG `'https://hue-guide.example/places/ngo-mon',`: Khẳng định kết quả thử nghiệm bằng assert.equal( placeUrl('https://hue-guide.example', 'ngo-mon'), 'https://hue-guide.example/places/ngo-mon', ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  assert.equal(
    placeUrl('https://hue-guide.example', 'ngo-mon'),
    'https://hue-guide.example/places/ngo-mon',
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( parsePlaceQr( 'http://192.168.1.9:5173/places/ngo-mon', { allowedOrigins: ['http://192.168.1.9:5173'], all.
   * DÒNG `parsePlaceQr(`: Khẳng định kết quả thử nghiệm bằng assert.equal( parsePlaceQr( 'http://192.168.1.9:5173/places/ngo-mon', { allowedOrigins: ['http://192.168.1.9:5173'], all.
   * DÒNG `'http://192.168.1.9:5173/places/ngo-mon',`: Khẳng định kết quả thử nghiệm bằng assert.equal( parsePlaceQr( 'http://192.168.1.9:5173/places/ngo-mon', { allowedOrigins: ['http://192.168.1.9:5173'], all.
   * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
   */
  assert.equal(
    parsePlaceQr(
      'http://192.168.1.9:5173/places/ngo-mon',
      {
        // Gán thuộc tính allowedOrigins: tạo mảng ['http://192.168.1.9:5173'].
        allowedOrigins: ['http://192.168.1.9:5173'],
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `allowHttp: true,`: Gán thuộc tính allowHttp: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `),`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
         * DÒNG `'ngo-mon',`: Khẳng định kết quả thử nghiệm bằng assert.equal( parsePlaceQr( 'http://192.168.1.9:5173/places/ngo-mon', { allowedOrigins: ['http://192.168.1.9:5173'], all.
         * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
         * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        allowHttp: true,
      },
    ),
    'ngo-mon',
  )
})

// CHỨC NĂNG: Kiểm tra QR sai.
// XỬ LÝ: Từ chối domain giả, query, credentials và đường dẫn bất thường.
// Khẳng định kết quả thử nghiệm bằng test('UC05: từ chối QR sai', () => { const inputs = [ 'ngo-mon', 'javascript:alert(1)', 'https://evil.example/places/ngo.
test('UC05: từ chối QR sai', () => {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const inputs = [`: Khai báo inputs: tạo mảng [ 'ngo-mon', 'javascript:alert(1)', 'https://evil.example/places/ngo-mon', 'http.
   * DÒNG `'ngo-mon',`: Khai báo inputs: tạo mảng [ 'ngo-mon', 'javascript:alert(1)', 'https://evil.example/places/ngo-mon', 'http.
   * DÒNG `'javascript:alert(1)',`: Khai báo inputs: tạo mảng [ 'ngo-mon', 'javascript:alert(1)', 'https://evil.example/places/ngo-mon', 'http.
   * DÒNG `'https://evil.example/places/ngo-mon',`: Khai báo inputs: tạo mảng [ 'ngo-mon', 'javascript:alert(1)', 'https://evil.example/places/ngo-mon', 'http.
   * DÒNG `'https://hue-guide.example.evil.example/places/ngo-mon',`: Khai báo inputs: tạo mảng [ 'ngo-mon', 'javascript:alert(1)', 'https://evil.example/places/ngo-mon', 'http.
   * DÒNG `'https://hue-guide.example@evil.example/places/ngo-mon',`: Khai báo inputs: tạo mảng [ 'ngo-mon', 'javascript:alert(1)', 'https://evil.example/places/ngo-mon', 'http.
   * DÒNG `'https://user:pass@hue-guide.example/places/ngo-mon',`: Khai báo inputs: tạo mảng [ 'ngo-mon', 'javascript:alert(1)', 'https://evil.example/places/ngo-mon', 'http.
   * DÒNG `'http://hue-guide.example/places/ngo-mon',`: Khai báo inputs: tạo mảng [ 'ngo-mon', 'javascript:alert(1)', 'https://evil.example/places/ngo-mon', 'http.
   * DÒNG `'https://hue-guide.example/places/ngo-mon?next=https://evil.example',`: Khai báo inputs: tạo mảng [ 'ngo-mon', 'javascript:alert(1)', 'https://evil.example/places/ngo-mon', 'http.
   * DÒNG `'https://hue-guide.example/places/ngo-mon#x',`: Khai báo inputs: tạo mảng [ 'ngo-mon', 'javascript:alert(1)', 'https://evil.example/places/ngo-mon', 'http.
   * DÒNG `'https://hue-guide.example/places/%2Fngo-mon',`: Khai báo inputs: tạo mảng [ 'ngo-mon', 'javascript:alert(1)', 'https://evil.example/places/ngo-mon', 'http.
   * DÒNG `'hueguide://places/../secret',`: Khai báo inputs: tạo mảng [ 'ngo-mon', 'javascript:alert(1)', 'https://evil.example/places/ngo-mon', 'http.
   * DÒNG `'https://hue-guide.example/places/a--b',`: Khai báo inputs: tạo mảng [ 'ngo-mon', 'javascript:alert(1)', 'https://evil.example/places/ngo-mon', 'http.
   * DÒNG `'x'.repeat(3000),`: Khai báo inputs: tạo mảng [ 'ngo-mon', 'javascript:alert(1)', 'https://evil.example/places/ngo-mon', 'http.
   * DÒNG `]`: Kết thúc danh sách phần tử trong mảng.
   */
  const inputs = [
    'ngo-mon',
    'javascript:alert(1)',
    'https://evil.example/places/ngo-mon',
    'https://hue-guide.example.evil.example/places/ngo-mon',
    'https://hue-guide.example@evil.example/places/ngo-mon',
    'https://user:pass@hue-guide.example/places/ngo-mon',
    'http://hue-guide.example/places/ngo-mon',
    'https://hue-guide.example/places/ngo-mon?next=https://evil.example',
    'https://hue-guide.example/places/ngo-mon#x',
    'https://hue-guide.example/places/%2Fngo-mon',
    'hueguide://places/../secret',
    'https://hue-guide.example/places/a--b',
    'x'.repeat(3000),
  ]

  // Duyệt lần lượt inputs bằng const input.
  for (const input of inputs) {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `assert.throws(`: Khẳng định kết quả thử nghiệm bằng assert.throws( () => parsePlaceQr(input, policy), input, ).
     * DÒNG `() => parsePlaceQr(input, policy),`: Khẳng định kết quả thử nghiệm bằng assert.throws( () => parsePlaceQr(input, policy), input, ).
     * DÒNG `input,`: Khẳng định kết quả thử nghiệm bằng assert.throws( () => parsePlaceQr(input, policy), input, ).
     * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    assert.throws(
      () => parsePlaceQr(input, policy),
      input,
    )
  }
})

// CHỨC NĂNG: Kiểm tra ID sau khi parse.
// XỬ LÝ: Đúng định dạng không có nghĩa địa điểm tồn tại.
// Khẳng định kết quả thử nghiệm bằng test('UC04/05: từ chối ID không tồn tại', async () => { const id = parsePlaceQr( 'hueguide://places/not-a-real-site', po.
test('UC04/05: từ chối ID không tồn tại', async () => {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const id = parsePlaceQr(`: Khai báo id: Gọi parsePlaceQr( 'hueguide://places/not-a-real-site', policy, ).
   * DÒNG `'hueguide://places/not-a-real-site',`: Khai báo id: Gọi parsePlaceQr( 'hueguide://places/not-a-real-site', policy, ).
   * DÒNG `policy,`: Khai báo id: Gọi parsePlaceQr( 'hueguide://places/not-a-real-site', policy, ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  const id = parsePlaceQr(
    'hueguide://places/not-a-real-site',
    policy,
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `await assert.rejects(`: Khẳng định kết quả thử nghiệm bằng await assert.rejects( createCatalog(loadMockCatalog).get(id), (error) => error instanceof CatalogError, ).
   * DÒNG `createCatalog(loadMockCatalog).get(id),`: Khẳng định kết quả thử nghiệm bằng await assert.rejects( createCatalog(loadMockCatalog).get(id), (error) => error instanceof CatalogError, ).
   * DÒNG `(error) => error instanceof CatalogError,`: Khẳng định kết quả thử nghiệm bằng await assert.rejects( createCatalog(loadMockCatalog).get(id), (error) => error instanceof CatalogError, ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  await assert.rejects(
    createCatalog(loadMockCatalog).get(id),
    (error) => error instanceof CatalogError,
  )
})
// CHỨC NĂNG: Kiểm tra QR chung theo UC05 v1.3.
// XỬ LÝ: Root và /places hợp lệ; đường dẫn lạ vẫn bị từ chối.
// Khẳng định kết quả thử nghiệm bằng test('UC05 v1.3: QR vào chung mở trang chủ', () => { assert.deepEqual( parseQrTarget('https://hue-guide.example/', polic.
test('UC05 v1.3: QR vào chung mở trang chủ', () => {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.deepEqual(`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( parseQrTarget('https://hue-guide.example/', policy), { kind: 'home' }, ).
   * DÒNG `parseQrTarget('https://hue-guide.example/', policy),`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( parseQrTarget('https://hue-guide.example/', policy), { kind: 'home' }, ).
   * DÒNG `{ kind: 'home' },`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( parseQrTarget('https://hue-guide.example/', policy), { kind: 'home' }, ). | Gán thuộc tính kind: chuỗi 'home'.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  assert.deepEqual(
    parseQrTarget('https://hue-guide.example/', policy),
    { kind: 'home' },
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.deepEqual(`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( parseQrTarget('https://hue-guide.example/places', policy), { kind: 'home' }, ).
   * DÒNG `parseQrTarget('https://hue-guide.example/places', policy),`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( parseQrTarget('https://hue-guide.example/places', policy), { kind: 'home' }, ).
   * DÒNG `{ kind: 'home' },`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( parseQrTarget('https://hue-guide.example/places', policy), { kind: 'home' }, ). | Gán thuộc tính kind: chuỗi 'home'.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  assert.deepEqual(
    parseQrTarget('https://hue-guide.example/places', policy),
    { kind: 'home' },
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.deepEqual(`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( parseQrTarget('hueguide://places', policy), { kind: 'home' }, ).
   * DÒNG `parseQrTarget('hueguide://places', policy),`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( parseQrTarget('hueguide://places', policy), { kind: 'home' }, ).
   * DÒNG `{ kind: 'home' },`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( parseQrTarget('hueguide://places', policy), { kind: 'home' }, ). | Gán thuộc tính kind: chuỗi 'home'.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  assert.deepEqual(
    parseQrTarget('hueguide://places', policy),
    { kind: 'home' },
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.throws(() => parseQrTarget(`: Khẳng định kết quả thử nghiệm bằng assert.throws(() => parseQrTarget( 'https://hue-guide.example/other', policy, )).
   * DÒNG `'https://hue-guide.example/other',`: Khẳng định kết quả thử nghiệm bằng assert.throws(() => parseQrTarget( 'https://hue-guide.example/other', policy, )).
   * DÒNG `policy,`: Khẳng định kết quả thử nghiệm bằng assert.throws(() => parseQrTarget( 'https://hue-guide.example/other', policy, )).
   * DÒNG `))`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.throws(() => parseQrTarget(
    'https://hue-guide.example/other',
    policy,
  ))
})

// CHỨC NĂNG: Kiểm tra đa danh mục và đúng ngôn ngữ.
// XỬ LÝ: OR trong danh mục, AND với khu vực.
// Khẳng định kết quả thử nghiệm bằng test('UC03: danh mục, khu vực và tìm theo ngôn ngữ', () => { const options = { language: 'vi', query: '', zone: null, or.
test('UC03: danh mục, khu vực và tìm theo ngôn ngữ', () => {
  // Khai báo options: tạo object gồm language, query, zone, order, categories.
  const options = {
    // Gán thuộc tính language: chuỗi 'vi'.
    language: 'vi',
    // Gán thuộc tính query: chuỗi ''.
    query: '',
    // Gán thuộc tính zone: sử dụng null làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    zone: null,
    // Gán thuộc tính order: chuỗi 'name'.
    order: 'name',
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `categories: ['gate', 'temple'],`: Gán thuộc tính categories: tạo mảng ['gate', 'temple'].
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    categories: ['gate', 'temple'],
  }

  // Khai báo matches: Gọi selectPlaces(MOCK_PLACES, options).
  const matches = selectPlaces(MOCK_PLACES, options)
  // Khẳng định kết quả thử nghiệm bằng assert.equal(matches.length, 3).
  assert.equal(matches.length, 3)

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces(MOCK_PLACES, { ...options, zones: ['fortifications'], }).length, 1, ).
   * DÒNG `selectPlaces(MOCK_PLACES, {`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces(MOCK_PLACES, { ...options, zones: ['fortifications'], }).length, 1, ).
   * DÒNG `...options,`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces(MOCK_PLACES, { ...options, zones: ['fortifications'], }).length, 1, ).
   */
  assert.equal(
    selectPlaces(MOCK_PLACES, {
      ...options,
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `zones: ['fortifications'],`: Gán thuộc tính zones: tạo mảng ['fortifications'].
       * DÒNG `}).length,`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces(MOCK_PLACES, { ...options, zones: ['fortifications'], }).length, 1, ).
       * DÒNG `1,`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces(MOCK_PLACES, { ...options, zones: ['fortifications'], }).length, 1, ).
       * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
       */
      zones: ['fortifications'],
    }).length,
    1,
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.ok(`: Khẳng định kết quả thử nghiệm bằng assert.ok( selectPlaces(MOCK_PLACES, { ...options, categories: [], query: 'cung dien', }).length > 0, ).
   * DÒNG `selectPlaces(MOCK_PLACES, {`: Khẳng định kết quả thử nghiệm bằng assert.ok( selectPlaces(MOCK_PLACES, { ...options, categories: [], query: 'cung dien', }).length > 0, ).
   * DÒNG `...options,`: Khẳng định kết quả thử nghiệm bằng assert.ok( selectPlaces(MOCK_PLACES, { ...options, categories: [], query: 'cung dien', }).length > 0, ).
   */
  assert.ok(
    selectPlaces(MOCK_PLACES, {
      ...options,
      // Gán thuộc tính categories: tạo mảng [].
      categories: [],
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `query: 'cung dien',`: Gán thuộc tính query: chuỗi 'cung dien'.
       * DÒNG `}).length > 0,`: Khẳng định kết quả thử nghiệm bằng assert.ok( selectPlaces(MOCK_PLACES, { ...options, categories: [], query: 'cung dien', }).length > 0, ).
       * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
       */
      query: 'cung dien',
    }).length > 0,
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces(MOCK_PLACES, { ...options, categories: [], language: 'en', query: 'cung dien', }).length, 0,.
   * DÒNG `selectPlaces(MOCK_PLACES, {`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces(MOCK_PLACES, { ...options, categories: [], language: 'en', query: 'cung dien', }).length, 0,.
   * DÒNG `...options,`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces(MOCK_PLACES, { ...options, categories: [], language: 'en', query: 'cung dien', }).length, 0,.
   */
  assert.equal(
    selectPlaces(MOCK_PLACES, {
      ...options,
      // Gán thuộc tính categories: tạo mảng [].
      categories: [],
      // Gán thuộc tính language: chuỗi 'en'.
      language: 'en',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `query: 'cung dien',`: Gán thuộc tính query: chuỗi 'cung dien'.
       * DÒNG `}).length,`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces(MOCK_PLACES, { ...options, categories: [], language: 'en', query: 'cung dien', }).length, 0,.
       * DÒNG `0,`: Khẳng định kết quả thử nghiệm bằng assert.equal( selectPlaces(MOCK_PLACES, { ...options, categories: [], language: 'en', query: 'cung dien', }).length, 0,.
       * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
       */
      query: 'cung dien',
    }).length,
    0,
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.ok(`: Khẳng định kết quả thử nghiệm bằng assert.ok( selectPlaces(MOCK_PLACES, { ...options, categories: [], language: 'en', query: 'palaces', }).length > 0, ).
   * DÒNG `selectPlaces(MOCK_PLACES, {`: Khẳng định kết quả thử nghiệm bằng assert.ok( selectPlaces(MOCK_PLACES, { ...options, categories: [], language: 'en', query: 'palaces', }).length > 0, ).
   * DÒNG `...options,`: Khẳng định kết quả thử nghiệm bằng assert.ok( selectPlaces(MOCK_PLACES, { ...options, categories: [], language: 'en', query: 'palaces', }).length > 0, ).
   */
  assert.ok(
    selectPlaces(MOCK_PLACES, {
      ...options,
      // Gán thuộc tính categories: tạo mảng [].
      categories: [],
      // Gán thuộc tính language: chuỗi 'en'.
      language: 'en',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `query: 'palaces',`: Gán thuộc tính query: chuỗi 'palaces'.
       * DÒNG `}).length > 0,`: Khẳng định kết quả thử nghiệm bằng assert.ok( selectPlaces(MOCK_PLACES, { ...options, categories: [], language: 'en', query: 'palaces', }).length > 0, ).
       * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
       * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      query: 'palaces',
    }).length > 0,
  )
})
// CHỨC NĂNG: Mỗi điểm phải có đúng ảnh, nguồn/giấy phép và asset hai nền tảng.
// Khẳng định kết quả thử nghiệm bằng test('UC02/04: đủ ảnh đóng gói và nguồn cho tám địa điểm', () => { const fs = require('node:fs'), path = require('node:p.
test('UC02/04: đủ ảnh đóng gói và nguồn cho tám địa điểm', () => {
  // Khai báo fs: require nạp module 'node:fs' để dùng chức năng có sẵn thay vì chép lại | Khai báo path: require nạp module 'node:path' để dùng chức năng có sẵn thay vì chép lại.
  const fs = require('node:fs'), path = require('node:path')
  // Khai báo { PLACE_PHOTOS }: require nạp module '../.test-build/data/photos.js' để dùng chức năng có sẵn thay vì chép lại.
  const { PLACE_PHOTOS } = require('../.test-build/data/photos.js')
  // Khai báo { MOCK_PLACES }: require nạp module '../.test-build/data/mock.js' để dùng chức năng có sẵn thay vì chép lại.
  const { MOCK_PLACES } = require('../.test-build/data/mock.js')
  // Khẳng định kết quả thử nghiệm bằng assert.equal(MOCK_PLACES.length, 8).
  assert.equal(MOCK_PLACES.length, 8)
  // Duyệt lần lượt MOCK_PLACES bằng const place.
  for (const place of MOCK_PLACES) {
    // Khai báo photo: đọc PLACE_PHOTOS[place.id] từ đối tượng/mảng để dùng tại bước hiện tại.
    const photo = PLACE_PHOTOS[place.id]
    // Khẳng định kết quả thử nghiệm bằng assert.deepEqual(place.images, ['photo:' + place.id]).
    assert.deepEqual(place.images, ['photo:' + place.id])
    // Khẳng định kết quả thử nghiệm bằng assert.ok(photo.author && photo.license && photo.url.startsWith('https://commons.wikimedia.org/')).
    assert.ok(photo.author && photo.license && photo.url.startsWith('https://commons.wikimedia.org/'))
    // Khai báo web: Gọi fs.readFileSync(path.join(__dirname, '../../../apps/web/static/images/places', place.id +.
    const web = fs.readFileSync(path.join(__dirname, '../../../apps/web/static/images/places', place.id + '.jpg'))
    // Khai báo native: Gọi fs.readFileSync(path.join(__dirname, '../../../apps/mobile/assets/places', place.id + '.jp.
    const native = fs.readFileSync(path.join(__dirname, '../../../apps/mobile/assets/places', place.id + '.jpg'))
    // Khẳng định kết quả thử nghiệm bằng assert.deepEqual(web, native).
    assert.deepEqual(web, native)
    // Khẳng định kết quả thử nghiệm bằng assert.ok(web.length > 1000).
    assert.ok(web.length > 1000)
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `assert.equal(web[0], 0xff); assert.equal(web[1], 0xd8)`: Khẳng định kết quả thử nghiệm bằng assert.equal(web[0], 0xff). | Khẳng định kết quả thử nghiệm bằng assert.equal(web[1], 0xd8).
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    assert.equal(web[0], 0xff); assert.equal(web[1], 0xd8)
  }
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.ok(PLACE_PHOTOS['dien-can-chanh'].note.vi.includes('2015'))`: Khẳng định kết quả thử nghiệm bằng assert.ok(PLACE_PHOTOS['dien-can-chanh'].note.vi.includes('2015')).
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.ok(PLACE_PHOTOS['dien-can-chanh'].note.vi.includes('2015'))
})

// CHỨC NĂNG: Cô lập dữ liệu ngôn ngữ, tránh phụ thuộc tên riêng trùng phiên âm.
// Khẳng định kết quả thử nghiệm bằng test('UC03: không tìm sang bản Việt khi đang chọn Anh',()=>{ const p=JSON.parse(JSON.stringify(MOCK_PLACES[0])) p.conten.
test('UC03: không tìm sang bản Việt khi đang chọn Anh',()=>{
 // Khai báo p: JSON.parse chuyển chuỗi sang dữ liệu.
 const p=JSON.parse(JSON.stringify(MOCK_PLACES[0]))
 // Thực hiện tính biểu thức p.content.vi={...p.content.vi,title:'Bí mật Việt',summary:'',address:'',body:'Mật khẩu riê. | Gán thuộc tính title: chuỗi 'Bí mật Việt'. | Gán thuộc tính summary: chuỗi ''. | Gán thuộc tính address: chuỗi ''. | Gán thuộc tính body: chuỗi 'Mật khẩu riêng'.
 p.content.vi={...p.content.vi,title:'Bí mật Việt',summary:'',address:'',body:'Mật khẩu riêng'}
 // Thực hiện tính biểu thức p.content.en={...p.content.en,title:'English only',summary:'',address:'',body:'An English. | Gán thuộc tính title: chuỗi 'English only'. | Gán thuộc tính summary: chuỗi ''. | Gán thuộc tính address: chuỗi ''. | Gán thuộc tính body: chuỗi 'An English description'.
 p.content.en={...p.content.en,title:'English only',summary:'',address:'',body:'An English description'}
 // Khai báo options: tạo object gồm language, query, zone, order. | Gán thuộc tính language: chuỗi 'en'. | Gán thuộc tính query: chuỗi 'bí mật'. | Gán thuộc tính zone: sử dụng null làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính order: chuỗi 'name'.
 const options={language:'en',query:'bí mật',zone:null,order:'name'}
 // Khẳng định kết quả thử nghiệm bằng assert.equal(selectPlaces([p],options).length,0).
 assert.equal(selectPlaces([p],options).length,0)
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `assert.equal(selectPlaces([p],{...options,language:'vi'}).length,1)`: Khẳng định kết quả thử nghiệm bằng assert.equal(selectPlaces([p],{...options,language:'vi'}).length,1). | Gán thuộc tính language: chuỗi 'vi'.
  * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 assert.equal(selectPlaces([p],{...options,language:'vi'}).length,1)
})
