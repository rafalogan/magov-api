import Sequelize, { Model } from 'sequelize';

class PaymentForm extends Model {

	static init(sequelize) {
		super.init(
			{
        description: Sequelize.STRING,
        active: Sequelize.INTEGER
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'payment_form',
      }
    );
    return this;
  }
}

export default PaymentForm;