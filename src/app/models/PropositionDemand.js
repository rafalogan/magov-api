import Sequelize, { Model } from 'sequelize';

class PropositionDemand extends Model {

    static init(sequelize) {
        super.init(
            {
                proposition: Sequelize.INTEGER,
                demand: Sequelize.INTEGER,
                active: Sequelize.INTEGER
            },
            {
                sequelize,
                freezeTableName: true,
                tableName: 'proposition_demand',
            }
        );
        return this;
    }
    static associate(models) {
        this.belongsTo(models.Proposition, { foreignKey: 'proposition' })
        this.belongsTo(models.Demand, { foreignKey: 'demand' })
    }
}

export default PropositionDemand;
