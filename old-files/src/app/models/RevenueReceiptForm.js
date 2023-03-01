import Sequelize, { Model } from 'sequelize';

class RevenueReceiptForm extends Model {

    static init(sequelize) {
        super.init(
            {
                revenue: Sequelize.INTEGER,
                receipt_form: Sequelize.INTEGER,
                active: Sequelize.INTEGER,
            },
            {
                sequelize,
                freezeTableName: true,
                tableName: 'revenue_receipt_form',
            }
        );
        return this;
    }
    static associate(models) {
        this.belongsTo(models.Revenue, { foreignKey: 'revenue' })
        this.belongsTo(models.ReceiptForm, { foreignKey: 'revenue' })
    }
}

export default RevenueReceiptForm;
