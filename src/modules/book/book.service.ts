import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { IBook } from '@common/interfaces/book/IBook';
import { Book } from '../../database/models/book/book.model';
import { ValidationError, UniqueConstraintError, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';
import { IUser } from '@common/interfaces/user/IUser';

@Injectable()
export class BookService {
	constructor(
		private readonly _sequelize: Sequelize,
		@InjectModel(Book)
		private readonly _book: typeof Book,
	) {}

	/**
	 * @description Add Book
	 */
	public async addBook($book: IBook): Promise<IBook | HttpException> {
		return await this._sequelize
			.transaction<Book>(async (trans: Transaction) => {
				return await this._book.create<Book>($book, { transaction: trans });
			})
			.catch((err) => {
				if (err.name && err.name == 'SequelizeUniqueConstraintError') {
					return new HttpException('The Book Already exisits', HttpStatus.CONFLICT);
				}
				return new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);

				if (err instanceof ValidationError || err instanceof UniqueConstraintError) throw err;
				return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
			});
	}

	/**
	 * @description Get All Book
	 */
	public async getAllBooks($user: IUser): Promise<IBook[] | HttpException> {
		try {
			return await this._book.findAll<Book>({ where: { autherId: $user.id } });
		} catch (err) {
			if (err instanceof ValidationError || err instanceof UniqueConstraintError) throw err;
			return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @description Get Single Book
	 * @param $id
	 * @param $user
	 */
	public async getBook($id: string, $user: IUser): Promise<IBook | HttpException> {
		try {
			return await this._book.findOne<Book>({ where: { id: $id, autherId: $user.id } });
		} catch (err) {
			if (err instanceof ValidationError || err instanceof UniqueConstraintError) throw err;
			return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @description Patch / Edit Book
	 * @param $id
	 * @param $book
	 * @param $user
	 */
	public async patchBook($id: string, $book: IBook, $user: IUser): Promise<IBook | HttpException> {
		try {
			await this._book.update<Book>($book, { where: { id: $id, autherId: $user.id } });
			return await this.getBook($id, $user);
		} catch (err) {
			return new HttpException('Error while Updating', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @description Patch / Edit Book
	 * @param $id
	 * @param $user
	 */
	public async deleteBook($id: string, $user: IUser) {
		try {
			await this._book.destroy<Book>({ where: { id: $id, autherId: $user.id } });
		} catch (err) {
			return new HttpException('Error while Updating', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
