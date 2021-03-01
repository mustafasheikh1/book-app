import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';

import { DATABASE_CONFIG } from './database/config/database.provider';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { APP_PIPE } from '@nestjs/core';
import { BookModule } from '@modules/book/book.module';

@Module({
	imports: [SequelizeModule.forRoot({ ...DATABASE_CONFIG(), autoLoadModels: true }), AuthModule, BookModule],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_PIPE,
			useClass: ValidationPipe,
		},
	],
	exports: [],
})
export class AppModule {}
