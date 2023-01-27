import Sequelize, { Model } from 'sequelize';

class DemandGoal extends Model {
    static init(sequelize) {
        super.init(
            {
                demand: Sequelize.INTEGER,
                goal: Sequelize.INTEGER,
                active: Sequelize.INTEGER,
            },
            {
                sequelize,
                freezeTableName: true,
                tableName: 'demand_goal',
            }
        );
        return this;
    }
    static associate(models) {
        this.belongsTo(models.Demand, { foreignKey: 'demand' })
        this.belongsTo(models.Goal, { foreignKey: 'goal' })
    }
}

export default DemandGoal;
