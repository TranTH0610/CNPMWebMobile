/** FILE NÀY LÀM GÌ: Quản lý kết nối SQL; kiểm thử dùng DATABASE RIÊNG, không trộn vào main.
 * Repository/media/test-support gọi. Chỉ cache kết nối, không cache dữ liệu nghiệp vụ.
 */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto')
const {driverConfig,databaseName}=require('./config.cjs')
const pools=new Map()
function scopeDatabase(scope='main'){
 if(scope==='main')return databaseName()
 if(!/^test_[a-f0-9-]{36}$/.test(scope))throw Error('invalid_test_scope')
 return 'HueGuideTest11_'+crypto.createHash('sha256').update(scope).digest('hex').slice(0,20)
}
async function installSchema(pool){
 for(const batch of fs.readFileSync(path.join(__dirname,'schema.sql'),'utf8').split(/^GO\s*$/mi))if(batch.trim())await pool.request().batch(batch)
}
function connect(scope='main'){
 const name=scopeDatabase(scope)
 if(!pools.has(name))pools.set(name,(async()=>{
  if(scope!=='main'){
   const masterConfig=driverConfig('master'),master=await new masterConfig.sql.ConnectionPool(masterConfig.config).connect()
   try{await master.request().query(`IF DB_ID(N'${name}') IS NULL CREATE DATABASE [${name}]`)}finally{await master.close()}
  }
  const {sql,config}=driverConfig(name),pool=new sql.ConnectionPool(config)
  pool.on('error',()=>{})
  await pool.connect()
  try{if(scope!=='main')await installSchema(pool);return{sql,pool}}catch(error){await pool.close();throw error}
 })().catch(error=>{pools.delete(name);throw error}))
 return pools.get(name)
}
async function close(scope){
 if(typeof scope!=='string')scope=undefined // node:test truyền TestContext vào after(close).
 const names=scope===undefined?[...pools.keys()]:[scopeDatabase(scope)]
 for(const name of names){const pending=pools.get(name);pools.delete(name);if(pending)await(await pending).pool.close()}
}
module.exports={connect,close,scopeDatabase,installSchema}
