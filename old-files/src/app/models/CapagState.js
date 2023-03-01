import Sequelize, { Model } from 'sequelize';

class CapagState extends Model {

	static init(sequelize) {
		super.init(
			{
        uf: Sequelize.STRING,
        ind_1: Sequelize.FLOAT,
        ind_2: Sequelize.FLOAT,
        ind_3: Sequelize.FLOAT,
        grade_capag: Sequelize.STRING,
        active: Sequelize.INTEGER
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'state_capag',
      }
    );
    return this;
  }
}

export default CapagState;
