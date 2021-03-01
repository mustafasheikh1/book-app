import { IsString, IsOptional, IsIBAN } from 'class-validator';

export class CreateBookDto {
	@IsIBAN()
	iban: string;

	@IsString()
	name: string;
}

export class EditBookDto {
	@IsIBAN()
	@IsOptional()
	iban: string;

	@IsString()
	@IsOptional()
	name: string;
}
