import bcrypt from 'bcryptjs';
import Sequelize, { Model } from 'sequelize';

class User extends Model {

	static init(sequelize) {
		super.init(
			{
				email: Sequelize.STRING,
				physical_person: Sequelize.INTEGER,
				password_hash: Sequelize.STRING,
				company: Sequelize.INTEGER,
				role: Sequelize.INTEGER,
				hierarchy: Sequelize.INTEGER,
				unit: Sequelize.INTEGER,
				active: Sequelize.BOOLEAN,
			},
			{
				sequelize,
				freezeTableName: true,
				tableName: 'user',
			}
		);
		return this;
	}

	async checkPassword(password) {
		return bcrypt.compare(password, this.password_hash);
	}

	static associate(models) {
		this.belongsTo(models.Company, { foreignKey: 'company' })
		this.belongsTo(models.Unit, { foreignKey: 'unit' })
		this.belongsTo(models.Role, { foreignKey: 'role' })
		this.belongsTo(models.PhysicalPerson, { as: 'pf', foreignKey: 'physical_person' })
		this.hasMany(models.SquadUser, { foreignKey: 'user' })
		this.hasMany(models.Task, { foreignKey: 'user' })
		this.hasOne(models.Proposition, { foreignKey: 'created_by' })
		this.hasOne(models.Demand, { foreignKey: 'created_by' })
		this.hasOne(models.Task, { foreignKey: 'created_by' })
	}
}

export default User;
