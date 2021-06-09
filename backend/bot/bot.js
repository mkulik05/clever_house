const { Telegraf } = require('telegraf')
let fs = require('fs');
const Koa = require('koa');
const app = new Koa();
const cors = require('@koa/cors');
const Router = require('koa-router');
const bodyParser = require('koa-body');
const router = new Router();
const path = require("path");
const getMostRecentFile = (dir) => {
  const files = orderReccentFiles(dir);
  return files.length ? files[0] : undefined;
};

const orderReccentFiles = (dir) => {
  return fs.readdirSync(dir)
    .filter((file) => fs.lstatSync(path.join(dir, file)).isFile())
    .map((file) => ({ file, mtime: fs.lstatSync(path.join(dir, file)).mtime }))
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
};

let conf = require('./conf.json');

const bot = new Telegraf(conf.token);

let sendPhoto = async (ctx, id, n = 0, prev = "") => {
    if (n > 15) {
        return;
    }
    let last = getMostRecentFile("/mnt/tmpfs-folder").file
    console.log(prev, last)
    if (prev !== last) {
        bot.telegram.sendPhoto(id,
            { source: fs.createReadStream(`/mnt/tmpfs-folder/${last}`) }, { caption: last }
            , function (err, msg) {
                console.log(err);
                console.log(msg);
            });
    } else {
        return sendPhoto(ctx, id, n, last)
    }
    setTimeout(() => {
        sendPhoto(ctx, id, n + 1, last)
    }, 300)
}

router.get('/', (ctx, next) => {
    ctx.body = "200"
});


let last_door_opened = 0;
let min_diff =  4 * 1000 // in milliseconds
router.post(`/`, (ctx, next) => {
    console.log("pooosst")
    
    let resp = ctx.request.body;
    if (resp.key === conf.doorKey) {
        ctx.response.body = "OK"
        console.log("Verified")
        if (resp.msg === "init") {
            last_door_opened = parseInt(resp.time)
        } else {
            if (parseInt(resp.time) - last_door_opened > min_diff) {
                last_door_opened = parseInt(resp.time)
                for (let i = 0; i < ids.length; i++) {
                    let id = ids[i];
                    sendPhoto(ctx, id);
                }
            }
        }
    } else {
        ctx.response.body = "Permission denied"
    }
});
app.use(bodyParser());
app.use(cors({ origin: '*' }))
app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(5000);






let ids = []
bot.on('text', async (ctx) => {
    if (ids.includes(ctx.chat.id)) {
    } else {
        if (ctx.message.text === conf.pwd) {
            ids.push(ctx.chat.id);
            ctx.reply("Вход выполнен успешно")
            ctx.deleteMessage()
        }
    }
})

bot.launch()