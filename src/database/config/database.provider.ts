import { SequelizeOptions } from 'sequelize-typescript';
import { databaseConfig } from './database.config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import * as dotenv from 'dotenv';

export const DATABASE_CONFIG = (): SequelizeModuleOptions => {
	let config: SequelizeOptions;
	dotenv.config();
	console.log('[ENV]', process.env.NODE_ENV);

	switch (process.env.NODE_ENV) {
		case 'production':
		case 'prod':
			config = databaseConfig.production as SequelizeOptions;
			break;
		case 'dev':
		case 'development':
			console.log('[DEV_DB_CONNECTED]');
			config = databaseConfig.development as SequelizeOptions;
			break;
		case 'test':
		case 'stage':
			console.log('[STAGE_DB_CONNECTED]');
			config = databaseConfig.test as SequelizeOptions;
			break;
		default:
			config = databaseConfig.development as SequelizeOptions;
			break;
	}
	return config;
};
