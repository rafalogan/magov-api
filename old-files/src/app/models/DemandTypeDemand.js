import Sequelize, { Model } from 'sequelize';

class DemandTypeDemand extends Model {
    static init(sequelize) {
        super.init(
            {
                demand: Sequelize.INTEGER,
                demand_type: Sequelize.INTEGER,
                active: Sequelize.INTEGER,
            },
            {
                sequelize,
                freezeTableName: true,
                tableName: 'demand_type_demand',
            }
        );
        return this;
    }
    static associate(models) {
        this.belongsTo(models.Demand, { foreignKey: 'demand' })
        this.belongsTo(models.DemandType, { foreignKey: 'demand_type' })
    }
}

export default DemandTypeDemand;
