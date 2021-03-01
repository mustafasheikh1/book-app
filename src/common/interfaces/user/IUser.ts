export interface IUser {
	id?: string;
	email: string;
	password: string;
	firstName: string;
	lastName: string;
}

export interface ICreatedUser {
	email: string;
	password: string;
}
