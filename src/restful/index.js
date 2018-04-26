const Koa = require('koa');
const path = require('path');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const staticFiles = require('./static-files');
const controller = require('./controller');

const app = new Koa();

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
});

app.use(bodyParser());

app.use(staticFiles('/static/', path.join(__dirname, '../public')));

app.use(controller());

app.listen(3000);

console.log('app started at port 3000...');