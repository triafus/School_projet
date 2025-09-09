import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../src/users/user.entity';
import { Image } from '../src/images/image.entity';

export const testDatabaseConfig: TypeOrmModuleOptions =
  process.env.USE_SQLITE !== 'false'
    ? {
        type: 'sqlite',
        database: ':memory:',
        entities: [User, Image],
        synchronize: true,
        dropSchema: true,
        logging: false,
      }
    : {
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_DATABASE || 'test_db',
        entities: [User, Image],
        synchronize: true,
        dropSchema: true,
        logging: false,
      };