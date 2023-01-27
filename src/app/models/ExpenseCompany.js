import Sequelize, { Model } from 'sequelize';

class ExpenseCompany extends Model {

    static init(sequelize) {
        super.init(
            {
                company: Sequelize.INTEGER,
                expense: Sequelize.INTEGER,
                active: Sequelize.INTEGER,
            },
            {
                sequelize,
                freezeTableName: true,
                tableName: 'expense_company',
            }
        );
        return this;
    }

      static associate(models) {
          this.belongsTo(models.Expense, { foreignKey: 'expense' })
          this.belongsTo(models.Company, { foreignKey: 'company' })
      }
}

export default ExpenseCompany;
