import Sequelize, { Model } from 'sequelize';

class PropositionType extends Model {

	static init(sequelize) {
		super.init(
			{
        description: Sequelize.STRING,
        active: Sequelize.INTEGER,  
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'proposition_type',
      }
    );
    return this;
  }
  static associate(models) {
    this.hasMany(models.PropositionTypeProposition, {foreignKey: 'proposition_type'})
    
  }
}

export default PropositionType;