import Sequelize, { Model } from 'sequelize';

class RevenueTypeRevenue extends Model {

    static init(sequelize) {
        super.init(
            {
                revenue: Sequelize.INTEGER,
                type: Sequelize.INTEGER,
                active: Sequelize.INTEGER
            },
            {
                sequelize,
                freezeTableName: true,
                tableName: 'revenue_type_revenue',
            }
        );
        return this;
    }
    static associate(models) {
        this.belongsTo(models.Revenue, { foreignKey: 'revenue' })
        this.belongsTo(models.RevenueType, { foreignKey: 'type' })
    }
}

export default RevenueTypeRevenue;
