import Sequelize, { Model } from 'sequelize';

class RevenueOrigin extends Model {

    static init(sequelize) {
        super.init(
            {
                expense: Sequelize.INTEGER,
                revenue: Sequelize.INTEGER,
                origin: Sequelize.INTEGER,
                active: Sequelize.INTEGER
            },
            {
                sequelize,
                freezeTableName: true,
                tableName: 'revenue_origin',
            }
        );
        return this;
    }
    static associate(models) {
        this.belongsTo(models.Expense, { foreignKey: 'expense' })
        this.belongsTo(models.Revenue, { foreignKey: 'revenue' })
        this.belongsTo(models.Origin, { foreignKey: 'origin' })
    }
}

export default RevenueOrigin;
