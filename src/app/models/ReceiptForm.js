import Sequelize, { Model } from 'sequelize';

class ReceiptForm extends Model {

	static init(sequelize) {
		super.init(
			{
        description: Sequelize.STRING,
        active: Sequelize.INTEGER
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'receipt_form',
      }
    );
    return this;
  }
}

export default ReceiptForm;