import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { IAuthResponse } from '@common/interfaces/auth/IAuthResponse';
import { IAuthRequest } from '@common/interfaces/auth/IAuthRequest';
import { AuthService } from './auth.service';
import { IUser } from '@common/interfaces/user/IUser';
import { MessageCodeError } from '@common/errors/message-code-error';
import { CreateAutherDto } from './user.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly _auth: AuthService) {}
	/**
	 * Create New User => required Many related Works
	 */
	@Post('register')
	async createNewUser(@Body() user: CreateAutherDto): Promise<IAuthResponse | IUser | HttpException> {
		if (!user || !user.email || !user.password) {
			return new HttpException('Email and Password is Required', HttpStatus.BAD_REQUEST);
		} else {
			return this._auth.createNewUser(user);
		}
	}

	/**
	 * @description Log in
	 * @param credential
	 */
	@Post('login')
	public async loginl(@Body() credential: IAuthRequest): Promise<IAuthResponse | HttpException> {
		if (!credential) {
			throw new MessageCodeError('auth:login:missingInformation');
		} else if (!credential.email) {
			throw new MessageCodeError('auth:login:missingEmail/MRN/Username');
		} else if (!credential.password) {
			throw new MessageCodeError('auth:login:missingPassword');
		}
		try {
			return await this._auth.auth(credential);
		} catch (error) {
			throw error;
		}
	}
}
