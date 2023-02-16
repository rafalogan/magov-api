import Sequelize, { Model } from 'sequelize';

class TaskPlaintiff extends Model {

    static init(sequelize) {
        super.init(
            {

                plaintiff: Sequelize.INTEGER,
                task: Sequelize.INTEGER,
                active: Sequelize.INTEGER,
            },
            {
                sequelize,
                freezeTableName: true,
                tableName: 'task_plaintiff',
            }
        );
        return this;
    }
    static associate(models) {
        this.belongsTo(models.Plaintiff, { foreignKey: 'plaintiff' })
        this.belongsTo(models.Task, { foreignKey: 'task' })
    }
}

export default TaskPlaintiff;



