import bcrypt from 'bcryptjs';
import Sequelize, { Model } from 'sequelize';

class TaskResponsible extends Model {

	static init(sequelize) {
		super.init(
			{
				task: Sequelize.INTEGER,
				responsible: Sequelize.STRING,
				active: Sequelize.BOOLEAN,
			},
			{
				sequelize,
				freezeTableName: true,
				tableName: 'task_responsible',
			}
		);
		return this;
	}

	static associate(models) {
		this.belongsTo(models.Task, { foreignKey: 'task' })
		this.belongsTo(models.PhysicalPerson, { foreignKey: 'responsible' })

	}
}

export default TaskResponsible;
