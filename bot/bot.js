const { Telegraf } = require('telegraf')
const fs = require('fs');
const Koa = require('koa');
const app = new Koa();
const cors = require('@koa/cors');
const Router = require('koa-router');
const bodyParser = require('koa-body');
const router = new Router();

const getMostRecentFile = (dir) => {
    let files = fs.readdirSync(dir);
    files.sort((a, b) => {
        a = a.slice(0, a.indexOf("."))
        b = b.slice(0, b.indexOf("."))
        try {
            a = parseInt(a)
            b = parseInt(b)
        } catch (err) {}
        if (a > b) {
          return 1;
        }
        if (a < b) {
          return -1;
        }
        return 0;
      });
    return files[files.length - 1]
};

let conf = require('./conf.json');

const bot = new Telegraf(conf.token);

let sendPhoto = async (ctx, id, n = 0, prev = "") => {
    if (n > 15) {
        return;
    }
    let last = getMostRecentFile("/mnt/tmpfs-folder")
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