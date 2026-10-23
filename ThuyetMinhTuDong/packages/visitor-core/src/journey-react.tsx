/**
 * FILE NÀY LÀM GÌ: Giữ một phiên nghe/GPS xuyên suốt mọi màn UC06–UC11.
 * App mobile và main.tsx web bọc provider dưới VisitorProvider UC01–UC05.
 * Phụ thuộc JourneyController và các adapter nền tảng; không tự phát lúc khởi động.
 */
import { createContext, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react'
import { JourneyController, type JourneyPorts } from './journey'
import { MAP_POINTS, VISIT_ROUTES } from './journey-data'
import { useVisitor } from './react'

export type JourneyAdapters = Omit<JourneyPorts, 'catalog' | 'positions' | 'routes'>
const Context = createContext<JourneyController | null>(null)

export function JourneyProvider({ adapters, children }: { adapters: JourneyAdapters; children: ReactNode }) {
  const { catalog, language } = useVisitor()
  const engine = useMemo(() => new JourneyController({ ...adapters, catalog, positions: MAP_POINTS, routes: VISIT_ROUTES }), [adapters, catalog])
  // CHỨC NĂNG: Đọc tiến độ nhưng chỉ đề nghị tiếp tục, không tự phát.
  // XỬ LÝ: Cleanup dừng GPS, giải phóng player và vô hiệu hóa request tải cũ.
  useEffect(() => { void engine.start(); return () => engine.dispose() }, [engine])
  useEffect(() => { engine.changeLanguage(language) }, [engine, language])
  return <Context.Provider value={engine}>{children}</Context.Provider>
}

export function useJourney() {
  const engine = useContext(Context)
  if (!engine) throw new Error('JourneyProvider is missing')
  const state = useSyncExternalStore(engine.subscribe, engine.snapshot, engine.snapshot)
  const { changeLanguage } = useVisitor()
  return { engine, state, resumeSaved: async () => {
    const language = state.restore?.language
    if (language) { await changeLanguage(language); await engine.restorePlay() }
  } }
}

/* CÁCH KIỂM TRA FILE NÀY CHẠY ĐÚNG:
 * - Đổi trang khi đang nghe: player không bị tạo lại.
 * - Tải lại ứng dụng: chỉ hiện lời nhắc, chưa tự phát.
 */
