import { Sequelize } from 'sequelize';
import { env } from './env';

let sequelize: Sequelize;

export async function initializeDatabase(): Promise<Sequelize> {
  sequelize = new Sequelize({
    dialect: 'postgres',
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    logging: env.NODE_ENV === 'development' ? console.log : false
  });

  // Sincronizar base de datos
  await sequelize.sync({ alter: env.NODE_ENV === 'development' });
  console.log('📦 Base de datos conectada');

  return sequelize;
}

export { sequelize };