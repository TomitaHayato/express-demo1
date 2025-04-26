'use strict'

const express = require('express');
const path = require('path');
const redis = require('./lib/redis');
const userHundler = require('./hundler/user');

const app = express();
// レンプレートエンジンを指定
app.set('view engine', 'ejs');
// 静的ファイルを持つディレクトリを設定
app.use('/static', express.static(path.join(__dirname, 'public')));


app.get('/',
  (req, res) => {
    res.status(200).send('ルートページ！！！');
  }
);


app.get('/user/:id',
  async(req, res) => {
    try{
      const user = await userHundler.getUser(req);
      res.status(200).send(user);
    } catch(e) {
      console.error(e);
      res.status(500).send('エラー');
    } 
  }
);

app.get('/users',
  async(req, res) => {
    try{
      const locals = await userHundler.getUsers(req);
      // htmlをレンダリング
      res.status(200).render(path.join(__dirname, 'views', 'index.ejs'), locals);
    } catch(e){
      console.error(e);
      res.status(500).send('エラー：500'); 
    }
  },
)

// redisのイベントハンドリング
// 'ready'は、redisと接続が完了した際に発生するイベント。onceは、イベントに対して1度だけCallbackを実行する
redis.connect()
  .once('ready', async() => {
    try{
      await redis.initUserData();
      app.listen(3000);
    } catch(e) {
      console.log(e);
      process.exit(1);
    }
  })
  .on('error', (e) => {
    console.log(e);
    process.exit(2);
  });
