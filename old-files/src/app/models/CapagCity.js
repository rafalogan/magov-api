import Sequelize, { Model } from 'sequelize';

class CapagCity extends Model {

	static init(sequelize) {
		super.init(
			{
        city: Sequelize.STRING,
        uf: Sequelize.STRING,
        ibge_code: Sequelize.INTEGER,
        population: Sequelize.INTEGER,
        ind_1: Sequelize.DECIMAL(18,8),
        grade_1: Sequelize.STRING,
        ind_2: Sequelize.DECIMAL(18,8),
        grade_2: Sequelize.STRING,
        ind_3: Sequelize.DECIMAL(18,8),
        grade_3: Sequelize.STRING,
        grade_capag: Sequelize.STRING,
        active: Sequelize.INTEGER
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'city_capag',
      }
    );
    return this;
  }
}

export default CapagCity;
