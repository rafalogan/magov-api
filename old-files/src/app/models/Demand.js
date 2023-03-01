import Sequelize, { Model } from 'sequelize';

class Demand extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                description: Sequelize.STRING,
                deadline: Sequelize.DATE,
                favorite: Sequelize.INTEGER,
                responsible: Sequelize.INTEGER,
                level: Sequelize.INTEGER,
                plaintiff: Sequelize.INTEGER,
                created_by: Sequelize.INTEGER,
                status: Sequelize.INTEGER,
                active: Sequelize.INTEGER,
                unit: Sequelize.INTEGER
            },
            {
                sequelize,
                freezeTableName: true,
                tableName: 'demand'
            }
        );

        return this;
    }
    static associate(models) {
        this.belongsTo(models.PhysicalPerson, { foreignKey: 'responsible' });
        this.belongsTo(models.User, { foreignKey: 'created_by' });
        this.belongsTo(models.Plaintiff, { foreignKey: 'plaintiff' });
        this.hasMany(models.DemandDocument, { foreignKey: 'demand' });
        this.hasMany(models.DemandGoal, { foreignKey: 'demand' });
        this.hasMany(models.DemandKeyword, { foreignKey: 'demand' });
        this.hasMany(models.DemandTask, { foreignKey: 'demand' });
        this.hasMany(models.DemandTypeDemand, { foreignKey: 'demand' });
        this.belongsTo(models.Unit, { as: 'unit-user', foreignKey: 'unit' });
    }
}

export default Demand;
