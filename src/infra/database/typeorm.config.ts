import { DataSource } from 'typeorm';
import { Partner } from '../../domain/entities/Partner';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'admin',
  password: 'adminpassword',
  database: 'zedelivery',
  synchronize: true, // Cria as tabelas automaticamente (use migrations em prod)
  logging: false,
  entities: [Partner],
});
