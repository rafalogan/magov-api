import Sequelize, {
    Model
} from 'sequelize';

class DemandDocument extends Model {

    static init(sequelize) {
        super.init({
            demand: Sequelize.INTEGER,
            url: Sequelize.STRING,
            active: Sequelize.INTEGER,
        }, {
            sequelize,
            freezeTableName: true,
            tableName: 'demand_document',
        });
        return this;
    }
    static associate(models) {
        this.belongsTo(models.Demand, { foreignKey: 'demand' })

    }
}

export default DemandDocument;
