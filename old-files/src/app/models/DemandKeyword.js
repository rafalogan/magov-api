import Sequelize, { Model } from 'sequelize';

class DemandKeyword extends Model {
    static init(sequelize) {
        super.init(
            {
                word: Sequelize.STRING,
                demand: Sequelize.INTEGER,
                active: Sequelize.INTEGER,
            },
            {
                sequelize,
                freezeTableName: true,
                tableName: 'demand_keyword'
            }
        );
        return this;
    }
    static associate(models) {
        this.belongsTo(models.Demand, { foreignKey: 'demand' })
    }
}

export default DemandKeyword;
