/**
 * FILE NÀY LÀM GÌ: Ghép điều hướng web với hook GPS/lưu tiến độ.
 * Vị trí: apps/web/src/App.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { AppRoutes } from './navigation/AppRoutes'
import { useJourneyNavigation } from './hooks/useJourneyNavigation'

export default function App() { useJourneyNavigation(); return <AppRoutes /> }
