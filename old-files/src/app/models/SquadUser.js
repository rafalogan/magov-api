import Sequelize, { Model } from 'sequelize';

class SquadUser extends Model {

	static init(sequelize) {
		super.init(
			{
        squad: Sequelize.INTEGER,
        user: Sequelize.INTEGER,
        active: Sequelize.INTEGER
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'squad_user',
      }
    );
    return this;
  }
  
  static associate(models) {
    this.belongsTo(models.Squad, { foreignKey: 'squad' })
    this.belongsTo(models.User, { foreignKey: 'user' })
  }
}

export default SquadUser;