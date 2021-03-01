export interface IDatabaseConfigAttributes {
	username: string;
	password: string;
	database: string;
	host: string;
	port: number;
	dialect: string;
	logging: boolean | (() => void);
	force: boolean;
	timezone: string;
	pool: {
		max: number;
		min: number;
		idl: number;
		acquire: number;
	};
	define: { charset: string; collate: string };
	dateStrings: boolean;
}

export interface IDatabaseConfig {
	development: IDatabaseConfigAttributes;
	production: IDatabaseConfigAttributes;
	test: IDatabaseConfigAttributes;
}
