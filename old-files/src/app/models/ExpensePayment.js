import Sequelize, { Model } from 'sequelize';

class ExpensePayment extends Model {
    static init(sequelize) {
        super.init(
            {
                expense: Sequelize.INTEGER,
                payment_form: Sequelize.INTEGER,
                active: Sequelize.INTEGER,
            },
            {
                sequelize,
                freezeTableName: true,
                tableName: 'expense_payment',
            }
        );
        return this;
    }
    static associate(models) {
        this.belongsTo(models.Expense, { foreignKey: 'expense' })
        this.belongsTo(models.PaymentForm, { foreignKey: 'payment_form' })
    }
    }
export default ExpensePayment;
