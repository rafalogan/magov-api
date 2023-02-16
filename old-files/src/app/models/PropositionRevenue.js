import Sequelize, { Model } from 'sequelize';

class PropositionRevenue extends Model {

    static init(sequelize) {
        super.init(
            {
                proposition: Sequelize.INTEGER,
                revenue: Sequelize.INTEGER,
                active: Sequelize.INTEGER,
            },
            {
                sequelize,
                freezeTableName: true,
                tableName: 'proposition_revenue',
            }
        );
        return this;
    }
    static associate(models) {
        this.belongsTo(models.Revenue, {foreignKey: 'revenue'})
        this.belongsTo(models.Proposition, { foreignKey: 'proposition'})
    }
}

export default PropositionRevenue;
