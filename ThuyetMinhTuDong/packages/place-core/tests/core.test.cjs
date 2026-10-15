/**
 * FILE NÀY LÀM GÌ:
 * Kiểm tra bỏ dấu, tìm kiếm, danh mục, sắp xếp và service.
 *
 * Được gọi bởi:
 * - npm run test --workspace=@travelguide/place-core
 *
 * Phụ thuộc:
 * - Bộ test có sẵn của Node.
 * - Kết quả biên dịch TypeScript trong .test-build.
 *
 * Liên quan: UC03, FR-38, FR-39.
 */

const { test } = require('node:test')
const assert = require('node:assert/strict')

const {
  normalize,
  searchPlaces,
  filterCategories,
  categoryCounts,
  shouldShowCategories,
  sortPlaces,
  createPlaceService,
} = require('../.test-build/place-core/src/index.js')

const {
  MOCK_PLACES,
  loadMockPlaces,
} = require('../.test-build/place-core/src/mockPlaces.js')

// CHỨC NĂNG: kiểm tra bỏ dấu và chữ Đ/đ.
// XỬ LÝ: kiểm tra cả chuỗi NFD, chuỗi rỗng và chữ Nhật.
test('normalize bỏ dấu và xử lý Đ/đ', () => {
  assert.equal(
    normalize('  ĐỐNG   ĐA Hà Nội  '),
    'dong da ha noi',
  )

  assert.equal(
    normalize('Hà Nội'.normalize('NFD')),
    'ha noi',
  )

  assert.equal(normalize(''), '')
  assert.equal(normalize('博物館'), '博物館')
})

// CHỨC NĂNG: kiểm tra tìm đủ bốn trường và đúng ngôn ngữ.
// XỬ LÝ: dùng dữ liệu riêng để chứng minh không tìm bản vi khi chọn en.
test('search tên, địa chỉ, mô tả và danh mục', () => {
  assert.ok(
    searchPlaces(MOCK_PLACES, 'ha noi', 'vi')
      .some((place) => place.id === '1'),
  )

  assert.ok(
    searchPlaces(MOCK_PLACES, 'DONG XUAN', 'vi')
      .some((place) => place.id === '6'),
  )

  assert.ok(
    searchPlaces(MOCK_PLACES, 'tra guom', 'vi')
      .some((place) => place.id === '4'),
  )

  assert.deepEqual(
    searchPlaces(MOCK_PLACES, 'bao tang', 'vi')
      .map((place) => place.id),
    ['5'],
  )

  assert.ok(
    searchPlaces(MOCK_PLACES, 'museum', 'en')
      .some((place) => place.id === '5'),
  )

  const isolated = [
    {
      id: 'language',
      name: {
        vi: 'Địa điểm bí mật',
        en: 'Hidden spot',
      },
      description: {
        vi: 'Chỉ tiếng Việt',
        en: 'English only',
      },
    },
  ]

  assert.equal(
    searchPlaces(isolated, 'dia diem', 'en').length,
    0,
  )

  assert.equal(
    searchPlaces(isolated, 'hidden', 'en').length,
    1,
  )

  assert.equal(
    searchPlaces(MOCK_PLACES, 'zzzz', 'vi').length,
    0,
  )

  assert.equal(
    searchPlaces(MOCK_PLACES, '   ', 'vi').length,
    MOCK_PLACES.length,
  )
})

