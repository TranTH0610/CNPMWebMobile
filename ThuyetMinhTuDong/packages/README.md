# Tra cứu thư mục packages sau khi sắp xếp

Chỉ di chuyển file theo chức năng và cập nhật import/export/đường dẫn test liên quan. Không thêm chức năng, đổi thuật toán, sửa dữ liệu, đổi cách đếm QR, hoặc khởi động lại server RAM.

## Các package

| Vị trí | Chức năng |
| --- | --- |
| `admin-core/` | Phần dùng chung của quản lý: mô hình, nghiệp vụ, API và hook. |
| `visitor-core/` | Phần dùng chung của du khách: danh mục, ngôn ngữ, QR, hành trình và phiên hoạt động. |
| `place-core/` | Logic theo kiểu Place cũ, được giữ lại để tương thích với phần dự án trước đó. |
| `shared-types/` | Kiểu TypeScript của luồng Place và dữ liệu dùng chung. |
| `api-client/` | Các hàm gọi API chung đã có. |
| `ui-tokens/` | Bộ giá trị màu, spacing và bo góc cho cả hai giao diện. |

## Ý nghĩa các nhóm

| Thư mục trong src | Đặt loại file nào? |
| --- | --- |
| domain/ | Kiểu dữ liệu, hợp đồng và quy tắc kiểm tra nghiệp vụ. |
| catalog/ | Đọc, tìm kiếm và trình bày danh mục du khách. |
| data/ | Dữ liệu mẫu và thông tin ảnh. |
| i18n/ | Các bộ chuỗi đa ngôn ngữ. |
| links/ | Kiểm tra URL website và QR/deep link. |
| journey/ | Thuyết minh, hành trình, bản đồ và provider liên quan. |
| presence/ | Client heartbeat và hook thống kê phiên đang dùng. |
| react/ | Provider/hook React dùng chung giữa web và mobile. |
| services/ | Adapter lưu trữ hoặc gọi HTTP của Admin. |
| hooks/ | Hook riêng như useDebounce trong place-core. |
| tests/ | Test của từng package; không phải mã giao diện. |

## Cây source/config/test

Không liệt kê node_modules và .test-build vì đó là thư viện hoặc kết quả tạo tự động.

```text
packages/
├── admin-core/
│   ├── src/
│   │   ├── domain/
│   │   │   ├── contracts.ts
│   │   │   ├── models.ts
│   │   │   └── validation.ts
│   │   ├── i18n/
│   │   │   └── messages.ts
│   │   ├── react/
│   │   │   └── react.tsx
│   │   ├── services/
│   │   │   ├── httpService.ts
│   │   │   └── mockService.ts
│   │   └── index.ts
│   ├── tests/
│   │   └── admin.test.cjs
│   ├── package.json
│   ├── tsconfig.json
│   └── tsconfig.test.json
├── api-client/
│   ├── index.ts
│   └── tsconfig.json
├── place-core/
│   ├── src/
│   │   ├── data/
│   │   │   └── mockPlaces.ts
│   │   ├── hooks/
│   │   │   └── useDebounce.ts
│   │   └── index.ts
│   ├── tests/
│   │   └── core.test.cjs
│   ├── package.json
│   └── tsconfig.test.json
├── shared-types/
│   ├── index.ts
│   └── package.json
├── ui-tokens/
│   └── colors.ts
└── visitor-core/
    ├── src/
    │   ├── catalog/
    │   │   ├── catalog.ts
    │   │   ├── presentation.ts
    │   │   └── search.ts
    │   ├── data/
    │   │   ├── mock.ts
    │   │   └── photos.ts
    │   ├── domain/
    │   │   └── model.ts
    │   ├── i18n/
    │   │   ├── journey-messages.ts
    │   │   ├── messages.ts
    │   │   ├── qr-messages.ts
    │   │   └── uiMessages.ts
    │   ├── journey/
    │   │   ├── journey-data.ts
    │   │   ├── journey-react.tsx
    │   │   └── journey.ts
    │   ├── links/
    │   │   ├── qr.ts
    │   │   └── site.ts
    │   ├── presence/
    │   │   ├── presence-react.ts
    │   │   └── presence.ts
    │   ├── react/
    │   │   └── react.tsx
    │   └── index.ts
    ├── tests/
    │   ├── core.test.cjs
    │   ├── journey.test.cjs
    │   ├── locale.test.cjs
    │   └── site.test.cjs
    ├── package.json
    ├── tsconfig.json
    └── tsconfig.test.json
```

## Vai trò từng file source và test

Tất cả đường dẫn dưới đây bắt đầu từ thư mục `packages/`.

