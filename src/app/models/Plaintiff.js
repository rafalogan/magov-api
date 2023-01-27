import Sequelize, { Model } from 'sequelize';

class Plaintiff extends Model {

  static init(sequelize) {
    super.init(
      {
        person: Sequelize.INTEGER,
        institute_type: Sequelize.INTEGER,
        institute_person: Sequelize.STRING,
        relationship_type: Sequelize.STRING,
        relatives: Sequelize.STRING,
        note: Sequelize.STRING,
        institute_representative: Sequelize.STRING,
        active: Sequelize.INTEGER,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'plaintiff',
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Person, { foreignKey: 'person' })
    this.belongsTo(models.InstituteType, { foreignKey: 'institute_type' })
    this.hasMany(models.Demand, { foreignKey: 'plaintiff' })
  }
}

export default Plaintiff;
