import Sequelize, { Model } from 'sequelize';

class Unit extends Model {

    static init(sequelize) {
        super.init({
            federative_level: Sequelize.STRING,
            url: Sequelize.STRING,
            address: Sequelize.INTEGER,
            company: Sequelize.INTEGER,
            contact: Sequelize.INTEGER,
            active: Sequelize.INTEGER
        }, {
            sequelize,
            freezeTableName: true,
            tableName: 'unit',
        });

        return this;
    }
    static associate(models) {
        this.belongsTo(models.Contact, { foreignKey: 'contact' })
        this.belongsTo(models.Address, { foreignKey:  'address' })
        this.belongsTo(models.Company, { foreignKey: 'company' })
        this.hasOne(models.User, { foreignKey: 'unit' })
        }

}

export default Unit;
