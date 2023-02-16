import Sequelize, { Model } from 'sequelize';

class Propositionkeyword extends Model {

    static init(sequelize) {
        super.init(
            {
                word: Sequelize.STRING,
                proposition: Sequelize.INTEGER,
                active: Sequelize.INTEGER,
            },
            {
                sequelize,
                freezeTableName: true,
                tableName: 'proposition_keyword',
            }
        );
        return this;
    }
    static associate(models) {
        this.belongsTo(models.Proposition, { foreignKey: 'proposition'})
    }
}

export default Propositionkeyword;
