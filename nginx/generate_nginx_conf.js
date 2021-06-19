const fs = require('fs')
const dotenv = require('dotenv');
dotenv.config({ path: '../path.env'});
console.log
console.log("> Read nginx_blank.conf")
let data = fs.readFileSync('./nginx_blank.conf', 'utf8').toString()
console.log("> Change variables in nginx_blank.conf")
data = data.replace("${NGINX_CONF_DIR}", process.env.NGINX_CONF_DIR)
data = data.replace("${FRONTEND_FOLDER}", process.env.FRONTEND_FOLDER)
data = data.replace("${VIDEO_FOLDER}", process.env.VIDEO_FOLDER)
console.log("> Write nginx_blank.conf")
fs.writeFile("nginx.conf", data, 'utf8', ()=>{})
console.log("> Finish")