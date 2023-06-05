// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');

dotenv.config({ path: '../../.env' });

module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  define: {
    timestamps: false,
  },
  logging: false,
  connectionTimeout: 0,
  seederStorage: 'sequelize',
  seederStorageTableName: 'seeder_actions',
};
