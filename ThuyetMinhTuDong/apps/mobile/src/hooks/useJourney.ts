/**
 * FILE NÀY LÀM GÌ
 * Điểm import hook hành trình của ứng dụng; dùng lại triển khai chung trong visitor-core.
 *
 * VỊ TRÍ: apps/mobile/src/hooks/useJourney.ts
 * DÙNG BỞI: apps/mobile/src/components/JourneyPlayer.tsx;
 * apps/mobile/src/components/ListenButton.tsx; apps/mobile/src/components/VisitorMap.tsx; và các
 * nơi import khác.
 * PHỤ THUỘC: @travelguide/visitor-core/journey/react
 * TẠI SAO TÁCH FILE: Tách vòng đời và việc đọc trạng thái khỏi UI giúp màn hình dễ theo dõi và
 * dùng lại.
 */
// CHỨC NĂNG: Dùng cùng phiên audio/GPS và tiến độ trên toàn ứng dụng.
// Xuất lại thành phần từ '@travelguide/visitor-core/journey/react'.
export { useJourney } from '@travelguide/visitor-core/journey/react'
