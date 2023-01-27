import Sequelize, { Model } from 'sequelize';

class PropositionTheme extends Model {

	static init(sequelize) {
		super.init(
			{
        proposition: Sequelize.INTEGER,
        theme: Sequelize.INTEGER,
        active: Sequelize.INTEGER
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'proposition_theme',
      }
    );
    return this;
  }
  static associate(models) {
    this.belongsTo(models.Proposition, {foreignKey: 'proposition'})
    this.belongsTo(models.Theme, { foreignKey: 'theme'})
}
}

export default PropositionTheme;
