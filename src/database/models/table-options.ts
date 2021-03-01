import { TableOptions } from 'sequelize-typescript';

export const tableOptions: TableOptions = {
	timestamp: true,
	freezeTableName: true,
	underscored: true,
	initialAutoIncrement: '100000',
	version: false,
} as TableOptions;
