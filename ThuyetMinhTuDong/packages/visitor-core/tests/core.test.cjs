/**
 * FILE NÀY LÀM GÌ:
 * Kiểm tra logic UC01–UC05 bằng Node, không cần điện thoại.
 * Script test gọi sau khi TypeScript biên dịch vào .test-build.
 * Phụ thuộc node:test, assert và code logic đã biên dịch.
 */

const { test } = require('node:test')
const assert = require('node:assert/strict')

const {
  createCatalog,
  publishedText,
  availableLanguages,
  CatalogError,
} = require('../.test-build/catalog/catalog.js')

const {
  MOCK_PLACES,
  loadMockCatalog,
} = require('../.test-build/data/mock.js')

const { languageOf } = require('../.test-build/domain/model.js')

const {
  normalize,
  selectPlaces,
  paginate,
  distanceTo,
} = require('../.test-build/catalog/search.js')

const {
  parsePlaceQr,
  parseQrTarget,
  placeUrl,
} = require('../.test-build/links/qr.js')

const { messages } = require('../.test-build/i18n/messages.js')

const policy = {
  allowedOrigins: ['https://hue-guide.example'],
  allowHttp: false,
}

// CHỨC NĂNG: Kiểm tra mã ngôn ngữ và bộ khóa.
// XỬ LÝ: Bắt nhầm cn/pt và thiếu key giữa các resource.
test('UC01: ánh xạ mã và đủ khóa UI', () => {
  assert.equal(languageOf('zh-Hans-CN'), 'cn')
  assert.equal(languageOf('pt_BR'), 'pt')
  assert.equal(languageOf('JA-jp'), 'ja')
  assert.equal(languageOf('fr'), null)

  assert.equal(
    languageOf('en') ?? languageOf('ja') ?? 'vi',
    'en',
  )

  for (const language of ['en', 'cn', 'pt', 'ja']) {
    assert.deepEqual(
      Object.keys(messages[language]).sort(),
      Object.keys(messages.vi).sort(),
    )
  }

  assert.equal(messages.cn.explore, '探索')
  assert.equal(messages.pt.explore, 'Explorar')
})

// CHỨC NĂNG: Kiểm tra phạm vi và trạng thái công bố.
// XỬ LÝ: Tạo dữ liệu ngoài phạm vi, nháp và chưa triển khai để thử loại bỏ.
test('UC02/04: chỉ trả dữ liệu được công bố', async () => {
  const base = MOCK_PLACES[0]

  const records = [
    base,
    {
      ...base,
      id: 'outside',
      scope: 'ha-noi',
    },
    {
      ...base,
      id: 'draft-point',
      status: 'draft',
    },
    {
      ...base,
      id: 'unlisted',
      inLaunchCatalog: false,
    },
    {
      ...base,
      id: 'draft-text',
      content: {
        vi: {
          ...base.content.vi,
          status: 'approved',
        },
      },
    },
    {
      ...base,
      id: 'mixed',
      content: {
        vi: base.content.vi,
        en: {
          ...base.content.en,
          status: 'draft',
        },
      },
    },
  ]

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

  const copy = await catalog.get('ky-dai')
  copy.content.vi.title = 'changed'

  assert.notEqual(base.content.vi.title, 'changed')

  assert.equal(
    publishedText({
      ...base,
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
test('UC03: tìm kiếm và lọc', () => {
  assert.equal(
    normalize('  ĐIỆN  Thái Hòa '),
    'dien thai hoa',
  )

  const options = {
    language: 'vi',
    query: 'ngo mon',
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
      query: '',
      zone: 'ceremonial',
    }).length,
    MOCK_PLACES.filter((place) => place.zone === 'ceremonial').length,
  )

  assert.equal(
    selectPlaces(MOCK_PLACES, {
      ...options,
      language: 'en',
      query: 'lễ đăng quang',
    }).length,
    0,
  )

 // CHỨC NĂNG: Kiểm tra các điểm demo đủ năm bản ngôn ngữ.
// XỬ LÝ: Dùng dữ liệu visitor-core có trường content.
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
test('UC03: tìm kiếm và lọc', () => {
  assert.equal(
    normalize('  ĐIỆN  Thái Hòa '),
    'dien thai hoa',
  )

  const options = {
    language: 'vi',
    query: 'ngo mon',
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
        language: 'en',
        query: 'lễ đăng quang',
      },
    ).length,
    0,
  )

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
        allowedOrigins: ['http://192.168.1.9:5173'],
        allowHttp: true,
      },
    ),
    'ngo-mon',
  )
})

