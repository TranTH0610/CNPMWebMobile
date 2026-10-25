/** FILE NÀY LÀM GÌ: Kiểu route Admin native; AdminNavigator và màn hình dùng.
 * UC12–UC17, không có màn Login. */
export type AdminStack = { Dashboard: undefined; AdminPlaces: undefined; PlaceForm: { id?: string } | undefined; Content: { id: string }; Reviews: undefined }
/* CÁCH KIỂM TRA: Content thiếu id phải báo TypeScript. */
