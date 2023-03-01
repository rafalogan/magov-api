import Sequelize, { Model } from 'sequelize';

class PaymentMethods extends Model {
    static init(sequelize) {
        super.init(
            {
                type: Sequelize.STRING,
                active: Sequelize.INTEGER
            },
            {
                sequelize,
                freezeTableName: true,
                tableName: 'payment_methods'
            }
        );
        return this;
    }
}

export default PaymentMethods;
