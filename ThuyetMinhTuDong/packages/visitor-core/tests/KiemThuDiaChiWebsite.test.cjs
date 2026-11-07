/**
 * CHỨC NĂNG: [KIEM-THU]
 * VAI TRÒ: KIỂM THỬ
 *
 * FILE NÀY LÀM GÌ:
 * Kiểm tra cấu hình/địa chỉ website dùng cho liên kết chung.
 *
 * VỊ TRÍ: packages/visitor-core/tests/KiemThuDiaChiWebsite.test.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - Điểm vào/cấu hình/bộ test hoặc nơi dùng qua package; xem docs/BanDoChucNang.md.
 *
 * PHỤ THUỘC:
 * - node:test
 * - node:assert/strict
 * - ../.test-build/links/DiaChiWebsite.js
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Phát hiện lỗi bằng kiểm thử lặp lại mà không cần thao tác thủ công toàn bộ luồng.
 */
const {
  test,
} = require('node:test')


const assert =
  require('node:assert/strict')


const {
  siteOrigin,
} = require('../.test-build/links/DiaChiWebsite.js')

// CHỨC NĂNG: Kiểm tra HTTPS công khai và HTTP LAN khi chạy thử.
// XỬ LÝ: localhost và URL không phù hợp phải bị từ chối.

test(
  'QR chấp nhận HTTPS và LAN HTTP khi được cho phép',
  () => {
    
    assert.equal(
      siteOrigin(
        'https://guide.test/',
      ),
      'https://guide.test',
    )

    
    assert.equal(
      siteOrigin(
        'http://192.168.1.20:5173',
        true,
      ),
      'http://192.168.1.20:5173',
    )

    // Khẳng định kết quả thử nghiệm bằng assert.throws(() => { siteOrigin( 'http://192.168.1.20:5173', ) }).
    assert.throws(() => {
      
      siteOrigin(
        'http://192.168.1.20:5173',
      )
    })

    
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
      
      assert.throws(
        () => siteOrigin(raw, true),
        raw,
      )
    }
  },
)