/** FILE NÀY LÀM GÌ: Chạy mock API RAM cho demo cùng Wi-Fi và cấu hình URL Admin mobile.
 * npm run catalog:start gọi; không cài DB hay thư viện mới.
 * Chỉ cập nhật hai khóa catalog; không động vào token, ngôn ngữ hoặc target app. */
const os=require('node:os'),fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process')
const root=path.resolve(__dirname,'..')
const interfaces=Object.values(os.networkInterfaces()).flat().filter(x=>x&&x.family==='IPv4'&&!x.internal&&!x.address.startsWith('169.254.'))
const address=process.env.CATALOG_LAN_IP||interfaces.find(x=>/^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(x.address))?.address
if(!address){console.error('Chưa tìm được IP LAN. Kết nối Wi-Fi hoặc đặt CATALOG_LAN_IP.');process.exit(1)}
const file=path.join(root,'apps/mobile/.env');let text=fs.existsSync(file)?fs.readFileSync(file,'utf8'):''
// CHỨC NĂNG: Giữ URL triển khai riêng; chỉ tự cập nhật địa chỉ LAN cũ/mặc định.
for(const key of ['EXPO_PUBLIC_ADMIN_API_URL','EXPO_PUBLIC_CATALOG_API_URL','EXPO_PUBLIC_ADMIN_PRESENCE_API_URL']){
 const expression=new RegExp('^'+key+'=(.*)$','m'),old=text.match(expression)?.[1]?.trim()
 if(!old||/^http:\/\/(192\.168\.|10\.|172\.|localhost|127\.)/.test(old)){
  text=text.split(/\r?\n/).filter(line=>!line.startsWith(key+'=')).join('\n').trimEnd()+'\n'+key+'=http://'+address+':'+(process.env.CATALOG_PORT||8788)+(key==='EXPO_PUBLIC_ADMIN_PRESENCE_API_URL'?'/presence':'')+'\n'
 }
}
fs.writeFileSync(file,text)
console.log('URL Admin mobile: http://'+address+':'+(process.env.CATALOG_PORT||8788)+' — restart Expo sau khi đổi .env')
const child=spawn(process.execPath,[path.join(root,'services/catalog/server.cjs')],{cwd:root,env:{...process.env,CATALOG_HOST:process.env.CATALOG_HOST||'0.0.0.0'},stdio:'inherit',windowsHide:true})
child.on('error',error=>{console.error(error.message);process.exitCode=1});child.on('exit',code=>{process.exitCode=code||0})
/* CÁCH KIỂM TRA: Cùng mạng mở /version bằng IP trên điện thoại; Expo tải lại để dùng URL mới. */
