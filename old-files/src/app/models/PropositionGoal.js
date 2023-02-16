import Sequelize, { Model } from 'sequelize';

class PropositionGoal extends Model {
    static init(sequelize) {
        super.init(
            {
                proposition: Sequelize.INTEGER,
                goal: Sequelize.INTEGER,
                active: Sequelize.INTEGER,
            }, {
            sequelize,
            freezeTableName: true,
            tableName: 'proposition_goal',
        }
        );
        return this;
    }
    static associate(models) {
        this.belongsTo(models.Proposition, {foreignKey: 'proposition'})
        this.belongsTo(models.Goal, { foreignKey: 'proposition'})
    }
}

export default PropositionGoal;
