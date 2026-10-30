/**
 * FILE NÀY LÀM GÌ
 * Kiểm tra cấu hình/địa chỉ website dùng cho liên kết chung.
 *
 * VỊ TRÍ: packages/visitor-core/tests/site.test.cjs
 * DÙNG BỞI: Bộ chạy test tương ứng trong package.json.
 * PHỤ THUỘC: node:test; node:assert/strict; ../.test-build/links/site.js
 * TẠI SAO TÁCH FILE: Kiểm tra hành vi tự động giúp phát hiện lỗi mà không phải thao tác lại toàn
 * bộ giao diện.
 */
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `const {`: Khai báo { test, }: require nạp module 'node:test' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `test,`: Khai báo { test, }: require nạp module 'node:test' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `} = require('node:test')`: Khai báo { test, }: require nạp module 'node:test' để dùng chức năng có sẵn thay vì chép lại.
 */
const {
  test,
} = require('node:test')

/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `const assert =`: Khai báo assert: require nạp module 'node:assert/strict' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `require('node:assert/strict')`: Khai báo assert: require nạp module 'node:assert/strict' để dùng chức năng có sẵn thay vì chép lại.
 */
const assert =
  require('node:assert/strict')

/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `const {`: Khai báo { siteOrigin, }: require nạp module '../.test-build/links/site.js' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `siteOrigin,`: Khai báo { siteOrigin, }: require nạp module '../.test-build/links/site.js' để dùng chức năng có sẵn thay vì chép lại.
 * DÒNG `} = require('../.test-build/links/site.js')`: Khai báo { siteOrigin, }: require nạp module '../.test-build/links/site.js' để dùng chức năng có sẵn thay vì chép lại.
 */
const {
  siteOrigin,
} = require('../.test-build/links/site.js')