// CHỨC NĂNG: Kiểm tra QR sai.
// XỬ LÝ: Từ chối domain giả, query, credentials và đường dẫn bất thường.
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

  for (const input of inputs) {
    assert.throws(
      () => parsePlaceQr(input, policy),
      input,
    )
  }
})

// CHỨC NĂNG: Kiểm tra ID sau khi parse.
// XỬ LÝ: Đúng định dạng không có nghĩa địa điểm tồn tại.
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
test('UC03: danh mục, khu vực và tìm theo ngôn ngữ', () => {
  const options = {
    language: 'vi',
    query: '',
    zone: null,
    order: 'name',
    categories: ['gate', 'temple'],
  }

  const matches = selectPlaces(MOCK_PLACES, options)
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
      categories: [],
      query: 'cung dien',
    }).length > 0,
  )

  assert.equal(
    selectPlaces(MOCK_PLACES, {
      ...options,
      categories: [],
      language: 'en',
      query: 'cung dien',
    }).length,
    0,
  )

  assert.ok(
    selectPlaces(MOCK_PLACES, {
      ...options,
      categories: [],
      language: 'en',
      query: 'palaces',
    }).length > 0,
  )
})
// CHỨC NĂNG: Mỗi điểm phải có đúng ảnh, nguồn/giấy phép và asset hai nền tảng.
test('UC02/04: đủ ảnh đóng gói và nguồn cho tám địa điểm', () => {
  const fs = require('node:fs'), path = require('node:path')
  const { PLACE_PHOTOS } = require('../.test-build/data/photos.js')
  const { MOCK_PLACES } = require('../.test-build/data/mock.js')
  assert.equal(MOCK_PLACES.length, 8)
  for (const place of MOCK_PLACES) {
    const photo = PLACE_PHOTOS[place.id]
    assert.deepEqual(place.images, ['photo:' + place.id])
    assert.ok(photo.author && photo.license && photo.url.startsWith('https://commons.wikimedia.org/'))
    const web = fs.readFileSync(path.join(__dirname, '../../../apps/web/static/images/places', place.id + '.jpg'))
    const native = fs.readFileSync(path.join(__dirname, '../../../apps/mobile/assets/places', place.id + '.jpg'))
    assert.deepEqual(web, native)
    assert.ok(web.length > 1000)
    assert.equal(web[0], 0xff); assert.equal(web[1], 0xd8)
  }
  assert.ok(PLACE_PHOTOS['dien-can-chanh'].note.vi.includes('2015'))
})

// CHỨC NĂNG: Cô lập dữ liệu ngôn ngữ, tránh phụ thuộc tên riêng trùng phiên âm.
test('UC03: không tìm sang bản Việt khi đang chọn Anh',()=>{
 const p=JSON.parse(JSON.stringify(MOCK_PLACES[0]))
 p.content.vi={...p.content.vi,title:'Bí mật Việt',summary:'',address:'',body:'Mật khẩu riêng'}
 p.content.en={...p.content.en,title:'English only',summary:'',address:'',body:'An English description'}
 const options={language:'en',query:'bí mật',zone:null,order:'name'}
 assert.equal(selectPlaces([p],options).length,0)
 assert.equal(selectPlaces([p],{...options,language:'vi'}).length,1)
})
