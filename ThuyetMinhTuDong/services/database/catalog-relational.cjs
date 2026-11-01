/** Điểm xuất tương thích; phần đọc/ghi thật hiện ở catalog11.cjs. */
const codec=require('./catalog11.cjs')
module.exports={...codec,readDocument:(executor)=>codec.readDocument(executor)}
