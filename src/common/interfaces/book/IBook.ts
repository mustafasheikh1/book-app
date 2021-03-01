import { IUser } from '../user/IUser';

export interface IBook {
	id?: string;
	iban: string;
	name: string;
	autherId: string;
	auther?: IUser;
}
