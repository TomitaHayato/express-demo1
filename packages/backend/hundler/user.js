const redis = require('../lib/redis');

const getUser = async(req) => {
  const userId = `users:${req.params.id}`;
  const data   = await redis.getClient().get(userId);
  const user   = JSON.parse(data);
  return user;
}

const getUsers = async(req) => {
  const stream = redis.getClient().scanStream({
    match: 'users:*',
    count: 2, // 2つずつデータを取得
  });

  const users = [];

  // streamで取得した
  for await (const resultKeys of stream) {
    for await (const key of resultKeys) {
      const val = await redis.getClient().get(key);
      const user = JSON.parse(val);
      users.push(user);
    }
  }

  return { users };
}

module.exports = {
  getUser,
  getUsers,
}