/**
 * FILE NÀY LÀM GÌ:
 * Khai báo màn hình và tham số điều hướng UC01–UC05.
 * App, PlacesScreen, DetailScreen và ScanScreen sử dụng.
 * Không phụ thuộc thư viện bên ngoài.
 */

// CHỨC NĂNG: Kiểm tra tên route và dữ liệu khi điều hướng.
// XỬ LÝ: Detail bắt buộc có placeId; hai màn còn lại không có tham số.
export type VisitorStack = {
  Places: undefined
  Detail: {
    placeId: string
  }
  Scan: undefined
}