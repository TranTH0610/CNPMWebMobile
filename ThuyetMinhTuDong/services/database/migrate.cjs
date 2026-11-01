/** FILE NÀY LÀM GÌ: Khởi tạo 11 bảng hoặc chuyển schema cũ đã có bản sao lưu.
 * npm run db:init gọi. Không tự sửa dữ liệu sai hoặc bịa trạng thái đã duyệt.
 */
const {databaseName,driverConfig}=require('./config.cjs')
const {migrate11}=require('./migrate11.cjs')
async function migrate(){
 const name=databaseName(),m=driverConfig('master'),master=await new m.sql.ConnectionPool(m.config).connect()
 try{await master.request().query(`IF DB_ID(N'${name}') IS NULL CREATE DATABASE [${name}]`)}finally{await master.close()}
 const d=driverConfig(name),pool=await new d.sql.ConnectionPool(d.config).connect()
 try{
  const old=(await pool.request().query("SELECT OBJECT_ID(N'dbo.Places',N'U') AS id")).recordset[0].id
  if(old)throw Error('Schema cũ còn dữ liệu: dùng quy trình backup + kiểm thử migration11 trước khi chuyển, không tự đổi khi chạy dev.')
  console.log(await migrate11(pool,d.sql))
 }finally{await pool.close()}
}
if(require.main===module)migrate().catch(error=>{console.error('Khởi tạo chưa hoàn tất:',error.message);process.exitCode=1})
module.exports={migrate}
