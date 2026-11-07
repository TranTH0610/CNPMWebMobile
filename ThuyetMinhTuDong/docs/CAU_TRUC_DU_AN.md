# Cấu trúc mobile và web sau khi sắp xếp

Thư mục dự án: `D:/3.HTML/Đồ án CNPM/ThuyetMinhTuDong`.

## Nguyên tắc

- App chỉ ghép provider và điều hướng; UI nằm trong ứng dụng tương ứng.
- Màn mobile ở screens, trang web ở pages, thành phần nhỏ ở components.
- navigation chứa route; services chứa kết nối thiết bị/trình duyệt; hooks chứa điểm import hooks và điều phối riêng nền tảng.
- i18n trong mỗi app tạo instance; bộ chữ năm ngôn ngữ và nghiệp vụ dùng chung vẫn ở packages/visitor-core. Các hook mỏng re-export triển khai chung, không tạo trạng thái/nguồn dữ liệu thứ hai.
- Bỏ src/visitor cùng các bản code mobile cũ không được App hiện tại gọi. Không còn hai màn Detail/MainTabs/Home song song.
- AddPlaceScreen, LanguageScreen lần đầu, auto-translate/cache của luồng cũ chưa được app visitor gọi trước khi sắp xếp. Việc này không bổ sung hay khôi phục các tính năng đó; bản nguồn cũ được lưu lại để ghép khi xác định phạm vi.

## Vai trò thư mục

| Mobile | Web | Vai trò |
|---|---|---|
| src/screens | src/pages | Mỗi màn/trang một file |
| src/components | src/components | Card, tìm kiếm, chọn ngôn ngữ, player, marker |
| src/navigation | src/navigation | Stack/tab/deep link hoặc React Router |
| src/hooks | src/hooks | Hook import của app; điều hướng GPS và lưu khi ra nền |
| src/services | src/services | AsyncStorage/expo-audio/GPS hoặc localStorage/HTML Audio/GPS |
| src/i18n | src/i18n | Khởi tạo i18n của app, dùng chung resource |
| src/providers | main.tsx | Ghép provider một lần |
| src/GiaoDienChung.ts, src/styles | src/styles | Style native hoặc CSS |
| assets/demo-audio | static/demo-audio | Năm MP3 dùng thật |
| Không tạo store rỗng | Không tạo store rỗng | Trạng thái nằm trong provider chung, tránh tạo trùng |

## Luồng chạy

Mobile: index.js → App.tsx → AppProviders → RootNavigator → MainTabs/screens.
Web: index.html → main.tsx → App → AppRoutes → AppLayout → pages. Player ở layout/root để không bị hủy khi đổi màn/trang.

## Đổi đường dẫn

| File/nhóm cũ | Vị trí mới |
|---|---|
| `apps/mobile/src/visitor/ui.tsx` | `apps/mobile/src/shared/components/index.ts` |
| `apps/mobile/src/visitor/ExploreUI.tsx` | `apps/mobile/src/shared/components/index.ts` |
| `apps/mobile/src/visitor/ManDanhSachDiTich.tsx` | `apps/mobile/src/features/explore/screens/ManKhamPha.tsx` |
| `apps/mobile/src/visitor/ManChiTietDiTich.tsx` | `apps/mobile/src/features/place-detail/screens/ManChiTietDiTich.tsx` |
| `apps/mobile/src/visitor/ScanScreen.tsx` | `apps/mobile/src/screens/ScanScreen.tsx` |
| `apps/mobile/src/visitor/ThanhDieuHuongDuKhach.tsx` | `apps/mobile/src/navigation/ThanhDieuHuongDuKhach.tsx` |
| `apps/mobile/src/visitor/KetNoiNenTang.ts` | `apps/mobile/src/shared/services/KetNoiNenTang.ts` |
| `apps/mobile/src/visitor/journey-adapters.ts` | `apps/mobile/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts` |
| `apps/mobile/src/visitor/LienKetMoUngDung.ts` | `apps/mobile/src/navigation/LienKetMoUngDung.ts` |
| `apps/mobile/src/visitor/KieuDieuHuongDuKhach.ts` | `apps/mobile/src/navigation/KieuDieuHuongDuKhach.ts` |
| `apps/mobile/src/visitor/WebAccessCard.tsx` | `apps/mobile/src/components/WebAccessCard.tsx` |
| `apps/mobile/src/visitor/KieuTaiNguyen.d.ts` | `apps/mobile/src/types/KieuTaiNguyen.d.ts` |
| `apps/web/src/ui.tsx` | `apps/web/src/shared/components/index.ts` |
| `apps/web/src/KetNoiNenTang.ts` | `apps/web/src/shared/services/KetNoiNenTang.ts` |
| `apps/web/src/journey-adapters.ts` | `apps/web/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts` |
| `apps/web/src/styles.css` | `apps/web/src/shared/styles/GiaoDienNen.css` |
| apps/mobile/src/visitor/Journey.tsx | components/ListenButton, JourneyPlayer, VisitorMap; screens/JourneyScreen; hooks/useJourneyNavigation |
| apps/mobile/src/visitor/ExploreUI.tsx | components/Cover, SearchBar, CategoryChips, SortDropdown, PlaceCard; styles/explore |
| apps/web/src/Explore.tsx | pages/HomePage, PlacesPage; components/Catalogue |
| apps/web/src/pages.tsx | pages/DetailPage, QrPage; components/QrImage |
| apps/web/src/Journey.tsx | pages/JourneyPage; components/ListenButton, JourneyPlayer, VisitorMap; hooks/useJourneyNavigation |
| apps/web/src/vite-vne.d.ts | src/vite-env.d.ts đúng khai báo Vite |
| apps/web/public/index.html | Bỏ bản HTML cũ không được dùng; giữ apps/web/index.html |