| File | Chức năng |
| --- | --- |
| [visitor-core/src/index.ts](visitor-core/src/index.ts) | Điểm xuất logic công khai của visitor-core; giữ nguyên tên import bên ngoài. |
| [visitor-core/src/domain/model.ts](visitor-core/src/domain/model.ts) | Kiểu dữ liệu địa điểm, ngôn ngữ, danh mục và các hợp đồng nền tảng. |
| [visitor-core/src/catalog/catalog.ts](visitor-core/src/catalog/catalog.ts) | Đọc danh sách/chi tiết và chọn đúng nội dung đã công bố. |
| [visitor-core/src/catalog/search.ts](visitor-core/src/catalog/search.ts) | Bỏ dấu, tìm kiếm, lọc, sắp xếp, phân trang và khoảng cách. |
| [visitor-core/src/catalog/presentation.ts](visitor-core/src/catalog/presentation.ts) | Thông tin trình bày danh mục và tài nguyên ảnh dùng chung. |
| [visitor-core/src/data/mock.ts](visitor-core/src/data/mock.ts) | Dữ liệu địa điểm mẫu và nguồn catalog mô phỏng. |
| [visitor-core/src/data/photos.ts](visitor-core/src/data/photos.ts) | Thông tin ảnh, tên/chú thích và nguồn ảnh địa điểm. |
| [visitor-core/src/i18n/messages.ts](visitor-core/src/i18n/messages.ts) | Tập hợp bản dịch giao diện du khách. |
| [visitor-core/src/i18n/uiMessages.ts](visitor-core/src/i18n/uiMessages.ts) | Bản dịch các nhãn tìm kiếm, danh sách và điều khiển giao diện. |
| [visitor-core/src/i18n/qr-messages.ts](visitor-core/src/i18n/qr-messages.ts) | Bản dịch thông báo liên kết và QR. |
| [visitor-core/src/i18n/journey-messages.ts](visitor-core/src/i18n/journey-messages.ts) | Bản dịch nghe thuyết minh, bản đồ và hành trình. |
| [visitor-core/src/links/qr.ts](visitor-core/src/links/qr.ts) | Kiểm tra và phân tích liên kết QR/deep link hợp lệ. |
| [visitor-core/src/links/site.ts](visitor-core/src/links/site.ts) | Chuẩn hóa, kiểm tra địa chỉ website dùng chung. |
| [visitor-core/src/journey/journey.ts](visitor-core/src/journey/journey.ts) | Bộ điều khiển audio, tiến độ, vị trí và thứ tự tham quan. |
| [visitor-core/src/journey/journey-data.ts](visitor-core/src/journey/journey-data.ts) | Dữ liệu điểm trên bản đồ và thứ tự tham quan. |
| [visitor-core/src/journey/journey-react.tsx](visitor-core/src/journey/journey-react.tsx) | Provider/hook React để màn hình dùng bộ điều khiển hành trình. |
| [visitor-core/src/presence/presence.ts](visitor-core/src/presence/presence.ts) | Client API phiên hoạt động và bộ gửi heartbeat. |
| [visitor-core/src/presence/presence-react.ts](visitor-core/src/presence/presence-react.ts) | Hook React đọc thống kê phiên hoạt động. |
| [visitor-core/src/react/react.tsx](visitor-core/src/react/react.tsx) | Provider ngôn ngữ, catalog và các hook React cho du khách. |
| [admin-core/src/index.ts](admin-core/src/index.ts) | Điểm xuất kiểu dữ liệu, nghiệp vụ và adapter Admin. |
| [admin-core/src/domain/models.ts](admin-core/src/domain/models.ts) | Kiểu document, workflow, phiên bản, danh tính và lỗi Admin. |
| [admin-core/src/domain/contracts.ts](admin-core/src/domain/contracts.ts) | Hợp đồng AdminService/StoragePort để thay nguồn lưu mà giữ giao diện. |
| [admin-core/src/domain/validation.ts](admin-core/src/domain/validation.ts) | Kiểm tra biểu mẫu, điều kiện duyệt và thống kê nội dung. |
| [admin-core/src/services/mockService.ts](admin-core/src/services/mockService.ts) | Nghiệp vụ Admin mô phỏng: lưu, dịch/audio mẫu, duyệt, công bố, lưu trữ và xóa. |
| [admin-core/src/services/httpService.ts](admin-core/src/services/httpService.ts) | Adapter HTTP, polling phiên bản và client ghi nhận/thống kê QR. |
| [admin-core/src/react/react.tsx](admin-core/src/react/react.tsx) | AdminProvider, hook dữ liệu, trạng thái tác vụ và thống kê QR. |
| [admin-core/src/i18n/messages.ts](admin-core/src/i18n/messages.ts) | Bản dịch giao diện quản lý đủ năm ngôn ngữ. |
| [place-core/src/index.ts](place-core/src/index.ts) | Logic tìm kiếm, danh mục, sắp xếp và service theo kiểu Place cũ. |
| [place-core/src/data/mockPlaces.ts](place-core/src/data/mockPlaces.ts) | Dữ liệu mẫu của luồng Place cũ. |
| [place-core/src/hooks/useDebounce.ts](place-core/src/hooks/useDebounce.ts) | Hook chờ người dùng ngừng gõ trước khi xử lý. |
| [shared-types/index.ts](shared-types/index.ts) | Kiểu dữ liệu chung như Place, nội dung đa ngôn ngữ và kết quả thuyết minh. |
| [api-client/index.ts](api-client/index.ts) | Hàm gọi API chuyển audio thành văn bản đã có trong dự án. |
| [ui-tokens/colors.ts](ui-tokens/colors.ts) | Màu, khoảng cách và bo góc dùng chung web/mobile. |
| [visitor-core/tests/core.test.cjs](visitor-core/tests/core.test.cjs) | Test catalog, tìm kiếm, danh mục, sắp xếp và QR. |
| [visitor-core/tests/locale.test.cjs](visitor-core/tests/locale.test.cjs) | Test tính đầy đủ và nội dung bản dịch. |
| [visitor-core/tests/site.test.cjs](visitor-core/tests/site.test.cjs) | Test địa chỉ website và liên kết. |
| [visitor-core/tests/journey.test.cjs](visitor-core/tests/journey.test.cjs) | Test audio, vị trí và vòng đời hành trình. |
| [admin-core/tests/admin.test.cjs](admin-core/tests/admin.test.cjs) | Test validation, revision, workflow và tính bất biến khi thao tác Admin. |
| [place-core/tests/core.test.cjs](place-core/tests/core.test.cjs) | Test bỏ dấu, tìm kiếm, lọc, sắp xếp và service kiểu Place. |

