import Sequelize, { Model } from 'sequelize';

class Goal extends Model {

	static init(sequelize) {
		super.init(
			{
        name: Sequelize.STRING,
        active: Sequelize.INTEGER
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'goal',
      }
    );
    return this;
  }
}

export default Goal;
