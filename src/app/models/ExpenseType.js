import Sequelize, { Model } from 'sequelize';

class ExpenseType extends Model {

	static init(sequelize) {
		super.init(
			{
        description: Sequelize.STRING,
        active: Sequelize.INTEGER
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'expense_type',
      }
    );
    return this;
  }
}

export default ExpenseType;