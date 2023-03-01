import Sequelize, {
    Model
} from 'sequelize';

class Squad extends Model {

    static init(sequelize) {
        super.init({
            description: Sequelize.STRING,
            active: Sequelize.INTEGER
        }, {
            sequelize,
            freezeTableName: true,
            tableName: 'squad',
        });
        return this;
    }
    static associate(models) {
        this.hasMany(models.SquadUser, {
            foreignKey: 'squad'
        })
    }
}

export default Squad;
