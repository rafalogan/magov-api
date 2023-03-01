import Sequelize, { Model } from "sequelize";

class CommentWarning extends Model {
    static init(sequelize) {
        super.init(
            {
                task: Sequelize.INTEGER,
                comment: Sequelize.STRING,
                active: Sequelize.INTEGER
            },
            {
                sequelize,
                freezeTableName: true,
                tableName: "comment_warning"
            }
        );
        return this;
    }
    static associate(models) {
        this.belongsTo(models.Task, { foreignKey: "task" });
    }
}

export default CommentWarning;
