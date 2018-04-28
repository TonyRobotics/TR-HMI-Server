'use strict'

const Koa = require('koa');
const path = require('path');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const json = require('koa-json');
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

app.use(json());

app.use(bodyParser());

app.use(serve(path.join(__dirname, '../public')));
app.use(serve(path.join(__dirname, '../public/map')));

app.use(controller());

module.exports = app;