// CHỨC NĂNG: Kiểm tra HTTPS công khai và HTTP LAN khi chạy thử.
// XỬ LÝ: localhost và URL không phù hợp phải bị từ chối.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `test(`: Khẳng định kết quả thử nghiệm bằng test( 'QR chấp nhận HTTPS và LAN HTTP khi được cho phép', () => { assert.equal( siteOrigin( 'https://guide.test/', ), 'h.
 * DÒNG `'QR chấp nhận HTTPS và LAN HTTP khi được cho phép',`: Khẳng định kết quả thử nghiệm bằng test( 'QR chấp nhận HTTPS và LAN HTTP khi được cho phép', () => { assert.equal( siteOrigin( 'https://guide.test/', ), 'h.
 * DÒNG `() => {`: Khẳng định kết quả thử nghiệm bằng test( 'QR chấp nhận HTTPS và LAN HTTP khi được cho phép', () => { assert.equal( siteOrigin( 'https://guide.test/', ), 'h.
 */
test(
  'QR chấp nhận HTTPS và LAN HTTP khi được cho phép',
  () => {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( siteOrigin( 'https://guide.test/', ), 'https://guide.test', ).
     * DÒNG `siteOrigin(`: Khẳng định kết quả thử nghiệm bằng assert.equal( siteOrigin( 'https://guide.test/', ), 'https://guide.test', ).
     * DÒNG `'https://guide.test/',`: Khẳng định kết quả thử nghiệm bằng assert.equal( siteOrigin( 'https://guide.test/', ), 'https://guide.test', ).
     * DÒNG `),`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     * DÒNG `'https://guide.test',`: Khẳng định kết quả thử nghiệm bằng assert.equal( siteOrigin( 'https://guide.test/', ), 'https://guide.test', ).
     * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     */
    assert.equal(
      siteOrigin(
        'https://guide.test/',
      ),
      'https://guide.test',
    )

    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `assert.equal(`: Khẳng định kết quả thử nghiệm bằng assert.equal( siteOrigin( 'http://192.168.1.20:5173', true, ), 'http://192.168.1.20:5173', ).
     * DÒNG `siteOrigin(`: Khẳng định kết quả thử nghiệm bằng assert.equal( siteOrigin( 'http://192.168.1.20:5173', true, ), 'http://192.168.1.20:5173', ).
     * DÒNG `'http://192.168.1.20:5173',`: Khẳng định kết quả thử nghiệm bằng assert.equal( siteOrigin( 'http://192.168.1.20:5173', true, ), 'http://192.168.1.20:5173', ).
     * DÒNG `true,`: Khẳng định kết quả thử nghiệm bằng assert.equal( siteOrigin( 'http://192.168.1.20:5173', true, ), 'http://192.168.1.20:5173', ).
     * DÒNG `),`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     * DÒNG `'http://192.168.1.20:5173',`: Khẳng định kết quả thử nghiệm bằng assert.equal( siteOrigin( 'http://192.168.1.20:5173', true, ), 'http://192.168.1.20:5173', ).
     * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     */
    assert.equal(
      siteOrigin(
        'http://192.168.1.20:5173',
        true,
      ),
      'http://192.168.1.20:5173',
    )

    // Khẳng định kết quả thử nghiệm bằng assert.throws(() => { siteOrigin( 'http://192.168.1.20:5173', ) }).
    assert.throws(() => {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `siteOrigin(`: Thực hiện Gọi siteOrigin( 'http://192.168.1.20:5173', ).
       * DÒNG `'http://192.168.1.20:5173',`: Thực hiện Gọi siteOrigin( 'http://192.168.1.20:5173', ).
       * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
       * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      siteOrigin(
        'http://192.168.1.20:5173',
      )
    })

    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `const invalidUrls = [`: Khai báo invalidUrls: tạo mảng [ 'http://localhost:5173', 'https://localhost', 'https://127.0.0.1', 'https://[:.
     * DÒNG `'http://localhost:5173',`: Khai báo invalidUrls: tạo mảng [ 'http://localhost:5173', 'https://localhost', 'https://127.0.0.1', 'https://[:.
     * DÒNG `'https://localhost',`: Khai báo invalidUrls: tạo mảng [ 'http://localhost:5173', 'https://localhost', 'https://127.0.0.1', 'https://[:.
     * DÒNG `'https://127.0.0.1',`: Khai báo invalidUrls: tạo mảng [ 'http://localhost:5173', 'https://localhost', 'https://127.0.0.1', 'https://[:.
     * DÒNG `'https://[::1]',`: Khai báo invalidUrls: tạo mảng [ 'http://localhost:5173', 'https://localhost', 'https://127.0.0.1', 'https://[:.
     * DÒNG `'https://0.0.0.0',`: Khai báo invalidUrls: tạo mảng [ 'http://localhost:5173', 'https://localhost', 'https://127.0.0.1', 'https://[:.
     * DÒNG `'https://hue-guide.example',`: Khai báo invalidUrls: tạo mảng [ 'http://localhost:5173', 'https://localhost', 'https://127.0.0.1', 'https://[:.
     * DÒNG `'https://user:password@guide.test',`: Khai báo invalidUrls: tạo mảng [ 'http://localhost:5173', 'https://localhost', 'https://127.0.0.1', 'https://[:.
     * DÒNG `'https://guide.test/places',`: Khai báo invalidUrls: tạo mảng [ 'http://localhost:5173', 'https://localhost', 'https://127.0.0.1', 'https://[:.
     * DÒNG `'https://guide.test/?a=b',`: Khai báo invalidUrls: tạo mảng [ 'http://localhost:5173', 'https://localhost', 'https://127.0.0.1', 'https://[:.
     * DÒNG `'not a url',`: Khai báo invalidUrls: tạo mảng [ 'http://localhost:5173', 'https://localhost', 'https://127.0.0.1', 'https://[:.
     * DÒNG `]`: Kết thúc danh sách phần tử trong mảng.
     */
    const invalidUrls = [
      'http://localhost:5173',
      'https://localhost',
      'https://127.0.0.1',
      'https://[::1]',
      'https://0.0.0.0',
      'https://hue-guide.example',
      'https://user:password@guide.test',
      'https://guide.test/places',
      'https://guide.test/?a=b',
      'not a url',
    ]

    // Duyệt lần lượt invalidUrls bằng const raw.
    for (const raw of invalidUrls) {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `assert.throws(`: Khẳng định kết quả thử nghiệm bằng assert.throws( () => siteOrigin(raw, true), raw, ).
       * DÒNG `() => siteOrigin(raw, true),`: Khẳng định kết quả thử nghiệm bằng assert.throws( () => siteOrigin(raw, true), raw, ).
       * DÒNG `raw,`: Khẳng định kết quả thử nghiệm bằng assert.throws( () => siteOrigin(raw, true), raw, ).
       * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
       */
      assert.throws(
        () => siteOrigin(raw, true),
        raw,
      )
    }
  },
)