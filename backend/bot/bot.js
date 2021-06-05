const { Telegraf } = require('telegraf')
let fs = require('fs');
const Koa = require('koa');
const app = new Koa();
const cors = require('@koa/cors');
const Router = require('koa-router');
const bodyParser = require('koa-body');
const router = new Router();
const fs = require("fs");

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

console.log(getMostRecentFile('.'));
let bot_data = require('./bot.json');

const bot = new Telegraf(bot_data.token);

let prepareSending = async (ctx, id) => {
    let last = getMostRecentFile("/mnt/tmpfs-folder").file
    let i = parseInt(last.slice(last.length - 5, last.length - 4));
    sendPhoto(ctx, id, i)
}
let sendPhoto = async (ctx, id, i, n = 0, l = 10) => {
    if (n > 15) {
        return;
    }
    bot.telegram.sendPhoto(id,
        { source: fs.createReadStream(`/mnt/tmpfs-folder/img${i}.jpg`) }, { caption: "Door" }
        , function (err, msg) {
            console.log(err);
            console.log(msg);
        });
    i = i + 1 > l ? 0 : i + 1
    setTimeout(() => {
        sendPhoto(ctx, id, i, n + 1)
    }, 300)
}

router.get('/', (ctx, next) => {
    ctx.body = "hiiiiii"
});
router.post(`/`, (ctx, next) => {
    console.log("pooosst")
    console.log(ctx.request.body)
    ctx.response.body = "OK"
    for (let i = 0; i < ids.length; i++) {
        let id = ids[i];
        prepareSending(ctx, id);
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
        if (ctx.message.text === bot_data.pwd) {
            ids.push(ctx.chat.id);
            ctx.reply("Вход выполнен успешно")
            ctx.deleteMessage()
        }
    }
})

// setInterval(() => {
//     for (let i = 0; i < ids.length; i++) {
//         bot.telegram.sendPhoto(ids[i],
//             {source: fs.createReadStream('/home/mkulik05/img.jpg')}, {caption: "someCaption"}
//         , function (err, msg) {
//             console.log(err);
//             console.log(msg);
//         });
//     }
// }, 100)
bot.launch()