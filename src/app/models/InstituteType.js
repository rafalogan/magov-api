import Sequelize, { Model } from 'sequelize';

class InstituteType extends Model {

	static init(sequelize) {
		super.init(
			{
        name: Sequelize.STRING,
        active: Sequelize.INTEGER
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'institute_type',
      }
    );
    return this;
  }
}

export default InstituteType;