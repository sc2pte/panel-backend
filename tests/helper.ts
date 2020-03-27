const getConfig = (enableRedis: boolean) => {
  return {
    app: {
      nodeEnv: 'test',
      port: '8123',
    },
    bas: {
      url: 'http://localhost:8081',
      statusEndpoint: 'status',
      accessTokenEndpoint: 'accessToken/get',
      accessTokenRefreshEndpoint: 'accessToken/get?refresh=true',
    },
    bnet: {
      region: 'us',
    },
    db: {
      uri: 'http://localhost/db',
    },
    twitch: {
      clientId: 'fake_client_id',
      secret: 'fake_client_secret',
      enableOnAuthorized: true,
    },
    redis: {
      enable: enableRedis,
      host: '127.0.0.1',
      port: '6379',
      password: '',
      db: '0',
      replyCachePeriod: 2000,
      ttl: {
        static: 21,
        metadata: 22,
        profile: 23,
        ladderSummary: 24,
        ladder: 25,
        grandmaster: 26,
        season: 27,
        league: 28,
        legacy: {
          profile: 29,
          ladders: 30,
          matchHistory: 31,
          ladder: 32,
          achievements: 33,
          rewards: 34,
        },
      },
    },
    maxPlayerProfileCount: 5,
  }
}

export default getConfig;