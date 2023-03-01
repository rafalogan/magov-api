import Sequelize, { Model } from 'sequelize';

class PropositionRelated extends Model {

    static init(sequelize) {
        super.init(
            {
                proposition: Sequelize.INTEGER,
                related: Sequelize.INTEGER,
                active: Sequelize.INTEGER,
            },
            {
                sequelize,
                freezeTableName: true,
                tableName: 'proposition_related'
            }
        );
        return this;
    }
    static associate(models) {
        this.belongsTo(models.Proposition, {  foreignKey: 'proposition'})
        this.belongsTo(models.Proposition, { foreignKey: 'related' })
    }
}

export default PropositionRelated;
