import Sequelize, { Model } from 'sequelize';

class CommissionStatus extends Model {
    static init(sequelize) {
        super.init(
            {
                status: Sequelize.STRING,
                active: Sequelize.INTEGER
            },
            {
                sequelize,
                freezeTableName: true,
                tableName: 'commission_status'
            }
        );
        return this;
    }
}

export default CommissionStatus;
