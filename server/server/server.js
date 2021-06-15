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
    "/dld the Next.js project with this command npm run build and all the built assets will be put under the out folder. When you run this command the followata/temp": ["GET"],
    '/data': ["GET"]
  }
}

let login_attempts = {}
let logined = {}
let ban_time = 20 // seconds

let max_login_attemts = 3;
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
  fs.readdirSync("/home/mkulik05/videos_avi").forEach(file => {
    files.push(file)
  });
  fs.readdirSync("/home/mkulik05/videos").forEach(file => {
    files2.push(file)
  });
  return [files, files2]
}

let add_to_config = (key) => {
  let conf = fs.readFileSync('/home/mkulik05/config.json');
  conf = JSON.parse(conf)
  conf.allowed.push(key)
  fs.writeFileSync('/home/mkulik05/config.json', JSON.stringify(conf));
}

io.on("connection", socket => {
  socket.on("convert", (name) => {
  console.log("cscscs")
    ffmpeg("/home/mkulik05/videos_avi/" + name + ".mkv").videoCodec('copy').save("/home/mkulik05/videos/" + name + '.mp4').on('progress', function(progress) {
      console.log('Processing: ' + progress.percent + '% done');
      socket.emit("convert-progress", progress.percent);
    }).on('end', () => {
      socket.emit("convert-finished", name);
    }).on('error', function(err, stdout, stderr) {
      socket.emit("convert-error", [stdout, stderr]);
      console.log("ffmpeg stdout:\n" + stdout);
      console.log("ffmpeg stderr:\n" + stderr);
    })

  });
});

let remove_from_config = (key) => {
  let conf = fs.readFileSync('/home/mkulik05/config.json');
  conf = JSON.parse(conf)
  let i = conf.allowed.indexOf(key);
  if (i > -1) {
    conf.allowed.splice(i, 1);
  }
  fs.writeFileSync('/home/mkulik05/config.json', JSON.stringify(conf));
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
  if (checkAccess(ctx, "POST")) {
    if ((login_attempts[ctx.request.ip] || 0) < max_login_attemts) {
      if (ctx.request.body.pwd === pwd) {
        let id = uniqid() + uniqid()
        logined[id] = ctx.request.ip
        console.log(ctx.cookies.get("sessionid"))
        console.log("OK")
        remove_from_config(ctx.cookies.get("sessionid"))
        add_to_config(id)
        setTimeout(() => {
          remove_from_config(id)
        }, 20 * 60 * 1000)
        ctx.cookies.set("sessionid", id, { MaxAge: 20 * 60 })
        //ctx.response.cookie.set("login_attempts", login_attempts)
        login_attempts[ctx.request.ip] = 0
        ctx.response.body = { status: "OK" }
        ctx.response.status = 200
        next();
      } else {
        console.log("no")
        
        if (Object.keys(login_attempts).includes(ctx.request.ip)) {
          login_attempts[ctx.request.ip] += 1
          if (login_attempts[ctx.request.ip] === max_login_attemts - 1) {
            ctx.response.status = 423
            ctx.response.body = { status: `locked:${ban_time}`  }
            console.log("locked")
            setTimeout(() => {
              login_attempts[ctx.request.ip] = 0
              console.log("unlocked", ctx.request.ip)
            }, ban_time * 1000)
          } else {
            ctx.response.status = 403
          }
        } else {
          ctx.response.status = 403
          login_attempts[ctx.request.ip] = 1
          ctx.response.body = { status: "REJECTED" }
        }
        next();
      }
    } else {
      console.log("deny")
      ctx.response.body = { status: "REJECTED, try later" }
      ctx.response.status = 403
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
  // , "10.8.0.1");
