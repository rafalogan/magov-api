import Sequelize, { Model } from 'sequelize';

class PropositionTask extends Model {

    static init(sequelize) {
        super.init(
            {
                proposition: Sequelize.INTEGER,
                task: Sequelize.INTEGER,
                active: Sequelize.INTEGER
            },
            {
                sequelize,
                freezeTableName: true,
                tableName: 'proposition_task',
            }
        );
        return this;
    }

    static associate(models) {
        this.belongsTo(models.Proposition, { foreignKey: 'proposition' })
        this.belongsTo(models.Task, { foreignKey: 'task' })
    }
}

export default PropositionTask;
