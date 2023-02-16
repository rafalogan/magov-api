import Sequelize, { Model } from 'sequelize';

class Company extends Model {

	static init(sequelize) {
		super.init(
			{
        person: Sequelize.INTEGER,
        cnpj: Sequelize.STRING,
        active: Sequelize.INTEGER
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'company',
      }
    );
    return this;
  }
  
  static associate(models) {
    this.belongsTo(models.Person, { foreignKey: 'person' })
    this.hasMany(models.Unit, {foreignKey: 'company'})
  }
}

export default Company;