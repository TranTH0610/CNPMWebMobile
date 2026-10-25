/** FILE NÀY LÀM GÌ: Chặn lỗi preview phát lại từ đầu, phát chồng và nguồn tải muộn.
 * npm test gọi; dùng Track giả có vị trí thật trong test, không cần React/thiết bị. */
const {test}=require('node:test'),assert=require('node:assert/strict')
const {PreviewController}=require('../.test-build/audio/preview.js')
const {PlaybackCoordinator}=require('../.test-build/audio/playback.js')
const {mapPointFor,MAP_POINTS}=require('../.test-build/journey/journey-data.js')
const {MOCK_PLACES}=require('../.test-build/data/mock.js')
function track(coordinator){
 const listeners=new Set()
 const t={position:0,duration:35,playing:false,disposed:false,plays:0,seeks:[],
  async play(){coordinator?.claim(t);t.playing=true;t.plays++;t.emit()},
  pause(){t.playing=false;t.emit()},async seek(value){t.position=value;t.seeks.push(value);t.emit()},rate(){},
  listen(fn){listeners.add(fn);return()=>listeners.delete(fn)},
  dispose(){t.disposed=true;t.pause();coordinator?.release(t)},
  emit(ended=false){listeners.forEach(fn=>fn({position:t.position,duration:t.duration,playing:t.playing,ended}))}}
 return t
}
test('Preview pause/resume giữ giây 12, không tạo player mới hoặc seek về 0',async()=>{
 let opens=0;const t=track(),p=new PreviewController(async()=>{opens++;return t})
 await p.play();t.position=12;t.emit();p.pause();assert.equal(p.snapshot().status,'paused')
 await p.play();assert.equal(t.position,12);assert.equal(opens,1);assert.deepEqual(t.seeks,[]);p.close()
})
test('Preview chỉ tua đầu khi bài đã kết thúc',async()=>{
 const t=track(),p=new PreviewController(async()=>t);await p.play();t.position=35;t.playing=false;t.emit(true)
 assert.equal(p.snapshot().status,'ended');await p.play();assert.deepEqual(t.seeks,[0]);p.close()
})
test('Đổi màn khi tải: nguồn về muộn bị dispose và không tự phát',async()=>{
 let finish;const t=track(),p=new PreviewController(()=>new Promise(r=>finish=r))
 const job=p.play();p.close();finish(t);await job;assert.equal(t.plays,0);assert.equal(t.disposed,true)
 assert.equal(p.snapshot().status,'idle')
})
test('Pause trong lúc tải: chỉ phát khi người dùng bấm tiếp tục',async()=>{
 let finish,opens=0;const t=track(),p=new PreviewController(()=>{opens++;return new Promise(r=>finish=r)})
 const job=p.play();p.pause();finish(t);await job;assert.equal(t.plays,0)
 await p.play();assert.equal(t.plays,1);assert.equal(opens,1);p.close()
})
test('Bấm liên tiếp trong lúc tải không tạo hai nguồn',async()=>{
 let finish,opens=0;const t=track(),p=new PreviewController(()=>{opens++;return new Promise(r=>finish=r)})
 const first=p.play();await p.play();finish(t);await first;assert.equal(opens,1);assert.equal(t.plays,1);p.close()
})
test('Coordinator: B bắt đầu làm A pause; resume A giữ tiến độ và pause B',async()=>{
 const coordinator=new PlaybackCoordinator(),a=track(coordinator),b=track(coordinator)
 const first=new PreviewController(async()=>a),second=new PreviewController(async()=>b)
 await first.play();a.position=14;a.emit();await second.play()
 assert.equal(a.playing,false);assert.equal(first.snapshot().status,'paused');assert.equal(b.playing,true)
 await first.play();assert.equal(a.position,14);assert.equal(a.playing,true);assert.equal(b.playing,false)
 second.close();assert.equal(coordinator.owns(a),true);first.close();assert.equal(coordinator.owns(a),false)
})
test('Lỗi mở audio có thể thử lại, không giữ trạng thái loading',async()=>{
 let opens=0;const t=track(),p=new PreviewController(async()=>{if(++opens===1)throw Error('offline');return t})
 await p.play();assert.equal(p.snapshot().status,'error');await p.play();assert.equal(p.snapshot().status,'playing');p.close()
})
test('8 record có tọa độ OSM đúng nguồn; tọa độ Admin ưu tiên hơn marker mặc định',()=>{
 for(const p of MOCK_PLACES){assert.ok(p.position);assert.equal(p.position.verified,false);assert.equal(p.position.lat,MAP_POINTS[p.id].lat);assert.equal(p.position.lng,MAP_POINTS[p.id].lng)}
 const place={...MOCK_PLACES[0],position:{lat:16.47,lng:107.57,verified:true}}
 assert.deepEqual(mapPointFor(place),{lat:16.47,lng:107.57,fieldVerified:true,source:''})
 assert.deepEqual(mapPointFor({...MOCK_PLACES[0],position:undefined}),MAP_POINTS['ky-dai'])
})

// CHỨC NĂNG: Thanh tua hiện thời lượng trước khi nghe và không phá trạng thái pause.
test('Preview prepare không tự phát; kéo tua khi pause rồi tiếp tục giữ vị trí',async()=>{
 const t=track(),p=new PreviewController(async()=>t)
 await p.prepare();assert.equal(p.snapshot().duration,35);assert.equal(t.plays,0)
 await p.play();p.pause();await p.seek(18)
 assert.equal(p.snapshot().status,'paused');assert.equal(t.position,18)
 await p.play();assert.equal(t.position,18);await p.seek(999);assert.equal(t.position,35)
 await p.seek(-4);assert.equal(t.position,0);p.close()
})
test('Preview âm lượng và tốc độ truyền xuống nguồn thật, giới hạn giá trị sai',async()=>{
 const t=track(),rates=[],volumes=[];t.rate=value=>rates.push(value);t.volume=value=>volumes.push(value)
 const p=new PreviewController(async()=>t);await p.prepare()
 p.setVolume(0.4);p.setVolume(2);p.setVolume(-1);p.setRate(1.25);p.setRate(9)
 assert.deepEqual(volumes,[1,0.4,1,0]);assert.deepEqual(rates,[1,1.25]);assert.equal(p.snapshot().rate,1.25);p.close()
})
test('Preview đóng lúc nạp metadata không để lại nguồn âm thanh',async()=>{
 let finish;const t=track(),p=new PreviewController(()=>new Promise(resolve=>finish=resolve))
 const pending=p.prepare();p.close();finish(t);await pending
 assert.equal(t.disposed,true);assert.equal(t.plays,0);assert.equal(p.snapshot().duration,0)
})
