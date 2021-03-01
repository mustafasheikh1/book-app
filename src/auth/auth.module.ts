import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { jwtConstants } from '@common/constants/jwt.constants';
import { SequelizeModule } from '@nestjs/sequelize';
import { EmailVerification } from 'database/models/auth';
import { UserModule } from '@modules/user/user.module';

@Module({
	imports: [
		UserModule,
		SequelizeModule.forFeature([EmailVerification]),
		PassportModule,
		JwtModule.register({
			secret: jwtConstants.secret,
			signOptions: {
				expiresIn: jwtConstants.expiresIn,
				algorithm: 'HS256',
				// issuer: 'iss',
			},
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
	exports: [AuthService],
})
export class AuthModule {}
