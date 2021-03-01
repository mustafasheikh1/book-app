import { CurrentUser } from '@common/decorators/current-user.decorator';
import { IBook } from '@common/interfaces/book/IBook';
import { IUser } from '@common/interfaces/user/IUser';
import {
	Controller,
	Get,
	UseGuards,
	HttpException,
	HttpStatus,
	Body,
	Post,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateBookDto, EditBookDto } from './book.dto';
import { BookService } from './book.service';

/**
 *
 */
@UseGuards(JwtAuthGuard)
@Controller('book')
export class BookController {
	constructor(private readonly _book: BookService) {}
	/**
	 * Get All Books
	 */
	@Get()
	async getBooks(@CurrentUser() user: IUser): Promise<IBook[] | HttpException> {
		if (!user || !user.id) {
			return new HttpException('User not Found', HttpStatus.NOT_FOUND);
		}
		return this._book.getAllBooks(user);
	}

	/**
	 * Add Book
	 */
	@Post()
	async addBook(@CurrentUser() user: IUser, @Body() book: CreateBookDto): Promise<IBook | HttpException> {
		try {
			if (!user || !user.id) {
				return new HttpException('User not Found', HttpStatus.NOT_FOUND);
			}
			return this._book.addBook({ ...book, autherId: user.id });
		} catch (err) {
			return new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @description Patch Book
	 * @param param
	 * @param user
	 * @param book
	 */
	@Patch(':id')
	async patchBook(
		@Param() param: { id: string },
		@CurrentUser() user: IUser,
		@Body() book: EditBookDto,
	): Promise<IBook | HttpException> {
		try {
			if (!user || !user.id) {
				return new HttpException('User not Found', HttpStatus.NOT_FOUND);
			}
			return this._book.patchBook(param.id, book as IBook, user);
		} catch (err) {
			return new HttpException('Internet Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Delete(':id')
	async deleteBook(@Param() param: { id: string }, @CurrentUser() user: IUser): Promise<IBook | HttpException> {
		try {
			if (!user || !user.id) {
				return new HttpException('User not Found', HttpStatus.NOT_FOUND);
			}
			return this._book.deleteBook(param.id, user);
		} catch (err) {
			return new HttpException('Internet Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
