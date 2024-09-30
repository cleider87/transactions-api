export default () => ({
  app: {
    name: process.env.APP_NAME || 'Transactions API',
    port: parseInt(process.env.APP_PORT, 10) || 3000,
    environment: process.env.NODE_ENV || 'development',
    apiPrefix: process.env.API_PREFIX || 'api',
    logLevel: process.env.LOG_LEVEL || 'debug',
  },
  database: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME || 'transactions_db',
    synchronize: process.env.TYPEORM_SYNC === 'true',
    dropSchema: process.env.TYPEORM_DROP_SCHEMA === 'true',
    logging: process.env.TYPEORM_LOGGING === 'true',
  },
  security: {
    host: process.env.AUTHENTICATION_SERVER,
    jwtSecret: process.env.JWT_SECRET || 'defaultSecret',
    jwtExpirationTime: process.env.JWT_EXPIRATION_TIME || '3600s',
  },
});
