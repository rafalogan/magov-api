import Sequelize, { Model } from "sequelize";

class PaymentStatus extends Model {
    static init(sequelize) {
        super.init(
            {
                status: Sequelize.STRING,
                active: Sequelize.INTEGER
            },
            {
                sequelize,
                freezeTableName: true,
                tableName: "payment_status"
            }
        );
        return this;
    }
}

export default PaymentStatus;
