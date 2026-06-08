import { Sequelize } from 'sequelize';
import { env } from './env';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  logging: env.NODE_ENV === 'development' ? console.log : false
});

export async function initializeDatabase(): Promise<Sequelize> {
  await sequelize.sync();
  console.log('📦 Base de datos conectada');

  return sequelize;
}

export { sequelize };