// redisの接続情報
const redisConf = {
  port: 6379,
  host: 'localhost',
  password: process.env.REDIS_PASSWORD,
  enableOfflineQueue: false,
};

module.exports = {
  redisConf,
}
