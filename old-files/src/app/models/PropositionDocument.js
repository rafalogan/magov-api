import Sequelize, { Model } from 'sequelize';

class PropositionDocument extends Model {
    static init(sequelize) {
        super.init(
            {
                proposition: Sequelize.INTEGER,
                url: Sequelize.STRING,
                active: Sequelize.INTEGER,
            },
            {
                sequelize,
                freezeTableName: true,
                tableName: 'proposition_document',
            }


        );
        return this;
    }
    static associate(models) {
        this.belongsTo(models.Proposition, { foreignKey: 'proposition' })
    }
}

export default PropositionDocument;
