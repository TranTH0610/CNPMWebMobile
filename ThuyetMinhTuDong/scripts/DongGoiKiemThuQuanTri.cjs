/**
 * CHỨC NĂNG: [KIEM-THU]
 * VAI TRÒ: CÔNG CỤ CHẠY DỰ ÁN
 *
 * FILE NÀY LÀM GÌ:
 * Biên dịch/đóng gói phần admin cần cho bộ test Node để kiểm tra logic không cần chạy UI.
 *
 * VỊ TRÍ: scripts/DongGoiKiemThuQuanTri.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - Điểm vào/cấu hình/bộ test hoặc nơi dùng qua package; xem docs/BanDoChucNang.md.
 *
 * PHỤ THUỘC:
 * - node:path
 * - node:module
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
// Khai báo path: require nạp module 'node:path' để dùng chức năng có sẵn thay vì chép lại.
const path = require('node:path')
// Khai báo { createRequire }: require nạp module 'node:module' để dùng chức năng có sẵn thay vì chép lại.
const { createRequire } = require('node:module')
// Khai báo root: Gọi path.resolve(__dirname, '..').
const root = path.resolve(__dirname, '..')
// Khai báo req: Gọi createRequire(path.join(root, 'apps/web/package.json')).
const req = createRequire(path.join(root, 'apps/web/package.json'))
// Thực hiện Gọi req('esbuild').buildSync({ entryPoints: [path.join(root,'packages/admin-core/src/XuatCongKhai.ts'. | Gán thuộc tính entryPoints: tạo mảng [path.join(root,'packages/admin-core/src/XuatCongKhai.ts')].
req('esbuild').buildSync({ entryPoints: [path.join(root,'packages/admin-core/src/XuatCongKhai.ts')],
 // Gán thuộc tính bundle: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính platform: chuỗi 'node'. | Gán thuộc tính format: chuỗi 'cjs'. | Gán thuộc tính outfile: Gọi path.join(root,'packages/admin-core/.test-build/index.cjs').
 bundle: true, platform: 'node', format: 'cjs', outfile: path.join(root,'packages/admin-core/.test-build/index.cjs') })
