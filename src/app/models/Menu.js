import Sequelize, { Model } from 'sequelize';

class Menu extends Model {

	static init(sequelize) {
		super.init(
			{
        name: Sequelize.STRING,
        url: Sequelize.STRING,
        icon: Sequelize.STRING,
        menu: Sequelize.INTEGER,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'menu',
      }
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.Menu, { as: 'children', foreignKey: 'menu' })
  }
}

export default Menu;