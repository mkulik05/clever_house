const Koa = require('koa');
const app = new Koa();
const https = require('https');
const fs = require('fs');
var Router = require('koa-router');
var bodyParser = require('koa-body');
let data = {}
let data_topics = ["hum", "temp"]
var router = new Router();
router.get('/data', (ctx, next) => {
  ctx.body = data
});

data_topics.forEach((el) => {
  router.get(`/data/${el}`, (ctx, next) => {
    ctx.body = data[el]
  });
  router.post(`/data/${el}`, (ctx, next) => {
    data[el] = ctx.request.body
    console.log(data)
  });
})


app.use(bodyParser());
app
  .use(router.routes())
  .use(router.allowedMethods());


https.createServer({ key: fs.readFileSync('certs/key.key'), cert: fs.readFileSync('certs/cert.crt') }, app.callback()).listen(3001);
