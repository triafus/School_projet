import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { beforeAll, afterAll } from '@jest/globals';
import { testDatabaseConfig } from './typeorm-test.config';

beforeAll(async () => {
  const module = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot(testDatabaseConfig),
    ],
  }).compile();

  global.testApp = module.createNestApplication();
  await global.testApp.init();
}, 30000);

afterAll(async () => {
  if (global.testApp) {
    await global.testApp.close();
  }
});