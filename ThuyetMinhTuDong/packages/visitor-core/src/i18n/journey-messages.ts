/**
 * FILE NÀY LÀM GÌ: Chữ giao diện UC06–UC11, đủ năm ngôn ngữ.
 * messages.ts ghép vào i18n; thứ tự cột được kiểm tra để tránh thiếu/nhầm key.
 */
import type { Language } from '../domain/model'
const keys = ['jTitle','jPlay','jPause','jResume','jReplay','jBack','jForward','jSpeed','jSeek','jGpsOn','jGpsOff',
  'jReference','jNoNearby','gpsWeak','gpsFailed','audioMissing','audioFailed','saveFailed','savedInvalid',
  'jContinue','jDiscard','jVersionChanged','jMap','jRoutes','jPreview','jRouteInvalid','jUseRoute','jSkipRoute',
  'jOpenPlace','jSource','jWalkingPending','jPreparing','jEnded','jPaused','jPlaying','jExternalMap','jMyLocation','jRetry'] as const
type Key = typeof keys[number]
const rows: Record<Language, readonly string[]> = {
  vi: ['Hành trình & thuyết minh','Nghe thuyết minh','Tạm dừng','Tiếp tục','Nghe lại','Lùi 10 giây','Tiến 10 giây','Tốc độ','Thời điểm nghe','Bật gợi ý GPS','Tắt gợi ý GPS',
    'Tọa độ tham khảo OpenStreetMap; chưa khảo sát điểm đón GPS. Gợi ý trong 100 m không xác nhận đã vào công trình.','Chưa có điểm trong 100 m hoặc chưa có vị trí phù hợp.','GPS quá cũ hoặc thiếu chính xác. Đang chờ cập nhật.','Không lấy được GPS; bạn vẫn chọn địa điểm trên danh sách/bản đồ được.','Chưa có audio đã công bố cho ngôn ngữ này.','Không phát được audio. Hãy thử lại; vẫn có thể đọc văn bản.','Không lưu được tiến độ trên thiết bị.','Bản lưu không hợp lệ hoặc bài không còn công bố.',
    'Tiếp tục bài đã lưu','Bỏ qua','Phiên bản đã thay đổi. Nếu tiếp tục, bài mới sẽ phát từ đầu.','Bản đồ','Tuyến tham quan','Thứ tự tham khảo — chưa phải tuyến đi bộ đã duyệt.','Tuyến có điểm không còn công bố hoặc không khả dụng.','Xem thứ tự này','Tự khám phá','Xem địa điểm','Nguồn tọa độ','Chưa có lối đi được xác nhận; không vẽ đường nối xuyên tường/cổng.','Đang chuẩn bị audio…','Đã kết thúc','Đã tạm dừng','Đang phát','Mở vị trí trên bản đồ ngoài','Vị trí của bạn','Thử lại'],
  en: ['Journey & narration','Listen','Pause','Resume','Replay','Back 10 seconds','Forward 10 seconds','Speed','Playback position','Enable GPS suggestions','Disable GPS suggestions',
    'OpenStreetMap reference coordinates; GPS arrival points have not been surveyed. A suggestion within 100 m does not confirm entry.','No suitable place within 100 m or location unavailable.','Location is stale or inaccurate. Waiting for an update.','GPS unavailable; the list and map remain usable.','No published audio in this language.','Audio unavailable. Retry or read the text.','Could not save progress on this device.','Saved progress is invalid or content is no longer published.',
    'Continue saved narration','Skip','The version changed. Continuing starts the new version from the beginning.','Map','Visitor routes','Reference order — not an approved walking route.','A stop is unavailable or no longer published.','View this order','Explore freely','Open place','Coordinate source','Walking paths are unverified; no straight routes through walls or gates are drawn.','Preparing audio…','Finished','Paused','Playing','Open location in external map','Your location','Retry'],
  cn: ['行程与讲解','收听讲解','暂停','继续','重新播放','后退10秒','前进10秒','速度','播放位置','开启GPS推荐','关闭GPS推荐',
    '坐标来自OpenStreetMap，仅供参考，GPS到达点尚未实地核实。100米内的推荐不代表已进入建筑。','100米内暂无合适景点或无法定位。','定位过旧或不准确，等待更新。','无法获取GPS，仍可使用列表和地图。','此语言暂无已发布音频。','无法播放音频，请重试或阅读文字。','无法在设备上保存进度。','保存记录无效或内容已撤回。',
    '继续上次讲解','跳过','版本已更新，继续将从头播放新版。','地图','参观路线','参考顺序，步行路线尚未审核。','路线中的景点不可用或已撤回。','查看此顺序','自由探索','查看景点','坐标来源','步行通道尚未核实，不绘制穿越城墙的直线。','正在准备音频…','已结束','已暂停','正在播放','在外部地图打开位置','您的位置','重试'],
  pt: ['Percurso e narração','Ouvir','Pausar','Continuar','Repetir','Recuar 10 segundos','Avançar 10 segundos','Velocidade','Posição de reprodução','Ativar sugestões GPS','Desativar sugestões GPS',
    'Coordenadas de referência OpenStreetMap; pontos GPS por verificar no local. Uma sugestão a 100 m não confirma a entrada.','Sem local adequado a 100 m ou localização indisponível.','Localização antiga ou imprecisa. A aguardar atualização.','GPS indisponível; a lista e o mapa continuam disponíveis.','Sem áudio publicado neste idioma.','Não foi possível reproduzir. Tente novamente ou leia o texto.','Não foi possível guardar o progresso.','Registo inválido ou conteúdo retirado.',
    'Continuar narração guardada','Ignorar','A versão mudou. Continuar reproduz a nova versão desde o início.','Mapa','Percursos','Ordem de referência; percurso pedonal não aprovado.','Um local do percurso está indisponível.','Ver esta ordem','Explorar livremente','Ver local','Fonte das coordenadas','Caminhos por confirmar; não são traçadas linhas através de muralhas.','A preparar áudio…','Terminado','Em pausa','A reproduzir','Abrir localização no mapa externo','A sua localização','Tentar novamente'],
  ja: ['見学と音声ガイド','解説を聞く','一時停止','再開','最初から聞く','10秒戻る','10秒進む','再生速度','再生位置','GPS候補を有効にする','GPS候補を無効にする',
    'OpenStreetMapの参考座標です。GPS到着地点は未調査で、100m以内の候補は入場を保証しません。','100m以内に適切なスポットがないか、現在地を取得できません。','位置情報が古いか不正確です。更新を待っています。','GPSを取得できません。リストと地図は利用できます。','この言語の公開音声はありません。','音声を再生できません。再試行するか文章をお読みください。','端末に進捗を保存できません。','保存記録が無効か、コンテンツの公開が終了しました。',
    '保存した解説を再開','スキップ','バージョンが更新されました。新しい音声を最初から再生します。','地図','見学順序','参考順序です。歩行経路は未承認です。','順序内のスポットを利用できません。','この順序を見る','自由に見学','スポットを見る','座標の出典','通路は未確認です。城壁を横切る直線経路は表示しません。','音声を準備中…','終了','一時停止中','再生中','外部地図で位置を開く','現在地','再試行'],
}
export const journeyMessages = Object.fromEntries(Object.entries(rows).map(([language, values]) => {
  if (values.length !== keys.length) throw new Error('Missing journey text: ' + language)
  return [language, Object.fromEntries(keys.map((key, index) => [key, values[index]]))]
})) as Record<Language, Record<Key, string>>

/* CÁCH KIỂM TRA FILE NÀY CHẠY ĐÚNG:
 * - Đổi đủ VI/EN/CN/PT/JA: nhãn GPS/audio phải đổi.
 * - Xóa một ô dịch tạm trong test: kiểm tra độ dài báo lỗi.
 */
