import Sequelize, { Model } from 'sequelize';

class Origin extends Model {

    static init(sequelize) {
        super.init(
            {
                description: Sequelize.STRING,
                active: Sequelize.INTEGER,
            },
            {
                sequelize,
                freezeTableName: true,
                tableName: 'origin',
            }
        );
        return this;
    }
}

export default Origin;
