import Sequelize, { Model } from 'sequelize';

class PropositionTypeProposition extends Model {
    static init(sequelize) {
        super.init(
            {
                proposition: Sequelize.INTEGER,
                proposition_type: Sequelize.INTEGER,
                active: Sequelize.INTEGER,
            },
            {
                sequelize,
                freezeTableName: true,
                tableName: 'proposition_type_proposition',
            }
        );
        return this;
    }
    static associate(models) {
        this.belongsTo(models.Proposition, { foreignKey: 'proposition' })
        this.belongsTo(models.PropositionType, { foreignKey: 'proposition_type' })
    }
}

export default PropositionTypeProposition;
