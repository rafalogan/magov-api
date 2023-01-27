import Sequelize, { Model } from 'sequelize';

class PhysicalPerson extends Model {

    static init(sequelize) {
        super.init(
            {
                cpf: Sequelize.STRING,
                rg: Sequelize.STRING,
                person: Sequelize.INTEGER,
                company: Sequelize.INTEGER,
                active: Sequelize.INTEGER
            },
            {
                sequelize,
                freezeTableName: true,
                tableName: 'physical_person',
            }
        );
        return this;
    }

    static associate(models) {
        this.belongsTo(models.Company, { foreignKey: 'company' })
        this.belongsTo(models.Person, { foreignKey: 'person' })
        this.hasMany(models.TaskResponsible, { foreignKey: 'responsible' })
    }
}

export default PhysicalPerson;
