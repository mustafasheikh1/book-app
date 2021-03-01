import { IsString, IsEmail, Length } from 'class-validator';

export class CreateAutherDto {
	// Authentication Data
	@IsString({ message: 'Email must be a string' })
	@IsEmail({}, { message: 'Invalid Email' })
	email: string;

	@IsString({ message: 'Password must be string' })
	password: string;

	@IsString({ message: 'First Name must be a string' })
	@Length(3, 15, { message: 'First Name min: 3, max: 15' })
	firstName: string;

	@IsString({ message: 'Last Name must be a string' })
	@Length(3, 15, { message: 'Last Name min: 3, max: 15' })
	lastName: string;
}