## File cấu hình

| File | Chức năng |
| --- | --- |
| `admin-core/package.json` | Tên package, dependency, điểm xuất công khai và lệnh của package. |
| `place-core/package.json` | Tên package, dependency, điểm xuất công khai và lệnh của package. |
| `shared-types/package.json` | Tên package, dependency, điểm xuất công khai và lệnh của package. |
| `visitor-core/package.json` | Tên package, dependency, điểm xuất công khai và lệnh của package. |
| `admin-core/tsconfig.json` | Cấu hình kiểm tra TypeScript của package. |
| `admin-core/tsconfig.test.json` | Cấu hình biên dịch TypeScript phục vụ test Node. |
| `api-client/tsconfig.json` | Cấu hình kiểm tra TypeScript của package. |
| `place-core/tsconfig.test.json` | Cấu hình biên dịch TypeScript phục vụ test Node. |
| `visitor-core/tsconfig.json` | Cấu hình kiểm tra TypeScript của package. |
| `visitor-core/tsconfig.test.json` | Cấu hình biên dịch TypeScript phục vụ test Node. |

## Import của ứng dụng giữ nguyên

```typescript
import { createCatalog } from '@travelguide/visitor-core'
import { useVisitor } from '@travelguide/visitor-core/react'
import { JourneyProvider } from '@travelguide/visitor-core/journey/react'
import { MAP_POINTS } from '@travelguide/visitor-core/journey/data'
import { createPresenceClient } from '@travelguide/visitor-core/presence'
import { useAdmin } from '@travelguide/admin-core/react'
```

package.json trỏ các tên import trên tới vị trí file mới. Không cần tự đổi import trong màn hình thành đường dẫn sâu vào src.

`place-core`, `shared-types`, `api-client` và `ui-tokens` được giữ riêng. Các file đơn ở package nhỏ không bị chuyển qua nhiều tầng thư mục không cần thiết. Luồng Place cũ vẫn được giữ, không xóa khi chỉ sắp xếp.

## File tự sinh

- `node_modules/`: npm quản lý dependency, không sửa hoặc di chuyển thủ công.
- `.test-build/`: kết quả biên dịch cho test, không phải source để sửa. File cũ có thể còn trong output từ lần chạy trước; test đã trỏ đúng cấu trúc mới.
- `src/index.ts`: điểm xuất công khai, tiếp tục nằm ở gốc src.

Bảng đường dẫn cũ → mới: `../docs/PACKAGES_DI_CHUYEN.json`.

Sau khi thay vị trí file, nếu Vite/Expo đang giữ cache đường dẫn cũ thì dừng rồi chạy lại dev server; Expo có thể thêm `--clear`. Không cần khởi động lại Catalog RAM để áp dụng việc sắp xếp FE đang chạy, tránh mất dữ liệu RAM hiện tại. Khi khởi động Catalog ở lần sau, server bundle từ entry mới như bình thường.
