import Sequelize, { Model } from 'sequelize';

class Theme extends Model {

	static init(sequelize) {
		super.init(
			{
        description: Sequelize.STRING,
        active: Sequelize.INTEGER
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'theme',
      }
    );
    return this;
  }
  static associate(models) {
    this.hasMany(models.Proposition, {foreignKey: 'id'})
    this.hasMany(models.Task, {foreignKey: 'theme'})
  }
}

export default Theme;
