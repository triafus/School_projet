"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testDatabaseConfig = void 0;
const user_entity_1 = require("../src/users/user.entity");
const image_entity_1 = require("../src/images/image.entity");
exports.testDatabaseConfig = process.env.USE_SQLITE !== 'false'
    ? {
        type: 'sqlite',
        database: ':memory:',
        entities: [user_entity_1.User, image_entity_1.Image],
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
        entities: [user_entity_1.User, image_entity_1.Image],
        synchronize: true,
        dropSchema: true,
        logging: false,
    };
//# sourceMappingURL=typeorm-test.config.js.map