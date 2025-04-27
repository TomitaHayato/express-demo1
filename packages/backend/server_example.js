// expressの基本処理
const express = require('express');

// expressのデフォルト関数を実行し、サーバ用のインスタンスを生成
const app = express();

// ルート作成
// app.get(path, ミドルウェア1, ミドルウェア2, ミドルウェア3, ...)
const putLog = (req, res, next) => {
  console.log('GETリクエストを受け付けました');
  console.log(req.method, req.url);
  next();
}

const putLogCommon = (req, res, next) => {
  console.log('OK? OK!');
  next();
}
// すべてのPath共通のルーティング
app.use(putLogCommon);

app.get('/', 
  (req, res, next) => {
    console.log('ルートパスにアクセスです!!');
    next();
  },
  (req, res) => {
    res.status(200).send('ようこそ!')
  },
);

app.get('/user/:id',
  putLog,
  (req, res) => {
    const userId = req.params.id;
    res.status(200).send(`id:${userId}のユーザーページ`);
  }
);

const errorThrow = (req, res, next) => {
  next(new Error('ミドルウェアからのエラー発生'));
}

app.get('/err',
  errorThrow,
  (req, res) => {
    res.status(200).send(req.url);
  }
)

// ポート開放
// app.listen(port, 起動時に実行されるCallback)
app.listen(3000, () => {
  console.log('サーバ起動！！');
});

// 包括的なエラーハンドリング
app.use((e, req, res, next) => {
  console.log('あかーーーーーーーーーん');
  res.status(500).send('エラーがありました');
});


