/**
 * FILE: scripts/DongGoiKiemThuQuanTri.cjs
 * FILE NÀY LÀM GÌ: Biên dịch/đóng gói phần admin cần cho bộ test Node để kiểm tra logic không cần chạy UI.
 * VAI TRÒ: Công cụ vận hành/khởi động; hỗ trợ UC, không phải màn hình nghiệp vụ.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC09: Truy cập khu vực quản lý được cấp sẵn.
 * - UC10: Quản lý di tích.
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * - UC12: Kiểm duyệt nội dung và âm thanh.
 * - UC13: Công bố phiên bản đã duyệt.
 * - UC14: Theo dõi hoạt động và lượt vào từ QR.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
const path = require('node:path')
const { createRequire } = require('node:module')
const root = path.resolve(__dirname, '..')
const req = createRequire(path.join(root, 'apps/web/package.json'))
req('esbuild').buildSync({ entryPoints: [path.join(root,'packages/admin-core/src/XuatCongKhai.ts')],
 bundle: true, platform: 'node', format: 'cjs', outfile: path.join(root,'packages/admin-core/.test-build/index.cjs') })
