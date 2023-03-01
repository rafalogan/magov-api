import Sequelize, { Model } from 'sequelize';
class Person extends Model {

	static init(sequelize) {
		super.init(
			{
        name: Sequelize.STRING,
        birth_date: Sequelize.DATE,
        address: Sequelize.INTEGER,
        contact: Sequelize.INTEGER,
        active: Sequelize.INTEGER
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'person',
      }
    );
    return this;
  }

  static associate(models) {
    this.hasOne(models.PhysicalPerson, {foreignKey: 'person'})
    this.belongsTo(models.Address, { foreignKey: 'address' })
    this.belongsTo(models.Contact, {foreignKey: 'contact'})
    this.hasOne(models.Company, {foreignKey: 'person'})
  }
}

export default Person;
