import { ConnectionOptions } from 'typeorm';
import {
  TYPEORM_HOST,
  TYPEORM_USERNAME,
  TYPEORM_PASSWORD,
  TYPEORM_DATABASE,
  TYPEORM_PORT,
  TYPEORM_SYNCHRONIZE,
  TYPEORM_LOGGING,
  TYPEORM_MIGRATIONS_RUN,
  PRODUCTION_ENV,
  TYPEORM_TYPE,
  LACCHAIN_IDENTITY_IS_DEPENDENT_SERVICE,
  log4TSProvider
} from '@config';

import { EC, Secp256k1DbService } from 'lacchain-key-manager';

const log = log4TSProvider.getLogger('ormConfig');

const config: ConnectionOptions = {
  type: TYPEORM_TYPE as 'mysql' | 'postgres' | 'mongodb',
  host: TYPEORM_HOST,
  username: TYPEORM_USERNAME,
  password: TYPEORM_PASSWORD,
  database: TYPEORM_DATABASE,
  port: Number.parseInt(TYPEORM_PORT || '5432'),
  synchronize: TYPEORM_SYNCHRONIZE === 'true',
  logging: TYPEORM_LOGGING === 'true' ? ['error'] : false,
  entities: [
    PRODUCTION_ENV ? 'dist/src/entities/**/*.js' : 'src/entities/**/*.ts'
  ],
  migrations: [
    PRODUCTION_ENV
      ? 'dist/src/database/migrations/**/*.js'
      : 'src/database/migrations/**/*.ts'
  ],
  migrationsRun: TYPEORM_MIGRATIONS_RUN === 'true',
  cli: {
    migrationsDir: PRODUCTION_ENV
      ? 'dist/src/database/migrations'
      : 'src/database/migrations',
    entitiesDir: PRODUCTION_ENV ? 'dist/src/entities' : 'src/entities'
  }
};

if (LACCHAIN_IDENTITY_IS_DEPENDENT_SERVICE !== 'true') {
  log.info('Importing entities from external components');
  config.entities?.push(EC);
  // eslint-disable-next-line max-len
  typeof Secp256k1DbService; // validates this service exist as of the key-manager version being installed
} else {
  log.info('Initializing with local entities');
}

export = config;
