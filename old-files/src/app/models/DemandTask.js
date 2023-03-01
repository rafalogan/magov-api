import Sequelize, {
    Model
} from 'sequelize';

class DemandTask extends Model {

    static init(sequelize) {
        super.init({
            demand: Sequelize.INTEGER,
            task: Sequelize.INTEGER,
            active: Sequelize.INTEGER,
        }, {
            sequelize,
            freezeTableName: true,
            tableName: 'demand_task',
        });
        return this;
    }
    static associate(models) {
        this.belongsTo(models.Demand, { foreignKey: 'demand' })
        this.belongsTo(models.Task, { foreignKey: 'task' })
    }
}

export default DemandTask;
