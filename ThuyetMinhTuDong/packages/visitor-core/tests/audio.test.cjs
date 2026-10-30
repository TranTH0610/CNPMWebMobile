/**
 * FILE NÀY LÀM GÌ
 * Kiểm tra nghe thử, pause/resume, tua, âm lượng, tốc độ, đóng nguồn và phối hợp quyền phát.
 *
 * VỊ TRÍ: packages/visitor-core/tests/audio.test.cjs
 * DÙNG BỞI: Bộ chạy test tương ứng trong package.json.
 * PHỤ THUỘC: node:test; node:assert/strict; ../.test-build/audio/preview.js;
 * ../.test-build/audio/playback.js; ../.test-build/journey/journey-data.js;
 * ../.test-build/data/mock.js
 * TẠI SAO TÁCH FILE: Kiểm tra hành vi tự động giúp phát hiện lỗi mà không phải thao tác lại toàn
 * bộ giao diện.
 */
// Khai báo {test}: require nạp module 'node:test' để dùng chức năng có sẵn thay vì chép lại | Khai báo assert: require nạp module 'node:assert/strict' để dùng chức năng có sẵn thay vì chép lại.
const {test}=require('node:test'),assert=require('node:assert/strict')
// Khai báo {PreviewController}: require nạp module '../.test-build/audio/preview.js' để dùng chức năng có sẵn thay vì chép lại.
const {PreviewController}=require('../.test-build/audio/preview.js')
// Khai báo {PlaybackCoordinator}: require nạp module '../.test-build/audio/playback.js' để dùng chức năng có sẵn thay vì chép lại.
const {PlaybackCoordinator}=require('../.test-build/audio/playback.js')
// Khai báo {mapPointFor,MAP_POINTS}: require nạp module '../.test-build/journey/journey-data.js' để dùng chức năng có sẵn thay vì chép lại.
const {mapPointFor,MAP_POINTS}=require('../.test-build/journey/journey-data.js')
// Khai báo {MOCK_PLACES}: require nạp module '../.test-build/data/mock.js' để dùng chức năng có sẵn thay vì chép lại.
const {MOCK_PLACES}=require('../.test-build/data/mock.js')
// Khai báo track(coordinator). Nhận đầu vào qua tham số.
function track(coordinator){
 // CHỨC NĂNG: Các callback nhận thay đổi; dùng Set để không đăng ký trùng cùng tham chiếu.
 // Khai báo listeners: Set giữ các phần tử duy nhất để tránh đăng ký hoặc đếm trùng.
 const listeners=new Set()
 // Khai báo t: tạo object gồm position, duration, playing, disposed, plays, seeks, play, pause, seek. | Gán thuộc tính position: giá trị số 0. | Gán thuộc tính duration: giá trị số 35. | Gán thuộc tính playing: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính disposed: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính plays: giá trị số 0. | Gán thuộc tính seeks: tạo mảng [].
 const t={position:0,duration:35,playing:false,disposed:false,plays:0,seeks:[],
  // Khai báo play(). Nhận đầu vào qua tham số. | Thực hiện coordinator?.claim nhận quyền phát của bộ điều phối. | Thực hiện tính biểu thức t.playing=true. | Thực hiện sử dụng t.plays++ làm giá trị của bước hiện tại. | Thực hiện Gọi t.emit().
  async play(){coordinator?.claim(t);t.playing=true;t.plays++;t.emit()},
  // TẠI SAO (play): Kiểm tra hành vi tự động giúp phát hiện lỗi mà không phải thao tác lại toàn bộ
  // giao diện.
  // CHỨC NĂNG: Tạm dừng nguồn hiện tại.
  // XỬ LÝ: Giữ track và thời điểm đang nghe; không tua về đầu hoặc mở lại URL.
  // TẠI SAO (pause): Giữ track khi dừng giúp tiếp tục đúng thời điểm, đồng thời không phát sinh
  // thêm nguồn âm thanh.
  // Khai báo pause(). Nhận đầu vào qua tham số. | Thực hiện tính biểu thức t.playing=false. | Thực hiện Gọi t.emit(). | Khai báo seek(value). Nhận đầu vào qua tham số. | Thực hiện tính biểu thức t.position=value. | Thực hiện Gọi t.seeks.push(value). | Khai báo rate(). Nhận đầu vào qua tham số.
  pause(){t.playing=false;t.emit()},async seek(value){t.position=value;t.seeks.push(value);t.emit()},rate(){},
  // Khai báo listen(fn). Nhận đầu vào qua tham số. | Thực hiện listeners.add đăng ký một callback nhận thay đổi. | Trả kết quả: khai báo callback ()=>listeners.delete(fn).
  listen(fn){listeners.add(fn);return()=>listeners.delete(fn)},
  // TẠI SAO (listen): Kiểm tra hành vi tự động giúp phát hiện lỗi mà không phải thao tác lại toàn
  // bộ giao diện.
  // CHỨC NĂNG: Dọn controller khi nơi sở hữu kết thúc.
  // XỬ LÝ: Dừng nguồn/timer/listener liên quan để không còn xử lý chạy sau khi rời luồng.
  // Khai báo dispose(). Nhận đầu vào qua tham số. | Thực hiện tính biểu thức t.disposed=true. | Thực hiện t.pause tạm dừng nguồn âm thanh hiện tại. | Thực hiện coordinator?.release trả quyền phát nếu nguồn này đang sở hữu, tránh xóa quyền của nguồn mới.
  dispose(){t.disposed=true;t.pause();coordinator?.release(t)},
  // TẠI SAO (dispose): Timer, GPS và audio có vòng đời riêng; không dọn sẽ tiếp tục hoạt động khi
  // component sở hữu đã rời.
  // TẠI SAO (emit): Dữ liệu hoặc adapter giả có kiểm soát giúp test đúng tình huống mà không cần
  // mạng, GPS hay loa thật.
  // Khai báo emit(ended). Nhận đầu vào qua tham số. | Thực hiện Gọi listeners.forEach(fn=>fn({position:t.position,duration:t.duration,playing:t.playing,ended}. | Gán thuộc tính position: đọc t.position từ đối tượng/mảng để dùng tại bước hiện tại. Giữ vị trí theo ngữ cảnh: tọa độ địa điểm hoặc thời điểm audio. | Gán thuộc tính duration: đọc t.duration từ đối tượng/mảng để dùng tại bước hiện tại. Thời lượng bài nghe dùng để giới hạn tua và hiển thị thanh tiến độ. | Gán thuộc tính playing: đọc t.playing từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Đặt trường ended bằng giá trị của biến cùng tên.
  emit(ended=false){listeners.forEach(fn=>fn({position:t.position,duration:t.duration,playing:t.playing,ended}))}}
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return t`: Trả kết quả: sử dụng t làm giá trị của bước hiện tại.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return t
}
// TẠI SAO (track): Dữ liệu hoặc adapter giả có kiểm soát giúp test đúng tình huống mà không cần
// mạng, GPS hay loa thật.
// Khẳng định kết quả thử nghiệm bằng test('Preview pause/resume giữ giây 12, không tạo player mới hoặc seek về 0',async()=>{ let opens=0.
test('Preview pause/resume giữ giây 12, không tạo player mới hoặc seek về 0',async()=>{
 // Khai báo opens: giá trị số 0. | Khai báo t: Gọi track(). | Thực hiện sử dụng opens++ làm giá trị của bước hiện tại. | Trả kết quả: sử dụng t làm giá trị của bước hiện tại.
 let opens=0;const t=track(),p=new PreviewController(async()=>{opens++;return t})
 // Thực hiện await chờ Gọi p.play(). | Thực hiện tính biểu thức t.position=12. | Thực hiện Gọi t.emit(). | Thực hiện p.pause tạm dừng nguồn âm thanh hiện tại. | Khẳng định kết quả thử nghiệm bằng assert.equal(p.snapshot().status,'paused').
 await p.play();t.position=12;t.emit();p.pause();assert.equal(p.snapshot().status,'paused')
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `await p.play();assert.equal(t.position,12);assert.equal(opens,1);assert.deepEqual(t.s`: Thực hiện await chờ Gọi p.play(). | Khẳng định kết quả thử nghiệm bằng assert.equal(t.position,12). | Khẳng định kết quả thử nghiệm bằng assert.equal(opens,1). | Khẳng định kết quả thử nghiệm bằng assert.deepEqual(t.seeks,[]). | Thực hiện Gọi p.close().
  * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 await p.play();assert.equal(t.position,12);assert.equal(opens,1);assert.deepEqual(t.seeks,[]);p.close()
})
// Khẳng định kết quả thử nghiệm bằng test('Preview chỉ tua đầu khi bài đã kết thúc',async()=>{ const t=track(),p=new PreviewController(async()=>t).
test('Preview chỉ tua đầu khi bài đã kết thúc',async()=>{
 // Khai báo t: Gọi track(). | Thực hiện await chờ Gọi p.play(). | Thực hiện tính biểu thức t.position=35. | Thực hiện tính biểu thức t.playing=false. | Thực hiện Gọi t.emit(true).
 const t=track(),p=new PreviewController(async()=>t);await p.play();t.position=35;t.playing=false;t.emit(true)
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `assert.equal(p.snapshot().status,'ended');await p.play();assert.deepEqual(t.seeks,[0]`: Khẳng định kết quả thử nghiệm bằng assert.equal(p.snapshot().status,'ended'). | Thực hiện await chờ Gọi p.play(). | Khẳng định kết quả thử nghiệm bằng assert.deepEqual(t.seeks,[0]). | Thực hiện Gọi p.close().
  * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 assert.equal(p.snapshot().status,'ended');await p.play();assert.deepEqual(t.seeks,[0]);p.close()
})
// Khẳng định kết quả thử nghiệm bằng test('Đổi màn khi tải: nguồn về muộn bị dispose và không tự phát',async()=>{ let finish.
test('Đổi màn khi tải: nguồn về muộn bị dispose và không tự phát',async()=>{
 // Khai báo finish: không có giá trị khởi tạo. | Khai báo t: Gọi track().
 let finish;const t=track(),p=new PreviewController(()=>new Promise(r=>finish=r))
 // Khai báo job: Gọi p.play(). | Thực hiện Gọi p.close(). | Thực hiện Gọi finish(t). | Thực hiện await chờ sử dụng job làm giá trị của bước hiện tại. | Khẳng định kết quả thử nghiệm bằng assert.equal(t.plays,0). | Khẳng định kết quả thử nghiệm bằng assert.equal(t.disposed,true).
 const job=p.play();p.close();finish(t);await job;assert.equal(t.plays,0);assert.equal(t.disposed,true)
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `assert.equal(p.snapshot().status,'idle')`: Khẳng định kết quả thử nghiệm bằng assert.equal(p.snapshot().status,'idle').
  * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 assert.equal(p.snapshot().status,'idle')
})
// Khẳng định kết quả thử nghiệm bằng test('Pause trong lúc tải: chỉ phát khi người dùng bấm tiếp tục',async()=>{ let finish,opens=0.
test('Pause trong lúc tải: chỉ phát khi người dùng bấm tiếp tục',async()=>{
 // Khai báo finish: không có giá trị khởi tạo. | Khai báo t: Gọi track(). | Thực hiện sử dụng opens++ làm giá trị của bước hiện tại. | Trả kết quả: Tạo đối tượng bằng new Promise(r=>finish=r).
 let finish,opens=0;const t=track(),p=new PreviewController(()=>{opens++;return new Promise(r=>finish=r)})
 // Khai báo job: Gọi p.play(). | Thực hiện p.pause tạm dừng nguồn âm thanh hiện tại. | Thực hiện Gọi finish(t). | Thực hiện await chờ sử dụng job làm giá trị của bước hiện tại. | Khẳng định kết quả thử nghiệm bằng assert.equal(t.plays,0).
 const job=p.play();p.pause();finish(t);await job;assert.equal(t.plays,0)
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `await p.play();assert.equal(t.plays,1);assert.equal(opens,1);p.close()`: Thực hiện await chờ Gọi p.play(). | Khẳng định kết quả thử nghiệm bằng assert.equal(t.plays,1). | Khẳng định kết quả thử nghiệm bằng assert.equal(opens,1). | Thực hiện Gọi p.close().
  * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 await p.play();assert.equal(t.plays,1);assert.equal(opens,1);p.close()
})
// Khẳng định kết quả thử nghiệm bằng test('Bấm liên tiếp trong lúc tải không tạo hai nguồn',async()=>{ let finish,opens=0.
test('Bấm liên tiếp trong lúc tải không tạo hai nguồn',async()=>{
 // Khai báo finish: không có giá trị khởi tạo. | Khai báo t: Gọi track(). | Thực hiện sử dụng opens++ làm giá trị của bước hiện tại. | Trả kết quả: Tạo đối tượng bằng new Promise(r=>finish=r).
 let finish,opens=0;const t=track(),p=new PreviewController(()=>{opens++;return new Promise(r=>finish=r)})
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `const first=p.play();await p.play();finish(t);await first;assert.equal(opens,1);asser`: Khai báo first: Gọi p.play(). | Thực hiện await chờ Gọi p.play(). | Thực hiện Gọi finish(t). | Thực hiện await chờ sử dụng first làm giá trị của bước hiện tại. | Khẳng định kết quả thử nghiệm bằng assert.equal(opens,1). | Khẳng định kết quả thử nghiệm bằng assert.equal(t.plays,1). | Thực hiện Gọi p.close().
  * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 const first=p.play();await p.play();finish(t);await first;assert.equal(opens,1);assert.equal(t.plays,1);p.close()
})
// Khẳng định kết quả thử nghiệm bằng test('Coordinator: B bắt đầu làm A pause.
test('Coordinator: B bắt đầu làm A pause; resume A giữ tiến độ và pause B',async()=>{
 // Khai báo coordinator: Tạo đối tượng bằng new PlaybackCoordinator().
 const coordinator=new PlaybackCoordinator(),a=track(coordinator),b=track(coordinator)
 // Khai báo first: Tạo đối tượng bằng new PreviewController(async()=>a).
 const first=new PreviewController(async()=>a),second=new PreviewController(async()=>b)
 // Thực hiện await chờ Gọi first.play(). | Thực hiện tính biểu thức a.position=14. | Thực hiện Gọi a.emit(). | Thực hiện await chờ Gọi second.play().
 await first.play();a.position=14;a.emit();await second.play()
 // Khẳng định kết quả thử nghiệm bằng assert.equal(a.playing,false). | Khẳng định kết quả thử nghiệm bằng assert.equal(first.snapshot().status,'paused'). | Khẳng định kết quả thử nghiệm bằng assert.equal(b.playing,true).
 assert.equal(a.playing,false);assert.equal(first.snapshot().status,'paused');assert.equal(b.playing,true)
 // Thực hiện await chờ Gọi first.play(). | Khẳng định kết quả thử nghiệm bằng assert.equal(a.position,14). | Khẳng định kết quả thử nghiệm bằng assert.equal(a.playing,true). | Khẳng định kết quả thử nghiệm bằng assert.equal(b.playing,false).
 await first.play();assert.equal(a.position,14);assert.equal(a.playing,true);assert.equal(b.playing,false)
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `second.close();assert.equal(coordinator.owns(a),true);first.close();assert.equal(coor`: Thực hiện Gọi second.close(). | Khẳng định kết quả thử nghiệm bằng assert.equal(coordinator.owns(a),true). | Thực hiện Gọi first.close(). | Khẳng định kết quả thử nghiệm bằng assert.equal(coordinator.owns(a),false).
  * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 second.close();assert.equal(coordinator.owns(a),true);first.close();assert.equal(coordinator.owns(a),false)
})
// Khẳng định kết quả thử nghiệm bằng test('Lỗi mở audio có thể thử lại, không giữ trạng thái loading',async()=>{ let opens=0.
test('Lỗi mở audio có thể thử lại, không giữ trạng thái loading',async()=>{
 // Khai báo opens: giá trị số 0. | Khai báo t: Gọi track(). | Rẽ nhánh nếu ++opens===1. | Ném Error('offline'). | Trả kết quả: sử dụng t làm giá trị của bước hiện tại.
 let opens=0;const t=track(),p=new PreviewController(async()=>{if(++opens===1)throw Error('offline');return t})
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `await p.play();assert.equal(p.snapshot().status,'error');await p.play();assert.equal(`: Thực hiện await chờ Gọi p.play(). | Khẳng định kết quả thử nghiệm bằng assert.equal(p.snapshot().status,'error'). | Khẳng định kết quả thử nghiệm bằng assert.equal(p.snapshot().status,'playing'). | Thực hiện Gọi p.close().
  * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 await p.play();assert.equal(p.snapshot().status,'error');await p.play();assert.equal(p.snapshot().status,'playing');p.close()
})
// Khẳng định kết quả thử nghiệm bằng test('8 record có tọa độ OSM đúng nguồn.
test('8 record có tọa độ OSM đúng nguồn; tọa độ Admin ưu tiên hơn marker mặc định',()=>{
 // Duyệt lần lượt MOCK_PLACES bằng const p. | Khẳng định kết quả thử nghiệm bằng assert.ok(p.position). | Khẳng định kết quả thử nghiệm bằng assert.equal(p.position.verified,false). | Khẳng định kết quả thử nghiệm bằng assert.equal(p.position.lat,MAP_POINTS[p.id].lat). | Khẳng định kết quả thử nghiệm bằng assert.equal(p.position.lng,MAP_POINTS[p.id].lng).
 for(const p of MOCK_PLACES){assert.ok(p.position);assert.equal(p.position.verified,false);assert.equal(p.position.lat,MAP_POINTS[p.id].lat);assert.equal(p.position.lng,MAP_POINTS[p.id].lng)}
 // Khai báo place: tạo object gồm ...giá trị ghép, position. | Gán thuộc tính position: tạo object gồm lat, lng, verified. | Gán thuộc tính lat: giá trị số 16.47. | Gán thuộc tính lng: giá trị số 107.57. | Gán thuộc tính verified: sử dụng true làm giá trị của bước hiện tại. Tách tọa độ tham khảo với tọa độ đã xác nhận.
 const place={...MOCK_PLACES[0],position:{lat:16.47,lng:107.57,verified:true}}
 // Khẳng định kết quả thử nghiệm bằng assert.deepEqual(mapPointFor(place),{lat:16.47,lng:107.57,fieldVerified:true,source:''}). | Gán thuộc tính lat: giá trị số 16.47. | Gán thuộc tính lng: giá trị số 107.57. | Gán thuộc tính fieldVerified: sử dụng true làm giá trị của bước hiện tại. Ghi trạng thái khảo sát thực địa của điểm bản đồ. | Gán thuộc tính source: chuỗi ''.
 assert.deepEqual(mapPointFor(place),{lat:16.47,lng:107.57,fieldVerified:true,source:''})
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `assert.deepEqual(mapPointFor({...MOCK_PLACES[0],position:undefined}),MAP_POINTS['ky-d`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual(mapPointFor({...MOCK_PLACES[0],position:undefined}),MAP_POINTS['ky-dai']). | Gán thuộc tính position: sử dụng undefined làm giá trị của bước hiện tại. Giữ vị trí theo ngữ cảnh: tọa độ địa điểm hoặc thời điểm audio.
  * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 assert.deepEqual(mapPointFor({...MOCK_PLACES[0],position:undefined}),MAP_POINTS['ky-dai'])
})

// CHỨC NĂNG: Thanh tua hiện thời lượng trước khi nghe và không phá trạng thái pause.
// Khẳng định kết quả thử nghiệm bằng test('Preview prepare không tự phát.
test('Preview prepare không tự phát; kéo tua khi pause rồi tiếp tục giữ vị trí',async()=>{
 // Khai báo t: Gọi track().
 const t=track(),p=new PreviewController(async()=>t)
 // Thực hiện await chờ Gọi p.prepare(). | Khẳng định kết quả thử nghiệm bằng assert.equal(p.snapshot().duration,35). | Khẳng định kết quả thử nghiệm bằng assert.equal(t.plays,0).
 await p.prepare();assert.equal(p.snapshot().duration,35);assert.equal(t.plays,0)
 // Thực hiện await chờ Gọi p.play(). | Thực hiện p.pause tạm dừng nguồn âm thanh hiện tại. | Thực hiện await chờ p.seek yêu cầu chuyển thời điểm phát.
 await p.play();p.pause();await p.seek(18)
 // Khẳng định kết quả thử nghiệm bằng assert.equal(p.snapshot().status,'paused'). | Khẳng định kết quả thử nghiệm bằng assert.equal(t.position,18).
 assert.equal(p.snapshot().status,'paused');assert.equal(t.position,18)
 // Thực hiện await chờ Gọi p.play(). | Khẳng định kết quả thử nghiệm bằng assert.equal(t.position,18). | Thực hiện await chờ p.seek yêu cầu chuyển thời điểm phát. | Khẳng định kết quả thử nghiệm bằng assert.equal(t.position,35).
 await p.play();assert.equal(t.position,18);await p.seek(999);assert.equal(t.position,35)
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `await p.seek(-4);assert.equal(t.position,0);p.close()`: Thực hiện await chờ p.seek yêu cầu chuyển thời điểm phát. | Khẳng định kết quả thử nghiệm bằng assert.equal(t.position,0). | Thực hiện Gọi p.close().
  * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 await p.seek(-4);assert.equal(t.position,0);p.close()
})
// Khẳng định kết quả thử nghiệm bằng test('Preview âm lượng và tốc độ truyền xuống nguồn thật, giới hạn giá trị sai',async()=>{ const t=track(),rates=[],volu.
test('Preview âm lượng và tốc độ truyền xuống nguồn thật, giới hạn giá trị sai',async()=>{
 // Khai báo t: Gọi track(). | Thực hiện tính biểu thức t.rate=value=>rates.push(value). | Thực hiện tính biểu thức t.volume=value=>volumes.push(value).
 const t=track(),rates=[],volumes=[];t.rate=value=>rates.push(value);t.volume=value=>volumes.push(value)
 // Khai báo p: Tạo đối tượng bằng new PreviewController(async()=>t). | Thực hiện await chờ Gọi p.prepare().
 const p=new PreviewController(async()=>t);await p.prepare()
 // Thực hiện Gọi p.setVolume(0.4). | Thực hiện Gọi p.setVolume(2). | Thực hiện Gọi p.setVolume(-1). | Thực hiện Gọi p.setRate(1.25). | Thực hiện Gọi p.setRate(9).
 p.setVolume(0.4);p.setVolume(2);p.setVolume(-1);p.setRate(1.25);p.setRate(9)
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `assert.deepEqual(volumes,[1,0.4,1,0]);assert.deepEqual(rates,[1,1.25]);assert.equal(p`: Khẳng định kết quả thử nghiệm bằng assert.deepEqual(volumes,[1,0.4,1,0]). | Khẳng định kết quả thử nghiệm bằng assert.deepEqual(rates,[1,1.25]). | Khẳng định kết quả thử nghiệm bằng assert.equal(p.snapshot().rate,1.25). | Thực hiện Gọi p.close().
  * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 assert.deepEqual(volumes,[1,0.4,1,0]);assert.deepEqual(rates,[1,1.25]);assert.equal(p.snapshot().rate,1.25);p.close()
})
// Khẳng định kết quả thử nghiệm bằng test('Preview đóng lúc nạp metadata không để lại nguồn âm thanh',async()=>{ let finish.
test('Preview đóng lúc nạp metadata không để lại nguồn âm thanh',async()=>{
 // Khai báo finish: không có giá trị khởi tạo. | Khai báo t: Gọi track().
 let finish;const t=track(),p=new PreviewController(()=>new Promise(resolve=>finish=resolve))
 // CHỨC NĂNG: Đang chờ tác vụ chuẩn bị/phát; hạn chế tạo nguồn hoặc gửi thao tác trùng.
 // Khai báo pending: Gọi p.prepare(). | Thực hiện Gọi p.close(). | Thực hiện Gọi finish(t). | Thực hiện await chờ sử dụng pending làm giá trị của bước hiện tại.
 const pending=p.prepare();p.close();finish(t);await pending
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `assert.equal(t.disposed,true);assert.equal(t.plays,0);assert.equal(p.snapshot().durat`: Khẳng định kết quả thử nghiệm bằng assert.equal(t.disposed,true). | Khẳng định kết quả thử nghiệm bằng assert.equal(t.plays,0). | Khẳng định kết quả thử nghiệm bằng assert.equal(p.snapshot().duration,0).
  * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 assert.equal(t.disposed,true);assert.equal(t.plays,0);assert.equal(p.snapshot().duration,0)
})
