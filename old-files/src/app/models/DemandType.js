import Sequelize, {
    Model
} from 'sequelize';

class DemandType extends Model {

    static init(sequelize) {
        super.init({
            description: Sequelize.STRING,
            active: Sequelize.INTEGER
        }, {
            sequelize,
            freezeTableName: true,
            tableName: 'demand_type',
        });
        return this;
    }
    static associate(models) {
        this.hasMany(models.DemandTypeDemand, {
            foreignKey: 'demand_type'
        })
    }

}

export default DemandType;
