import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@modules/user/user.service';
import { IUser } from '@common/interfaces/user/IUser';
import { IJwtPayload } from '@common/interfaces/auth/IJwtPayload';
import { IAuthResponse } from '@common/interfaces/auth/IAuthResponse';
import { IAuthRequest } from '@common/interfaces/auth/IAuthRequest';
import { compareSync } from 'bcrypt';
import isEmail from 'validator/lib/isEmail';
import { EmailVerification } from 'database/models/auth/email-verifications.model';
import { Sequelize } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(EmailVerification) private readonly _emailVerification: typeof EmailVerification,
		private readonly _sequelize: Sequelize,
		private readonly _usersService: UserService,
		private readonly _jwtService: JwtService,
	) {}

	/**
	 * @description Create New User
	 * @param user
	 */
	public async createNewUser(user: IUser) {
		try {
			if (await this._usersService.getUserByEmail(user.email)) {
				return new HttpException('User Already Exsists', HttpStatus.CONFLICT);
			}

			const $user: IUser = await this._usersService.createNewUser(user);

			const jwtPayload: IJwtPayload = {
				id: $user.id,
				email: $user.email,
				iat: new Date().getTime() / 1000,
			};

			const accessToken = this._jwtService.sign(jwtPayload);
			if (accessToken) {
				return { authorized: true, access_token: accessToken, user: await this._usersService.getUserById($user.id) };
			}
			return new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
		} catch (err) {
			return new HttpException(err, HttpStatus.BAD_REQUEST);
		}
	}
	/**
	 * @description Main Auth Service & Return access_token
	 * @param loginInfo
	 */
	public async auth(loginInfo: IAuthRequest): Promise<IAuthResponse | HttpException> {
		let user: IUser;
		if (isEmail(loginInfo.email)) {
			user = await this._usersService.getUserByEmail(loginInfo.email);
		} else {
			return new HttpException('Invalid Email', HttpStatus.BAD_REQUEST);
		}

		if (!user) {
			return new HttpException('User not Found', HttpStatus.NOT_FOUND);
		}
		if (user && user.password && compareSync(loginInfo.password, user.password)) {
			const jwtPayload: IJwtPayload = {
				id: user.id,
				email: user.email,
				iat: new Date().getTime() / 1000,
			};

			console.log('[JWT-PAYLOAD]', jwtPayload);
			const accessToken = this._jwtService.sign(jwtPayload);
			console.log('[ACCESS-TOKEN]', accessToken);
			if (accessToken) {
				return { authorized: true, access_token: accessToken, user: await this._usersService.getUserById(user.id) };
			}
		} else {
			return new HttpException('Incorrent Credentials', HttpStatus.BAD_REQUEST);
		}

		return new HttpException('request:unauthorized', HttpStatus.INTERNAL_SERVER_ERROR);
	}

	/**
	 * @description  Validate User Decoded From JWT
	 */
	public async validateUser(payload: IJwtPayload): Promise<IUser> {
		return await this._usersService.validateUser(payload.id, payload.email);
	}
}
