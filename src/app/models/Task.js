import Sequelize, { Model } from 'sequelize';

class Task extends Model {

    static init(sequelize) {
        super.init(
            {
                title: Sequelize.STRING,
                description: Sequelize.STRING,
                user: Sequelize.INTEGER,
                theme: Sequelize.INTEGER,
                start: Sequelize.DATE,
                end: Sequelize.DATE,
                cost: Sequelize.DECIMAL(16,2),
                event: Sequelize.INTEGER,
                unit: Sequelize.INTEGER,
                level: Sequelize.INTEGER,
                created_by: Sequelize.INTEGER,
                status: Sequelize.INTEGER,
                active: Sequelize.INTEGER,
            },
            {
                sequelize,
                freezeTableName: true,
                tableName: 'task',
            }
        );
        return this;
    }
    static associate(models) {
        this.hasMany(models.DemandTask, { foreignKey: 'task' })
        this.hasMany(models.PropositionTask, { foreignKey: 'task' })
        this.hasMany(models.CommentWarning, { foreignKey: 'task' })
        this.hasMany(models.DemandTask, { foreignKey: 'task' })
        this.hasMany(models.TaskResponsible, { foreignKey: 'task' })
        this.belongsTo(models.User, { foreignKey: 'user' })
        this.belongsTo(models.Theme, { foreignKey: 'theme' })
        this.belongsTo(models.Unit, { foreignKey: 'unit' })
        this.belongsTo(models.User, { foreignKey: 'created_by'})
    }
}

export default Task;
