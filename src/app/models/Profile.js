import Sequelize, { Model } from 'sequelize';

class Profile extends Model {

	static init(sequelize) {
		super.init(
			{
        description: Sequelize.STRING,
        active: Sequelize.INTEGER
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'profile',
      }
    );
    return this;
  }
}

export default Profile;
