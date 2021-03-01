import { Table, Column, Model, DataType, IsUUID, BeforeCreate, AfterSave, AfterCreate } from 'sequelize-typescript';
import { tableOptions } from '../table-options';
import { hashSync, genSaltSync } from 'bcrypt';

/**
 *
 */
tableOptions.tableName = 'u_user';
@Table(tableOptions)
export class User extends Model {
	@IsUUID('4')
	@Column({
		type: DataType.STRING(36),
		allowNull: false,
		primaryKey: true,
		defaultValue: DataType.UUIDV4,
	})
	public id: string;

	@Column({ validate: { isEmail: true }, type: DataType.STRING, allowNull: false, unique: true })
	email: string;

	@Column({ type: DataType.TEXT, allowNull: false })
	password: string;

	@Column({ type: DataType.STRING, allowNull: false })
	firstName: string;

	@Column({ type: DataType.STRING, allowNull: false })
	lastName: string;

	/**
	 * Relations
	 */

	/**
	 * @description Hooks
	 * @param user
	 * @param options
	 */
	@BeforeCreate
	public static async hashPassword(user: User, options: any) {
		if (!options.transaction) {
			throw new Error('Missing transaction.');
		}
		const salt = genSaltSync(12);
		user.password = hashSync(user.password, salt);
	}

	@AfterSave
	@AfterCreate
	static removePassword(user: any) {
		if (user.length === undefined) user.password = undefined;
		else user.forEach((_user: User) => (_user.password = undefined));
		return user;
	}
}