## Bản sao trước khi xóa

`C:/Users/gauba/OneDrive/Documents/ChatGPT/CNPM 6/reviews/restructure-20261023` chứa src nguyên bản của mobile/web, cấu hình, before.patch và manifest.json. Không nằm trong mã ứng dụng. Không tự xóa bản sao này.

## File nguồn và trách nhiệm

| File | Chức năng/khai báo chính |
|---|---|
| `apps/mobile/src/features/explore/hooks/useDanhSachDiTich.ts` | Xuất kiểu/hooks hoặc khai báo module dùng chung |
| `apps/mobile/src/features/language/hooks/useDuKhach.ts` | Xuất kiểu/hooks hoặc khai báo module dùng chung |
| `apps/mobile/src/features/journey/hooks/useHanhTrinh.ts` | Xuất kiểu/hooks hoặc khai báo module dùng chung |
| `apps/mobile/src/features/language/i18n/CauHinhNgonNgu.ts` | boot |
| `apps/web/src/features/explore/hooks/useDanhSachDiTich.ts` | Xuất kiểu/hooks hoặc khai báo module dùng chung |
| `apps/web/src/features/language/hooks/useDuKhach.ts` | Xuất kiểu/hooks hoặc khai báo module dùng chung |
| `apps/web/src/features/journey/hooks/useHanhTrinh.ts` | Xuất kiểu/hooks hoặc khai báo module dùng chung |
| `apps/web/src/features/language/i18n/CauHinhNgonNgu.ts` | boot |
| `apps/mobile/src/shared/GiaoDienChung.ts` | ui |
| `apps/mobile/src/features/explore/GiaoDienKhamPha.ts` | explore |
| `apps/mobile/src/shared/components/NutThaoTac.tsx` | Action |
| `apps/mobile/src/features/language/components/ThanhChonNgonNgu.tsx` | LanguageBar |
| `apps/mobile/src/components/DemoNotice.tsx` | DemoNotice |
| `apps/mobile/src/shared/components/TrangThaiDuLieu.tsx` | State |
| `apps/mobile/src/shared/components/AnhDiTich.tsx` | PlaceImage |
| `apps/mobile/src/shared/components/AnhBia.tsx` | Cover |
| `apps/mobile/src/features/explore/components/OTimKiem.tsx` | SearchBar |
| `apps/mobile/src/features/explore/components/NutLocDanhMuc.tsx` | CategoryChips |
| `apps/mobile/src/features/explore/components/ChonSapXep.tsx` | SortDropdown |
| `apps/mobile/src/features/explore/components/TheDiTich.tsx` | PlaceCard |
| `apps/mobile/src/features/journey/components/NutNgheThuyetMinh.tsx` | ListenButton |
| `apps/mobile/src/features/journey/components/TrinhNgheThuyetMinh.tsx` | clock, JourneyPlayer, styles |
| `apps/mobile/src/features/journey/hooks/useDieuHuongHanhTrinh.ts` | useJourneyNavigation |
| `apps/mobile/src/features/journey/components/BanDoThamQuan.tsx` | VisitorMap, styles |
| `apps/mobile/src/features/journey/screens/ManHanhTrinh.tsx` | JourneyScreen |
| `apps/mobile/src/features/place-detail/screens/ManChiTietDiTich.tsx` | DetailScreen |
| `apps/mobile/src/screens/ScanScreen.tsx` | ScanScreen |
| `apps/mobile/src/shared/services/KetNoiNenTang.ts` | storage, webOrigin, qrPolicy, getPosition |
| `apps/mobile/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts` | demo, journeyAdapters |
| `apps/mobile/src/navigation/LienKetMoUngDung.ts` | linking |
| `apps/mobile/src/navigation/KieuDieuHuongDuKhach.ts` | VisitorStack |
| `apps/mobile/src/components/WebAccessCard.tsx` | WebAccessCard |
| `apps/mobile/src/types/KieuTaiNguyen.d.ts` | *.mp3 |
| `apps/mobile/src/features/explore/screens/ManKhamPha.tsx` | HomeScreen |
| `apps/mobile/src/features/settings/screens/ManCaiDat.tsx` | SettingsScreen |
| `apps/mobile/src/screens/PlaceholderScreen.tsx` | PlaceholderScreen |
| `apps/mobile/src/navigation/ThanhDieuHuongDuKhach.tsx` | Tabs, MainTabs |
| `apps/mobile/src/features/explore/screens/ManKetQuaTimKiem.tsx` | SearchResultScreen |
| `apps/mobile/src/navigation/DieuHuongGoc.tsx` | Stack, navigationRef, openSuggested, RootNavigator |
| `apps/mobile/src/app/TrangThaiUngDung.tsx` | deviceLanguage, AppProviders |
| `apps/mobile/App.tsx` | App |
| `apps/mobile/src/shared/components/index.ts` | Xuất kiểu/hooks hoặc khai báo module dùng chung |
| `apps/web/src/shared/components/BieuTuong.tsx` | Icon |
| `apps/web/src/features/language/components/ChonNgonNgu.tsx` | LanguagePicker |
| `apps/web/src/shared/components/TrangThaiDuLieu.tsx` | State |
| `apps/web/src/shared/components/AnhDiTich.tsx` | PlaceImage |
| `apps/web/src/features/explore/components/NutLocDanhMuc.tsx` | CategoryChips |
| `apps/web/src/features/explore/components/TheDiTich.tsx` | PlaceCard |
| `apps/web/src/shared/components/index.ts` | Xuất kiểu/hooks hoặc khai báo module dùng chung |
| `apps/web/src/features/explore/components/DanhSachVaBoLoc.tsx` | Data, Catalogue |
| `apps/web/src/features/explore/pages/TrangChu.tsx` | HomePage |
| `apps/web/src/features/explore/pages/TrangDanhSachDiTich.tsx` | PlacesPage |
| `apps/web/src/components/QrImage.tsx` | QrImageState, QrImage |
| `apps/web/src/features/place-detail/pages/TrangChiTietDiTich.tsx` | DetailPage |
| `apps/web/src/pages/QrPage.tsx` | QrPage |
| `apps/web/src/features/journey/components/NutNgheThuyetMinh.tsx` | ListenButton |
| `apps/web/src/features/journey/components/TrinhNgheThuyetMinh.tsx` | clock, JourneyPlayer |
| `apps/web/src/features/journey/components/BanDoThamQuan.tsx` | VisitorMap |
| `apps/web/src/features/journey/pages/TrangHanhTrinh.tsx` | JourneyPage |
| `apps/web/src/features/journey/hooks/useDieuHuongHanhTrinh.ts` | useJourneyNavigation |
| `apps/web/src/shared/services/KetNoiNenTang.ts` | storage, getPosition, publicSiteOrigin, qrPolicy |
| `apps/web/src/features/journey/adapters/KetNoiAudioVaDinhVi.ts` | mediaOwner, journeyAdapters |
| `apps/web/src/shared/layouts/ThanhDieuHuong.tsx` | Navbar |
| `apps/web/src/shared/layouts/ChanTrang.tsx` | Footer |
| `apps/web/src/shared/layouts/BoCucDuKhach.tsx` | AppLayout |
| `apps/web/src/pages/AboutPage.tsx` | AboutPage |
| `apps/web/src/shared/pages/TrangKhongTimThay.tsx` | NotFoundPage |
| `apps/web/src/app/DinhTuyenDuKhach.tsx` | AppRoutes |
| `apps/web/src/app/App.tsx` | App |
| `apps/web/src/main.tsx` | root |
| `apps/web/src/vite-env.d.ts` | Xuất kiểu/hooks hoặc khai báo module dùng chung |

## Kiểm tra và chạy thử

```powershell
cd "D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong"
npm run typecheck
npm run lint
npm test
npm run build:web
npm run dev --workspace=web -- --port 5173 --strictPort
```

Mobile (terminal khác):

```powershell
cd "D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile"
npx expo start --clear
```

Lint/typecheck mobile hiện bao phủ toàn bộ src. Không thêm dependency và không đổi khóa lang/visitor-journey-v1, route /places/:id, /journey, /qr hoặc đường dẫn asset.

Commit đề xuất: `refactor(apps): organize mobile and web by responsibility and remove legacy sources`.

## Kết quả kiểm tra sau sắp xếp

- TypeScript/lint toàn bộ mobile và web: qua.
- 40 test hiện tại: qua, gồm 2 test thêm cho bấm Pause khi Play/Resume chưa hoàn tất.
- Build web và Expo export Android: qua.
- Web thực tế: tìm ngo mon ra một kết quả; marker mở đúng chi tiết; player giữ phiên qua trang; QR chung hiển thị.
- Chưa kiểm tra UI/GPS/background audio trên thiết bị Android/iOS thật trong lần sắp xếp này.
