import { Table, Column, Model, DataType, IsUUID, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { tableOptions } from '../table-options';
import { User } from '../user';

/**
 *
 */
tableOptions.tableName = 'b_book';
@Table(tableOptions)
export class Book extends Model {
	@IsUUID('4')
	@Column({
		type: DataType.STRING(36),
		allowNull: false,
		primaryKey: true,
		defaultValue: DataType.UUIDV4,
	})
	public id: string;

	@Column({ type: DataType.STRING, allowNull: false })
	name: string;

	@Column({ type: DataType.TEXT, allowNull: false, unique: true })
	iban: string;

	/**
	 * Relations
	 */

	@BelongsTo(() => User, { foreignKey: 'autherId' })
	auther: User;
	@ForeignKey(() => User)
	@Column({ type: DataType.STRING(36), allowNull: false })
	autherId: string;
}
