/**
 * CHỨC NĂNG: [GIAO-DIEN]
 * VAI TRÒ: GIAO DIỆN WEB
 *
 * FILE NÀY LÀM GÌ:
 * Các biểu tượng SVG dùng lại trong website du khách.
 *
 * VỊ TRÍ: apps/web/src/shared/components/BieuTuong.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/web/src/features/explore/components/DanhSachVaBoLoc.tsx
 * - apps/web/src/features/explore/components/NutLocDanhMuc.tsx
 * - apps/web/src/features/explore/components/TheDiTich.tsx
 * - apps/web/src/features/explore/pages/TrangChu.tsx
 * - apps/web/src/features/journey/components/NutNgheThuyetMinh.tsx
 * - apps/web/src/features/journey/components/TrangThaiDinhVi.tsx
 * - apps/web/src/features/journey/components/TrinhNgheThuyetMinh.tsx
 * - apps/web/src/features/journey/pages/TrangHanhTrinh.tsx
 * - apps/web/src/features/language/components/ChonNgonNgu.tsx
 * - apps/web/src/features/place-detail/pages/TrangChiTietDiTich.tsx
 * - apps/web/src/shared/components/TrangThaiDuLieu.tsx
 *
 * PHỤ THUỘC:
 * - Không import module khác.
 *
 * CÁC KHỐI CHÍNH:
 * 1. Icon
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
// CHỨC NĂNG: Icon SVG nhỏ để không thêm framework UI.
// XỬ LÝ: Icon trang trí ẩn với trình đọc màn hình;
// nút bên ngoài có aria-label đã dịch.

// ==================== [GIAO-DIEN] Icon ====================
export function Icon({
  name,
}: {
  name:
    | 'landmark'
    | 'map'
    | 'language'
    | 'compass'
    | 'search'
    | 'pin'
    | 'arrow'
    | 'grid'
    | 'list'
    | 'qr'
    | 'play'
    | 'pause'
    | 'replay'
    | 'backward'
    | 'forward'
    | 'headphones'
    | 'close'
}) {
  const paths = {
    // CHỨC NĂNG: Hai nét SVG đối xứng, không bị lệch theo đường chân chữ của font.
    close: <path d="M6 6 18 18M18 6 6 18" />,
    landmark: (
      <>
        <path d="M3 9 12 3l9 6M4 10h16M6 10v10m4-10v10m4-10v10m4-10v10M3 21h18" />
      </>
    ),
    map: (
      <>
        <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Zm6-3v15m6-12v15" />
      </>
    ),
    language: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z" />
      </>
    ),
    compass: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m16 8-3 5-5 3 3-5 5-3Z" />
      </>
    ),
    play: <path d="m9 5 11 7-11 7Z" fill="currentColor" strokeLinejoin="round" />,

    pause: (
      <>
        <path d="M7 5h3v14H7zM14 5h3v14h-3z" fill="currentColor" />
      </>
    ),

    replay: (
      <>
        <path d="M4 10a8 8 0 1 1 1 8M4 4v6h6" />
      </>
    ),

    backward: (
      <>
        <path d="M4 10a8 8 0 1 1 1 8M4 4v6h6" />
        <text
          x="12"
          y="16"
          textAnchor="middle"
          fontSize="8"
          stroke="none"
          fill="currentColor"
          fontFamily="system-ui"
        >
          10
        </text>
      </>
    ),

    forward: (
      <>
        <path d="M20 10a8 8 0 1 0-1 8M20 4v6h-6" />
        <text
          x="12"
          y="16"
          textAnchor="middle"
          fontSize="8"
          stroke="none"
          fill="currentColor"
          fontFamily="system-ui"
        >
          10
        </text>
      </>
    ),

    headphones: (
      <>
        <path d="M4 14v-3a8 8 0 0 1 16 0v3" />
        <rect x="3" y="11" width="4" height="9" rx="2" />
        <rect x="17" y="11" width="4" height="9" rx="2" />
      </>
    ),

    search: (
      <>
        <circle cx="10" cy="10" r="6" />
        <path d="m15 15 5 5" />
      </>
    ),

    pin: (
      <>
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),

    arrow: <path d="m9 5 7 7-7 7M4 12h12" />,

    grid: (
      <>
        <rect x="3" y="3" width="6" height="6" rx="1" />
        <rect x="15" y="3" width="6" height="6" rx="1" />
        <rect x="3" y="15" width="6" height="6" rx="1" />
        <rect x="15" y="15" width="6" height="6" rx="1" />
      </>
    ),

    list: <path d="M3 5h2m4 0h12M3 12h2m4 0h12M3 19h2m4 0h12" />,

    qr: (
      <>
        <path d="M3 8V3h5m8 0h5v5M3 16v5h5m8 0h5v-5M9 9h6v6H9Z" />
      </>
    ),
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}
// TẠI SAO (Icon): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện tại
// một nơi.
