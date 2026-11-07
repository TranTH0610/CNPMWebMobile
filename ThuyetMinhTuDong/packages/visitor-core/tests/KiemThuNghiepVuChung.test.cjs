/**
 * CHỨC NĂNG: [KIEM-THU]
 * VAI TRÒ: KIỂM THỬ
 *
 * FILE NÀY LÀM GÌ:
 * Kiểm tra lọc công bố, ngôn ngữ, QR, tìm kiếm và dữ liệu du khách.
 *
 * VỊ TRÍ: packages/visitor-core/tests/KiemThuNghiepVuChung.test.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - Điểm vào/cấu hình/bộ test hoặc nơi dùng qua package; xem docs/BanDoChucNang.md.
 *
 * PHỤ THUỘC:
 * - node:test
 * - node:assert/strict
 * - ../.test-build/catalog/DanhMucDiTich.js
 * - ../.test-build/data/DuLieuKhoiTao.js
 * - ../.test-build/domain/KieuDuLieuDuKhach.js
 * - ../.test-build/catalog/TimKiemVaBoLoc.js
 * - ../.test-build/links/PhanTichLienKetQR.js
 * - ../.test-build/i18n/BanDichGiaoDien.js
 * - node:fs
 * - node:path
 * - ../.test-build/data/DanhMucAnh.js
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Phát hiện lỗi bằng kiểm thử lặp lại mà không cần thao tác thủ công toàn bộ luồng.
 */
// Khai báo { test }: require nạp module 'node:test' để dùng chức năng có sẵn thay vì chép lại.
const { test } = require('node:test')
// Khai báo assert: require nạp module 'node:assert/strict' để dùng chức năng có sẵn thay vì chép lại.
const assert = require('node:assert/strict')


const {
  createCatalog,
  publishedText,
  availableLanguages,
  CatalogError,
} = require('../.test-build/catalog/DanhMucDiTich.js')


const {
  MOCK_PLACES,
  loadMockCatalog,
} = require('../.test-build/data/DuLieuKhoiTao.js')

// Khai báo { languageOf }: require nạp module '../.test-build/domain/KieuDuLieuDuKhach.js' để dùng chức năng có sẵn thay vì chép lại.
const { languageOf } = require('../.test-build/domain/KieuDuLieuDuKhach.js')


const {
  normalize,
  selectPlaces,
  paginate,
  distanceTo,
} = require('../.test-build/catalog/TimKiemVaBoLoc.js')


const {
  parsePlaceQr,
  parseQrTarget,
  placeUrl,
} = require('../.test-build/links/PhanTichLienKetQR.js')

// Khai báo { messages }: require nạp module '../.test-build/i18n/BanDichGiaoDien.js' để dùng chức năng có sẵn thay vì chép lại.
const { messages } = require('../.test-build/i18n/BanDichGiaoDien.js')

// Khai báo policy: tạo object gồm allowedOrigins, allowHttp.
const policy = {
  // Gán thuộc tính allowedOrigins: tạo mảng ['https://hue-guide.example'].
  allowedOrigins: ['https://hue-guide.example'],
  
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

  
  assert.equal(
    languageOf('en') ?? languageOf('ja') ?? 'vi',
    'en',
  )

  // Duyệt lần lượt ['en', 'cn', 'pt', 'ja'] bằng const language.
  for (const language of ['en', 'cn', 'pt', 'ja']) {
    
    assert.deepEqual(
      Object.keys(messages[language]).sort(),
      Object.keys(messages.vi).sort(),
    )
  }

  // Khẳng định kết quả thử nghiệm bằng assert.equal(messages.cn.explore, '探索').
  assert.equal(messages.cn.explore, '探索')
  
  assert.equal(messages.pt.explore, 'Explorar')
})

