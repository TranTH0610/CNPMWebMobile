/** FILE NÀY LÀM GÌ: Mỗi test có database riêng với đúng 11 bảng, không đụng dữ liệu demo.
 * Chỉ test gọi. Cleanup chỉ xóa tên database sinh từ scope test_ UUID đã kiểm tra.
 */
const {randomUUID}=require('node:crypto')
const {close,scopeDatabase}=require('./connection.cjs')
const {driverConfig}=require('./config.cjs')
const {createSqlRepository}=require('./repository.cjs')
async function cleanup(scope){
 if(!/^test_[a-f0-9-]{36}$/.test(scope))throw Error('Không được cleanup dữ liệu ứng dụng.')
 const name=scopeDatabase(scope)
 if(!/^HueGuideTest11_[a-f0-9]{20}$/.test(name))throw Error('Tên database test không hợp lệ.')
 await close(scope)
 const {sql,config}=driverConfig('master'),pool=await new sql.ConnectionPool(config).connect()
 try{await pool.request().query(`IF DB_ID(N'${name}') IS NOT NULL BEGIN ALTER DATABASE [${name}] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;DROP DATABASE [${name}];END`)}finally{await pool.close()}
}
function testRepository(t,options={}){const scope='test_'+randomUUID();t.after(()=>cleanup(scope));return{scope,repository:createSqlRepository({scope,...options})}}
module.exports={cleanup,testRepository}
