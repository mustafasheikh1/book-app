import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { IJwtPayload } from '@common/interfaces/auth/IJwtPayload';
import { jwtConstants } from '@common/constants/jwt.constants';
import { IUser } from '@common/interfaces/user/IUser';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly _authService: AuthService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: jwtConstants.secret,
		});
	}

	async validate(payload: IJwtPayload, done: VerifiedCallback) {
		const user: IUser | HttpException = await this._authService.validateUser(payload);

		if (!user) {
			return done(new HttpException({ message: 'In Valid Token' }, HttpStatus.UNAUTHORIZED), false);
		}

		return done(null, user, payload.iat);
	}
}
