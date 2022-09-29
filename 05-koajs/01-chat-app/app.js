const path = require('path');
const Koa = require('koa');

const {chatEventEmitter, NEW_MESSAGE_EVENT} = require('./chatEventEmitter');
const {longPollingChatPromise} = require('./longPollingChatPromise');

const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

router.get('/subscribe', async (ctx, next) => {
  const message = await longPollingChatPromise();

  ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
  const {message} = ctx.request.body;

  if (message) {
    chatEventEmitter.emit(NEW_MESSAGE_EVENT, message);

    ctx.response.status = 200;
  }
});

app.use(router.routes());

module.exports = app;
