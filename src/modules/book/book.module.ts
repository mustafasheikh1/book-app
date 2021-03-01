import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Book } from 'database/models/book/book.model';
import { BookController } from './book.controller';
import { BookService } from './book.service';

@Module({
	imports: [SequelizeModule.forFeature([Book])],
	controllers: [BookController],
	providers: [BookService],
	exports: [BookService],
})
export class BookModule {}
