import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IUser } from '@common/interfaces/user/IUser';
import { User } from '../../database/models/user/user.model';
import { ValidationError, UniqueConstraintError, Transaction } from 'sequelize';
import { IEmailVerification } from '@common/interfaces/auth/IEmailVerification';
import { Sequelize } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UserService {
	constructor(
		private readonly _sequelize: Sequelize,
		@InjectModel(User)
		private readonly _user: typeof User,
	) {}

	/**
	 * @description Create New User
	 */
	public async createNewUser($user: IUser): Promise<IUser> {
		return await this._sequelize
			.transaction<User>(async (trans: Transaction) => {
				return await this._user.create<User>($user, { transaction: trans });
			})
			.catch((err) => {
				console.log(err);
				if (err instanceof ValidationError || err instanceof UniqueConstraintError) throw err;
				else throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
			});
	}

	/**
	 * @description Get User Data By His Email Address
	 * @param $email
	 */
	public async getUserByEmail($email: string): Promise<IUser> {
		try {
			return await User.findOne({
				where: {
					email: $email,
				},
				attributes: ['id', 'email', 'password', 'firstName', 'lastName'],
			});
		} catch (err) {
			console.log(err);
			return null;
		}
	}
	/**
	 * @description Get User Data By His Email Address
	 * @param $id
	 */
	public async getUserById($id: string): Promise<IUser> {
		return await User.findByPk<User>($id, {
			attributes: ['id', 'email', 'firstName', 'lastName'],
		});
	}

	/**
	 * @description Check User Data By His JWT Decoded Data
	 * @param $id
	 * @param $email
	 * @param $userName
	 */
	public async validateUser($id: string, $email: string): Promise<IUser> {
		console.log('[DATA]', $id, $email);
		const user = await User.findByPk<User>($id, {
			attributes: { exclude: ['password'] },
		});

		if (user) {
			return {
				id: user.id,
				email: user.email,
			} as IUser;
		} else {
			return null;
		}
	}
	/********************************* Activation Services ********************************/
	/**
	 * @description Set user email as active
	 * @param user
	 */
	public async verifyEmail(emailVerification: IEmailVerification) {
		return await this._sequelize.transaction(async (trans) => {
			await User.update(
				{ isEmailVerified: true },
				{
					where: { id: emailVerification.userId, email: emailVerification.email },
					transaction: trans,
				},
			);
		});
	}
	/**
	 * @description Set user's mobile number  as verified
	 * @param user
	 */
	public async setMobileNumberAsVerified(user: IUser) {
		return await this._sequelize.transaction(async (trans) => {
			await User.update(
				{ isMobileVerified: true },
				{
					where: { id: user.id },
					transaction: trans,
				},
			);
		});
	}

	public async updateNewUserFlag($user: IUser) {
		try {
			console.log('[UPDATING_NEW_USER_FLAG]');
			await this._user.update({ isNew: false }, { where: { id: $user.id } });
			return;
		} catch (err) {
			console.log(err);
			return;
		}
	}
}
