'use strict'

const express = require('express');
const Redis = require('ioredis');
const path = require('path');

const app = express();
// レンプレートエンジンを指定
app.set('view engine', 'ejs');
// 静的ファイルを持つディレクトリを設定
app.use('/static', express.static(path.join(__dirname, 'public')));

// redisの接続情報
const redis = new Redis({
  port: 6379,
  host: 'localhost',
  password: process.env.REDIS_PASSWORD,
  enableOfflineQueue: false,
});

// DBのデータ初期化処理
const initUserData = async() => {
  await Promise.all([
    redis.set('users:1', JSON.stringify({ id: 1, name: 'a1' })),
    redis.set('users:2', JSON.stringify({ id: 2, name: 'b2' })),
    redis.set('users:3', JSON.stringify({ id: 3, name: 'c3' })),
    redis.set('users:4', JSON.stringify({ id: 4, name: 'd4' })),
    redis.set('users:5', JSON.stringify({ id: 5, name: 'e5' }))
  ])
}

app.get('/',
  (req, res) => {
    res.status(200).send('ルートページ！！！');
  }
);

app.get('/user/:id',
  async(req, res) => {
    try{
      const userId = `users:${req.params.id}`;
      const data = await redis.get(userId);
      const user = JSON.parse(data);
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
      const stream = redis.scanStream({
        match: 'users:*',
        count: 2, // 2つずつデータを取得
      });

      const users = [];
      // streamで取得した
      for await (const resultKeys of stream) {
        for await (const key of resultKeys) {
          const val = await redis.get(key);
          const user = JSON.parse(val);
          users.push(user);
        }
      }
      // htmlをレンダリング
      res.status(200).render(path.join(__dirname, 'views', 'index.ejs'), { users, });
    } catch(e){
      console.error(e);
      res.status(500).send('エラー：500'); 
    }
  },
)

// redisのイベントハンドリング
// 'ready'は、redisと接続が完了した際に発生するイベント。onceは、イベントに対して1度だけCallbackを実行する
redis.once('ready', async() => {
  try{
    await initUserData();
    app.listen(3000);
  } catch(e) {
    console.log(e);
    process.exit(1);
  }
})

redis.on('error', (e) => {
  console.log(e);
  process.exit(2);
});
