import Sequelize, { Model } from "sequelize";

class DocModel extends Model {
    static init(sequelize) {
        super.init(
            {
                title: Sequelize.STRING,
                html: Sequelize.STRING,
                proposition: Sequelize.INTEGER,
                active: Sequelize.INTEGER
            },
            {
                sequelize,
                freezeTableName: true,
                tableName: "doc_modelo"
            }
        );
        return this;
    }
    static associate(models) {
        this.belongsTo(models.Proposition, { foreignKey: "proposition" });
    }
}

export default DocModel;
