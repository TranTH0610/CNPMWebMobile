/** Migration v2 cũ đã được thay bằng migrate11; không chạy riêng trên schema mới. */
async function migrateMedia(){throw Error('Dùng migrate11 hoặc npm run db:init; không chạy migration media v2 riêng.')}
module.exports={migrateMedia}
