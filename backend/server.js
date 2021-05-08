const Koa = require('koa');
const app = new Koa();
const https = require('https');
const fs = require('fs');
const cors = require('@koa/cors');
const Router = require('koa-router');
const bodyParser = require('koa-body');
const router = new Router();

let data = {}
let topics = ["hum", "temp"]
let allowed_addresses = {
  "10.8.0.1": {
    "/data/hum": ["POST", "GET"],
    "/data/temp": ["POST", "GET"]
  },
  "10.8.0.2": {
    "/data/hum": ["GET"],
    "/data/temp": ["GET"],
    '/data': ["GET"]
  }
}

let checkAccess = (ctx, method) => {
  if (Object.keys(allowed_addresses).includes(ctx.request.ip)) {
    if (Object.keys(allowed_addresses[ctx.request.ip]).includes(ctx.request.url) && allowed_addresses[ctx.request.ip][ctx.request.url].includes(method)) {
      return 1
    } else {
      return 0
    }
  } else {
    return 0
  }
}

router.get('/data', (ctx, next) => {
  ctx.body = checkAccess(ctx, "GET") ? data : "Permission denied"
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
app.use(cors({ origin: '*' }))


app
  .use(router.routes())
  .use(router.allowedMethods());


https.createServer({ key: fs.readFileSync('certs/key.key'), cert: fs.readFileSync('certs/cert.crt') }, app.callback()).listen(3001, "10.8.0.1");
