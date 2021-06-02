const { Telegraf } = require('telegraf')
let fs = require('fs');
let bot_data = require('./bot.json');

const bot = new Telegraf(bot_data.token);

let ids = []
bot.on('text', async (ctx) => {
    if (ids.includes(ctx.chat.id)) {
        if (ctx.message.text === "img") {
            bot.telegram.sendPhoto(ids[i],
                {source: fs.createReadStream('/home/mkulik05/img.jpg')}, {caption: "someCaption"}
            , function (err, msg) {
                console.log(err);
                console.log(msg);
            });
        }
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