/**
 * CHỨC NĂNG: [KIEM-THU]
 * VAI TRÒ: KIỂM THỬ
 *
 * FILE NÀY LÀM GÌ:
 * Kiểm tra bỏ dấu tiếng Việt, tìm theo ngôn ngữ, danh mục, sắp xếp và service danh mục.
 *
 * VỊ TRÍ: packages/place-core/tests/KiemThuNghiepVuChung.test.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - Điểm vào/cấu hình/bộ test hoặc nơi dùng qua package; xem docs/BanDoChucNang.md.
 *
 * PHỤ THUỘC:
 * - node:test
 * - node:assert/strict
 * - ../.test-build/place-core/src/XuatCongKhai.js
 * - ../.test-build/place-core/src/data/DiTichMauKiemThu.js
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
  normalize,
  searchPlaces,
  filterCategories,
  categoryCounts,
  shouldShowCategories,
  sortPlaces,
  createPlaceService,
} = require('../.test-build/place-core/src/XuatCongKhai.js')


const {
  MOCK_PLACES,
  loadMockPlaces,
} = require('../.test-build/place-core/src/data/DiTichMauKiemThu.js')

// CHỨC NĂNG: Kiểm tra chuẩn hóa tiếng Việt.
// XỬ LÝ: Thử Đ/đ, khoảng trắng, NFD, chuỗi rỗng và chữ Nhật.
// Khẳng định kết quả thử nghiệm bằng test('normalize bỏ dấu và xử lý Đ/đ', () => { assert.equal( normalize(' ĐỐNG ĐA Hà Nội '), 'dong da ha noi', ) assert.eq.
test('normalize bỏ dấu và xử lý Đ/đ', () => {
  
  assert.equal(
    normalize('  ĐỐNG   ĐA Hà Nội  '),
    'dong da ha noi',
  )

  
  assert.equal(
    normalize('Hà Nội'.normalize('NFD')),
    'ha noi',
  )

  // Khẳng định kết quả thử nghiệm bằng assert.equal(normalize(''), '').
  assert.equal(normalize(''), '')
  
  assert.equal(normalize('博物館'), '博物館')
})

// CHỨC NĂNG: Kiểm tra tìm tên, địa chỉ, mô tả và danh mục.
// XỬ LÝ: Dùng thêm dữ liệu riêng để chứng minh
// không tìm nhầm bản Việt khi đang chọn Anh.
// Khẳng định kết quả thử nghiệm bằng test('search tên, địa chỉ, mô tả và danh mục', () => { assert.ok( searchPlaces(MOCK_PLACES, 'ha noi', 'vi') .some((place.
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
      // Gán thuộc tính id: chuỗi 'language'.
      id: 'language',
      // Gán thuộc tính name: tạo object gồm vi, en.
      name: {
        // Gán thuộc tính vi: chuỗi 'Địa điểm bí mật'.
        vi: 'Địa điểm bí mật',
        
        en: 'Hidden spot',
      },
      // Gán thuộc tính description: tạo object gồm vi, en.
      description: {
        // Gán thuộc tính vi: chuỗi 'Chỉ tiếng Việt'.
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

// CHỨC NĂNG: Kiểm tra bộ lọc và điều kiện hiện danh mục.
// XỬ LÝ: Dữ liệu cũ thiếu metadata vẫn được tìm kiếm bình thường.
// Khẳng định kết quả thử nghiệm bằng test('lọc và ngưỡng hiển thị danh mục', () => { assert.equal( filterCategories(MOCK_PLACES, []).length, 8, ) assert.equa.
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

  // Khai báo oldPlace: tạo object gồm id, name, description.
  const oldPlace = {
    // Gán thuộc tính id: chuỗi 'old'.
    id: 'old',
    // Gán thuộc tính name: tạo object gồm vi.
    name: {
      
      vi: 'Cũ',
    },
    // Gán thuộc tính description: tạo object gồm vi.
    description: {
      
      vi: 'Mô tả',
    },
  }

  
  assert.equal(
    searchPlaces([oldPlace], 'cu', 'vi').length,
    1,
  )
})

// CHỨC NĂNG: Kiểm tra sắp xếp khi có hoặc thiếu vị trí.
// XỬ LÝ: Truyền hàm khoảng cách giả;
// bài test không xin GPS và không phụ thuộc thiết bị.
// Khẳng định kết quả thử nghiệm bằng test('sort không vị trí theo tên.
test('sort không vị trí theo tên; có vị trí theo khoảng cách', () => {
  
  const places = [
    {
      // Gán thuộc tính id: chuỗi 'b'.
      id: 'b',
      // Gán thuộc tính name: tạo object gồm vi. | Gán thuộc tính vi: chuỗi 'B'.
      name: { vi: 'B' },
      // Gán thuộc tính description: tạo object gồm vi. | Gán thuộc tính vi: chuỗi ''.
      description: { vi: '' },
      
      rating: 5,
    },
    {
      // Gán thuộc tính id: chuỗi 'a'.
      id: 'a',
      // Gán thuộc tính name: tạo object gồm vi. | Gán thuộc tính vi: chuỗi 'A'.
      name: { vi: 'A' },
      // Gán thuộc tính description: tạo object gồm vi. | Gán thuộc tính vi: chuỗi ''.
      description: { vi: '' },
      // Gán thuộc tính rating: giá trị số 4.
      rating: 4,
      // Gán thuộc tính location: tạo object gồm lat, lng.
      location: {
        // Gán thuộc tính lat: giá trị số 1.
        lat: 1,
        
        lng: 0,
      },
    },
    {
      // Gán thuộc tính id: chuỗi 'c'.
      id: 'c',
      // Gán thuộc tính name: tạo object gồm vi. | Gán thuộc tính vi: chuỗi 'C'.
      name: { vi: 'C' },
      // Gán thuộc tính description: tạo object gồm vi. | Gán thuộc tính vi: chuỗi ''.
      description: { vi: '' },
      // Gán thuộc tính location: tạo object gồm lat, lng.
      location: {
        // Gán thuộc tính lat: giá trị số 2.
        lat: 2,
        
        lng: 0,
      },
    },
  ]

  
  assert.deepEqual(
    sortPlaces(places, {
      // Gán thuộc tính order: chuỗi 'nearest'.
      order: 'nearest',
      
      language: 'vi',
    }).map((place) => place.id),
    ['a', 'b', 'c'],
  )

  
  assert.deepEqual(
    sortPlaces(places, {
      // Gán thuộc tính order: chuỗi 'rating'.
      order: 'rating',
      
      language: 'vi',
    }).map((place) => place.id),
    ['b', 'a', 'c'],
  )

  // Khai báo distanceCalls: giá trị số 0.
  let distanceCalls = 0

  // Khai báo sortedByDistance: Gọi sortPlaces(places, { order: 'nearest', language: 'vi', origin: { lat: 0, lng: 0, }, distan.
  const sortedByDistance = sortPlaces(places, {
    // Gán thuộc tính order: chuỗi 'nearest'.
    order: 'nearest',
    // Gán thuộc tính language: chuỗi 'vi'.
    language: 'vi',
    // Gán thuộc tính origin: tạo object gồm lat, lng.
    origin: {
      // Gán thuộc tính lat: giá trị số 0.
      lat: 0,
      
      lng: 0,
    },
    // Gán thuộc tính distanceMeters: khai báo callback (_origin, destination) => { distanceCalls += 1 return destination.lat }.
    distanceMeters: (_origin, destination) => {
      // Thực hiện tính biểu thức distanceCalls += 1.
      distanceCalls += 1
      
      return destination.lat
    },
  })

  
  assert.deepEqual(
    sortedByDistance.map((place) => place.id),
    ['a', 'c', 'b'],
  )

  // CHỨC NĂNG: Kiểm tra không tính khoảng cách thừa.
  // XỬ LÝ: Chỉ hai điểm có tọa độ nên hàm đo được gọi hai lần.
  
  assert.equal(distanceCalls, 2)
})

// CHỨC NĂNG: Kiểm tra service cũ bổ sung bản dịch và truyền lỗi.
// XỬ LÝ: Resolver giả thay API để test không phụ thuộc mạng.
// Đây không phải service công bố nội dung của luồng visitor hiện tại.
// Khẳng định kết quả thử nghiệm bằng test('service bổ sung bản dịch.
test('service bổ sung bản dịch; không sửa mock; lỗi được truyền lên', async () => {
  
  const service = createPlaceService(
    loadMockPlaces,
    async (_text, _language, key) => {
      // Rẽ nhánh nếu key.includes('|name|').
      if (key.includes('|name|')) {
        
        return 'Bat Trang Pottery Village'
      }

      
      return 'Pottery in Hanoi'
    },
  )

  // Khai báo localized: await chờ Gọi service.list('en').
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

  // Khai báo copy: await chờ Gọi loadMockPlaces().
  const copy = await loadMockPlaces()
  // Thực hiện tính biểu thức copy[0].name.vi = 'Đã sửa'.
  copy[0].name.vi = 'Đã sửa'

  
  assert.notEqual(
    MOCK_PLACES[0].name.vi,
    'Đã sửa',
  )
})