import Sequelize, { Model } from 'sequelize';

class Expense extends Model {

	static init(sequelize) {
		super.init(
			{
        description: Sequelize.STRING,
        due_date: Sequelize.DATE,
        quantity: Sequelize.INTEGER,
        document_url: Sequelize.STRING,
        unit: Sequelize.INTEGER,
        value: Sequelize.DECIMAL(16,2),
        installments: Sequelize.INTEGER,
        observation: Sequelize.STRING,
        status: Sequelize.INTEGER,
        active: Sequelize.INTEGER
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'expense',
      }
    );
    return this;
  }

  static associate(models) {
    this.hasOne(models.Proposition, {foreignKey: 'expense' })
    this.hasMany(models.ExpenseCompany, {foreignKey: 'expense' })
    this.hasMany(models.RevenueOrigin, { foreignKey: 'expense' })
    this.hasMany(models.ExpensePayment, {foreignKey: 'expense'})
    this.hasMany(models.ExpenseTypeExpense, {foreignKey: 'expense'})
    this.belongsTo(models.Unit, {foreignKey: 'unit'})
}

}

export default Expense;
