const mockRedisGet = jest.fn();
const mockRedisScanStream = jest.fn();
// require('../lib/redis')の返り値を、第２引数のCallbackの返り値に変更。
// ここでは、getClient関数の中身を、get, scanStreamのMockを返すObjectに置き換える
jest.mock('../lib/redis', () => {
  return {
    getClient: jest.fn().mockImplementation(() => {
      return {
        get: mockRedisGet,
        scanStream: mockRedisScanStream,
      }
    })
  }
});

const { getUser, getUsers } = require('./user');

// 全テスト前に実行される処理
beforeEach(() => {
  // モックに記録されたデータをリセット（呼び出し回数など）
  mockRedisGet.mockClear();
  mockRedisScanStream.mockClear();
});

test('getUser', async() => {
  // mockRedisGetの返り値を変更. ここでは、Redisから1つのUserデータをJSONで返す
  mockRedisGet.mockResolvedValue(JSON.stringify({ id: 1, name: 'alpha' }));

  const reqMock = { params: { id: 1 } }
  const res = await getUser(reqMock);
  // 返り値のテスト
  expect(res.id).toStrictEqual(1);
  expect(res.name).toStrictEqual('alpha');
  // Mockの呼び出し回数. Redisからデータを取得したかどうかを確認する
  expect(mockRedisGet).toHaveBeenCalledTimes(1);
  // 返り値
  const [arg1] = mockRedisGet.mock.calls[0];
  expect(arg1).toStrictEqual('users:1');
});

test('getUsers', async() => {
  // SymbolとGeneratorというJavascriptの機能を用いて、StreamのMock化
  const streamMock = {
    async* [Symbol.asyncIterator]() {
      yield ['users:1', 'users:2'];
      yield ['users:3', 'users:4'];
    }
  };

  mockRedisScanStream.mockReturnValueOnce(streamMock);
  mockRedisGet.mockImplementation((key) => {
    switch(key) {
      case 'users:1':
        return Promise.resolve(JSON.stringify({ id: 1, name: 'a1' }));
      case 'users:2':
        return Promise.resolve(JSON.stringify({ id: 2, name: 'b2' }));
      case 'users:3':
        return Promise.resolve(JSON.stringify({ id: 3, name: 'c3' }));
      case 'users:4':
        return Promise.resolve(JSON.stringify({ id: 4, name: 'd4' }));
    }
    return Promise.resolve(null);
  })

  const reqMock = { };

  const res = await getUsers(reqMock);

  expect(mockRedisGet).toHaveBeenCalledTimes(4);
  expect(res.users.length).toStrictEqual(4);
  expect(res.users).toStrictEqual([
    { id: 1, name: 'a1' },
    { id: 2, name: 'b2' },
    { id: 3, name: 'c3' },
    { id: 4, name: 'd4' },
  ])
})
