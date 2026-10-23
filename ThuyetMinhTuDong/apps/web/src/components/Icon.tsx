/**
 * FILE NÀY LÀM GÌ: Các icon SVG nhỏ có thể tái sử dụng trong giao diện web.
 * Vị trí: apps/web/src/components/Icon.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */



// CHỨC NĂNG: Icon SVG nhỏ để không thêm framework UI.
// XỬ LÝ: Icon trang trí ẩn với trình đọc màn hình;
// nút bên ngoài có aria-label đã dịch.
export function Icon({
  name,
}: {
  name: 'search' | 'pin' | 'heart' | 'arrow' | 'grid' | 'list' | 'qr' | 'play' | 'pause' | 'replay' | 'backward' | 'forward' | 'headphones'
}) {
  const paths = {
    play: <path d="m9 5 11 7-11 7Z" fill="currentColor" strokeLinejoin="round" />,
    pause: <><path d="M7 5h3v14H7zM14 5h3v14h-3z" fill="currentColor" /></>,
    replay: <><path d="M4 10a8 8 0 1 1 1 8M4 4v6h6" /></>,
    backward: <><path d="M4 10a8 8 0 1 1 1 8M4 4v6h6" /><text x="12" y="16" textAnchor="middle" fontSize="8" stroke="none" fill="currentColor" fontFamily="system-ui">10</text></>,
    forward: <><path d="M20 10a8 8 0 1 0-1 8M20 4v6h-6" /><text x="12" y="16" textAnchor="middle" fontSize="8" stroke="none" fill="currentColor" fontFamily="system-ui">10</text></>,
    headphones: <><path d="M4 14v-3a8 8 0 0 1 16 0v3" /><rect x="3" y="11" width="4" height="9" rx="2" /><rect x="17" y="11" width="4" height="9" rx="2" /></>,
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
    heart: (
      <path d="M20 5a5 5 0 0 0-8 1 5 5 0 0 0-8-1c-5 5 8 15 8 15S25 10 20 5Z" />
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
