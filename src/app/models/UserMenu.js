import Sequelize, { Model } from 'sequelize';

class UserMenu extends Model {

	static init(sequelize) {
		super.init(
			{
        menu: Sequelize.INTEGER,
        user: Sequelize.INTEGER,
        permission_read: Sequelize.INTEGER,
        permission_write: Sequelize.INTEGER,
        permission_delete: Sequelize.INTEGER
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'user_menu',
      }
    );
    return this;
  }
  
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user' })
    this.belongsTo(models.Menu, { foreignKey: 'menu' })
  }
}

export default UserMenu;