// CHỨC NĂNG: Kiểm tra phạm vi và trạng thái công bố.
// XỬ LÝ: Tạo dữ liệu ngoài phạm vi, nháp và chưa triển khai để thử loại bỏ.
// Khẳng định kết quả thử nghiệm bằng test('UC02/04: chỉ trả dữ liệu được công bố', async () => { const base = MOCK_PLACES[0] const records = [ base, { ...bas.
test('UC02/04: chỉ trả dữ liệu được công bố', async () => {
  // Khai báo base: đọc MOCK_PLACES[0] từ đối tượng/mảng để dùng tại bước hiện tại.
  const base = MOCK_PLACES[0]

  
  const records = [
    base,
    {
      ...base,
      // Gán thuộc tính id: chuỗi 'outside'.
      id: 'outside',
      
      scope: 'ha-noi',
    },
    {
      ...base,
      // Gán thuộc tính id: chuỗi 'draft-point'.
      id: 'draft-point',
      
      status: 'draft',
    },
    {
      ...base,
      // Gán thuộc tính id: chuỗi 'unlisted'.
      id: 'unlisted',
      
      inLaunchCatalog: false,
    },
    {
      ...base,
      // Gán thuộc tính id: chuỗi 'draft-text'.
      id: 'draft-text',
      // Gán thuộc tính content: tạo object gồm vi.
      content: {
        
        vi: {
          ...base.content.vi,
          
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
        
        en: {
          ...base.content.en,
          
          status: 'draft',
        },
      },
    },
  ]

  // Khai báo catalog: Gọi createCatalog(async () => records).
  const catalog = createCatalog(async () => records)

  
  assert.deepEqual(
    (await catalog.list()).map((place) => place.id),
    ['ky-dai', 'mixed'],
  )

  
  assert.equal(
    (await catalog.get('mixed')).content.en,
    undefined,
  )

  
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

  
  assert.equal(
    publishedText({
      ...base,
      // Gán thuộc tính content: tạo object gồm vi.
      content: {
        
        vi: {
          ...base.content.vi,
          
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
    
    order: 'name',
  }

  
  assert.deepEqual(
    selectPlaces(MOCK_PLACES, options)
      .map((place) => place.id),
    ['dien-thai-hoa', 'ky-dai', 'ngo-mon'],
  )

  
  assert.equal(
    selectPlaces(MOCK_PLACES, {
      ...options,
      
      query: '   ',
    }).length,
    MOCK_PLACES.length,
  )

  
  assert.equal(
    selectPlaces(MOCK_PLACES, {
      ...options,
      
      query: 'zzzzz',
    }).length,
    0,
  )

  
  assert.equal(
    selectPlaces(MOCK_PLACES, {
      ...options,
      // Gán thuộc tính query: chuỗi ''.
      query: '',
      
      zone: 'ceremonial',
    }).length,
    MOCK_PLACES.filter((place) => place.zone === 'ceremonial').length,
  )

  
  assert.equal(
    selectPlaces(MOCK_PLACES, {
      ...options,
      // Gán thuộc tính language: chuỗi 'en'.
      language: 'en',
      
      query: 'lễ đăng quang',
    }).length,
    0,
  )

 // CHỨC NĂNG: Kiểm tra các điểm demo đủ năm bản ngôn ngữ.
// XỬ LÝ: Dùng dữ liệu visitor-core có trường content.
// Duyệt lần lượt MOCK_PLACES bằng const place.
for (const place of MOCK_PLACES) {
  
  assert.deepEqual(
    availableLanguages(place),
    ['vi', 'en', 'cn', 'pt', 'ja'],
  )
}

// CHỨC NĂNG: Vẫn kiểm tra trường hợp thiếu bản Nhật.
// XỬ LÝ: Tạo bản sao riêng, không sửa dữ liệu mock gốc.

const incompletePlace = {
  ...MOCK_PLACES[2],
  
  content: {
    ...MOCK_PLACES[2].content,
  },
}

// Thực hiện sử dụng delete incompletePlace.content.ja làm giá trị của bước hiện tại.
delete incompletePlace.content.ja


assert.equal(
  publishedText(incompletePlace, 'ja'),
  undefined,
)


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
    
    order: 'name',
  }

  
  assert.deepEqual(
    selectPlaces(
      MOCK_PLACES,
      options,
    ).map(
      (place) => place.id,
    ),
    ['dien-thai-hoa', 'ky-dai', 'ngo-mon'],
  )

  
  assert.equal(
    selectPlaces(
      MOCK_PLACES,
      {
        ...options,
        
        query: '   ',
      },
    ).length,
    MOCK_PLACES.length,
  )

  
  assert.equal(
    selectPlaces(
      MOCK_PLACES,
      {
        ...options,
        
        query: 'zzzzz',
      },
    ).length,
    0,
  )

  
  assert.equal(
    selectPlaces(
      MOCK_PLACES,
      {
        ...options,
        // Gán thuộc tính query: chuỗi ''.
        query: '',
        
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
  
  assert.equal(
    selectPlaces(
      MOCK_PLACES,
      {
        ...options,
        // Gán thuộc tính language: chuỗi 'en'.
        language: 'en',
        
        query: 'lễ đăng quang',
      },
    ).length,
    0,
  )

  // Duyệt lần lượt MOCK_PLACES bằng const place.
  for (const place of MOCK_PLACES) {
    
    assert.deepEqual(
      availableLanguages(place),
      ['vi', 'en', 'cn', 'pt', 'ja'],
    )
  }

  // CHỨC NĂNG: Giả lập API chưa có bản Nhật.
  // XỬ LÝ: Không xóa trực tiếp trên MOCK_PLACES dùng cho test khác.
  
  const incompletePlace = {
    ...MOCK_PLACES[2],

    
    content: {
      ...MOCK_PLACES[2].content,
    },
  }

  // Thực hiện sử dụng delete incompletePlace.content.ja làm giá trị của bước hiện tại.
  delete incompletePlace.content.ja

  
  assert.equal(
    publishedText(
      incompletePlace,
      'ja',
    ),
    undefined,
  )

  
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
  
  assert.equal(
    parsePlaceQr(
      'https://hue-guide.example/places/ngo-mon',
      policy,
    ),
    'ngo-mon',
  )

  
  assert.equal(
    parsePlaceQr('hueguide://places/ngo-mon', policy),
    'ngo-mon',
  )

  
  assert.equal(
    placeUrl('https://hue-guide.example', 'ngo-mon'),
    'https://hue-guide.example/places/ngo-mon',
  )

  
  assert.equal(
    parsePlaceQr(
      'http://192.168.1.9:5173/places/ngo-mon',
      {
        // Gán thuộc tính allowedOrigins: tạo mảng ['http://192.168.1.9:5173'].
        allowedOrigins: ['http://192.168.1.9:5173'],
        
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
  
  const id = parsePlaceQr(
    'hueguide://places/not-a-real-site',
    policy,
  )

  
  await assert.rejects(
    createCatalog(loadMockCatalog).get(id),
    (error) => error instanceof CatalogError,
  )
})
// CHỨC NĂNG: Kiểm tra QR chung theo UC05 v1.3.
// XỬ LÝ: Root và /places hợp lệ; đường dẫn lạ vẫn bị từ chối.
// Khẳng định kết quả thử nghiệm bằng test('UC05 v1.3: QR vào chung mở trang chủ', () => { assert.deepEqual( parseQrTarget('https://hue-guide.example/', polic.
test('UC05 v1.3: QR vào chung mở trang chủ', () => {
  
  assert.deepEqual(
    parseQrTarget('https://hue-guide.example/', policy),
    { kind: 'home' },
  )

  
  assert.deepEqual(
    parseQrTarget('https://hue-guide.example/places', policy),
    { kind: 'home' },
  )

  
  assert.deepEqual(
    parseQrTarget('hueguide://places', policy),
    { kind: 'home' },
  )

  
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
    
    categories: ['gate', 'temple'],
  }

  // Khai báo matches: Gọi selectPlaces(MOCK_PLACES, options).
  const matches = selectPlaces(MOCK_PLACES, options)
  // Khẳng định kết quả thử nghiệm bằng assert.equal(matches.length, 3).
  assert.equal(matches.length, 3)

  
  assert.equal(
    selectPlaces(MOCK_PLACES, {
      ...options,
      
      zones: ['fortifications'],
    }).length,
    1,
  )

  
  assert.ok(
    selectPlaces(MOCK_PLACES, {
      ...options,
      // Gán thuộc tính categories: tạo mảng [].
      categories: [],
      
      query: 'cung dien',
    }).length > 0,
  )

  
  assert.equal(
    selectPlaces(MOCK_PLACES, {
      ...options,
      // Gán thuộc tính categories: tạo mảng [].
      categories: [],
      // Gán thuộc tính language: chuỗi 'en'.
      language: 'en',
      
      query: 'cung dien',
    }).length,
    0,
  )

  
  assert.ok(
    selectPlaces(MOCK_PLACES, {
      ...options,
      // Gán thuộc tính categories: tạo mảng [].
      categories: [],
      // Gán thuộc tính language: chuỗi 'en'.
      language: 'en',
      
      query: 'palaces',
    }).length > 0,
  )
})
// CHỨC NĂNG: Mỗi điểm phải có đúng ảnh, nguồn/giấy phép và asset hai nền tảng.
// Khẳng định kết quả thử nghiệm bằng test('UC02/04: đủ ảnh đóng gói và nguồn cho tám địa điểm', () => { const fs = require('node:fs'), path = require('node:p.
test('UC02/04: đủ ảnh đóng gói và nguồn cho tám địa điểm', () => {
  // Khai báo fs: require nạp module 'node:fs' để dùng chức năng có sẵn thay vì chép lại | Khai báo path: require nạp module 'node:path' để dùng chức năng có sẵn thay vì chép lại.
  const fs = require('node:fs'), path = require('node:path')
  // Khai báo { PLACE_PHOTOS }: require nạp module '../.test-build/data/DanhMucAnh.js' để dùng chức năng có sẵn thay vì chép lại.
  const { PLACE_PHOTOS } = require('../.test-build/data/DanhMucAnh.js')
  // Khai báo { MOCK_PLACES }: require nạp module '../.test-build/data/DuLieuKhoiTao.js' để dùng chức năng có sẵn thay vì chép lại.
  const { MOCK_PLACES } = require('../.test-build/data/DuLieuKhoiTao.js')
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
    
    assert.equal(web[0], 0xff); assert.equal(web[1], 0xd8)
  }
  
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
 
 assert.equal(selectPlaces([p],{...options,language:'vi'}).length,1)
})
