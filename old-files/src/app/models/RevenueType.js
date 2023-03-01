import Sequelize, { Model } from 'sequelize';

class RevenueType extends Model {

    static init(sequelize) {
        super.init(
            {
                description: Sequelize.STRING,
                active: Sequelize.INTEGER,
            },
            {
                sequelize,
                freezeTableName: true,
                tableName: 'revenue_type',
            }
        );
        return this;
    }
}

export default RevenueType;
