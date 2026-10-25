/** FILE NÀY LÀM GÌ: Entry logic thuần Admin; app import bằng tên package.
 * Phụ thuộc các module bên dưới; React có entry riêng /react. UC12–UC17. */
export * from './domain/models'
export * from './domain/contracts'
export * from './domain/validation'
export * from './services/mockService'
/* CÁCH KIỂM TRA: Import entry này trong test Node không được kéo React/DOM vào. */

export * from './services/httpService'
