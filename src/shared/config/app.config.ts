import * as dotenv from 'dotenv';
import { join } from 'path';

// Load environment variables from the .env file
dotenv.config({ path: join(__dirname, '../../.env') });

export default () => ({
  // App-related configurations
  appName: process.env.APP_NAME || 'Transactions API',
  port: parseInt(process.env.APP_PORT, 10) || 3000,
  environment: process.env.NODE_ENV || 'development',

  // Database configurations
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'password',
    name: process.env.DB_NAME || 'transactions_db',
  },

  // JWT and security configurations
  jwtSecret: process.env.JWT_SECRET || 'defaultSecret',
  jwtExpirationTime: process.env.JWT_EXPIRATION_TIME || '3600s',

  // Other configurations
  apiPrefix: process.env.API_PREFIX || 'api',
  logLevel: process.env.LOG_LEVEL || 'debug',
});
