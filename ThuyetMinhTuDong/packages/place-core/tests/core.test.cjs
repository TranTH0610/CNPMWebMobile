/**
 * FILE NÀY LÀM GÌ
 * Kiểm tra bỏ dấu tiếng Việt, tìm theo ngôn ngữ, danh mục, sắp xếp và service danh mục.
 *
 * VỊ TRÍ: packages/place-core/tests/core.test.cjs
 * DÙNG BỞI: Bộ chạy test tương ứng trong package.json.
 * PHỤ THUỘC: node:test; node:assert/strict; ../.test-build/place-core/src/index.js;
 * ../.test-build/place-core/src/data/mockPlaces.js
 * TẠI SAO TÁCH FILE: Kiểm tra hành vi tự động giúp phát hiện lỗi mà không phải thao tác lại toàn
 * bộ giao diện.
 */
// Khai báo { test }: require nạp module 'node:test' để dùng chức năng có sẵn thay vì chép lại.
const { test } = require('node:test')
// Khai báo assert: require nạp module 'node:assert/strict' để dùng chức năng có sẵn thay vì chép lại.
const assert = require('node:assert/strict')

/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `const {`: Khai báo { normalize, searchPlaces, filterCategories, categoryCounts, shouldShowCate: require nạp module '../.test-build/place-core/src/index.js' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `normalize,`: Khai báo { normalize, searchPlaces, filterCategories, categoryCounts, shouldShowCate: require nạp module '../.test-build/place-core/src/index.js' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `searchPlaces,`: Khai báo { normalize, searchPlaces, filterCategories, categoryCounts, shouldShowCate: require nạp module '../.test-build/place-core/src/index.js' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `filterCategories,`: Khai báo { normalize, searchPlaces, filterCategories, categoryCounts, shouldShowCate: require nạp module '../.test-build/place-core/src/index.js' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `categoryCounts,`: Khai báo { normalize, searchPlaces, filterCategories, categoryCounts, shouldShowCate: require nạp module '../.test-build/place-core/src/index.js' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `shouldShowCategories,`: Khai báo { normalize, searchPlaces, filterCategories, categoryCounts, shouldShowCate: require nạp module '../.test-build/place-core/src/index.js' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `sortPlaces,`: Khai báo { normalize, searchPlaces, filterCategories, categoryCounts, shouldShowCate: require nạp module '../.test-build/place-core/src/index.js' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `createPlaceService,`: Khai báo { normalize, searchPlaces, filterCategories, categoryCounts, shouldShowCate: require nạp module '../.test-build/place-core/src/index.js' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `} = require('../.test-build/place-core/src/index.js')`: Khai báo { normalize, searchPlaces, filterCategories, categoryCounts, shouldShowCate: require nạp module '../.test-build/place-core/src/index.js' để dùng chức năng có sẵn thay vì chép lại.
 */
const {
  normalize,
  searchPlaces,
  filterCategories,
  categoryCounts,
  shouldShowCategories,
  sortPlaces,
  createPlaceService,
} = require('../.test-build/place-core/src/index.js')

/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `const {`: Khai báo { MOCK_PLACES, loadMockPlaces, }: require nạp module '../.test-build/place-core/src/data/mockPlaces.js' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `MOCK_PLACES,`: Khai báo { MOCK_PLACES, loadMockPlaces, }: require nạp module '../.test-build/place-core/src/data/mockPlaces.js' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `loadMockPlaces,`: Khai báo { MOCK_PLACES, loadMockPlaces, }: require nạp module '../.test-build/place-core/src/data/mockPlaces.js' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `} = require('../.test-build/place-core/src/data/mockPlaces.js')`: Khai báo { MOCK_PLACES, loadMockPlaces, }: require nạp module '../.test-build/place-core/src/data/mockPlaces.js' để dùng chức năng có sẵn thay vì chép lại.
 */
const {
  MOCK_PLACES,
  loadMockPlaces,
} = require('../.test-build/place-core/src/data/mockPlaces.js')

// CHỨC NĂNG: Kiểm tra chuẩn hóa tiếng Việt.
// XỬ LÝ: Thử Đ/đ, khoảng trắng, NFD, chuỗi rỗng và chữ Nhật.
// Khẳng định kết quả thử nghiệm bằng test('normalize bỏ dấu và xử lý Đ/đ', () => { assert.equal( normalize(' ĐỐNG ĐA Hà Nội '), 'dong da ha noi', ) assert.eq.
test('normalize bỏ dấu và xử lý Đ/đ', () => {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( normalize(' ĐỐNG ĐA Hà Nội '), 'dong da ha noi', ).
   * DÒNG `normalize(' ĐỐNG ĐA Hà Nội '),`: Khẳng định kết quả thử nghiệm bằng assert.equal( normalize(' ĐỐNG ĐA Hà Nội '), 'dong da ha noi', ).
   * DÒNG `'dong da ha noi',`: Khẳng định kết quả thử nghiệm bằng assert.equal( normalize(' ĐỐNG ĐA Hà Nội '), 'dong da ha noi', ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  assert.equal(
    normalize('  ĐỐNG   ĐA Hà Nội  '),
    'dong da ha noi',
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( normalize('Hà Nội'.normalize('NFD')), 'ha noi', ).
   * DÒNG `normalize('Hà Nội'.normalize('NFD')),`: Khẳng định kết quả thử nghiệm bằng assert.equal( normalize('Hà Nội'.normalize('NFD')), 'ha noi', ).
   * DÒNG `'ha noi',`: Khẳng định kết quả thử nghiệm bằng assert.equal( normalize('Hà Nội'.normalize('NFD')), 'ha noi', ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  assert.equal(
    normalize('Hà Nội'.normalize('NFD')),
    'ha noi',
  )

  // Khẳng định kết quả thử nghiệm bằng assert.equal(normalize(''), '').
  assert.equal(normalize(''), '')
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(normalize('博物館'), '博物館')`: Khẳng định kết quả thử nghiệm bằng assert.equal(normalize('博物館'), '博物館').
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.equal(normalize('博物館'), '博物館')
})

// CHỨC NĂNG: Kiểm tra tìm tên, địa chỉ, mô tả và danh mục.
// XỬ LÝ: Dùng thêm dữ liệu riêng để chứng minh
// không tìm nhầm bản Việt khi đang chọn Anh.
// Khẳng định kết quả thử nghiệm bằng test('search tên, địa chỉ, mô tả và danh mục', () => { assert.ok( searchPlaces(MOCK_PLACES, 'ha noi', 'vi') .some((place.
test('search tên, địa chỉ, mô tả và danh mục', () => {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.ok(`: Khẳng định kết quả thử nghiệm bằng assert.ok( searchPlaces(MOCK_PLACES, 'ha noi', 'vi') .some((place) => place.id === '1'), ).
   * DÒNG `searchPlaces(MOCK_PLACES, 'ha noi', 'vi')`: Khẳng định kết quả thử nghiệm bằng assert.ok( searchPlaces(MOCK_PLACES, 'ha noi', 'vi') .some((place) => place.id === '1'), ).
   * DÒNG `.some((place) => place.id === '1'),`: Khẳng định kết quả thử nghiệm bằng assert.ok( searchPlaces(MOCK_PLACES, 'ha noi', 'vi') .some((place) => place.id === '1'), ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  assert.ok(
    searchPlaces(MOCK_PLACES, 'ha noi', 'vi')
      .some((place) => place.id === '1'),
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.ok(`: Khẳng định kết quả thử nghiệm bằng assert.ok( searchPlaces(MOCK_PLACES, 'DONG XUAN', 'vi') .some((place) => place.id === '6'), ).
   * DÒNG `searchPlaces(MOCK_PLACES, 'DONG XUAN', 'vi')`: Khẳng định kết quả thử nghiệm bằng assert.ok( searchPlaces(MOCK_PLACES, 'DONG XUAN', 'vi') .some((place) => place.id === '6'), ).
   * DÒNG `.some((place) => place.id === '6'),`: Khẳng định kết quả thử nghiệm bằng assert.ok( searchPlaces(MOCK_PLACES, 'DONG XUAN', 'vi') .some((place) => place.id === '6'), ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  assert.ok(
    searchPlaces(MOCK_PLACES, 'DONG XUAN', 'vi')
      .some((place) => place.id === '6'),
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.ok(`: Khẳng định kết quả thử nghiệm bằng assert.ok( searchPlaces(MOCK_PLACES, 'tra guom', 'vi') .some((place) => place.id === '4'), ).
   * DÒNG `searchPlaces(MOCK_PLACES, 'tra guom', 'vi')`: Khẳng định kết quả thử nghiệm bằng assert.ok( searchPlaces(MOCK_PLACES, 'tra guom', 'vi') .some((place) => place.id === '4'), ).
   * DÒNG `.some((place) => place.id === '4'),`: Khẳng định kết quả thử nghiệm bằng assert.ok( searchPlaces(MOCK_PLACES, 'tra guom', 'vi') .some((place) => place.id === '4'), ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  assert.ok(
    searchPlaces(MOCK_PLACES, 'tra guom', 'vi')
      .some((place) => place.id === '4'),
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.deepEqual(`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( searchPlaces(MOCK_PLACES, 'bao tang', 'vi') .map((place) => place.id), ['5'], ).
   * DÒNG `searchPlaces(MOCK_PLACES, 'bao tang', 'vi')`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( searchPlaces(MOCK_PLACES, 'bao tang', 'vi') .map((place) => place.id), ['5'], ).
   * DÒNG `.map((place) => place.id),`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( searchPlaces(MOCK_PLACES, 'bao tang', 'vi') .map((place) => place.id), ['5'], ).
   * DÒNG `['5'],`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( searchPlaces(MOCK_PLACES, 'bao tang', 'vi') .map((place) => place.id), ['5'], ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  assert.deepEqual(
    searchPlaces(MOCK_PLACES, 'bao tang', 'vi')
      .map((place) => place.id),
    ['5'],
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.ok(`: Khẳng định kết quả thử nghiệm bằng assert.ok( searchPlaces(MOCK_PLACES, 'museum', 'en') .some((place) => place.id === '5'), ).
   * DÒNG `searchPlaces(MOCK_PLACES, 'museum', 'en')`: Khẳng định kết quả thử nghiệm bằng assert.ok( searchPlaces(MOCK_PLACES, 'museum', 'en') .some((place) => place.id === '5'), ).
   * DÒNG `.some((place) => place.id === '5'),`: Khẳng định kết quả thử nghiệm bằng assert.ok( searchPlaces(MOCK_PLACES, 'museum', 'en') .some((place) => place.id === '5'), ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  assert.ok(
    searchPlaces(MOCK_PLACES, 'museum', 'en')
      .some((place) => place.id === '5'),
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const isolated = [`: Khai báo isolated: tạo mảng [ { id: 'language', name: { vi: 'Địa điểm bí mật', en: 'Hidden spot', }, descrip.
   * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
   */
  const isolated = [
    {
      // Gán thuộc tính id: chuỗi 'language'.
      id: 'language',
      // Gán thuộc tính name: tạo object gồm vi, en.
      name: {
        // Gán thuộc tính vi: chuỗi 'Địa điểm bí mật'.
        vi: 'Địa điểm bí mật',
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `en: 'Hidden spot',`: Gán thuộc tính en: chuỗi 'Hidden spot'.
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        en: 'Hidden spot',
      },
      // Gán thuộc tính description: tạo object gồm vi, en.
      description: {
        // Gán thuộc tính vi: chuỗi 'Chỉ tiếng Việt'.
        vi: 'Chỉ tiếng Việt',
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `en: 'English only',`: Gán thuộc tính en: chuỗi 'English only'.
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `]`: Kết thúc danh sách phần tử trong mảng.
         */
        en: 'English only',
      },
    },
  ]

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( searchPlaces(isolated, 'dia diem', 'en').length, 0, ).
   * DÒNG `searchPlaces(isolated, 'dia diem', 'en').length,`: Khẳng định kết quả thử nghiệm bằng assert.equal( searchPlaces(isolated, 'dia diem', 'en').length, 0, ).
   * DÒNG `0,`: Khẳng định kết quả thử nghiệm bằng assert.equal( searchPlaces(isolated, 'dia diem', 'en').length, 0, ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  assert.equal(
    searchPlaces(isolated, 'dia diem', 'en').length,
    0,
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( searchPlaces(isolated, 'hidden', 'en').length, 1, ).
   * DÒNG `searchPlaces(isolated, 'hidden', 'en').length,`: Khẳng định kết quả thử nghiệm bằng assert.equal( searchPlaces(isolated, 'hidden', 'en').length, 1, ).
   * DÒNG `1,`: Khẳng định kết quả thử nghiệm bằng assert.equal( searchPlaces(isolated, 'hidden', 'en').length, 1, ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  assert.equal(
    searchPlaces(isolated, 'hidden', 'en').length,
    1,
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( searchPlaces(MOCK_PLACES, 'zzzz', 'vi').length, 0, ).
   * DÒNG `searchPlaces(MOCK_PLACES, 'zzzz', 'vi').length,`: Khẳng định kết quả thử nghiệm bằng assert.equal( searchPlaces(MOCK_PLACES, 'zzzz', 'vi').length, 0, ).
   * DÒNG `0,`: Khẳng định kết quả thử nghiệm bằng assert.equal( searchPlaces(MOCK_PLACES, 'zzzz', 'vi').length, 0, ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  assert.equal(
    searchPlaces(MOCK_PLACES, 'zzzz', 'vi').length,
    0,
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( searchPlaces(MOCK_PLACES, ' ', 'vi').length, MOCK_PLACES.length, ).
   * DÒNG `searchPlaces(MOCK_PLACES, ' ', 'vi').length,`: Khẳng định kết quả thử nghiệm bằng assert.equal( searchPlaces(MOCK_PLACES, ' ', 'vi').length, MOCK_PLACES.length, ).
   * DÒNG `MOCK_PLACES.length,`: Khẳng định kết quả thử nghiệm bằng assert.equal( searchPlaces(MOCK_PLACES, ' ', 'vi').length, MOCK_PLACES.length, ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.equal(
    searchPlaces(MOCK_PLACES, '   ', 'vi').length,
    MOCK_PLACES.length,
  )
})

// CHỨC NĂNG: Kiểm tra bộ lọc và điều kiện hiện danh mục.
// XỬ LÝ: Dữ liệu cũ thiếu metadata vẫn được tìm kiếm bình thường.
// Khẳng định kết quả thử nghiệm bằng test('lọc và ngưỡng hiển thị danh mục', () => { assert.equal( filterCategories(MOCK_PLACES, []).length, 8, ) assert.equa.
test('lọc và ngưỡng hiển thị danh mục', () => {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( filterCategories(MOCK_PLACES, []).length, 8, ).
   * DÒNG `filterCategories(MOCK_PLACES, []).length,`: Khẳng định kết quả thử nghiệm bằng assert.equal( filterCategories(MOCK_PLACES, []).length, 8, ).
   * DÒNG `8,`: Khẳng định kết quả thử nghiệm bằng assert.equal( filterCategories(MOCK_PLACES, []).length, 8, ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  assert.equal(
    filterCategories(MOCK_PLACES, []).length,
    8,
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( filterCategories( MOCK_PLACES, ['landscape'], ).length, 2, ).
   * DÒNG `filterCategories(`: Khẳng định kết quả thử nghiệm bằng assert.equal( filterCategories( MOCK_PLACES, ['landscape'], ).length, 2, ).
   * DÒNG `MOCK_PLACES,`: Khẳng định kết quả thử nghiệm bằng assert.equal( filterCategories( MOCK_PLACES, ['landscape'], ).length, 2, ).
   * DÒNG `['landscape'],`: Khẳng định kết quả thử nghiệm bằng assert.equal( filterCategories( MOCK_PLACES, ['landscape'], ).length, 2, ).
   * DÒNG `).length,`: Khẳng định kết quả thử nghiệm bằng assert.equal( filterCategories( MOCK_PLACES, ['landscape'], ).length, 2, ).
   * DÒNG `2,`: Khẳng định kết quả thử nghiệm bằng assert.equal( filterCategories( MOCK_PLACES, ['landscape'], ).length, 2, ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  assert.equal(
    filterCategories(
      MOCK_PLACES,
      ['landscape'],
    ).length,
    2,
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( categoryCounts(MOCK_PLACES).landscape, 2, ).
   * DÒNG `categoryCounts(MOCK_PLACES).landscape,`: Khẳng định kết quả thử nghiệm bằng assert.equal( categoryCounts(MOCK_PLACES).landscape, 2, ).
   * DÒNG `2,`: Khẳng định kết quả thử nghiệm bằng assert.equal( categoryCounts(MOCK_PLACES).landscape, 2, ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  assert.equal(
    categoryCounts(MOCK_PLACES).landscape,
    2,
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( shouldShowCategories(MOCK_PLACES), true, ).
   * DÒNG `shouldShowCategories(MOCK_PLACES),`: Khẳng định kết quả thử nghiệm bằng assert.equal( shouldShowCategories(MOCK_PLACES), true, ).
   * DÒNG `true,`: Khẳng định kết quả thử nghiệm bằng assert.equal( shouldShowCategories(MOCK_PLACES), true, ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  assert.equal(
    shouldShowCategories(MOCK_PLACES),
    true,
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( shouldShowCategories( filterCategories( MOCK_PLACES, ['landscape'], ), ), false, ).
   * DÒNG `shouldShowCategories(`: Khẳng định kết quả thử nghiệm bằng assert.equal( shouldShowCategories( filterCategories( MOCK_PLACES, ['landscape'], ), ), false, ).
   * DÒNG `filterCategories(`: Khẳng định kết quả thử nghiệm bằng assert.equal( shouldShowCategories( filterCategories( MOCK_PLACES, ['landscape'], ), ), false, ).
   * DÒNG `MOCK_PLACES,`: Khẳng định kết quả thử nghiệm bằng assert.equal( shouldShowCategories( filterCategories( MOCK_PLACES, ['landscape'], ), ), false, ).
   * DÒNG `['landscape'],`: Khẳng định kết quả thử nghiệm bằng assert.equal( shouldShowCategories( filterCategories( MOCK_PLACES, ['landscape'], ), ), false, ).
   * DÒNG `),`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `),`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `false,`: Khẳng định kết quả thử nghiệm bằng assert.equal( shouldShowCategories( filterCategories( MOCK_PLACES, ['landscape'], ), ), false, ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  assert.equal(
    shouldShowCategories(
      filterCategories(
        MOCK_PLACES,
        ['landscape'],
      ),
    ),
    false,
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( shouldShowCategories([]), false, ).
   * DÒNG `shouldShowCategories([]),`: Khẳng định kết quả thử nghiệm bằng assert.equal( shouldShowCategories([]), false, ).
   * DÒNG `false,`: Khẳng định kết quả thử nghiệm bằng assert.equal( shouldShowCategories([]), false, ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
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
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `vi: 'Cũ',`: Gán thuộc tính vi: chuỗi 'Cũ'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      vi: 'Cũ',
    },
    // Gán thuộc tính description: tạo object gồm vi.
    description: {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `vi: 'Mô tả',`: Gán thuộc tính vi: chuỗi 'Mô tả'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      vi: 'Mô tả',
    },
  }

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( searchPlaces([oldPlace], 'cu', 'vi').length, 1, ).
   * DÒNG `searchPlaces([oldPlace], 'cu', 'vi').length,`: Khẳng định kết quả thử nghiệm bằng assert.equal( searchPlaces([oldPlace], 'cu', 'vi').length, 1, ).
   * DÒNG `1,`: Khẳng định kết quả thử nghiệm bằng assert.equal( searchPlaces([oldPlace], 'cu', 'vi').length, 1, ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
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
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const places = [`: Khai báo places: tạo mảng [ { id: 'b', name: { vi: 'B' }, description: { vi: '' }, rating: 5, }, { id: 'a'.
   * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
   */
  const places = [
    {
      // Gán thuộc tính id: chuỗi 'b'.
      id: 'b',
      // Gán thuộc tính name: tạo object gồm vi. | Gán thuộc tính vi: chuỗi 'B'.
      name: { vi: 'B' },
      // Gán thuộc tính description: tạo object gồm vi. | Gán thuộc tính vi: chuỗi ''.
      description: { vi: '' },
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `rating: 5,`: Gán thuộc tính rating: giá trị số 5.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
       */
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
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `lng: 0,`: Gán thuộc tính lng: giá trị số 0.
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
         */
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
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `lng: 0,`: Gán thuộc tính lng: giá trị số 0.
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `]`: Kết thúc danh sách phần tử trong mảng.
         */
        lng: 0,
      },
    },
  ]

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.deepEqual(`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( sortPlaces(places, { order: 'nearest', language: 'vi', }).map((place) => place.id), ['a', 'b', 'c'], ).
   * DÒNG `sortPlaces(places, {`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( sortPlaces(places, { order: 'nearest', language: 'vi', }).map((place) => place.id), ['a', 'b', 'c'], ).
   */
  assert.deepEqual(
    sortPlaces(places, {
      // Gán thuộc tính order: chuỗi 'nearest'.
      order: 'nearest',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `language: 'vi',`: Gán thuộc tính language: chuỗi 'vi'.
       * DÒNG `}).map((place) => place.id),`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( sortPlaces(places, { order: 'nearest', language: 'vi', }).map((place) => place.id), ['a', 'b', 'c'], ).
       * DÒNG `['a', 'b', 'c'],`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( sortPlaces(places, { order: 'nearest', language: 'vi', }).map((place) => place.id), ['a', 'b', 'c'], ).
       * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
       */
      language: 'vi',
    }).map((place) => place.id),
    ['a', 'b', 'c'],
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.deepEqual(`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( sortPlaces(places, { order: 'rating', language: 'vi', }).map((place) => place.id), ['b', 'a', 'c'], ).
   * DÒNG `sortPlaces(places, {`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( sortPlaces(places, { order: 'rating', language: 'vi', }).map((place) => place.id), ['b', 'a', 'c'], ).
   */
  assert.deepEqual(
    sortPlaces(places, {
      // Gán thuộc tính order: chuỗi 'rating'.
      order: 'rating',
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `language: 'vi',`: Gán thuộc tính language: chuỗi 'vi'.
       * DÒNG `}).map((place) => place.id),`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( sortPlaces(places, { order: 'rating', language: 'vi', }).map((place) => place.id), ['b', 'a', 'c'], ).
       * DÒNG `['b', 'a', 'c'],`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( sortPlaces(places, { order: 'rating', language: 'vi', }).map((place) => place.id), ['b', 'a', 'c'], ).
       * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
       */
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
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `lng: 0,`: Gán thuộc tính lng: giá trị số 0.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      lng: 0,
    },
    // Gán thuộc tính distanceMeters: khai báo callback (_origin, destination) => { distanceCalls += 1 return destination.lat }.
    distanceMeters: (_origin, destination) => {
      // Thực hiện tính biểu thức distanceCalls += 1.
      distanceCalls += 1
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `return destination.lat`: Trả kết quả: đọc destination.lat từ đối tượng/mảng để dùng tại bước hiện tại.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      return destination.lat
    },
  })

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.deepEqual(`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( sortedByDistance.map((place) => place.id), ['a', 'c', 'b'], ).
   * DÒNG `sortedByDistance.map((place) => place.id),`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( sortedByDistance.map((place) => place.id), ['a', 'c', 'b'], ).
   * DÒNG `['a', 'c', 'b'],`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual( sortedByDistance.map((place) => place.id), ['a', 'c', 'b'], ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  assert.deepEqual(
    sortedByDistance.map((place) => place.id),
    ['a', 'c', 'b'],
  )

  // CHỨC NĂNG: Kiểm tra không tính khoảng cách thừa.
  // XỬ LÝ: Chỉ hai điểm có tọa độ nên hàm đo được gọi hai lần.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(distanceCalls, 2)`: Khẳng định kết quả thử nghiệm bằng assert.equal(distanceCalls, 2).
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.equal(distanceCalls, 2)
})

// CHỨC NĂNG: Kiểm tra service cũ bổ sung bản dịch và truyền lỗi.
// XỬ LÝ: Resolver giả thay API để test không phụ thuộc mạng.
// Đây không phải service công bố nội dung của luồng visitor hiện tại.
// Khẳng định kết quả thử nghiệm bằng test('service bổ sung bản dịch.
test('service bổ sung bản dịch; không sửa mock; lỗi được truyền lên', async () => {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const service = createPlaceService(`: Khai báo service: Gọi createPlaceService( loadMockPlaces, async (_text, _language, key) => { if (key.includes('|.
   * DÒNG `loadMockPlaces,`: Khai báo service: Gọi createPlaceService( loadMockPlaces, async (_text, _language, key) => { if (key.includes('|.
   * DÒNG `async (_text, _language, key) => {`: Khai báo service: Gọi createPlaceService( loadMockPlaces, async (_text, _language, key) => { if (key.includes('|.
   */
  const service = createPlaceService(
    loadMockPlaces,
    async (_text, _language, key) => {
      // Rẽ nhánh nếu key.includes('|name|').
      if (key.includes('|name|')) {
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `return 'Bat Trang Pottery Village'`: Trả kết quả: chuỗi 'Bat Trang Pottery Village'.
         * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        return 'Bat Trang Pottery Village'
      }

      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `return 'Pottery in Hanoi'`: Trả kết quả: chuỗi 'Pottery in Hanoi'.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
       */
      return 'Pottery in Hanoi'
    },
  )

  // Khai báo localized: await chờ Gọi service.list('en').
  const localized = await service.list('en')

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.ok(`: Khẳng định kết quả thử nghiệm bằng assert.ok( searchPlaces(localized, 'pottery', 'en') .some((place) => place.id === '7'), ).
   * DÒNG `searchPlaces(localized, 'pottery', 'en')`: Khẳng định kết quả thử nghiệm bằng assert.ok( searchPlaces(localized, 'pottery', 'en') .some((place) => place.id === '7'), ).
   * DÒNG `.some((place) => place.id === '7'),`: Khẳng định kết quả thử nghiệm bằng assert.ok( searchPlaces(localized, 'pottery', 'en') .some((place) => place.id === '7'), ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  assert.ok(
    searchPlaces(localized, 'pottery', 'en')
      .some((place) => place.id === '7'),
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( MOCK_PLACES.find( (place) => place.id === '7', ).name.en, undefined, ).
   * DÒNG `MOCK_PLACES.find(`: Khẳng định kết quả thử nghiệm bằng assert.equal( MOCK_PLACES.find( (place) => place.id === '7', ).name.en, undefined, ).
   * DÒNG `(place) => place.id === '7',`: Khẳng định kết quả thử nghiệm bằng assert.equal( MOCK_PLACES.find( (place) => place.id === '7', ).name.en, undefined, ).
   * DÒNG `).name.en,`: Khẳng định kết quả thử nghiệm bằng assert.equal( MOCK_PLACES.find( (place) => place.id === '7', ).name.en, undefined, ).
   * DÒNG `undefined,`: Khẳng định kết quả thử nghiệm bằng assert.equal( MOCK_PLACES.find( (place) => place.id === '7', ).name.en, undefined, ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  assert.equal(
    MOCK_PLACES.find(
      (place) => place.id === '7',
    ).name.en,
    undefined,
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const failedSource = createPlaceService(`: Khai báo failedSource: Gọi createPlaceService( async () => { throw new Error('offline') }, ).
   * DÒNG `async () => {`: Khai báo failedSource: Gọi createPlaceService( async () => { throw new Error('offline') }, ).
   */
  const failedSource = createPlaceService(
    async () => {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `throw new Error('offline')`: Ném new Error('offline').
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
       */
      throw new Error('offline')
    },
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `await assert.rejects(`: Khẳng định kết quả thử nghiệm bằng await assert.rejects( failedSource.list(), /offline/, ).
   * DÒNG `failedSource.list(),`: Khẳng định kết quả thử nghiệm bằng await assert.rejects( failedSource.list(), /offline/, ).
   * DÒNG `/offline/,`: Khẳng định kết quả thử nghiệm bằng await assert.rejects( failedSource.list(), /offline/, ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  await assert.rejects(
    failedSource.list(),
    /offline/,
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const failedTranslation = createPlaceService(`: Khai báo failedTranslation: Gọi createPlaceService( loadMockPlaces, async () => { throw new Error('translate failed') }, ).
   * DÒNG `loadMockPlaces,`: Khai báo failedTranslation: Gọi createPlaceService( loadMockPlaces, async () => { throw new Error('translate failed') }, ).
   * DÒNG `async () => {`: Khai báo failedTranslation: Gọi createPlaceService( loadMockPlaces, async () => { throw new Error('translate failed') }, ).
   */
  const failedTranslation = createPlaceService(
    loadMockPlaces,
    async () => {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `throw new Error('translate failed')`: Ném new Error('translate failed').
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
       */
      throw new Error('translate failed')
    },
  )

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `await assert.rejects(`: Khẳng định kết quả thử nghiệm bằng await assert.rejects( failedTranslation.list('en'), /translate failed/, ).
   * DÒNG `failedTranslation.list('en'),`: Khẳng định kết quả thử nghiệm bằng await assert.rejects( failedTranslation.list('en'), /translate failed/, ).
   * DÒNG `/translate failed/,`: Khẳng định kết quả thử nghiệm bằng await assert.rejects( failedTranslation.list('en'), /translate failed/, ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  await assert.rejects(
    failedTranslation.list('en'),
    /translate failed/,
  )

  // Khai báo copy: await chờ Gọi loadMockPlaces().
  const copy = await loadMockPlaces()
  // Thực hiện tính biểu thức copy[0].name.vi = 'Đã sửa'.
  copy[0].name.vi = 'Đã sửa'

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.notEqual(`: Khẳng định kết quả thử nghiệm bằng assert.notEqual( MOCK_PLACES[0].name.vi, 'Đã sửa', ).
   * DÒNG `MOCK_PLACES[0].name.vi,`: Khẳng định kết quả thử nghiệm bằng assert.notEqual( MOCK_PLACES[0].name.vi, 'Đã sửa', ).
   * DÒNG `'Đã sửa',`: Khẳng định kết quả thử nghiệm bằng assert.notEqual( MOCK_PLACES[0].name.vi, 'Đã sửa', ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.notEqual(
    MOCK_PLACES[0].name.vi,
    'Đã sửa',
  )
})