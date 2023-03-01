import Sequelize, { Model } from 'sequelize';

class ExpenseTypeExpense extends Model {

	static init(sequelize) {
		super.init(
			{
        expense: Sequelize.INTEGER,
        type: Sequelize.INTEGER,
        active: Sequelize.INTEGER
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'expense_type_expense',
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Expense, { foreignKey: 'expense' })
    this.belongsTo(models.ExpenseType, { foreignKey: 'type' })
  }
}

export default ExpenseTypeExpense;
