const Redis = require('ioredis');
const { redisConf } = require('../config/config');

let redis = null;

const getClient = () => {
  return redis;
}

// Redisとの接続処理
const connect = () => {
  if(!redis) {
    redis = new Redis(redisConf);
  }
  return redis;
}

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

module.exports = {
  getClient,
  connect,
  initUserData,
}
