import { CurrentUser } from '@common/decorators/current-user.decorator';
import { IUser } from '@common/interfaces/user/IUser';
import { Controller, Get, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UserService } from './user.service';

/**
 *
 */
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
	constructor(private readonly _user: UserService) {}
	/**
	 * Get user Informantion
	 */
	@Get('profile')
	async getUser(@CurrentUser() user: IUser): Promise<IUser | HttpException | any> {
		if (!user || !user.id) {
			return new HttpException('User not Found', HttpStatus.NOT_FOUND);
		}
		return this._user.getUserById(user.id);
	}
}
