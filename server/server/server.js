const Koa = require('koa');
const app = new Koa();
const https = require('https');
const fs = require('fs');
const cors = require('@koa/cors');
const Router = require('koa-router');
const bodyParser = require('koa-body');
const uniqid = require('uniqid');
const ffmpeg = require('fluent-ffmpeg');
const router = new Router();
const pwd = require('./pwd.json').pwd
const httpServer = require("http").createServer(app.callback());
const io = require("socket.io")(httpServer);
const dotenv = require('dotenv');
dotenv.config({ path: '../../path.env'});
console.log("import finished")
let data = {}

let topics = ["hum", "temp"]
let allowed_addresses = {
  "10.8.0.1": {
    "/data/hum": ["POST", "GET"],
    "/data/temp": ["POST", "GET"],
    "/login": ["POST", "GET"]
  },
  "10.8.0.2": {
    "/data/hum": ["GET"],
    "/data/temp": ["GET"],
    '/data': ["GET"]
  }
}

let logined = {}
let default_ban_time = 20  // seconds

let ban_time = default_ban_time

let max_login_attemts = 3;

let login_attempts = 0;

let checkAccess = (ctx, method) => {
  return 1
  if (Object.keys(allowed_addresses).includes(ctx.request.ip)) {
    if (Object.keys(allowed_addresses[ctx.request.ip]).includes(ctx.request.url) && allowed_addresses[ctx.request.ip][ctx.request.url].includes(method)) {
      return 1
    }
  }
  return 0
}

let get_videos_list = () => {
  let files = []
  let files2 = []
  fs.readdirSync(process.env.VIDEO_FOLDER + "/videos_avi").forEach(file => {
    files.push(file)
  });
  fs.readdirSync(process.env.VIDEO_FOLDER + "/videos").forEach(file => {
    files2.push(file)
  });
  return [files, files2]
}

let add_to_config = (key) => {
  let conf = fs.readFileSync(process.env.VIDEO_ACCESS_CONF);
  conf = JSON.parse(conf)
  conf.allowed.push(key)
  fs.writeFileSync(process.env.VIDEO_ACCESS_CONF, JSON.stringify(conf));
}

io.on("connection", socket => {
  socket.on("convert", (name) => {
    console.log("cscscs")
    ffmpeg(process.env.VIDEO_FOLDER + "/videos_avi" + name + ".avi").videoCodec('copy').save(process.env.VIDEO_FOLDER + "/videos" + name + '.mp4').on('progress', function (progress) {
      console.log('Processing: ' + progress.percent + '% done');
      socket.emit("convert-progress", progress.percent);
    }).on('end', () => {
      socket.emit("convert-finished", name);
    }).on('error', function (err, stdout, stderr) {
      socket.emit("convert-error", [stdout, stderr]);
      console.log("ffmpeg stdout:\n" + stdout);
      console.log("ffmpeg stderr:\n" + stderr);
    })

  });
});

let remove_from_config = (key) => {
  let conf = fs.readFileSync(process.env.VIDEO_ACCESS_CONF);
  conf = JSON.parse(conf)
  let i = conf.allowed.indexOf(key);
  if (i > -1) {
    conf.allowed.splice(i, 1);
  }
  fs.writeFileSync(process.env.VIDEO_ACCESS_CONF, JSON.stringify(conf));
}


router.get('/data', (ctx, next) => {
  ctx.body = checkAccess(ctx, "GET") ? data : "Permission denied"
});

router.get('/api/login', (ctx, next) => {
  ctx.body = checkAccess(ctx, "GET") ? pwd.length : "Permission denied"
});

router.get('/videos/list', (ctx, next) => {
  console.log("list")
  ctx.body = checkAccess(ctx, "GET") ? get_videos_list() : "Permission denied"
});

router.post('/api/logout', (ctx, next) => {
  if (checkAccess(ctx, "POST")) {
    let id = ctx.request.body.id
    delete logined[id]
  }
})

router.post('/api/login', (ctx, next) => {
  console.log(login_attempts)
  ctx.cookies.set("test", -1)
  if (checkAccess(ctx, "POST")) {
    if (login_attempts < 20) {
      console.log(2)
      if (ctx.request.body.pwd === pwd) {
        let id = uniqid() + uniqid()
        logined[id] = ctx.request.ip
        remove_from_config(ctx.cookies.get("sessionid"))
        ctx.cookies.set("left_logins", null)
        add_to_config(id)
        setTimeout(() => {
          remove_from_config(id)
        }, 20 * 60 * 1000)
        ctx.cookies.set("sessionid", id, { MaxAge: 20 * 60 })
        login_attempts = 0
        ctx.response.body = { status: "OK" }
        ctx.response.status = 200
        ban_time = default_ban_time
      } else {
        console.log("no")
        login_attempts += 1
        if (login_attempts >= 20 ) {
          ctx.response.status = 423
          ctx.response.body = { status: `locked:${ban_time}` }
          console.log("locked")
          ban_time = Math.floor(ban_time * 2.5)
          setTimeout(() => {
            login_attempts = 0
            console.log("unlocked", ctx.request.ip)
          }, ban_time * 1000)
        } else {
          ctx.response.status = 403
        }
      }
    } else {
      console.log("deny")
      ctx.response.body = { status: "REJECTED, try later" }
      ctx.response.status = 423
    }

  } else {

    ctx.response.body = { status: "Rejected" }
  }
});

topics.forEach((el) => {
  router.get(`/data/${el}`, (ctx, next) => {
    ctx.body = checkAccess(ctx, "GET") ? data[el] : "Permission denied"
  });
  router.post(`/data/${el}`, (ctx, next) => {
    if (checkAccess(ctx, "POST")) {
      data[el] = ctx.request.body
    }
  });
})

app.use(bodyParser());
app.use(cors({ origin: '*', }))


app
  .use(router.routes())
  .use(router.allowedMethods());
process.env.NODE_ENV !== 'production' ? httpServer.listen(3001) : https.createServer({ key: fs.readFileSync('certs/key.key'), cert: fs.readFileSync('certs/cert.crt') }, app.callback()).listen(3001);