// CHỨC NĂNG: kiểm tra lọc, thống kê và dữ liệu cũ.
// XỬ LÝ: dữ liệu cũ không có metadata vẫn phải tìm được.
test('lọc và ngưỡng hiển thị danh mục', () => {
  assert.equal(
    filterCategories(MOCK_PLACES, []).length,
    8,
  )

  assert.equal(
    filterCategories(
      MOCK_PLACES,
      ['landscape'],
    ).length,
    2,
  )

  assert.equal(
    categoryCounts(MOCK_PLACES).landscape,
    2,
  )

  assert.equal(
    shouldShowCategories(MOCK_PLACES),
    true,
  )

  assert.equal(
    shouldShowCategories(
      filterCategories(
        MOCK_PLACES,
        ['landscape'],
      ),
    ),
    false,
  )

  assert.equal(
    shouldShowCategories([]),
    false,
  )

  const oldPlace = {
    id: 'old',
    name: {
      vi: 'Cũ',
    },
    description: {
      vi: 'Mô tả',
    },
  }

  assert.equal(
    searchPlaces([oldPlace], 'cu', 'vi').length,
    1,
  )
})

// CHỨC NĂNG: kiểm tra fallback khi chưa có vị trí.
// XỬ LÝ: dùng hàm khoảng cách giả để không cần GPS trong test.
test('sort không vị trí theo tên; có vị trí theo khoảng cách', () => {
  const places = [
    {
      id: 'b',
      name: { vi: 'B' },
      description: { vi: '' },
      rating: 5,
    },
    {
      id: 'a',
      name: { vi: 'A' },
      description: { vi: '' },
      rating: 4,
      location: {
        lat: 1,
        lng: 0,
      },
    },
    {
      id: 'c',
      name: { vi: 'C' },
      description: { vi: '' },
      location: {
        lat: 2,
        lng: 0,
      },
    },
  ]

  assert.deepEqual(
    sortPlaces(places, {
      order: 'nearest',
      language: 'vi',
    }).map((place) => place.id),
    ['a', 'b', 'c'],
  )

  assert.deepEqual(
    sortPlaces(places, {
      order: 'rating',
      language: 'vi',
    }).map((place) => place.id),
    ['b', 'a', 'c'],
  )

  let distanceCalls = 0

  const sortedByDistance = sortPlaces(places, {
    order: 'nearest',
    language: 'vi',
    origin: {
      lat: 0,
      lng: 0,
    },
    distanceMeters: (_origin, destination) => {
      distanceCalls += 1
      return destination.lat
    },
  })

  assert.deepEqual(
    sortedByDistance.map((place) => place.id),
    ['a', 'c', 'b'],
  )

  // Chỉ hai địa điểm có tọa độ nên chỉ đo hai lần.
  assert.equal(distanceCalls, 2)

  // Mảng đầu vào không bị đổi thứ tự.
  assert.deepEqual(
    places.map((place) => place.id),
    ['b', 'a', 'c'],
  )
})

// CHỨC NĂNG: kiểm tra bổ sung bản dịch, lỗi và tính bất biến.
// XỬ LÝ: resolver giả thay API để test không phụ thuộc mạng.
test('service bổ sung bản dịch; không sửa mock; lỗi được truyền lên', async () => {
  const service = createPlaceService(
    loadMockPlaces,
    async (_text, _language, key) => {
      if (key.includes('|name|')) {
        return 'Bat Trang Pottery Village'
      }

      return 'Pottery in Hanoi'
    },
  )

  const localized = await service.list('en')

  assert.ok(
    searchPlaces(localized, 'pottery', 'en')
      .some((place) => place.id === '7'),
  )

  assert.equal(
    MOCK_PLACES.find(
      (place) => place.id === '7',
    ).name.en,
    undefined,
  )

  const failedSource = createPlaceService(
    async () => {
      throw new Error('offline')
    },
  )

  await assert.rejects(
    failedSource.list(),
    /offline/,
  )

  const failedTranslation = createPlaceService(
    loadMockPlaces,
    async () => {
      throw new Error('translate failed')
    },
  )

  await assert.rejects(
    failedTranslation.list('en'),
    /translate failed/,
  )

  const copy = await loadMockPlaces()

  copy[0].name.vi = 'Đã sửa'

  assert.notEqual(
    MOCK_PLACES[0].name.vi,
    'Đã sửa',
  )
})